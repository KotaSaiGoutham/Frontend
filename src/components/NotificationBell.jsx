import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Chip
} from "@mui/material";
import {
  FaBell,
  FaCheck,
  FaTimesCircle,
  FaInfoCircle
} from "react-icons/fa";
// Import your actions
import { fetchNotifications, markNotificationRead } from "../redux/actions";

const NotificationBell = () => {
  const dispatch = useDispatch();
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  // Access Redux state for notifications and user
  const { items: notifications, loading } = useSelector((state) => state.notifications);
  const { user } = useSelector((state) => state.auth);
  // Fetch notifications on mount (and periodically if desired)
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchNotifications(user.id));
      
      // Optional: Poll every 60 seconds
      const interval = setInterval(() => {
        dispatch(fetchNotifications(user.id));
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [dispatch, user]);

  const unreadCount = notifications.length;

  // Handlers
  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleMarkRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  const formatTimeAgo = (timestamp) => {
    // Handle both Firestore timestamp (seconds) and ISO strings
    let dateObj;
    if (timestamp && timestamp._seconds) {
        dateObj = new Date(timestamp._seconds * 1000);
    } else {
        dateObj = new Date(timestamp);
    }
    
    const now = new Date();
    const diffInMinutes = Math.floor((now - dateObj) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const isOpen = Boolean(notificationAnchor);
  const id = isOpen ? 'notification-popover' : undefined;

  return (
    <div className="notification-bell-container">
      <IconButton 
        onClick={handleNotificationClick}
        size="large"
        sx={{
          color: '#ffffff',
          backgroundColor: '#3f51b5',
          '&:hover': {
            backgroundColor: '#303f9f',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s ease-in-out',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          ...(unreadCount > 0 && {
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { boxShadow: '0 0 0 0 rgba(63, 81, 181, 0.7)' },
              '70%': { boxShadow: '0 0 0 10px rgba(63, 81, 181, 0)' },
              '100%': { boxShadow: '0 0 0 0 rgba(63, 81, 181, 0)' },
            }
          })
        }}
      >
        <Badge 
          badgeContent={unreadCount} 
          color="error" 
          overlap="circular"
        >
          <FaBell style={{ fontSize: '1.3rem' }} />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={isOpen}
        anchorEl={notificationAnchor}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '& .MuiPopover-paper': {
            width: 420,
            maxHeight: 500,
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
          }
        }}
      >
        <Box sx={{ 
          p: 2, 
          background: 'linear-gradient(135deg, #3f51b5 0%, #303f9f 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Notifications</Typography>
            <Chip 
              label={`${unreadCount} New`} 
              size="small" 
              variant="outlined"
              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
            />
          </div>
        </Box>

        <List sx={{ p: 0, overflowY: 'auto', maxHeight: '400px' }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText 
                primary={
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                    No new notifications
                  </Typography>
                } 
              />
            </ListItem>
          ) : (
            notifications.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  borderBottom: '1px solid #f5f5f5',
                  backgroundColor: '#f8f9fa',
                  '&:hover': { backgroundColor: '#f0f2f5' },
                  transition: 'all 0.2s ease',
                  borderLeft: '4px solid #3f51b5' 
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                   <FaInfoCircle style={{ color: '#3f51b5', fontSize: '18px' }} />
                </ListItemIcon>
                
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" sx={{ fontWeight: '600', color: '#333' }}>
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.primary" sx={{ mt: 0.5, lineHeight: 1.3 }}>
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        {formatTimeAgo(notification.createdAt)}
                      </Typography>
                    </>
                  }
                />
                
                {/* Mark Read Button */}
                <IconButton 
                  size="small" 
                  onClick={() => handleMarkRead(notification.id)}
                  sx={{ color: '#2ecc71', ml: 1, '&:hover': { bgcolor: 'rgba(46,204,113,0.1)' }}}
                >
                   <FaCheck size={14} />
                </IconButton>
              </ListItem>
            ))
          )}
        </List>
      </Popover>
    </div>
  );
};

export default NotificationBell;