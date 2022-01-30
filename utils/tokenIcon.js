const tokenIcon = (tokenSymbol) => {
  let icon;
  if (!tokenSymbol) {
    icon = undefined;
  } else if (tokenSymbol.toUpperCase() == "NEAR") {
    icon = "/near-icon.svg";
  } else if (["WETH", "WMATIC"].includes(tokenSymbol)) {
    icon =
      "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@d5c68edec1f5eaec59ac77ff2b48144679cebca1/svg/color/" +
      tokenSymbol.substring(1).toLowerCase() +
      ".svg";
  } else if (tokenSymbol && tokenSymbol[0] == "n" && tokenSymbol.length >= 4) {
    icon =
      "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@d5c68edec1f5eaec59ac77ff2b48144679cebca1/svg/color/" +
      tokenSymbol.substring(1).toLowerCase() +
      ".svg";
  } else {
    icon =
      "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@d5c68edec1f5eaec59ac77ff2b48144679cebca1/svg/color/" +
      tokenSymbol.toLowerCase() +
      ".svg";
  }
  return icon;
};

export default tokenIcon;
