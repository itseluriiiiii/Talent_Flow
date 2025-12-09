import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Preloader from "@/components/Preloader";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import HRDashboard from "./pages/HRDashboard";
import CandidatesPage from "./pages/CandidatesPage";
import Interviews from "./pages/Interviews";
import Employees from "./pages/Employees";
import Onboarding from "./pages/Onboarding";
import Offboarding from "./pages/Offboarding";
import Documents from "./pages/Documents";
import Analytics from "./pages/Analytics";
import Tutorial from "./pages/Tutorial";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <AppLayout>{children}</AppLayout>;
}

function RouteChangeHandler({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    setIsFadingOut(false);
    
    // Fixed duration of 0.8 seconds
    const duration = 800;
    
    // Start fade out 200ms before the end
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, duration - 200);
    
    // Hide preloader after fade completes
    const hideTimer = setTimeout(() => {
      setIsLoading(false);
      setIsFadingOut(false);
    }, duration + 800);
    
    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, [location.pathname]);

  return (
    <>
      <Preloader isVisible={isLoading} isFadingOut={isFadingOut} />
      {children}
    </>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route 
        path="/signup" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <SignUp />} 
      />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/hr-dashboard" element={<ProtectedRoute><HRDashboard /></ProtectedRoute>} />
      <Route path="/candidates" element={<ProtectedRoute><CandidatesPage /></ProtectedRoute>} />
      <Route path="/interviews" element={<ProtectedRoute><Interviews /></ProtectedRoute>} />
      <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/offboarding" element={<ProtectedRoute><Offboarding /></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/tutorial" element={<ProtectedRoute><Tutorial /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <RouteChangeHandler>
            <AppRoutes />
          </RouteChangeHandler>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
