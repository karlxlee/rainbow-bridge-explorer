import ChakraNextImage from "@/components/ChakraNextImage";
import { Text, Box, Spacer, Flex } from "@chakra-ui/react";
import tokenIcon from "@/utils/tokenIcon";
import TimeAgo from "@/components/TimeAgo";
import Link from "next/link";
import ChainTag from "@/components/ChainTag";

const TxCard = (props) => {
  console.log(props);
  const icon = tokenIcon(props.tokenSymbol);

  const CardBody = () => {
    return (
      <Box
        p={6}
        borderWidth={1}
        borderRadius="md"
        display="flex"
        flexWrap="wrap"
        alignItems="center"
      >
        {icon && <ChakraNextImage width="2em" height="2em" src={icon} />}
        <Text pl={2}>
          {Number.parseFloat(
            props.value / 10 ** props.tokenDecimal
          ).toPrecision(4) +
            " " +
            props.tokenSymbol}
        </Text>
        <Flex pl={2}>
          <ChainTag chain={props.origin} />
          <Text>--&gt;</Text>
          <ChainTag chain={props.destination} />
        </Flex>
        <Spacer />

        <Text>
          <TimeAgo unixTimestamp={props.timestamp} /> ago
        </Text>

        {props.showDateTime && (
          <>
            <Spacer />
            <Text>
              {new Date(props.timestamp * 1000).toLocaleString("en-US")}
            </Text>
          </>
        )}
        {props.showHash && (
          <>
            <Spacer />
            <Link href={"/transaction/" + props.hash}>
              <a>
                <Text as="u">{props.hash.slice(0, 20) + "..."}</Text>
              </a>
            </Link>
          </>
        )}
      </Box>
    );
  };

  if (props.clickable) {
    return (
      <Link href={"/transaction/" + props.hash}>
        <a>
          <CardBody />
        </a>
      </Link>
    );
  } else {
    return <CardBody />;
  }
};

export default TxCard;
