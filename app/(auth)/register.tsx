import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSignUp } from '@clerk/expo';
import { useQueryClient } from '@tanstack/react-query';
import { useColors } from '@/hooks/useColors';
import { useUpdateMe } from '@/lib/api';
import { AVATAR_OPTIONS } from '@/constants/movieData';
import { IconAvatar } from '@/components/IconAvatar';

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signUp, errors, fetchStatus } = useSignUp();
  const updateMe = useUpdateMe();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarKey, setAvatarKey] = useState('cat');
  const [code, setCode] = useState('');

  const handleSubmit = async () => {
    const result = await signUp.password({ emailAddress: email.trim(), password });
    if (!result.error) {
      await signUp.verifications.sendEmailCode();
    }
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });
    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: async () => {
          router.replace('/(tabs)');
        },
      });
      // The session is active now, so the API request carries a token.
      try {
        await updateMe.mutateAsync({ data: { name: name.trim(), avatarKey } });
        await queryClient.invalidateQueries({ queryKey: ['getMe'] });
      } catch {
        // Account exists; the name/avatar can be changed later.
      }
    }
  };

  const error =
    errors.fields?.emailAddress?.message ||
    errors.fields?.password?.message ||
    errors.fields?.code?.message ||
    errors.global?.[0]?.message ||
    '';
  const isSubmitting = fetchStatus === 'fetching';

  if (signUp.status === 'missing_requirements' && signUp.unverifiedFields.includes('email_address')) {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={styles.content}>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>VERIFY YOUR ACCOUNT</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>Check your inbox.</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>We sent a verification code to {email}.</Text>
          <TextInput value={code} onChangeText={setCode} keyboardType="numeric" placeholder="Verification code" placeholderTextColor={colors.mutedForeground} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground, marginTop: 28 }]} />
          {!!error && <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>}
          <View nativeID="clerk-captcha" />
          <Pressable onPress={handleVerify} disabled={isSubmitting} style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary, opacity: pressed || isSubmitting ? 0.78 : 1 }]}>
            <Text style={[styles.primaryText, { color: colors.primaryForeground }]}>{isSubmitting ? 'Creating your profile…' : 'Verify email'}</Text>
          </Pressable>
          <Pressable onPress={() => signUp.verifications.sendEmailCode()} style={styles.resend}>
            <Text style={[styles.link, { color: colors.primary }]}>I need a new code</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Pressable testID="register-back" onPress={() => router.back()} style={styles.back}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.foreground} />
          <Text style={[styles.backText, { color: colors.foreground }]}>Back</Text>
        </Pressable>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>YOUR MOVIE DATE PROFILE</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>Make it yours.</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Choose a little icon so your invites feel like they came from you.</Text>
        <View style={styles.picker}>
          {AVATAR_OPTIONS.map((option) => (
            <Pressable key={option.key} testID={`avatar-${option.key}`} onPress={() => setAvatarKey(option.key)} style={styles.avatarChoice}>
              <IconAvatar avatarKey={option.key} size={54} selected={avatarKey === option.key} />
              <Text style={[styles.avatarLabel, { color: avatarKey === option.key ? colors.primary : colors.mutedForeground }]}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.secondaryForeground }]}>Your name</Text>
          <TextInput testID="register-name" autoCapitalize="words" placeholder="What should we call you?" placeholderTextColor={colors.mutedForeground} value={name} onChangeText={setName} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} />
          <Text style={[styles.label, { color: colors.secondaryForeground }]}>Email</Text>
          <TextInput testID="register-email" autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" placeholderTextColor={colors.mutedForeground} value={email} onChangeText={setEmail} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} />
          <Text style={[styles.label, { color: colors.secondaryForeground }]}>Password</Text>
          <TextInput testID="register-password" secureTextEntry placeholder="At least 6 characters" placeholderTextColor={colors.mutedForeground} value={password} onChangeText={setPassword} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} />
          {!!error && <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>}
          <View nativeID="clerk-captcha" />
          <Pressable testID="register-submit" onPress={handleSubmit} disabled={isSubmitting} style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary, opacity: pressed || isSubmitting ? 0.8 : 1 }]}>
            <Text style={[styles.primaryText, { color: colors.primaryForeground }]}>{isSubmitting ? 'Sending a code…' : 'Start planning'}</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color={colors.primaryForeground} />
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 26, paddingBottom: 28 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, marginBottom: 44 },
  backText: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1.5, marginBottom: 13 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 34, letterSpacing: -1.3 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, marginTop: 12 },
  picker: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 17, rowGap: 14, marginTop: 25 },
  avatarChoice: { width: 64, alignItems: 'center', gap: 4 },
  avatarLabel: { fontFamily: 'Inter_500Medium', fontSize: 10 },
  form: { marginTop: 24, gap: 9 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 13, marginTop: 4 },
  input: { height: 53, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, fontFamily: 'Inter_400Regular', fontSize: 15, marginBottom: 3 },
  error: { fontFamily: 'Inter_500Medium', fontSize: 13 },
  primaryButton: { height: 56, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 },
  primaryText: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  resend: { alignItems: 'center', marginTop: 20 },
  link: { fontFamily: 'Inter_700Bold', fontSize: 14 },
});