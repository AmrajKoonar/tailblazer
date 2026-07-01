import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import SubmitReportPage from '../pages/SubmitReportPage';
import ReportDetailPage from '../pages/ReportDetailPage';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

function AppRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="app-layout">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/submit" element={<SubmitReportPage />} />
            <Route path="/reports/:id" element={<ReportDetailPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default AppRouter;
