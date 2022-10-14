'use strict';
const { getProducts } = require('../services/product')

const getProductsList = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Allow-Credentials': true,
    };
    
    try {
        const products = await getProducts();
        if (products) {
            return {
                statusCode: 200,
                body: JSON.stringify(products, null, 2),
                headers,
            };
        }

        return {
            statusCode: 404,
            body: 'Produsts list has not been found',
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

module.exports = getProductsList;