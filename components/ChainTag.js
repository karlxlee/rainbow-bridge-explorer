import { Tag } from "@chakra-ui/react";
const ChainTag = (props) => {
  const tagColors = {
    aurora: "#78d64b",
    ethereum: "#1c1ce1",
    near: "#262626",
  };
  return (
    <Tag
      size={"md"}
      variant="solid"
      backgroundColor={tagColors[props.chain.toLowerCase()]}
    >
      {props.chain}
    </Tag>
  );
};

export default ChainTag;
