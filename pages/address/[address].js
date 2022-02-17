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
  Skeleton,
} from "@chakra-ui/react";
// import { transactions } from "@/api/transactions/index";
import ClipboardButton from "@/components/ClipboardButton";
import useSWR, { SWRConfig } from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Address(props) {
  const { error, data } = useSWR(
    "/api/transactions?address=" + props.address,
    fetcher
  );
  if (error) return <div>failed to load</div>;
  if (!data) return <Skeleton height="20em" />;

  return (
    <Page title={"Address: " + props.address}>
      <Heading>Address</Heading>
      <Wrap align="center">
        <WrapItem>
          <Text mr={2} wordBreak="break-word">
            {props.address}
          </Text>
        </WrapItem>
        <WrapItem>
          <ClipboardButton text={props.address} />
        </WrapItem>
      </Wrap>
      {/* {error.length && (
        <VStack>
          {error.map((error) => (
            <Alert key={error} status="error">
              <AlertIcon />
              <AlertTitle mr={2}>{error}</AlertTitle>
              <AlertDescription>
                Your Chakra experience may be degraded.
              </AlertDescription>
            </Alert>
          ))}
        </VStack>
      )} */}

      {data.data.map((tx) => (
        <TxCard key={tx.hash} {...tx} showHash={true} />
      ))}
    </Page>
  );
}

export async function getServerSideProps({ params }) {
  // const { tx, errors } = await transactions(params.address);
  return {
    props: {
      address: params.address,
      // tx,
      // errors,
    }, // will be passed to the page component as props
    // revalidate: 60,
  };
}

// export async function getStaticPaths() {
//   // Get the paths we want to pre-render based on posts
//   const paths = [
//     {
//       params: { address: "0xbC042F45f9eBfF86fCaAd0869cA169Dc671C0826" },
//     },
//   ];

//   // We'll pre-render only these paths at build time.
//   // { fallback: blocking } will server-render pages
//   // on-demand if the path doesn't exist.
//   return { paths, fallback: "blocking" };
// }
