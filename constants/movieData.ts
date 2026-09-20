import type { ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type Movie = {
  id: string;
  title: string;
  genre: string;
  runtime: string;
  accent: string;
  icon: IconName;
  note: string;
};

export const MOVIES: Movie[] = [
  {
    id: 'past-lives',
    title: 'Past Lives',
    genre: 'Romance · Drama',
    runtime: '1h 46m',
    accent: '#e9988f',
    icon: 'heart-outline',
    note: 'A quiet, beautiful story about timing and what-ifs.',
  },
  {
    id: 'about-time',
    title: 'About Time',
    genre: 'Romance · Comedy',
    runtime: '2h 3m',
    accent: '#d7b277',
    icon: 'clock-outline',
    note: 'Warm, funny, and made for a night in together.',
  },
  {
    id: 'the-holdovers',
    title: 'The Holdovers',
    genre: 'Comedy · Drama',
    runtime: '2h 13m',
    accent: '#8eb9ab',
    icon: 'movie-open-outline',
    note: 'A thoughtful winter watch with a lot of heart.',
  },
];

export const AVATAR_OPTIONS: Array<{ key: string; icon: IconName; label: string }> = [
  { key: 'cat', icon: 'cat', label: 'Cat' },
  { key: 'dog', icon: 'dog', label: 'Dog' },
  { key: 'rabbit', icon: 'rabbit', label: 'Rabbit' },
  { key: 'fox', icon: 'bird', label: 'Bird' },
  { key: 'panda', icon: 'panda', label: 'Panda' },
  { key: 'owl', icon: 'owl', label: 'Owl' },
  { key: 'penguin', icon: 'penguin', label: 'Penguin' },
  { key: 'paw', icon: 'paw', label: 'Paw' },
];