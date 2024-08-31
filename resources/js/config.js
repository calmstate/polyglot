const getPrompt = (inputLanguage, outputLanguage, text) =>{
        return `Translate from ${inputLanguage} to ${outputLanguage}, the text: ${text}. Response only with the text translated and nothing more.`;
};
 
const Ollama = {
    tags: 'http://localhost:11434/api/tags',
    generate: 'http://localhost:11434/api/generate'
};

const interfaceText = {
    error: {
        modelList: 'Error loading models:'
    },
    output:{
        translating: 'Translating...',
        error: {
            failure: 'Translation error:',
            failureTitle: 'Translation error.'
        }
    }
};

export { getPrompt, Ollama, interfaceText};