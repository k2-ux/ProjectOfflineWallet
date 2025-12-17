import { StyleSheet } from 'react-native';

/* ---------- Colors ---------- */
export const colors = {
  primary: '#0b53c7ff',
  background: '#b8e8e49b',
  card: '#000000ff',
  textPrimary: '#0F172A',
  textMuted: '#64748B',
  success: '#16A34A',
  error: '#DC2626',
  border: '#E2E8F0',
};
/* ---------- Fonts ---------- */

export const fonts = {
  regular: 'SourceSans3-Regular',
  medium: 'SourceSans3-Medium',
  bold: 'SourceSans3-Bold',
  italic: 'SourceSans3-Italic',
};

/* ---------- Typography ---------- */
export const typography = {
  // Screen titles
  h1: {
    fontFamily: fonts.bold,
    fontSize: 20,
    letterSpacing: 0.2,
    color: '#0F172A',
  },

  // Column headers / labels
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    letterSpacing: 0.5,
    color: '#64748B',
  },

  // Normal body text
  body: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: '#0F172A',
  },

  // Amounts / important numbers
  amount: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: '#0F172A',
  },

  // Metadata (time, hints)
  meta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#64748B',
  },

  // Button text
  button: {
    fontFamily: fonts.bold,
    fontSize: 15,
    letterSpacing: 0.3,
    color: '#FFFFFF',
  },

  // Optional italic text (notes, subtle emphasis)
  italic: {
    fontFamily: fonts.italic,
    fontSize: 13,
    color: '#64748B',
  },
};

/* ---------- Common Layout ---------- */
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  title: {
    marginBottom: 8,
  },
  rowText: {
    ...typography.body,
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 10,
    marginTop: 6,
    marginBottom: 8,
  },
});

/* ---------- Buttons ---------- */
export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

/* ---------- Table / List ---------- */
export const tableStyles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 4,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#748193ff',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#83898f84',
    backgroundColor: 'white',
    paddingHorizontal: 8,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
  },
});

/* ---------- Status Badges ---------- */
export const badgeStyles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  success: {
    backgroundColor: '#DCFCE7',
  },
  pending: {
    backgroundColor: '#FEF3C7',
  },
  failed: {
    backgroundColor: '#FEE2E2',
  },
  textSuccess: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '600',
  },
  textPending: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '600',
  },
  textFailed: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: '600',
  },
});

/* ---------- Device Info ---------- */
export const deviceInfoStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  label: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
    fontFamily: fonts.regular,
  },
  value: {
    fontSize: 14,

    color: '#0F172A',
    marginBottom: 6,
    fontFamily: fonts.bold,
  },
});
export const modalStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(16, 16, 16, 0.38)',
    justifyContent: 'center',
    padding: 16,
  },

  modalContainer: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
});
