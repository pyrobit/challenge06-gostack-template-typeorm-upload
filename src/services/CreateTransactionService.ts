import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    // prevent outcome transaction when no funds available in balance
    const { total } = await transactionsRepository.getBalance();
    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance funds');
    }

    // check category exists
    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });
    // if category does not exist, create category in db and return id
    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(transactionCategory);
    }

    // if exists return the id

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}
export default CreateTransactionService;
