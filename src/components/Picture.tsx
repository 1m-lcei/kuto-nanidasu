type PictureProps = {
  pathWithoutExtension: string;
  sourceExtension: SourceExtensions;
  alt: string;
  className: string;
};

export type SourceExtensions = "png" | "jpg";

const baseUrl = import.meta.env.BASE_URL;

function Picture({
  pathWithoutExtension,
  sourceExtension,
  alt,
  className,
}: PictureProps) {
  const cleanPath = pathWithoutExtension.startsWith("/")
    ? pathWithoutExtension.slice(1)
    : pathWithoutExtension;
  const avifPath = `${baseUrl}${cleanPath}.avif`;
  const fallbackPath = `${baseUrl}${cleanPath}.${sourceExtension}`;

  return (
    <picture>
      <source srcSet={avifPath} type="image/avif" />
      <img
        src={fallbackPath}
        loading="lazy"
        alt={alt}
        className={className}
      />
    </picture>
  );
}

export default Picture;
