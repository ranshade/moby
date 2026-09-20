import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useAppState } from '@/context/AppStateContext';
import { MOVIES } from '@/constants/movieData';

export default function InviteScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { invite, updateInvite, sendInvite } = useAppState();
  const sent = invite.status === 'sent';

  const handleSend = async () => {
    await sendInvite();
  };

  if (sent) {
    return (
      <View style={[styles.success, { backgroundColor: colors.background, paddingTop: insets.top + 36, paddingBottom: insets.bottom + 30 }]}>
        <View style={[styles.successIcon, { backgroundColor: colors.mint }]}>
          <MaterialCommunityIcons name="check" size={40} color={colors.plum} />
        </View>
        <Text style={[styles.successKicker, { color: colors.primary }]}>INVITE SENT</Text>
        <Text style={[styles.successTitle, { color: colors.foreground }]}>Now we wait for{'\n'}a “yes.”</Text>
        <Text style={[styles.successCopy, { color: colors.mutedForeground }]}>Your invite for {invite.movie.title} is ready to share. That’s a good start to the evening.</Text>
        <View style={[styles.invitePreview, { backgroundColor: colors.plum }]}>
          <Text style={[styles.previewKicker, { color: colors.accent }]}>MOVIE DATE INVITE</Text>
          <Text style={[styles.previewTitle, { color: colors.cream }]}>{invite.movie.title}</Text>
          <Text style={[styles.previewMeta, { color: colors.blush }]}>{invite.date} · {invite.time}</Text>
        </View>
        <Pressable testID="back-home" onPress={() => router.replace('/(tabs)')} style={({ pressed }) => [styles.secondaryButton, { borderColor: colors.border, opacity: pressed ? 0.75 : 1 }]}>
          <Text style={[styles.secondaryText, { color: colors.foreground }]}>Back to movies</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <Text style={[styles.kicker, { color: colors.primary }]}>MAKE IT OFFICIAL</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>Send a movie date.</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>A small invitation can make an ordinary night feel like a plan.</Text>
      <View style={[styles.preview, { backgroundColor: colors.plum }]}>
        <View style={styles.previewTop}>
          <View>
            <Text style={[styles.previewKicker, { color: colors.accent }]}>YOU’RE INVITED</Text>
            <Text style={[styles.previewTitle, { color: colors.cream }]}>{invite.movie.title}</Text>
          </View>
          <MaterialCommunityIcons name="heart" size={26} color={colors.accent} />
        </View>
        <Text style={[styles.previewMeta, { color: colors.blush }]}>{invite.date} · {invite.time}</Text>
        <Text style={[styles.previewMessage, { color: colors.cream }]}>{invite.message}</Text>
      </View>
      <Text style={[styles.label, { color: colors.secondaryForeground }]}>Movie</Text>
      <View style={styles.moviePills}>
        {MOVIES.map((movie) => (
          <Pressable key={movie.id} onPress={() => updateInvite({ movie })} style={[styles.pill, { backgroundColor: invite.movie.id === movie.id ? colors.primary : colors.card, borderColor: invite.movie.id === movie.id ? colors.primary : colors.border }]}>
            <Text style={[styles.pillText, { color: invite.movie.id === movie.id ? colors.primaryForeground : colors.foreground }]}>{movie.title}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.twoColumns}>
        <View style={styles.fieldHalf}>
          <Text style={[styles.label, { color: colors.secondaryForeground }]}>Date</Text>
          <TextInput testID="invite-date" value={invite.date} onChangeText={(date) => updateInvite({ date })} style={[styles.input, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]} placeholderTextColor={colors.mutedForeground} />
        </View>
        <View style={styles.fieldHalf}>
          <Text style={[styles.label, { color: colors.secondaryForeground }]}>Time</Text>
          <TextInput testID="invite-time" value={invite.time} onChangeText={(time) => updateInvite({ time })} style={[styles.input, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]} placeholderTextColor={colors.mutedForeground} />
        </View>
      </View>
      <Text style={[styles.label, { color: colors.secondaryForeground }]}>Your message</Text>
      <TextInput testID="invite-message" value={invite.message} onChangeText={(message) => updateInvite({ message })} multiline numberOfLines={3} style={[styles.messageInput, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]} placeholderTextColor={colors.mutedForeground} />
      <Pressable testID="send-invite" onPress={handleSend} style={({ pressed }) => [styles.sendButton, { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }]}>
        <MaterialCommunityIcons name="send" size={20} color={colors.primaryForeground} />
        <Text style={[styles.sendText, { color: colors.primaryForeground }]}>Send the invite</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20 },
  kicker: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.6 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 32, letterSpacing: -1.2, marginTop: 10 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, marginTop: 10, maxWidth: 320 },
  preview: { borderRadius: 23, padding: 19, marginTop: 24, minHeight: 174 },
  previewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  previewKicker: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1.5 },
  previewTitle: { fontFamily: 'Inter_700Bold', fontSize: 26, letterSpacing: -0.7, marginTop: 12 },
  previewMeta: { fontFamily: 'Inter_600SemiBold', fontSize: 11, marginTop: 7 },
  previewMessage: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, marginTop: 23 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 13, marginTop: 23, marginBottom: 8 },
  moviePills: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pill: { borderRadius: 14, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10 },
  pillText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  twoColumns: { flexDirection: 'row', gap: 10 },
  fieldHalf: { flex: 1 },
  input: { height: 52, borderRadius: 15, borderWidth: 1, paddingHorizontal: 13, fontFamily: 'Inter_400Regular', fontSize: 13 },
  messageInput: { minHeight: 92, borderRadius: 15, borderWidth: 1, paddingHorizontal: 14, paddingTop: 14, fontFamily: 'Inter_400Regular', fontSize: 14, textAlignVertical: 'top' },
  sendButton: { height: 56, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 24 },
  sendText: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  success: { flex: 1, paddingHorizontal: 26, alignItems: 'center' },
  successIcon: { width: 82, height: 82, borderRadius: 41, alignItems: 'center', justifyContent: 'center', marginTop: 38 },
  successKicker: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.6, marginTop: 28 },
  successTitle: { fontFamily: 'Inter_700Bold', fontSize: 34, lineHeight: 38, letterSpacing: -1.3, textAlign: 'center', marginTop: 12 },
  successCopy: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, textAlign: 'center', maxWidth: 310, marginTop: 16 },
  invitePreview: { width: '100%', borderRadius: 20, padding: 19, marginTop: 29 },
  secondaryButton: { height: 52, borderRadius: 17, borderWidth: 1, width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 'auto' },
  secondaryText: { fontFamily: 'Inter_700Bold', fontSize: 15 },
});