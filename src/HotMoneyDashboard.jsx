import React, { useMemo, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import html2canvas from 'html2canvas';
import jsonData from './data/hot_money_2024-11-21.json';

const HotMoneyDashboard = () => {
  const containerRef = useRef(null);
  const CARDS_PER_PAGE = 8; // 增加每页显示的卡片数量

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

  const generatePosters = async () => {
    if (!containerRef.current) return;

    const totalPages = Math.ceil(groupedData.length / CARDS_PER_PAGE);
    const date = new Date().toLocaleDateString('zh-CN').replace(/\//g, '');

    const generateButton = document.querySelector('.generate-button');
    if (generateButton) generateButton.style.display = 'none';

    try {
      for (let page = 0; page < totalPages; page++) {
        const cards = containerRef.current.querySelectorAll('.card');
        cards.forEach((card, index) => {
          const shouldShow = index >= page * CARDS_PER_PAGE && index < (page + 1) * CARDS_PER_PAGE;
          card.style.display = shouldShow ? 'block' : 'none';
        });

        const canvas = await html2canvas(containerRef.current, {
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false,
          useCORS: true,
          width: 2340, // 19.5:9 比例的宽度
          height: 1080 // 19.5:9 比例的高度
        });
        
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `hot-money-poster-${date}-${page + 1}.png`;
        link.href = image;
        link.click();

        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const cards = containerRef.current.querySelectorAll('.card');
      cards.forEach(card => card.style.display = 'block');
    } catch (error) {
      console.error('生成海报失败:', error);
    } finally {
      if (generateButton) generateButton.style.display = 'block';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50" ref={containerRef}>
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-2 py-3">
          <div className="text-center relative">            
            {/* 标题区域 */}
            <div className="relative">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600 inline-flex items-center justify-center">
                {/* 左侧装饰 */}
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 hidden sm:block">
                  <div className="flex items-center text-red-800/20 transform -rotate-12">
                    <span className="text-4xl">🐉</span>
                  </div>
                </div>
                
                游资龙虎榜

                {/* 右侧装饰 */}
                <div className="absolute -right-12 top-1/2 -translate-y-1/2 hidden sm:block">
                  <div className="flex items-center text-red-800/20 transform rotate-12">
                    <span className="text-4xl">🐯</span>
                  </div>
                </div>
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {(() => {
                  const now = new Date();
                  const displayDate = now.getHours() < 12 ? 
                    new Date(now.setDate(now.getDate() - 1)) : 
                    now;
                  return `${displayDate.toLocaleDateString('zh-CN', { weekday: 'long' })} · ${displayDate.toLocaleDateString('zh-CN')} 数据更新`;
                })()}
              </p>
            </div>

            {/* 生成按钮 - 隐藏 */}
            <button
              onClick={generatePosters}
              className="hidden generate-button"
            >
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto p-2">
        <div className="grid gap-1">
          {groupedData.map(({ name, stocks, totalNetValue }) => (
            <Card key={name} className="card border-0 shadow-sm hover:shadow-md transition-shadow bg-white/90 backdrop-blur-sm
              border-l-4 border-l-red-500/40">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold flex items-center">
                      <span className="mr-1 opacity-50">👥</span>
                      {name}
                    </span>
                    <Badge 
                      variant="secondary" 
                      className={`${
                        totalNetValue >= 0 
                          ? 'bg-red-50 text-red-600 border border-red-200' 
                          : 'bg-green-50 text-green-600 border border-green-200'
                      } text-xs px-1.5 py-0.5`}
                    >
                      {totalNetValue >= 0 ? '净买：' : '净卖：'}{formatValue(totalNetValue)}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="overflow-hidden">
                  <table className="w-full border-collapse text-xs">
                    <tbody className="divide-y divide-gray-100">
                      {stocks.map((stock, idx) => (
                        <tr key={`${stock.stock_code}-${idx}`} className="hover:bg-red-50/30">
                          <td className={`py-1 px-2 font-medium text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis ${
                            idx === stocks.length - 1 ? 'pb-0' : ''
                          }`}>
                            <div className="flex items-center space-x-1 max-w-full">
                              <span className="truncate flex items-center">
                                <span className="mr-1 opacity-50">🔖</span>
                                {stock.stock_name}
                              </span>
                              {stock.range_days === 3 && (
                                <span className="inline-flex flex-shrink-0 items-center px-1 py-0.5 rounded-sm text-xs 
                                  font-medium bg-orange-50 text-orange-700 border border-orange-200">
                                  3日
                                </span>
                              )}
                            </div>
                          </td>
                          <td className={`py-1 px-2 whitespace-nowrap ${
                            idx === stocks.length - 1 ? 'pb-0' : ''
                          }`}>
                            <span className={`inline-flex items-center px-1 py-0.5 rounded-sm text-xs font-medium ${
                              stock.change >= 0 
                                ? 'bg-red-50 text-red-700 border border-red-200' 
                                : 'bg-green-50 text-green-700 border border-green-200'
                            }`}>
                              {stock.change >= 0 ? '↑' : '↓'} {formatPercent(stock.change)}
                            </span>
                          </td>
                          <td className={`py-1 px-2 text-right font-medium whitespace-nowrap ${
                            stock.net_value >= 0 ? 'text-red-600' : 'text-green-600'
                          } ${idx === stocks.length - 1 ? 'pb-0' : ''}`}>
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
        
        {/* 免责声明 */}
        <div className="mt-4 text-center text-xs text-gray-400">
          <p className="mb-1">数据来源：根据公开市场数据整理</p>
          <p>免责声明：本页面内容仅供参考，不构成任何投资建议。市场有风险，投资需谨慎。</p>
        </div>
      </div>
    </div>
  );
};

export default HotMoneyDashboard;