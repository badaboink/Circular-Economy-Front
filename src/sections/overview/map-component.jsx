import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback } from 'react';
import { Marker, GoogleMap, InfoWindow, useLoadScript } from '@react-google-maps/api';

import { Box, Card, Button, Typography } from '@mui/material';

import {isLoggedIn} from '../../utils/logic';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100rem',
  height: '50rem',
};

const Map = ({ filter, color, center }) =>  {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDXBoMxUb1A-6yy3bSWPXE1QHPnwD6jmI4',
    libraries,
  });
  const userIsLoggedIn = isLoggedIn();

  useEffect(() => {
    setCenterPosition(center);
  }, [center]);

  const [zoom, setZoom] = useState(13);
  const [centerPosition, setCenterPosition] = useState(center);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const handleMarkerClick = useCallback((city) => {
    setSelectedMarker(city);
    setZoom(16);
    setCenterPosition(city.position);
  }, []);
  const handleInfoWindowClose = useCallback(() => {
    setSelectedMarker(null);
    setZoom(13);
    setCenterPosition(center);
  }, [center]);

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
          center={centerPosition}
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
              onCloseClick={handleInfoWindowClose}
              options={{ maxWidth: 300, minWidth: 300 }}
            >
              <div>
                <Typography variant="h4">{selectedMarker.title}</Typography>
                <Typography variant="subtitle2">{selectedMarker.address}</Typography>
                <Typography variant="body">{selectedMarker.description}</Typography>
                <br/>
                <Typography variant="body">Price: {selectedMarker.price} €</Typography>
                <br/>
                <center>
                <img
                  src={selectedMarker.image}
                  alt="Post"
                  style={{ maxWidth: 200, maxHeight: 200 }}
                />
                </center>
                {userIsLoggedIn &&(
                <center><Button>Contact</Button></center>
                )}
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
  center: PropTypes.array
};
export default Map;