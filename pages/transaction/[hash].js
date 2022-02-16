import Page from "@/components/Page";
import TxCard from "@/components/TxCard";
// import { transaction } from "@/api/transactions/[hash].js";
import {
  Heading,
  Text,
  Flex,
  Box,
  Grid,
  GridItem,
  Wrap,
  WrapItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Stack,
  Code,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Spacer,
  Skeleton,
} from "@chakra-ui/react";

import Link from "next/link";

import { ExternalLinkIcon } from "@chakra-ui/icons";

import ClipboardButton from "@/components/ClipboardButton";
import ChainTag from "@/components/ChainTag";

import useSWR, { SWRConfig } from "swr";

const chainExplorers = {
  near: "https://explorer.near.org/transactions/",
  ethereum: "https://etherscan.io/tx/",
  aurora: "https://explorer.mainnet.aurora.dev/tx/",
};
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Transaction(props) {
  const { error, data } = useSWR("/api/transactions/" + props.hash, fetcher);
  if (error) return <div>failed to load</div>;
  if (!data) return <Skeleton height="20em" />;

  return (
    <Page>
      <Heading>Transaction</Heading>
      <Wrap align="center">
        <WrapItem>
          <Text mr={2}>{props.hash}</Text>
        </WrapItem>
        <WrapItem>
          <ClipboardButton text={props.hash} />
        </WrapItem>
        <Spacer />
        <WrapItem>
          <Flex alignItems="center">
            <a
              target="_blank"
              href={chainExplorers[data.data.origin] + data.data.hash}
              rel="noreferrer"
            >
              View on {data.data.origin} explorer
              <ExternalLinkIcon ml={1} />
            </a>
          </Flex>
        </WrapItem>
      </Wrap>
      <TxCard {...data.data} showDateTime={true} />
      <Grid templateColumns="repeat(2, 1fr)" gap={{ sm: 0, md: 3, lg: 3 }}>
        <GridItem colSpan={{ sm: 2, md: 1, lg: 1 }}>
          <Box p={6} borderWidth={1} borderRadius="md">
            <Text fontWeight={"bold"}>From</Text>
            <Flex alignItems="center">
              <Link href={"/address/" + data.data.sender}>
                <a>
                  <Text as={"u"} mr={2}>
                    {data.data.sender}
                  </Text>
                </a>
              </Link>
              <ClipboardButton text={data.data.sender} />
            </Flex>
            <ChainTag chain={data.data.origin} />
          </Box>
        </GridItem>
        <GridItem colSpan={{ sm: 2, md: 1, lg: 1 }}>
          <Box p={6} borderWidth={1} borderRadius="md">
            <Text fontWeight={"bold"}>To</Text>
            <Flex alignItems="center">
              <Link href={"/address/" + data.data.recipient}>
                <a>
                  <Text as={"u"} mr={2}>
                    {data.data.recipient}
                  </Text>
                </a>
              </Link>
              <ClipboardButton text={data.data.recipient} />
            </Flex>
            <ChainTag chain={data.data.destination} />
          </Box>
        </GridItem>
      </Grid>
      <Box borderWidth={1} borderRadius="md">
        <Wrap>
          {data.data.blockNumber && (
            <WrapItem p={6} borderRightWidth={1}>
              <Stat>
                <StatLabel>Block number</StatLabel>
                <StatNumber>{data.data.blockNumber}</StatNumber>
              </Stat>
            </WrapItem>
          )}
          {data.data.blockHash && (
            <WrapItem p={6} borderRightWidth={1}>
              <Stat>
                <StatLabel>Block hash</StatLabel>
                <StatNumber>{data.data.blockHash}</StatNumber>
              </Stat>
            </WrapItem>
          )}
          {data.data.confirmations && (
            <WrapItem p={6} borderRightWidth={1}>
              <Stat>
                <StatLabel>Confirmations</StatLabel>
                <StatNumber>{data.data.confirmations}</StatNumber>
              </Stat>
            </WrapItem>
          )}
          {data.data.gasUsed && (
            <WrapItem p={6} borderRightWidth={1}>
              <Stat>
                <StatLabel>Transaction fee</StatLabel>
                <StatNumber>{data.data.gasUsed}</StatNumber>
                <StatHelpText>
                  {"Gas Price: " + data.data.gasPrice}
                </StatHelpText>
              </Stat>
            </WrapItem>
          )}
        </Wrap>
      </Box>
      {(data.data.logs || data.data.args) && (
        <Box py={5}>
          <Heading my={4} fontSize={"sm"}>
            Transaction logs
          </Heading>
          <Stack spacing={4}>
            {data.data.logs &&
              data.data.logs.map((log) => (
                <Box
                  key={log.address}
                  w={"100%"}
                  borderWidth={1}
                  borderRadius="md"
                >
                  <Table variant="simple">
                    <Tbody>
                      <Tr>
                        <Td>Address</Td>
                        <Td>
                          <Code>{log.address}</Code>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Data</Td>
                        <Td>
                          <Code>{log.data}</Code>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Index</Td>
                        <Td>
                          <Code>{log.index}</Code>
                        </Td>
                      </Tr>
                      {log.topics &&
                        log.topics.map((topic, i) => (
                          <Tr key={topic}>
                            <Td>{i == 0 && "Topics"}</Td>
                            <Td>
                              <Code>{topic}</Code>
                            </Td>
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </Box>
              ))}
            {data.data.args && (
              <Box w={"100%"} borderWidth={1} borderRadius="md">
                <Table variant="simple">
                  <Tbody>
                    {Object.keys(data.data.args).map((key) => {
                      if (key != "args_json") {
                        return (
                          <Tr>
                            <Td>{key}</Td>
                            <Td>
                              <Code>{data.data.args[key]}</Code>
                            </Td>
                          </Tr>
                        );
                      }
                    })}

                    {data.data.args.args_json &&
                      Object.keys(data.data.args.args_json).map((key, i) => (
                        <Tr key={key}>
                          <Td>{i == 0 && "args_json"}</Td>
                          <Td>
                            {key}: <Code>{data.data.args.args_json[key]}</Code>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </Stack>
        </Box>
      )}
    </Page>
  );
}

export async function getServerSideProps({ params }) {
  // const { tx, errors } = await transaction(params.hash);
  return {
    props: {
      hash: params.hash,
      // tx,
      // errors,
    },
  };
}
