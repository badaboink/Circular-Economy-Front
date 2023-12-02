
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Map from '../map-component';
import {isLoggedIn } from "../../../utils/logic";
import {POSTS_URL} from "../../../utils/apiUrls";

// ----------------------------------------------------------------------

const defaultFilter = [
];
export default function AppView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { index } = useParams();
  const [filter, setFilter] = useState(defaultFilter);
  const [color, setColor] = useState(theme.palette.primary.main);
  const userIsLoggedIn = isLoggedIn(); 

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
          title: item.title,
          position: { lat: item.latitude, lng: item.longitude },
          address: item.address,
          description: item.description,
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
              title: item.title,
              position: { lat: item.latitude, lng: item.longitude },
              address: item.address,
              description: item.description,
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

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          {userIsLoggedIn &&(
            <Typography variant="h4" sx={{ mb: 5 }}>
            Hi, Welcome back 👋
            </Typography>
          )}
          {!userIsLoggedIn &&(
            <Typography variant="h4" sx={{ mb: 5 }}>
            Welcome ♻️
            </Typography>
          )}
        </Grid>
        
        <Grid item xs={12} md={6} container justifyContent="flex-end">
        {userIsLoggedIn &&(<>
          <Button variant="outlined" sx={{mr: 1}} onClick={handleNewPostClick}>
            +
          </Button>
          <Button variant="outlined">
            All posts
          </Button>
        </>)}
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Map filter={filter} color={color} />
        </Grid>
      </Grid>
    </Container>
  );
}