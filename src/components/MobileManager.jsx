import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from '@capacitor/push-notifications';
import { StatusBar, Style } from '@capacitor/status-bar';
// ⚠️ IMPORTANT: We use 'setDoc' to create the file if it's missing
import { doc, setDoc } from "firebase/firestore"; 
import { db } from '../firebase'; 

const MobileManager = () => {
  const navigate = useNavigate();
  // Ensure user.id matches your Redux state (sometimes it is user.uid)
  const { isAuthenticated, user } = useSelector((state) => state.auth); 

  useEffect(() => {
    // 1. Only run on Mobile (Android/iOS)
    if (!Capacitor.isNativePlatform()) return;

    const init = async () => {
      // 2. Style Status Bar (Optional visual fix)
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#292551' });
        await StatusBar.setOverlaysWebView({ overlay: false });
      } catch (e) { 
        // Ignore errors if status bar plugin isn't present
      }

      // 3. Register for Notifications if Logged In
      // Note: Verify if your Redux uses 'user.id' or 'user.uid'
      if (isAuthenticated && user?.id) { 
        await registerPushNotifications(user.id);
      }
    };

    init();

    // Cleanup listeners when component unmounts
    return () => {
      PushNotifications.removeAllListeners();
    };
  }, [isAuthenticated, user?.id]); 

  const registerPushNotifications = async (studentId) => {
    // A. Check & Request Permissions
    let permStatus = await PushNotifications.checkPermissions();
    
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') return;

    // B. Register with Apple/Google to get the token
    await PushNotifications.register();

    // C. Listen: Save Token to Firestore
    // We remove old listeners first to ensure we don't save twice
    await PushNotifications.removeAllListeners();

    PushNotifications.addListener('registration', async (token) => {
      console.log('🎉 Device Token:', token.value);
      try {
        const studentRef = doc(db, "students", studentId); 
        // ✅ FIX: Use setDoc with merge: true. 
        // This creates the document if it doesn't exist, preventing "No document to update" errors.
        await setDoc(studentRef, { fcmToken: token.value }, { merge: true });
        console.log("✅ Token saved to Database!");
      } catch (error) {
        console.error("❌ Error saving token:", error);
      }
    });

    // D. Listen: Handle Notification Click
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      const data = notification.notification.data;
      if (data.route) {
        navigate(data.route); 
      }
    });
  };

  return null;
};

export default MobileManager;