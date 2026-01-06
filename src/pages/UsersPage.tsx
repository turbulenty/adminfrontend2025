// @ts-nocheck
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Pagination,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { userApi } from '../services/api';

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
}

export default function UsersPage() {
  const { t } = useTranslation();  // 1.6添加
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    role: 'User',
    status: 'Active',
  });

  // 分页和搜索状态
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // 计算每页显示数量（根据屏幕高度）
  useEffect(() => {
    const calculatePageSize = () => {
      const screenHeight = window.innerHeight;
      const availableHeight = screenHeight - 400; // 减去头部、搜索框、分页器
      const rowsPerPage = Math.floor(availableHeight / 60);
      setPageSize(Math.max(5, rowsPerPage));
    };

    calculatePageSize();
    window.addEventListener('resize', calculatePageSize);
    return () => window.removeEventListener('resize', calculatePageSize);
  }, []);

  // 加载用户列表（带分页和搜索）
  useEffect(() => {
    loadUsers();
  }, [page, pageSize, searchQuery]);

  const loadUsers = async () => {
    try {
      const response = await userApi.getUsers(page, pageSize, searchQuery);
      if (response.data && response.data.users) {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('加载用户列表失败:', error);
      setUsers([]);
    }
  };

  // 搜索处理
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(0); // 搜索时回到第一页
  };

  // 打开新增用户对话框
  const handleAddUser = () => {
    setEditingUser(null);
    setCurrentUser({
      name: '',
      email: '',
      password: '',
      role: 'User',
      status: 'Active',
    });
    setDialogOpen(true);
  };

  // 打开编辑用户对话框
  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setCurrentUser({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status,
    });
    setDialogOpen(true);
  };

  // 保存用户
  const handleSaveUser = async () => {
    if (!currentUser.name || !currentUser.email) {
      alert('请填写姓名和邮箱');
      return;
    }

    if (!editingUser && !currentUser.password) {
      alert('请设置初始密码');
      return;
    }

    if (!editingUser && currentUser.password.length < 6) {
      alert('密码长度至少6位');
      return;
    }

    try {
      if (editingUser) {
        const updateData: any = {
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
          status: currentUser.status,
        };
        if (currentUser.password) {
          updateData.password = currentUser.password;
        }
        await userApi.updateUser(editingUser.id, updateData);
      } else {
        await userApi.createUser(currentUser);
      }
      loadUsers();
      setDialogOpen(false);
      alert(editingUser ? '用户更新成功' : '用户创建成功');
    } catch (error: any) {
      console.error('保存用户失败:', error);
      const errorMsg = error.response?.data?.message || '保存失败';
      alert(errorMsg);
    }
  };

  // 删除用户
  const handleDeleteUser = async (userId: number) => {
    if (!confirm('确定要删除该用户吗？')) {
      return;
    }

    try {
      await userApi.deleteUser(userId);
      loadUsers();
      alert('用户删除成功');
    } catch (error) {
      console.error('删除用户失败:', error);
      alert('删除失败');
    }
  };

  return (
    <Box>
      {/* 标题栏 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          {t('menu.users')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddUser}
          sx={{
            bgcolor: '#feb47b',
            '&:hover': {
              bgcolor: '#ff9a56',
            },
          }}
        >
          添加用户
        </Button>
      </Box>

      {/* 搜索框 */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="搜索用户名或邮箱..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{
                  color: '#feb47b',
                }} />
              </InputAdornment>
            ),
          }}
          sx={{
            bgcolor: 'white',
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#feb47b', // 鼠标悬停时的边框颜色
              },
              '&.Mui-focused fieldset': { // 鼠标点击时的边框颜色
                borderColor: '#feb47b',
              },
            },
          }}
        />
      </Box>

      {/* 用户表格 */}
      <TableContainer component={Paper}
        sx={{
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxHeight: 'calc(100vh - 320px)', // 视口高度 1.6 debug - (顶栏64px + 标题区域80px + 搜索框76px + 分页器100px)
          overflow: 'auto',
        }}>
        <Table stickyHeader>  {/* 添加 stickyHeader 让表头固定 */}
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: '#feb47b' }}>ID</TableCell>
              <TableCell sx={{ bgcolor: '#feb47b' }}>姓名</TableCell>
              <TableCell sx={{ bgcolor: '#feb47b' }}>邮箱</TableCell>
              <TableCell sx={{ bgcolor: '#feb47b' }}>角色</TableCell>
              <TableCell sx={{ bgcolor: '#feb47b' }}>状态</TableCell>
              <TableCell align="center" sx={{ bgcolor: '#feb47b' }}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    size="small"
                    sx={{
                      fontWeight: 500,
                      ...(user.role === 'Admin' && {
                        bgcolor: '#99d0ffff',
                        color: 'white',
                      }),
                      ...(user.role === 'Manager' && {
                        bgcolor: '#5fdbc4ff',
                        color: 'white',
                      })
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    size="small"
                    color={user.status === 'Active' ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => handleEditUser(user)}
                    sx={{ color: '#feb47b' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteUser(user.id)}
                    sx={{ color: '#ff6b6b', ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 分页组件 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(event, value) => setPage(value - 1)}
          color="primary"
          showFirstButton
          showLastButton
          sx={{
            '& .MuiPaginationItem-root': {
              '&.Mui-selected': {
                bgcolor: '#feb47b',
                color: 'white',
                '&:hover': {
                  bgcolor: '#ff9a56',
                },
              },
            },
          }}
        />
      </Box>

      {/* 添加/编辑用户对话框 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUser ? '编辑用户' : '添加用户'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="姓名"
              value={currentUser.name}
              onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
              margin="normal"
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
              value={currentUser.email}
              onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
              margin="normal"
              disabled={!!editingUser}
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
              label={editingUser ? '新密码（留空则不修改）' : '密码'}
              type="password"
              value={currentUser.password}
              onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
              margin="normal"
              helperText={editingUser ? '至少6位，留空则不修改' : '初始密码，至少6位'}
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
              select
              label="角色"
              value={currentUser.role}
              onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
              margin="normal"
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
            >
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
            </TextField>

            <TextField
              fullWidth
              select
              label="状态"
              value={currentUser.status}
              onChange={(e) => setCurrentUser({ ...currentUser, status: e.target.value })}
              margin="normal"
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
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#feb47b' }}>
            取消
          </Button>
          <Button variant="contained" onClick={handleSaveUser} sx={{ bgcolor: '#feb47b' }}>
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
