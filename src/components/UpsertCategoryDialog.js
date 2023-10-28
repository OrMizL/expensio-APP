import * as React from 'react';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function UpsertCategoryDialog({ isOpen, onClose, onSubmit, categoryToEdit }) {
  const [type, setType] = React.useState('income');
  const [title, setTitle] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (categoryToEdit) {
      setTitle(categoryToEdit.title);
      setType(categoryToEdit.type);
    } else {
      setTitle('');
      setType('income');
    }
  }, [categoryToEdit]);


  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await onSubmit(title, type);
    } catch (err) {
      console.log(err);
    } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
    };
  };

  const handleEditSubmit = async (categoryId) => {
    try {
      setIsLoading(true);
      await onSubmit(categoryId, { title, type });
    } catch (err) {
      console.log(err);
    } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
    };
  };

  const handleClosing = () => {
    onClose();
  }

  const handleTypeChange = (event, newType) => {
    setType(newType);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClosing}>
        <DialogTitle>New Category</DialogTitle>
        <DialogContent>
          <Input
            autoFocus
            value={title}
            onChange={handleTitleChange}
            margin="dense"
            id="title"
            placeholder="Category Title"
            fullWidth
            required
          />
          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={handleTypeChange}
            aria-label="type"
            sx={{mt: 2}}
            >
            <ToggleButton value="income" color='success'>Income</ToggleButton>
            <ToggleButton value="expense" color='error'>Expense</ToggleButton>
          </ToggleButtonGroup>
        </DialogContent>
        {isLoading ?
          <Box sx={{textAlign: 'end', margin: '8px 16px'}}>
            <CircularProgress sx={{scale: '0.7'}}/>
          </Box>
          :
          <DialogActions>
            <Button onClick={handleClosing}>Cancel</Button>
            { categoryToEdit ? <Button onClick={() => handleEditSubmit(categoryToEdit._id)}>Update</Button> : <Button onClick={handleSubmit}>Add</Button> }
          </DialogActions>
        }
        
      </Dialog>
    </div>
  );
}