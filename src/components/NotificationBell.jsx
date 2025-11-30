import React, { useState, useEffect, useMemo } from "react";
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
  FaExclamationCircle,
  FaInfoCircle,
  FaCheck,
  FaTimesCircle,
  FaClock,
  FaUserGraduate
} from "react-icons/fa";
import { parse, isValid, isAfter } from "date-fns";

const NotificationBell = ({ 
  filteredTimetables = [], 
  filteredDemoClasses = [], 
  filteredStudents = [], 
  combinedActivity = [],
  classesError,
  studentsError,
  employeesError
}) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  // Generate notifications based on various conditions
  const generateNotifications = useMemo(() => {
    const newNotifications = [];
    const now = new Date();

    // 1. Check for upcoming classes in next 30 minutes
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);

    filteredTimetables.forEach((schedule) => {
      try {
        const classStartTimeStr = schedule.Time?.split(" to ")[0];
        if (!classStartTimeStr) return;

        const classDateTime = parse(
          `${schedule.Day} ${classStartTimeStr}`,
          "dd/MM/yyyy hh:mm a",
          new Date()
        );
        
        if (isValid(classDateTime) && 
            classDateTime > now && 
            classDateTime <= thirtyMinutesFromNow) {
          newNotifications.push({
            id: `upcoming-class-${schedule.id}-${Date.now()}`,
            type: 'upcoming_class',
            title: 'Upcoming Class',
            message: `${schedule.Subject} class with ${schedule.Faculty} starts soon`,
            timestamp: new Date(),
            read: false,
            priority: 'high',
            icon: FaClock,
            color: '#ff6b35'
          });
        }
      } catch (e) {
        console.error("Error parsing timetable for notifications:", schedule, e);
      }
    });

    // 2. Check for pending demo classes
    const pendingDemos = filteredDemoClasses?.filter(demo => 
      demo.status === 'pending' || !demo.status
    ) || [];
    
    if (pendingDemos.length > 0) {
      newNotifications.push({
        id: `pending-demos-${Date.now()}`,
        type: 'pending_demos',
        title: 'Pending Demo Classes',
        message: `You have ${pendingDemos.length} demo class(es) pending`,
        timestamp: new Date(),
        read: false,
        priority: 'medium',
        icon: FaUserGraduate,
        color: '#3498db'
      });
    }

    // 3. Check for overdue payments
    const overdueStudents = filteredStudents.filter(student => {
      const paymentStatus = student["Payment Status"];
      return paymentStatus === "Pending" || paymentStatus === "Overdue";
    });

    if (overdueStudents.length > 0) {
      newNotifications.push({
        id: `overdue-payments-${Date.now()}`,
        type: 'overdue_payments',
        title: 'Overdue Payments',
        message: `${overdueStudents.length} student(s) have pending payments`,
        timestamp: new Date(),
        read: false,
        priority: 'high',
        icon: FaExclamationCircle,
        color: '#e74c3c'
      });
    }

    // 4. Check for recent student activity (last 24 hours)
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentActivity = combinedActivity.filter(activity => 
      activity.timestamp && new Date(activity.timestamp) > twentyFourHoursAgo
    );

    if (recentActivity.length > 0) {
      newNotifications.push({
        id: `recent-activity-${Date.now()}`,
        type: 'recent_activity',
        title: 'Recent Activity',
        message: `${recentActivity.length} new activity item(s)`,
        timestamp: new Date(),
        read: false,
        priority: 'low',
        icon: FaInfoCircle,
        color: '#2ecc71'
      });
    }

    // 5. System notifications
    if (classesError || studentsError || employeesError) {
      newNotifications.push({
        id: `system-error-${Date.now()}`,
        type: 'system_error',
        title: 'System Alert',
        message: 'Some data failed to load. Please refresh the page.',
        timestamp: new Date(),
        read: false,
        priority: 'high',
        icon: FaExclamationCircle,
        color: '#e74c3c'
      });
    }

    return newNotifications;
  }, [filteredTimetables, filteredDemoClasses, filteredStudents, combinedActivity, classesError, studentsError, employeesError]);

  // Update notifications when relevant data changes
  useEffect(() => {
    setNotifications(prevNotifications => {
      // Keep only the latest version of each notification type
      const notificationTypes = new Set();
      const latestNotifications = [];
      
      // Process new notifications first (reverse to keep latest)
      [...generateNotifications].reverse().forEach(notification => {
        if (!notificationTypes.has(notification.type)) {
          notificationTypes.add(notification.type);
          latestNotifications.push(notification);
        }
      });

      // Add existing notifications that aren't in the new set
      prevNotifications.forEach(notification => {
        if (!notificationTypes.has(notification.type)) {
          latestNotifications.push(notification);
        }
      });

      return latestNotifications;
    });
  }, [generateNotifications]);

  // Update unread count
  useEffect(() => {
    const unread = notifications.filter(notification => !notification.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  // Notification handlers
  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getNotificationIcon = (iconComponent, color) => {
    const IconComponent = iconComponent;
    return <IconComponent style={{ color, fontSize: '18px' }} />;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - new Date(timestamp)) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getPriorityChip = (priority) => {
    const priorityConfig = {
      high: { label: 'High', color: 'error' },
      medium: { label: 'Medium', color: 'warning' },
      low: { label: 'Low', color: 'success' }
    };
    
    const config = priorityConfig[priority] || priorityConfig.medium;
    return (
      <Chip 
        label={config.label} 
        color={config.color} 
        size="small" 
        sx={{ height: '20px', fontSize: '0.7rem' }}
      />
    );
  };

  const isOpen = Boolean(notificationAnchor);
  const id = isOpen ? 'notification-popover' : undefined;

  return (
    <div className="notification-bell-container">
      <IconButton 
        onClick={handleNotificationClick}
        size="large"
        sx={{
          color: '#ffffff', // White icon color
          backgroundColor: '#3f51b5', // Primary blue background
          '&:hover': {
            backgroundColor: '#303f9f', // Darker blue on hover
            transform: 'scale(1.05)',
          },
          '&:active': {
            backgroundColor: '#283593',
            transform: 'scale(0.95)',
          },
          transition: 'all 0.2s ease-in-out',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          position: 'relative',
          // Add pulse animation when there are unread notifications
          ...(unreadCount > 0 && {
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                boxShadow: '0 0 0 0 rgba(63, 81, 181, 0.7)',
              },
              '70%': {
                boxShadow: '0 0 0 10px rgba(63, 81, 181, 0)',
              },
              '100%': {
                boxShadow: '0 0 0 0 rgba(63, 81, 181, 0)',
              },
            }
          })
        }}
      >
        <Badge 
          badgeContent={unreadCount} 
          color="error" 
          overlap="circular"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.7rem',
              height: '20px',
              minWidth: '20px',
              fontWeight: 'bold',
              border: '2px solid #ffffff',
            }
          }}
        >
          <FaBell style={{ fontSize: '1.3rem' }} />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={isOpen}
        anchorEl={notificationAnchor}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
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
          borderBottom: '1px solid #e0e0e0', 
          backgroundColor: '#3f51b5',
          background: 'linear-gradient(135deg, #3f51b5 0%, #303f9f 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: 'white' }}>
              Notifications
            </Typography>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {unreadCount > 0 && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'white', 
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    opacity: 0.9,
                    '&:hover': { 
                      opacity: 1,
                      textDecoration: 'underline' 
                    }
                  }}
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </Typography>
              )}
              <Chip 
                label={`${notifications.length} total`} 
                size="small" 
                variant="outlined"
                sx={{ 
                  height: '24px', 
                  fontSize: '0.7rem',
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }}
              />
            </div>
          </div>
        </Box>

        <List sx={{ p: 0 }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText 
                primary={
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                    No notifications at the moment
                  </Typography>
                } 
              />
            </ListItem>
          ) : (
            notifications
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((notification) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    borderBottom: '1px solid #f5f5f5',
                    backgroundColor: notification.read ? 'transparent' : '#f8f9fa',
                    '&:hover': {
                      backgroundColor: '#f0f2f5',
                    },
                    transition: 'all 0.2s ease',
                    py: 1.5,
                    position: 'relative',
                    // Add accent border for high priority notifications
                    ...(notification.priority === 'high' && !notification.read && {
                      borderLeft: '4px solid #e74c3c',
                    }),
                    ...(notification.priority === 'medium' && !notification.read && {
                      borderLeft: '4px solid #f39c12',
                    }),
                    ...(notification.priority === 'low' && !notification.read && {
                      borderLeft: '4px solid #2ecc71',
                    })
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 45, mr: 1 }}>
                    <div style={{ 
                      width: 36, 
                      height: 36, 
                      borderRadius: '50%', 
                      backgroundColor: `${notification.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${notification.color}40`
                    }}>
                      {getNotificationIcon(notification.icon, notification.color)}
                    </div>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: notification.read ? '500' : '600',
                            color: '#333',
                            flex: 1
                          }}
                        >
                          {notification.title}
                        </Typography>
                        {getPriorityChip(notification.priority)}
                      </div>
                    }
                    secondary={
                      <div style={{ marginTop: '4px' }}>
                        <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.4 }}>
                          {notification.message}
                        </Typography>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                          <Typography variant="caption" color="text.secondary">
                            {formatTimeAgo(notification.timestamp)}
                          </Typography>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {!notification.read && (
                              <IconButton 
                                size="small" 
                                onClick={() => markAsRead(notification.id)}
                                sx={{ 
                                  color: '#2ecc71',
                                  backgroundColor: 'rgba(46, 204, 113, 0.1)',
                                  padding: '4px',
                                  '&:hover': { 
                                    backgroundColor: 'rgba(46, 204, 113, 0.2)',
                                    transform: 'scale(1.1)'
                                  }
                                }}
                              >
                                <FaCheck size={12} />
                              </IconButton>
                            )}
                            <IconButton 
                              size="small" 
                              onClick={() => clearNotification(notification.id)}
                              sx={{ 
                                color: '#95a5a6',
                                backgroundColor: 'rgba(149, 165, 166, 0.1)',
                                padding: '4px',
                                '&:hover': { 
                                  backgroundColor: 'rgba(231, 76, 60, 0.2)', 
                                  color: '#e74c3c',
                                  transform: 'scale(1.1)'
                                }
                              }}
                            >
                              <FaTimesCircle size={12} />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                    }
                    sx={{ my: 0 }}
                  />
                </ListItem>
              ))
          )}
        </List>
      </Popover>
    </div>
  );
};

export default NotificationBell;