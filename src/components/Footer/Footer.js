import './Footer.css';
import '../../styles/Global.css';
import '../../styles/Fonts.css';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from "@vercel/analytics/react";


function Footer() {
    return (
        <div className='footerContent'>
            <div className='footerBlock'>
                <p className='subText'>
                    <a href='https://www.figma.com/community/file/1537502776991564304/personal-website' target='_blank'>
                    View this site's design in Figma <span>&lt;3</span>
                    </a>
                </p>
            </div>
            <SpeedInsights />
            <Analytics />
        </div>
    )
}

export default Footer;
