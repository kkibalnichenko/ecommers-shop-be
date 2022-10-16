'use strict';
const { getItems } = require('../services/dbService');
const { DYNAMODB_PRODUCTS_TABLE, DYNAMODB_STOCKS_TABLE } = process.env;

const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Credentials': true,
};

const getProductsList = async (event) => {
    try {
        const products = await getItems(DYNAMODB_PRODUCTS_TABLE);
        const stocks = await getItems(DYNAMODB_STOCKS_TABLE);

        if (!products.Items || !products.Items.length) {
            return {
                statusCode: 500,
                body: JSON.stringify('Error: Produsts has not been found at DB'),
                headers,
            };
        }
        if (!stocks.Items || !stocks.Items.length) {
            return {
                statusCode: 500,
                body: JSON.stringify('Error: Stocks has not been found at DB'),
                headers,
            };
        }
        console.log(`Success: Response of scan operation to DynamoDB Products table ${JSON.stringify(products)}`);
        console.log(`Success: Response of scan operation to DynamoDB Stocks table ${JSON.stringify(stocks)}`);

        const productsWithUpdatedFormat = products.Items.map(product => {
            const appropriateStock = stocks.Items.find(stock => stock.product_id === product.id);
            return appropriateStock ? {...product, ...appropriateStock} : {...product, count: 0};
        });

        return {
            statusCode: 200,
            body: JSON.stringify(productsWithUpdatedFormat, null, 2),
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