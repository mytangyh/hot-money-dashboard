import React, { useMemo, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import html2canvas from 'html2canvas';
import { pinyin } from 'pinyin-pro';
const CoverPage = ({ date }) => {
  // 格式化日期显示
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const weekDay = date.toLocaleDateString('zh-CN', { weekday: 'long' });
    return {
      weekDay,
      date: date.toLocaleDateString('zh-CN')
    };
  };

  const { weekDay, date: formattedDate } = formatDate(date);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* 网格背景 */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.05) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* 主要内容 */}
      <div className="relative flex flex-col items-center justify-center min-h-screen p-8">
        <div className="max-w-4xl w-full space-y-12 text-center">
          {/* 标题区域 */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 
              filter drop-shadow-sm">
              游资龙虎榜
            </h1>
            <div className="space-y-1">
              <div className="text-3xl font-semibold text-gray-800">
                {formattedDate}
              </div>
              <div className="text-2xl text-gray-600">
                {weekDay}
              </div>
            </div>
          </div>

          {/* 装饰线 */}
          <div className="flex items-center justify-center space-x-4">
            <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-red-300 to-transparent"></div>
            <span className="text-2xl">🐉</span>
            <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-red-300 to-transparent"></div>
            <span className="text-2xl">🐯</span>
            <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-red-300 to-transparent"></div>
          </div>

          {/* 免责声明卡片 - 减小尺寸和边距 */}
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-red-100 max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">免责声明</h2>
            <div className="text-gray-600 text-left text-sm space-y-1">
              <p>本数据分析报告仅供参考，不构成任何投资建议。投资有风险，入市需谨慎。</p>
              <p>数据来源于公开市场，我们不对数据的准确性、完整性、及时性做出任何保证。</p>
              <p>使用本报告进行投资决策所造成的一切后果，由投资者自行承担。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HotMoneyDashboard = ({ jsonData }) => {
  const containerRef = useRef(null);
  const CARDS_PER_PAGE = 8;
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);

  const groupedData = useMemo(() => {
    if (!jsonData) return [];

    const groups = {};
    
    // 遍历每只股票
    jsonData.data.items.forEach(stock => {
      if (stock.hot_money_items) {
        // 遍历每只股票的 hot_money_items
        stock.hot_money_items.forEach(item => {
          const name = item.name;
          // 跳过量化打板和量化基金
          if (name === "量化打板" || name === "量化基金") {
            return;
          }
          if (!groups[name]) {
            groups[name] = {
              stocks: [],
              uniqueStocks: new Set(), // 用于去重计算总净值
            };
          }

          // 添加股票到显示列表
          groups[name].stocks.push({
            ...item,
            stock_name: stock.stock_name,
            stock_code: stock.stock_code || '',
            change: stock.change,
            tags: stock.tags || [],
          });

          // 生成唯一标识
          const stockKey = `${stock.stock_name}-${item.net_value}`;
          // 如果这是新的股票+净值组合，添加到唯一集合中
          if (!groups[name].uniqueStocks.has(stockKey)) {
            groups[name].uniqueStocks.add(stockKey);
          }
        });
      }
    });

    // 对每个分组内的股票按照净买入量排序
    Object.keys(groups).forEach(name => {
      groups[name].stocks.sort((a, b) => b.net_value - a.net_value);
    });

    // 计算每个分组的总净买入量并排序（只计算唯一的股票）
    const sortedGroups = Object.entries(groups)
      .map(([name, { stocks, uniqueStocks }]) => {
        // 创建一个 Map 来存储每个唯一股票的净值
        const uniqueNetValues = new Map();
        stocks.forEach(stock => {
          const key = `${stock.stock_name}-${stock.net_value}`;
          if (uniqueStocks.has(key)) {
            uniqueNetValues.set(key, stock.net_value);
            uniqueStocks.delete(key); // 确保每个组合只计算一次
          }
        });

        return {
          name,
          stocks, // 保持所有股票用于显示
          totalNetValue: Array.from(uniqueNetValues.values()).reduce((sum, value) => sum + value, 0)
        };
      })
      .sort((a, b) => Math.abs(b.totalNetValue) - Math.abs(a.totalNetValue));

    return sortedGroups;
  }, [jsonData]);

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

  const maskStockName = (name) => {
    if (!isPrivacyMode) return name;
    
    // 获取除最后一个字外的所有字符
    const nameWithoutLast = name.slice(0, -1);
    // 获取最后一个字的拼音首字母
    const lastPinyin = pinyin(name.slice(-1), { 
      pattern: 'first',
      toneType: 'none' 
    });
    
    return nameWithoutLast + lastPinyin.toUpperCase();
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

  const now = new Date();
  const displayDate = now.getHours() < 12 ? 
    new Date(now.setDate(now.getDate() - 1)) : 
    now;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50" ref={containerRef}>
      <CoverPage date={displayDate.toLocaleDateString('zh-CN')} />
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-2 py-3">
          <div className="text-center relative">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600 inline-flex items-center justify-center">
              {/* 左侧装饰 */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2  sm:block">
                <div className="flex items-center text-red-800/20 transform ">
                  <span className="text-4xl">🐉</span>
                </div>
              </div>
              
              {isPrivacyMode ? '柚子龙虎榜' : '游资龙虎榜'}

              {/* 右侧装饰 */}
              <div className="absolute right-16 top-1/2 -translate-y-1/2  sm:block">
                <div className="flex items-center text-red-800/20 transform ">
                  <span className="text-4xl">🐯</span>
                </div>
              </div>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {displayDate.toLocaleDateString('zh-CN', { weekday: 'long' })} · {displayDate.toLocaleDateString('zh-CN')} 数据更新
            </p>
            {/* 隐私模式切换按钮 */}
            <button
              onClick={() => setIsPrivacyMode(!isPrivacyMode)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              title={isPrivacyMode ? "退出隐私模式" : "进入隐私模式"}
            >
              {isPrivacyMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8" >
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
                        <tr key={`${stock.stock_code}-${idx}`} className="hover:bg-gray-50/50">
                          <td className={`py-1 px-2 font-medium text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis ${
                            idx === stocks.length - 1 ? 'pb-0' : ''
                          }`}>
                            <div className="flex items-center space-x-1 max-w-full">
                              <span className="truncate flex items-center">
                                <span className="mr-1 opacity-50">🔖</span>
                                {maskStockName(stock.stock_name)}
                                {stock.tags && stock.tags.some(tag => tag.name === '3日') && (
                                  <span className="ml-1 text-[10px] text-orange-500 border border-orange-300 px-0.5 rounded">
                                    3日
                                  </span>
                                )}
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