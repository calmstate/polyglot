import { getOrCreate, updateConfig, restoreUserChoices } from './storageManager.js';
import { supportedLanguages } from './languages.js';
import { getPrompt, Ollama, interfaceText } from './config.js';

(async () => {
    setTimeout(()=>{

        const splashScreen = document.querySelector('#splash-screen');
              splashScreen.remove();
    }, 3000);
    try {
        const inputLanguages = document.querySelector('#input-language');
        const outputLanguages = document.querySelector('#output-language');
        const modelList = document.querySelector('#model-select');
        const translateBtn = document.querySelector('#translate-btn');
        const copyBtn = document.querySelector('#copy-btn');
        const resetBtn = document.querySelector('#reset-btn');
        const inputText = document.querySelector('#input-text');
        const outputText = document.querySelector('#output-text');
        const pinIcon = document.querySelector('#pin-icon');
        const invertBtn = document.querySelector('#inverter');   

        const defaultConfig = {
            model: "",
            input: {
                language: "",
                data: ""
            },
            output: {
                language: "",
                data: ""
            }
        };

        let alwaysOnTop = false;  

        const toggleAlwaysOnTop = async () => {
            alwaysOnTop = !alwaysOnTop;
            pinIcon.classList.toggle('pin-background');
            await Neutralino.window.setAlwaysOnTop(alwaysOnTop);
        };

        const populateLanguageOptions = (selectElement, languages) => {
            selectElement.innerHTML = ''; 
            languages.forEach(lang => {
                const option = document.createElement('option');
                option.value = lang.code;
                option.textContent = lang.name;
                selectElement.appendChild(option);
            });
        };

        const populateModelOptions = async (selectElement) => {
            try {
                const response = await window.fetch(Ollama.tags);
                const data = await response.json();
                const models = data.models || [];

                selectElement.innerHTML = ''; 
                models.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model.name;
                    option.textContent = model.name;
                    selectElement.appendChild(option);
                });
            } catch (error) {
                console.error(interfaceText.error.modelList, error);
            }
        };

        const setInputsDisabled = (disabled) => {
            inputLanguages.disabled = disabled;
            outputLanguages.disabled = disabled;
            modelList.disabled = disabled;
            inputText.disabled = disabled;
            translateBtn.disabled = disabled;
            copyBtn.disabled = disabled;
            resetBtn.disabled = disabled;
        };

        const translateText = async () => {
            const model = modelList.value;
            const inputLanguage = inputLanguages.value;
            const outputLanguage = outputLanguages.value;
            const text = inputText.value;

            if (!model || !inputLanguage || !outputLanguage || !text) {
                return;
            }

            const prompt = getPrompt(inputLanguage, outputLanguage, text);

            setInputsDisabled(true);
            outputText.value = interfaceText.output.translating;

            try {
                const response = await window.fetch(Ollama.generate, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ model, prompt, stream: false }),
                });
                
                const result = await response.json();
                outputText.value = result.response.trim();
            } catch (error) {
                console.error(interfaceText.output.error.failure, error);
                outputText.value = interfaceText.output.error.  ;
            } finally {
                setInputsDisabled(false);
                
                await updateConfig('config', {
                    model: modelList.value ? modelList.value : modelList.querySelector('option').value,
                    inputLanguage: inputLanguages.value,
                    outputLanguage: outputLanguages.value
                });
            }
        };

        const copyToClipboard = () => {
            outputText.select();
            document.execCommand('copy');
        };

        const resetFields = () => {
            inputText.value = '';
            outputText.value = '';
            
            updateConfig('userConfig', {
                model: "",
                inputLanguage: "",
                outputLanguage: ""
            });
        };

        const handleKeyboardShortcuts = (event) => {
            if (event.ctrlKey && event.key === 'Enter') {
                event.preventDefault();
                translateText();
            } else if (event.ctrlKey && event.key === 'c') {
                event.preventDefault();
                copyToClipboard();
            }
        };

        // Função para inverter os idiomas dos seletores
        const invertLanguages = () => {
            const tempLanguage = inputLanguages.value;
            inputLanguages.value = outputLanguages.value;
            outputLanguages.value = tempLanguage;
        };

        document.addEventListener('keydown', handleKeyboardShortcuts);

        await getOrCreate('config', defaultConfig);

        populateLanguageOptions(inputLanguages, supportedLanguages);
        populateLanguageOptions(outputLanguages, supportedLanguages);

        await populateModelOptions(modelList);

        await restoreUserChoices(modelList, inputLanguages, outputLanguages);

        translateBtn.addEventListener('click', translateText);
        copyBtn.addEventListener('click', copyToClipboard);
        resetBtn.addEventListener('click', resetFields);
        pinIcon.addEventListener('click', toggleAlwaysOnTop);
        invertBtn.addEventListener('click', invertLanguages);  // Adiciona o listener ao botão de inverter idiomas

    } catch (error) {
        console.error('Erro ao inicializar a aplicação:', error);
    }
})();
