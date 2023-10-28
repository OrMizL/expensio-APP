import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function DeleteCategoryDialog({ isOpen, onClose, onSubmit, categoryToDelete }) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await onSubmit(categoryToDelete._id);
    } catch (err) {
      console.log(err);
    } finally {
      setTimeout(() => setIsLoading(false), 100);
    }
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete category
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you wish to delete the category "{categoryToDelete.title}"?
          </DialogContentText>
        </DialogContent>
        {
          isLoading ?
          <Box sx={{textAlign: 'end', margin: '8px 16px'}}>
            <CircularProgress sx={{scale: '0.7'}}/>
          </Box>
          :
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} autoFocus>Yes</Button>
          </DialogActions>
        }
      </Dialog>
    </div>
  );
}