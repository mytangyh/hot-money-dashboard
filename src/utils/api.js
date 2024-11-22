import axios from 'axios';

const BASE_URL = 'https://data.10jqka.com.cn/dataapi/transaction/stock/v1/list';

export async function checkDataExists(date) {
  try {
    // 使用动态导入加载本地 JSON 文件
    const data = await import(`../data/hot_money_${date}.json`);
    return { exists: true, data };
  } catch (error) {
    console.log('Data not found for date:', date);
    return { exists: false };
  }
}

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
      return response.data.data.items;
    } else {
      throw new Error(response.data.status_msg || 'Failed to fetch data');
    }
  } catch (error) {
    console.error('Error fetching hot money data:', error);
    throw error;
  }
}