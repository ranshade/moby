import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth, useClerk } from '@clerk/expo';
import {
  useCreateInvite,
  useGetMe,
  useListInvites,
  useUpdateInvite,
  useUpdateMe,
} from '@/lib/api';
import { MOVIES, type Movie } from '@/constants/movieData';
import type { ReactNode } from 'react';

export type UserProfile = {
  id: number;
  clerkUserId: string;
  name: string;
  email: string;
  avatarKey: string;
};

export type MovieInvite = {
  id?: number;
  movie: Movie;
  date: string;
  time: string;
  message: string;
  status: 'draft' | 'sent';
};

type AppStateContextValue = {
  profile: UserProfile | null;
  invite: MovieInvite;
  isHydrating: boolean;
  updateAvatar: (avatarKey: string) => Promise<void>;
  updateInvite: (invite: Partial<MovieInvite>) => Promise<void>;
  sendInvite: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

const defaultInvite: MovieInvite = {
  movie: MOVIES[0],
  date: 'Friday, 8 November',
  time: '7:30 PM',
  message: 'I found the perfect movie for us.',
  status: 'draft',
};

function toMovieInvite(serverInvite: {
  id: number;
  movieId: string;
  movieTitle: string;
  genre: string;
  runtime: string;
  date: string;
  time: string;
  message: string;
  status: 'draft' | 'sent';
}): MovieInvite {
  const knownMovie = MOVIES.find((movie) => movie.id === serverInvite.movieId);
  return {
    id: serverInvite.id,
    movie:
      knownMovie ?? {
        id: serverInvite.movieId,
        title: serverInvite.movieTitle,
        genre: serverInvite.genre,
        runtime: serverInvite.runtime,
        accent: '#e9988f',
        icon: 'movie-open-outline',
        note: 'A movie date picked just for you.',
      },
    date: serverInvite.date,
    time: serverInvite.time,
    message: serverInvite.message,
    status: serverInvite.status,
  };
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();
  const { signOut: clerkSignOut } = useClerk();
  const queryClient = useQueryClient();
  const meQuery = useGetMe({ query: { queryKey: ['getMe'], enabled: !!isSignedIn } });
  const invitesQuery = useListInvites({ query: { queryKey: ['listInvites'], enabled: !!isSignedIn } });
  const updateMeMutation = useUpdateMe();
  const createInviteMutation = useCreateInvite();
  const updateInviteMutation = useUpdateInvite();
  const [invite, setInvite] = useState<MovieInvite>(defaultInvite);

  useEffect(() => {
    const firstInvite = invitesQuery.data?.[0];
    if (firstInvite) setInvite(toMovieInvite(firstInvite));
  }, [invitesQuery.data]);

  const profile = meQuery.data
    ? {
        id: meQuery.data.id,
        clerkUserId: meQuery.data.clerkUserId,
        name: meQuery.data.name,
        email: meQuery.data.email,
        avatarKey: meQuery.data.avatarKey,
      }
    : null;

  const updateAvatar = async (avatarKey: string) => {
    await updateMeMutation.mutateAsync({ data: { avatarKey } });
    await meQuery.refetch();
  };

  const updateInvite = async (changes: Partial<MovieInvite>) => {
    setInvite((current) => ({ ...current, ...changes }));
  };

  const sendInvite = async () => {
    const payload = {
      movieId: invite.movie.id,
      movieTitle: invite.movie.title,
      genre: invite.movie.genre,
      runtime: invite.movie.runtime,
      date: invite.date,
      time: invite.time,
      message: invite.message,
    };

    if (invite.id) {
      await updateInviteMutation.mutateAsync({ id: invite.id, data: { ...payload, status: 'sent' } });
    } else {
      const created = await createInviteMutation.mutateAsync({ data: payload });
      setInvite({ ...toMovieInvite(created), status: 'sent' });
      return;
    }

    setInvite((current) => ({ ...current, status: 'sent' }));
    await invitesQuery.refetch();
  };

  const signOut = async () => {
    await clerkSignOut();
    // Drop cached /me and /invites so the next account on this device never sees them.
    queryClient.clear();
    setInvite(defaultInvite);
  };

  const value = useMemo(
    () => ({
      profile,
      invite,
      isHydrating: isSignedIn === undefined || meQuery.isLoading || invitesQuery.isLoading,
      updateAvatar,
      updateInvite,
      sendInvite,
      signOut,
    }),
    [profile, invite, isSignedIn, meQuery.isLoading, invitesQuery.isLoading],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used within AppStateProvider');
  return context;
}