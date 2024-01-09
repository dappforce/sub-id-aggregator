import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryUpdateSubscription } from './entities/historyUpdateSubscription.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AccountService } from '../entities/account/account.service';
import { AppConfig } from '../../config.module';
import { AccountAggregationFlowProducer } from '../queueProcessor/services/producers/accountAggregationFlow.producer';
import { SubIdAggregatorJobName } from '../../constants/queues';
import { CryptoUtils } from '../../utils/cryptoUtils';

@Injectable()
export class AccountSyncSchedulerService {
  constructor(
    @InjectRepository(HistoryUpdateSubscription)
    public readonly historyUpdateSubscriptionRepository: Repository<HistoryUpdateSubscription>,
    public readonly accountService: AccountService,
    public readonly accountAggregationFlowProducer: AccountAggregationFlowProducer,
    public readonly appConfig: AppConfig,
    public readonly cryptoUtils: CryptoUtils,
  ) {}

  getHistoryRenewJobId(publicKey: string): string {
    return `SCHEDULED_RENEW_${publicKey}`;
  }

  async getOrCreateHistoryUpdateSubEntity(publicKey: string) {
    let subEntity = await this.historyUpdateSubscriptionRepository.findOne({
      where: {
        account: {
          id: publicKey,
        },
      },
      relations: {
        account: true,
      },
    });

    if (subEntity) return subEntity;

    const account = await this.accountService.getOrCreateAccount(publicKey);
    subEntity = new HistoryUpdateSubscription();
    subEntity.account = account;
    subEntity.createdAt = new Date();
    subEntity.latestHistoryRequestAt = new Date();
    subEntity.updateIntervalMs =
      this.appConfig.AGGREGATOR_HISTORY_RENEW_INTERVAL_MS;

    await this.historyUpdateSubscriptionRepository.save(subEntity);

    return subEntity;
  }

  async createOrRenewAccountUpdateSubscription({
    publicKey,
  }: {
    publicKey: string;
  }) {
    const decoratedPublicKey = this.cryptoUtils.addressToHexIfNotHex(publicKey);
    const subscriptionData = await this.getOrCreateHistoryUpdateSubEntity(
      decoratedPublicKey,
    );

    if (!!subscriptionData.executedAt) return;
    // TODO implement changing updateIntervalMs if account's history is highly demanded

    await this.accountAggregationFlowProducer.enqueueTask({
      publicKey: decoratedPublicKey,
      jobName: SubIdAggregatorJobName.REFRESH_TX_HISTORY_FOR_ACCOUNT_SCHEDULED,
      jobOptions: {
        jobId: this.getHistoryRenewJobId(decoratedPublicKey),
        priority: 2,
        repeat: {
          every: this.appConfig.AGGREGATOR_HISTORY_RENEW_INTERVAL_MS,
          limit: 120_960, // 7 days with interval 5 sec
        },
      },
    });
  }
}
