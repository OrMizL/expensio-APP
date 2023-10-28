import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import getSymbolFromCurrency from 'currency-symbol-map'

export default function UpsertTransactionDialog({ isOpen, onClose, onSubmit, transactionToEdit, categories }) {
  const [categoryId, setCategoryId] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [date, setDate] = React.useState(moment());
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (transactionToEdit) {

    } else {

    }
  }, [transactionToEdit]);


  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      resetForm();
      await onSubmit({ amount: parseFloat(amount.substring(1)), date: date.startOf('day'), categoryId });
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
      await onSubmit();
    } catch (err) {
      console.log(err);
    } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
    };
  };
  
  const resetForm = () => {
    setCategoryId('');
    setAmount('');
    setDate(moment());
  };

  const handleClosing = () => {
    resetForm();
    onClose();
  };

  const handleCategoryChange = (event) => {
    setCategoryId(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClosing}>
        <DialogTitle>New Transaction</DialogTitle>
        <DialogContent sx={{display: 'flex', flexDirection: 'column'}}>
          <FormControl variant="outlined" sx={{ mt: 1 }}>
            <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
            <OutlinedInput
              id="standard-adornment-amount"
              startAdornment={<InputAdornment position="start">{getSymbolFromCurrency('ILS')}</InputAdornment>}
              value={amount}
              label="Amount"
              onChange={handleAmountChange}
            />
          </FormControl>
          <FormControl sx={{m: '20px 0px'}} variant="outlined">
            <InputLabel htmlFor="category-select">Category</InputLabel>
            <Select defaultValue="" id="category-select" label="Category" onChange={handleCategoryChange}>
              <ListSubheader>Income</ListSubheader>
              {
                categories.filter(category => category.type === 'income').map(category =>
                  <MenuItem value={category._id} key={category._id}>{category.title}</MenuItem>
                )
              }
              <ListSubheader>Expense</ListSubheader>
              {
                categories.filter(category => category.type === 'expense').map(category =>
                  <MenuItem value={category._id} key={category._id}>{category.title}</MenuItem>
                )
              }
            </Select>
          </FormControl>
          <DatePicker
            value={date}
            onChange={(newValue) => setDate(newValue)}
            onError={err => console.log(err)}
            format="YYYY-MM"
            views={['month', 'year']}
          />
        </DialogContent>
        {isLoading ?
          <Box sx={{textAlign: 'end', margin: '8px 16px'}}>
            <CircularProgress sx={{scale: '0.7'}}/>
          </Box>
          :
          <DialogActions>
            <Button onClick={handleClosing}>Cancel</Button>
            { transactionToEdit ? <Button onClick={() => handleEditSubmit(transactionToEdit._id)}>Update</Button> : <Button onClick={handleSubmit}>Add</Button> }
          </DialogActions>
        }
        
      </Dialog>
    </div>
  );
}