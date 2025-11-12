function Footer() {
  return (
    <div className="mx-auto mb-5 mt-20 w-full max-w-[520px] px-5 text-center 2xl:max-w-[620px]">
      <p className="font-plex text-xs text-secondary transition-colors duration-200 hover:text-primary 2xl:text-sm">
        <a
          href="https://www.figma.com/community/file/1537502776991564304/personal-website"
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          View this site's design in Figma <span className="text-primary">&lt;3</span>
        </a>
      </p>
    </div>
  );
}

export default Footer;
