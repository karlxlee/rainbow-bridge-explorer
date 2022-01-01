import { useRouter } from "next/router";
import { Box, Input, Button, Flex } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const SearchBar = (props) => {
  const router = useRouter();
  const searchUser = (event) => {
    event.preventDefault();
    router.push("/address/" + event.target.address.value);
  };

  return (
    <form
      pt={{ base: "1em", md: "0" }}
      w="100%"
      onSubmit={(e) => {
        searchUser(e);
      }}
    >
      <Flex>
        <Input
          required
          placeholder="Search by address"
          name="address"
          size="md"
          maxW="sm"
        />
        <Button
          ml={2}
          fontSize="sm"
          type="submit"
          fontWeight="regular"
          leftIcon={<SearchIcon />}
          size="md"
          backgroundColor="lightblue"
          color="white"
          px={6}
        >
          Search
        </Button>
      </Flex>
    </form>
  );
};

export default SearchBar;
