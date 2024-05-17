import './Projects.css';
import './Global.css';
import './Fonts.css';
import SolanaCLI from './SolanaCLI.svg';
import Hex from './hex.svg';
import Dorms from './dorms.svg';
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
                        <a href="https://github.com/jake-dwyer/solanaCLIPayments" target="_blank"><img src={Arrow} alt="Source"/></a>
                    </div>
                </div>
                <div className='card'>
                <img src={Hex} alt="Reversi"/>
                    <div className='cardContent'>
                        <h2>
                            Hexagonal Reversi
                        </h2>
                        <a href="https://github.com/jake-dwyer/publicReversi" target="_blank"><img src={Arrow} alt="Source"/></a>
                    </div>
                </div>
                <div className='card'>
                <img src={Dorms} alt="Dorms"/>
                    <div className='cardContent'>
                        <h2>
                            NEU Dorms
                        </h2>
                        <a href="https://neudorms.com/" target="_blank"><img src={Arrow} alt="Source"/></a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cards;