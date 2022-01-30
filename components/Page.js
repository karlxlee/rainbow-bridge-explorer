import { Container, Stack } from "@chakra-ui/react";
// import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
const Page = ({ children }) => {
  return (
    <>
      <Nav />
      <Container mt={12} maxW="container.lg">
        <Stack spacing={4}>{children}</Stack>
      </Container>
    </>
  );
};

export default Page;
