"use client";
import React from 'react'; // Add this import
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { AutoDealership } from '../types';

interface AutoDealershipTableProps {
  data: AutoDealership[];
}

const AutoDealershipTable: React.FC<AutoDealershipTableProps> = ({ data }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Operations</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <img src={row.image} alt={row.title} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
              </TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>
                <Button variant="contained" color="primary" startIcon={<Edit />} style={{ marginRight: '10px', background: '#26C6DA' }}>
                  Edit
                </Button>
                <Button variant="contained" color="error" startIcon={<Delete />} style={{ background: '#FFCDD2', color: '#000' }}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AutoDealershipTable;