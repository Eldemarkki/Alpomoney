import { PrismaClient } from "@prisma/client";

export const getAllSinks = async () => {
  const prisma = new PrismaClient();
  const sinks = await prisma.sink.findMany();
  return sinks;
}

export const createSink = async (name: string) => {
  const prisma = new PrismaClient();
  const created = await prisma.sink.create({
    data: {
      name
    }
  });
  return created;
}
