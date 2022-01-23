import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/inter";
import theme from "@/config/theme";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

function MyApp({ Component, pageProps }) {
  TimeAgo.addDefaultLocale(en);
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />{" "}
    </ChakraProvider>
  );
}

export default MyApp;
