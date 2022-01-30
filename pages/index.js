import Head from "next/head";
import Page from "@/components/Page";
import Hero from "@/components/Hero";

import { recent } from "@/api/transactions/recent";
import TxCard from "@/components/TxCard";

import { Grid, GridItem, Stack, Heading } from "@chakra-ui/react";

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
              props.tx.near.map((tx) => <TxCard key={tx.hash} {...tx} />)}
          </Stack>
        </GridItem>
        <GridItem colSpan={{ sm: 2, md: 2, lg: 1 }}>
          <Heading py={8} as="h3" size="md">
            Recent transactions from Ethereum
          </Heading>
          <Stack>
            {props.tx.ethereum &&
              props.tx.ethereum.map((tx) => <TxCard key={tx.hash} {...tx} />)}
          </Stack>
        </GridItem>
        <GridItem colSpan={{ sm: 2, md: 2, lg: 1 }}>
          <Heading py={8} as="h3" size="md">
            Recent transactions from Aurora
          </Heading>
          <Stack>
            {props.tx.aurora &&
              props.tx.aurora.map((tx) => <TxCard key={tx.hash} {...tx} />)}
          </Stack>
        </GridItem>
      </Grid>
    </Page>
  );
}

export async function getStaticProps() {
  const { tx, errors } = await recent();
  return {
    props: {
      tx,
      errors,
    }, // will be passed to the page component as props
  };
}
