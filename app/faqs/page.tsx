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
  useGetFaqsQuery,
  useGetFaqByIdQuery,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useCreateFaqMutation,
} from '@/redux/api/faqApi';
import CircularLoader from '../../components/CircularLoader';
import { useDebounce } from '@/hooks/useDebounce';

const FaqsPage = () => {
  const { searchTerm } = useSearch();
  console.log(searchTerm, "searchTerm");
  const pathname = usePathname();

  // State for pagination and selection
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editFaqId, setEditFaqId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ question: '', answer: '' });
  const [editFormData, setEditFormData] = useState({ question: '', answer: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [editFormError, setEditFormError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null);
  const [isFetchingFaq, setIsFetchingFaq] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch FAQs using RTK Query
  const { data, isLoading, error, refetch, isFetching } = useGetFaqsQuery(
    {
      search: debouncedSearchTerm,
      page: page + 1,
      limit: rowsPerPage,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [createFaq, { isLoading: isCreating, error: createError }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating, error: updateError }] = useUpdateFaqMutation();
  const [deleteFaq, { isLoading: isDeleting, error: deleteError }] = useDeleteFaqMutation();

  // Fetch FAQ by ID for editing
  const { data: faqData, error: fetchFaqError, isFetching: isFetchingFaqById, refetch: refetchFaqById } = useGetFaqByIdQuery(editFaqId!, {
    skip: !editFaqId,
    refetchOnMountOrArgChange: true,
  });

  const faqs = data?.data || [];
  const total = data?.data || 0;

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
    if (isFetchingFaqById) {
      setIsFetchingFaq(true);
      console.log('Fetching FAQ data...');
    } else if (faqData) {
      setEditFormData({
        question: faqData?.data?.question || '',
        answer: faqData?.data?.answer || '',
      });
      setIsFetchingFaq(false);
      setEditFormOpen(true);
      console.log('FAQ data fetched, opening Edit form');
    } else if (fetchFaqError) {
      setIsFetchingFaq(false);
      console.log('Error fetching FAQ:', fetchFaqError);
    }
  }, [isFetchingFaqById, faqData, fetchFaqError]);

  // Handle form input changes (New FAQ)
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle edit form input changes
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Handle form submission (New FAQ)
  const handleSaveFaq = async () => {
    if (!formData.question || !formData.answer) {
      setFormError('All fields are required');
      return;
    }

    try {
      await createFaq({
        question: formData.question,
        answer: formData.answer,
      }).unwrap();
      setOpenForm(false);
      setFormData({ question: '', answer: '' });
      setFormError(null);
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Failed to create FAQ';
      setFormError(errorMessage);
    }
  };

  // Handle form submission (Edit FAQ)
  const handleUpdateFaq = async () => {
    if (!editFormData.question || !editFormData.answer) {
      setEditFormError('All fields are required');
      return;
    }

    if (!editFaqId) return;

    try {
      await updateFaq({
        id: editFaqId,
        faq: {
          question: editFormData.question,
          answer: editFormData.answer,
        },
      }).unwrap();
      setEditFormOpen(false);
      setEditFaqId(null);
      setEditFormData({ question: '', answer: '' });
      setEditFormError(null);
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Failed to update FAQ';
      setEditFormError(errorMessage);
    }
  };

  // Handle checkbox selection
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = faqs.map((faq: any) => faq._id);
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
    console.log('Delete FAQs with IDs:', selected);
    // TODO: Call multi-delete API when available
    setSelected([]);
  };

  // Handle Edit action
  const handleEdit = (id: string) => {
    setEditFaqId(id);
    setEditFormOpen(false); // Reset form open state to ensure useEffect triggers
    refetchFaqById(); // Force refetch of the FAQ data
    console.log('Edit clicked for FAQ ID:', id);
  };

  // Handle closing the Edit form
  const handleCloseEditForm = () => {
    setEditFormOpen(false);
    setEditFaqId(null);
    setEditFormData({ question: '', answer: '' });
    setEditFormError(null);
    setIsFetchingFaq(false);
    console.log('Edit form closed');
  };

  // Handle Delete action
  const handleDelete = (id: string) => {
    setFaqToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Confirm Delete action
  const confirmDelete = async () => {
    if (!faqToDelete) return;

    try {
      await deleteFaq(faqToDelete).unwrap();
      setDeleteDialogOpen(false);
      setFaqToDelete(null);
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Failed to delete FAQ';
      alert(errorMessage);
    }
  };

  // Shimmer effect for table rows (adjusted for no image column)
  const renderShimmer = () => {
    const shimmerRows = Array.from({ length: 5 }, (_, index) => (
      <TableRow key={index} sx={{ borderBottom: '1px solid #e0e0e0' }}>
        <TableCell padding="checkbox">
          <Box className="shimmer" sx={{ width: '20px', height: '20px', borderRadius: '4px' }} />
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
            FAQs
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
                Add new FAQ
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

      {/* FAQ Table with Scrollbars, Centered */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxHeight: '700px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', marginTop: '10px' }}>
          <Box sx={{ overflowX: 'auto', maxHeight: '700px', overflowY: 'auto' }}>
            <Table sx={{ minWidth: '800px' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < faqs.length}
                      checked={faqs.length > 0 && selected.length === faqs.length}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell sx={{ width: '120px', fontWeight: 'bold' }}>Question</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Answer</TableCell>
                  <TableCell sx={{ width: '120px', fontWeight: 'bold' }}>Operations</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(isLoading || isFetching) ? (
                  renderShimmer()
                ) : error ? (
                  <TableRow sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    <TableCell colSpan={4} align="center">
                      Failed to load FAQs: {JSON.stringify(error)}
                    </TableCell>
                  </TableRow>
                ) : faqs.length === 0 ? (
                  <TableRow sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    <TableCell colSpan={4} align="center">
                      No FAQs found
                    </TableCell>
                  </TableRow>
                ) : (
                  faqs.map((faq: any) => (
                    <TableRow
                      key={faq._id}
                      selected={isSelected(faq._id)}
                      sx={{ borderBottom: '1px solid #e0e0e0', '&:hover': { backgroundColor: '#f9f9f9' } }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected(faq._id)}
                          onChange={() => handleSelectClick(faq._id)}
                        />
                      </TableCell>
                      <TableCell sx={{ width: '120px' }}>{faq.question}</TableCell>
                      <TableCell sx={{ width: '250px' }}>{faq.answer}</TableCell>
                      <TableCell sx={{ width: '120px' }}>
                        <IconButton onClick={() => handleEdit(faq._id)}>
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
                        <IconButton onClick={() => handleDelete(faq._id)}>
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

      {/* New FAQ Form Modal */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New FAQ</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Question"
              name="question"
              value={formData.question}
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
              label="Answer"
              name="answer"
              value={formData.answer}
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
            onClick={handleSaveFaq}
            color="primary"
            variant="contained"
            disabled={isCreating}
          >
            {isCreating ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit FAQ Form Modal */}
      <Dialog open={editFormOpen} onClose={handleCloseEditForm} maxWidth="sm" fullWidth>
        <DialogTitle>Edit FAQ</DialogTitle>
        <DialogContent>
          {fetchFaqError ? (
            <Typography color="error">Failed to load FAQ: {JSON.stringify(fetchFaqError)}</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Question"
                name="question"
                value={editFormData.question}
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
                label="Answer"
                name="answer"
                value={editFormData.answer}
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
              {editFormError && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {editFormError}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditForm} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateFaq}
            color="primary"
            variant="contained"
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this FAQ? This action cannot be undone.
          </DialogContentText>
          {deleteError && (
            <Typography color="error" sx={{ mt: 1 }}>
              {'Failed to delete FAQ'}
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
      {(isFetchingFaq || isUpdating || isDeleting || isCreating) && <CircularLoader />}
    </Box>
  );
};

export default FaqsPage;