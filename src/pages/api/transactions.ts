import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { withApiErrorHandling } from "../../utils/errorHandling";
import { hasKey } from "../../utils/types";

type TypeValidator<T> = {
  validate: (value: unknown) => value is T,
  error: (key: string) => string
}

const numberValidator: TypeValidator<number> = {
  validate: (value: unknown): value is number => typeof value === "number",
  error: (key: string) => `${key} must be a number`
};

const stringValidator: TypeValidator<string> = {
  validate: (value: unknown): value is string => typeof value === "string",
  error: (key: string) => `${key} must be a string`
};

const uuidValidator: TypeValidator<string> = {
  validate: (value: unknown): value is string => typeof value === "string" &&
    value.length === 36 &&
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(value),
  error: (key: string) => `${key} must be a UUID`
};

const getValue = <T>(body: unknown, key: string, typeValidator: TypeValidator<T>): T => {
  if (!hasKey(body, key)) {
    throw new ApiError(400, `${key} is required`);
  }

  const value = body[key];
  if (!typeValidator.validate(value)) {
    throw new ApiError(400, typeValidator.error(key));
  }

  return value;
};

const getOptionalValue = <T>(body: unknown, key: string, typeValidator: TypeValidator<T>): T | undefined => {
  if (!hasKey(body, key)) {
    return undefined;
  }

  const value = body[key];
  if (!typeValidator.validate(value)) {
    throw new ApiError(400, typeValidator.error(key));
  }

  return value;
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    if (!req.session.user) {
      throw new ApiError(401, "You most be logged in to create a transaction");
    }

    const amount = getValue(req.body, "amount", numberValidator);
    const sinkId = getValue(req.body, "sinkId", uuidValidator);
    const description = getOptionalValue(req.body, "description", stringValidator);
    const storageId = getValue(req.body, "storageId", uuidValidator);

    const prisma = new PrismaClient();
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        description,
        sinkId,
        storageId,
        userId: req.session.user.id
      }
    });

    res.status(200).json(transaction);
  }
  else {
    res.status(405).send(null);
  }
};

export default withApiErrorHandling(withIronSessionApiRoute(handler, sessionSettings));
