import { auroraTxByHash } from "@/queries/aurora";
import { nearTxByHash } from "@/queries/near";
import { ethereumTxByHash } from "@/queries/ethereum";

export async function transaction(hash) {
  const routes = [
    { from: "near", useQuery: nearTxByHash },
    { from: "aurora", useQuery: auroraTxByHash },
    { from: "ethereum", useQuery: ethereumTxByHash },
  ];

  for (let route of routes) {
    const { tx, errors } = await route.useQuery(hash);
    if (tx && Object.keys(tx).length === 0) {
    } else {
      return { tx, errors };
    }
  }
}

export default async function handler(req, res) {
  const { query, method } = req;
  const { tx, errors } = await transaction(query.hash);
  res.status(200).json({
    hash: query.hash,
    object: "transaction",
    data: tx,
    errors,
  });
}
