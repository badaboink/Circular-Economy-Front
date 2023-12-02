import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Autocomplete from '@mui/material/Autocomplete';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';

import {POSTS_URL, RESOURCE_TYPES_URL } from '../../utils/apiUrls';


// ----------------------------------------------------------------------

const CustomPaper = (props) => <Paper elevation={2} {...props} />;

export default function PostInput() {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    title: '',
    address: '',
    description: '',
    price: '',
    type: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [priceError, setPriceError] = useState('');
  const [resourceTypes, setResourceTypes] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'price') {
      if (!/^\d*\.?\d*$/.test(value)) {
        setPriceError('Please enter a valid non-negative number');
      } else {
        setPriceError('');
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClick = async (event) =>{
    event.preventDefault();
    try{
      if(!priceError && !errorMessage)
      {
        const post = {
          title: formData.title,
          address: formData.address,
          description: formData.description,
          image: selectedImage,
          price: formData.price,
          resourceType: formData.type.name,
          latitude: 54.8985,
          longitude: 23.9036
        };
        console.log(post);
        const response = await fetch(POSTS_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`
          },
          body: JSON.stringify(post),
        });
        if (response.status === 201) {
          window.location = "/";
        }else {
          setErrorMessage('Posting failed');
        }
      }
    } catch (error) {
      console.error('Posting failed:', error);
      setErrorMessage('An error occurred while posting.');
    }
  };
  useEffect(() => {
    const fetchResourceTypes = async () => {
      try {
        const response = await fetch(RESOURCE_TYPES_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const responseData = await response.json();

        // Assuming responseData is an array of resource types
        setResourceTypes(responseData.data);
        console.log(responseData);
      } catch (error) {
        console.error('Error fetching resource types:', error);
      }
    };

    fetchResourceTypes();
  }, []);

  const renderForm = (
    <form noValidate onSubmit={handleClick}>
      <Stack spacing={3}>
        <TextField
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
          />
        <TextField
            name="address"
            label="Address"
            value={formData.address}
            onChange={handleChange}
          />

        <TextField
          name="description"
          label="Description"
          value={formData.password}
          onChange={handleChange}
        />
        <TextField
          name="price"
          label="Price"
          type="number"
          value={formData.password}
          onChange={handleChange}
          error={!!priceError}
          helperText={priceError}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            setSelectedImage(event.target.files[0]);
          }}
        />
        <Autocomplete
          id="types"
          name="types"
          label="Resource types"
          value={formData.type}
          options={resourceTypes}
          getOptionLabel={(option) => option?.description || ''} 
          PaperComponent={CustomPaper}
          renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
          onChange={(event, newValue) => {
            setFormData({
              ...formData,
              type: newValue,
            });
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
        Post
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
          <Typography variant="h4" sx={{mb:1}}>Post</Typography>

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
