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
  const type = await validateAddress(address);
  if (from) {
    const queryRoute = routes.filter((entry) => entry.from == from)[0].useQuery;
    const { tx, error } = await queryRoute(address);
    return { tx, error };
  }
}

export default async function handler(req, res) {
  const { query, method } = req;
  switch (method) {
    case "GET":
      // Get data from your database
      try {
        const { tx, error } = await transactions(query.address, query.from);
        if (error) {
          res.status(500).json({ error: "Failed to load data: " + error });
          break;
        }
        res.status(200).json({
          address: query.address,
          object: "list",
          data: tx,
        });
        // console.log(tx);
      } catch (error) {
        res.status(500).json({ error: "Failed to load data: " + error });
      }
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
