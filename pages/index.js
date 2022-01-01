import Head from "next/head";
import Page from "@/components/Page";
import Hero from "@/components/Hero";
export default function Home() {
  return (
    <Page>
      <Head>
        <title>Rainbow Bridge Explorer</title>
        <meta
          name="description"
          content="Explore your activity on Rainbow Bridge"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
    </Page>
  );
}
