import * as React from 'react';
import axios from 'axios';
import moment from 'moment';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Slide } from '@mui/material';

import getSymbolFromCurrency from 'currency-symbol-map'

import UpsertTransactionDialog from './UpsertTransactionDialog';

import './Dashboard.css';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const generateMonthsList = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const month = moment().month(i);
      months.push({
        monthNumber: i + 1,
        monthName: month.format('MMMM')
      });
    }
    return months;
}
  
const monthsList = generateMonthsList();

export default function Dashboard() {
    const [currentCategories, setCurrentCategories] = React.useState([]);
    const [currentIncomeCat, setCurrentIncomeCat] = React.useState([]);
    const [currentExpenseCat, setCurrentExpenseCat] = React.useState([]);
    const [year, setYear] = React.useState(moment().format('YYYY'));
    const [yearTransactions, setYearTransactions] = React.useState([]);
    const [isUpsertDialogOpen, setIsUpsertDialogOpen] = React.useState(false);
    const [transactionToEdit, setTransactionToEdit] = React.useState('');
    const [successSnackbar, setSuccessSnackbar] = React.useState('');
    const [failureSnackbar, setFailureSnackbar] = React.useState('');

    const getAllCategories = async () => {
        try {
            let response = await axios.get('http://localhost:3001/category/get-all');
            setCurrentCategories(response.data);
        } catch (err) {
            throw new Error(err);
        }
    };

    const getCategoriesByType = async () => {
        try {
            let response = await axios.get('http://localhost:3001/category/get-by-type');
            setCurrentIncomeCat(response.data.income_cat);
            setCurrentExpenseCat(response.data.expense_cat);
        } catch (err) {
            throw new Error(err);
        }
    };

    const getAllTransactionsForYear = async (year) => {
        try {
            let response = await axios.get('http://localhost:3001/transaction/get-all-year', { params: { year } });
            setYearTransactions(response.data);
        } catch (err) {
            throw new Error(err);
        }
    };

    React.useEffect(() => {
        getAllCategories();
        getCategoriesByType();
    }, []);

    React.useEffect(() => {
        getAllTransactionsForYear(year);
    }, [year]);

    const handleYearSelection = (e) => {
        setYear(e.target.value);
    };

    const openUpsertDialog = (transactionToEdit) => {
        setTransactionToEdit(transactionToEdit);
        setIsUpsertDialogOpen(true);
    };

    const closenUpsertDialog = (transactionToEdit) => {
        setIsUpsertDialogOpen(false);
    };

    const handleSnackbarClose = () => {
        setSuccessSnackbar('');
        setFailureSnackbar('');
    };

    const handleTransactionAdd = async ({ userId = '1', amount, date, categoryId }) => {
        try {
            await axios.post('http://localhost:3001/transaction', 
            { 
                user_id: userId, 
                amount,
                date,
                category_id: categoryId
            });
            await getAllTransactionsForYear(year);
            setIsUpsertDialogOpen(false);
            setSuccessSnackbar('Category successfully added!');
        } catch (err) {
            setFailureSnackbar('Something went wrong!');
            throw new Error(err);
        }
    };
    const handleTransactionEdit = () => {};

    const getCategoryTransactionsForMonth = (categoryId, month) => {
        return yearTransactions.filter(transaction => transaction.category_id === categoryId && moment(transaction.date).month() + 1 === month).reduce((acc, curr) => acc + curr.amount, 0);
    };

    return (
        <Stack spacing={2}>
            <div className='top-bar'>
                <Button variant="contained" color='secondary' startIcon={<AddOutlinedIcon/>} onClick={() => {openUpsertDialog('')}}>
                    Add a transaction
                </Button>
                <UpsertTransactionDialog
                    isOpen={isUpsertDialogOpen}
                    onClose={closenUpsertDialog}
                    onSubmit={transactionToEdit ? handleTransactionEdit : handleTransactionAdd}
                    transactionToEdit={transactionToEdit}
                    categories={currentCategories}
                />
                <Select
                    id="year-selection"
                    value={year}
                    onChange={handleYearSelection}
                    variant='standard'
                    sx={{width: 'fit-content'}}
                    >
                    <MenuItem value={'2023'}>2023</MenuItem>
                    <MenuItem value={'2024'}>2024</MenuItem>
                    <MenuItem value={'2025'}>2025</MenuItem>
                </Select>
            </div>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="transactions table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Category</TableCell>
                            {monthsList.map(month =>
                                <TableCell key={`${month.monthNumber}`} align="right" sx={{ whiteSpace: 'nowrap' }}>{month.monthName} {year}</TableCell>    
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow sx={{}}>
                            <TableCell component="th" scope="row" sx={{ whiteSpace: 'nowrap', borderBottom: '0', fontWeight: 'bold' }}>
                                Income
                            </TableCell>
                        </TableRow>
                        {currentIncomeCat.map((category) => (
                            <TableRow key={category._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row" sx={{ whiteSpace: 'nowrap' }}>
                                    {category.title}
                                </TableCell>
                                {monthsList.map(month =>
                                    <TableCell key={category._id + '_' + month.monthNumber} component="td" scope="row" sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                                        <span className='currency-symbol'>{getSymbolFromCurrency('ILS')}</span>
                                        <span className='month-amount'>{getCategoryTransactionsForMonth(category._id, month.monthNumber)}</span>
                                    </TableCell> 
                                )}
                            </TableRow>
                        ))}
                        <TableRow sx={{}}>
                            <TableCell component="th" scope="row" sx={{ whiteSpace: 'nowrap', borderBottom: '0', fontWeight: 'bold' }}>
                                Expense
                            </TableCell>
                        </TableRow>
                        {currentExpenseCat.map((category) => (
                            <TableRow key={category._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row" sx={{ whiteSpace: 'nowrap' }}>
                                    {category.title}
                                </TableCell>
                                {monthsList.map(month =>
                                    <TableCell key={category._id + '_' + month.monthNumber} component="td" scope="row" sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                                        <span className='currency-symbol'>{getSymbolFromCurrency('ILS')}</span>
                                        <span className='month-amount'>{getCategoryTransactionsForMonth(category._id, month.monthNumber)}</span>
                                    </TableCell> 
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Snackbar open={(successSnackbar || failureSnackbar) ? true : false} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} TransitionComponent={Slide}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {successSnackbar || failureSnackbar}
                </Alert>
            </Snackbar>
        </Stack>
    )
};