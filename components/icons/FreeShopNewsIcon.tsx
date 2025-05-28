import React from 'react';

interface FreeShopNewsIconProps {
  color?: string;
}

const FreeShopNewsIcon: React.FC<FreeShopNewsIconProps> = ({ color = 'black' }) => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 22.5H20C20.5304 22.5 21.0391 22.2893 21.4142 21.9142C21.7893 21.5391 22 21.0304 22 20.5V4.5C22 3.96957 21.7893 3.46086 21.4142 3.08579C21.0391 2.71071 20.5304 2.5 20 2.5H8C7.46957 2.5 6.96086 2.71071 6.58579 3.08579C6.21071 3.46086 6 3.96957 6 4.5V20.5C6 21.0304 5.78929 21.5391 5.41421 21.9142C5.03914 22.2893 4.53043 22.5 4 22.5ZM4 22.5C3.46957 22.5 2.96086 22expli22.2893 22.2893 21.9142C2.21071 21.5391 2 21.0304 2 20.5V11.5C2 10.4 2.9 9.5 4 9.5H6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 14.5H10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 18.5H10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 6.5H18V10.5H10V6.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default FreeShopNewsIcon;