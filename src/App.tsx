import './App.css';
import Navbar from './components/navbar';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/register';
import LoginPage from './pages/login';
import Footer from './components/footer';
import ContactUs from './pages/contact-us';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-0 m-0">
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex items-center justify-between gap-8">
                <div className="w-full">
                  <img
                    src="/images/Delivery.png"
                    alt="Banner"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            }
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/contact-us" element={<ContactUs />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;