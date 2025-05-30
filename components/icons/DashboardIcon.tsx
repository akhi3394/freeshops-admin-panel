import React from 'react';

interface DashboardIconProps {
  color?: string;
}

const DashboardIcon: React.FC<DashboardIconProps> = ({ color = 'black' }) => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 3.5H4C3.44772 3.5 3 3.94772 3 4.5V11.5C3 12.0523 3.44772 12.5 4 12.5H9C9.55228 12.5 10 12.0523 10 11.5V4.5C10 3.94772 9.55228 3.5 9 3.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 3.5H15C14.4477 3.5 14 3.94772 14 4.5V7.5C14 8.05228 14.4477 8.5 15 8.5H20C20.5523 8.5 21 8.05228 21 7.5V4.5C21 3.94772 20.5523 3.5 20 3.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 12.5H15C14.4477 12.5 14 12.9477 14 13.5V20.5C14 21.0523 14.4477 21.5 15 21.5H20C20.5523 21.5 21 21.0523 21 20.5V13.5C21 12.9477 20.5523 12.5 20 12.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 16.5H4C3.44772 16.5 3 16.9477 3 17.5V20.5C3 21.0523 3.44772 21.5 4 21.5H9C9.55228 21.5 10 21.0523 10 20.5V17.5C10 16.9477 9.55228 16.5 9 16.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default DashboardIcon;