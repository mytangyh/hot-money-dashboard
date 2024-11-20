import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';

const HotMoneyDashboard = () => {
  const data = [
    {
      "hot_money_net_rate": 0.09760899,
      "stock_name": "中国长城",
      "stock_code": "000066",
      "change": 0.09983,
      "hot_money_items": [
        {
          "name": "杭州帮",
          "sell_value": 3856030.37,
          "net_value": 265250281.98,
          "buy_value": 269106312.35
        },
        {
          "name": "呼家楼",
          "sell_value": 72488514.27,
          "net_value": 518292171.66,
          "buy_value": 590780685.93
        },
        {
          "name": "上海溧阳路",
          "sell_value": 2004774,
          "net_value": 193986680,
          "buy_value": 195991454
        }
      ]
    },
    {
      "hot_money_net_rate": 0.05713327,
      "stock_name": "有研新材",
      "stock_code": "600206",
      "change": -0.1,
      "hot_money_items": [
        {
          "name": "六一中路",
          "sell_value": 0,
          "net_value": 193472907,
          "buy_value": 193472907
        },
        {
          "name": "炒股养家",
          "sell_value": 0,
          "net_value": 125920818.91,
          "buy_value": 125920818.91
        },
        {
          "name": "涪陵广场路",
          "sell_value": 139460157.6,
          "net_value": -139460157.6,
          "buy_value": 0
        },
        {
          "name": "量化基金",
          "sell_value": 0,
          "net_value": 188942399,
          "buy_value": 188942399
        }
      ]
    },
    {
      "hot_money_net_rate": 0.13833697,
      "stock_name": "四川九洲",
      "stock_code": "000801",
      "change": 0.099925,
      "hot_money_items": [
        {
          "name": "陈小群",
          "sell_value": 6655,
          "net_value": 31501782,
          "buy_value": 31508437
        },
        {
          "name": "杭州帮",
          "sell_value": 52138,
          "net_value": 107840973,
          "buy_value": 107893111
        }
      ]
    }
  ];

  const groupedData = useMemo(() => {
    const groups = {};
    
    data.forEach(stock => {
      stock.hot_money_items.forEach(item => {
        if (!groups[item.name]) {
          groups[item.name] = [];
        }
        groups[item.name].push({
          ...item,
          stock_name: stock.stock_name,
          stock_code: stock.stock_code,
          change: stock.change
        });
      });
    });
    
    return groups;
  }, [data]);

  const formatValue = (value) => {
    return (value / 100000000).toFixed(2) + '亿';
  };

  const formatPercent = (value) => {
    return (value * 100).toFixed(2) + '%';
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">游资龙虎榜</h1>
      
      {Object.entries(groupedData).map(([name, stocks]) => (
        <Card key={name} className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{name}</span>
              <Badge variant="secondary">
                总净值：{formatValue(stocks.reduce((sum, stock) => sum + stock.net_value, 0))}
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
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">{stock.stock_name}</td>
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