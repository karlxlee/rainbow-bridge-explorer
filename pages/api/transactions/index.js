import validateAddress from "@/utils/validateAddress";
import { nearTxByAddress } from "@/queries/near";
import { auroraTxByAddress } from "@/queries/aurora";
import { ethereumTxByAddress } from "@/queries/ethereum";

export async function transactions(address, from) {
  const routes = [
    { from: "near", useQuery: nearTxByAddress },
    { from: "aurora", useQuery: auroraTxByAddress },
    { from: "ethereum", useQuery: ethereumTxByAddress },
  ];
  const addressType = await validateAddress(address);
  console.log(addressType);
  if (from) {
    const queryRoute = routes.filter((entry) => entry.from == from)[0].useQuery;
    const { tx, errors } = await queryRoute(address);
    return { address, addressType, from, tx, errors };
  } else {
    let allTx = [];
    let allErrors = [];
    console.log(addressType);
    for (let type of addressType) {
      console.log(type);
      const queryRoute = routes.filter((entry) => entry.from == type)[0]
        .useQuery;
      const { tx, errors } = await queryRoute(address);
      errors &&
        errors.length &&
        errors.map(async (error) => allErrors.push(error));
      tx && tx.length && tx.map(async (entry) => allTx.push(entry));
    }
    return { address, addressType, tx: allTx, errors: allErrors };
  }
}

export default async function handler(req, res) {
  const { query, method } = req;
  console.log(query);
  switch (method) {
    case "GET":
      // Get data from your database
      try {
        const { tx, errors } = await transactions(query.address, query.from);
        res.status(200).json({
          address: query.address,
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
