/**
 * Services Index - Centralized exports for all service modules
 * This file provides a single point of import for all services
 */

const chatService = require('./chatService');
const productService = require('./productService');
const reviewService = require('./reviewService');
const userService = require('./userService');
const azureService = require('./azureService');

module.exports = {
  chatService,
  productService,
  reviewService,
  userService,
  azureService
};
