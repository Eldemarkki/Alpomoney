import { PrismaClient } from "@prisma/client";

export const getTransactionSum = async (storageId: string, prisma: PrismaClient): Promise<number> => {
  const sum = await prisma.transaction.aggregate({
    _sum: {
      amount: true
    },
    where: {
      storageId
    }
  });

  return sum._sum.amount || 0;
};

export const getTransactionSums = async (storageIds: string[], prisma: PrismaClient) => {
  const sums: Record<string, number> = {};
  for (const storageId of storageIds) {
    sums[storageId] = await getTransactionSum(storageId, prisma);
  }
  return sums;
}

export const getRecurringMonthlyExpenses = async (storageId: string, prisma: PrismaClient): Promise<number> => {
  const monthlyExpenses = await prisma.recurringTransaction.aggregate({
    where: {
      storageId
    },
    _sum: {
      amount: true
    }
  });

  return monthlyExpenses._sum.amount || 0;
};

export const getRecurringMonthlyExpensesMultiple = async (storageIds: string[], prisma: PrismaClient) => {
  const monthlyExpenses: Record<string, number> = {};
  for (const storageId of storageIds) {
    monthlyExpenses[storageId] = await getRecurringMonthlyExpenses(storageId, prisma);
  }
  return monthlyExpenses;
}