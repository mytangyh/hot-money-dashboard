import React, { useEffect, useState } from 'react';
import HotMoneyDashboard from './HotMoneyDashboard';
import { fetchHotMoneyData } from './utils/api';

function App() {
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 初始化加载：默认加载今天数据，如果为空则回退到昨天
  useEffect(() => {
    const initLoad = async () => {
      setLoading(true);
      setError(null);
      try {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        const todayData = await fetchHotMoneyData(today);
        if (todayData?.data?.items?.length > 0) {
          setSelectedDate(today); // 设置默认选中日期
          setData(todayData);
        } else {
          const yesterdayData = await fetchHotMoneyData(yesterday);
          if (yesterdayData?.data?.items?.length > 0) {
            setSelectedDate(yesterday);
            setData(yesterdayData);
          } else {
            throw new Error('今天和昨天的数据都为空');
          }
        }
      } catch (err) {
        setError('无法获取数据，请稍后再试');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    initLoad();
  }, []);

  // 监听用户手动选择日期
  const handleDateChange = async (newDate) => {
    setSelectedDate(newDate);
    setLoading(true);
    setError(null);
    try {
      const cached = localStorage.getItem(`hotMoneyData-${newDate}`);
      if (cached) {
        setData(JSON.parse(cached));
        setLoading(false);
        return;
      }

      const result = await fetchHotMoneyData(newDate);
      if (result?.data?.items?.length > 0) {
        setData(result);
        localStorage.setItem(`hotMoneyData-${newDate}`, JSON.stringify(result));
      } else {
        setError(`${newDate} 暂无数据`);
        setData(null);
      }
    } catch (err) {
      setError('数据加载失败，请稍后再试');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 日期选择器 */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-red-600">龙虎榜数据</h1>
          <input
            type="date"
            className="border border-gray-300 rounded px-3 py-1 text-sm"
            value={selectedDate}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => handleDateChange(e.target.value)}
            disabled={loading}
          />
        </div>

        {loading && (
          <div className="text-center py-10 text-gray-500 text-sm">数据加载中...</div>
        )}
        {error && (
          <div className="text-center py-10 text-red-500 text-sm">{error}</div>
        )}
        {!loading && !error && data && (
          <HotMoneyDashboard jsonData={data} selectedDate={selectedDate} />
        )}
      </div>
    </div>
  );
}

export default App;
