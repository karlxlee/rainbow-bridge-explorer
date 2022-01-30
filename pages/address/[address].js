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
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { transactions } from "@/api/transactions/index";
import ClipboardButton from "@/components/ClipboardButton";

export default function Address(props) {
  return (
    <Page>
      <Head>
        <title>Rainbow Bridge Explorer</title>

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Wrap>
        <WrapItem>
          <Heading>{props.address}</Heading>
        </WrapItem>
        <WrapItem>
          <ClipboardButton text={props.address} />
        </WrapItem>
      </Wrap>
      {props.errors.length && (
        <VStack>
          {props.errors.map((error) => (
            <Alert key={error} status="error">
              <AlertIcon />
              <AlertTitle mr={2}>{error}</AlertTitle>
              <AlertDescription>
                Your Chakra experience may be degraded.
              </AlertDescription>
            </Alert>
          ))}
        </VStack>
      )}

      {props.tx.map((tx) => (
        <TxCard key={tx.hash} {...tx} showHash={true} />
      ))}
    </Page>
  );
}

export async function getStaticProps({ params }) {
  const { tx, errors } = await transactions(params.address);
  return {
    props: {
      address: params.address,
      tx,
      errors,
    }, // will be passed to the page component as props
    revalidate: 60,
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
