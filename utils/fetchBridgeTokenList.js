const fetchBridgeTokenList = async () => {
  const tokensFolder =
    "https://raw.githubusercontent.com/aurora-is-near/bridge-assets/master/tokens";
  const tokensList = await fetch(
    "https://api.github.com/repos/aurora-is-near/bridge-assets/git/trees/273b7ed163321474d230ba9c846d460b5842e800"
  )
    .then((r) => r.json())
    .then((r) => r.tree);

  const jsonFiles = await tokensList.filter((entry) =>
    entry.path.includes(".json")
  );
  const imageFiles = tokensList.filter((entry) => entry.path.includes(".svg"));

  const jsonFetches = jsonFiles.map(({ path }) =>
    fetch(tokensFolder + "/" + path)
      .then((r) => r.json())
      .then((r) => ({
        path,
        ...r,
        symbol: path.includes("testnet") ? r.symbol + "_testnet" : r.symbol,
      }))
  );
  const jsonRes = await Promise.allSettled(jsonFetches).then((r) =>
    r.filter(async (entry) => entry.status == "fulfilled")
  );
  const tokens = jsonRes.map((entry) => entry.value);
  return tokens;
};

export default fetchBridgeTokenList;
