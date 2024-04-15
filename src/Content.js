import './Content.css';
import './Colors.css';
import './Fonts.css';

function Content() {
    return (
        <div className='pageContent'>
            <div className='contentBlock'>
                <h1 className='secondaryText'>
                    CURRENTLY
                </h1>
                <p className='primaryText'>
                    I’m a second year student at 
                    Northeastern University studying computer science 
                    and business administration.
                </p>
            </div>
            <div className='contentBlock'>
                <h1 className='secondaryText'>
                    ABOUT ME
                </h1>
                <p className='primaryText'>
                I enjoy creating software that users can be passionate about using and have a memorable experience with.
                </p>
            </div>
        </div>
    );
}

export default Content;