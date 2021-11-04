import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import fetch from "node-fetch";

export const client = new ApolloClient({
  link: new HttpLink({
    fetch: fetch as any,
    uri: "https://n10.hg.network/subgraphs/name/makiexchange/heco",
  }),
  cache: new InMemoryCache(),
});
