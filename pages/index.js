import Head from "next/head";
import Page from "@/components/Page";
import Hero from "@/components/Hero";

import { recent } from "@/api/transactions/recent";
import TxCard from "@/components/TxCard";
import { transactions } from "@/api/transactions/index";

export default function Home(props) {
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
      {props.tx.map((tx) => (
        <TxCard key={tx.hash} {...tx} />
      ))}
    </Page>
  );
}

export async function getStaticProps() {
  const { tx, errors } = await transactions(
    "0xa2e06f2bef43c031d64f05f02c288acaf3b3c15f"
  );
  return {
    props: {
      tx,
      errors,
    }, // will be passed to the page component as props
  };
}
