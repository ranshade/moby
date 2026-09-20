import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function AnimatedIntro({ onFinish }: { onFinish: () => void }) {
  const colors = useColors();
  const [progress, setProgress] = useState(0);
  const tweenTarget = useRef({ value: 0 });

  useEffect(() => {
    const tween = gsap.to(tweenTarget.current, {
      value: 1,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => setProgress(tweenTarget.current.value),
      onComplete: onFinish,
    });
    return () => {
      tween.kill();
    };
  }, [onFinish]);

  return (
    <View style={[styles.container, { backgroundColor: colors.plum }]}>
      <View style={[styles.iconBubble, { transform: [{ scale: 0.86 + progress * 0.14 }], opacity: 0.7 + progress * 0.3 }]}>
        <MaterialCommunityIcons name="movie-open-outline" size={52} color={colors.plum} />
      </View>
      <Text style={[styles.wordmark, { opacity: progress, transform: [{ translateY: (1 - progress) * 10 }] }]}>moby</Text>
      <Text style={[styles.caption, { color: colors.blush, opacity: progress }]}>make a night of it</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconBubble: { width: 104, height: 104, borderRadius: 52, backgroundColor: '#fff8f3', alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  wordmark: { color: '#fff8f3', fontFamily: 'Inter_700Bold', fontSize: 34, letterSpacing: -1.2 },
  caption: { marginTop: 8, fontFamily: 'Inter_500Medium', fontSize: 14, letterSpacing: 1.2 },
});