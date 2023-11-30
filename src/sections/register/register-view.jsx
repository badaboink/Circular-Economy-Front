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

import {REGISTER_URL} from '../../utils/apiUrls';

// ----------------------------------------------------------------------

export default function RegisterView() {
  const theme = useTheme();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Validate username
    if (formData.username.trim() === '') {
      newErrors.username = 'Username is required';
      valid = false;
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
      valid = false;
    }

    const phoneNumberRegex = /^[0-9]+$/;
    if (!phoneNumberRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number (only numbers are allowed)';
      valid = false;
    }


    // Validate password
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleInputChange = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) =>{
    event.preventDefault();
    if (validateForm()) {
      try{
        const user = {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          phoneNumber: formData.phoneNumber
        };
        const registerResponse = await fetch(REGISTER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
        const responseData = await registerResponse.json();
        if (registerResponse.status === 200) {
          localStorage.setItem('token', responseData.access_token);
          window.location = "/";
        }else {
          setErrorMessage('Registration failed.');
        }
      } catch (error) {
        setErrorMessage('An error occurred while registering in.');
      }
    }
  };

  const renderForm = (
    <form noValidate onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          name="username"
          label="Username"
          value={formData.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          error={Boolean(errors.username)}
          helperText={errors.username}
        />
        <TextField
          name="email"
          label="Email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />
        <TextField
          name="phoneNumber"
          label="Phone number"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          error={Boolean(errors.phoneNumber)}
          helperText={errors.phoneNumber}
          inputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*',
          }}
        />
        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={Boolean(errors.password)}
          helperText={errors.password}
        />
      </Stack>
  
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        sx={{ mt: 3 }}
      >
        Register
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
          <Typography variant="h4">Sign up</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5, mr: 3 }}>
            Already have an account? 
            <a href='/login'><b>Sign in</b></a>
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
