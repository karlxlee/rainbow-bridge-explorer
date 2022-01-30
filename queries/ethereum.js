import addresses from "@/config/bridgeAddresses.json";
import Eth from "web3-eth";
import Web3Utils from "web3-utils";
var etherscanApi = require("etherscan-api").init(process.env.ETHERSCAN_KEY);

const eth = new Eth(
  "wss://mainnet.infura.io/ws/v3/" + process.env.INFURA_PROJECT_ID
);

async function decodeTokenRecipient(logs) {
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
  const destination = accountId.includes("aurora:") ? "aurora" : "near";

  const recipient = accountId.replace("aurora:", "");
  return { recipient, destination };
}

async function decodeEthRecipient(logs) {
  const logData = logs.filter(
    (entry) =>
      entry.address.toLowerCase() == addresses["ethereum"]["eth"].toLowerCase()
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
  const accountId = JSON.parse(JSON.stringify(decoded, null)).recipient;

  let destination;
  let recipient;

  if (accountId.includes("aurora:")) {
    destination = "aurora";
    recipient = accountId.replace("aurora:", "");
  } else {
    destination = "near";
    try {
      recipient = Web3Utils.hexToUtf8(tx.input);
    } catch {
      recipient = "Invalid hex";
    }
  }
  return { destination, recipient };
}

// Ethereum to bridge locker
export async function ethereumTxByAddress(address, offset) {
  let txList = [];
  let errors = [];

  const ethEndpoint = offset
    ? "https://api.etherscan.io/api?module=account&action=txlist&page=1&offset=" +
      offset +
      "&sort=desc&address="
    : "https://api.etherscan.io/api?module=account&action=txlist&sort=desc&address=";

  const tokenEndpoint = offset
    ? "https://api.etherscan.io/api?module=account&action=tokentx&page=1&offset=" +
      offset +
      "&sort=desc&address="
    : "https://api.etherscan.io/api?module=account&action=tokentx&sort=desc&address=";

  try {
    // Eth transfers to Aurora and NEAR

    const ethData = await fetch(
      ethEndpoint + address + `&apikey=` + process.env.ETHERSCAN_KEY
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

          const { destination, recipient } = await decodeEthRecipient(logs);

          tx["destination"] = destination;
          tx["recipient"] = recipient;
          tx["timestamp"] = tx["timeStamp"];
          tx["origin"] = "ethereum";
          tx["tokenName"] = "Ethereum";
          tx["tokenSymbol"] = "ETH";
          tx["tokenDecimal"] = "18";
          txList.push(tx);
        }
      }
    } else {
      errors.push("Error fetching Ethereum data: " + ethData.message);
    }

    // Token transfers

    const tokenRes = await fetch(
      tokenEndpoint + address + `&apikey=` + process.env.ETHERSCAN_KEY
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
          tx["origin"] = "ethereum";
          tx["timestamp"] = tx["timeStamp"];
          const { recipient, destination } = await decodeTokenRecipient(logs);
          tx["recipient"] = recipient;
          tx["destination"] = destination;
          txList.push(tx);
        }
      }
    } else {
      errors.push("Error fetching Ethereum token data: " + tokenData.message);
    }

    return { tx: txList, errors };
  } catch (error) {
    errors.push("Error fetching Ethereum data: " + error);
    return {
      tx: txList,
      errors,
    };
  }
}

export async function ethereumRecentTx() {
  let txList = [];
  let errors = [];

  let ethTx = await ethereumTxByAddress(addresses["ethereum"]["eth"], 10);
  let tokenTx = await ethereumTxByAddress(addresses["ethereum"]["erc20"], 10);
  txList = [...ethTx.tx, ...tokenTx.tx];
  txList.sort((a, b) => b.blockNumber - a.blockNumber);

  return {
    tx: txList,
    errors,
  };
}

export async function ethereumTxByHash(hash) {
  let tx = {};
  let errors = [];
  const res = await etherscanApi.proxy.eth_getTransactionByHash(hash);
  if (res.result && Object.keys(res.result).length) {
    let data = res.result;
    console.log("ts");
    console.log(data.timeStamp);

    tx["origin"] = "ethereum";
    const logs = await fetch(
      "https://mainnet.infura.io/v3/" + process.env.INFURA_PROJECT_ID,

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: `{"jsonrpc":"2.0","method":"eth_getTransactionReceipt","params": ["${hash}"],"id":1}`,
      }
    )
      .then((r) => r.json())
      .then((r) => r.result.logs);

    if (data.to.toLowerCase() == addresses["ethereum"]["erc20"].toLowerCase()) {
      // Get the erc20 token transfer details
      const tokenTransferRecords = await etherscanApi.account
        .tokentx(
          data.from,
          "",
          parseInt(data.blockNumber) - 1,
          parseInt(data.blockNumber) + 1,
          "desc"
        )
        .then((r) => r.result);
      const tokenTransfer = tokenTransferRecords.filter(
        (entry) => entry.hash == data.hash
      )[0];

      const { recipient, destination } = await decodeTokenRecipient(logs);
      tx = {
        ...data,
        ...tokenTransfer,
        logs: logs,
        sender: data.from,
        recipient,
        destination,
        ...tx,
      };
      tx["timestamp"] = tx["timeStamp"];
    } else if (data.to == addresses["ethereum"]["eth"]) {
      // Need to get the transaction off of etherscan unwrapped api in order to get timestamp
      const txObject = await fetch(
        `https://api.etherscan.io/api?module=account&action=txlist&address=` +
          data.from +
          `&startblock=` +
          (parseInt(data.blockNumber) - 1).toString() +
          `&endblock=` +
          (parseInt(data.blockNumber) + 1).toString() +
          `&page=1&sort=desc&apikey=` +
          process.env.ETHERSCAN_KEY
      )
        .then((r) => r.json())
        .then((r) => r.result[0]);
      tx["timestamp"] = txObject["timeStamp"];

      console.log(txObject);

      tx["logs"] = logs;
      tx["sender"] = data.from;
      const { destination, recipient } = await decodeEthRecipient(logs);
      tx["destination"] = destination;
      tx["recipient"] = recipient;

      tx["origin"] = "ethereum";
      tx["tokenName"] = "Ethereum";
      tx["tokenSymbol"] = "ETH";
      tx["tokenDecimal"] = "18";

      tx = { ...tx, ...data };
    }

    return { tx, errors };
  }
}
