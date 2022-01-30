import { indexer, QueryTypes } from "@/utils/indexer";
import tokens from "@/config/tokens.json";

async function labelTransactions(transactions) {
  let txList = [];
  for (let tx of transactions) {
    tx["blockHash"] = tx["included_in_block_hash"];
    tx["sender"] = tx["predecessor_account_id"];
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
        timestamp: Math.round(
          parseInt(tx.receipt_included_in_block_timestamp / 10e8)
        ),
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
        timestamp: Math.round(
          parseInt(tx.receipt_included_in_block_timestamp / 10e8)
        ),
        value: tx.args.args_json.amount,
        tokenDecimal: tokenMeta.DECIMAL,
        tokenSymbol: tokenMeta.SYMBOL,
        ...tx,
      });
    }
  }
  console.log(txList);
  return txList;
}

export async function nearTxByAddress(address) {
  let txList = [];
  let errors = [];
  try {
    const receipts = await indexer.query(
      `
        SELECT * FROM public.receipts JOIN public.action_receipt_actions
        ON public.action_receipt_actions.receipt_id = public.receipts.receipt_id
        WHERE predecessor_account_id = :address
        AND receiver_account_id IN :tokenAddresses
        ORDER BY included_in_block_timestamp DESC
        LIMIT 200
        `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          address: address,
          tokenAddresses: [tokens.map((token) => token.NEAR_ID)],
        },
      }
    );
    txList = await labelTransactions(receipts);
    return { tx: txList, errors };
  } catch (error) {
    if (error.name == "SequelizeConnectionError") {
      errors.push("Near Indexer is too busy and can't provide data");
    } else {
      errors.push(JSON.stringify(error));
    }
    return { tx: txList, errors };
  }
}

export async function nearRecentTx() {
  let txList = [];
  let errors = [];
  try {
    const receipts = await indexer.query(
      `
        SELECT * FROM public.receipts JOIN public.action_receipt_actions
        ON public.action_receipt_actions.receipt_id = public.receipts.receipt_id
        AND receiver_account_id IN :tokenAddresses
        ORDER BY included_in_block_timestamp DESC
        LIMIT 50
        `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          tokenAddresses: [tokens.map((token) => token.NEAR_ID)],
        },
      }
    );
    txList = await labelTransactions(receipts);
    return { tx: txList, errors };
  } catch (error) {
    if (error.name == "SequelizeConnectionError") {
      errors.push("Near Indexer is too busy and can't provide data");
    } else {
      errors.push(JSON.stringify(error));
    }
    return { tx: txList, errors };
  }
}

export async function nearTxByHash(hash) {
  let tx = {};
  let errors = [];
  try {
    const receipts = await indexer.query(
      `
        SELECT * FROM public.receipts 
        JOIN public.action_receipt_actions
        ON public.action_receipt_actions.receipt_id = public.receipts.receipt_id
        JOIN public.execution_outcomes
        ON public.action_receipt_actions.receipt_id = public.execution_outcomes.receipt_id
        JOIN public.transactions
        ON originated_from_transaction_hash = transaction_hash
        WHERE originated_from_transaction_hash = :hash
        AND args->'method_name' IS NOT NULL
        ORDER BY included_in_block_timestamp DESC
        `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          hash: hash,
        },
      }
    );
    if (receipts.length) {
      tx = await labelTransactions(receipts);
      console.log(tx);
      console.log("success");
      return { tx: tx[0], errors };
    } else {
      return { tx, errors };
    }
  } catch (error) {
    if (error.name == "SequelizeConnectionError") {
      errors.push("Near Indexer is too busy and can't provide data");
    } else {
      console.log(error);
      errors.push(JSON.stringify(error));
    }
    return { tx: tx, errors };
  }
}
