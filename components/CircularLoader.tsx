import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const CircularLoader: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 1300,
      }}
    >
      <CircularProgress sx={{ color: '#FF5722' }} />
    </Box>
  );
};

export default CircularLoader;