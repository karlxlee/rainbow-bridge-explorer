import { ethereumRecentTx } from "@/queries/ethereum";

export async function recent() {
  const routes = [{ from: "ethereum", useQuery: ethereumRecentTx }];

  let allTx = [];
  let allErrors = [];
  for (let route of routes) {
    const { tx, errors } = await route.useQuery();
    console.log(tx);
    console.log(errors);

    errors &&
      errors.length &&
      errors.map(async (error) => allErrors.push(error));
    tx && tx.length && tx.map(async (entry) => allTx.push(entry));
  }
  return { tx: allTx, errors: allErrors };
}

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      // Get data from your database
      try {
        const { tx, errors } = await recent();
        res.status(200).json({
          object: "list",
          data: tx,
          errors,
        });
      } catch (error) {
        res.status(500).json({ errors: ["Failed to load data: " + error] });
      }
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
