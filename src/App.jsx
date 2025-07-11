import React, { useEffect, useState } from 'react';
import HotMoneyDashboard from './HotMoneyDashboard';
import { fetchHotMoneyData } from './utils/api';

function App() {
  const [data, setData] = useState(() => {
    const cached = localStorage.getItem('hotMoneyData');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // 获取今天的数据
        const todayData = await fetchHotMoneyData(today);
        if (todayData?.data?.items?.length > 0) {
          setData(todayData);
          console.log(" App Using today's data");
        } else {
          console.log("Today's data is empty, trying yesterday's data");

          const yesterdayData = await fetchHotMoneyData(yesterday);
          if (yesterdayData?.data?.items?.length > 0) {
            setData(yesterdayData);
            console.log("App Using yesterday's data");
          } else {
            throw new Error('今天和昨天的数据都为空');
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('无法获取数据，请稍后再试');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // const interval = setInterval(loadData, 5 * 60 * 1000); // 每5分钟刷新
    // return () => clearInterval(interval);
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

  return (
    <HotMoneyDashboard jsonData={data} />
  );
}

export default App;
