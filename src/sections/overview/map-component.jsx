
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import { Marker, GoogleMap, InfoWindow, useLoadScript } from '@react-google-maps/api';

import { Box, Card, Button, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';

import {isLoggedIn, getUsername} from '../../utils/logic';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100rem',
  height: '50rem',
};

const Map = ({ filter, color, center }) =>  {
  const navigate = useNavigate();
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
  const offsetPixels = 0.30;
  const handleMarkerClick = useCallback((city) => {
    setSelectedMarker(city);
    setZoom(15);
    const adjustedPosition = {
      lat: city.position.lat + (offsetPixels / (111 * Math.cos((city.position.lat * Math.PI) / 180))),
      lng: city.position.lng,
    };
    setCenterPosition(adjustedPosition);
  }, []);
  const handleInfoWindowClose = useCallback(() => {
    setSelectedMarker(null);
    setZoom(13);
    setCenterPosition(center);
  }, [center]);
  const handleContact = useCallback((receiver) => {
    navigate(`/chat/${receiver}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <Typography variant="subtitle2"><Iconify icon="bxs:map"/>{selectedMarker.address}</Typography>
                <Typography variant="body1">{selectedMarker.description}</Typography>
                <Typography variant="body2">Price: {selectedMarker.price} €</Typography>
                <br/>
                {userIsLoggedIn && (
                  <>
                  <Typography variant="body2">post by @{selectedMarker.username}</Typography>
                  <Typography variant="body">({selectedMarker.phoneNumber}; {selectedMarker.email})</Typography>
                  </>
                )}
                <br/>
                <br/>
                { selectedMarker.image && (
                  <center>
                <img
                  src={selectedMarker.image}
                  alt="Post"
                  style={{ maxWidth: 200, maxHeight: 200 }}
                />
                </center>
                )}
                
                {userIsLoggedIn 
                && getUsername() !== selectedMarker.username
                 &&(
                <center><Button onClick={() => handleContact(selectedMarker.username)}>Contact</Button>
                </center>
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
  center: PropTypes.any
};
export default Map;