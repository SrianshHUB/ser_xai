/**
 * FILE: App.tsx
 * DESCRIPTION: The root component of the React application.
 * CONTRIBUTION: 
 * 1. Sets up the main routing structure using react-router-dom.
 * 2. Configures global providers for TanStack Query (data fetching), Tooltips, and Toast notifications.
 * 3. Defines the navigation paths for the Home, Upload, and Live recording pages.
 */
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import UploadAudio from "./pages/UploadAudio";
import LiveAudio from "./pages/LiveAudio";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/upload" element={<UploadAudio />} />
          <Route path="/live" element={<LiveAudio />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
