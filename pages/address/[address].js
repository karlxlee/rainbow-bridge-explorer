import Head from "next/head";
import Page from "@/components/Page";
import TxCard from "@/components/TxCard";
import {
  Box,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

export default function Address(props) {
  return (
    <Page>
      <Head>
        <title>Rainbow Bridge Explorer</title>

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Heading>{props.address}</Heading>
      </Box>
      <Box>
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Trends</Tab>
            <Tab>Score</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <p>one!</p>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      {props.bridgeTx.map((tx) => (
        <TxCard key={tx.hash} {...tx} />
      ))}
    </Page>
  );
}

export async function getStaticProps({ params }) {
  const res = await fetch(
    `https://explorer.mainnet.aurora.dev/api?module=account&action=tokentx&address=` +
      params.address
  );
  const data = await res.json();
  let bridgeTx = [];
  let tokenTx = [];
  let nativeTx = [];
  if (data && data.message == "OK") {
    for (let tx of data.result) {
      if (tx.to == "0x0000000000000000000000000000000000000000") {
        tx["origin"] = "aurora";
        tx["destination"] = "bridge";
        bridgeTx.push(tx);

        if (tx.input.includes("0x8d32caf4")) {
          tokenTx.push(tx);
        } else if (tx.input.includes("0x6b351848")) {
          nativeTx.push(tx);
        }
      }
    }
  }
  return {
    props: {
      address: params.address,
      bridgeTx,
      tokenTx,
      nativeTx,
    }, // will be passed to the page component as props
  };
}

export async function getStaticPaths() {
  // Get the paths we want to pre-render based on posts
  const paths = [
    {
      params: { address: "0xbC042F45f9eBfF86fCaAd0869cA169Dc671C0826" },
    },
  ];

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: "blocking" };
}
