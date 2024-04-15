import './Nav.css';
import './Colors.css';
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
          <li className='secondaryText'>CONTACT ME</li>
          <li className='secondaryText'>LINKEDIN</li>
          <li className='secondaryText'>GITHUB</li>
          <li className='secondaryText'>RESUME</li>
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



