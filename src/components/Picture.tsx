type PictureProps = {
  pathWithoutExtension: string;
  sourceExtension: string;
  alt: string;
};

function Picture({ pathWithoutExtension, sourceExtension, alt }: PictureProps) {
  return (
    <picture>
      <source srcSet={`${pathWithoutExtension}.avif`} type="image/avif" />
      <img
        src={`${pathWithoutExtension}.${sourceExtension}`}
        alt={alt}
        className="max-w-full object-contain"
      />
    </picture>
  );
}

export default Picture;
