module.exports = {
    azure: {
        subscriptionKey: process.env.AZURE_SUBSCRIPTION_KEY,
        endpoint: process.env.AZURE_ENDPOINT,
        region: process.env.AZURE_REGION,
    },
    cognitiveServices: {
        speech: {
            key: process.env.AZURE_SPEECH_KEY,
            region: process.env.AZURE_SPEECH_REGION,
        },
        language: {
            key: process.env.AZURE_LANGUAGE_KEY,
            endpoint: process.env.AZURE_LANGUAGE_ENDPOINT,
        },
        machineLearning: {
            key: process.env.AZURE_ML_KEY,
            endpoint: process.env.AZURE_ML_ENDPOINT,
        },
    },
};