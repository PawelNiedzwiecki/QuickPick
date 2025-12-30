/**
 * ParticipantList Component
 * Displays list of participants in a session
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Participant } from '../../types';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../../utils/constants';

interface ParticipantListProps {
  participants: Participant[];
  currentUserId?: string;
}

export function ParticipantList({
  participants,
  currentUserId,
}: ParticipantListProps) {
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (index: number): string => {
    const colors = [
      COLORS.primary,
      COLORS.accent,
      '#3B82F6',
      '#8B5CF6',
      '#EC4899',
      '#14B8A6',
      '#F97316',
      '#6366F1',
    ];
    return colors[index % colors.length];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Participants ({participants.length})
      </Text>
      <View style={styles.list}>
        {participants.map((participant, index) => (
          <View key={participant.id} style={styles.participantRow}>
            <Avatar.Text
              size={44}
              label={getInitials(participant.name)}
              style={[
                styles.avatar,
                { backgroundColor: getAvatarColor(index) },
              ]}
              labelStyle={styles.avatarLabel}
            />
            <View style={styles.info}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>
                  {participant.name}
                  {participant.id === currentUserId && ' (You)'}
                </Text>
                {participant.isHost && (
                  <View style={styles.hostBadge}>
                    <MaterialCommunityIcons
                      name="crown"
                      size={14}
                      color={COLORS.accent}
                    />
                    <Text style={styles.hostText}>Host</Text>
                  </View>
                )}
              </View>
              {participant.hasSubmittedPreferences && (
                <View style={styles.readyBadge}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={14}
                    color={COLORS.primary}
                  />
                  <Text style={styles.readyText}>Ready</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  list: {
    gap: SPACING.md,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.md,
  },
  avatar: {
    backgroundColor: COLORS.primary,
  },
  avatarLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  name: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  hostBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: `${COLORS.accent}20`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.round,
  },
  hostText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.accent,
    fontWeight: '600',
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
  },
  readyText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
  },
});
