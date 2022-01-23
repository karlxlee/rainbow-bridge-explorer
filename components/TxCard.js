import ChakraNextImage from "@/components/ChakraNextImage";
import { Text, Box, Spacer, Flex, Tag } from "@chakra-ui/react";
import tokenIcon from "@/utils/tokenIcon";
import TimeAgo from "@/components/TimeAgo";
import Link from "next/link";

const tagColors = {
  aurora: "#78d64b",
  ethereum: "#1c1ce1",
  near: "#262626",
};

const TxCard = (props) => {
  const icon = tokenIcon(props.tokenSymbol);
  return (
    <Box
      p={6}
      borderWidth={1}
      borderRadius="md"
      display="flex"
      alignItems="center"
    >
      {icon && <ChakraNextImage width="2em" height="2em" src={icon} />}
      <Text pl={2}>
        {Number.parseFloat(props.value / 10 ** props.tokenDecimal).toPrecision(
          4
        ) +
          " " +
          props.tokenSymbol}
      </Text>
      <Flex pl={2}>
        <Tag
          size={"md"}
          variant="solid"
          backgroundColor={tagColors[props.origin.toLowerCase()]}
        >
          {props.origin}
        </Tag>
        <Text>--&gt;</Text>
        <Tag
          size={"md"}
          variant="solid"
          backgroundColor={tagColors[props.destination.toLowerCase()]}
        >
          {props.destination}
        </Tag>
      </Flex>
      <Spacer />

      <Text>
        <TimeAgo timestamp={props.timeStamp} />
      </Text>
      <Spacer />

      <Link href={"/transactions/" + props.hash}>
        <a>
          <Text>{props.hash.slice(0, 20) + "..."}</Text>
        </a>
      </Link>
    </Box>
  );
};

export default TxCard;
