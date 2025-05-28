import React from 'react';

interface AutoDealershipIconProps {
  color?: string;
}

const AutoDealershipIcon: React.FC<AutoDealershipIconProps> = ({ color = 'black' }) => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21 12.5C21 10.1131 20.0518 7.82387 18.364 6.13604C16.6761 4.44821 14.3869 3.5 12 3.5C9.48395 3.50947 7.06897 4.49122 5.26 6.24L3 8.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 3.5V8.5H8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 12.5C3 14.8869 3.94821 17.1761 5.63604 18.864C7.32387 20.5518 9.61305 21.5 12 21.5C14.516 21.4905 16.931 20.5088 18.74 18.76L21 16.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 16.5H21V21.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default AutoDealershipIcon;