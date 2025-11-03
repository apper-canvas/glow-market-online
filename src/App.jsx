import { createContext, useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from "react-toastify";
import { router } from '@/router';
import store from '@/store';

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [authMethods, setAuthMethods] = useState({});
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Authentication methods to share via context
    const methods = {
      logout: async () => {
        try {
          await ApperUI.logout();
          window.location.href = '/login';
        } catch (error) {
          console.error("Logout failed:", error);
        }
      }
    };
    
    setAuthMethods(methods);
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
        
        if (user) {
          // User is authenticated
          if (redirectPath) {
            window.location.href = redirectPath;
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              window.location.href = currentPath;
            } else {
              window.location.href = '/';
            }
          } else {
            window.location.href = '/';
          }
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            window.location.href = currentPath.includes('/signup')
              ? `/signup?redirect=${currentPath}`
              : currentPath.includes('/login')
              ? `/login?redirect=${currentPath}`
              : '/login';
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              window.location.href = `/login?redirect=${redirectPath}`;
            } else {
              window.location.href = currentPath;
            }
          } else if (isAuthPage) {
            window.location.href = currentPath;
          } else {
            window.location.href = '/login';
          }
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        setIsInitialized(true);
      }
    });
  }, []);
  
  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>
    );
  }
  
  return (
    <Provider store={store}>
      <AuthContext.Provider value={authMethods}>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthContext.Provider>
    </Provider>
  );
}

export default App;