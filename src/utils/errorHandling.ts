import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { hasKey } from "./types";

export const withApiErrorHandling = <T,>(handler: NextApiHandler<T>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    }
    catch (error) {
      res
        .status(hasKey(error, "statusCode") ? Number(error.statusCode) : 500)
        .json({ error: hasKey(error, "message") ? error.message : "Internal Server Error" });
    }
  };
};
