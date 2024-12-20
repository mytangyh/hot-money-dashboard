import axios from 'axios';

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
      },
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (response.data.status_code === 0) {
      return response.data;
    } else {
      throw new Error(response.data.status_msg || 'Failed to fetch data');
    }
  } catch (error) {
    console.error('Error fetching hot money data:', error);
    throw error;
  }
}