import { Injectable, NotFoundException } from '@nestjs/common';
import { TransferNative } from './entities/transferNative.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TransferNativeService {
  constructor(
    @InjectRepository(TransferNative)
    public readonly transferNativeRepository: Repository<TransferNative>,
  ) {}

  async getOrCreateTransferNative(id: string): Promise<TransferNative> {
    if (id === null || !id) throw new Error(`Account ID has unsupported value`);

    let transferNative = await this.transferNativeRepository.findOne({
      where: { id },
    });

    if (transferNative) return transferNative;

    transferNative = new TransferNative();
    transferNative.id = id;

    await this.transferNativeRepository.save(transferNative);

    return transferNative;
  }
}
