import addresses from "@/config/bridgeAddresses.json";
import Eth from "web3-eth";
import Web3Utils from "web3-utils";

const eth = new Eth(
  "wss://mainnet.infura.io/ws/v3/" + process.env.INFURA_PROJECT_ID
);

async function decodeToNearAddress(hex) {
  try {
    return Web3Utils.hexToUtf8(hex);
  } catch {
    return "Invalid hex";
  }
}
async function decodeToEthereumAddress(hex, abi, key) {
  try {
    const decoded = JSON.parse(
      JSON.stringify(eth.abi.decodeParameters(abi, hex), null)
    )[key];

    if (Web3Utils.isAddress(decoded)) {
      return decoded;
    } else {
      return "Invalid eth address";
    }
  } catch (error) {
    console.log(error);
    return "Invalid eth address";
  }
}

async function labelTransactions(transactions) {
  let finalTx = [];
  let errors = [];

  let fetchLogs = [];
  let txList = [];
  try {
    for (let tx of transactions) {
      tx["timestamp"] = tx["timeStamp"];
      tx["sender"] = tx["from"];

      if (
        [
          addresses["aurora"]["eth"]["toNear"],
          addresses["aurora"]["eth"]["toEthereum"],
          addresses["aurora"]["erc20"]["burn"],
        ].includes(tx.to.toLowerCase())
      ) {
        if (tx.logs) {
          txList.push(tx);
        } else {
          fetchLogs.push(tx);
        }
      }
    }
    console.log("Fetch logs length: " + fetchLogs.length);

    // Get all tx logs asynchronously
    await Promise.allSettled(
      fetchLogs.map(async (tx) => {
        const logsRes = await fetch(
          `https://explorer.mainnet.aurora.dev/api?module=transaction&action=gettxinfo&txhash=` +
            tx.hash
        ).then((r) => r.json());

        if (logsRes.message == "OK" && logsRes.result.logs) {
          txList.push({ ...tx, logs: logsRes.result.logs });
        } else {
          console.log(logsRes.message);
          errors.push("Aurora logs: " + logRes.message);
        }
      })
    );
    console.log("labeller txlist length: " + txList.length);

    // Determine the recipient of the transfer
    for (let tx of txList) {
      const to = tx.to.toLowerCase();
      let recipient;
      let destination;
      tx["origin"] = "aurora";

      // Eth transfers
      if (
        [
          addresses["aurora"]["eth"]["toNear"],
          addresses["aurora"]["eth"]["toEthereum"],
        ].includes(to)
      ) {
        for (let log of tx.logs) {
          if (
            log.topics[2].toLowerCase() ==
            "0x0000000000000000000000000000000000000000000000000000000000000000"
          ) {
            if (to == addresses["aurora"]["eth"]["toNear"]) {
              destination = "near";
              recipient = await decodeToEthereumAddress(tx.input);
            } else if (to == addresses["aurora"]["eth"]["toEthereum"]) {
              destination = "ethereum";
              recipient = await decodeToEthereumAddress(
                log.topics[3],
                [
                  {
                    name: "recipient",
                    type: "address",
                  },
                ],
                "recipient"
              );
            }
            tx["recipient"] = recipient;
            tx["destination"] = destination;
            tx["tokenName"] = "Ethereum";
            tx["tokenSymbol"] = "ETH";
            tx["tokenDecimal"] = "18";
            finalTx.push(tx);
          }
        }
      }
      // Token transfers (burns)
      // to == addresses["aurora"]["erc20"]["burn"]
      else if (to == addresses["aurora"]["erc20"]["burn"]) {
        for (let log of tx.logs) {
          if (
            log.address.toLowerCase() ==
            "0xe9217bc70b7ed1f598ddd3199e80b093fa71124f"
          ) {
            recipient = await decodeToNearAddress(tx.input);
            tx["destination"] = "near";
            tx["recipient"] = recipient;
            finalTx.push(tx);
          } else if (
            log.address.toLowerCase() ==
            "0xb0bd02f6a392af548bdf1cfaee5dfa0eefcc8eab"
          ) {
            recipient = await decodeToEthereumAddress(
              log.topics[3],
              [
                {
                  name: "recipient",
                  type: "address",
                },
              ],
              "recipient"
            );
            tx["destination"] = "ethereum";
            tx["recipient"] = recipient;
            finalTx.push(tx);
          } else {
            // This is not a rainbow bridge transfer
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    errors.push(JSON.stringify(error));
  }
  finalTx.sort((a, b) => b.blockNumber - a.blockNumber);
  return { tx: finalTx, errors: errors };
}

export async function auroraTxByAddress(address, startTimestamp, endTimestamp) {
  let txList = [];
  let errors = [];
  try {
    const allTx = await fetch(
      `https://explorer.mainnet.aurora.dev/api?module=account&action=txlist&starttimestamp=` +
        startTimestamp +
        `&endtimestamp=` +
        endTimestamp +
        `&sort=desc&address=` +
        address
    ).then((r) => r.json());

    if ((allTx.message = "OK")) {
      txList.push(...allTx.result);
    } else {
      console.log(allTx.message);
      errors.push(allTx.message);
    }

    const tokenTransfers = await fetch(
      `https://explorer.mainnet.aurora.dev/api?module=account&action=tokentx&starttimestamp=` +
        startTimestamp +
        `&endtimestamp=` +
        endTimestamp +
        `&sort=desc&address=` +
        address
    ).then((r) => r.json());
    if ((tokenTransfers.message = "OK")) {
      txList.push(...tokenTransfers.result);
    } else {
      console.log(tokenTransfers.message);
      errors.push(tokenTransfers.message);
    }
    console.log("length of txlist: " + txList.length);
    const labelled = await labelTransactions(txList);
    return {
      tx: labelled.tx,
      errors: errors.push(labelled.errors),
    };
  } catch (error) {
    console.log(error);
    errors.push(JSON.stringify(error));
    return {
      tx: txList,
      errors,
    };
  }
}

async function labelTransaction(transaction) {
  try {
    let tx = transaction;
    tx["timestamp"] = tx["timeStamp"];
    tx["sender"] = tx["from"];
    let to = tx.to.toLowerCase();
    let recipient;
    let destination;
    let errors = [];
    // Eth transfers
    if (
      [
        addresses["aurora"]["eth"]["toNear"],
        addresses["aurora"]["eth"]["toEthereum"],
      ].includes(tx.to.toLowerCase())
    ) {
      for (let log of tx.logs) {
        if (
          log.topics[2].toLowerCase() ==
          "0x0000000000000000000000000000000000000000000000000000000000000000"
        ) {
          if (to == addresses["aurora"]["eth"]["toNear"]) {
            destination = "near";
            recipient = await decodeToEthereumAddress(tx.input);
          } else if (to == addresses["aurora"]["eth"]["toEthereum"]) {
            destination = "ethereum";
            recipient = await decodeToEthereumAddress(
              log.topics[3],
              [
                {
                  name: "recipient",
                  type: "address",
                },
              ],
              "recipient"
            );
          }
          tx["origin"] = "aurora";
          tx["recipient"] = recipient;
          tx["destination"] = destination;
          tx["tokenName"] = "Ethereum";
          tx["tokenSymbol"] = "ETH";
          tx["tokenDecimal"] = "18";
          return { tx, errors };
        }
      }
    }
    // Token tx
    else {
      console.log("token tx");
      for (let log of tx.logs) {
        if (
          log.address.toLowerCase() ==
          "0xe9217bc70b7ed1f598ddd3199e80b093fa71124f"
        ) {
          recipient = await decodeToNearAddress(tx.input);
          console.log(recipient);
          tx["origin"] = "aurora";
          tx["destination"] = "near";
          tx["recipient"] = recipient;
          return { tx, errors };
        } else if (
          log.address.toLowerCase() ==
          "0xb0bd02f6a392af548bdf1cfaee5dfa0eefcc8eab"
        ) {
          console.log(log.topics);
          recipient = await decodeToEthereumAddress(
            log.topics[3],
            [
              {
                name: "recipient",
                type: "address",
              },
            ],
            "recipient"
          );

          tx["origin"] = "aurora";
          tx["destination"] = "ethereum";
          tx["recipient"] = recipient;
          return { tx, errors };
        } else {
          // This is not a rainbow bridge transfer
        }
      }
    }
  } catch (error) {
    console.log(error);
    errors.push(JSON.stringify(error));
    return { tx, errors };
  }
}
export async function auroraTxByHash(hash) {
  let tx = {};

  let errors = [];
  try {
    const txData = await fetch(
      `https://explorer.mainnet.aurora.dev/api?module=transaction&action=gettxinfo&txhash=` +
        hash
    ).then((r) => r.json());

    if (txData && txData.message == "OK") {
      tx = { ...txData.result };
      console.log(tx);

      // Check if the transaction is associated with a token transfer
      const tokenData = await fetch(
        `https://explorer.mainnet.aurora.dev/api?module=account&action=tokentx&address=` +
          txData.result.from +
          `&startblock` +
          txData.result.blockNumber +
          `&endblock` +
          txData.result.blockNumber
      ).then((r) => r.json());

      if ("result" in tokenData) {
        const tokenTransfer = tokenData.result.filter(
          (entry) => entry.hash == tx.hash
        )[0];
        if (tokenTransfer) {
          tx["tokenDecimal"] = tokenTransfer["tokenDecimal"];
          tx["tokenName"] = tokenTransfer["tokenName"];
          tx["tokenSymbol"] = tokenTransfer["tokenSymbol"];
          tx["value"] = tokenTransfer["value"];
        }
      }
      let labelled = await labelTransaction(tx);
      if (labelled.tx) {
        return {
          tx: { ...tx, ...labelled.tx },
          errors,
        };
      } else {
        return {
          tx,
          errors,
        };
      }
    } else {
      return { tx, errors };
    }
  } catch (error) {
    console.log(error);
    errors.push(JSON.stringify(error));
    return { tx, errors };
  }
}
