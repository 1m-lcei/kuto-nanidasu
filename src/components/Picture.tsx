import { useState } from "react";

type PictureProps = {
  pathWithoutExtension: string;
  sourceExtension: string;
  alt: string;
};

function Picture({ pathWithoutExtension, sourceExtension, alt }: PictureProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="flex justify-center items-center">
      {isLoading && (
        // biome-ignore lint/a11y/useSemanticElements: 適切
        <span
          className="loading loading-spinner loading-xl"
          role="status"
          aria-label="画像を読込中"
        />
      )}
      <picture style={isLoading ? { display: "none" } : {}}>
        <source srcSet={`${pathWithoutExtension}.avif`} type="image/avif" />
        <img
          src={`${pathWithoutExtension}.${sourceExtension}`}
          alt={alt}
          className="max-w-full object-contain"
          onLoad={() => setIsLoading(false)}
        />
      </picture>
    </div>
  );
}

export default Picture;
