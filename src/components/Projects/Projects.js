import './Projects.css';
import '../../styles/Global.css';
import '../../styles/Fonts.css';
import SolanaCLI from '../../assets/SolanaCLI.svg';
import Hex from '../../assets/hex.svg';
import Dorms from '../../assets/dorms.svg';
import Arrow from '../../assets/Arrows.svg';

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