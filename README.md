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

## Rainbow Bridge Data API

Rainbow Bridge Explorer ships with API endpoints, allowing allow anyone to fetch Rainbow bridge transaction data.

With just one REST API, you can fetch bridge transactions originating from NEAR, Aurora, and Ethereum.

Query by address or transaction hash from any of these chains - Rainbow Bridge Explorer's API will **auto-detect which chain it originates from**.

`/transactions`: Fetch transactions by user address

`/transactions/[hash]`: Fetch transactions by hash

`/transactions/recent`: Fetch recent transactions

`/assets`: Fetch the most up-to-date list of Rainbow Bridge supported assets (pulls data from the `aurora-is-near/bridge-assets` repo)

`/assets/[symbol]`: Fetch asset metadata by symbol

Try out the API and see the full docs: https://app.swaggerhub.com/apis-docs/karlxlee/rainbow-bridge-explorer/1.0.0

Base URL: `https://rainbow-bridge-explorer.vercel.app/api`

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
