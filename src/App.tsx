
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Chat from "@/pages/Chat";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import CommandDetail from "@/pages/CommandDetail";
import ProductDetail from "@/pages/ProductDetail";
import OfferDetail from "@/pages/OfferDetail";
import Support from "@/pages/Support";
import "./App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/support" element={<Support />} />
          <Route path="/commands/:commandId" element={<CommandDetail />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/offers/:offerId" element={<OfferDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster richColors />
    </ThemeProvider>
  );
}

export default App;
