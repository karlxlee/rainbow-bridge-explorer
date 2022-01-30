# 🌈 Rainbow Bridge Explorer

For the NEAR MetaBUILD Hackathon

Rainbow Bridge Explorer is both a front-end and a public REST API for exploring bridge transactions between NEAR, Aurora, and Ethereum.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

## API docs

Base URL: `https://rainbow-bridge-explorer.vercel.app/api`

Based off Stripe's API format

`/transactions/[hash]`
Get a single bridge transaction by hash

`/transactions?address=[address]`
Get bridge transactions for a given address

`/transactions/recent`
Get recent bridge transactions across all chains (in development)

## Project Sustainability

### Upgrading / changing the bridge contracts

Bridge contracts may need to be upgraded to newer versions, changing key contract addresses. Rainbow Bridge Explorer can easily adapt to new contract addresses. Simply update `/config/bridgeAddresses.json`.

### Adding new chains

As Rainbow Bridge connects new chains, Rainbow Bridge Explorer can be upgraded to support them. Adding a new chain involves:

1. Adding the chain's bridge addresses (token lockers) to `/config/bridgeAddresses.json`
2. Writing a query for transactions originating from the chain in `/queries`
3. Adding the query to the api routes in `/api`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
