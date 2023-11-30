
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Map from '../map-component';

// ----------------------------------------------------------------------

const filter1 = [
  {
    title: 'Title1',
    position: { lat: 54.9087, lng: 23.9229 },
    description: 'Description 1...',
  },
  {
    title: 'Title2',
    position: { lat: 54.8776, lng: 23.8821 },
    description: 'Description 2...',
  },
];
const filter2 = [
  {
    title: 'Title3',
    position: { lat: 54.9132, lng: 23.8210 },
    description: 'Description 3...',
  },
  {
    title: 'Title5',
    position: { lat: 54.904974, lng: 23.957220  },
    description: 'Description 4...',
  },
];
const filters = [filter1, filter2];
const defaultFilter = [
];
export default function AppView() {
  const theme = useTheme();

  const { index } = useParams();
  const [filter, setFilter] = useState(defaultFilter);
  const [color, setColor] = useState(theme.palette.primary.main);

 

  useEffect(() => {
    const colors = [theme.palette.primary.light, theme.palette.primary.dark];
    const filterIndex = parseInt(index, 10);
    if (!Number.isNaN(filterIndex) && filterIndex >= 0 && filterIndex < filters.length) {
      setFilter(filters[filterIndex]);
      setColor(colors[filterIndex])
    } else {
      setFilter(defaultFilter);
    }
  }, [index, theme.palette.primary.light, theme.palette.primary.dark]);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Hi, Welcome back 👋
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} container justifyContent="flex-end">
          <Button variant="outlined" sx={{mr: 1}}>
            +
          </Button>
          <Button variant="outlined">
            All posts
          </Button>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Map filter={filter} color={color} />
        </Grid>
      </Grid>
    </Container>
  );
}