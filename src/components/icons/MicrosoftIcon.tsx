import React from "react";

export const MicrosoftIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 23 23"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="10" height="10" fill="#F35325" />
    <rect x="12" width="10" height="10" fill="#81BC06" />
    <rect y="12" width="10" height="10" fill="#05A6F0" />
    <rect x="12" y="12" width="10" height="10" fill="#FFBA08" />
  </svg>
);
