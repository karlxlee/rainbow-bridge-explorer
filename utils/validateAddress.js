import Web3Utils from "web3-utils";

export default async function validateAddress(address) {
  // Strip address of whitespace
  const stripAddr = address.replace(/\s+/g, "");

  // Hexadecimal NEAR address
  const hex = /^[0-9a-fA-F]+$/;
  try {
    if (hex.test(stripAddr) && stripAddr.length == 64) {
      return ["near"];
    }
  } catch {}

  // Readable NEAR address
  try {
    if (stripAddr.split(".")[1].toLowerCase() == "near") {
      return ["near"];
    }
  } catch {}

  // Ethereum address
  try {
    if (Web3Utils.isAddress(stripAddr.toLowerCase())) {
      return ["ethereum", "aurora"];
    }
  } catch {}
  return "unclassified";
}
