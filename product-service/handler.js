'use strict';
const getProductsList = require('./handlers/getProductsList');
const getProductsById = require('./handlers/getProductsById');
const createProduct = require('./handlers/createProduct');
require('dotenv').config();

module.exports = { getProductsList, getProductsById, createProduct };