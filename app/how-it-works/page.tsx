"use client";

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  TablePagination,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Typography,
  DialogContentText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSearch } from '../layout';
import { usePathname } from 'next/navigation';
import {
  useGetHowItWorksQuery,
  useAddHowItWorksMutation,
  useDeleteHowItWorksMutation,
  useUpdateHowItWorksMutation,
} from '@/redux/api/howItWorksApi';
import CircularLoader from '../../components/CircularLoader';
import { useDebounce } from '@/hooks/useDebounce';

const HowItWorksPage = () => {
  const { searchTerm } = useSearch();
  console.log(searchTerm, "searchTerm");
  const pathname = usePathname();

  // State for pagination and selection
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editHowItWorksId, setEditHowItWorksId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ceoLetterTitle: '',
    ceoLetter: '',
    checkOutExpert: '',
    image: null as File | null,
    bottomDataImage: null as File | null,
    ceoLetterBackGroundImage: null as File | null,
    checkOutExpertImage: null as File | null,
  });
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    ceoLetterTitle: '',
    ceoLetter: '',
    checkOutExpert: '',
    image: null as File | null,
    bottomDataImage: null as File | null,
    ceoLetterBackGroundImage: null as File | null,
    checkOutExpertImage: null as File | null,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [editFormError, setEditFormError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [howItWorksToDelete, setHowItWorksToDelete] = useState<string | null>(null);
  const [isFetchingHowItWorks, setIsFetchingHowItWorks] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch How It Works entries using RTK Query
  const { data, isLoading, error, refetch, isFetching } = useGetHowItWorksQuery(
    {
      search: debouncedSearchTerm,
      page: page + 1,
      limit: rowsPerPage,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [addHowItWorks, { isLoading: isCreating, error: createError }] = useAddHowItWorksMutation();
  const [updateHowItWorks, { isLoading: isUpdating, error: updateError }] = useUpdateHowItWorksMutation();
  const [deleteHowItWorks, { isLoading: isDeleting, error: deleteError }] = useDeleteHowItWorksMutation();

  const howItWorks = data?.data || [];
//   const total = data?.data?.totalDocs || 0;

  // Reset state when navigating away (on unmount)
  useEffect(() => {
    return () => {
      setPage(0);
      setSelected([]);
    };
  }, [pathname]);

  // Force refetch when searchTerm changes
  useEffect(() => {
    refetch();
  }, [debouncedSearchTerm, refetch]);

  // Handle Edit form opening and data population
  useEffect(() => {
    if (editHowItWorksId && howItWorks) {
      const entry = howItWorks.find((h: any) => h._id === editHowItWorksId);
      if (entry) {
        setEditFormData({
          title: entry.title || '',
          description: entry.description || '',
          ceoLetterTitle: entry.ceoLetterTitle || '',
          ceoLetter: entry.ceoLetter || '',
          checkOutExpert: entry.checkOutExpert || '',
          image: null,
          bottomDataImage: null,
          ceoLetterBackGroundImage: null,
          checkOutExpertImage: null,
        });
        setIsFetchingHowItWorks(false);
        setEditFormOpen(true);
        console.log('How It Works data fetched, opening Edit form');
      }
    }
  }, [editHowItWorksId, howItWorks]);

  // Handle form input changes (New How It Works)
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle edit form input changes
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files) {
      setEditFormData({ ...editFormData, [name]: files[0] });
    } else {
      setEditFormData({ ...editFormData, [name]: value });
    }
  };

  // Handle form submission (New How It Works)
  const handleSaveHowItWorks = async () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.ceoLetterTitle ||
      !formData.ceoLetter ||
      !formData.checkOutExpert ||
      !formData.image ||
      !formData.bottomDataImage ||
      !formData.ceoLetterBackGroundImage ||
      !formData.checkOutExpertImage
    ) {
      setFormError('All fields are required');
      return;
    }

    try {
      await addHowItWorks({
        title: formData.title,
        description: formData.description,
        ceoLetterTitle: formData.ceoLetterTitle,
        ceoLetter: formData.ceoLetter,
        checkOutExpert: formData.checkOutExpert,
        image: formData.image,
        bottomDataImage: formData.bottomDataImage,
        ceoLetterBackGroundImage: formData.ceoLetterBackGroundImage,
        checkOutExpertImage: formData.checkOutExpertImage,
      }).unwrap();
      setOpenForm(false);
      setFormData({
        title: '',
        description: '',
        ceoLetterTitle: '',
        ceoLetter: '',
        checkOutExpert: '',
        image: null,
        bottomDataImage: null,
        ceoLetterBackGroundImage: null,
        checkOutExpertImage: null,
      });
      setFormError(null);
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Failed to create How It Works entry';
      setFormError(errorMessage);
    }
  };

  // Handle form submission (Edit How It Works) - Placeholder since update API is not provided
  const handleUpdateHowItWorks = async () => {
    setEditFormError('Update functionality is not available yet.');
    // TODO: Implement update when API is provided
    /*
    if (
      !editFormData.title ||
      !editFormData.description ||
      !editFormData.ceoLetterTitle ||
      !editFormData.ceoLetter ||
      !editFormData.checkOutExpert
    ) {
      setEditFormError('All text fields are required');
      return;
    }

    if (!editHowItWorksId) return;

    try {
      await updateHowItWorks({
        id: editHowItWorksId,
        howItWorks: {
          title: editFormData.title,
          description: editFormData.description,
          ceoLetterTitle: editFormData.ceoLetterTitle,
          ceoLetter: editFormData.ceoLetter,
          checkOutExpert: editFormData.checkOutExpert,
          image: editFormData.image,
          bottomDataImage: editFormData.bottomDataImage,
          ceoLetterBackGroundImage: editFormData.ceoLetterBackGroundImage,
          checkOutExpertImage: editFormData.checkOutExpertImage,
        },
      }).unwrap();
      setEditFormOpen(false);
      setEditHowItWorksId(null);
      setEditFormData({
        title: '',
        description: '',
        ceoLetterTitle: '',
        ceoLetter: '',
        checkOutExpert: '',
        image: null,
        bottomDataImage: null,
        ceoLetterBackGroundImage: null,
        checkOutExpertImage: null,
      });
      setEditFormError(null);
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Failed to update How It Works entry';
      setEditFormError(errorMessage);
    }
    */
  };

  // Handle checkbox selection
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = howItWorks.map((entry: any) => entry._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleSelectClick = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((selectedId) => selectedId !== id);
    }
    setSelected(newSelected);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Handle pagination
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle multi-delete (placeholder for now)
  const handleMultiDelete = () => {
    console.log('Delete How It Works entries with IDs:', selected);
    // TODO: Call multi-delete API when available
    setSelected([]);
  };

  // Handle Edit action
  const handleEdit = (id: string) => {
    setEditHowItWorksId(id);
    setEditFormOpen(false); // Reset form open state to ensure useEffect triggers
    console.log('Edit clicked for How It Works ID:', id);
  };

  // Handle closing the Edit form
  const handleCloseEditForm = () => {
    setEditFormOpen(false);
    setEditHowItWorksId(null);
    setEditFormData({
      title: '',
      description: '',
      ceoLetterTitle: '',
      ceoLetter: '',
      checkOutExpert: '',
      image: null,
      bottomDataImage: null,
      ceoLetterBackGroundImage: null,
      checkOutExpertImage: null,
    });
    setEditFormError(null);
    setIsFetchingHowItWorks(false);
    console.log('Edit form closed');
  };

  // Handle Delete action
  const handleDelete = (id: string) => {
    setHowItWorksToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Confirm Delete action
  const confirmDelete = async () => {
    if (!howItWorksToDelete) return;

    try {
      await deleteHowItWorks(howItWorksToDelete).unwrap();
      setDeleteDialogOpen(false);
      setHowItWorksToDelete(null);
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Failed to delete How It Works entry';
      alert(errorMessage);
    }
  };

  // Shimmer effect for table rows
  const renderShimmer = () => {
    const shimmerRows = Array.from({ length: 5 }, (_, index) => (
      <TableRow key={index} sx={{ borderBottom: '1px solid #e0e0e0' }}>
        <TableCell padding="checkbox">
          <Box className="shimmer" sx={{ width: '20px', height: '20px', borderRadius: '4px' }} />
        </TableCell>
        <TableCell sx={{ width: '60px' }}>
          <Box className="shimmer" sx={{ width: '40px', height: '40px', borderRadius: '4px' }} />
        </TableCell>
        <TableCell sx={{ width: '120px' }}>
          <Box className="shimmer" sx={{ width: '80%', height: '20px', borderRadius: '4px' }} />
        </TableCell>
        <TableCell>
          <Box className="shimmer" sx={{ width: '80%', height: '20px', borderRadius: '4px' }} />
        </TableCell>
        <TableCell sx={{ width: '120px' }}>
          <Box className="shimmer" sx={{ width: '80px', height: '20px', borderRadius: '4px' }} />
        </TableCell>
      </TableRow>
    ));
    return shimmerRows;
  };

  return (
    <Box
      sx={{
        height: '300px',
        padding: '20px',
        backgroundColor: '#f2f2f2',
        borderRadius: '8px',
        position: 'relative',
        backgroundImage: `url("/bacground.jpg")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 300px',
        backgroundPosition: 'top',
      }}
    >
      {/* Add shimmer CSS globally */}
      <style jsx global>{`
        .shimmer {
          background: #f6f7f8;
          background-image: linear-gradient(
            to right,
            #f6f7f8 0%,
            #edeef1 20%,
            #f6f7f8 40%,
            #f6f7f8 100%
          );
          background-repeat: no-repeat;
          background-size: 800px 104px;
          animation: shimmer 1.5s infinite linear;
        }

        @keyframes shimmer {
          0% {
            background-position: -468px 0;
          }
          100% {
            background-position: 468px 0;
          }
        }
      `}</style>

      {/* Header Section */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingX: '10px' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'rgba(32, 34, 36, 1)', fontSize: '32px' }}>
            How It Works
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenForm(true)}
              sx={{ mr: 1, backgroundColor: '#2d98a6', color: '#fff' }}
            >
              <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M12 5V19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <span style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 1)', font: 'Nunito Sans' }}>
                Add new entry
              </span>
            </Button>
            {selected.length > 0 && (
              <IconButton onClick={handleMultiDelete} sx={{ color: '#fff' }}>
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>

      {/* How It Works Table with Scrollbars, Centered */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxHeight: '700px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', marginTop: '10px' }}>
          <Box sx={{ overflowX: 'auto', maxHeight: '700px', overflowY: 'auto' }}>
            <Table sx={{ minWidth: '800px' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < howItWorks.length}
                      checked={howItWorks.length > 0 && selected.length === howItWorks.length}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell sx={{ width: '60px', fontWeight: 'bold' }}>Image</TableCell>
                  <TableCell sx={{ width: '120px', fontWeight: 'bold' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ width: '120px', fontWeight: 'bold' }}>Operations</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(isLoading || isFetching) ? (
                  renderShimmer()
                ) : error ? (
                  <TableRow sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    <TableCell colSpan={5} align="center">
                      Failed to load entries: {JSON.stringify(error)}
                    </TableCell>
                  </TableRow>
                ) : howItWorks.length === 0 ? (
                  <TableRow sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    <TableCell colSpan={5} align="center">
                      No entries found
                    </TableCell>
                  </TableRow>
                ) : (
                  howItWorks.map((entry: any) => (
                    <TableRow
                      key={entry._id}
                      selected={isSelected(entry._id)}
                      sx={{ borderBottom: '1px solid #e0e0e0', '&:hover': { backgroundColor: '#f9f9f9' } }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected(entry._id)}
                          onChange={() => handleSelectClick(entry._id)}
                        />
                      </TableCell>
                      <TableCell sx={{ width: '60px' }}>
                        {entry.image ? (
                          <img
                            src={entry.image}
                            alt={entry.title}
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        ) : (
                          'No Image'
                        )}
                      </TableCell>
                      <TableCell sx={{ width: '120px' }}>{entry.title || "N/A"}</TableCell>
                      <TableCell sx={{ width: '250px' }}>{entry.description || "N/A"}</TableCell>
                      <TableCell sx={{ width: '120px' }}>
                        <IconButton onClick={() => handleEdit(entry._id)}>
                          <Typography
                            sx={{
                              backgroundColor: 'rgba(0, 182, 155, 0.2)',
                              width: '56.78px',
                              height: '27.37px',
                              borderRadius: '4.5px',
                              color: '#00B69B',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              fontWeight: 700,
                            }}
                          >
                            Edit
                          </Typography>
                        </IconButton>
                        <IconButton onClick={() => handleDelete(entry._id)}>
                          <Typography
                            sx={{
                              backgroundColor: 'rgba(249, 60, 101, 0.2)',
                              width: '70.97px',
                              height: '27.37px',
                              borderRadius: '4.5px',
                              color: 'rgba(248, 0, 54, 1)',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              fontWeight: 700,
                            }}
                          >
                            Delete
                          </Typography>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Box>
        </Box>
      </Box>

      {/* Custom Pagination */}
      {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Rows per page:"
          sx={{
            '& .MuiTablePagination-toolbar': {
              backgroundColor: '#fff',
              borderRadius: '20px',
              padding: '0 10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '14px',
              color: '#666',
            },
            '& .MuiTablePagination-actions': {
              marginLeft: '10px',
            },
            '& .MuiIconButton-root': {
              borderRadius: '50%',
              backgroundColor: '#f5f5f5',
              margin: '0 5px',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            },
          }}
        />
      </Box> */}

      {/* New How It Works Form Modal */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New How It Works Entry</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#ccc' },
                  '&:hover fieldset': { borderColor: '#888' },
                  '&.Mui-focused fieldset': { borderColor: '#FF5722' },
                },
              }}
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#ccc' },
                  '&:hover fieldset': { borderColor: '#888' },
                  '&.Mui-focused fieldset': { borderColor: '#FF5722' },
                },
              }}
            />
            <TextField
              label="CEO Letter Title"
              name="ceoLetterTitle"
              value={formData.ceoLetterTitle}
              onChange={handleFormChange}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#ccc' },
                  '&:hover fieldset': { borderColor: '#888' },
                  '&.Mui-focused fieldset': { borderColor: '#FF5722' },
                },
              }}
            />
            <TextField
              label="CEO Letter"
              name="ceoLetter"
              value={formData.ceoLetter}
              onChange={handleFormChange}
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#ccc' },
                  '&:hover fieldset': { borderColor: '#888' },
                  '&.Mui-focused fieldset': { borderColor: '#FF5722' },
                },
              }}
            />
            <TextField
              label="Check Out Expert Tips"
              name="checkOutExpert"
              value={formData.checkOutExpert}
              onChange={handleFormChange}
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#ccc' },
                  '&:hover fieldset': { borderColor: '#888' },
                  '&.Mui-focused fieldset': { borderColor: '#FF5722' },
                },
              }}
            />
            <TextField
              label="Main Image"
              name="image"
              type="file"
              onChange={handleFormChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#ccc' },
                  '&:hover fieldset': { borderColor: '#888' },
                  '&.Mui-focused fieldset': { borderColor: '#FF5722' },
                },
              }}
            />
            <TextField
              label="Bottom Data Image"
              name="bottomDataImage"
              type="file"
              onChange={handleFormChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#ccc' },
                  '&:hover fieldset': { borderColor: '#888' },
                  '&.Mui-focused fieldset': { borderColor: '#FF5722' },
                },
              }}
            />
            <TextField
              label="CEO Letter Background Image"
              name="ceoLetterBackGroundImage"
              type="file"
              onChange={handleFormChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#ccc' },
                  '&:hover fieldset': { borderColor: '#888' },
                  '&.Mui-focused fieldset': { borderColor: '#FF5722' },
                },
              }}
            />
            <TextField
              label="Check Out Expert Image"
              name="checkOutExpertImage"
              type="file"
              onChange={handleFormChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#ccc' },
                  '&:hover fieldset': { borderColor: '#888' },
                  '&.Mui-focused fieldset': { borderColor: '#FF5722' },
                },
              }}
            />
            {formError && (
              <Typography color="error" sx={{ mt: 1 }}>
                {formError}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSaveHowItWorks}
            color="primary"
            variant="contained"
            disabled={isCreating}
          >
            {isCreating ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit How It Works Form Modal */}
      <Dialog open={editFormOpen} onClose={handleCloseEditForm} maxWidth="md" fullWidth>
        <DialogTitle>Edit How It Works Entry</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              name="title"
              value={editFormData.title}
              onChange={handleEditFormChange}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#ccc' },
                  '&:hover fieldset': { borderColor: '#888' },
                  '&.Mui-focused fieldset': { borderColor: '#FF5722' },
                },
              }}
            />
            <TextField
              label="Description"
              name="description"
              value={editFormData.description}
              onChange={handleEditFormChange}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#ccc' },
                  '&:hover fieldset': { borderColor: '#888' },
                  '&.Mui-focused fieldset': { borderColor: '#FF5722' },
                },
              }}
            />
            <TextField
              label="CEO Letter Title"
              name="ceoLetterTitle"
              value={editFormData.ceoLetterTitle}
              onChange={handleEditFormChange}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#ccc' },
                  '&:hover fieldset': { borderColor: '#888' },
                  '&.Mui-focused fieldset': { borderColor: '#FF5722' },
                },
              }}
            />
            <TextField
              label="CEO Letter"
              name="ceoLetter"
              value={editFormData.ceoLetter}
              onChange={handleEditFormChange}
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#ccc' },
                  '&:hover fieldset': { borderColor: '#888' },
                  '&.Mui-focused fieldset': { borderColor: '#FF5722' },
                },
              }}
            />
            <TextField
              label="Check Out Expert Tips"
              name="checkOutExpert"
              value={editFormData.checkOutExpert}
              onChange={handleEditFormChange}
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#ccc' },
                  '&:hover fieldset': { borderColor: '#888' },
                  '&.Mui-focused fieldset': { borderColor: '#FF5722' },
                },
              }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {editHowItWorksId &&
                howItWorks.find((h: any) => h._id === editHowItWorksId)?.image &&
                !editFormData.image && (
                  <img
                    src={howItWorks.find((h: any) => h._id === editHowItWorksId).image}
                    alt={editFormData.title}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                )}
              {editFormData.image && (
                <img
                  src={URL.createObjectURL(editFormData.image)}
                  alt="New Image Preview"
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
              )}
              <TextField
                label="Main Image"
                name="image"
                type="file"
                onChange={handleEditFormChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': { borderColor: '#ccc' },
                    '&:hover fieldset': { borderColor: '#888' },
                    '&.Mui-focused fieldset': { borderColor: '#FF5722' },
                  },
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {editHowItWorksId &&
                howItWorks.find((h: any) => h._id === editHowItWorksId)?.bottomDataImage &&
                !editFormData.bottomDataImage && (
                  <img
                    src={howItWorks.find((h: any) => h._id === editHowItWorksId).bottomDataImage}
                    alt="Bottom Data Image"
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                )}
              {editFormData.bottomDataImage && (
                <img
                  src={URL.createObjectURL(editFormData.bottomDataImage)}
                  alt="New Bottom Data Image Preview"
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
              )}
              <TextField
                label="Bottom Data Image"
                name="bottomDataImage"
                type="file"
                onChange={handleEditFormChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': { borderColor: '#ccc' },
                    '&:hover fieldset': { borderColor: '#888' },
                    '&.Mui-focused fieldset': { borderColor: '#FF5722' },
                  },
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {editHowItWorksId &&
                howItWorks.find((h: any) => h._id === editHowItWorksId)?.ceoLetterBackGroundImage &&
                !editFormData.ceoLetterBackGroundImage && (
                  <img
                    src={howItWorks.find((h: any) => h._id === editHowItWorksId).ceoLetterBackGroundImage}
                    alt="CEO Letter Background Image"
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                )}
              {editFormData.ceoLetterBackGroundImage && (
                <img
                  src={URL.createObjectURL(editFormData.ceoLetterBackGroundImage)}
                  alt="New CEO Letter Background Image Preview"
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
              )}
              <TextField
                label="CEO Letter Background Image"
                name="ceoLetterBackGroundImage"
                type="file"
                onChange={handleEditFormChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': { borderColor: '#ccc' },
                    '&:hover fieldset': { borderColor: '#888' },
                    '&.Mui-focused fieldset': { borderColor: '#FF5722' },
                  },
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {editHowItWorksId &&
                howItWorks.find((h: any) => h._id === editHowItWorksId)?.checkOutExpertImage &&
                !editFormData.checkOutExpertImage && (
                  <img
                    src={howItWorks.find((h: any) => h._id === editHowItWorksId).checkOutExpertImage}
                    alt="Check Out Expert Image"
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                )}
              {editFormData.checkOutExpertImage && (
                <img
                  src={URL.createObjectURL(editFormData.checkOutExpertImage)}
                  alt="New Check Out Expert Image Preview"
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
              )}
              <TextField
                label="Check Out Expert Image"
                name="checkOutExpertImage"
                type="file"
                onChange={handleEditFormChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': { borderColor: '#ccc' },
                    '&:hover fieldset': { borderColor: '#888' },
                    '&.Mui-focused fieldset': { borderColor: '#FF5722' },
                  },
                }}
              />
            </Box>
            {editFormError && (
              <Typography color="error" sx={{ mt: 1 }}>
                {editFormError}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditForm} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateHowItWorks}
            color="primary"
            variant="contained"
            disabled={true} // Disabled until update API is provided
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this entry? This action cannot be undone.
          </DialogContentText>
          {deleteError && (
            <Typography color="error" sx={{ mt: 1 }}>
              {'Failed to delete entry'}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Show Circular Loader during Edit and Delete actions */}
      {(isFetchingHowItWorks || isUpdating || isDeleting || isCreating) && <CircularLoader />}
    </Box>
  );
};

export default HowItWorksPage;