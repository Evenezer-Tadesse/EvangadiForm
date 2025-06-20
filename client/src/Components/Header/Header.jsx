
import React, { useState } from 'react';
import styles from './Header.module.css';
import logo from '../../asset/images/header_logo.png';
import { IoCloseSharp } from 'react-icons/io5';
import { FaBarsStaggered } from 'react-icons/fa6';
import { useContext } from 'react';
import { AuthContext } from '../../Context/Context';
import { Type } from '../../Utility/actionType';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [{ user }, dispatch] = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const onSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch({
      type: Type.REMOVE_USER,
    });
    navigate('/login');
  };

  const NavLinks = ({ isMobile }) => (
    <>
      <Link
        to={user ? "/" : "/login"}
        onClick={isMobile ? closeMenu : ""}
      >
        Home
      </Link>
      <Link to="/how-it-works" onClick={isMobile ? closeMenu : ""}>
        How it works
      </Link>
      {user ? (
        <Link
          onClick={() => {
            onSignOut();
            if (isMobile) closeMenu();
          }}
        
          className={`${styles.showMenu} ${!isMobile ? styles.btn : ""}`}
        >
          LOG OUT
        </Link>
      ) : (
        <Link
          to="/login"
          onClick={isMobile ? closeMenu : ""}
          className={`${styles.showMenu} ${!isMobile ? styles.btn : ""}`}
        >
          SIGN IN
        </Link>
      )}
    </>
  );

  return (
    <header className={styles.header}>
      <Link to={user ? "/" : "/login"} className={styles.logo}>
        <img src={logo} alt="evangadi_logo" />
      </Link>

      <button className={styles.menuToggle} onClick={toggleMenu}>
        <FaBarsStaggered color="#FF8500" />
      </button>

      {/* Mobile Nav */}
      <nav
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.showMenu : ""}`}
      >
        <button className={styles.closeButton} onClick={closeMenu}>
          <IoCloseSharp size={30} />
        </button>
        <Link to={user ? "/" : "/login"} className={styles.mobile_logo}>
          <img src={logo} alt="evangadi_logo" />
        </Link>
        <NavLinks isMobile />
      </nav>

      {/* Desktop Nav */}
      <div className={styles.nav_links}>
        <NavLinks />
      </div>
    </header>
  );
};

export default Header;
