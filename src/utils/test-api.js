import { fetchHotMoneyData } from './api.js';
import fs from 'fs';
import path from 'path';

// 确保数据目录存在
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 保存数据到本地文件
async function saveDataToFile(date, data) {
  const filePath = path.join(DATA_DIR, `hot_money_${date}.json`);
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`Data saved to ${filePath}`);
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
}

async function testApi() {
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log('Fetching data for date:', today);
    
    const data = await fetchHotMoneyData(today);
    console.log('Successfully fetched data:');
    console.log('Number of items:', data.length);
    if (data.length > 0) {
      console.log('Sample item:', JSON.stringify(data[0], null, 2));
    }
    
    // 保存数据到本地文件
    await saveDataToFile(today, data);
    console.log('Data has been saved to the data directory');
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testApi();
