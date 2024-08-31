export async function getOrCreate(key, defaultObject) {
  try {
    let keys = await Neutralino.storage.getKeys();

    if (!keys.includes(key)) {
      let data = JSON.stringify(defaultObject);
      await Neutralino.storage.setData(key, data);
      return defaultObject;
    } else {
      let data = await Neutralino.storage.getData(key);
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Erro ao acessar o armazenamento para a chave ${key}:`, error);
    throw error;
  }
}

export async function updateConfig(key, updatedPart) {
try {
  let config = await getOrCreate(key, {});
  const updatedConfig = updatedPart;
  await Neutralino.storage.setData(key, JSON.stringify(updatedConfig));
} catch (error) {
  console.error(`Erro ao atualizar o armazenamento para a chave ${key}:`, error);
  throw error;
}
}  

export async function restoreUserChoices(modelList, inputLanguages, outputLanguages) {
try {
  const savedConfig = await getOrCreate('config', {});
  console.log(savedConfig);
  if (savedConfig.model) modelList.value = savedConfig.model;
  if (savedConfig.inputLanguage) inputLanguages.value = savedConfig.inputLanguage;
  if (savedConfig.outputLanguage) outputLanguages.value = savedConfig.outputLanguage;
} catch (error) {
  console.error('Erro ao restaurar as configurações do usuário:', error);
}
};