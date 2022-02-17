import { Container, Stack } from "@chakra-ui/react";
// import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Head from "next/head";

const Page = ({ children, ...props }) => {
  return (
    <>
      <Head>
        <title>
          {props.title
            ? props.title + " - Rainbow Bridge Explorer"
            : "Rainbow Bridge Explorer"}
        </title>
        <meta
          name="description"
          content={
            props.description
              ? props.description
              : "Explore your activity on Rainbow Bridge"
          }
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <Container mt={12} maxW="container.lg">
        <Stack spacing={4}>{children}</Stack>
      </Container>
    </>
  );
};

export default Page;
