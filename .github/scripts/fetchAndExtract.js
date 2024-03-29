const axios = require('axios');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

async function fetchData() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  
  const url = `https://freeclash.org/wp-content/uploads/${year}/${month}/${month}${day}.yaml`;
  console.log(url);
  const response = await axios.get(url);
  return response.data;
}

function extractContent(yamlData) {
  const parsedYaml = yaml.load(yamlData);
  if(parsedYaml.proxies === undefined){
    console.error("Error:", "invalid yaml data");
    process.exit(1);
  }
  return yaml.dump({ proxies: parsedYaml.proxies }, { flowLevel: 2 });
}

async function saveToFile(content) {
  const filePath = path.join(process.cwd(), 'proxies.yaml')
  fs.writeFileSync(filePath, content);
}

async function run() {
  try {
    const yamlData = await fetchData();
    const extractedContent = extractContent(yamlData);
    console.log('Extracted Content:', extractedContent);

    // 保存到文件
    await saveToFile(extractedContent);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

run();
