import { ReactNode, ComponentType } from 'react';

export interface SidebarItem {
  name: string;
  icon: ComponentType<{ color?: string }>;
}

export interface AutoDealership {
  id: number;
  image: string;
  title: string;
  description: string;
}

export interface Article {
  data:{_id: string; // Changed from id: number to _id: string
  title: string;
  description: string; // Replacing author
  image: string;
  popular: number;
  createdAt: string; // Already matches
  updatedAt: string;}
}

export interface ApiResponse<T> {
data: { docs: T; // Changed from data to docs
  totalDocs: number; // Changed from total to totalDocs
  limit: number;
  page: number;
  totalPages: number; // Added to match response
  pagingCounter: number; // Added to match response
  hasPrevPage: boolean; // Added to match response
  hasNextPage: boolean; // Added to match response
  prevPage: number | null; // Added to match response
  nextPage: number | null; // Added to match response
  status?: string; // Made optional, not present in response
  message?: string;}
}