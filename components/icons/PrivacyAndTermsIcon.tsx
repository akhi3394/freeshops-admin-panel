import React from 'react';

interface PrivacyAndTermsIconProps {
  color?: string;
}

const PrivacyAndTermsIcon: React.FC<PrivacyAndTermsIconProps> = ({ color = 'black' }) => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2.5C10.6193 2.5 9.5 3.61929 9.5 5V8.5H14.5V5C14.5 3.61929 13.3807 2.5 12 2.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 8.5H7C5.61929 8.5 4.5 9.61929 4.5 11V19C4.5 20.3807 5.61929 21.5 7 21.5H17C18.3807 21.5 19.5 20.3807 19.5 19V11C19.5 9.61929 18.3807 8.5 17 8.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default PrivacyAndTermsIcon;