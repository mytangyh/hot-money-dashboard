import React from 'react';

// 创建独立的加载状态组件
export const LoadingState = () => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex justify-center items-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
      <div className="text-2xl font-bold mb-2">加载中...</div>
      <div className="text-gray-500">请稍候</div>
    </div>
  </div>
);
