import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://data.10jqka.com.cn/dataapi/transaction/stock/v1/list';

export async function fetchHotMoneyData(date) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        order_field: 'hot_money_net_value',
        order_type: 'desc',
        date: date,
        filter: '',
        page: 1,
        size: '',
        module: 'hot_money',
        order_null_greater: 0
      }
    });

    if (response.data.status_code === 0) {
      // Create data directory if it doesn't exist
      const dataDir = path.join(process.cwd(), 'data');
      try {
        await fs.mkdir(dataDir, { recursive: true });
      } catch (err) {
        if (err.code !== 'EEXIST') throw err;
      }

      // Save response to JSON file
      const fileName = `hot_money_${date}.json`;
      const filePath = path.join(dataDir, fileName);
      await fs.writeFile(filePath, JSON.stringify(response.data, null, 2));

      return response.data.data.items;
    } else {
      throw new Error(response.data.status_msg || 'Failed to fetch data');
    }
  } catch (error) {
    console.error('Error fetching hot money data:', error);
    throw error;
  }
}
