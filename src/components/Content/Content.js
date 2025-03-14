import './Content.css';
import '../../styles/Global.css';
import '../../styles/Fonts.css';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from "@vercel/analytics/react";

function Content() {
    return (
        <div className='pageContent'>
            <div className='contentBlock'>
                <h1 className='secondaryText'>
                    CURRENTLY
                </h1>
                <p className='primaryText'>
                    I'm a third-year student at Northeastern University studying Computer Science and Business Administration. I'm currently working part-time as a product engineer on <a class="inline-a" href="https://nugig.tech/" target="_blank" rel="noopener noreferrer">nugig 
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="Arrows">
                                <g id="arrow.up.forward">
                                    <g id="Group">
                                        <path id="Vector" d="M12 9.43819L11.9958 2.77406C11.9958 2.31687 11.6953 2 11.2209 2H4.5592C4.11726 2 3.80428 2.33678 3.80428 2.72587C3.80428 3.11376 4.14445 3.43249 4.53863 3.43249H6.90095L9.75976 3.33465L8.55213 4.39864L2.2347 10.7316C2.08544 10.8833 2 11.0694 2 11.2549C2 11.6392 2.34973 12 2.74471 12C2.9355 12 3.11607 11.9254 3.26772 11.7694L9.59718 5.4443L10.6715 4.23057L10.5628 6.97664V9.4588C10.5628 9.85437 10.8802 10.199 11.2733 10.199C11.6634 10.199 12 9.86712 12 9.43819Z" fill='var(--primaryText)' />
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </a>, while actively seeking my next co-op opportunity. 
                </p>
            </div>
            <div className='contentBlock'>
                <h1 className='secondaryText'>
                    ABOUT ME
                </h1>
                <p className='primaryText'>
                    I'm passionate about crafting intuitive, user-centered products at the intersection of technology and business.
                </p>
            </div>
            <SpeedInsights />
            <Analytics />
        </div>
    );
}

export default Content;
