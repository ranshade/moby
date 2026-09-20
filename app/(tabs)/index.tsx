import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useAppState } from '@/context/AppStateContext';
import { MOVIES } from '@/constants/movieData';
import { IconAvatar } from '@/components/IconAvatar';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, invite, updateInvite } = useAppState();
  const [selectedMovieId, setSelectedMovieId] = useState(invite.movie.id);
  const selectedMovie = useMemo(() => MOVIES.find((movie) => movie.id === selectedMovieId) ?? MOVIES[0], [selectedMovieId]);

  const chooseMovie = async (movieId: string) => {
    setSelectedMovieId(movieId);
    const movie = MOVIES.find((item) => item.id === movieId) ?? MOVIES[0];
    await updateInvite({ movie, status: 'draft' });
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.kicker, { color: colors.primary }]}>YOUR NEXT MOVIE DATE</Text>
          <Text style={[styles.greeting, { color: colors.foreground }]}>Hi, {profile?.name?.split(' ')[0] ?? 'movie lover'}.</Text>
        </View>
        <Pressable testID="profile-shortcut" onPress={() => router.push('/(tabs)/profile')}>
          <IconAvatar avatarKey={profile?.avatarKey ?? 'cat'} size={48} />
        </Pressable>
      </View>
      <View style={[styles.hero, { backgroundColor: colors.plum }]}>
        <View style={styles.heroCopy}>
          <Text style={[styles.heroEyebrow, { color: colors.accent }]}>A LITTLE PLAN</Text>
          <Text style={[styles.heroTitle, { color: colors.cream }]}>The best dates{'\n'}start with “watch?”</Text>
          <Text style={[styles.heroBody, { color: colors.blush }]}>Choose a movie and send a sweet little invitation.</Text>
        </View>
        <View style={[styles.ticket, { backgroundColor: colors.accent }]}>
          <MaterialCommunityIcons name="movie-open-outline" size={30} color={colors.plum} />
          <View style={styles.ticketDots} />
          <Text style={[styles.ticketText, { color: colors.plum }]}>DATE</Text>
        </View>
      </View>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Pick a movie</Text>
          <Text style={[styles.sectionCaption, { color: colors.mutedForeground }]}>What are we watching together?</Text>
        </View>
        <MaterialCommunityIcons name="filmstrip" size={23} color={colors.primary} />
      </View>
      <View style={styles.movieList}>
        {MOVIES.map((movie) => {
          const selected = selectedMovieId === movie.id;
          return (
            <Pressable key={movie.id} testID={`movie-${movie.id}`} onPress={() => chooseMovie(movie.id)} style={({ pressed }) => [styles.movieCard, { backgroundColor: selected ? movie.accent : colors.card, borderColor: selected ? movie.accent : colors.border, opacity: pressed ? 0.86 : 1 }]}>
              <View style={[styles.moviePoster, { backgroundColor: selected ? 'rgba(255,255,255,0.36)' : colors.secondary }]}>
                <MaterialCommunityIcons name={movie.icon} size={27} color={selected ? colors.plum : colors.primary} />
              </View>
              <View style={styles.movieInfo}>
                <Text style={[styles.movieTitle, { color: selected ? colors.plum : colors.foreground }]}>{movie.title}</Text>
                <Text style={[styles.movieMeta, { color: selected ? colors.secondaryForeground : colors.mutedForeground }]}>{movie.genre}  ·  {movie.runtime}</Text>
              </View>
              <View style={[styles.radio, { borderColor: selected ? colors.plum : colors.border, backgroundColor: selected ? colors.plum : 'transparent' }]}>
                {selected && <View style={[styles.radioDot, { backgroundColor: colors.accent }]} />}
              </View>
            </Pressable>
          );
        })}
      </View>
      <View style={[styles.selectionNote, { backgroundColor: colors.mint }]}>
        <MaterialCommunityIcons name="heart-outline" size={20} color={colors.plum} />
        <Text style={[styles.selectionText, { color: colors.plum }]}>{selectedMovie.title} is ready for your invite.</Text>
      </View>
      <Pressable testID="invite-cta" onPress={() => router.push('/(tabs)/invite')} style={({ pressed }) => [styles.cta, { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }]}>
        <MaterialCommunityIcons name="send" size={20} color={colors.primaryForeground} />
        <Text style={[styles.ctaText, { color: colors.primaryForeground }]}>Create invite</Text>
        <MaterialCommunityIcons name="arrow-right" size={20} color={colors.primaryForeground} />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kicker: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.5 },
  greeting: { fontFamily: 'Inter_700Bold', fontSize: 29, letterSpacing: -1, marginTop: 7 },
  hero: { minHeight: 192, borderRadius: 24, marginTop: 24, padding: 21, flexDirection: 'row', justifyContent: 'space-between', overflow: 'hidden' },
  heroCopy: { flex: 1, paddingRight: 8 },
  heroEyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.5 },
  heroTitle: { fontFamily: 'Inter_700Bold', fontSize: 26, lineHeight: 29, letterSpacing: -0.9, marginTop: 11 },
  heroBody: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, marginTop: 12, maxWidth: 185 },
  ticket: { width: 76, height: 118, borderRadius: 18, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '7deg' }], marginTop: 12, marginRight: 4 },
  ticketDots: { width: 47, borderTopWidth: 1, borderTopColor: '#482538', opacity: 0.25, marginTop: 16 },
  ticketText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 2, marginTop: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 29, marginBottom: 14 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 21, letterSpacing: -0.4 },
  sectionCaption: { fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 4 },
  movieList: { gap: 10 },
  movieCard: { minHeight: 76, borderRadius: 18, borderWidth: 1, flexDirection: 'row', alignItems: 'center', padding: 10, gap: 12 },
  moviePoster: { width: 55, height: 55, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  movieInfo: { flex: 1 },
  movieTitle: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  movieMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 5 },
  radio: { width: 21, height: 21, borderRadius: 11, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 5 },
  radioDot: { width: 7, height: 7, borderRadius: 4 },
  selectionNote: { flexDirection: 'row', alignItems: 'center', gap: 9, borderRadius: 15, padding: 13, marginTop: 16 },
  selectionText: { flex: 1, fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  cta: { height: 57, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 16 },
  ctaText: { fontFamily: 'Inter_700Bold', fontSize: 16 },
});