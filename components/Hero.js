import { Grid, GridItem, Box, Center, Heading, Text } from "@chakra-ui/react";
import ChakraNextImage from "@/components/ChakraNextImage";
import SearchBar from "@/components/SearchBar";

import ChainCircle from "@/components/ChainCircle";

const Hero = () => {
  return (
    <Box pt={20} pb={30}>
      {/* <ChakraNextImage
        w={10}
        h={10}
        objectFit="contain"
        src="/rainbow-bridge.svg"
        mb={6}
      /> */}
      <Grid templateColumns="repeat(2, 1fr)">
        <GridItem gap={4} colSpan={{ base: 2, sm: 2, md: 1, lg: 1 }}>
          <Heading fontWeight="bold">
            Explore your activity on Rainbow Bridge
          </Heading>
          <Text mt={4}>
            Find any bridge transaction between NEAR, Aurora and Ethereum.
          </Text>
          <Box mt={4} />
          <SearchBar />
        </GridItem>
        <GridItem
          colSpan={{ base: 2, sm: 2, md: 1, lg: 1 }}
          pt={{ sm: 24, md: 0 }}
        >
          <Center>
            <Box>
              <ChainCircle chain="aurora" />
            </Box>
            <Box paddingBottom={"16rem"}>
              <ChainCircle chain="near" />
            </Box>
            <Box>
              <ChainCircle chain="ethereum" />
            </Box>
          </Center>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Hero;
