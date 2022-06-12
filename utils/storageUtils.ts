import { PrismaClient, Storage } from "@prisma/client";
import { StorageWithSum } from "../features/storagesSlice";

export const getStoragesWithSum = async (storages: Storage[], prisma: PrismaClient): Promise<StorageWithSum[]> => {
  // TODO: Fix this n+1 problem
  const storagesWithSum = await Promise.all(storages.map(async storage => {
    const sum = await prisma.transaction.aggregate({
      _sum: {
        amount: true
      },
      where: {
        storageId: storage.id
      }
    });

    return {
      ...storage,
      sum: (sum._sum.amount || 0) + (storage.startAmount || 0)
    }
  }))

  return storagesWithSum;
};