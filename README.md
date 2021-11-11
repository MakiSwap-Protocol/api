# Makiswap Rest API

Show analytics data for MakiSwap.

Here are the api endpoints.

1. **/pairs**: Show all trading pairs

2. **/tickers**: Show detailed data for all trading pairs

3. **/orderbook**: Show buy and sell orders. Need to set `ticker_id` and `depth` parameters. If `depth` parameter was not set, it will set `depth` to 1000 and return 500 buy orders and 500 ask orders. i.e. `/orderbook?ticker_id=HUSD_HBTC&depth=100`.

4. **/historical_trades**: Show successful trades. Need to set `ticker_id` and `depth` parameters like `/orderbook` endpoint. i.e. `/historical_trades?ticker_id=HUSD_HBTC&limit=100`

5. **/assets**: show detailed data for all currencies available on our exchange
