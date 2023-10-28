import * as React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import UpsertCategoryDialog from '../components/UpsertCategoryDialog';
import DeleteCategoryDialog from '../components/DeleteCategoryDialog';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { ListItemSecondaryAction, Slide } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CategoriesPage() {
    const [currentCategories, setCurrentCategories] = React.useState([]);
    const [isUpsertDialogOpen, setIsUpsertDialogOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [categoryToDelete, setCategoryToDelete] = React.useState('');
    const [categoryToEdit, setCategoryToEdit] = React.useState('');
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

    React.useEffect(() => {
        getAllCategories();
    }, []);

    const openAddDialog = (category = '') => {
        setCategoryToEdit(category);
        setIsUpsertDialogOpen(true);
    };

    const closeAddDialog = () => {
        setIsUpsertDialogOpen(false);
    };

    const openDeleteDialog = (categoryToDelete) => {
        setCategoryToDelete(categoryToDelete);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    };

    const handleSnackbarClose = () => {
        setSuccessSnackbar('');
        setFailureSnackbar('');
    };

    const handleCategoryAdd = async (categoryTitle, categoryType) => {
        try {
            await axios.post('http://localhost:3001/category', { title: categoryTitle, type: categoryType });
            getAllCategories();
            setIsUpsertDialogOpen(false);
            setSuccessSnackbar('Category successfully added!');
        } catch (err) {
            setFailureSnackbar('Something went wrong!');
            throw new Error(err);
        }
    };

    const handleCategoryEdit = async (categoryId, data) => {
        try {
            await axios.put('http://localhost:3001/category', { id: categoryId, title: data.title, type: data.type });
            getAllCategories();
            setIsUpsertDialogOpen(false);
            setSuccessSnackbar('Category successfully updated!');
        } catch (err) {
            setFailureSnackbar('Something went wrong!');
            throw new Error(err);
        }
    };

    const handleCategoryDelete = async (categoryId) => {
        try {
            await axios.delete('http://localhost:3001/category', { data: { id: categoryId } });
            getAllCategories();
            setIsDeleteDialogOpen(false);
            setSuccessSnackbar('Category successfully deleted!');
        } catch (err) {
            setFailureSnackbar('Something went wrong!');
            throw new Error(err);
        }
    };

    return (
        <div>
            <Button variant="contained" color='secondary' startIcon={<AddOutlinedIcon/>} onClick={() => openAddDialog('')}>
                Add a category
            </Button>
            <UpsertCategoryDialog 
                isOpen={isUpsertDialogOpen}
                onClose={closeAddDialog}
                onSubmit={categoryToEdit ? handleCategoryEdit : handleCategoryAdd}
                categoryToEdit={categoryToEdit}
            />
            <DeleteCategoryDialog 
                isOpen={isDeleteDialogOpen}
                onClose={closeDeleteDialog}
                onSubmit={handleCategoryDelete}
                categoryToDelete={categoryToDelete}
            />
            <Typography variant="h6" component="div" sx={{ marginTop: '10px' }}>
                Categories
            </Typography>
            <List dense={true}>
                {currentCategories.map(category => 
                    <ListItem
                    key={category._id}
                    >
                    <ListItemText
                    primary={category.title}
                    secondary={category.type}
                    />
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="edit" onClick={() => openAddDialog(category)}>
                            <EditOutlinedIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => openDeleteDialog(category)}>
                            <DeleteOutlinedIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                    </ListItem>
                )}
            </List>
            <Snackbar open={(successSnackbar || failureSnackbar) ? true : false} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} TransitionComponent={Slide}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {successSnackbar || failureSnackbar}
                </Alert>
            </Snackbar>
        </div>
    )
};