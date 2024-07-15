import './Content.css';
import '../../styles/Global.css';
import '../../styles/Fonts.css';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from "@vercel/analytics/react"

function Content() {
    return (
        <div className='pageContent'>
            <div className='contentBlock'>
                <h1 className='secondaryText'>
                    CURRENTLY
                </h1>
                <p className='primaryText'>
                I'm a third-year student at Northeastern University, studying Computer Science and Business Administration. Right now, I'm working on the NUgig platform with Northeastern's IoT Open Innovation Lab.
                </p>
            </div>
            <div className='contentBlock'>
                <h1 className='secondaryText'>
                    ABOUT ME
                </h1>
                <p className='primaryText'>
                I enjoy creating software that users can be passionate about using.
                </p>
            </div>
            <SpeedInsights />
            <Analytics/>
        </div>
    );
}

export default Content;