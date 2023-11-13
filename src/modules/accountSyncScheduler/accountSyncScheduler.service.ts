import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryUpdateSubscription } from './entities/historyUpdateSubscription.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AccountService } from '../entities/account/account.service';
import { AppConfig } from '../../config.module';
import { AccountAggregationFlowProducer } from '../queueProcessor/services/producers/accountAggregationFlow.producer';
import { SubIdAggregatorJobName } from '../../constants/queues';

@Injectable()
export class AccountSyncSchedulerService {
  constructor(
    @InjectRepository(HistoryUpdateSubscription)
    public readonly historyUpdateSubscriptionRepository: Repository<HistoryUpdateSubscription>,
    public readonly accountService: AccountService,
    public readonly accountAggregationFlowProducer: AccountAggregationFlowProducer,
    public readonly appConfig: AppConfig,
  ) {}

  getHistoryRenewJobId(address: string): string {
    return `SCHEDULED_RENEW_${address}`;
  }

  async getOrCreateHistoryUpdateSubEntity(address: string) {
    let subEntity = await this.historyUpdateSubscriptionRepository.findOne({
      where: {
        account: {
          id: address,
        },
      },
      relations: {
        account: true,
      },
    });

    if (subEntity) return subEntity;

    const account = await this.accountService.getOrCreateAccount(address);
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
    address,
  }: {
    address: string;
  }) {
    const subscriptionData = await this.getOrCreateHistoryUpdateSubEntity(
      address,
    );

    if (!!subscriptionData.executedAt) return;
    // TODO implement changing updateIntervalMs if account's history is highly demanded

    await this.accountAggregationFlowProducer.enqueueTask({
      publicKey: address,
      jobName: SubIdAggregatorJobName.REFRESH_TX_HISTORY_FOR_ACCOUNT_SCHEDULED,
      jobOptions: {
        jobId: this.getHistoryRenewJobId(address),
        repeat: {
          every: this.appConfig.AGGREGATOR_HISTORY_RENEW_INTERVAL_MS,
          limit: 120_960, // 7 days with interval 5 sec
        },
      },
    });
  }
}
