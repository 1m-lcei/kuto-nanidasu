import logoAvif from "@/assets/logo.avif";
import logoPng from "@/assets/logo.png";

function Logo() {
  return (
    <picture>
      <source srcSet={logoAvif} type="image/avif" />
      <img src={logoPng} alt="「何切る」超会議ロゴ" />
    </picture>
  );
}

export default Logo;
