// src/components/TutorIdeas/IdeaForm.jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Fade,
  Slide,
  Zoom,
  Paper,
  Divider,
} from '@mui/material';
import { Add, Clear, Lightbulb, TrendingUp } from '@mui/icons-material';
import { keyframes } from '@emotion/react';

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const IdeaForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [isFocused, setIsFocused] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({ title: '', description: '' });
      setErrors({});
    }
  };

  const handleReset = () => {
    setFormData({ title: '', description: '' });
    setErrors({});
  };

  const isFormValid = formData.title.trim() && formData.description.trim();

  return (
    <Zoom in={true} timeout={800}>
      <Card 
        elevation={4}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 28px rgba(0,0,0,0.25)',
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              sx={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                p: 1,
                animation: `${pulseAnimation} 2s infinite ease-in-out`,
              }}
            >
              <Lightbulb sx={{ fontSize: 32 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Share Your Idea
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Bright ideas change everything
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', mb: 3 }} />

          <Fade in={true} timeout={1000}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Idea Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  error={!!errors.title}
                  helperText={errors.title}
                  placeholder="What's your brilliant idea?"
                  variant="filled"
                  size="medium"
                  InputProps={{
                    sx: {
                      bgcolor: 'rgba(255,255,255,0.9)',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'white',
                      },
                      '&.Mui-focused': {
                        bgcolor: 'white',
                        transform: 'scale(1.02)',
                      }
                    }
                  }}
                  InputLabelProps={{
                    sx: { color: 'black' }
                  }}
                  FormHelperTextProps={{
                    sx: { 
                      bgcolor: 'rgba(255,255,255,0.1)', 
                      mx: 0, 
                      px: 1, 
                      borderRadius: 1 
                    }
                  }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label="Detailed Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  placeholder="Describe your idea in detail... What problem does it solve? How should it work? What impact will it have?"
                  variant="filled"
                  InputProps={{
                    sx: {
                      bgcolor: 'rgba(255,255,255,0.9)',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'white',
                      },
                      '&.Mui-focused': {
                        bgcolor: 'white',
                        transform: 'scale(1.02)',
                      }
                    }
                  }}
                  InputLabelProps={{
                    sx: { color: 'black' }
                  }}
                  FormHelperTextProps={{
                    sx: { 
                      bgcolor: 'rgba(255,255,255,0.1)', 
                      mx: 0, 
                      px: 1, 
                      borderRadius: 1 
                    }
                  }}
                />

                <Slide direction="up" in={isFormValid} timeout={500}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      type="button"
                      variant="outlined"
                      startIcon={<Clear />}
                      onClick={handleReset}
                      disabled={loading}
                      sx={{
                        color: 'white',
                        borderColor: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.1)',
                          borderColor: 'white',
                        }
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Add />}
                      disabled={loading || !isFormValid}
                      sx={{
                        bgcolor: 'white',
                        color: '#667eea',
                        fontWeight: 'bold',
                        px: 3,
                        '&:hover': {
                          bgcolor: '#f8f9fa',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                        },
                        '&:disabled': {
                          bgcolor: 'rgba(255,255,255,0.5)',
                          color: 'rgba(102,126,234,0.5)',
                        }
                      }}
                    >
                      {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TrendingUp sx={{ animation: `${pulseAnimation} 1s infinite` }} />
                          Submitting...
                        </Box>
                      ) : (
                        'Submit Idea'
                      )}
                    </Button>
                  </Box>
                </Slide>
              </Box>
            </form>
          </Fade>
        </CardContent>
      </Card>
    </Zoom>
  );
};

export default IdeaForm;