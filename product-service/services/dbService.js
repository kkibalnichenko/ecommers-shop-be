const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const { DYNAMODB_PRODUCTS_TABLE, DYNAMODB_STOCKS_TABLE } = process.env;

const headers = {
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Credentials': true,
};

const getItems = async (tableName) => {
    const params = { TableName: tableName };
    try {
        const response = await docClient.scan(params).promise();
        return response.Items;
    } catch (err) {
        return err
    }
}

const getItemById = async (id) => {
    const params = {
        TransactItems: [
            {
                Get: {
                    TableName: DYNAMODB_PRODUCTS_TABLE,
                    Key: {
                        id: id
                    }
                }
            },
            {
                Get: {
                    TableName: DYNAMODB_STOCKS_TABLE,
                    Key: {
                        product_id: id
                    }
                }
            }
        ]
    };

    try {
        const response = await docClient.transactGet(params).promise();
        return response.Responses;
    } catch (err) {
        return err
    }
}

const create = async (id, body) => {
    const { description, price, title, count } = body;
    const params = {
        RequestItems: {
            [DYNAMODB_PRODUCTS_TABLE]: [
                {
                    PutRequest: {
                        Item: {
                            "description": description,
                            "id": id,
                            "price": price,
                            "title": title
                        }
                    },
                }
            ],
            [DYNAMODB_STOCKS_TABLE]: [
                {
                    PutRequest: {
                        Item: {
                            "product_id": id,
                            "count": count
                        }
                    },
                }
            ],
        }
    };

    try {
        return await docClient.batchWrite(params).promise();
    } catch (err) {
        return err
    }
}

module.exports = { getItems, getItemById, create, headers };