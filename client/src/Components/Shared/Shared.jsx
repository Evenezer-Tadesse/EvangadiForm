import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

function Shared({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default Shared;
