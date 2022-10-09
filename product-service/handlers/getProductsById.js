'use strict';
const { getProductElemById } = require('../services/product');

const getProductsById = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Allow-Credentials': true,
    };

    try {
        const id = event.pathParameters.id;
        const product = await getProductElemById(id);
        if (product) {
            return {
                statusCode: 200,
                body: JSON.stringify(product, null, 2),
                headers,
            };
        }

        return {
            statusCode: 404,
            body: 'Produst has not been found',
            headers,
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: err,
            headers,
        };
    }
};

module.exports = getProductsById;