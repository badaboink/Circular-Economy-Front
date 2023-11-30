import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Marker, GoogleMap, InfoWindow, useLoadScript } from '@react-google-maps/api';

import { Box, Card, Button, Typography } from '@mui/material';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100rem',
  height: '50rem',
};
const center = {
  lat: 54.8985,
  lng: 23.9036,
};

const Map = ({ filter, color }) =>  {
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: '',
    libraries,
  });

  const [zoom, setZoom] = useState(13);

  const [selectedMarker, setSelectedMarker] = useState(null);

  const handleMarkerClick = (city) => {
    setSelectedMarker(city);
    setZoom(16);
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <Card>
      <Box>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={zoom}
          center={center}
        >
          {filter.map((city, index) => (
            <Marker
              key={index}
              position={city.position}
              onClick={() => handleMarkerClick(city)}
              icon={{
                path: 'M22-48h-44v43h16l6 5 6-5h16z',
                fillColor: color, 
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
                scale: 0.8,
              }}
            />
          ))}

        {selectedMarker && selectedMarker.position && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
              options={{ maxWidth: 250, minWidth: 250 }}
            >
              <div>
                <Typography variant="h4">{selectedMarker.title}</Typography>
                <Typography variant="subtitle2">Address</Typography>
                <Typography variant="body">{selectedMarker.description}</Typography>
                <center><Button>Contact</Button></center>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </Box>
    </Card>
  );
}

Map.propTypes = {
  filter: PropTypes.array,
  color: PropTypes.string,
};
export default Map;