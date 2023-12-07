
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PlacesAutocomplete, { getLatLng, geocodeByAddress } from 'react-places-autocomplete';

import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import Map from '../map-component';
import {isLoggedIn } from "../../../utils/logic";
import {POSTS_URL} from "../../../utils/apiUrls";

// ----------------------------------------------------------------------

const defaultFilter = [
];
const getRandomCoordinates = () => {
  const cityCoordinates = [
    { lat: 54.8985, lng: 23.9036 }, // Kaunas
    { lat: 56.9677, lng: 24.1056 }, // Riga
    { lat: 54.6872, lng: 25.2797 }, // Vilnius
  ];

  const randomIndex = Math.floor(Math.random() * cityCoordinates.length);
  return cityCoordinates[randomIndex];
};
export default function AppView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { index } = useParams();
  const [filter, setFilter] = useState(defaultFilter);
  const [color, setColor] = useState(theme.palette.primary.main);
  const userIsLoggedIn = isLoggedIn();
  const [formData, setFormData] = useState({
    address: '',
    coordinates: localStorage.getItem('selectedCoordinates')
      ? JSON.parse(localStorage.getItem('selectedCoordinates'))
      : getRandomCoordinates(),
  });

  useEffect(() => {
    const fetchData = async () => {
      const colors = [theme.palette.info.main, theme.palette.success.main, theme.palette.primary.dark, theme.palette.primary.main,
        theme.palette.secondary.light, theme.palette.primary.light, theme.palette.secondary.dark, theme.palette.secondary.main,
        theme.palette.primary.darker, theme.palette.warning.light, theme.palette.secondary.darker, theme.palette.warning.lighter,
        theme.palette.info.dark, theme.palette.info.darker, theme.palette.warning.main
      ];
      if (index) {
        const fetchResponse = await fetch(`${POSTS_URL}/${index}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const responseData = await fetchResponse.json();
        const formattedData = responseData.data.map((item) => ({
          title: item.postTitle,
          position: { lat: item.latitude, lng: item.longitude },
          address: item.address,
          description: item.postDescription,
          price: item.price,
          image: item.dropboxTemporaryLink,
          username: item.username,
        }));
        setFilter(formattedData);
        setColor(colors[responseData.index]);
      } else {
        try {
          const fetchResponse = await fetch(POSTS_URL, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const responseData = await fetchResponse.json();
          if (fetchResponse.status === 200) {
            const formattedData = responseData.data.map((item) => ({
              title: item.postTitle,
              position: { lat: item.latitude, lng: item.longitude },
              address: item.address,
              description: item.postDescription,
              price: item.price,
              image: item.dropboxTemporaryLink,
              username: item.username,
            }));
            setFilter(formattedData);
            setColor(colors[14]);
          }
          
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, [index, theme.palette.info.main, theme.palette.success.main, theme.palette.primary.dark, theme.palette.primary.main,
    theme.palette.secondary.light, theme.palette.primary.light, theme.palette.secondary.dark, theme.palette.secondary.main,
    theme.palette.primary.darker, theme.palette.warning.light, theme.palette.secondary.darker, theme.palette.warning.lighter,
    theme.palette.info.dark, theme.palette.info.darker, theme.palette.warning.main]);

  const handleNewPostClick = () => {
    navigate('/post');
  };

  const handleSelect = async (address) => {
    try {
      const results = await geocodeByAddress(address, {
        types: ['(cities)'],
      });

      const city = results[0].address_components.find(
        (component) => component.types.includes('locality')
      );
      const selectedCity = city ? city.long_name : '';

      const selectedCoordinates = await getLatLng(results[0]);

      setFormData({
        address: selectedCity,
        coordinates: selectedCoordinates,
      });
      localStorage.setItem('selectedCoordinates', JSON.stringify(selectedCoordinates));
    } catch (error) {
      console.error('Error fetching geocode details', error);
    }
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item xs={12} md={6}>

          {!userIsLoggedIn &&(
            <Typography variant="h4" sx={{ mb: 5 }}>
            Welcome ♻️
            </Typography>
          )}
          {/* {userIsLoggedIn &&( */}
            <Grid item xs={12} md={12} container justifyContent="flex-start" alignItems="flex-start">
            <PlacesAutocomplete
            value={formData.address}
            onChange={(address) => setFormData({ ...formData, address })}
            onSelect={handleSelect}
            searchOptions={{
              types: ['(cities)'],
            }}
                
              >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div>
                <TextField
                  {...getInputProps({
                    label: 'Search cities ...',
                    variant: 'outlined',
                    fullWidth: true,
                  })}
                />
                <div className="autocomplete-dropdown-container">
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion) => (
                    <div {...getSuggestionItemProps(suggestion)}>
                      {suggestion.description}
                    </div>
                  ))}
                </div>
              </div>
            )}
            </PlacesAutocomplete>
            </Grid>
          {/* )} */}
        </Grid>
        
        {userIsLoggedIn &&(
        <Grid item xs={12} md={6} container justifyContent="flex-end" alignItems="flex-start">
         <Button variant="outlined" color="inherit" sx={{mr: 1, height: 35}} onClick={handleNewPostClick} startIcon={<Iconify icon="eva:plus-fill" />}>
          New post
         </Button>
          <Button variant="outlined" color="inherit">
            All posts
          </Button>
        </Grid>
       )}
        <Grid item xs={12} md={12} lg={12}>
          {formData.coordinates && (
            <Map filter={filter} color={color} center={formData.coordinates} />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}