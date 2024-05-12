import './Nav.css';
import './Global.css';
import './Fonts.css'

function Nav() {

  return (
    <nav>
      <div className='topLeftNav'>
        <ul>
          <li className='secondaryText'>SOFTWARE ENGINEER</li>
          <li className='primaryText'>Jake Dwyer</li>
        </ul>
      </div>
      <div className='navItems'>
        <ul>
          <li className='secondaryText'>
            <a href="url">CONTACT ME</a>
            </li>
          <li className='secondaryText'>
            <a href="https://www.linkedin.com/in/jakedwyer-/" target="_blank">LINKEDIN</a>
            </li>
          <li className='secondaryText'>
            <a href="https://github.com/jake-dwyer" target="_blank">GITHUB</a>
            </li>
          <li className='secondaryText'>
            <a href="url">RESUME</a>
            </li>
        </ul>
      </div>
      <div className='topRightNav'>
        <ul>
          <li className='secondaryText'>LOCATION</li>
          <li className='primaryText'>Boston, MA</li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;



