# 🌈 Rainbow Bridge Explorer

### Live demo: https://rainbow-bridge-explorer.vercel.app

For the NEAR MetaBUILD Hackathon

Rainbow Bridge Explorer is both a front-end and a public REST API for exploring bridge transactions between NEAR, Aurora, and Ethereum.

## Intro

Rainbow Bridge is a key connector and a driver of the multi-chain future that NEAR is building.

The official Rainbow Bridge frontend allows users to check on their own past and pending cross-chain transactions.

However, monitoring other users' bridge transactions and the assets moving through Rainbow Bridge is not as easy. There is currently no unified way to check and explore bridge transactions.

Bridge-wide stats and transaction info will be of interest to stakeholders and investors that are looking to move capital into the NEAR ecosystem.

Additionally, DeFi project teams looking to integrate with Rainbow Bridge will want to monitor the current state of bridge activity.

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

## Local development

- Run `yarn install` or `npm install`
- Check .env.example and create your own .env file with keys filled in (enter your own Etherscan API key and an Infura project ID)
- Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy

The easiest way to deploy is with Vercel. You'll be prompted to fill in the required environment variables (enter your own Etherscan API key and an Infura project ID):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkarlxlee%2Frainbow-bridge-explorer&env=ETHERSCAN_KEY,INFURA_PROJECT_ID)
