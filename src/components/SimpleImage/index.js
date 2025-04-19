import { useState } from "react";
// styles
import styles from "./styles.module.css";
// components
import Image from "next/image";

const SimpleImage = ({
  src,
  alt = "",
  width = 100,
  height = 100,
  className,
  disableLazyLoad,
}) => {
  const [hasLoaded, setHasLoaded] = useState(disableLazyLoad);

  if (!src) {
    return null;
  }

  return (
    <Image
      onLoad={() => setHasLoaded(true)}
      style={{ maxWidth: width, opacity: hasLoaded ? 1 : 0 }}
      alt={alt}
      className={`${styles.image} ${className}`}
      src={src}
      width={width}
      height={height}
      loading={disableLazyLoad ? "eager" : "lazy"}
    />
  );
};

export default SimpleImage;
