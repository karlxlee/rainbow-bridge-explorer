import { Sequelize, QueryTypes } from "sequelize";

const indexer = new Sequelize(
  "postgres://public_readonly:nearprotocol@mainnet.db.explorer.indexer.near.dev/mainnet_explorer"
);

module.exports = {
  indexer,
  QueryTypes,
};
