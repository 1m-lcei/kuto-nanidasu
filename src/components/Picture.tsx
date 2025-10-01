type PictureProps = {
  pathWithoutExtension: string;
  sourceExtension: string;
  alt: string;
  className: string;
};

function Picture({
  pathWithoutExtension,
  sourceExtension,
  alt,
  className,
}: PictureProps) {
  return (
    <picture>
      <source srcSet={`${pathWithoutExtension}.avif`} type="image/avif" />
      <img
        src={`${pathWithoutExtension}.${sourceExtension}`}
        alt={alt}
        className={className}
      />
    </picture>
  );
}

export default Picture;
