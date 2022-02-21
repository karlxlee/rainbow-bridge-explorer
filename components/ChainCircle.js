import { Center, Circle } from "@chakra-ui/react";
import ChakraNextImage from "@/components/ChakraNextImage";

const chainIcons = {
  near: "/near-icon.svg",
  aurora: "/aurora-icon.svg",
  ethereum: "/ethereum-icon.svg",
};
const ChainCircle = ({ chain }) => {
  return (
    <>
      <Center position="relative" align="center" justifyItems={"center"}>
        <Circle
          style={{ filter: "blur(10px)" }}
          bgGradient="linear(to-r, #A463B040, #5F8AFA40)"
          size={24}
        ></Circle>
        <Circle
          position={"absolute"}
          zIndex={1}
          style={{ filter: "none" }}
          bg="white"
          size={20}
          p={4}
        >
          <ChakraNextImage w={12} h={12} src={chainIcons[chain]} />
        </Circle>
      </Center>
    </>
  );
};

export default ChainCircle;
