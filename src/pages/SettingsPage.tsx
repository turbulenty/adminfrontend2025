// @ts-nocheck
import { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { settingsApi } from '../services/api';


export default function SettingsPage() {
  const [settings, setSettings] = useState({
    systemName: 'Health Monitoring System',
    apiEndpoint: 'http://localhost:8080',
    refreshInterval: '30',
    enableNotifications: true,
    enableAutoRefresh: true,
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 组件加载时获取设置
  useEffect(() => {
    loadSettings();
  }, []);

  // 从后端加载设置
  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await settingsApi.getSettings();
      setSettings({
        systemName: response.data.systemName,
        apiEndpoint: response.data.apiEndpoint,
        refreshInterval: response.data.refreshInterval.toString(),
        enableNotifications: response.data.enableNotifications,
        enableAutoRefresh: response.data.enableAutoRefresh,
      });
      setError(false);
    } catch (err) {
      console.error('加载设置失败:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSettings({
      ...settings,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    });
  };

  const handleSave = async () => {
    try {
      // 转换数据格式
      const dataToSave = {
        systemName: settings.systemName,
        apiEndpoint: settings.apiEndpoint,
        refreshInterval: parseInt(settings.refreshInterval),
        enableNotifications: settings.enableNotifications,
        enableAutoRefresh: settings.enableAutoRefresh,
      };

      await settingsApi.saveSettings(dataToSave);
      
      // 同时保存到localStorage供前端读取
      localStorage.setItem('appSettings', JSON.stringify(dataToSave));
      
      // 触发设置更新事件，通知其他组件
      window.dispatchEvent(new Event('settingsUpdated'));
      
      console.log('保存设置:', dataToSave);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('保存设置失败:', err);
      setError(true);
    }
  };

  // 加载中显示
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{width:1230}}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        系统设置——システム設定（しすてむ せってい）
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          设置已成功保存！
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          操作失败，请检查网络连接或后端服务！
        </Alert>
      )}

      {/* 基本设置 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          基本设置
        </Typography>

        <TextField
          fullWidth
          label="系统名称"
          value={settings.systemName}
          onChange={handleChange('systemName')}
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#feb47b',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#feb47b',
            },
          }}
        />

        <TextField
          fullWidth
          label="API端点"
          value={settings.apiEndpoint}
          onChange={handleChange('apiEndpoint')}
          helperText="后端API的基础URL"
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#feb47b',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#feb47b',
            },
          }}
        />

        <TextField
          fullWidth
          label="刷新间隔（秒）"
          type="number"
          value={settings.refreshInterval}
          onChange={handleChange('refreshInterval')}
          helperText="数据自动刷新的时间间隔"
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#feb47b',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#feb47b',
            },
          }}
        />
      </Paper>

      {/* 功能开关 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          功能开关
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={settings.enableNotifications}
              onChange={handleChange('enableNotifications')}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#feb47b',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#feb47b',
                },
              }}
            />
          }
          label="启用系统通知"
          sx={{ display: 'block', mb: 2 }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.enableAutoRefresh}
              onChange={handleChange('enableAutoRefresh')}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#feb47b',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#feb47b',
                },
              }}
            />
          }
          label="启用自动刷新"
          sx={{ display: 'block' }}
        />
      </Paper>

      {/* 保存按钮 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{ bgcolor: '#feb47b', px: 4 }}
        >
          保存设置
        </Button>
      </Box>
    </Box>
  );
}
