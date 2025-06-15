const { SpeechConfig, AudioConfig, SpeechRecognizer, SpeechSynthesizer } = require('microsoft-cognitiveservices-speech-sdk');
const { AZURE_SPEECH_KEY, AZURE_REGION } = require('../config/azure');

// Initialize speech configuration
const speechConfig = SpeechConfig.fromSubscription(AZURE_SPEECH_KEY, AZURE_REGION);

// Function for speech recognition
const recognizeSpeech = async (audioFilePath) => {
    const audioConfig = AudioConfig.fromAudioFileInput(audioFilePath);
    const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

    return new Promise((resolve, reject) => {
        recognizer.recognizeOnceAsync(result => {
            if (result.reason === ResultReason.RecognizedSpeech) {
                resolve(result.text);
            } else {
                reject(new Error('Speech recognition failed.'));
            }
            recognizer.close();
        });
    });
};

// Function for speech synthesis
const synthesizeSpeech = async (text) => {
    const synthesizer = new SpeechSynthesizer(speechConfig);

    return new Promise((resolve, reject) => {
        synthesizer.speakTextAsync(text, result => {
            if (result.reason === ResultReason.SynthesizingAudioCompleted) {
                resolve('Speech synthesis completed.');
            } else {
                reject(new Error('Speech synthesis failed.'));
            }
            synthesizer.close();
        });
    });
};

module.exports = {
    recognizeSpeech,
    synthesizeSpeech
};