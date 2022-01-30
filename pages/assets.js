import Head from "next/head";
import Page from "@/components/Page";
import Link from "next/link";
import ChakraNextImage from "@/components/ChakraNextImage";

import { Box, Text, Grid, GridItem } from "@chakra-ui/react";

import fetchBridgeTokenList from "@/utils/fetchBridgeTokenList";

export default function Assets(props) {
  return (
    <Page>
      <Head>
        <title>Rainbow Bridge Explorer: Assets</title>
      </Head>
      <Grid templateColumns="repeat(4, 1fr)" gap={2}>
        {props.tokens.map((token) => (
          <Link href={"/asset/" + token.symbol} key={token.symbol}>
            <a>
              <GridItem
                colSpan={{ sm: "2", md: "1", lg: "1" }}
                p={6}
                borderWidth={1}
                borderRadius="md"
                display={"flex"}
                alignItems="center"
              >
                <ChakraNextImage
                  width={10}
                  height={10}
                  src={
                    "https://raw.githubusercontent.com/aurora-is-near/bridge-assets/master/tokens" +
                    "/" +
                    token.symbol.toLowerCase() +
                    ".svg"
                  }
                />
                <Text ml={2}>{token.symbol}</Text>
              </GridItem>
            </a>
          </Link>
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
