import Eth from "web3-eth";
import Web3Utils from "web3-utils";

const eth = new Eth(
  "wss://mainnet.infura.io/ws/v3/" + process.env.INFURA_PROJECT_ID
);

export default async function fromAurora(address) {
  let txList = [];
  let errors = [];
  try {
    // Get transfers of ether from Aurora to near

    const allTx = await fetch(
      `https://explorer.mainnet.aurora.dev/api?module=account&action=txlist&offset=100&sort=desc&address=` +
        address
    ).then((r) => r.json());
    // Filter through tx to find eth transfers to the bridge
    try {
      if (allTx && allTx.message == "OK") {
        let hashList = [];
        for (let tx of allTx.result) {
          if (
            // to near
            tx.to.toLowerCase() ==
              "0xe9217bc70b7ed1f598ddd3199e80b093fa71124f" ||
            // OR to eth
            tx.to.toLowerCase() == "0xb0bd02f6a392af548bdf1cfaee5dfa0eefcc8eab"
          ) {
            hashList.push(tx);
          }
        }
        await Promise.allSettled(
          hashList.map(async (tx) => {
            // Eth sent to NEAR via the bridge
            // Get transaction logs

            const logsRes = await fetch(
              `https://explorer.mainnet.aurora.dev/api?module=transaction&action=gettxinfo&txhash=` +
                tx.hash
            ).then((r) => r.json());

            if (logsRes && logsRes.message == "OK" && logsRes.result.logs) {
              // Check logs to see if they are eth transfers to bridge
              // Topic [2] is a 0x0... address
              for (let log of logsRes.result.logs) {
                if (
                  log.topics[2].toLowerCase() ==
                  "0x0000000000000000000000000000000000000000000000000000000000000000"
                ) {
                  let recipient;
                  let destination;

                  if (
                    tx.to.toLowerCase() ==
                    "0xe9217bc70b7ed1f598ddd3199e80b093fa71124f"
                  ) {
                    destination = "near";
                    try {
                      recipient = Web3Utils.hexToUtf8(tx.input);
                    } catch {
                      recipient = "Invalid hex";
                    }
                  } else if (
                    tx.to.toLowerCase() ==
                    "0xb0bd02f6a392af548bdf1cfaee5dfa0eefcc8eab"
                  ) {
                    destination = "ethereum";
                    const recipientTopic = log.topics[3];
                    try {
                      const recipientDecoded = JSON.parse(
                        JSON.stringify(
                          eth.abi.decodeParameters(
                            [
                              {
                                name: "recipient",
                                type: "address",
                              },
                            ],
                            recipientTopic
                          ),
                          null
                        )
                      ).recipient;

                      if (Web3Utils.isAddress(recipientDecoded)) {
                        recipient = recipientDecoded;
                      } else {
                        recipient = "Invalid eth address";
                      }
                    } catch (error) {
                      console.log(error);
                      recipient = "Invalid eth address";
                    }
                  }

                  tx["origin"] = "aurora";
                  tx["destination"] = destination;
                  tx["recipient"] = recipient;
                  tx["tokenName"] = "Ethereum";
                  tx["tokenSymbol"] = "ETH";
                  tx["tokenDecimal"] = "18";
                  txList.push(tx);
                }
              }
            }
          })
        );
      } else {
        errors.push(
          "Error fetching Aurora user account transfers data: " + allTx.message
        );
      }
    } catch (error) {
      errors.push(
        "Error fetching and processing Aurora ETH bridge transfers data: " +
          error
      );
      return {
        tx: txList,
        errors,
      };
    }

    // Get token burns
    const tokenTransfers = await fetch(
      `https://explorer.mainnet.aurora.dev/api?module=account&action=tokentx&sort=desc&offset=50&address=` +
        address
    ).then((r) => r.json());

    if (tokenTransfers && tokenTransfers.message == "OK") {
      let hashList = [];
      for (let tx of tokenTransfers.result) {
        if (tx.to == "0x0000000000000000000000000000000000000000") {
          // Get transaction logs for burns
          hashList.push(tx);
        }
      }

      await Promise.allSettled(
        hashList.map(async (tx) => {
          const logsRes = await fetch(
            `https://explorer.mainnet.aurora.dev/api?module=transaction&action=gettxinfo&txhash=` +
              tx.hash
          ).then((r) => r.json());

          if (logsRes && logsRes.message == "OK" && logsRes.result.logs) {
            // Check logs to see if they are bridge burns
            for (let log of logsRes.result.logs) {
              if (
                log.address.toLowerCase() ==
                "0xe9217bc70b7ed1f598ddd3199e80b093fa71124f"
              ) {
                // Seems to be to NEAR
                let recipient;
                try {
                  recipient = Web3Utils.hexToUtf8(tx.input);
                } catch {
                  recipient = "Invalid hex";
                }

                tx["origin"] = "aurora";
                tx["destination"] = "near";
                tx["recipient"] = recipient;

                txList.push(tx);
              } else if (
                log.address.toLowerCase() ==
                "0xb0bd02f6a392af548bdf1cfaee5dfa0eefcc8eab"
              ) {
                // Token bridge burn

                const recipientTopic = log.topics[3];
                const recipient = JSON.parse(
                  JSON.stringify(
                    eth.abi.decodeParameters(
                      [
                        {
                          name: "recipient",
                          type: "address",
                        },
                      ],
                      recipientTopic
                    ),
                    null
                  )
                ).recipient;

                if (Web3Utils.isAddress(recipient)) {
                  tx["origin"] = "aurora";
                  tx["destination"] = "ethereum";
                  tx["recipient"] = recipient;
                  txList.push(tx);
                }
              }
            }
          }
        })
      );
    } else {
      errors.push(
        "Error fetching Aurora user account token transfers data: " +
          tokenTransfers.message
      );
      return {
        tx: txList,
        errors,
      };
    }
    return { tx: txList };
  } catch (error) {
    errors.push(
      "Error fetching and processing Aurora bridge token transfers data: " +
        error
    );
    return {
      tx: txList,
      errors,
    };
  }
}
