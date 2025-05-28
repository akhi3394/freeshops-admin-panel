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
  useGetArticlesQuery,
  useCreateArticleMutation,
  useGetArticleByIdQuery,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} from '@/redux/api/articleApi';
import CircularLoader from '../../components/CircularLoader';
import { useDebounce } from '@/hooks/useDebounce';

const ArticlePage = () => {
  const { searchTerm } = useSearch();
  console.log(searchTerm, "searchTerm");
  const pathname = usePathname();

  // State for pagination and selection
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editArticleId, setEditArticleId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', image: null as File | null });
  const [editFormData, setEditFormData] = useState({ title: '', description: '', image: null as File | null });
  const [formError, setFormError] = useState<string | null>(null);
  const [editFormError, setEditFormError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const [isFetchingArticle, setIsFetchingArticle] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  // Fetch articles using RTK Query
  const { data, isLoading, error, refetch ,isFetching} = useGetArticlesQuery(
    {
      search: debouncedSearchTerm,
      page: page + 1,
      limit: rowsPerPage,
    },
    { refetchOnMountOrArgChange: true }
  );
  const [createArticle, { isLoading: isCreating, error: createError }] = useCreateArticleMutation();
  const [updateArticle, { isLoading: isUpdating, error: updateError }] = useUpdateArticleMutation();
  const [deleteArticle, { isLoading: isDeleting, error: deleteError }] = useDeleteArticleMutation();

  // Fetch article by ID for editing
  const { data: articleData, error: fetchArticleError, isFetching: isFetchingArticleById, refetch: refetchArticleById } = useGetArticleByIdQuery(editArticleId!, {
    skip: !editArticleId,
    refetchOnMountOrArgChange: true,
  });

  const articles = data?.data?.docs || [];
  const total = data?.data?.totalDocs || 0;

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
  }, [searchTerm, refetch]);

  // Handle Edit form opening and data population
  useEffect(() => {
    if (isFetchingArticleById) {
      setIsFetchingArticle(true);
      console.log('Fetching article data...');
    } else if (articleData) {
      setEditFormData({
        title: articleData?.data?.title || '',
        description: articleData?.data?.description || '',
        image: null, // Image will be set via file input
      });
      setIsFetchingArticle(false);
      setEditFormOpen(true);
      console.log('Article data fetched, opening Edit form');
    } else if (fetchArticleError) {
      setIsFetchingArticle(false);
      console.log('Error fetching article:', fetchArticleError);
    }
  }, [isFetchingArticleById, articleData, fetchArticleError]);

  // Handle form input changes (New Article)
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle edit form input changes
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files) {
      setEditFormData({ ...editFormData, image: files[0] });
    } else {
      setEditFormData({ ...editFormData, [name]: value });
    }
  };

  // Handle form submission (New Article)
  const handleSaveArticle = async () => {
    if (!formData.title || !formData.description || !formData.image) {
      setFormError('All fields are required');
      return;
    }

    try {
      await createArticle({
        title: formData.title,
        description: formData.description,
        image: formData.image,
      }).unwrap();
      setOpenForm(false);
      setFormData({ title: '', description: '', image: null });
      setFormError(null);
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Failed to create article';
      setFormError(errorMessage);
    }
  };

  // Handle form submission (Edit Article)
  const handleUpdateArticle = async () => {
    if (!editFormData.title || !editFormData.description || !editFormData.image) {
      setEditFormError('All fields are required');
      return;
    }

    if (!editArticleId) return;

    try {
      await updateArticle({
        id: editArticleId,
        article: {
          title: editFormData.title,
          description: editFormData.description,
          image: editFormData.image,
        },
      }).unwrap();
      setEditFormOpen(false);
      setEditArticleId(null);
      setEditFormData({ title: '', description: '', image: null });
      setEditFormError(null);
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Failed to update article';
      setEditFormError(errorMessage);
    }
  };

  // Handle checkbox selection
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = articles.map((article: any) => article._id);
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
    console.log('Delete articles with IDs:', selected);
    // TODO: Call multi-delete API when available
    setSelected([]);
  };

  // Handle Edit action
  const handleEdit = (id: string) => {
    setEditArticleId(id);
    setEditFormOpen(false); // Reset form open state to ensure useEffect triggers
    refetchArticleById(); // Force refetch of the article data
    console.log('Edit clicked for article ID:', id);
  };

  // Handle closing the Edit form
  const handleCloseEditForm = () => {
    setEditFormOpen(false);
    setEditArticleId(null);
    setEditFormData({ title: '', description: '', image: null });
    setEditFormError(null);
    setIsFetchingArticle(false);
    console.log('Edit form closed');
  };

  // Handle Delete action
  const handleDelete = (id: string) => {
    setArticleToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Confirm Delete action
  const confirmDelete = async () => {
    if (!articleToDelete) return;

    try {
      await deleteArticle(articleToDelete).unwrap();
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Failed to delete article';
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
        height: '300px', // or any desired height
        padding: '20px',
        backgroundColor: '#f2f2f2',
        borderRadius: '8px',
        position: 'relative',
        backgroundImage: `url("/bacground.jpg")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 300px', // control background image height
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

      {/* Header Section with SVG Background */}
      <Box
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',paddingX:'10px' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'rgba(32, 34, 36, 1)',fontSize:'32px' }}>
            Article
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
              <span style={{fontSize:'16px',color:'rgba(255, 255, 255, 1)',font:'Nunito Sans'}}>Add new article</span>
            </Button>
            {selected.length > 0 && (
              <IconButton onClick={handleMultiDelete} sx={{ color: '#fff' }}>
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>

      {/* Article Table with Scrollbars, Centered */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxHeight: '700px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', marginTop: '10px' }}>
          <Box sx={{ overflowX: 'auto', maxHeight: '700px', overflowY: 'auto' }}>
            <Table sx={{ minWidth: '800px' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < articles.length}
                      checked={articles.length > 0 && selected.length === articles.length}
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
                      Failed to load articles: {JSON.stringify(error)}
                    </TableCell>
                  </TableRow>
                ) : articles.length === 0 ? (
                  <TableRow sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    <TableCell colSpan={5} align="center">
                      No articles found
                    </TableCell>
                  </TableRow>
                ) : (
                  articles.map((article: any) => (
                    <TableRow
                      key={article._id}
                      selected={isSelected(article._id)}
                      sx={{ borderBottom: '1px solid #e0e0e0', '&:hover': { backgroundColor: '#f9f9f9' } }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected(article._id)}
                          onChange={() => handleSelectClick(article._id)}
                        />
                      </TableCell>
                      <TableCell sx={{ width: '60px' }}>
                        <img
                          src={article.image}
                          alt={article.title}
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </TableCell>
                      <TableCell sx={{ width: '120px' }}>{article.title}</TableCell>
                      <TableCell sx={{ width: '250px' }}>{article.description}</TableCell>
                      <TableCell sx={{ width: '120px' }}>
                        <IconButton onClick={() => handleEdit(article._id)}>
                          {/* <EditIcon /> */}
                          <Typography
                            sx={{
                              backgroundColor: 'rgba(0, 182, 155, 0.2)', // 20% opacity
                              width: '56.78px',
                              height: '27.37px',
                              borderRadius: '4.5px',
                              color: '#00B69B', // solid color for text
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              fontWeight: 700

                            }}                           >
                            Edit
                          </Typography>
                        </IconButton>
                        <IconButton onClick={() => handleDelete(article._id)} >
                          {/* <DeleteIcon /> */}
                          <Typography
                            sx={{
                              backgroundColor: 'rgba(249, 60, 101, 0.2)', // 20% opacity
                              width: '70.97px',
                              height: '27.37px',
                              borderRadius: '4.5px',
                              color: 'rgba(248, 0, 54, 1)', // solid color for text
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              fontWeight: 700
                            }}                           >
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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
      </Box>

      {/* New Article Form Modal */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Article</DialogTitle>
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
              label="Image"
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
            onClick={handleSaveArticle}
            color="primary"
            variant="contained"
            disabled={isCreating}
          >
            {isCreating ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Article Form Modal */}
      <Dialog open={editFormOpen} onClose={handleCloseEditForm} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Article</DialogTitle>
        <DialogContent>
          {fetchArticleError ? (
            <Typography color="error">Failed to load article: {JSON.stringify(fetchArticleError)}</Typography>
          ) : (
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
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {articleData?.data?.image && !editFormData.image && (
                  <img
                    src={articleData.data.image}
                    alt={articleData.data.title}
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
                  label="Image"
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
            onClick={handleUpdateArticle}
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
            Are you sure you want to delete this article? This action cannot be undone.
          </DialogContentText>
          {deleteError && (
            <Typography color="error" sx={{ mt: 1 }}>
              {'Failed to delete article'}
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
      {(isFetchingArticle || isUpdating || isDeleting) && <CircularLoader />}
    </Box>
  );
};

export default ArticlePage;