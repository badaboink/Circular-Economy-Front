import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import {POSTS_URL} from '../../utils/apiUrls';

// ----------------------------------------------------------------------

export default function UserTableRow({
  postId,
  selected,
  postTitle,
  postDescription,
  price,
  address,
  resourceTypeDescription,
  handleClick,
  onDeleteSuccess,
}) {
  const [open, setOpen] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleEdit = () => {
    navigate(`/post/${postId}`);
  };

  const handleDelete = () => {
    setOpen(null);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    const deletePost = async () => {
      try {
        const response = await fetch(`${POSTS_URL}/${postId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`
          },
        });
        if(response.status === 204){
          onDeleteSuccess([postId]);
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
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {postTitle}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{postDescription}</TableCell>

        <TableCell>{price} €</TableCell>

        <TableCell>{address}</TableCell>

        <TableCell>{resourceTypeDescription}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      {/* Confirmation Modal */}
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
      </Dialog>
    </>
  );
}

UserTableRow.propTypes = {
  postDescription: PropTypes.any,
  handleClick: PropTypes.func,
  price: PropTypes.any,
  postTitle: PropTypes.any,
  address: PropTypes.any,
  selected: PropTypes.any,
  resourceTypeDescription: PropTypes.any,
  postId: PropTypes.any,
  onDeleteSuccess: PropTypes.any
};
