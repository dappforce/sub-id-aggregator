import { Injectable, NotFoundException } from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    public readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getOrCreateTransaction(txId: string): Promise<Transaction> {
    if (txId === null || !txId)
      throw new Error(`Transaction ID has unsupported value`);

    let tx = await this.transactionRepository.findOne({
      where: { id: txId },
    });

    if (tx) return tx;

    tx = new Transaction();
    tx.id = txId;

    await this.transactionRepository.save(tx);

    return tx;
  }
}
