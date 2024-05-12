import './Projects.css';
import './Global.css';
import './Fonts.css';
import SolanaCLI from './SolanaCLI.svg';
import Arrow from './Arrows.svg';

function Cards() {
    return (
        <div className='projectContent'>
            <h1>
                PROJECTS
            </h1>
            <div className='cards'>
                <div className='card'>
                    <img src={SolanaCLI} alt="Solana CLI"/>
                    <div className='cardContent'>
                        <h2>
                            Solana Payments
                        </h2>
                        <img src={Arrow} alt="Source"/>
                    </div>
                </div>
                <div className='card'>
                <img src={SolanaCLI} alt="Solana CLI"/>
                    <div className='cardContent'>
                        <h2>
                            Hexagonal Reversi
                        </h2>
                        <img src={Arrow} alt="Source"/>
                    </div>
                </div>
                <div className='card'>
                <img src={SolanaCLI} alt="Solana CLI"/>
                    <div className='cardContent'>
                        <h2>
                            Dorms
                        </h2>
                        <img src={Arrow} alt="Source"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cards;