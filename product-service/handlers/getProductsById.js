'use strict';
const { getItemById, headers } = require('../services/dbService');

const getProductsById = async (event) => {
    const id = event['pathParameters'].id;
    try {
        const product = await getItemById(id);
        if (!product[0].Item) {
            return {
                statusCode: 400,
                body: JSON.stringify('Error: Product has not been found at DB'),
                headers,
            };
        }
        console.log(`Success: Response of transactGet operation to DynamoDB (finding product by Id) ${JSON.stringify(product)}`);

        const productWithUpdatedFormat = !!product[1].Item ?
            {...product[0].Item, ...product[1].Item} : {...product[0].Item, count: 0};

        return {
            statusCode: 200,
            body: JSON.stringify(productWithUpdatedFormat),
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