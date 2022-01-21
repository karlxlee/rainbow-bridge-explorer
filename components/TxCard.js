import ChakraNextImage from "@/components/ChakraNextImage";
import { Text, Box, Spacer, Flex, Tag } from "@chakra-ui/react";

const tagColors = {
  aurora: "#78d64b",
  ethereum: "#1c1ce1",
  bridge: "black",
  near: "#262626",
};

const TxCard = (props) => {
  let symbol;
  if (props.tokenSymbol == "NEAR") {
    symbol = "/near-icon.svg";
  } else if (["WETH", "WMATIC"].includes(props.tokenSymbol)) {
    symbol =
      "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@d5c68edec1f5eaec59ac77ff2b48144679cebca1/svg/color/" +
      props.tokenSymbol.substring(1).toLowerCase() +
      ".svg";
  } else if (
    props.tokenSymbol[0] == "n" &&
    props.tokenSymbol.length >= 4 &&
    props.origin.toLowerCase() == "near"
  ) {
    symbol =
      "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@d5c68edec1f5eaec59ac77ff2b48144679cebca1/svg/color/" +
      props.tokenSymbol.substring(1).toLowerCase() +
      ".svg";
  } else {
    symbol =
      "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@d5c68edec1f5eaec59ac77ff2b48144679cebca1/svg/color/" +
      props.tokenSymbol.toLowerCase() +
      ".svg";
  }
  return (
    <Box
      p={6}
      borderWidth={1}
      borderRadius="md"
      display="flex"
      alignItems="center"
    >
      <ChakraNextImage width="2em" height="2em" src={symbol} />
      <Text pl={2}>
        {props.value / 10 ** props.tokenDecimal + " " + props.tokenSymbol}
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
      <Text>{props.hash.slice(0, 20) + "..."}</Text>
    </Box>
  );
};

export default TxCard;
