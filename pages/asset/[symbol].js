import Head from "next/head";
import Page from "@/components/Page";
import Link from "next/link";
import ChakraNextImage from "@/components/ChakraNextImage";
import ChainTag from "@/components/ChainTag";
import { token } from "@/api/assets/[symbol].js";

import { Box, Text, Heading, Stack, Flex } from "@chakra-ui/react";

export default function Asset({ token }) {
  return (
    <Page>
      {Object.keys(token).length && (
        <>
          <Head>
            <title>{"Rainbow Bridge Explorer - " + token.symbol}</title>
          </Head>
          <Box>
            <Stack gap={2}>
              <Heading>
                {"Asset: " + token.name + " (" + token.symbol + ")"}
              </Heading>
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
              {token.near_address && (
                <Flex align="center">
                  <ChainTag chain={"near"} />
                  <Text ml={2}>{token.near_address}</Text>
                </Flex>
              )}
            </Stack>
          </Box>
        </>
      )}
      {!Object.keys(token).length && (
        <Box>
          <Heading>{"Token not found"}</Heading>
        </Box>
      )}
    </Page>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: {
      token: await token(params.symbol),
    }, // will be passed to the page component as props
    // revalidate: 60,
  };
}

// export async function getStaticPaths() {
//   const tokens = await fetchBridgeTokenList();
//   // Get the paths we want to pre-render based on posts
//   const paths = tokens.map((entry) => {
//     return {
//       params: {
//         symbol: entry.symbol,
//       },
//     };
//   });

//   // We'll pre-render only these paths at build time.
//   // { fallback: blocking } will server-render pages
//   // on-demand if the path doesn't exist.
//   return {
//     paths,
//     fallback: "blocking",
//   };
// }
