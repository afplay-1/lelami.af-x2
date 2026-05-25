import { Listing, Job, Conversation, User } from '../types';

export const MOCK_USERS: Record<string, User> = {
  seller1: {
    id: 'user_1',
    name: 'Najibullah Afghan',
    avatar: 'NA',
    location: 'Kabul, Wazir Akbar Khan',
    joinDate: '2023',
    isVerified: true,
    rating: 4.9,
    listingsCount: 18,
    responseTime: '99% inside 10 mins',
    phone: '+93 78 456 1234',
  },
  seller2: {
    id: 'user_2',
    name: 'Sahar Karimi',
    avatar: 'SK',
    location: 'Herat, Jade-e-Behzad',
    joinDate: '2024',
    isVerified: true,
    rating: 4.7,
    listingsCount: 7,
    responseTime: '92% inside 15 mins',
    phone: '+93 79 112 3456',
  },
  seller3: {
    id: 'user_3',
    name: 'Ghulam Hazrat',
    avatar: 'GH',
    location: 'Balkh, Mazar-i-Sharif',
    joinDate: '2022',
    isVerified: false,
    rating: 4.5,
    listingsCount: 12,
    responseTime: '85% inside 45 mins',
    phone: '+93 70 889 7766',
  },
};

export const MOCK_LISTINGS: Listing[] = [];

export const MOCK_JOBS: Job[] = [];

export const MOCK_CONVERSATIONS: Conversation[] = [];
