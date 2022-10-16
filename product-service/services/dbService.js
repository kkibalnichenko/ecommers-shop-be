const AWS = require('aws-sdk');
AWS.config.update({ region: "eu-west-1" });
const docClient = new AWS.DynamoDB.DocumentClient();
// const dynamodb = new AWS.DynamoDB();

const { DYNAMODB_PRODUCTS_TABLE, DYNAMODB_STOCKS_TABLE } = process.env;

const getItems = async (tableName) => {
    const params = { TableName: tableName };
    try {
        return await docClient.scan(params).promise();
    } catch (err) {
        return err
    }
}

const getItemById = async (id) => {
    const params = {
        TransactItems: [
            {
                Get: {
                    TableName: 'Products',
                    Key: {
                        id: id
                    }
                }
            },
            {
                Get: {
                    TableName: 'Stocks',
                    Key: {
                        product_id: id
                    }
                }
            }
        ]
    };

    try {
        return await docClient.transactGet(params).promise();
    } catch (err) {
        return err
    }
}

const create = async (id, body) => {
    console.log('body', body);
    console.log('id', id);
    // const params = {
    //     TransactItems: [
    //         {
    //             Put: {
    //                 TableName: 'Products',
    //                 Item: {
    //                     'description': { 'S': body.description },
    //                     'price': { 'N': body.price },
    //                     'title': { 'S': body.title },
    //                     'id': { 'S': id }
    //                 },
    //                 // ConditionExpression: 'attribute_not_exists(Id)'
    //             }
    //         },
    //         {
    //             Put: {
    //                 TableName: 'Stocks',
    //                 Item: {
    //                     'count': { 'N': body.count },
    //                     'product_id': { 'S': id }
    //                 },
    //                 // ConditionExpression: 'attribute_not_exists(Product_id)'
    //             }
    //         }
    //     ]
    // };
    const params = {
        RequestItems: {
            'Products': [
                {
                    PutRequest: {
                        Item: {
                            "description": {
                                "S": body.description
                            },
                            "id": {
                                "S": id
                            },
                            "price": {
                                "N": body.price
                            },
                            "title": {
                                "S": body.title
                            }
                        }
                    },
                }
            ],
            'Stocks': [
                {
                    PutRequest: {
                        Item: {
                            "product_id": {
                                "S": id
                            },
                            "count": {
                                "N": `${body.count}`
                            }
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

module.exports = { getItems, getItemById, create };