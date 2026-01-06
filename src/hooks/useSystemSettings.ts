import { useState, useEffect } from 'react';

export const useSystemSettings = () => {
  const [systemName, setSystemName] = useState(() => {
    const saved = localStorage.getItem('systemName');
    return saved || 'ndsl';
  });

  useEffect(() => {
    localStorage.setItem('systemName', systemName);
    // 触发自定义事件通知其他组件
    window.dispatchEvent(new Event('systemNameChanged'));
  }, [systemName]);

  return [systemName, setSystemName] as const;
};
