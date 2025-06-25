import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './Context/Context';
import Home from './Pages/Home/Home';
import QuestionPage from './Pages/Questionpage/Questionpage';
import AnswerPage from './Pages/Answer/AnswerPage';
import Howitworks from './Pages/Howitworks/Howitworks';
import Auth from './Pages/Auth/Auth';
import Four04 from './Pages/Four04/Four04';
import Loader from './Components/Loader/Loader';
import ResetPassword from './Pages/ResetPassword/ResetPassword';

function Router() {
  const [{ user }] = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Handle initial load
    const initialLoadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(initialLoadTimer);
  }, []);

  useEffect(() => {
    // Handle route change
    setIsLoading(true);
    const routeChangeTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(routeChangeTimer);
  }, [location.pathname]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route path="/how-it-works" element={<Howitworks />} />
      <Route
        path="/"
        element={user ? <Home /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/ask"
        element={user ? <QuestionPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/questionDetail/:questionid"
        element={user ? <AnswerPage /> : <Navigate to="/login" replace />}
      />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="*" element={<Four04 />} />
    </Routes>
  );
}

export default Router;
