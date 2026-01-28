// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
    Menu,
    MenuItem,
} from '@mui/material';
import {
    Login as LoginIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
    Public,
} from '@mui/icons-material';

export default function LoginPage() {
    const navigate = useNavigate();

    // ← 1. 首先定义 t 和 i18n（参考layout的顺序）
    const { t, i18n } = useTranslation();

    // ← 2. 然后定义所有状态
    const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // ← 3. 语言切换函数
    const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setLanguageAnchorEl(event.currentTarget);
    };

    const handleLanguageMenuClose = () => {
        setLanguageAnchorEl(null);
    };

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
        setLanguageAnchorEl(null);
    };

    // ← 4. 表单处理函数
    const handleChange = (field: string) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [field]: event.target.value,
        });
    };

    // ← 5. 提交函数
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        try {
            const response = await authApi.login({
                email: formData.email,
                password: formData.password,
            });

            if (response.data.success) {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userEmail', formData.email);
                localStorage.setItem('userName', response.data.user.name);
                localStorage.setItem('userRole', response.data.user.role);
                navigate('/dashboard');
            }
        } catch (error: any) {
            setError(error.response?.data?.message || t("login.loginError"));
        }
    };

    // const handleSubmit = async (event: React.FormEvent) => {
    //     event.preventDefault();

    //     if (formData.email && formData.password) {
    //         localStorage.setItem('isAuthenticated', 'true');
    //         localStorage.setItem('userEmail', formData.email);
    //         navigate('/dashboard');
    //     } else {
    //         setError('请输入邮箱和密码');
    //     }
    // };

    return (
        <Box
            sx={{
                width: 1490,
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #ffff69ff, #ff6c6cff)',
                // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: 2,
                position: 'relative',  //让IconButton可以absolute定位
            }}

        >
            {/* 语言切换按钮1.28/~ */}
            <IconButton
                onClick={handleLanguageMenuOpen}
                sx={{
                    position: 'absolute',
                    top: 20,
                    left: '50%',  //0128
                    transform: 'translateX(-50%)',  //实现真正的居中
                    color: 'white',
                    backgroundColor: '#ff6c6cff',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    },
                }}
            >
                <Public />
            </IconButton>

            {/* 语言选择Menu - 添加这个 */}
            <Menu
                anchorEl={languageAnchorEl}
                open={Boolean(languageAnchorEl)}
                onClose={handleLanguageMenuClose}
            >
                <MenuItem
                    onClick={() => handleLanguageChange('zh')}
                    selected={i18n.language === 'zh'}
                >
                    中文
                </MenuItem>
                <MenuItem
                    onClick={() => handleLanguageChange('en')}
                    selected={i18n.language === 'en'}
                >
                    English
                </MenuItem>
                <MenuItem
                    onClick={() => handleLanguageChange('ja')}
                    selected={i18n.language === 'ja'}
                >
                    日本語
                </MenuItem>
            </Menu>
            {/* 语言切换按钮1.28~/ */}
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
                            //   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            background: 'linear-gradient(135deg, #ffff69ff, #ff6c6cff)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                        }}
                    >
                        <LoginIcon sx={{ fontSize: 40, color: 'white' }} />
                    </Box>

                    <Typography component="h1" variant="h4" fontWeight={700} mb={1}>
                        {t("login.title")}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" mb={3}>
                        {t("login.subtitle")}
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label={t("login.email")}
                            name="email"
                            autoComplete="email"
                            autoFocus
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
                                        borderColor: '#ff6c6cff',  // 边框颜色
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
                            label={t("login.password")}
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
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

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{
                                mt: 3,
                                mb: 2,
                                // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                background: 'linear-gradient(135deg, #ffff69ff, #ff6c6cff)',
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600,
                                '&:hover': {
                                    //   background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                    background: 'linear-gradient(135deg, #ffff69ff, #ff6c6cff)',
                                },
                            }}
                        >
                            {t("login.loginButton")}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                {t("login.noAccount")}
                                <Link
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/register');
                                    }}
                                    sx={{
                                        ml: 0.5,
                                        // color: '#667eea',
                                        color: '#ff6c6cff',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        '&:hover': {
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    {t("login.registerNow")}
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
