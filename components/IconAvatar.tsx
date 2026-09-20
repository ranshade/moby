import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { AVATAR_OPTIONS } from '@/constants/movieData';

export function IconAvatar({
  avatarKey,
  size = 52,
  selected = false,
}: {
  avatarKey: string;
  size?: number;
  selected?: boolean;
}) {
  const colors = useColors();
  const avatar = AVATAR_OPTIONS.find((option) => option.key === avatarKey) ?? AVATAR_OPTIONS[0];
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: selected ? colors.primary : colors.blush,
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}
    >
      <MaterialCommunityIcons
        name={avatar.icon}
        size={size * 0.5}
        color={selected ? colors.primaryForeground : colors.plum}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});