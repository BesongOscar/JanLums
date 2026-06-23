import { View, StyleSheet } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatRelativeTime } from '../../utils/format';
import { getNotificationTypeConfig } from '../../utils/notificationMapper';
import { colors } from '../../config/colors';
import { spacing, borderRadius } from '../../config/spacing';
import { typography } from '../../config/typography';
import { AppNotification } from '../../types';

interface NotificationCardProps {
  notification: AppNotification;
  onPress: () => void;
  onDelete: () => void;
}

export function NotificationCard({ notification, onPress, onDelete }: NotificationCardProps) {
  const typeConfig = getNotificationTypeConfig(notification.type);
  const isUnread = !notification.isRead;
  const timeAgo = formatRelativeTime(notification.createdAt);

  return (
    <TouchableRipple
      onPress={onPress}
      onLongPress={onDelete}
      accessibilityRole="button"
      accessibilityLabel={`${isUnread ? 'Unread' : ''} notification: ${notification.title}. ${notification.message}. ${timeAgo}`}
      accessibilityState={{ selected: isUnread }}
    >
      <View
        style={[
          styles.container,
          isUnread && styles.unreadContainer,
        ]}
      >
        <View
          style={[styles.iconContainer, { backgroundColor: typeConfig.backgroundColor }]}
          accessibilityRole="image"
        >
          <MaterialCommunityIcons
            name={typeConfig.icon}
            size={22}
            color={typeConfig.color}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              style={[styles.title, isUnread && styles.unreadTitle]}
              numberOfLines={1}
            >
              {notification.title}
            </Text>
            <Text style={styles.time}>{timeAgo}</Text>
          </View>

          <Text
            style={styles.message}
            numberOfLines={2}
          >
            {notification.message}
          </Text>
        </View>

        {isUnread && <View style={styles.unreadDot} />}

        <TouchableRipple
          onPress={onDelete}
          style={styles.deleteButton}
          accessibilityRole="button"
          accessibilityLabel={`Delete notification: ${notification.title}`}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialCommunityIcons
            name="close"
            size={18}
            color={colors.text.tertiary}
          />
        </TouchableRipple>
      </View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  unreadContainer: {
    backgroundColor: colors.primary[50],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  content: {
    flex: 1,
    marginRight: spacing[2],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    ...typography['label-lg'],
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing[2],
  },
  unreadTitle: {
    ...typography['heading-sm'],
    color: colors.text.primary,
  },
  time: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  message: {
    ...typography.body,
    color: colors.text.secondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[500],
    marginLeft: spacing[2],
  },
  deleteButton: {
    padding: spacing[1],
    marginLeft: spacing[1],
  },
});
