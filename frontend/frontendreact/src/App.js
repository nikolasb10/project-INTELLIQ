import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import ErrorPage from './pages/ErrorPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<MainPage />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
