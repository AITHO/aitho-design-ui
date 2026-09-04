import React from "react";

export const AithoIcon = (
  props: React.JSX.IntrinsicAttributes &
    React.ClassAttributes<HTMLImageElement> &
    React.ImgHTMLAttributes<HTMLImageElement>,
) => {
  const theme = document.documentElement.getAttribute("data-panda-theme");

  return theme === "dark" ? (
    <img src="aitho-dark.png" alt=" Logo" {...props} />
  ) : (
    <img src="aitho-light.png" alt="Logo" {...props} />
  );
};
