import Curate from '../../assets/curateLogo.svg';
import Check from '../../assets/Check.svg';
import SolanaCLI from '../../assets/SolanaCLI.svg';
import Hex from '../../assets/hex.svg';

const projects = [
  {
    title: 'Curate [In Development]',
    image: Curate,
    alt: 'Curate project preview',
    href: 'https://github.com/jake-dwyer/curate',
  },
  {
    title: 'Tasks',
    image: Check,
    alt: 'Tasks project preview',
    href: 'https://tasks.jakedwyer.dev/',
  },
  {
    title: 'Solana Payments',
    image: SolanaCLI,
    alt: 'Solana CLI project preview',
    href: 'https://github.com/jake-dwyer/solanaCLIPayments',
  },
  {
    title: 'Hexagonal Reversi',
    image: Hex,
    alt: 'Hexagonal Reversi project preview',
    href: 'https://github.com/jake-dwyer/publicReversi',
  },
];

function Projects() {
  return (
    <div className="mx-auto w-full max-w-[1300px] px-5 max-[1200px]:w-[90%] 2xl:max-w-[1500px]">
      <h1 className="font-plex text-sm text-secondary 2xl:text-base">PROJECTS</h1>
      <div className="mt-3 grid grid-cols-3 gap-6 max-[992px]:grid-cols-2 max-[768px]:grid-cols-1 2xl:gap-8">
        {projects.map((project) => (
          <div key={project.title} className="border border-outline p-4 2xl:p-6">
            <img src={project.image} alt={project.alt} className="h-auto w-full" />
            <div className="mt-4 flex items-center justify-between">
              <h2 className="font-geist text-sm text-primary xl:text-base 2xl:text-lg">{project.title}</h2>
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visit ${project.title}`}
                className="text-primary"
              >
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 9.43819L11.9958 2.77406C11.9958 2.31687 11.6953 2 11.2209 2H4.5592C4.11726 2 3.80428 2.33678 3.80428 2.72587C3.80428 3.11376 4.14445 3.43249 4.53863 3.43249H6.90095L9.75976 3.33465L8.55213 4.39864L2.2347 10.7316C2.08544 10.8833 2 11.0694 2 11.2549C2 11.6392 2.34973 12 2.74471 12C2.9355 12 3.11607 11.9254 3.26772 11.7694L9.59718 5.4443L10.6715 4.23057L10.5628 6.97664V9.4588C10.5628 9.85437 10.8802 10.199 11.2733 10.199C11.6634 10.199 12 9.86712 12 9.43819Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
