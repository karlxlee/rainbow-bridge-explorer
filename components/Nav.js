import Link from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Container,
  Text,
  Spacer,
  Input,
  Button,
  Flex,
} from "@chakra-ui/react";
import ChakraNextImage from "@/components/ChakraNextImage";
import SearchBar from "@/components/SearchBar";

const Nav = (props) => {
  const router = useRouter();

  const pages = {
    "/": "Overview",
    "/trends": "Trends",
    "/health": "Health",
    "/compare": "Compare fees",
  };

  if (router.pathname != "/") {
    return (
      <Box p={4}>
        <Container
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          maxW="container.lg"
        >
          <Link href="/">
            <a>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                // width={{ base: "100%", md: "80px" }}
                mt={{ base: "1em", md: "0" }}
              >
                <ChakraNextImage
                  src="/rainbow-bridge.svg"
                  alt="Rainbow Bridge Explorer"
                  width={10}
                  height={10}
                  objectFit="contain"
                />
                <Text pl={2}>Explorer</Text>
                <Spacer />
              </Box>
            </a>
          </Link>
          <Spacer />
          <SearchBar />
        </Container>
      </Box>
    );
  } else {
    return <></>;
  }
};

export default Nav;
