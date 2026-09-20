import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSignIn } from '@clerk/expo';
import { useColors } from '@/hooks/useColors';

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signIn, errors, fetchStatus } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = async () => {
    const result = await signIn.password({ emailAddress: email.trim(), password });
    if (result.error) {
      return;
    }
    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: async () => {
          router.replace('/(tabs)');
        },
      });
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code });
    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: async () => {
          router.replace('/(tabs)');
        },
      });
    }
  };

  const isSubmitting = fetchStatus === 'fetching';
  const error =
    errors.fields?.identifier?.message ||
    errors.fields?.password?.message ||
    errors.fields?.code?.message ||
    errors.global?.[0]?.message ||
    '';

  if (signIn.status === 'needs_client_trust') {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={styles.inner}>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>VERIFY YOUR ACCOUNT</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>One more quick step.</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Enter the code we sent to your email.</Text>
          <TextInput value={code} onChangeText={setCode} keyboardType="numeric" placeholder="Verification code" placeholderTextColor={colors.mutedForeground} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground, marginTop: 28 }]} />
          {!!error && <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>}
          <Pressable onPress={handleVerify} disabled={isSubmitting} style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary, opacity: pressed || isSubmitting ? 0.78 : 1 }]}>
            <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>Verify</Text>
          </Pressable>
          <Pressable onPress={() => signIn.mfa.sendEmailCode()} style={styles.resend}>
            <Text style={[styles.link, { color: colors.primary }]}>I need a new code</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.inner}>
        <View style={styles.brandRow}>
          <View style={[styles.brandIcon, { backgroundColor: colors.primary }]}>
            <MaterialCommunityIcons name="movie-open-outline" size={24} color={colors.primaryForeground} />
          </View>
          <Text style={[styles.brand, { color: colors.plum }]}>moby</Text>
        </View>
        <View style={styles.headlineBlock}>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>WELCOME BACK</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>Ready for a{'\n'}little screen time?</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Pick a movie, invite your favorite person, and make tonight feel special.</Text>
        </View>
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.secondaryForeground }]}>Email</Text>
          <TextInput testID="login-email" autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" placeholderTextColor={colors.mutedForeground} value={email} onChangeText={setEmail} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} />
          <Text style={[styles.label, { color: colors.secondaryForeground }]}>Password</Text>
          <TextInput testID="login-password" secureTextEntry placeholder="At least 6 characters" placeholderTextColor={colors.mutedForeground} value={password} onChangeText={setPassword} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} />
           {!!error && <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>}
          <Pressable testID="login-submit" onPress={handleSubmit} disabled={isSubmitting} style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary, opacity: pressed || isSubmitting ? 0.78 : 1 }]}>
             <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>{isSubmitting ? 'Opening your date…' : 'Continue'}</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color={colors.primaryForeground} />
          </Pressable>
        </View>
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>New here?</Text>
          <Pressable testID="go-register" onPress={() => router.push('/(auth)/register')}>
            <Text style={[styles.link, { color: colors.primary }]}>Create an account</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, paddingHorizontal: 26, paddingBottom: 20 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 18 },
  brandIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  brand: { fontFamily: 'Inter_700Bold', fontSize: 20, letterSpacing: -0.4 },
  headlineBlock: { marginTop: 62 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1.6, marginBottom: 14 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 36, lineHeight: 40, letterSpacing: -1.5 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, marginTop: 18, maxWidth: 320 },
  form: { marginTop: 34, gap: 9 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 13, marginTop: 5 },
  input: { height: 54, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, fontFamily: 'Inter_400Regular', fontSize: 15, marginBottom: 4 },
  error: { fontFamily: 'Inter_500Medium', fontSize: 13, marginTop: 2 },
  primaryButton: { height: 56, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 },
  primaryButtonText: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 'auto' },
  footerText: { fontFamily: 'Inter_400Regular', fontSize: 14 },
  link: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  resend: { alignItems: 'center', marginTop: 20 },
});