import { fetchHotMoneyData } from './api.js';

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
    
    console.log('Data has been saved to the data directory');
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testApi();
