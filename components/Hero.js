import { Grid, GridItem, Box, Heading } from "@chakra-ui/react";
import ChakraNextImage from "@/components/ChakraNextImage";
import SearchBar from "@/components/SearchBar";
const Hero = () => {
  return (
    <Box pt={10} pb={20}>
      {/* <ChakraNextImage
        w={10}
        h={10}
        objectFit="contain"
        src="/rainbow-bridge.svg"
        mb={6}
      /> */}
      <Grid templateRows="repeat(1, 1fr)" templateColumns="repeat(2, 1fr)">
        <GridItem colSpan={{ sm: 2, md: 1, lg: 1 }}>
          <Heading>Explore your activity on Rainbow Bridge</Heading>
          <Box mt={10} />
          <SearchBar />
        </GridItem>
        <GridItem colSpan={{ sm: 2, md: 1, lg: 1 }}></GridItem>
      </Grid>
    </Box>
  );
};

export default Hero;
