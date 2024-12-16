// App.jsx
import React, { useEffect, useState } from 'react';
import HotMoneyDashboard from './HotMoneyDashboard';
import { fetchHotMoneyData } from './utils/api';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        // 尝试获取今天的数据
        try {
          const todayData = await fetchHotMoneyData(today);
          setData(todayData);
          console.log('Using today\'s data');
          return;
        } catch (e) {
          console.log('Today\'s data not found, trying yesterday\'s data');
        }

        // 如果今天的数据获取失败，尝试获取昨天的数据
        const yesterdayData = await fetchHotMoneyData(yesterday);
        setData(yesterdayData);
        console.log('Using yesterday\'s data');
      } catch (error) {
        console.error('Error loading data:', error);
        setError('无法获取数据，请稍后再试');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex justify-center items-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Loading...</div>
          <div className="text-gray-500">Please wait for the data to load.</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex justify-center items-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Error</div>
          <div className="text-gray-500">{error}</div>
        </div>
      </div>
    );
  }

  return <HotMoneyDashboard jsonData={data} />;
}

export default App;