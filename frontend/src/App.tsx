import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import CartSidebar from './components/shop/CartSidebar';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ShopPage from './pages/ShopPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <CartSidebar />
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<div style={{ padding: 40, textAlign: 'center' }}>Home – Coming Soon</div>} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/about" element={<div style={{ padding: 40 }}>About Us – Coming Soon</div>} />
                <Route path="/promotions" element={<div style={{ padding: 40 }}>Promotions – Coming Soon</div>} />
                <Route path="/contact" element={<div style={{ padding: 40 }}>Contact – Coming Soon</div>} />
              </Routes>
            </main>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
