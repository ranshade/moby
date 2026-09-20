import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useAppState } from '@/context/AppStateContext';
import { AVATAR_OPTIONS } from '@/constants/movieData';
import { IconAvatar } from '@/components/IconAvatar';
import { useTheme, type ThemeMode } from '@/context/ThemeContext';

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, updateAvatar, signOut } = useAppState();
  const { themeMode, setThemeMode } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 22, paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
      <Text style={[styles.kicker, { color: colors.primary }]}>YOUR LITTLE CORNER</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>This is you.</Text>
      <View style={[styles.profileCard, { backgroundColor: colors.plum }]}>
        <IconAvatar avatarKey={profile?.avatarKey ?? 'cat'} size={74} selected />
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: colors.cream }]}>{profile?.name ?? 'Movie lover'}</Text>
          <Text style={[styles.profileEmail, { color: colors.blush }]}>{profile?.email ?? 'you@example.com'}</Text>
        </View>
        <MaterialCommunityIcons name="star-four-points" size={22} color={colors.accent} />
      </View>
      <View style={styles.sectionTitleRow}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Pick your icon</Text>
        <Text style={[styles.sectionCaption, { color: colors.mutedForeground }]}>Tap to change</Text>
      </View>
      <View style={styles.grid}>
        {AVATAR_OPTIONS.map((option) => {
          const selected = option.key === profile?.avatarKey;
          return (
            <Pressable key={option.key} testID={`profile-avatar-${option.key}`} onPress={() => updateAvatar(option.key)} style={styles.option}>
              <IconAvatar avatarKey={option.key} size={66} selected={selected} />
              <Text style={[styles.optionLabel, { color: selected ? colors.primary : colors.mutedForeground }]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={[styles.tip, { backgroundColor: colors.mint }]}>
        <MaterialCommunityIcons name="lightbulb-outline" size={21} color={colors.plum} />
        <Text style={[styles.tipText, { color: colors.plum }]}>A cute icon makes every invite feel more personal.</Text>
      </View>
      <View style={styles.themeHeader}>
        <View>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Appearance</Text>
          <Text style={[styles.sectionCaption, { color: colors.mutedForeground }]}>Choose how moby looks</Text>
        </View>
        <MaterialCommunityIcons name="theme-light-dark" size={22} color={colors.primary} />
      </View>
      <View style={[styles.themePicker, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {(['system', 'light', 'dark'] as ThemeMode[]).map((mode) => (
          <Pressable
            key={mode}
            testID={`theme-${mode}`}
            onPress={() => setThemeMode(mode)}
            style={[styles.themeOption, { backgroundColor: themeMode === mode ? colors.primary : 'transparent' }]}
          >
            <Text style={[styles.themeOptionText, { color: themeMode === mode ? colors.primaryForeground : colors.mutedForeground }]}>
              {mode[0].toUpperCase() + mode.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
      <Pressable testID="sign-out" onPress={handleSignOut} style={({ pressed }) => [styles.signOut, { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}>
        <MaterialCommunityIcons name="logout-variant" size={19} color={colors.destructive} />
        <Text style={[styles.signOutText, { color: colors.destructive }]}>Sign out</Text>
      </Pressable>
      <Pressable testID="profile-home" onPress={() => router.replace('/(tabs)')} style={styles.homeLink}>
        <Text style={[styles.homeText, { color: colors.mutedForeground }]}>Back to your movie shelf</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20 },
  kicker: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.6 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 32, letterSpacing: -1.2, marginTop: 10 },
  profileCard: { borderRadius: 22, padding: 17, flexDirection: 'row', alignItems: 'center', marginTop: 24 },
  profileInfo: { flex: 1, marginLeft: 13 },
  profileName: { fontFamily: 'Inter_700Bold', fontSize: 19 },
  profileEmail: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 4 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 30, marginBottom: 17 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 20 },
  sectionCaption: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 17, rowGap: 19 },
  option: { width: 67, alignItems: 'center', gap: 6 },
  optionLabel: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  tip: { borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 25 },
  tipText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 18 },
  themeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 28, marginBottom: 11 },
  themePicker: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, padding: 4, gap: 4 },
  themeOption: { flex: 1, minHeight: 39, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  themeOptionText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  signOut: { height: 53, borderRadius: 17, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 30 },
  signOutText: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  homeLink: { alignItems: 'center', marginTop: 20 },
  homeText: { fontFamily: 'Inter_500Medium', fontSize: 12 },
});