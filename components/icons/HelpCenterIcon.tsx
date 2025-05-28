import React from 'react';

interface HelpCenterIconProps {
  color?: string;
}

const HelpCenterIcon: React.FC<HelpCenterIconProps> = ({ color = 'black' }) => (
  <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.9 18.5C8.80858 19.4791 11.0041 19.7443 13.0909 19.2478C15.1777 18.7514 17.0186 17.5259 18.2818 15.7922C19.545 14.0586 20.1474 11.9308 19.9806 9.79221C19.8137 7.65366 18.8886 5.64502 17.3718 4.12824C15.855 2.61146 13.8464 1.6863 11.7078 1.51946C9.56929 1.35263 7.44147 1.95509 5.70782 3.21829C3.97417 4.48149 2.74869 6.32236 2.25222 8.40916C1.75575 10.496 2.02094 12.6915 3 14.6L1 20.5L6.9 18.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default HelpCenterIcon;