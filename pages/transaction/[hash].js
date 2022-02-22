import Page from "@/components/Page";
import TxCard from "@/components/TxCard";
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
  Tbody,
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

import useSWR from "swr";
import chainExplorers from "@/config/chainExplorers.json";
import fetcher from "@/utils/fetcher";

export default function Transaction(props) {
  const TxDetails = () => {
    const { error, data } = useSWR("/api/transactions/" + props.hash, fetcher);
    if (error) return <div>failed to load</div>;
    if (!data) return <Skeleton height="20em" />;
    else {
      return (
        <>
          <Wrap align="center">
            <WrapItem>
              <Text mr={2} wordBreak="break-word">
                {props.hash}
              </Text>
            </WrapItem>
            <WrapItem>
              <ClipboardButton text={props.hash} />
            </WrapItem>
            <Spacer />
            <WrapItem>
              <Flex alignItems="center">
                <a
                  target="_blank"
                  href={
                    chainExplorers[data.data.origin]["url"] + data.data.hash
                  }
                  rel="noreferrer"
                >
                  View on {chainExplorers[data.data.origin]["name"]}
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
                      <Text wordBreak="break-word" as={"u"} mr={2}>
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
                      <Text wordBreak="break-word" as={"u"} mr={2}>
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
                    <StatNumber wordBreak="break-word">
                      {data.data.blockHash}
                    </StatNumber>
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
                            <Td wordBreak="break-word">
                              <Code>{log.address}</Code>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td>Data</Td>
                            <Td wordBreak="break-word">
                              <Code>{log.data}</Code>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td>Index</Td>
                            <Td wordBreak="break-word">
                              <Code>{log.index}</Code>
                            </Td>
                          </Tr>
                          {log.topics &&
                            log.topics.map((topic, i) => (
                              <Tr key={topic}>
                                <Td wordBreak="break-word">
                                  {i == 0 && "Topics"}
                                </Td>
                                <Td wordBreak="break-word">
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
                                  <Code wordBreak="break-word">
                                    {data.data.args[key]}
                                  </Code>
                                </Td>
                              </Tr>
                            );
                          }
                        })}

                        {data.data.args.args_json &&
                          Object.keys(data.data.args.args_json).map(
                            (key, i) => (
                              <Tr key={key}>
                                <Td>{i == 0 && "args_json"}</Td>
                                <Td wordBreak="break-word">
                                  {key}:{" "}
                                  <Code>{data.data.args.args_json[key]}</Code>
                                </Td>
                              </Tr>
                            )
                          )}
                      </Tbody>
                    </Table>
                  </Box>
                )}
              </Stack>
            </Box>
          )}{" "}
        </>
      );
    }
  };

  return (
    <Page title={"Transaction: " + props.hash}>
      <Heading>Transaction</Heading>
      <TxDetails />
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
