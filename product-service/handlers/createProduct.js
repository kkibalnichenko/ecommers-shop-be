'use strict';
const uuid = require('uuid');
const { create, headers } = require('../services/dbService');

const createProduct = async (event) => {
    const body = JSON.parse(event.body);
    const id = uuid.v4();

    try {
        if (!body || !body.description || !body.title || !body.price || !body.count) {
            return {
                statusCode: 400,
                body: JSON.stringify('Error: Body is incorrect. Mandatory params: description, title, price, count'),
                headers,
            };
        }

        const product = await create(id, body);

        if (Object.keys(product).includes('UnprocessedItems')) {
            console.log(`Product was successfully added: ${JSON.stringify({ id, ...body })}`);
            return {
                statusCode: 200,
                body: JSON.stringify({ id, ...body }),
                headers,
            }
        }

        return {
            statusCode: 400,
            body: JSON.stringify('Error: Product has not been added to DB'),
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

module.exports = createProduct;