import React from 'react';

interface FAQsIconProps {
  color?: string;
}

const FAQsIcon: React.FC<FAQsIconProps> = ({ color = 'black' }) => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 17.5H12.01"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 2.5H6C5.46957 2.5 4.96086 2.71071 4.58579 3.08579C4.21071 3.46086 4 3.96957 4 4.5V20.5C4 21.0304 4.21071 21.5391 4.58579 21.9142C4.96086 22.2893 5.46957 22.5 6 22.5H18C18.5304 22.5 19.0391 22.2893 19.4142 21.9142C19.7893 21.5391 20 21.0304 20 20.5V7.5L15 2.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.1001 9.49992C9.34008 8.83855 9.80487 8.28257 10.4132 7.92915C11.0216 7.57574 11.7348 7.44738 12.4282 7.56653C13.1216 7.68567 13.7511 8.04472 14.2066 8.58093C14.6621 9.11714 14.9146 9.79638 14.9201 10.4999C14.9201 12.4999 11.9201 13.4999 11.9201 13.4999"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default FAQsIcon;