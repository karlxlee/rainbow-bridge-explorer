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
  const pages = [["/assets", "Assets"]];

  return (
    <Box p={4} mt={4}>
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
        {pages &&
          pages.map((entry) => (
            <Box mr={2} key={entry[0]}>
              <Link href={entry[0]}>
                <a>
                  <Button>{entry[1]}</Button>
                </a>
              </Link>
            </Box>
          ))}
        {router.pathname != "/" && <SearchBar />}
      </Container>
    </Box>
  );
};

export default Nav;
