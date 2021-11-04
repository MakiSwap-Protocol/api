import { Request, Response } from "express";
import BigNumber from "bignumber.js";
import { getAllPairs } from "../utils";
import { client } from "../apollo/client";
import { PAIR_FROM_NAME } from "../apollo/queries";
import { computeBidsAsks } from "../utils/computeBidsAsks";

const getPairs = async (req: Request, res: Response) => {
  const { pairs, error } = await getAllPairs();
  if (error) {
    return res.status(404).json({
      error: JSON.stringify(error),
    });
  }
  const tokenPairs = pairs.map((pair: any) => {
    return {
      ticker_id: pair.token0.symbol + "_" + pair.token1.symbol,
      base: pair.token0.symbol,
      target: pair.token1.symbol,
    };
  });
  return res.status(200).json(tokenPairs);
};

const getTickers = async (req: Request, res: Response) => {
  const { pairs, error } = await getAllPairs();
  if (error) {
    return res.status(404).json({
      message: JSON.stringify(error),
    });
  }
  const tickers = pairs.map((pair: any) => {
    const bidAsks = computeBidsAsks(
      new BigNumber(pair.reserve0),
      new BigNumber(pair.reserve1)
    );
    return {
      ticker_id: pair.token0.symbol + "_" + pair.token1.symbol,
      base_currrency: pair.token0.symbol,
      target_currency: pair.token1.symbol,
      last_price: pair.price,
      base_volume: pair.previous24hVolumeToken0.toString(),
      target_volume: pair.previous24hVolumeToken1.toString(),
      bid: Math.max(...bidAsks.bids.map((bid) => Number(bid[1]))),
      ask: Math.min(...bidAsks.asks.map((ask) => Number(ask[1]))),
    };
  });
  return res.status(200).json(tickers);
};

const getOrderbook = async (req: Request, res: Response) => {
  const {
    data: { pairs },
    errors: error,
  } = await client.query({
    query: PAIR_FROM_NAME,
    variables: {
      name: req.query.ticker_id?.toString().replace("_", "-"),
    },
    fetchPolicy: "cache-first",
  });
  if (error && error.length > 0) {
    return res.status(404).json({
      error: JSON.stringify(error),
    });
  }
  const bidAsks = computeBidsAsks(
    new BigNumber(pairs[0].reserve0),
    new BigNumber(pairs[0].reserve1),
    Number(req.query.depth) === 0 ? 1000 : Number(req.query.depth) / 2
  );
  const pairInfo = {
    ticker_id: req.query.ticker_id,
    timestamp: pairs[0].timestamp,
    ...bidAsks,
  };
  return res.status(200).json(pairInfo);
};

export default { getPairs, getTickers, getOrderbook };
