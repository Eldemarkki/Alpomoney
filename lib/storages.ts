import { PrismaClient } from "@prisma/client";

export const getAllStorages = async () => {
  const prisma = new PrismaClient();
  const storages = await prisma.storage.findMany();
  return storages;
}

export const createStorage = async (name: string, userId: string) => {
  const prisma = new PrismaClient();
  const created = await prisma.storage.create({
    data: {
      name,
      userId
    }
  });

  return created;
}