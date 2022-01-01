import ChakraNextImage from "@/components/ChakraNextImage";
import { Text, Box, Spacer, Flex, Tag } from "@chakra-ui/react";

const TxCard = (props) => {
  console.log(props);
  return (
    <Box
      p={6}
      borderWidth={1}
      borderRadius="md"
      display="flex"
      alignItems="center"
    >
      <ChakraNextImage
        width="2em"
        height="2em"
        src={
          ["NEAR", "WETH", "WMATIC"].includes(props.tokenSymbol)
            ? props.tokenSymbol == "NEAR"
              ? "/near-icon.svg"
              : "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@d5c68edec1f5eaec59ac77ff2b48144679cebca1/svg/color/" +
                props.tokenSymbol.substring(1).toLowerCase() +
                ".svg"
            : "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@d5c68edec1f5eaec59ac77ff2b48144679cebca1/svg/color/" +
              props.tokenSymbol.toLowerCase() +
              ".svg"
        }
      />
      <Text pl={2}>
        {props.value / 10 ** props.tokenDecimal + " " + props.tokenSymbol}
      </Text>
      <Flex pl={2}>
        <Tag size={"md"} variant="solid" colorScheme="teal">
          {props.origin}
        </Tag>
        <Text>--&gt;</Text>
        <Tag size={"md"} variant="solid" colorScheme="teal">
          {props.destination}
        </Tag>
      </Flex>
      <Spacer />
      <Text>{props.hash.slice(0, 20) + "..."}</Text>
    </Box>
  );
};

export default TxCard;
