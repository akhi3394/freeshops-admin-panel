"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { sidebarItems } from '../constants/sidebarItems';
import { SidebarItem } from '../types';
import Image from 'next/image';
import Logo from '../public/WhatsApp Image 2024-07-03 at 12.21.36 PM 1.png';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const getRoute = (name: string): string => {
    const routeMap: { [key: string]: string } = {
      Dashboard: '/dashboard',
      Article: '/article',
      'Auto dealership': '/auto-dealership',
      'Country, state, city': '/country-state-city',
      FAQs: '/faqs',
      'Privacy & terms': '/privacy-terms',
      Careers: '/careers',
      'How it works': '/how-it-works',
    };
    return routeMap[name] || '/dashboard';
  };

  const isActive = (name: string): boolean => {
    const route = getRoute(name);
    return pathname === route;
  };

  return (
    <div
      style={{
        width: '280px',
        height: '100vh', // Full height
        background: '#fff', // Dark background for modern look
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        borderRight: 'none', // Remove border
      }}
    >
      <Image
        src={Logo}
        alt="Free Shopps Logo"
        style={{
          width: '120px',
          marginBottom: '40px',
          marginLeft: '8px',
        }}
      />
      <List sx={{ padding: 0 }}>
        {sidebarItems.map((item: SidebarItem, index: number) => {
          const active = isActive(item.name);
          return (
            <ListItem
              key={index}
              component="button"
              onClick={() => router.push(getRoute(item.name))}
              sx={{
                background: active ? '#26C6DA' : 'transparent',
                color: active ? '#fff' : '#000', // Light gray for inactive
                borderRadius: '8px',
                marginBottom: '8px',
                padding: '12px 16px',
                cursor: 'pointer',
                border: 'none', // Explicitly remove border
                transition: 'background 0.3s, color 0.3s',
              }}
              aria-label={`Navigate to ${item.name}`}
            >
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <item.icon />
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '16px',
                    fontWeight: active ? 600 : 400,
                  },
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default Sidebar;