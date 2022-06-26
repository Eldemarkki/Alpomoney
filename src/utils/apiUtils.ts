import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { TypeValidator } from "./apiValidators";
import { hasKey } from "./types";

export enum StatusCodes {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405
}

export const BadRequestError = (message: string) => new ApiError(StatusCodes.BadRequest, message);
export const NotFoundError = (message: string) => new ApiError(StatusCodes.NotFound, message);

export const getValue = <T>(body: unknown, key: string, typeValidator: TypeValidator<T>): T => {
  if (!hasKey(body, key)) {
    throw BadRequestError(`Missing required parameter: ${key}`);
  }

  const value = body[key];
  if (!typeValidator.validate(value)) {
    throw BadRequestError(`Invalid value for parameter: ${typeValidator.error(key)}`);
  }

  return value;
};

export const getOptionalValue = <T>(body: unknown, key: string, typeValidator: TypeValidator<T>): T | undefined => {
  if (!hasKey(body, key)) {
    return undefined;
  }

  const value = body[key];
  if (!typeValidator.validate(value)) {
    throw BadRequestError(`Invalid value for parameter: ${typeValidator.error(key)}`);
  }

  return value;
};

export const requireAuthentication = (req: NextApiRequest, message?: string) => {
  // TODO: Separate statuses 401, 403 and 404
  if (!req.session.user) {
    throw new ApiError(StatusCodes.Unauthorized, message || "You must be logged in to perform this action");
  }
};

type SupportedResource = Uncapitalize<
  | typeof Prisma.ModelName.Sink
  | typeof Prisma.ModelName.Storage
  | typeof Prisma.ModelName.Transaction
  | typeof Prisma.ModelName.RecurringTransaction
>;

export const requireResourceAccess = async (
  userId: string,
  resourceId: string,
  resourceName: SupportedResource,
  prisma: PrismaClient,
  statusCode: StatusCodes = StatusCodes.BadRequest
) => {
  const resourceTable = prisma[resourceName];

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!(await resourceTable.findFirst({
    where: {
      id: resourceId,
      userId
    }
  }))) {
    throw new ApiError(statusCode, `No ${resourceName} found with ID ${resourceId}`);
  }
};
