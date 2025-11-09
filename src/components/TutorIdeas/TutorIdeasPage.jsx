// src/components/TutorIdeas/TutorIdeasPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTutorIdeas, addTutorIdea, updateTutorIdea } from "../../redux/actions";
import IdeaForm from './IdeaForm';
import IdeasTable from './IdeasTable';
import { Grid, Box, Typography, Alert } from '@mui/material';
import { Lightbulb } from '@mui/icons-material';

const TutorIdeasPage = () => {
  const dispatch = useDispatch();
  const { ideas, loading, error, adding } = useSelector(state => state.tutorIdeas);

  useEffect(() => {
    dispatch(fetchTutorIdeas());
  }, [dispatch]);

  const handleAddIdea = (ideaData) => {
    dispatch(addTutorIdea(ideaData));
  };

  const handleUpdateIdea = (ideaId, updates) => {
    dispatch(updateTutorIdea(ideaId, updates));
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ 
          fontWeight: 'bold',
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}>
          <Lightbulb fontSize="large" />
          Ideas & Features Hub
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Share your ideas for new features, enhancements, and improvements
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4} style={{display:"flex",flexDirection:"column"}}>
         <Grid item xs={12} md={8}>
          <IdeasTable
            ideas={ideas}
            loading={loading}
            onUpdateIdea={handleUpdateIdea}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <IdeaForm onSubmit={handleAddIdea} loading={adding} />
        </Grid>

       
      </Grid>
    </Box>
  );
};

export default TutorIdeasPage;