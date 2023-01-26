import algoliasearch from "algoliasearch";
const client = algoliasearch(
  process.env.APPLICATION_ID_ALGOLIA,
  process.env.API_KEY_ALGOLIA
);

const index = client.initIndex("pets");

export { index };
