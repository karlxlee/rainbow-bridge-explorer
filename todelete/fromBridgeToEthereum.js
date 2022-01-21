import addresses from "@/config/bridge-addresses.json";

// Bridge locker to ethereum
export default async function fromBridgeToEth(address) {
  let txList = [];
  try {
    const ethRes = await fetch(
      `https://api.etherscan.io/api?module=account&action=tokentx&address=` +
        params.address +
        `&apikey=` +
        process.env.ETHERSCAN_KEY
    );
    const ethData = await ethRes.json();
    if (ethData && ethData.message.includes("OK")) {
      for (let tx of ethData.result) {
        if (tx.from == addresses["ethereum"]) {
          tx["origin"] = "bridge";
          tx["destination"] = "ethereum";
          txList.push(tx);
        }
      }
    } else {
      errors.push("Error fetching Ethereum data: " + ethData.message);
    }
    return txList;
  } catch (err) {
    errors.push("Data for Ethereum is down and currently unavailable");
  }
}
