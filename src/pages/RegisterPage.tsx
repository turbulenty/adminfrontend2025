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
    MenuItem
} from '@mui/material';
import {
    PersonAdd as PersonAddIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Person as PersonIcon,
    Visibility,
    VisibilityOff,
    Public
} from '@mui/icons-material';


export default function RegisterPage() {
    const navigate = useNavigate();

    // 1. 首先定义 t 和 i18n
    const { t, i18n } = useTranslation();
    
    // 2. 定义所有状态
    const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // 3. 语言切换函数
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

    // 4. 表单处理函数
    const handleChange = (field: string) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [field]: event.target.value,
        });
    };

    // 5. 提交函数
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError(t("register.errorAllFields"));
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError(t("register.errorPasswordMismatch"));
            return;
        }

        if (formData.password.length < 6) {
            setError(t("register.errorPasswordLength"));
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
            setError(error.response?.data?.message || t("register.registerError"));
        }
    };

    return (
        <Box
            sx={{
                width: 1490,
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #fbd393ff, #f5576c 100%)',
                padding: 2,
                position: 'relative',
            }}
        >
            {/* 语言切换按钮 - 右上角 */}
            <IconButton
                onClick={handleLanguageMenuOpen}
                sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    },
                }}
            >
                <Public />
            </IconButton>

            {/* 语言选择菜单 */}
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
                    {/* Logo */}
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #fbd393ff, #f5576c 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                        }}
                    >
                        <PersonAddIcon sx={{ fontSize: 40, color: 'white' }} />
                    </Box>

                    <Typography component="h1" variant="h5" fontWeight={700} mb={1}>
                        {t("register.title")}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" mb={3}>
                        {t("register.subtitle")}
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                            {t("register.registerSuccess")}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label={t("register.name")}
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
                                        borderColor: '#ff6c6cff',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#ff6c6cff',
                                },
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label={t("register.email")}
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
                                        borderColor: '#ff6c6cff',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#ff6c6cff',
                                },
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label={t("register.password")}
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
                                        borderColor: '#ff6c6cff',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#ff6c6cff',
                                },
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label={t("register.confirmPassword")}
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
                                        borderColor: '#ff6c6cff',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#ff6c6cff',
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
                                background: 'linear-gradient(135deg, #fbd393ff, #f5576c 100%)',
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #fbd393ff, #f5576c 100%)',
                                },
                            }}
                        >
                            {t("register.registerButton")}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                {t("register.hasAccount")}
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
                                    {t("register.loginNow")}
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
