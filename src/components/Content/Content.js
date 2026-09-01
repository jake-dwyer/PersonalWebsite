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
                    I work on the Growth team at Secureframe, where I build the surfaces that bring people to the product: marketplace pages, SEO and AEO tooling, the analytics pipelines that say whether any of it worked. I like problems that sit between marketing and engineering, and I think most of them are engineering problems nobody framed that way.
                </p>
                <p className='primaryText'>
                    Northeastern alum.
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
