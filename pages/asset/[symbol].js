import Head from "next/head";
import Page from "@/components/Page";
import Link from "next/link";
import ChakraNextImage from "@/components/ChakraNextImage";
import ChainTag from "@/components/ChainTag";
import { token } from "@/api/assets/[symbol].js";

import {
  Grid,
  GridItem,
  Box,
  Wrap,
  WrapItem,
  Text,
  Heading,
  Stack,
  Flex,
} from "@chakra-ui/react";

export default function Asset({ token }) {
  console.log(token);
  return (
    <Page title={token.name + " (" + token.symbol + ")"}>
      {Object.keys(token).length && (
        <>
          <Grid templateColumns={"repeat(5, 1fr)"} gap={2}>
            <GridItem colSpan={{ sm: 5, md: 5, lg: 2 }}>
              <Stack gap={2} align="center" p={6} py={20} borderWidth={1}>
                {token.svgPath && (
                  <ChakraNextImage
                    width={20}
                    height={20}
                    src={
                      "https://raw.githubusercontent.com/aurora-is-near/bridge-assets/master/tokens" +
                      "/" +
                      token.svgPath.toLowerCase()
                    }
                  />
                )}
                <Heading>Asset</Heading>
                <Text>{token.name + " (" + token.symbol + ")"}</Text>
              </Stack>
            </GridItem>
            <GridItem colSpan={{ sm: 5, md: 5, lg: 3 }}>
              <Stack gap={4} borderWidth={1} p={6}>
                <Heading as="h3" size="sm">
                  Token decimals
                </Heading>
                <Text>{token.decimals}</Text>
                <Heading as="h3" size="sm">
                  Token addresses
                </Heading>
                {token.ethereum_address && (
                  <Wrap align="center">
                    <WrapItem mr={2}>
                      <ChainTag chain={"ethereum"} />
                    </WrapItem>
                    <WrapItem>
                      <Text wordBreak="break-word">
                        {token.ethereum_address}
                      </Text>
                    </WrapItem>
                  </Wrap>
                )}
                {token.aurora_address && (
                  <Wrap align="center">
                    <WrapItem mr={2}>
                      <ChainTag chain={"aurora"} />{" "}
                    </WrapItem>
                    <WrapItem>
                      <Text ml={2} wordBreak="break-word">
                        {token.aurora_address}
                      </Text>
                    </WrapItem>
                  </Wrap>
                )}
                {token.near_address && (
                  <Wrap align="center">
                    <WrapItem mr={2}>
                      <ChainTag chain={"near"} />{" "}
                    </WrapItem>
                    <WrapItem>
                      <Text ml={2} wordBreak="break-word">
                        {token.near_address}
                      </Text>
                    </WrapItem>
                  </Wrap>
                )}
              </Stack>
            </GridItem>
          </Grid>
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
