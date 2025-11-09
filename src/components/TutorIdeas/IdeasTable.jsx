// src/components/TutorIdeas/IdeasTable.jsx
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Box,
  Typography,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  Fade,
  Slide,
  Grow,
  Card,
  CardContent,
  Avatar,
  Tooltip,
} from '@mui/material';
import { 
  MoreVert, 
  CheckCircle, 
  Pending, 
  Build, 
  Lightbulb,
  Rocket,
  TrendingUp,
  AccessTime,
} from '@mui/icons-material';
import { formatFirebaseDate } from '../../mockdata/function';

const IdeasTable = ({ ideas, loading, onUpdateIdea }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleMenuOpen = (event, idea) => {
    setAnchorEl(event.currentTarget);
    setSelectedIdea(idea);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedIdea(null);
  };

  const handleStatusUpdate = (newStatus) => {
    if (selectedIdea) {
      onUpdateIdea(selectedIdea.id, { status: newStatus });
    }
    handleMenuClose();
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        color: 'warning', 
        label: 'Pending Review', 
        icon: <Pending />,
        bgColor: '#FFF3E0',
        color: '#E65100'
      },
      in_progress: { 
        color: 'info', 
        label: 'In Progress', 
        icon: <Build />,
        bgColor: '#E3F2FD',
        color: '#01579B'
      },
      completed: { 
        color: 'success', 
        label: 'Implemented', 
        icon: <CheckCircle />,
        bgColor: '#E8F5E8',
        color: '#1B5E20'
      },
    };
    return configs[status] || configs.pending;
  };

  const getIdeaIcon = (index) => {
    const icons = [<Lightbulb />, <Rocket />, <TrendingUp />];
    return icons[index % icons.length];
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
        <Fade in={true}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
              Loading Ideas...
            </Typography>
          </Box>
        </Fade>
      </Box>
    );
  }

  if (ideas.length === 0) {
    return (
      <Slide direction="up" in={true} timeout={500}>
        <Alert 
          severity="info" 
          icon={<Lightbulb fontSize="large" />}
          sx={{
            borderRadius: 3,
            p: 3,
            bgcolor: 'background.paper',
            '& .MuiAlert-message': {
              width: '100%',
              textAlign: 'center'
            }
          }}
        >
          <Typography variant="h6" gutterBottom>
            No Ideas Yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Be the first to share your brilliant idea! 🚀
          </Typography>
        </Alert>
      </Slide>
    );
  }

  return (
    <>
      <Fade in={true} timeout={800}>
        <Paper 
          elevation={4}
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #f5f7fa 0%, #c3cfe2 100%)',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Lightbulb />
                      Idea
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 2 }}>Description</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 2 }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime />
                      Created
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ideas.map((idea, index) => {
                  const statusConfig = getStatusConfig(idea.status);
                  return (
                    <Grow in={true} timeout={500 + (index * 100)} key={idea.id}>
                      <TableRow 
                        hover
                        onMouseEnter={() => setHoveredRow(idea.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        sx={{
                          transition: 'all 0.3s ease',
                          bgcolor: hoveredRow === idea.id ? 'action.hover' : 'transparent',
                          transform: hoveredRow === idea.id ? 'scale(1.01)' : 'scale(1)',
                          '&:last-child td': { borderBottom: 0 }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                bgcolor: statusConfig.bgColor,
                                color: statusConfig.color,
                                width: 40,
                                height: 40,
                                transition: 'all 0.3s ease',
                                transform: hoveredRow === idea.id ? 'rotate(10deg)' : 'none'
                              }}
                            >
                              {getIdeaIcon(index)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight="600">
                                {idea.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                by {idea.tutorName || 'You'}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={idea.description} arrow>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: 1.4,
                              }}
                            >
                              {idea.description}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={statusConfig.icon}
                            label={statusConfig.label}
                            color={statusConfig.color}
                            variant="filled"
                            sx={{
                              bgcolor: statusConfig.bgColor,
                              color: statusConfig.color,
                              fontWeight: 'bold',
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 2,
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" fontWeight="500">
                              {formatFirebaseDate(idea.createdAt)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Update status" arrow>
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, idea)}
                              sx={{
                                bgcolor: 'background.paper',
                                boxShadow: 1,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  bgcolor: 'primary.main',
                                  color: 'white',
                                  transform: 'rotate(90deg)',
                                }
                              }}
                            >
                              <MoreVert />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    </Grow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Fade>

      {/* Status Update Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
        PaperProps={{
          elevation: 4,
          sx: {
            borderRadius: 2,
            mt: 1,
            minWidth: 200,
          }
        }}
      >
        <MenuItem 
          onClick={() => handleStatusUpdate('pending')}
          sx={{ 
            transition: 'all 0.2s ease',
            '&:hover': { bgcolor: 'warning.light' }
          }}
        >
          <Pending sx={{ mr: 2, color: 'warning.main' }} /> 
          Mark as Pending
        </MenuItem>
        <MenuItem 
          onClick={() => handleStatusUpdate('in_progress')}
          sx={{ 
            transition: 'all 0.2s ease',
            '&:hover': { bgcolor: 'info.light' }
          }}
        >
          <Build sx={{ mr: 2, color: 'info.main' }} /> 
          Mark In Progress
        </MenuItem>
        <MenuItem 
          onClick={() => handleStatusUpdate('completed')}
          sx={{ 
            transition: 'all 0.2s ease',
            '&:hover': { bgcolor: 'success.light' }
          }}
        >
          <CheckCircle sx={{ mr: 2, color: 'success.main' }} /> 
          Mark Completed
        </MenuItem>
      </Menu>
    </>
  );
};

export default IdeasTable;