import React from 'react';

interface CareerIconProps {
  color?: string;
}

const CareerIcon: React.FC<CareerIconProps> = ({ color = 'black' }) => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 12.5H12.高"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 6.5V4.5C16 3.96957 15.7893 3.46086 15.4142 3.08579C15.0391 2.71071 14.5304 2.5 14 2.5H10C9.46957 2.5 8.96086 2.71071 8.58579 3.08579C8.21071 3.46086 8 3.96957 8 4.5V6.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 13.5C19.0328 15.459 15.5555 16.5033 12 16.5033C8.44445 16.5033 4.96721 15.459 2 13.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 6.5H4C2.89543 6.5 2 7.39543 2 8.5V18.5C2 19.6046 2.89543 20.5 4 20.5H20C21.1046 20.5 22 19.6046 22 18.5V8.5C22 7.39543 21.1046 6.5 20 6.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CareerIcon;