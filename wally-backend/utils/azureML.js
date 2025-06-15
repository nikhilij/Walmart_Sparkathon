const axios = require('axios');
const { AZURE_ML_ENDPOINT, AZURE_ML_API_KEY } = require('../config/azure');

const azureMLClient = axios.create({
    baseURL: AZURE_ML_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AZURE_ML_API_KEY}`
    }
});

const predict = async (modelId, data) => {
    try {
        const response = await azureMLClient.post(`/models/${modelId}/predict`, data);
        return response.data;
    } catch (error) {
        throw new Error(`Azure ML Prediction Error: ${error.response ? error.response.data : error.message}`);
    }
};

const getModelDetails = async (modelId) => {
    try {
        const response = await azureMLClient.get(`/models/${modelId}`);
        return response.data;
    } catch (error) {
        throw new Error(`Azure ML Model Details Error: ${error.response ? error.response.data : error.message}`);
    }
};

module.exports = {
    predict,
    getModelDetails
};