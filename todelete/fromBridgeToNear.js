// import { indexer, QueryTypes } from "@/utils/indexer";
// import tokens from "@/config/tokens.json";

// export default async function fromBridgeToNear(address) {
//   let txList = [];
//   try {
//     // Search token mints on NEAR for each token invididually to avoid a timing out megaquery
//     let tokenAddresses = tokens.map((token) => token.NEAR_ID);
//     // const getMints = Promise.allSettled(
//     // let queries = [];
//     for (let tokenAddress of tokenAddresses) {
//       console.log(tokenAddress);
//       await indexer.authenticate();
//       const tx = await indexer.query(
//         `
//         SELECT args FROM public.action_receipt_actions
//         WHERE receipt_predecessor_account_id = 'factory.bridge.near'
//         AND receipt_receiver_account_id = :tokenAddress
//         AND receipt_included_in_block_timestamp > 1642439560000000000
//         AND receipt_included_in_block_timestamp < 1642526464000000000
//         AND args->'args_json'->'account_id' = '"hung1029.near"'

//         `,
//         {
//           type: QueryTypes.SELECT,
//           replacements: {
//             address: address,
//             tokenAddress: tokenAddress,
//           },
//         }
//       );
//       console.log(tx);
//     }
//     // console.log(queries);
//     // );

//     // await indexer.query(
//     //   `
//     //     SELECT * FROM public.action_receipt_actions
//     //     WHERE receipt_predecessor_account_id = 'factory.bridge.near'
//     //     AND receipt_receiver_account_id = 'c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.factory.bridge.near'
//     //     AND args->'args_json'->'account_id' = '"hung1029.near"'
//     //     `,

//     //   SELECT * FROM public.action_receipt_actions
//     //   WHERE args->'args_json'->'account_id' = '"hung1029.near"'
//     //   LIMIT 10
//     //   WHERE receipt_predecessor_account_id = 'factory.bridge.near'
//     //   WITH factory_tx as (

//     //       SELECT * FROM public.receipts JOIN public.action_receipt_actions
//     //       ON public.action_receipt_actions.receipt_id = public.receipts.receipt_id
//     //       WHERE predecessor_account_id = 'event-relayer.near'
//     //       AND receiver_account_id = 'factory.bridge.near'
//     //   )
//     //   AND receipt_receiver_account_id IN :tokenAddresses
//     //   WHERE args->'args_json'->'account_id'::text like '%hung1029.near%'
//     // WHERE args ? 'account_id' AND args->'account_id' = "hung1029.near"
//     //   WHERE args.args_json."account_id" IS NOT NULL
//     //   WHERE JSON_VALUE(args.args_json, '$.account_id') = :address
//     // SELECT * FROM public.receipts JOIN public.action_receipt_actions
//     // ON public.action_receipt_actions.receipt_id = public.receipts.receipt_id
//     // WHERE predecessor_account_id = 'factory.bridge.near'
//     // WHERE receiver_account_id IN :tokenAddresses

//     //   {
//     //     replacements: {
//     //       address: address,
//     //       tokenAddresses: [tokens.map((token) => token.NEAR_ID)],
//     //     },
//     //   }
//     // );
//     // console.log("logging");
//     // console.log(receipts[0][0]);
//     // for (let tx of receipts[0]) {
//     //   if (
//     //     tx.args.args_json.account_id == address &&
//     //     tx.args.method_name == "mint" &&
//     //     tx.args.args_json.amount > 0
//     //   ) {
//     //     let tokenMeta;
//     //     for (let token of tokens) {
//     //       if (
//     //         token.NEAR_ID.toLowerCase() == tx.receiver_account_id.toLowerCase()
//     //       ) {
//     //         tokenMeta = token;
//     //       }
//     //     }
//     //     tx["origin"] = "bridge";
//     //     tx["destination"] = "near";
//     //     txList.push({
//     //       hash: tx.originated_from_transaction_hash,
//     //       value: tx.args.args_json.amount,
//     //       tokenDecimal: tokenMeta.DECIMAL,
//     //       tokenSymbol: tokenMeta.SYMBOL,
//     //       ...tx,
//     //     });
//     //   }
//     // }
//     return txList;
//   } catch (error) {
//     console.log(error);
//   }
// }
