import React from 'react';
import { Route, Routes, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import 'dayjs/locale/he';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CategoriesPage from './pages/CategoriesPage';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import Box from '@mui/material/Box';

const outerTheme = createTheme({
  palette: {
    primary: {
      main: '#1D4350',
      dark: '#1565c0'
    },
    secondary: {
      main: '#A43931',
    },
  },
  components: {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#1D4350'
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: '#1D4350'
        }
      }
    },
    // MuiTypography: {
    //   styleOverrides: {
    //     root: {
    //       color: grey[50]
    //     }
    //   }
    // }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  }
});

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    // <Router>
      <div style={{ display: 'flex' }}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <ThemeProvider theme={outerTheme}>
                <Sidebar navigate={navigate} path={location.pathname}/>
                <Box component="main" sx={{ flexGrow: 1, p: '84px 20px 20px 20px' }}>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/" element={<Navigate replace to="/dashboard" />} />
                      <Route path="/categories" element={<CategoriesPage />} />
                    </Routes>
                </Box>
          </ThemeProvider>
        </LocalizationProvider>
      </div>
    // </Router>
  );
}

export default App;