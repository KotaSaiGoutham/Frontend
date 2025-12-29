import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Grid,
  Chip,
  IconButton,
  Container,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  Badge,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  alpha,
  Skeleton
} from "@mui/material";
import {
  FaCamera,
  FaEnvelope,
  FaPhoneAlt,
  FaChalkboardTeacher,
  FaFlask,
  FaAtom,
  FaUserShield,
  FaEdit,
  FaCheck,
  FaTimes,
  FaExclamationTriangle
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { updateProfilePicture, updateUserProfile, getUserProfileIcon } from "../redux/actions";

// --- InfoItem Component ---
const InfoItem = ({ icon, label, name, value, isEditing, isEditable, delay, onChange }) => {
  const isActiveField = isEditing && isEditable;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.4 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 2.5,
          border: '1px solid',
          borderColor: isActiveField ? '#2196f3' : 'divider',
          borderRadius: 3,
          bgcolor: isActiveField ? alpha('#2196f3', 0.04) : 'background.paper',
          transition: 'all 0.3s ease',
          '&:hover': !isEditing ? {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
            borderColor: 'primary.main',
          } : {},
        }}
      >
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2.5,
            bgcolor: alpha('#2196f3', 0.1),
            color: 'primary.main',
            display: 'flex',
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="caption" color="text.secondary" fontWeight="700" letterSpacing={0.5} textTransform="uppercase">
            {label}
          </Typography>

          {isActiveField ? (
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              name={name}
              value={value || ""}
              onChange={onChange}
              sx={{
                mt: 1,
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#fff',
                  borderRadius: 1.5,
                  '& fieldset': { borderColor: alpha('#000', 0.15) },
                  '&:hover fieldset': { borderColor: 'primary.main' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 2 }
                }
              }}
            />
          ) : (
            <Typography variant="subtitle1" fontWeight="600" color="text.primary" noWrap sx={{ mt: 0.5 }}>
              {value || "Not Provided"}
            </Typography>
          )}
        </Box>
      </Paper>
    </motion.div>
  );
};

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { photoUrl: profilePhoto, isUploading, isLoading } = useSelector((state) => state.profile);

  // --- UI States ---
  const currentPhoto = profilePhoto || user?.photoUrl;
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // --- Form Data State ---
  const [formData, setFormData] = useState({
    mobile: "",
    email: ""
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(getUserProfileIcon(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (user) {
      setFormData({
        mobile: user.mobile || "",
        email: user.email || ""
      });
    }
  }, [user]);

  // --- Handlers ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({ mobile: user.mobile || "", email: user.email || "" });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveClick = () => {
    if (!formData.email || !formData.mobile) {
      setSnackbar({ open: true, message: "Fields cannot be empty", severity: "warning" });
      return;
    }
    setConfirmDialogOpen(true);
  };

  const handleConfirmSave = async () => {
    setConfirmDialogOpen(false);

    const result = await dispatch(updateUserProfile({
      userId: user.id,
      email: formData.email,
      mobile: formData.mobile
    }));

    if (result && !result.error) {
      setSnackbar({ open: true, message: "Profile updated successfully! Use new details for login.", severity: "success" });
      setIsEditing(false);
      dispatch(getUserProfileIcon(user.id));
    } else {
      setSnackbar({ open: true, message: "Update failed. Please try again.", severity: "error" });
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({ open: true, message: "File too large (Max 5MB)", severity: "error" });
      return;
    }

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("userId", user.id);

    await dispatch(updateProfilePicture(formDataUpload));

    setUploading(false);
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "faculty": return "linear-gradient(135deg, #3A1C71 0%, #D76D77 50%, #FFAF7B 100%)";
      case "admin": return "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)";
      default: return "linear-gradient(135deg, #2196F3 30%, #21CBF3 90%)";
    }
  };

  return (
    <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', pb: 8 }}>
{/* --- UPDATED HEADER BOX WITH RESPONSIVE HEIGHT --- */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        sx={{
          // ⚡ RESPONSIVE HEIGHT: 170px on Mobile, 220px on Desktop
          height: { xs: 170, md: 220 }, 
          
          width: '100%',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          
          // Adjust padding for mobile vs desktop too if needed
          p: { xs: '20px 15px', md: '35px 25px 25px 25px' }, 
          
          boxSizing: 'border-box',
          color: 'white',

          // Gradient Option 1 (Seamless Depth)
          backgroundImage: `
            url(/login-bg-pattern.png), 
            linear-gradient(135deg, #292551 0%, #4e4885 100%)
          `,
          backgroundRepeat: 'repeat, no-repeat',
          backgroundSize: '450px, cover',
          backgroundBlendMode: 'overlay',
        }}
      />

      <Container maxWidth="lg">
        <Paper
          elevation={4}
          sx={{
            mt: -12, // Negative margin to overlap the header
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            position: 'relative',
            zIndex: 10,
            bgcolor: '#ffffff',
            boxShadow: '0 12px 24px -4px rgba(145, 158, 171, 0.16)'
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>

              <Box sx={{ mt: -14, mb: 2, display: 'inline-block', position: 'relative' }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Tooltip title="Update Photo">
                      <IconButton
                        onClick={() => fileInputRef.current.click()}
                        sx={{
                          bgcolor: 'white',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          '&:hover': { bgcolor: '#f5f5f5', transform: 'scale(1.1)' },
                          transition: 'all 0.2s',
                          width: 42, height: 42
                        }}
                        disabled={uploading || isUploading}
                      >
                        {uploading || isUploading ? <CircularProgress size={20} /> : <FaCamera color="#1565C0" size={18} />}
                      </IconButton>
                    </Tooltip>
                  }
                >
                  {isLoading ? (
                    <Skeleton
                      variant="circular"
                      width={180}
                      height={180}
                      animation="wave"
                      sx={{
                        border: '6px solid #ffffff',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                      }}
                    />
                  ) : (
                    <Avatar
                      src={currentPhoto}
                      alt={user?.name}
                      sx={{
                        width: 180,
                        height: 180,
                        border: '6px solid #ffffff',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        bgcolor: '#1a237e',
                        fontSize: '4rem'
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                </Badge>
              </Box>

              <Box>
                <Typography variant="h4" fontWeight="800" color="#212B36" gutterBottom>
                  {user?.name || "User Name"}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {user?.email || "email@example.com"}
                </Typography>

                <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" gap={1}>
                  <Chip
                    label={user?.role?.toUpperCase() || "FACULTY"}
                    icon={<FaUserShield size={14} style={{ color: 'white' }} />}
                    sx={{
                      background: getRoleColor(user?.role),
                      color: 'white',
                      fontWeight: '700',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      border: 'none'
                    }}
                  />
                  {user?.isPhysics && (
                    <Chip label="Physics" variant="outlined" color="primary" icon={<FaAtom />} sx={{ fontWeight: 600 }} />
                  )}
                  {user?.isChemistry && (
                    <Chip label="Chemistry" variant="outlined" color="secondary" icon={<FaFlask />} sx={{ fontWeight: 600 }} />
                  )}
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, pb: 2, borderBottom: '1px solid #f0f0f0' }}>
                <Box>
                  <Typography variant="h6" fontWeight="700" color="#212B36">
                    Account Details
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {isEditing ? "Editing your contact information..." : "View and manage your profile information"}
                  </Typography>
                </Box>

                {!isEditing ? (
                  <Button
                    startIcon={<FaEdit />}
                    variant="contained"
                    onClick={() => setIsEditing(true)}
                    sx={{
                      borderRadius: 3,
                      textTransform: 'none',
                      bgcolor: '#212B36',
                      '&:hover': { bgcolor: '#454F5B' }
                    }}
                  >
                    Edit Details
                  </Button>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <Button
                      startIcon={<FaTimes />}
                      variant="outlined"
                      color="error"
                      onClick={handleEditToggle}
                      sx={{ borderRadius: 3, textTransform: 'none' }}
                    >
                      Cancel
                    </Button>
                    <Button
                      startIcon={<FaCheck />}
                      variant="contained"
                      color="success"
                      onClick={handleSaveClick}
                      sx={{ borderRadius: 3, textTransform: 'none' }}
                    >
                      Save
                    </Button>
                  </Stack>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <InfoItem
                    icon={<FaPhoneAlt size={20} />}
                    label="Mobile Number"
                    name="mobile"
                    value={isEditing ? formData.mobile : user?.mobile}
                    onChange={handleInputChange}
                    isEditable={true}
                    isEditing={isEditing}
                    delay={0.2}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <InfoItem
                    icon={<FaChalkboardTeacher size={22} />}
                    label="Primary Subject"
                    value={user?.subject}
                    isEditable={false}
                    isEditing={isEditing}
                    delay={0.3}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <InfoItem
                    icon={<FaEnvelope size={20} />}
                    label="Official Email"
                    name="email"
                    value={isEditing ? formData.email : user?.email}
                    onChange={handleInputChange}
                    isEditable={true}
                    isEditing={isEditing}
                    delay={0.4}
                  />
                </Grid>
              </Grid>

            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#d32f2f' }}>
          <FaExclamationTriangle /> Important: Login Credentials Update
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are about to update your <strong>Mobile Number</strong> or <strong>Email Address</strong>.
            <br /><br />
            Please note that your <strong>Login User ID</strong> will be changed to these new details. You will need to use the new Mobile/Email to log in next time.
            <br /><br />
            Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setConfirmDialogOpen(false)}
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSave}
            color="primary"
            variant="contained"
            autoFocus
            sx={{ borderRadius: 2, bgcolor: '#1a237e' }}
          >
            Yes, Update & Change Login ID
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;