import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import jsonData from './data/hot_money_2024-11-21.json';

const HotMoneyDashboard = () => {
  const groupedData = useMemo(() => {
    const groups = {};
    
    // 遍历每只股票
    jsonData.data.items.forEach(stock => {
      if (stock.hot_money_items) {
        // 遍历每只股票的 hot_money_items
        stock.hot_money_items.forEach(item => {
          const name = item.name; // 分组依据为 item.name
          // 跳过量化打板和量化基金
          if (name === "量化打板" || name === "量化基金") {
            return;
          }
          if (!groups[name]) {
            groups[name] = []; // 如果该分组不存在，初始化为空数组
          }
          // 向分组中添加数据，包含 stock_name 等相关字段
          groups[name].push({
            ...item, // 保留原有 hot_money_item 的所有属性
            stock_name: stock.stock_name,
            stock_code: stock.stock_code || '',
            change: stock.change,
          });
        });
      }
    });

    // 对每个分组内的股票按照净买入量（net_value）排序
    Object.keys(groups).forEach(name => {
      groups[name].sort((a, b) => b.net_value - a.net_value);
    });

    // 计算每个分组的总净买入量并排序
    const sortedGroups = Object.entries(groups)
      .map(([name, stocks]) => ({
        name,
        stocks,
        totalNetValue: stocks.reduce((sum, stock) => sum + stock.net_value, 0)
      }))
      .sort((a, b) => Math.abs(b.totalNetValue) - Math.abs(a.totalNetValue));

    return sortedGroups;
  }, [jsonData]); // 依赖 jsonData 变化重新计算

  const formatValue = (value) => {
    const absValue = Math.abs(value);
    if (absValue >= 100000000) { // 1亿
      return (value / 100000000).toFixed(2) + '亿';
    } else {
      return (value / 10000).toFixed(2) + '万';
    }
  };

  const formatPercent = (value) => {
    return (value * 100).toFixed(2) + '%';
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">游资龙虎榜</h1>
      
      {groupedData.map(({ name, stocks, totalNetValue }) => (
        <Card key={name} className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{name}</span>
              <Badge variant="secondary" className={totalNetValue >= 0 ? 'text-red-600' : 'text-green-600'}>
                {totalNetValue >= 0 ? '净买：' : '净卖：'}{formatValue(totalNetValue)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/40">
                    <th scope="col" className="py-4 px-6 text-left text-sm font-semibold text-gray-900">股票</th>
                    <th scope="col" className="py-4 px-6 text-left text-sm font-semibold text-gray-900">涨跌幅</th>
                    <th scope="col" className="py-4 px-6 text-right text-sm font-semibold text-gray-900">净买入</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {stocks.map((stock, idx) => (
                    <tr key={`${stock.stock_code}-${idx}`} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        {stock.stock_name}
                        {stock.range_days === 3 && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                            3日
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          stock.change >= 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {formatPercent(stock.change)}
                        </span>
                      </td>
                      <td className={`py-4 px-6 text-sm text-right font-medium ${stock.net_value >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatValue(stock.net_value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HotMoneyDashboard;