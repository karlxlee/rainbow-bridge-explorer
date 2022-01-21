import addresses from "@/config/bridgeAddresses.json";
import Eth from "web3-eth";

import Web3Utils from "web3-utils";

const eth = new Eth(
  "wss://mainnet.infura.io/ws/v3/" + process.env.INFURA_PROJECT_ID
);

// Ethereum to bridge locker
export default async function fromEthereum(address) {
  let txList = [];
  let errors = [];

  try {
    // Eth transfers to Aurora and NEAR
    const ethData = await fetch(
      `https://api.etherscan.io/api?module=account&action=txlist&sort=desc&address=` +
        address +
        `&apikey=` +
        process.env.ETHERSCAN_KEY
    ).then((r) => r.json());
    if (ethData && ethData.message.includes("OK")) {
      for (let tx of ethData.result) {
        if (tx.to == addresses["ethereum"]["eth"]) {
          // Get the tx logs in order to find out the transfer destination
          const logs = await fetch(
            "https://mainnet.infura.io/v3/" + process.env.INFURA_PROJECT_ID,

            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: `{"jsonrpc":"2.0","method":"eth_getTransactionReceipt","params": ["${tx.hash}"],"id":1}`,
            }
          )
            .then((r) => r.json())
            .then((r) => r.result.logs);
          const logData = logs.filter(
            (entry) =>
              entry.address.toLowerCase() ==
              addresses["ethereum"]["eth"].toLowerCase()
          )[0];
          const types = [
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "string",
              name: "recipient",
              type: "string",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "fee",
              type: "uint256",
            },
          ];
          const decoded = eth.abi.decodeLog(
            types,
            logData.data,
            logData.topics.slice(1)
          );
          const recipient = JSON.parse(JSON.stringify(decoded, null)).recipient;

          if (recipient.includes("aurora:")) {
            tx["destination"] = "aurora";
            tx["recipient"] = recipient.split("aurora:")[1];
          } else {
            tx["destination"] = "near";
            try {
              tx["recipient"] = Web3Utils.hexToUtf8(tx.input);
            } catch {
              tx["recipient"] = "Invalid hex";
            }
          }

          tx["origin"] = "ethereum";
          txList.push(tx);
        }
      }
    } else {
      console.log(ethData.message);
      errors.push("Error fetching Ethereum data: " + ethData.message);
    }

    // Token transfers
    const tokenRes = await fetch(
      `https://api.etherscan.io/api?module=account&action=tokentx&sort=desc&address=` +
        address +
        `&apikey=` +
        process.env.ETHERSCAN_KEY
    );
    const tokenData = await tokenRes.json();
    if (tokenData && tokenData.message.includes("OK")) {
      for (let tx of tokenData.result) {
        if (
          tx.to.toLowerCase() == addresses["ethereum"]["erc20"].toLowerCase()
        ) {
          // Get the tx logs in order to find out the transfer destination
          const logs = await fetch(
            "https://mainnet.infura.io/v3/" + process.env.INFURA_PROJECT_ID,

            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: `{"jsonrpc":"2.0","method":"eth_getTransactionReceipt","params": ["${tx.hash}"],"id":1}`,
            }
          )
            .then((r) => r.json())
            .then((r) => r.result.logs);
          const logData = logs.filter(
            (entry) =>
              entry.address.toLowerCase() ==
              addresses["ethereum"]["erc20"].toLowerCase()
          )[0];
          const types = [
            {
              indexed: true,
              name: "token",
              type: "address",
            },
            {
              indexed: true,
              name: "sender",
              type: "address",
            },
            {
              indexed: false,
              name: "amount",
              type: "uint256",
            },
            {
              indexed: false,
              name: "accountId",
              type: "string",
            },
          ];
          const decoded = eth.abi.decodeLog(
            types,
            logData.data,
            logData.topics.slice(1)
          );
          const accountId = JSON.parse(JSON.stringify(decoded, null)).accountId;
          tx["origin"] = "ethereum";
          tx["destination"] = accountId.includes("aurora:") ? "aurora" : "near";
          txList.push(tx);
        }
      }
    } else {
      console.log(tokenData.message);
      errors.push("Error fetching Ethereum token data: " + tokenData.message);
    }

    return { tx: txList };
  } catch (error) {
    console.log(error);
    errors.push("Error fetching Ethereum data: " + error);
  }
}
