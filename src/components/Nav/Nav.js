import React, { useState } from 'react';
import './Nav.css';
import '../../styles/Global.css';
import '../../styles/Fonts.css';

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav>
      <div className='topLeftNav'>
        <ul>
          <li className='secondaryText'>SOFTWARE ENGINEER</li>
          <li className='primaryText'>Jake Dwyer</li>
        </ul>
      </div>
      <div className={`navItems ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li className='secondaryText'>
            <a href="mailto:dwyer.jak@northeastern.edu" target="_blank" rel="noreferrer">
              CONTACT ME
              </a>
          </li>
          <li className='secondaryText'>
            <a href="https://www.linkedin.com/in/jakedwyer-/" target="_blank" rel="noreferrer">LINKEDIN</a>
          </li>
          <li className='secondaryText'>
            <a href="https://github.com/jake-dwyer" target="_blank" rel="noreferrer">GITHUB</a>
          </li>
          <li className='secondaryText'>
            <a href="https://leetcode.com/u/jakeistyping/" target="_blank" rel="noreferrer">LEETCODE</a>
          </li>
          <li className='secondaryText'>
            <a href="../images/Resume.pdf" target="_blank" rel="noreferrer">RESUME</a>
          </li>
        </ul>
      </div>
      <div className='topRightNav'>
        <ul>
          <li className='secondaryText'>LOCATION</li>
          <li className='primaryText'>Boston, MA</li>
        </ul>
      </div>
      <div className='hamburger' onClick={toggleMenu}>
        <div className='line'></div>
        <div className='line'></div>
        <div className='line'></div>
      </div>
    </nav>
  );
}

export default Nav;
