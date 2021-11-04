import BigNumber from "bignumber.js";
import { client } from "../apollo/client";
import { TOP_PAIRS, PAIRS_VOLUME_QUERY } from "../apollo/queries";
import { getBlockFromTimestamp } from "../blocks/queries";
import { PAIR_FROM_TOKENS, SWAPS_BY_PAIR } from "../apollo/queries";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const getAllPairs = async () => {
  const epochSecond = Math.floor(new Date().getTime() / 1000);
  const firstBlock = await getBlockFromTimestamp(epochSecond - 86400);
  if (!firstBlock) {
    return { error: new Error("first block was not fetched") };
  }

  const {
    data: { pairs },
    errors: error,
  } = await client.query({
    query: TOP_PAIRS,
    variables: {
      limit: 100,
      excludeTokenIds: [""],
    },
    fetchPolicy: "cache-first",
  });

  if (error && error.length > 0) {
    console.error("Failed to fetch top pairs", error);
    return { error: new Error("Failed to fetch top pairs from the subgraph") };
  }

  const {
    data: { pairVolumes },
    errors: yesterdayVolumeErrors,
  } = await client.query({
    query: PAIRS_VOLUME_QUERY,
    variables: {
      limit: 100,
      pairIds: pairs.map((pair: any) => pair.id),
      blockNumber: +firstBlock,
    },
    fetchPolicy: "no-cache",
  });

  if (yesterdayVolumeErrors && yesterdayVolumeErrors.length > 0) {
    console.error("Failed to fetch yesterday volume", yesterdayVolumeErrors);
    throw {
      error: new Error(
        `Failed to get volume info for 24h ago from the subgraph`
      ),
    };
  }

  const yesterdayVolumeIndex =
    pairVolumes?.reduce((memo: any, pair: any) => {
      memo[pair.id] = {
        volumeToken0: new BigNumber(pair.volumeToken0),
        volumeToken1: new BigNumber(pair.volumeToken1),
      };
      return memo;
    }, {}) ?? {};

  const tokenPairs = pairs.map((pair: any) => {
    const yesterday = yesterdayVolumeIndex[pair.id];
    if (yesterday) {
      if (yesterday.volumeToken0.gt(pair.volumeToken0)) {
        return {
          error: new Error(
            `Invalid subgraph response: pair ${pair.id} returned volumeToken0 < yesterday.volumeToken0`
          ),
        };
      }
      if (yesterday.volumeToken1.gt(pair.volumeToken1)) {
        return {
          error: new Error(
            `Invalid subgraph response: pair ${pair.id} returned volumeToken1 < yesterday.volumeToken1`
          ),
        };
      }
    }

    return {
      ...pair,
      price:
        pair.reserve0 !== "0" && pair.reserve1 !== "0"
          ? new BigNumber(pair.reserve1).dividedBy(pair.reserve0).toString()
          : undefined,
      previous24hVolumeToken0:
        pair.volumeToken0 && yesterday?.volumeToken0
          ? new BigNumber(pair.volumeToken0).minus(yesterday.volumeToken0)
          : new BigNumber(pair.volumeToken0),
      previous24hVolumeToken1:
        pair.volumeToken1 && yesterday?.volumeToken1
          ? new BigNumber(pair.volumeToken1).minus(yesterday.volumeToken1)
          : new BigNumber(pair.volumeToken1),
    };
  });

  return { pairs: tokenPairs, error };
};

export function get24HoursAgo(): number {
  return Math.floor((Date.now() - DAY) / 1000);
}

function isSorted(tokenA: string, tokenB: string): boolean {
  return tokenA.toLowerCase() < tokenB.toLowerCase();
}

function sortedFormatted(tokenA: string, tokenB: string): [string, string] {
  return isSorted(tokenA, tokenB)
    ? [tokenA.toLowerCase(), tokenB.toLowerCase()]
    : [tokenB.toLowerCase(), tokenA.toLowerCase()];
}

export async function getSwaps(tokenA: string, tokenB: string): Promise<any[]> {
  const _24HoursAgo = get24HoursAgo();
  const [token0, token1] = sortedFormatted(tokenA, tokenB);

  let {
    data: {
      pairs: [{ id: pairAddress }],
    },
  } = await client.query({
    query: PAIR_FROM_TOKENS,
    variables: {
      token0,
      token1,
    },
  });

  const sorted = isSorted(tokenA, tokenB);
  let skip = 0;
  let results: any[] = [];
  let finished = false;
  while (!finished) {
    await client
      .query({
        query: SWAPS_BY_PAIR,
        variables: {
          skip,
          pairAddress,
          timestamp: _24HoursAgo,
        },
      })
      .then(({ data: { swaps } }): void => {
        if (!swaps || swaps.length === 0) {
          finished = true;
        } else {
          skip += swaps.length;

          results = results.concat(
            swaps.map((swap: any) => ({
              ...swap,
              amountAIn: sorted ? swap.amount0In : swap.amount1In,
              amountAOut: sorted ? swap.amount0Out : swap.amount1Out,
              amountBIn: sorted ? swap.amount1In : swap.amount0In,
              amountBOut: sorted ? swap.amount1Out : swap.amount0Out,
            }))
          );
        }
      });
  }

  return results;
}
