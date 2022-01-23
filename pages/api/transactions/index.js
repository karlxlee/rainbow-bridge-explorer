import validateAddress from "@/utils/validateAddress";
import fromNear from "@/queries/fromNear";
import fromAurora from "@/queries/fromAurora";
import fromEthereum from "@/queries/fromEthereum";

export async function transactions(address, from) {
  const routes = [
    { from: "near", useQuery: fromNear },
    { from: "aurora", useQuery: fromAurora },
    { from: "ethereum", useQuery: fromEthereum },
  ];
  // Get the type of address
  const addressType = await validateAddress(address);
  if (from) {
    const queryRoute = routes.filter((entry) => entry.from == from)[0].useQuery;
    const { tx, errors } = await queryRoute(address);
    return { address, addressType, from, tx, errors };
  } else {
    let allTx = [];
    let allErrors = [];
    for (let type of addressType) {
      const queryRoute = routes.filter((entry) => entry.from == type)[0]
        .useQuery;
      const { tx, errors } = await queryRoute(address);
      errors &&
        errors.length &&
        errors.map(async (error) => allErrors.push(error));
      tx.length && tx.map(async (entry) => allTx.push(entry));
    }
    return { address, addressType, tx: allTx, errors: allErrors };
  }
}

export default async function handler(req, res) {
  const { query, method } = req;
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
