export async function fetchBridgeTokenList() {
  console.log("calling fetchBridgeTokenList()");
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
        svgPath: imageFiles.filter(
          (entry) => entry.path.split(".svg")[0] == path.split(".json")[0]
        ).length
          ? imageFiles.filter(
              (entry) => entry.path.split(".svg")[0] == path.split(".json")[0]
            )[0].path
          : "",
      }))
  );
  const jsonRes = await Promise.allSettled(jsonFetches).then((r) =>
    r.filter(async (entry) => entry.status == "fulfilled")
  );
  const tokens = jsonRes.map((entry) => "value" in entry && entry.value);
  return tokens;
}

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      // Get data from your database
      try {
        const tokens = await fetchBridgeTokenList();
        res.status(200).json({
          object: "list",
          data: tokens,
          errors: [],
        });
      } catch (error) {
        res.status(500).json({ errors: ["Failed to load data: " + error] });
      }
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
