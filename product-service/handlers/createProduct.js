'use strict';
const { v4: uuidv4 } = require('uuid');
const { create } = require('../services/dbService');
const { DYNAMODB_PRODUCTS_TABLE, DYNAMODB_STOCKS_TABLE } = process.env;

const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Credentials': true,
};

const createProduct = async (event) => {
    const body = event.body;
    const id = uuidv4();
    // console.log('body', body);
    // console.log('id', id);

    try {
        if (!body) {
            return {
                statusCode: 500,
                body: JSON.stringify('Error: Body is equal to null. Please, add next params: description, title, price, count'),
                headers,
            };
        }
        const product = await create(id, body);
        console.log('product', product);

        // return {
        //     statusCode: 200,
        //     body: JSON.stringify(productsWithUpdatedFormat, null, 2),
        //     headers,
        // }
    } catch (err) {
        return {
            statusCode: 500,
            body: err,
            headers,
        };
    }
}

module.exports = createProduct;