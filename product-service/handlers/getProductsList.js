'use strict';
const { getItems, headers } = require('../services/dbService');
const { DYNAMODB_PRODUCTS_TABLE, DYNAMODB_STOCKS_TABLE } = process.env;

const getProductsList = async () => {
    try {
        const products = await getItems(DYNAMODB_PRODUCTS_TABLE);
        const stocks = await getItems(DYNAMODB_STOCKS_TABLE);

        if (!products || !products.length) {
            return {
                statusCode: 500,
                body: JSON.stringify('Error: Products has not been found at DB'),
                headers,
            };
        }
        if (!stocks || !stocks.length) {
            return {
                statusCode: 500,
                body: JSON.stringify('Error: Stocks has not been found at DB'),
                headers,
            };
        }
        console.log(`Success: Response of scan operation to DynamoDB Products table ${JSON.stringify(products)}`);
        console.log(`Success: Response of scan operation to DynamoDB Stocks table ${JSON.stringify(stocks)}`);

        const productsWithUpdatedFormat = products.map(product => {
            const appropriateStock = stocks.find(stock => stock.product_id === product.id);
            return appropriateStock ? {...product, ...appropriateStock} : {...product, count: 0};
        });

        return {
            statusCode: 200,
            body: JSON.stringify(productsWithUpdatedFormat),
            headers,
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: err,
            headers,
        };
    }
}

module.exports = getProductsList;