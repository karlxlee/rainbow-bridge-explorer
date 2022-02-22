import Head from "next/head";
import Page from "@/components/Page";
import Hero from "@/components/Hero";
import TxCard from "@/components/TxCard";
import AssetCard from "@/components/AssetCard";
import { Grid, GridItem, Stack, Heading, Skeleton } from "@chakra-ui/react";

import { recent } from "@/api/transactions/recent";
import { fetchBridgeTokenList } from "@/api/assets/index.js";

import useSWR, { SWRConfig } from "swr";
import { useSWRConfig } from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function TxList({ chain }) {
  const { data } = useSWR("/api/transactions/recent", fetcher);
  // const { mutate } = useSWRConfig();

  // const LoadingSkeleton = () => (
  //   <Stack>
  //     {[...Array(10).keys()].map((key) => (
  //       <Skeleton
  //         key={key}
  //         p={6}
  //         borderWidth={1}
  //         borderRadius="md"
  //         display="flex"
  //         flexWrap="wrap"
  //         alignItems="center"
  //       ></Skeleton>
  //     ))}
  //   </Stack>
  // );

  // if (error) {
  // mutate("/api/transactions/recent");
  // return <TxStack />;
  // }

  // render data
  // if (data.tx) {
  //   return <TxStack />;
  // } else {
  //   mutate("/api/transactions/recent");

  console.log(Object.keys(data));
  console.log(data);
  if ("data" in data) {
    return (
      <Stack>
        {data.data[chain] &&
          data.data[chain].map((tx) => (
            <TxCard key={tx.hash} clickable={true} {...tx} />
          ))}
      </Stack>
    );
  } else {
    return (
      <Stack>
        {data[chain] &&
          data[chain].map((tx) => (
            <TxCard key={tx.hash} clickable={true} {...tx} />
          ))}
      </Stack>
    );
  }
}

export default function Home({ fallback, ...props }) {
  return (
    <Page>
      <Hero />
      <Grid templateColumns={"repeat(2, 1fr)"} gap={2}>
        <GridItem colSpan={{ sm: 2, md: 2, lg: 1 }}>
          <Heading py={8} as="h3" size="md">
            Recent transactions from NEAR
          </Heading>

          <SWRConfig value={{ fallback }}>
            <TxList chain="near" />
          </SWRConfig>
        </GridItem>
        <GridItem colSpan={{ sm: 2, md: 2, lg: 1 }}>
          <Heading py={8} as="h3" size="md">
            Recent transactions from Ethereum
          </Heading>
          <SWRConfig value={{ fallback }}>
            <TxList chain="ethereum" />
          </SWRConfig>
        </GridItem>
        <GridItem colSpan={{ sm: 2, md: 2, lg: 1 }}>
          <Heading py={8} as="h3" size="md">
            Recent transactions from Aurora
          </Heading>
          <SWRConfig value={{ fallback }}>
            <TxList chain="aurora" />
          </SWRConfig>
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
      // tx,
      // errors,
      tokens: shuffledTokens.slice(0, 10),
      fallback: {
        "/api/transactions/recent": tx,
      },
    }, // will be passed to the page component as props
    revalidate: 60,
  };
}
