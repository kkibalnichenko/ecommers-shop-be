'use strict';
const getProductsList = require('./handlers/getProductsList');
const getProductsById = require('./handlers/getProductsById');
const createProduct = require('./handlers/createProduct');

module.exports = { getProductsList, getProductsById, createProduct };