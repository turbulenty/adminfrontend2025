// @ts-nocheck
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Badge,
  ListItem,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  AccountCircle,
  Notifications,
  Logout,
  Circle,
} from "@mui/icons-material";

import { authApi } from '../services/api'; //认证接口
import { notificationApi } from '../services/api'; //通知接口

const drawerWidth = 240;
const drawerCollapsedWidth = 65;

export default function DashboardLayout() {



  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // 弹窗状态
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);

  // 通知启用状态（从设置读取）
  const [notificationEnabled, setNotificationEnabled] = useState(true);

  // 通知数据
  // const [notifications, setNotifications] = useState([
  //   { id: 1, title: '新用户注册', content: '用户"1229-2"已成功注册', time: '5分钟前', read: false },
  //   { id: 2, title: '系统更新', content: '系统将在今晚23:00进行维护', time: '1小时前', read: false },
  //   { id: 3, title: '数据备份完成', content: '今日数据备份已完成', time: '3小时前', read: false },
  // ]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // 加载通知数据
  useEffect(() => {
    loadNotifications();

    // 每30秒刷新一次通知
    const interval = setInterval(loadNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const [notifRes, countRes] = await Promise.all([
        notificationApi.getNotifications(),
        notificationApi.getUnreadCount(), // 从后端获取未读数量
      ]);

      setNotifications(notifRes.data);
      setUnreadCount(countRes.data.count);// 直接使用后端返回的数量
    } catch (error) {
      console.error('加载通知失败:', error);
    }
  };

  // 全部标记为已读
  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      loadNotifications(); // 重新加载
    } catch (error) {
      console.error('标记已读失败:', error);
    }
  };

  // 修改密码表单数据
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // const unreadCount = notifications.filter(n => !n.read).length;

  const menu = [
    { label: "仪表盘", path: "/dashboard", icon: <DashboardIcon /> },
    { label: "用户管理", path: "/dashboard/users", icon: <PeopleIcon /> },
    { label: "设置", path: "/dashboard/settings", icon: <SettingsIcon /> },
  ];

  // 加载通知启用状态
  useEffect(() => {
    loadNotificationSettings();

    // 监听localStorage变化
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'appSettings') {
        loadNotificationSettings();
      }
    };

    // 自定义事件监听
    const handleSettingsUpdate = () => {
      loadNotificationSettings();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('settingsUpdated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
    };
  }, []);

  const loadNotificationSettings = () => {
    try {
      const settings = localStorage.getItem('appSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setNotificationEnabled(parsed.enableNotifications !== false);
      }
    } catch (error) {
      console.error('加载通知设置失败:', error);
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/login');
  };

    // 当前用户资料 1.4
  const [currentUserProfile, setCurrentUserProfile] = useState({
    name: '',
    email: '',
    role: '',
  });

  // 加载当前用户信息 1.5
  const loadCurrentUserProfile = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        const response = await authApi.getCurrentUser(userEmail);
        setCurrentUserProfile({
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        });
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  };

  // 打开个人资料弹窗
  const handleOpenProfile = () => {
    setProfileDialogOpen(true);
    loadCurrentUserProfile(); //1.4~1.5
    handleMenuClose();
  };

  // 打开账户设置弹窗
  const handleOpenAccount = () => {
    setAccountDialogOpen(true);  // ← 1.1改成true
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    handleMenuClose();
  };

  // 打开通知弹窗
  const handleOpenNotification = () => {
    setNotificationDialogOpen(true);
  };

  // 只修改本地state-全部标记为已读
  // const handleMarkAllAsRead = () => {
  //   setNotifications(notifications.map(n => ({ ...n, read: true })));
  // };

  // 修改密码
  const handleChangePassword = async () => {
    // 验证输入
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('请填写所有密码字段');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('两次输入的新密码不一致');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('新密码长度至少6位');
      return;
    }

    // 获取邮箱
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
      alert('无法获取用户信息，请重新登录');
      handleLogout();
      return;
    }

    try {
      const response = await authApi.changePassword({
        email: userEmail,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data.success) {
        alert('密码修改成功，请重新登录');
        // 清空表单
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setAccountDialogOpen(false);
        // 修改成功后退出登录
        setTimeout(() => {
          handleLogout();
        }, 1000);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || '修改密码失败';
      alert(errorMsg);
      console.error('修改密码错误:', error);
    }
  };


  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* 顶栏 */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "#feb47b",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Administrator Panel（アドミニストレーター_パネル）
          </Typography>

          {/* 通知图标 */}
          {notificationEnabled && (
            <Tooltip title="通知">
              <IconButton color="inherit" sx={{ mr: 1 }} onClick={handleOpenNotification}>
                <Badge badgeContent={unreadCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          {!notificationEnabled && (
            <Tooltip title="通知已禁用">
              <IconButton color="inherit" sx={{ mr: 1, opacity: 0.5 }} disabled>
                <Notifications />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="账户设置">
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "#ff6b6b",
                  fontSize: "0.9rem",
                }}
              >
                王様
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleOpenProfile}>
              <AccountCircle sx={{ mr: 1 }} /> 个人资料
            </MenuItem>
            <MenuItem onClick={handleOpenAccount}>
              <SettingsIcon sx={{ mr: 1 }} /> 账户设置
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} /> 退出登录
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* 左侧栏 */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerOpen ? drawerWidth : drawerCollapsedWidth,
          flexShrink: 0,
          transition: "width 0.3s",
          [`& .MuiDrawer-paper`]: {
            width: drawerOpen ? drawerWidth : drawerCollapsedWidth,
            boxSizing: "border-box",
            transition: "width 0.3s",
            overflowX: "hidden",
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        <Toolbar />

        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: drawerOpen ? "flex-start" : "center",
            minHeight: 64,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#ff6b6b",
              width: 40,
              height: 40,
            }}
          >
            A
          </Avatar>
          {drawerOpen && (
            <Typography
              variant="subtitle1"
              sx={{ ml: 1.5, fontWeight: 600, color: "#333" }}
            >
              系统名称是ndsl
            </Typography>
          )}
        </Box>

        <List sx={{ pt: 2 }}>
          {menu.map((item) => (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 1,
                justifyContent: drawerOpen ? "initial" : "center",
                "&.Mui-selected": {
                  bgcolor: "#feb47b",
                  color: "#ffffffff",
                  "&:hover": {
                    bgcolor: "#feb47b",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "#ffffffff",
                  },
                },
                "&:hover": {
                  bgcolor: "#fff677ff",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: drawerOpen ? 2 : "auto",
                  justifyContent: "center",
                  color: location.pathname === item.path ? "#ffe6cdff" : "#feb47b",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {drawerOpen && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.95rem",
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                />
              )}
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* 主内容区 */}
      <Box
        component="main"
        sx={{
          // width: 1290,
          // width:"100%",
          width: drawerOpen //主内容区的Box宽度=屏幕宽度-左侧栏的g宽度（无论收缩）
            ? `calc(100vw - ${drawerWidth}px)` 
            : `calc(100vw - ${drawerCollapsedWidth}px)`,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          // minWidth: 0,
          bgcolor: "#fbff7faf",
        }}
      >
        <Toolbar />

        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: "auto",
            minHeight: 0,
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* 通知弹窗 */}
      {notificationEnabled && (
        <Dialog
          open={notificationDialogOpen}
          onClose={() => setNotificationDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">通知中心</Typography>
              <Typography variant="body2" color="text.secondary">
                {unreadCount}条未读
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <List sx={{ p: 0 }}>
              {notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    // bgcolor: notification.read ? 'transparent' : '#f5f5f5',
                    bgcolor: notification.read ? 'transparent' : '#fbff7faf',
                    mb: 1,
                    borderRadius: 1,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                    <Circle
                      sx={{
                        fontSize: 8,
                        // color: notification.read ? 'transparent' : '#1976d2',
                        color: notification.read ? 'transparent' : '#feb47b',
                        mr: 1
                      }}
                    />
                    <Typography variant="subtitle2" fontWeight={600}>
                      {notification.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                      {notification.time}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                    {notification.content}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setNotificationDialogOpen(false)}
              sx={{ color: '#feb47b' }}
            >
              关闭
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: '#feb47b' }}
              onClick={handleMarkAllAsRead}
            >
              全部标记为已读
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* 个人资料弹窗 */}
      <Dialog
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>个人资料</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="用户名"
              value={currentUserProfile.name}
              defaultValue={localStorage.getItem('userName') || '王様'}
              margin="normal"
              disabled //不可操作
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
            <TextField
              fullWidth
              label="邮箱"
              value={currentUserProfile.email}
              // defaultValue={localStorage.getItem('userEmail') || ''}
              margin="normal"
              disabled
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
            <TextField
              fullWidth
              label="角色"
              value={currentUserProfile.role}
              // defaultValue="管理员"
              margin="normal"
              disabled
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialogOpen(false)} sx={{ color: '#feb47b' }}>
            {/* 取消 */}
            关闭
          </Button>
          {/* <Button sx={{ bgcolor: '#feb47b' }} variant="contained" onClick={() => setProfileDialogOpen(false)}>
            保存
          </Button> */}
        </DialogActions>
      </Dialog>

      {/* 账户设置弹窗 */}
      <Dialog
        open={accountDialogOpen}
        onClose={() => setAccountDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>账户设置 - 修改密码</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="当前密码"
              type="password"
              margin="normal"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
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
            <TextField
              fullWidth
              label="新密码"
              type="password"
              margin="normal"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
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
            <TextField
              fullWidth
              label="确认新密码"
              type="password"
              margin="normal"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAccountDialogOpen(false)} sx={{ color: '#feb47b' }}>
            取消
          </Button>
          <Button sx={{ bgcolor: '#feb47b' }} variant="contained" onClick={handleChangePassword}>
            修改密码
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
