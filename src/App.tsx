import './App.css';
import Navbar from './components/navbar';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/register';
import Footer from './components/footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 px-8">
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex items-center justify-between gap-8">
                <div className="w-1/2">
                  <h1 className="text-4xl font-bold text-gray-900">
                    Delivery Services Now Available!
                  </h1>
                </div>
                <div className="w-1/2">
                  <img
                    src="/images/truck.png"
                    alt="Banner"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            }
          />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;