import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { bgGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';

import {LOGIN_URL} from '../../utils/apiUrls';
import {setUsernameIndex} from "../../utils/logic";

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = async (event) =>{
    event.preventDefault();
    try{
      const user = {
        username: formData.username,
        password: formData.password,
      };
      const loginResponse = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      const responseData = await loginResponse.json();
      if (loginResponse.status === 200) {
        localStorage.setItem('token', responseData.access_token);
        setUsernameIndex();
        window.location = "/";
      }else {
        setErrorMessage('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('An error occurred while logging in.');
    }
  };

  const renderForm = (
    <form noValidate onSubmit={handleClick}>
      <Stack spacing={3}>
        <TextField
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
          />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        sx={{mt: 3}}
      >
        Login
      </LoadingButton>
    </form>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Sign in</Typography>

          

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Don’t have an account?
            <a href='/register'><b>Get started</b></a>
          </Typography>

          {renderForm}

          {errorMessage && (
            <Typography variant="body2" sx={{ mt: 2, mb: 2, color: 'error.main' }}>
              {errorMessage}
            </Typography>
          )}
        </Card>
      </Stack>
    </Box>
  );
}
