const products = require('../mocks/products');

const getProducts = async () => {
    return Promise.resolve(products);
}

const getProductElemById = async (id) => {
    const product = products.find(elem => elem.id === id);
    return Promise.resolve(product);
}

module.exports = { getProducts, getProductElemById };