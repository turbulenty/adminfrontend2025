// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Link,
    Alert,
    InputAdornment,
    IconButton,
} from '@mui/material';
import {
    PersonAdd as PersonAddIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Person as PersonIcon,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (field: string) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [field]: event.target.value,
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('请填写所有字段');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('两次输入的密码不一致');
            return;
        }

        if (formData.password.length < 6) {
            setError('密码长度至少6位');
            return;
        }

        try {
            const response = await authApi.register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            }
        } catch (error: any) {
            setError(error.response?.data?.message || '注册失败');
        }
    };

    // const handleSubmit = async (event: React.FormEvent) => {
    //     event.preventDefault();

    //     // 验证
    //     if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
    //         setError('请填写所有字段');
    //         return;
    //     }

    //     if (formData.password !== formData.confirmPassword) {
    //         setError('两次输入的密码不一致');
    //         return;
    //     }

    //     if (formData.password.length < 6) {
    //         setError('密码长度至少6位');
    //         return;
    //     }

    //     // TODO: 这里将来连接后端注册API
    //     // 现在模拟注册成功
    //     setSuccess(true);
    //     setError('');

    //     setTimeout(() => {
    //         navigate('/login');
    //     }, 1500);
    // };

    return (
        <Box
            sx={{
                width: 1490,
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                background: 'linear-gradient(135deg, #fbd393ff, #f5576c 100%)',
                padding: 2,
            }}
        >
            <Container component="main" maxWidth="xs">
                <Paper
                    elevation={24}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 3,
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    }}
                >
                    {/* Logo/图标 */}
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #fbd393ff, #f5576c 100%)',
                            //   background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                        }}
                    >
                        <PersonAddIcon sx={{ fontSize: 40, color: 'white' }} />
                    </Box>

                    <Typography component="h1" variant="h4" fontWeight={700} mb={1}>
                        创建新账户
                    </Typography>

                    <Typography variant="body2" color="text.secondary" mb={3}>
                        填写以下信息完成注册
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                            注册成功！正在跳转到登录页...
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="姓名"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={formData.name}
                            onChange={handleChange('name')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#ff6c6cff',  // 改成橙红色
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#ff6c6cff',  // 标签文字颜色
                                },
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="邮箱地址"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange('email')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#ff6c6cff',  // 改成橙红色
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#ff6c6cff',  // 标签文字颜色
                                },
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="密码"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange('password')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#ff6c6cff',  // 改成橙红色
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#ff6c6cff',  // 标签文字颜色
                                },
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="确认密码"
                            type={showPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange('confirmPassword')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#ff6c6cff',  // 改成橙红色
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#ff6c6cff',  // 标签文字颜色
                                },
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{
                                mt: 3,
                                mb: 2,
                                // background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                background: 'linear-gradient(135deg, #fbd393ff, #f5576c 100%)',

                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600,
                                '&:hover': {
                                    // background: 'linear-gradient(135deg, #e082ea 0%, #e4465b 100%)',
                                    background: 'linear-gradient(135deg, #fbd393ff, #f5576c 100%)',
                                },
                            }}
                        >
                            注册
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                已有账户？
                                <Link
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/login');
                                    }}
                                    sx={{
                                        ml: 0.5,
                                        color: '#ff6c6cff',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        '&:hover': {
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    立即登录
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
