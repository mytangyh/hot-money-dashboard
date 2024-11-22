// App.jsx
import React, { useEffect, useState } from 'react';
import HotMoneyDashboard from './HotMoneyDashboard';
import { fetchHotMoneyData, checkDataExists } from './utils/api';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAndFetchData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        setLoading(true);
        
        // First check if we have today's data
        const { exists, data: existingData } = await checkDataExists(today);
        
        if (exists) {
          setData(existingData);
          console.log('Using existing data');
        } else {
          // Fetch new data if it doesn't exist
          console.log('Fetching new data...');
          const newData = await fetchHotMoneyData(today);
          setData(newData);
          console.log('Data fetched successfully');
        }
      } catch (error) {
        console.error('Error checking/fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkAndFetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <HotMoneyDashboard data={data} />
    </div>
  );
}

export default App;