import { NextApiHandler } from "next";
import { createSink, getAllSinks } from "../../lib/sinks";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    const sinks = getAllSinks();
    res.status(200).json(sinks);
  }
  else if (req.method === "POST") {
    const { body } = req;

    if (!body.name) {
      return res.status(400).json({
        error: "Name is required"
      });
    }

    const sink = createSink(body.name);

    res.status(200).json(sink);
  }
  else {
    res.status(405).send(null);
  }
};

export default handler;