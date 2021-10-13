const axios = require('axios');
const { signature } = require('../utils/signature');
const { PAIR_URL, TICKERS_URL, ORDERBOOK_URL, TRADES_URL } = require('../constants/urls');

class spotController {
    async getPairs(req, res, next) {
        try {

            const timestamp = new Date().getTime();
            const fullUrl = `${PAIR_URL}`;
            const headers = {};
            const details = "";
            headers['Content-Type'] = 'application/json';
            headers['X-Api-Signature'] = signature(fullUrl, details);

            const config = {
                method: "GET",
                url: fullUrl,
                headers: headers,
            }

            const response = await axios(config);
            res.send(response.data);

        } catch (error) {
            res.status(400).send(error);
            return;
        }
        return;
    }
    async getTickers(req, res, next) {
        try {

            const timestamp = new Date().getTime();
            const fullUrl = `${TICKERS_URL}`;
            const headers = {};
            const details = "";
            headers['Content-Type'] = 'application/json';
            headers['X-Api-Signature'] = signature(fullUrl, details);

            const config = {
                method: "GET",
                url: fullUrl,
                headers: headers,
            }

            const response = await axios(config);
            res.send(response.data);

            const pairs = await getTopPairs()
            return createSuccessResponse(
                pairs.reduce<ReturnShape>((accumulator, pair) => {
                const id0 = getAddress(pair.token0.id)
                const id1 = getAddress(pair.token1.id)
        
                accumulator[`${id0}_${id1}`] = {
                    base_id: id0,
                    base_name: pair.token0.name,
                    base_symbol: pair.token0.symbol,
                    quote_id: id1,
                    quote_name: pair.token1.name,
                    quote_symbol: pair.token1.symbol,
                    last_price: pair.price ?? '0',
                    base_volume: pair.previous24hVolumeToken0.toString(),
                    quote_volume: pair.previous24hVolumeToken1.toString()
                }
        
                return accumulator
                }, {})
            )

        } catch (error) {
            res.status(400).send(error);
            return;
        }
        return;
    }
    async getOrderBook(req, res, next) {
        try {

            const timestamp = new Date().getTime();
            const fullUrl = `${ORDERBOOK_URL}`;
            const headers = {};
            const details = "";
            headers['Content-Type'] = 'application/json';
            headers['X-Api-Signature'] = signature(fullUrl, details);

            const config = {
                method: "GET",
                url: fullUrl,
                headers: headers,
            }

            const response = await axios(config);

            if (!event.pathParameters?.pair || !/^0x[0-9a-fA-F]{40}_0x[0-9a-fA-F]{40}$/.test(event.pathParameters.pair)) {
                return createBadRequestResponse('Invalid pair identifier: must be of format tokenAddress_tokenAddress')
            }
            
            const [tokenA, tokenB] = event.pathParameters?.pair.split('_')
            let idA, idB
            ;[idA, idB] = [getAddress(tokenA), getAddress(tokenB)]
        
            const [reservesA, reservesB] = await getReserves(idA, idB)
        
            const timestamp = new Date().getTime()
            res.send(response.data);
        
            return createSuccessResponse({
                timestamp,
                ...computeBidsAsks(new BigNumber(reservesA), new BigNumber(reservesB))
            })

        } catch (error) {
            res.status(400).send(error);
            return;
        }
        return;
    }
    async getTrades(req, res, next) {
        const fullUrl = `${TRADES_URL}`;
        const headers = {};
        const details = "";
        headers['Content-Type'] = 'application/json';
        headers['X-Api-Signature'] = signature(fullUrl, details);

        const config = {
            method: "GET",
            url: fullUrl,
            headers: headers,
        }

        const response = await axios(config);
        if (!event.pathParameters?.pair || !/^0x[0-9a-fA-F]{40}_0x[0-9a-fA-F]{40}$/.test(event.pathParameters.pair)) {
            return createBadRequestResponse('Invalid pair identifier: must be of format tokenAddress_tokenAddress')
        }
    
        const [tokenA, tokenB] = event.pathParameters.pair.split('_')
        let idA, idB
        try {
            ;[idA, idB] = [getAddress(tokenA), getAddress(tokenB)]
        } catch (error) {
            return createBadRequestResponse('Invalid pair identifier: both asset identifiers must be *checksummed* addresses')
        }
    
        try {
            const swaps = await getSwaps(idA, idB)
        
            return createSuccessResponse(
                swaps.map(swap => {
                const aIn = swap.amountAIn !== '0'
                const aOut = swap.amountAOut !== '0'
                const bIn = swap.amountBIn !== '0'
                const bOut = swap.amountBOut !== '0'
        
                // a is the base so if the pair sends a and not b then it's a 'buy'
                const isBuy = aOut && bIn && !aIn && !bOut
                const isSell = !aOut && !bIn && aIn && bOut
                const isBorrowBoth = aOut && bOut && aIn && bIn
        
                const type = isBuy ? 'buy' : isSell ? 'sell' : isBorrowBoth ? 'borrow-both' : '???'
                const baseAmount = aOut ? swap.amountAOut : swap.amountAIn
                const quoteAmount = bOut ? swap.amountBOut : swap.amountBIn
                return {
                    trade_id: swap.id,
                    base_volume: baseAmount,
                    quote_volume: quoteAmount,
                    type,
                    trade_timestamp: swap.timestamp,
                    price:
                    baseAmount !== '0' ? new BigNumber(quoteAmount).dividedBy(new BigNumber(baseAmount)).toString() : undefined
                }
                })
            )
        } catch (error) {
            return createServerErrorResponse(error)
        }
        return;
    }
}

module.exports = {
    spotController: new spotController()
}