import React, { useCallback, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { AnimatedIntro } from '@/components/AnimatedIntro';
import { useAppState } from '@/context/AppStateContext';
import { useAuth } from '@clerk/expo';

export default function IndexScreen() {
  const { profile, isHydrating } = useAppState();
  const { isSignedIn } = useAuth();
  const [introDone, setIntroDone] = useState(false);
  const finishIntro = useCallback(() => setIntroDone(true), []);

  useEffect(() => {
    if (!introDone || isHydrating) return;
    router.replace(isSignedIn ? '/(tabs)' : '/(auth)/login');
  }, [introDone, isHydrating, isSignedIn, profile]);

  return <AnimatedIntro onFinish={finishIntro} />;
}