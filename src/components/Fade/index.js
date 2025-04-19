import { useEffect, useState } from "react";

const Fade = ({
  show,
  duration = 0.3,
  className = "",
  fadeInClassName = "",
  fadeOutClassName = "",
  children,
}) => {
  const [shouldRender, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setRender(false);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`${className} ${show ? fadeInClassName : fadeOutClassName}`}
      style={{
        opacity: show ? 1 : 0,
        animation: `${show ? "fadeIn" : "fadeOut"} ${duration}s`,
      }}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  );
};

export default Fade;
