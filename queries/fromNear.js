import { indexer, QueryTypes } from "@/utils/indexer";
import tokens from "@/config/tokens.json";

export default async function fromNear(address) {
  let txList = [];
  try {
    const receipts = await indexer.query(
      `
        SELECT * FROM public.receipts JOIN public.action_receipt_actions
        ON public.action_receipt_actions.receipt_id = public.receipts.receipt_id
        WHERE predecessor_account_id = :address
        AND receiver_account_id IN :tokenAddresses
        ORDER BY included_in_block_timestamp DESC
        LIMIT 10
        `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          address: address,
          tokenAddresses: [tokens.map((token) => token.NEAR_ID)],
        },
      }
    );
    for (let tx of receipts) {
      if (
        // Withdraws to ethereum
        tx.args.method_name.toLowerCase() == "withdraw" &&
        tx.args.args_json.amount > 0
      ) {
        let tokenMeta;
        for (let token of tokens) {
          if (
            token.NEAR_ID.toLowerCase() == tx.receiver_account_id.toLowerCase()
          ) {
            tokenMeta = token;
          }
        }
        tx["origin"] = "near";
        tx["destination"] = "ethereum";
        tx["recipient"] = "0x" + tx.args.args_json.recipient.toLowerCase();
        txList.push({
          hash: tx.originated_from_transaction_hash,
          value: tx.args.args_json.amount,
          tokenDecimal: tokenMeta.DECIMAL,
          tokenSymbol: tokenMeta.SYMBOL,
          ...tx,
        });
      } else if (
        // Transfers to Aurora
        tx.args.method_name.toLowerCase() == "ft_transfer_call" &&
        tx.args.args_json.amount > 0 &&
        tx.args.args_json.receiver_id.toLowerCase() == "aurora"
      ) {
        let tokenMeta;
        for (let token of tokens) {
          if (
            token.NEAR_ID.toLowerCase() == tx.receiver_account_id.toLowerCase()
          ) {
            tokenMeta = token;
          }
        }
        tx["origin"] = "near";
        tx["destination"] = "aurora";
        tx["recipient"] = "0x" + tx.args.args_json.msg.toLowerCase();
        txList.push({
          hash: tx.originated_from_transaction_hash,
          value: tx.args.args_json.amount,
          tokenDecimal: tokenMeta.DECIMAL,
          tokenSymbol: tokenMeta.SYMBOL,
          ...tx,
        });
      }
    }

    return { tx: txList };
  } catch (error) {
    return { tx: txList, error };
  }
}
