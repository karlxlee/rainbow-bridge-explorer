import { Sequelize, QueryTypes } from "sequelize";
import pg from "pg";

const indexer = new Sequelize(
  "postgres://public_readonly:nearprotocol@mainnet.db.explorer.indexer.near.dev/mainnet_explorer",
  {
    dialect: "postgres",
    dialectModule: pg,
  }
);
(async () => {
  try {
    await indexer.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
module.exports = {
  indexer,
  QueryTypes,
};
