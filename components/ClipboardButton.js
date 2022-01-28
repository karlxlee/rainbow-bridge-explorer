import { Button } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";

const ClipboardButton = (props) => {
  return (
    <Button
      w={3}
      onClick={() => {
        navigator.clipboard.writeText(props.text);
      }}
    >
      <CopyIcon />
    </Button>
  );
};

export default ClipboardButton;
