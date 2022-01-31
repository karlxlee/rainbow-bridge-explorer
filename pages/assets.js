import Head from "next/head";
import Page from "@/components/Page";
import AssetCard from "@/components/AssetCard";
import { Box, Text, Grid, GridItem } from "@chakra-ui/react";
import { fetchBridgeTokenList } from "@/api/assets/index.js";

export default function Assets(props) {
  return (
    <Page>
      <Head>
        <title>Rainbow Bridge Explorer: Assets</title>
      </Head>
      <Grid templateColumns="repeat(4, 1fr)" gap={2}>
        {props.tokens.map((token) => (
          <GridItem key={token.symbol} colSpan={{ sm: "2", md: "1", lg: "1" }}>
            <AssetCard token={token} />
          </GridItem>
        ))}
      </Grid>
    </Page>
  );
}

export async function getStaticProps({ params }) {
  const tokens = await fetchBridgeTokenList();
  return {
    props: {
      tokens,
    }, // will be passed to the page component as props
    revalidate: 60,
  };
}
