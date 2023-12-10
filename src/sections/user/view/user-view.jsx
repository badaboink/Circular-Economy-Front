import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { USER_URL } from '../../../utils/apiUrls';
import { getUsername, setUsernameIndex } from '../../../utils/logic';

// ----------------------------------------------------------------------

export default function UserPage() {
  const username = getUsername();
  const [formData, setFormData] = useState();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [changeDone, setChangeDone]= useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${USER_URL}?username=${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`
          },
        });
        const responseData = await response.json();
        if (response.status === 200) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            username: responseData.username,
            email: responseData.email,
            phoneNumber: responseData.phoneNumber,
            id: responseData.userId,
          }));
        }
      } catch (error) {
        setErrorMessage('Error fetching user data');
        setSuccessMessage('');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (name === 'email') {
      const isValidEmail = validateEmail(value);
      setSuccessMessage('');
      setErrorEmail(isValidEmail ? '' : 'Invalid email address');
    }

    setChangeDone(true);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const saveProfile = async () => {
    if(!formData.password)
    {
      setErrorPassword("Must enter password to save changes.");
      return;
    }
    setErrorPassword('');
    if(!errorEmail && !errorPassword)
    {
      try {
        const response = await fetch(`${USER_URL}/${formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            password: formData.password
          }),
        });
        const responseData = await response.json();
        if (response.status === 200) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            username: responseData.username,
            email: responseData.email,
            phoneNumber: responseData.phoneNumber,
            id: responseData.userId,
          }));
          if(responseData.accessToken) {
            localStorage.setItem('token', responseData.accessToken);
            setUsernameIndex();
          }
          setSuccessMessage('User data saved.');
          setErrorMessage('');
        }else {
          setSuccessMessage('');
          setErrorMessage(responseData);
        }
      } catch (error) {
        setSuccessMessage('');
        setErrorMessage('Error updating user data');
      }
    }
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    const deletePost = async () => {
      try {
        const response = await fetch(`${USER_URL}/${formData.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`
          },
        });
        if(response.status === 204) {
          localStorage.removeItem('token');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching resource types:', error);
      }
    };
  
    deletePost();
    setIsDeleteDialogOpen(false);
  };
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
    <Container>
      <Scrollbar>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4">Profile</Typography>
          </Stack>
          {loading ? (
            <CircularProgress />
          ) : (
            <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
              <Card
                sx={{
                  p: 5,
                  width: 1,
                  maxWidth: '100rem',
                }}
              >
                <Stack spacing={1}>
                  {formData && (
                    <>
                      <Typography variant="body1">Username:</Typography>
                      <TextField
                        name="username"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                      />
                      <Typography variant="body1">Email:</Typography>
                      <TextField
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        error={Boolean(errorEmail)}
                        helperText={errorEmail}
                      />
                      <Typography variant="body1">Phone number:</Typography>
                      <TextField
                        name="phoneNr"
                        type="number"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      />
                      <Typography variant="overline" color="text.error">Enter password to confirm changes:</Typography>
                      <TextField
                        name="password"
                        value={formData.password}
                        type={showPassword ? 'text' : 'password'}
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
                        error={Boolean(errorPassword)}
                        helperText={errorPassword}
                      />
                    </>
                  )}
                </Stack>

                <Box display="flex" justifyContent="center" mt={2}>
                  <Button variant="contained" color="inherit" sx={{ width: 150 }} onClick={() => saveProfile()}>
                    Save
                  </Button>
                  <Button variant="outlined" color="error" sx={{ ml: 2, width: 150 }} onClick={() => handleDelete()}>
                    Delete account
                  </Button>
                </Box>
                {errorMessage && (
                  <Typography variant="body2" sx={{ mt: 2, mb: 2, color: 'error.main' }}>
                    {errorMessage}
                  </Typography>
                )}
                {successMessage && changeDone && !errorMessage && (
                  <Typography variant="body2" sx={{ mt: 2, mb: 2, color: 'success.main' }}>
                    {successMessage}
                  </Typography>
                )}
              </Card>
            </Stack>
          )}
        </TableContainer>
      </Scrollbar>
    </Container>
    <Dialog
    open={isDeleteDialogOpen}
    onClose={handleCancelDelete}
    aria-labelledby="delete-post-dialog-title"
    aria-describedby="delete-post-dialog-description"
    padding="2"
  >
    <DialogTitle id="delete-post-dialog-title">
      Are you sure you want to delete your account?
    </DialogTitle>
    <DialogContent>
      This action cannot be undone.
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCancelDelete} color="primary">
        Cancel
      </Button>
      <Button variant="contained" onClick={handleConfirmDelete} color="error">
        Delete
      </Button>
    </DialogActions>
  </Dialog></>
  );
}