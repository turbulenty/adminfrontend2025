// 禁用 TypeScript 类型检查
// @ts-nocheck

// 导入 React Hooks：useState 管理状态，useEffect 处理副作用
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// 导入 MUI 组件：用于布局、卡片、文本显示和加载动画
import {
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';

// 导入 MUI 图标
import {
  People as PeopleIcon,           // 人群图标
  PersonAdd as PersonAddIcon,     // 添加用户图标
  CheckCircle as CheckCircleIcon, // 勾选圆圈图标
  Cancel as CancelIcon,           // 取消图标
} from '@mui/icons-material';

// 导入 Recharts 图表库组件
import {
  LineChart,        // 折线图容器
  Line,            // 折线
  PieChart,        // 饼图容器
  Pie,             // 饼图
  Cell,            // 饼图单元格（用于自定义颜色）
  XAxis,           // X轴
  YAxis,           // Y轴
  CartesianGrid,   // 笛卡尔坐标网格
  Tooltip,         // 提示框
  Legend,          // 图例
  ResponsiveContainer, // 响应式容器
} from 'recharts';

// 导入自定义的 API 服务
import { dashboardApi, settingsApi } from '../services/api';

// 定义统计数据的类型接口
interface Stats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  todayNewUsers: number;
}

// 定义角色分布数据的类型接口
interface RoleDistribution {
  name: string;
  value: number;
}

// 定义用户增长数据的类型接口
interface UserGrowth {
  date: string;
  month: number;
  day: number;
  users: number;
}

// //数据点变成正三角形
// const TriangleDot = ({ cx, cy }: any) => {
//   const size = 6;
//   return (
//     <polygon
//       points={`
//         ${cx},${cy - size}
//         ${cx - size},${cy + size}
//         ${cx + size},${cy + size}
//       `}
//       fill="#feb47b"
//     />
//   );
// };

// //数据点变成倒三角形
// const TriangleDot = ({ cx, cy }: any) => {
//   const size = 6;
//   return (
//     <polygon
//       points={`
//         ${cx - size},${cy - size}
//         ${cx + size},${cy - size}
//         ${cx},${cy + size}
//       `}
//       fill="#feb47b"
//     />
//   );
// };

//数据点变成菱形（旋转正方形）
const DiamondDot = ({ cx, cy }: any) => (
  <rect
    x={cx - 4}
    y={cy - 4}
    width={8}
    height={8}
    fill="#feb47b"
    transform={`rotate(45 ${cx} ${cy})`}
  />
);

// 饼图扇区的颜色数组
// const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
const COLORS = ['#99d0ffff ', '#5fdbc4ff', '#feb47b'];

// 导出默认组件：仪表盘主页
export default function DashboardHome() {
  const { t } = useTranslation();  // 1.6添加

  // 状态：统计数据，初始值为 null
  const [stats, setStats] = useState<Stats | null>(null);

  // 状态：角色分布数据数组，初始值为空数组
  const [roleDistribution, setRoleDistribution] = useState<RoleDistribution[]>([]);

  // 状态：用户增长数据数组，初始值为空数组
  const [userGrowth, setUserGrowth] = useState<UserGrowth[]>([]);

  // 状态：加载状态，初始值为 true
  const [loading, setLoading] = useState(true);

  // 12.28新增：自动刷新配置状态
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);

  // 加载设置配置
  useEffect(() => {
    loadSettings();
  }, []);

  // 首次加载数据
  // useEffect：组件挂载时执行一次数据获取。
  useEffect(() => {
    fetchDashboardData();
    // 空依赖数组 [] 表示只在组件首次渲染后执行。
  }, []);

  // 自动刷新逻辑
  useEffect(() => {
    if (!autoRefreshEnabled) {
      return; // 如果未启用自动刷新，不设置定时器
    }

    const intervalId = setInterval(() => {
      console.log('自动刷新数据...');
      fetchDashboardData();
    }, refreshInterval * 1000); // 转换为毫秒

    // 清理函数：组件卸载或依赖变化时清除定时器
    return () => {
      console.log('清除自动刷新定时器');
      clearInterval(intervalId);
    };
  }, [autoRefreshEnabled, refreshInterval]); // 依赖配置变化

  // 加载设置
  const loadSettings = async () => {
    try {
      const response = await settingsApi.getSettings();
      setAutoRefreshEnabled(response.data.enableAutoRefresh);
      setRefreshInterval(response.data.refreshInterval);
      console.log('自动刷新配置:', response.data.enableAutoRefresh, response.data.refreshInterval);
    } catch (error) {
      console.error('加载设置失败:', error);
    }
  };

  // 异步函数：获取仪表盘所有数据
  const fetchDashboardData = async () => {
    setLoading(true); // 开始加载，显示加载动画
    try {
      // Promise.all 并行发送三个 API 请求，提高效率
      const [statsRes, roleRes, growthRes] = await Promise.all([
        dashboardApi.getStats(),              // 获取统计数据
        dashboardApi.getRoleDistribution(),   // 获取角色分布数据
        dashboardApi.getUserGrowth(),         // 获取用户增长数据
      ]);

      // 更新三个状态变量
      setStats(statsRes.data);
      setRoleDistribution(roleRes.data);
      setUserGrowth(growthRes.data);
    } catch (error) {
      // 捕获错误并在控制台输出
      console.error('获取Dashboard数据失败：', error);
    } finally {
      // 无论成功或失败，都结束加载状态
      setLoading(false);
    }
  };

  // 如果正在加载，显示居中的加载动画
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 定义统计卡片的配置数组
  const statCards = [
    {
      title: t("dashboard.totalUsers"),
      value: stats?.totalUsers || 0,  // 使用可选链和默认值防止 null 错误
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',    // 图标和数字颜色
      bgColor: '#e3f2fd',  // 卡片背景色
    },
    {
      title: t("dashboard.activeUsers"),
      value: stats?.activeUsers || 0,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      bgColor: '#e8f5e9',
    },
    {
      title: t("dashboard.todayNew"),
      value: stats?.todayNewUsers || 0,
      icon: <PersonAddIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
      bgColor: '#fff3e0',
    },
    {
      title: t("dashboard.inactiveUsers"),
      value: stats?.inactiveUsers || 0,
      icon: <CancelIcon sx={{ fontSize: 40 }} />,
      color: '#d32f2f',
      bgColor: '#ffebee',
    },
  ];

  // 返回组件的 JSX 结构
  return (
    // 右边部分主宽度
    // <Box sx={{ width: 1230 }}>
    <Box sx={{ width: '100%' }}>

      {/* 页面标题 */}
      <Typography variant="h4" fontWeight={600} mb={3}>
        {t('menu.dashboard')}
      </Typography>


      {/* 统计卡片网格区域 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',                  // 移动端：1列
            sm: 'repeat(2, 1fr)',       // 平板：2列
            md: 'repeat(4, 1fr)',       // 桌面：4列
          },
          gap: 3,  // 网格间距
          mb: 3,   // 底部外边距
        }}
      >
        {/* 遍历 statCards 数组，渲染每张卡片 */}
        {statCards.map((card, index) => (
          <Card key={index} sx={{ bgcolor: card.bgColor, height: '100%' }}>
            <CardContent>
              {/* Flexbox 布局：左侧文字，右侧图标 */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  {/* 卡片标题 */}
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    {card.title}
                  </Typography>
                  {/* 统计数值 */}
                  <Typography variant="h4" fontWeight={600} color={card.color}>
                    {card.value}
                  </Typography>
                </Box>
                {/* 图标 */}
                <Box sx={{ color: card.color }}>
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* 图表网格区域 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',                  // 移动端：1列
            lg: 'repeat(2, 1fr)',       // 大屏：2列
          },
          gap: 3,
        }}
      >
        {/* 用户增长趋势折线图 */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            {t("dashboard.userGrowthTrend")}
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              {/* 网格线，虚线样式 */}
              <CartesianGrid strokeDasharray="3 3" />

              {/* X轴：显示日期 */}
              <XAxis
                dataKey="day"
                // label={{ value: '日期', position: 'insideBottom', offset: -5 }}
                label={{ value: t("dashboard.date"), position: 'insideBottom', offset: -2}}
              />

              {/* Y轴：显示用户数 */}
              {/* <YAxis label={{ value: '用户数', angle: -90, position: 'insideLeft' }} /> */}
              <YAxis label={{ value: t("dashboard.number"), angle: -90, position: 'insideLeft' }} />

              {/* 鼠标悬停提示框 */}
              <Tooltip
                formatter={(value) => [`${value} 人`, '用户数']}
                labelFormatter={(label) => `${label}日`}
              />

              {/* 图例 */}
              <Legend />

              {/* 折线：数据来源于 users 字段 */}
              <Line
                type="monotone"          // 平滑曲线类型
                dataKey="users"          // 数据字段
                // stroke="#1976d2"         // 线条颜色
                stroke="#feb47b"         // 线条颜色
                strokeWidth={2}          // 线条宽度
                name={t("dashboard.totalUsers")}       // 图例显示名称
                // dot={{ fill: '#1976d2', r: 4 }}  // 数据点样式
                // dot={{ fill: '#feb47b', r: 4 }}  // 数据点样式
                // dot={<TriangleDot />}
                dot={<DiamondDot />}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        {/* 用户角色分布饼图 */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            {t("dashboard.userRoleDistribution")}
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roleDistribution}        // 数据源
                cx="50%"                       // 圆心 X 坐标（百分比）
                cy="50%"                       // 圆心 Y 坐标（百分比）
                labelLine={false}              // 不显示标签引导线
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}  // 自定义标签格式
                outerRadius={80}               // 外半径
                fill="#8884d8"                 // 默认填充色
                dataKey="value"                // 数值字段
              >
                {/* 遍历数据，为每个扇区分配颜色 */}
                {roleDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              {/* 提示框 */}
              <Tooltip formatter={(value) => [`${value} 人`, '数量']} />
              {/* 图例 */}
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>

        {/* 系统概览区域：跨越全宽 */}
        <Box sx={{ gridColumn: { xs: '1', lg: '1 / -1' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              {t("dashboard.systemOverview")}
            </Typography>
            {/* 四列统计数据网格 */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',                  // 移动端：1列
                  sm: 'repeat(2, 1fr)',       // 平板：2列
                  md: 'repeat(4, 1fr)',       // 桌面：4列
                },
                gap: 2,
              }}
            >
              {/* 总用户数 */}
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h5" color="primary" fontWeight={600}>
                  {stats?.totalUsers || 0}
                </Typography>
                <Typography color="text.secondary">{t("dashboard.totalUsers")}</Typography>
              </Box>

              {/* 活跃用户 */}
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h5" color="success.main" fontWeight={600}>
                  {stats?.activeUsers || 0}
                </Typography>
                <Typography color="text.secondary">{t("dashboard.activeUsers")}</Typography>
              </Box>

              {/* 今日新增 */}
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h5" color="warning.main" fontWeight={600}>
                  {stats?.todayNewUsers || 0}
                </Typography>
                <Typography color="text.secondary">{t("dashboard.todayNew")}</Typography>
              </Box>

              {/* 非活跃用户 */}
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h5" color="error.main" fontWeight={600}>
                  {stats?.inactiveUsers || 0}
                </Typography>
                <Typography color="text.secondary">{t("dashboard.inactiveUsers")}</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

