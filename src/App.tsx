import { useState } from 'react';
import MainSelection from './components/MainSelection';
import QuoteAnalysis from './components/QuoteAnalysis';
import PartnerService from './components/PartnerService';

export type Page = 'main' | 'quote-analysis' | 'partner-service';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('main');

  const renderPage = () => {
    switch (currentPage) {
      case 'main':
        return <MainSelection onNavigate={setCurrentPage} />;
      case 'quote-analysis':
        return <QuoteAnalysis onBack={() => setCurrentPage('main')} />;
      case 'partner-service':
        return <PartnerService onBack={() => setCurrentPage('main')} />;
      default:
        return <MainSelection onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderPage()}
    </div>
  );
}