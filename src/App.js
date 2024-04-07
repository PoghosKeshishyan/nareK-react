import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { HistoryPage } from './pages/HistoryPage';
import { ClientPage } from './pages/ClientPage';
import { CalendarPage } from './pages/CalendarPage';
import { SendEmailPage } from './pages/SendEmailPage';
import axios from './axios';

export function App() {
  const [header, setHeader] = useState({});

  useEffect(() => {
    loadingData();
  }, []);

  const loadingData = async () => {
    const response = await axios.get('header');
    setHeader(response.data);
  }

  return (
    <div className='App'>
      <Header header={header} />

      <main>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/history' element={<HistoryPage />} />
          <Route path='/client/:id' element={<ClientPage />} />
          <Route path='/child/:id/:month/:year' element={<CalendarPage />} />
          <Route path='/child/:id/:week/:month/:year/feedback' element={<SendEmailPage />} />
        </Routes>
      </main>
    </div>
  )
}
