import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollTop from './hook/ScrollTop'
import { useAuthStore } from './store/authUser'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import WatchPage from './pages/WatchPage'

import SearchPage from './pages/Search'
import HistoryPage from './pages/HistoryPage'
import FavoritePage from './pages/FavoritePage'
import CategoryPage from './pages/CategoryPage'

function App() {
  const { user, authCheck, isAuthenticated } = useAuthStore();

  console.log("el User is", user);

  useEffect(() => {
    authCheck();
  }, [])



  return (
    <>
      <BrowserRouter>
        <ScrollTop></ScrollTop>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/watch/:id" element={<WatchPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/favorite" element={<FavoritePage />} />
          <Route path="/category" element={<CategoryPage />} />
        </Routes>
        <Footer />
        <Toaster />

      </BrowserRouter>
    </>
  )
}

export default App
