import { Box, Text } from "@chakra-ui/react";
import ChakraNextImage from "@/components/ChakraNextImage";
import Link from "next/link";

const AssetCard = ({ token }) => {
  return (
    <Link href={"/asset/" + token.symbol}>
      <a>
        <Box
          p={6}
          borderWidth={1}
          borderRadius="md"
          display={"flex"}
          alignItems="center"
        >
          <ChakraNextImage
            width="2em"
            height="2em"
            src={
              "https://raw.githubusercontent.com/aurora-is-near/bridge-assets/master/tokens" +
              "/" +
              token.svgPath
            }
          />
          <Text ml={2}>{token.symbol}</Text>
        </Box>
      </a>
    </Link>
  );
};

export default AssetCard;
