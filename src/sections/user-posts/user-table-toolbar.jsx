import { useState } from 'react';
import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';

import {POSTS_URL} from '../../utils/apiUrls';

// ----------------------------------------------------------------------

export default function UserTableToolbar({ onDeleteSuccess, selected, numSelected, filterName, onFilterName }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    const deletePost = async () => {
      try {
        const response = await fetch(`${POSTS_URL}/delete-multiple`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`
          },
          body: JSON.stringify(selected),
        });
        if(response.status === 204){
          onDeleteSuccess(selected);
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
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder="Search posts..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete}>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
    <Dialog
    open={isDeleteDialogOpen}
    onClose={handleCancelDelete}
    aria-labelledby="delete-post-dialog-title"
    aria-describedby="delete-post-dialog-description"
    padding="2"
  >
    <DialogTitle id="delete-post-dialog-title">
      Are you sure you want to delete this post?
    </DialogTitle>
    <DialogContent>
      {/* Add any additional content or details about the deletion if needed */}
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCancelDelete} color="primary">
        Cancel
      </Button>
      <Button variant="contained" onClick={handleConfirmDelete} color="error">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
 </>
  );
}

UserTableToolbar.propTypes = {
  onDeleteSuccess: PropTypes.any,
  selected: PropTypes.any,
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};
