import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Zid from './pages/Zid';
import CumDevinBarosan from './pages/CumDevinBarosan';
import Termeni from './pages/Termeni';
import Confidentialitate from './pages/Confidentialitate';

function App() {
  return (
    <ToastProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/zid" element={<Zid />} />
              <Route path="/cum-devin-barosan" element={<CumDevinBarosan />} />
              <Route path="/termeni" element={<Termeni />} />
              <Route path="/confidentialitate" element={<Confidentialitate />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
