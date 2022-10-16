'use strict';
const { getItemById } = require('../services/dbService');

const headers = {
    'Access-Control-Allow-Origin': "*",
    'Access-Control-Allow-Credentials': true,
};

const getProductsById = async (event) => {
    try {
        const id = event.pathParameters.id;
        const product = await getItemById(id);
        if (!product.Responses[0].Item) {
            return {
                statusCode: 500,
                body: JSON.stringify('Error: Produst has not been found at DB'),
                headers,
            };
        }
        console.log(`Success: Response of transactGet operation to DynamoDB (finding product by Id) ${JSON.stringify(product)}`);

        const productWithUpdatedFormat = !!product.Responses[1].Item ?
            {...product.Responses[0].Item, ...product.Responses[1].Item} : {...product.Responses[0].Item, count: 0};

        return {
            statusCode: 200,
            body: JSON.stringify(productWithUpdatedFormat, null, 2),
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