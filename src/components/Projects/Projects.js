import './Projects.css';
import '../../styles/Global.css';
import '../../styles/Fonts.css';
import Check from '../../assets/Check.svg';
import SolanaCLI from '../../assets/SolanaCLI.svg';
import Hex from '../../assets/hex.svg';
import Dorms from '../../assets/dorms.svg';

function Cards() {
    return (
        <div className='projectContent'>
            <h1>
                PROJECTS
            </h1>
            <div className='cards'>
                <div className='card'>
                <img src={Check} alt="Tasks"/>
                    <div className='cardContent'>
                        <h2>
                            Tasks
                        </h2>
                        <a href="https://tasks.jakedwyer.dev/" target="_blank">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="Arrows">
                            <g id="arrow.up.forward">
                            <g id="Group">
                            <path id="Vector" d="M12 9.43819L11.9958 2.77406C11.9958 2.31687 11.6953 2 11.2209 2H4.5592C4.11726 2 3.80428 2.33678 3.80428 2.72587C3.80428 3.11376 4.14445 3.43249 4.53863 3.43249H6.90095L9.75976 3.33465L8.55213 4.39864L2.2347 10.7316C2.08544 10.8833 2 11.0694 2 11.2549C2 11.6392 2.34973 12 2.74471 12C2.9355 12 3.11607 11.9254 3.26772 11.7694L9.59718 5.4443L10.6715 4.23057L10.5628 6.97664V9.4588C10.5628 9.85437 10.8802 10.199 11.2733 10.199C11.6634 10.199 12 9.86712 12 9.43819Z" fill='var(--primaryText)'/>
                            </g>
                            </g>
                            </g>
                            </svg>
                        </a>
                    </div>
                </div>
                <div className='card'>
                    <img src={SolanaCLI} alt="Solana CLI"/>
                    <div className='cardContent'>
                        <h2>
                            Solana Payments
                        </h2>
                        <a href="https://github.com/jake-dwyer/solanaCLIPayments" target="_blank">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="Arrows">
                            <g id="arrow.up.forward">
                            <g id="Group">
                            <path id="Vector" d="M12 9.43819L11.9958 2.77406C11.9958 2.31687 11.6953 2 11.2209 2H4.5592C4.11726 2 3.80428 2.33678 3.80428 2.72587C3.80428 3.11376 4.14445 3.43249 4.53863 3.43249H6.90095L9.75976 3.33465L8.55213 4.39864L2.2347 10.7316C2.08544 10.8833 2 11.0694 2 11.2549C2 11.6392 2.34973 12 2.74471 12C2.9355 12 3.11607 11.9254 3.26772 11.7694L9.59718 5.4443L10.6715 4.23057L10.5628 6.97664V9.4588C10.5628 9.85437 10.8802 10.199 11.2733 10.199C11.6634 10.199 12 9.86712 12 9.43819Z" fill='var(--primaryText)'/>
                            </g>
                            </g>
                            </g>
                            </svg>
                        </a>
                    </div>
                </div>
                <div className='card'>
                <img src={Hex} alt="Reversi"/>
                    <div className='cardContent'>
                        <h2>
                            Hexagonal Reversi
                        </h2>
                        <a href="https://github.com/jake-dwyer/publicReversi" target="_blank">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="Arrows">
                            <g id="arrow.up.forward">
                            <g id="Group">
                            <path id="Vector" d="M12 9.43819L11.9958 2.77406C11.9958 2.31687 11.6953 2 11.2209 2H4.5592C4.11726 2 3.80428 2.33678 3.80428 2.72587C3.80428 3.11376 4.14445 3.43249 4.53863 3.43249H6.90095L9.75976 3.33465L8.55213 4.39864L2.2347 10.7316C2.08544 10.8833 2 11.0694 2 11.2549C2 11.6392 2.34973 12 2.74471 12C2.9355 12 3.11607 11.9254 3.26772 11.7694L9.59718 5.4443L10.6715 4.23057L10.5628 6.97664V9.4588C10.5628 9.85437 10.8802 10.199 11.2733 10.199C11.6634 10.199 12 9.86712 12 9.43819Z" fill='var(--primaryText)'/>
                            </g>
                            </g>
                            </g>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cards;