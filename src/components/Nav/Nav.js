import React, { useState } from 'react';

const navLinks = [
  { label: 'CONTACT ME', href: 'mailto:dwyer.jak@northeastern.edu' },
  { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/jakedwyer-/' },
  { label: 'GITHUB', href: 'https://github.com/jake-dwyer' },
  { label: 'LEETCODE', href: 'https://leetcode.com/u/jakeistyping/' },
  { label: 'RESUME', href: '/images/Resume.pdf' },
];

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <nav className="relative flex w-full flex-wrap items-start justify-between gap-6 px-5 py-5 lg:px-10 2xl:gap-8 2xl:py-8">
      <div className="flex flex-col">
        <ul className="flex flex-col items-start space-y-1">
          <li className="font-plex text-sm text-secondary 2xl:text-base">SOFTWARE ENGINEER</li>
          <li className="font-geist text-base text-primary 2xl:text-xl">Jake Dwyer</li>
        </ul>
      </div>

      <div
        className={`flex items-center font-plex text-sm text-secondary xl:text-base 2xl:text-lg max-[1100px]:absolute max-[1100px]:right-5 max-[1100px]:top-16 max-[1100px]:w-48 max-[1100px]:flex-col max-[1100px]:rounded-xl max-[1100px]:border max-[1100px]:border-outline max-[1100px]:bg-background max-[1100px]:p-5 max-[1100px]:shadow-lg max-[1100px]:z-10 ${
          isMenuOpen ? 'max-[1100px]:flex' : 'max-[1100px]:hidden'
        }`}
      >
        <ul className="flex items-center gap-24 2xl:gap-32 max-[1100px]:w-full max-[1100px]:flex-col max-[1100px]:gap-5 max-[1100px]:text-center">
          {navLinks.map((link) => (
            <li key={link.label} className="transition-colors duration-200 hover:text-primary">
              <a href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col items-end text-right max-[1100px]:hidden">
        <ul className="flex flex-col items-end space-y-1">
          <li className="font-plex text-sm text-secondary 2xl:text-base">LOCATION</li>
          <li className="font-geist text-base text-primary 2xl:text-xl">Boston, MA</li>
        </ul>
      </div>

      <button
        type="button"
        aria-label="Toggle navigation"
        className="hidden h-5 w-6 flex-col justify-between focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary max-[1100px]:flex"
        onClick={toggleMenu}
      >
        <span aria-hidden="true" className="h-0.5 w-full bg-secondary" />
        <span aria-hidden="true" className="h-0.5 w-full bg-secondary" />
        <span aria-hidden="true" className="h-0.5 w-full bg-secondary" />
      </button>
    </nav>
  );
}

export default Nav;
