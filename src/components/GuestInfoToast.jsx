import { useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';

/**
 * Guest Info Toast Component
 * Displays guest login credentials as a non-intrusive toast
 */
export default function GuestInfoToast() {
  const { showInfo } = useToast();
  const hasShownToast = useRef(false);

  useEffect(() => {
    // Show guest credentials info only once per mount (prevents duplicate toasts from StrictMode)
    if (!hasShownToast.current) {
      showInfo('Guest Credentials - Email: testemail@gmail.com | Password: Test123# - Use this to test all features of the website comprehensively.', 0);
      hasShownToast.current = true;
    }
  }, [showInfo]);

  return null;
}
