import { ViewStyle, TextStyle } from 'react-native';

export const createStyles = (isDark: boolean) => {
  const bgColor = isDark ? '#0f172a' : '#f5f7fa';
  const elementColor = isDark ? '#1e293b' : '#e8ecf1';
  const textColor = isDark ? '#f0f4f8' : '#1a1a2e';
  const accentColor = isDark ? '#818cf8' : '#6366f1';
  const secondaryColor = isDark ? '#94a3b8' : '#9ca3af';

  return {
    container: {
      flex: 1,
      backgroundColor: bgColor,
    } as ViewStyle,

    safeArea: {
      flex: 1,
      backgroundColor: bgColor,
    } as ViewStyle,

    scroll: {
      flex: 1,
    } as ViewStyle,

    scrollContent: {
      padding: 16,
      gap: 12,
    } as ViewStyle,

    header: {
      fontSize: 20,
      fontWeight: '700',
      color: textColor,
      marginBottom: 12,
    } as TextStyle,

    subheader: {
      fontSize: 18,
      fontWeight: '600',
      color: textColor,
    } as TextStyle,

    label: {
      fontSize: 14,
      fontWeight: '500',
      color: textColor,
      marginBottom: 4,
    } as TextStyle,

    button: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: accentColor,
    } as ViewStyle,

    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    } as TextStyle,

    secondaryButton: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: elementColor,
    } as ViewStyle,

    secondaryButtonText: {
      color: textColor,
      fontSize: 16,
      fontWeight: '600',
    } as TextStyle,

    input: {
      backgroundColor: elementColor,
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingVertical: 12,
      color: textColor,
      fontSize: 14,
      borderWidth: 2,
      borderColor: accentColor,
    } as ViewStyle,

    inputDisabled: {
      backgroundColor: elementColor,
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingVertical: 12,
      color: textColor,
      fontSize: 14,
      borderWidth: 2,
      borderColor: elementColor,
      opacity: 0.6,
    } as ViewStyle,

    card: {
      backgroundColor: elementColor,
      borderRadius: 8,
      padding: 12,
      borderLeftWidth: 4,
      borderLeftColor: accentColor,
    } as ViewStyle,

    row: {
      flexDirection: 'row',
      gap: 8,
    } as ViewStyle,

    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    } as ViewStyle,

    text: {
      color: textColor,
    } as TextStyle,

    secondaryText: {
      color: secondaryColor,
    } as TextStyle,

    accentText: {
      color: accentColor,
    } as TextStyle,

    smallText: {
      fontSize: 12,
      color: secondaryColor,
    } as TextStyle,

    mediumText: {
      fontSize: 14,
      color: textColor,
    } as TextStyle,

    boldText: {
      fontWeight: '600',
    } as TextStyle,

    errorBox: {
      backgroundColor: '#fee2e2',
      padding: 12,
      borderRadius: 6,
    } as ViewStyle,

    errorText: {
      color: '#dc2626',
      fontSize: 14,
    } as TextStyle,

    successBox: {
      backgroundColor: '#dcfce7',
      padding: 12,
      borderRadius: 6,
    } as ViewStyle,

    successText: {
      color: '#166534',
      fontSize: 14,
      fontWeight: '600',
    } as TextStyle,
  };
};
