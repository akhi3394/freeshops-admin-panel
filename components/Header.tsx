"use client";

import React from 'react';
import {
  AppBar,
  Toolbar,
  TextField,
  IconButton,
  Avatar,
  Box,
  Badge,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useSearch } from '../app/layout';

const Header = () => {
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <AppBar
      position="static"
      sx={{
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        px: 3,
        py: 1,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Centered Search Bar */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F5F5F5',
              borderRadius: '8px',
              px: 2,
              py: 0.5,
              width: '500px',
            }}
          >
            <SearchIcon sx={{ color: '#888', mr: 1 }} />
            <TextField
              variant="standard"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              InputProps={{
                disableUnderline: true,
              }}
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: '14px',
                },
              }}
            />
          </Box>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Notification Icon with Badge */}
          <IconButton>
            <Badge badgeContent={6} color="error">
              <NotificationsIcon sx={{ color: '#6366F1' }} />
            </Badge>
          </IconButton>

          {/* Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              alt="Kalyani Kumar"
              src="/profile.jpg" // Replace with actual image if available
              sx={{ width: 32, height: 32 }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A' }}>
                Kalyani Kumar
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#666' }}>Admin</Typography>
            </Box>
            <KeyboardArrowDownIcon sx={{ color: '#666' }} />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
