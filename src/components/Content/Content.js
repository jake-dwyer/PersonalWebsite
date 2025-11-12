function Content() {
  return (
    <div className="mx-auto my-[60px] flex w-full max-w-[520px] flex-col gap-[60px] px-5 xl:max-w-[580px] 2xl:max-w-[660px] 2xl:gap-20">
      <div className="space-y-3">
        <h1 className="font-plex text-sm text-secondary 2xl:text-base">CURRENTLY</h1>
        <p className="font-geist text-base leading-6 text-primary max-[576px]:text-sm max-[576px]:leading-5 2xl:text-lg 2xl:leading-7">
          I'm a fifth-year student at Northeastern University studying Computer Science and Business
          Administration.
        </p>
      </div>
      <div className="space-y-3">
        <h1 className="font-plex text-sm text-secondary 2xl:text-base">ABOUT ME</h1>
        <p className="font-geist text-base leading-6 text-primary max-[576px]:text-sm max-[576px]:leading-5 2xl:text-lg 2xl:leading-7">
          I'm passionate about crafting intuitive, user-centered products at the intersection of technology and
          business.
        </p>
      </div>
    </div>
  );
}

export default Content;
