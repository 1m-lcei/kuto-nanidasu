type PictureProps = {
  pathWithoutExtension: string;
  sourceExtension: SourceExtensions;
  alt: string;
  className: string;
};

export type SourceExtensions = "png" | "jpg";

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
        loading="lazy"
        alt={alt}
        className={className}
      />
    </picture>
  );
}

export default Picture;
