"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { Box, CssBaseline, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Sidebar from '../components/Sidebar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from '@/components/Header';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5722',
    },
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState('');

  // Reset search term when the route changes
  useEffect(() => {
    setSearchTerm('');
  }, [pathname]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
              <Box sx={{ display: 'flex' }}
              >
                <CssBaseline />
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <Box
                  component="main"
                  sx={{
                    flexGrow: 1,
                    bgcolor: '#f5f5f5',
                    minHeight: '100vh',
                  }}
                >
                  {/* Header */}
                <Header/>

                  <Box sx={{ p: '20px' }}>{children}</Box>
                </Box>
              </Box>
            </SearchContext.Provider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}