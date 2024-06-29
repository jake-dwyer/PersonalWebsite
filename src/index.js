import React from 'react';
import ReactDOM from 'react-dom/client';
import Nav from './components/Nav/Nav';
import Content from './components/Content/Content';
import Projects from './components/Projects/Projects';
import Resume from './components/Nav/Resume';
import reportWebVitals from './reportWebVitals';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Nav />
    <Content />
    <Projects />
    <Analytics />
    <SpeedInsights />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
