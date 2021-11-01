import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import fetch from "node-fetch";

export default new ApolloClient({
  link: new HttpLink({
    fetch,
    uri: "https://n10.hg.network/subgraphs/name/makiexchange/heco",
  }),
  cache: new InMemoryCache(),
});
