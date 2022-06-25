import { NextApiRequest } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { TypeValidator } from "./apiValidators";
import { hasKey } from "./types";

export const getValue = <T>(body: unknown, key: string, typeValidator: TypeValidator<T>): T => {
  if (!hasKey(body, key)) {
    throw new ApiError(400, `${key} is required`);
  }

  const value = body[key];
  if (!typeValidator.validate(value)) {
    throw new ApiError(400, typeValidator.error(key));
  }

  return value;
};

export const getOptionalValue = <T>(body: unknown, key: string, typeValidator: TypeValidator<T>): T | undefined => {
  if (!hasKey(body, key)) {
    return undefined;
  }

  const value = body[key];
  if (!typeValidator.validate(value)) {
    throw new ApiError(400, typeValidator.error(key));
  }

  return value;
};

export const requireAuthentication = (req: NextApiRequest, message?: string) => {
  // TODO: Separate statuses 401, 403 and 404
  if (!req.session.user) {
    throw new ApiError(401, message || "You must be logged in to perform this action");
  }
};
