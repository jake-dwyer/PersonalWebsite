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
                    I'm a fifth-year student at Northeastern University studying Computer Science and Business Administration.
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
