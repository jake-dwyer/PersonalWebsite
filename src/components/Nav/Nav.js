import React, { useState } from 'react';
import './Nav.css';
import '../../styles/Global.css';
import '../../styles/Fonts.css';

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  function copyEmail() {
    const email = "dwyer.jak@northeastern.edu";

    navigator.clipboard.writeText(email)
    .then(() => alert("Copied the text: " + email))
    .catch(err => console.error('Error copying email to clipboard: ', err));
}

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
            <a href="Contact" onClick={copyEmail}>CONTACT ME</a>
          </li>
          <li className='secondaryText'>
            <a href="https://www.linkedin.com/in/jakedwyer-/" target="_blank">LINKEDIN</a>
          </li>
          <li className='secondaryText'>
            <a href="https://github.com/jake-dwyer" target="_blank">GITHUB</a>
          </li>
          <li className='secondaryText'>
            <a href="../images/Resume.pdf" target="_blank">RESUME</a>
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
