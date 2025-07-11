import React from 'react';
import { Button } from './button';
import { fetchHotMoneyData } from '../../utils/api';

const FetchDataButton = ({ onSuccess, onError }) => {
  const [loading, setLoading] = React.useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await fetchHotMoneyData(today);
      console.log(" handleClick Using today's data");

      onSuccess?.(data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleClick}
      disabled={loading}
      className="ml-4"
    >
      {loading ? '加载中...' : '获取数据'}
    </Button>
  );
};

export default FetchDataButton;
