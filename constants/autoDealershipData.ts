import { AutoDealership } from '../types';

export const autoDealershipData: AutoDealership[] = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  image: '/placeholder-image.jpg',
  title: 'Lorem ipsum sit amet',
  description: 'consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
}));