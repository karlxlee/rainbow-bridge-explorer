import Page from "@/components/Page";
import TxCard from "@/components/TxCard";
import { transaction } from "@/api/transactions/[hash].js";
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
} from "@chakra-ui/react";

import Link from "next/link";

import { ExternalLinkIcon } from "@chakra-ui/icons";

import ClipboardButton from "@/components/ClipboardButton";
import ChainTag from "@/components/ChainTag";

const chainExplorers = {
  near: "https://explorer.near.org/transactions/",
  ethereum: "https://etherscan.io/tx/",
  aurora: "https://explorer.mainnet.aurora.dev/tx/",
};

export default function Transaction(props) {
  return (
    <Page>
      <Heading>Transaction</Heading>
      <Wrap align="center">
        <WrapItem>
          <Text mr={2}>{props.tx.hash}</Text>
        </WrapItem>
        <WrapItem>
          <ClipboardButton text={props.tx.hash} />
        </WrapItem>
        <Spacer />
        <WrapItem>
          <Flex alignItems="center">
            <a
              target="_blank"
              href={chainExplorers[props.tx.origin] + props.tx.hash}
              rel="noreferrer"
            >
              View on {props.tx.origin} explorer
              <ExternalLinkIcon ml={1} />
            </a>
          </Flex>
        </WrapItem>
      </Wrap>
      <TxCard {...props.tx} showDateTime={true} />
      <Grid templateColumns="repeat(2, 1fr)" gap={{ sm: 0, md: 3, lg: 3 }}>
        <GridItem colSpan={{ sm: 2, md: 1, lg: 1 }}>
          <Box p={6} borderWidth={1} borderRadius="md">
            <Text fontWeight={"bold"}>From</Text>
            <Flex alignItems="center">
              <Link href={"/address/" + props.tx.sender}>
                <a>
                  <Text as={"u"} mr={2}>
                    {props.tx.sender}
                  </Text>
                </a>
              </Link>
              <ClipboardButton text={props.tx.sender} />
            </Flex>
            <ChainTag chain={props.tx.origin} />
          </Box>
        </GridItem>
        <GridItem colSpan={{ sm: 2, md: 1, lg: 1 }}>
          <Box p={6} borderWidth={1} borderRadius="md">
            <Text fontWeight={"bold"}>To</Text>
            <Flex alignItems="center">
              <Link href={"/address/" + props.tx.sender}>
                <a>
                  <Text as={"u"} mr={2}>
                    {props.tx.recipient}
                  </Text>
                </a>
              </Link>
              <ClipboardButton text={props.tx.recipient} />
            </Flex>
            <ChainTag chain={props.tx.destination} />
          </Box>
        </GridItem>
      </Grid>
      <Box borderWidth={1} borderRadius="md">
        <Wrap>
          {props.tx.blockNumber && (
            <WrapItem p={6} borderRightWidth={1}>
              <Stat>
                <StatLabel>Block number</StatLabel>
                <StatNumber>{props.tx.blockNumber}</StatNumber>
              </Stat>
            </WrapItem>
          )}
          {props.tx.blockHash && (
            <WrapItem p={6} borderRightWidth={1}>
              <Stat>
                <StatLabel>Block hash</StatLabel>
                <StatNumber>{props.tx.blockHash}</StatNumber>
              </Stat>
            </WrapItem>
          )}
          {props.tx.confirmations && (
            <WrapItem p={6} borderRightWidth={1}>
              <Stat>
                <StatLabel>Confirmations</StatLabel>
                <StatNumber>{props.tx.confirmations}</StatNumber>
              </Stat>
            </WrapItem>
          )}
          {props.tx.gasUsed && (
            <WrapItem p={6} borderRightWidth={1}>
              <Stat>
                <StatLabel>Transaction fee</StatLabel>
                <StatNumber>{props.tx.gasUsed}</StatNumber>
                <StatHelpText>{"Gas Price: " + props.tx.gasPrice}</StatHelpText>
              </Stat>
            </WrapItem>
          )}
        </Wrap>
      </Box>
      {(props.tx.logs || props.tx.args) && (
        <Box py={5}>
          <Heading my={4} fontSize={"sm"}>
            Transaction logs
          </Heading>
          <Stack spacing={4}>
            {props.tx.logs &&
              props.tx.logs.map((log) => (
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
            {props.tx.args && (
              <Box w={"100%"} borderWidth={1} borderRadius="md">
                <Table variant="simple">
                  <Tbody>
                    {Object.keys(props.tx.args).map((key) => {
                      if (key != "args_json") {
                        return (
                          <Tr>
                            <Td>{key}</Td>
                            <Td>
                              <Code>{props.tx.args[key]}</Code>
                            </Td>
                          </Tr>
                        );
                      }
                    })}

                    {props.tx.args.args_json &&
                      Object.keys(props.tx.args.args_json).map((key, i) => (
                        <Tr key={key}>
                          <Td>{i == 0 && "args_json"}</Td>
                          <Td>
                            {key}: <Code>{props.tx.args.args_json[key]}</Code>
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
  const { tx, errors } = await transaction(params.hash);
  return {
    props: {
      hash: params.hash,
      tx,
      errors,
    },
    revalidate: 30,
  };
}
