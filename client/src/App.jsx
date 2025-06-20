import { useEffect, useState } from 'react';
import Loader from './Components/Loader/Loader';
import Router from './Router';
import { ToastContainer } from 'react-toastify';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <ToastContainer />
      <Router />
    </>
  );
}

export default App;
