import Head from "next/head";
import Page from "@/components/Page";
import Link from "next/link";
import ChakraNextImage from "@/components/ChakraNextImage";
import ChainTag from "@/components/ChainTag";
import fetchBridgeTokenList from "@/utils/fetchBridgeTokenList";
import { Box, Text, Heading, Stack, Flex } from "@chakra-ui/react";

export default function Asset({ token }) {
  return (
    <Page>
      <Head>
        <title>{"Rainbow Bridge Explorer - " + token.symbol}</title>
      </Head>
      <Box>
        <Stack gap={2}>
          <Heading>{"Asset: " + token.symbol}</Heading>
          <ChakraNextImage
            width={20}
            height={20}
            src={
              "https://raw.githubusercontent.com/aurora-is-near/bridge-assets/master/tokens" +
              "/" +
              token.symbol.toLowerCase() +
              ".svg"
            }
          />
        </Stack>
        <Stack mt={6} gap={2}>
          {token.ethereum_address && (
            <Flex align="center">
              <ChainTag chain={"ethereum"} />
              <Text ml={2}>{token.ethereum_address}</Text>
            </Flex>
          )}
          {token.aurora_address && (
            <Flex align="center">
              <ChainTag chain={"aurora"} />
              <Text ml={2}>{token.aurora_address}</Text>
            </Flex>
          )}
        </Stack>
      </Box>
    </Page>
  );
}

export async function getStaticProps({ params }) {
  const tokensFolder =
    "https://raw.githubusercontent.com/aurora-is-near/bridge-assets/master/tokens";
  const tokens = await fetchBridgeTokenList();
  const path = tokens.filter(
    (entry) => entry.symbol.toLowerCase() == params.symbol.toLowerCase()
  )[0].path;

  let token;
  try {
    token = await fetch(tokensFolder + "/" + path).then((r) => r.json());
    console.log(token);
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      token,
    }, // will be passed to the page component as props
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const tokens = await fetchBridgeTokenList();
  // Get the paths we want to pre-render based on posts
  // const paths = tokens.map((entry) => {
  //   return {
  //     params: {
  //       symbol: entry.symbol,
  //     },
  //   };
  // });

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return {
    paths: [
      {
        params: {
          symbol: "USDT",
        },
      },
    ],
    fallback: "blocking",
  };
}
