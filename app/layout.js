import './globals.css';
import { ToastProvider } from '@/lib/toastContext';
import { AuthProvider } from '@/lib/authContext';
import { CartProvider } from '@/lib/cartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartSlideOver from '@/components/CartSlideOver';

export const metadata = {
  title: 'RonyCafeHut | Artisan Roastery, Woodfired Pizza & Cozy Cafe',
  description: 'Your cozy corner for good coffee, artisanal sourdough pizza, fresh bakery pastries, and good moments. Order online for dine-in, takeaway, or direct delivery.',
  keywords: ['RonyCafeHut', 'Specialty Coffee', 'Artisanal Pizza', 'Cafe Ordering', 'Fresh Pastries', 'Bakery', 'Espresso'],
  authors: [{ name: 'RonyCafeHut' }],
  openGraph: {
    title: 'RonyCafeHut | Cozy Cafe & Artisan Roastery',
    description: 'Specialty single origin coffees, woodfired sourdough pizza, and handcrafted brunch in a warm, inviting atmosphere.',
    url: 'https://ronycafehut.com',
    siteName: 'RonyCafeHut',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'RonyCafeHut Cozy Atmosphere',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#FAF6F0] text-[#2C1D11] min-h-screen flex flex-col antialiased selection:bg-caramel/20 selection:text-cafe-900">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1 pt-20">
                {children}
              </main>
              <Footer />
              <CartSlideOver />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
