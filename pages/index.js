import Head from "next/head";
import Page from "@/components/Page";
import Hero from "@/components/Hero";
import TxCard from "@/components/TxCard";
import AssetCard from "@/components/AssetCard";
import { Grid, GridItem, Stack, Heading } from "@chakra-ui/react";

import { recent } from "@/api/transactions/recent";
import { fetchBridgeTokenList } from "@/api/assets/index.js";

export default function Home(props) {
  return (
    <Page>
      <Head>
        <title>Rainbow Bridge Explorer</title>
        <meta
          name="description"
          content="Explore your activity on Rainbow Bridge"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
      <Grid templateColumns={"repeat(2, 1fr)"} gap={2}>
        <GridItem colSpan={{ sm: 2, md: 2, lg: 1 }}>
          <Heading py={8} as="h3" size="md">
            Recent transactions from NEAR
          </Heading>
          <Stack>
            {props.tx.near &&
              props.tx.near.map((tx) => (
                <TxCard key={tx.hash} clickable={true} {...tx} />
              ))}
          </Stack>
        </GridItem>
        <GridItem colSpan={{ sm: 2, md: 2, lg: 1 }}>
          <Heading py={8} as="h3" size="md">
            Recent transactions from Ethereum
          </Heading>
          <Stack>
            {props.tx.ethereum &&
              props.tx.ethereum.map((tx) => (
                <TxCard key={tx.hash} clickable={true} {...tx} />
              ))}
          </Stack>
        </GridItem>
        <GridItem colSpan={{ sm: 2, md: 2, lg: 1 }}>
          <Heading py={8} as="h3" size="md">
            Recent transactions from Aurora
          </Heading>
          <Stack>
            {props.tx.aurora &&
              props.tx.aurora.map((tx) => (
                <TxCard key={tx.hash} clickable={true} {...tx} />
              ))}
          </Stack>
        </GridItem>
        <GridItem colSpan={{ sm: 2, md: 2, lg: 1 }}>
          <Heading py={8} as="h3" size="md">
            Browse bridge assets
          </Heading>
          <Stack>
            {props.tokens &&
              props.tokens.map((token) => (
                <AssetCard token={token} key={token.symbol} />
              ))}
          </Stack>
        </GridItem>
      </Grid>
    </Page>
  );
}

export async function getStaticProps() {
  const { tx, errors } = await recent();
  const tokens = await fetchBridgeTokenList();
  const shuffledTokens = tokens.sort(() => 0.5 - Math.random());

  return {
    props: {
      tx,
      errors,
      tokens: shuffledTokens.slice(0, 10),
    }, // will be passed to the page component as props
    revalidate: 60,
  };
}
