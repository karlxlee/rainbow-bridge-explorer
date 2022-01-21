// deno run --allow-net --allow-read --unstable db-api.js
import { Client } from "https://deno.land/x/postgres/mod.ts";

const client = new Client(
  "postgres://public_readonly:nearprotocol@mainnet.db.explorer.indexer.near.dev/mainnet_explorer?sslmode=disable"
);
await client.connect();

const buildQuery = (
  predecessorAccountId,
  receiverAccountId,
  fromBlock,
  toBlock
) => {
  return `SELECT public.receipts.originated_from_transaction_hash, public.action_receipt_actions.args
    FROM public.receipts
    JOIN public.action_receipt_actions
    ON public.action_receipt_actions.receipt_id = public.receipts.receipt_id
    WHERE (
      predecessor_account_id = '${predecessorAccountId}'
      AND receiver_account_id = '${receiverAccountId}'
      AND included_in_block_timestamp > ${fromBlock}
      ${
        toBlock !== "latest"
          ? "AND included_in_block_timestamp < " + toBlock
          : ""
      }
    )`;
};

{
  const result =
    await client.queryArray(`SELECT * FROM public.receipts JOIN public.action_receipt_actions
    ON public.action_receipt_actions.receipt_id = public.receipts.receipt_id
    WHERE predecessor_account_id = 'lasshtu.near'
    AND receiver_account_id = 'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near'`);
  console.log(result.rows); // [[1, 'Carlos'], [2, 'John'], ...]
}

// {
//   const result =
//     await client.queryArray`SELECT ID, NAME FROM PEOPLE WHERE ID = ${1}`;
//   console.log(result.rows); // [[1, 'Carlos']]
// }

// {
//   const result = await client.queryObject("SELECT ID, NAME FROM PEOPLE");
//   console.log(result.rows); // [{id: 1, name: 'Carlos'}, {id: 2, name: 'Johnru'}, ...]
// }

// {
//   const result =
//     await client.queryObject`SELECT ID, NAME FROM PEOPLE WHERE ID = ${1}`;
//   console.log(result.rows); // [{id: 1, name: 'Carlos'}]
// }

await client.end();
