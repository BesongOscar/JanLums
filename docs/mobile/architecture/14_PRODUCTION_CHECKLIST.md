# 14 — Production Readiness Checklist

**Version:** 2.0.0
**Status:** Active
**Last Updated:** 2026-06-20
**Revisions Applied:** #14 (Production Readiness)

---

## 1. Security Checklist

### Authentication & Authorization

- [ ] All tokens stored in Expo SecureStore (not AsyncStorage)
- [ ] HTTPS enforced in production (no HTTP fallback)
- [ ] 401 responses clear token and redirect to login
- [ ] No sensitive data in console.log statements
- [ ] No hardcoded secrets in source code
- [ ] Environment variables not committed to git
- [ ] Password validation enforced (min 8 chars, uppercase, number)
- [ ] Rate limiting awareness (handle 429 responses)
- [ ] Biometric auth ready (future implementation)

### Data Protection

- [ ] No customer data in URL parameters
- [ ] No sensitive data in deep links
- [ ] No screenshots on sensitive screens (optional)
- [ ] App data cleared on logout
- [ ] SecureStore cleared on logout
- [ ] AsyncStorage cleared on logout (non-sensitive only)
- [ ] No PII in error reports (Sentry)
- [ ] No PII in analytics events

### API Security

- [ ] JWT token attached to all authenticated requests
- [ ] TenantId from JWT, not user input
- [ ] Customer can only view own orders (backend filter)
- [ ] QR codes validated for ownership
- [ ] Input validation on all forms (Zod)
- [ ] No SQL injection possible (TypeORM parameterized)
- [ ] No XSS possible (React auto-escapes)

---

## 2. Performance Checklist

### App Startup

- [ ] Cold start < 2 seconds
- [ ] Token check on startup (fast path)
- [ ] Splash screen while loading
- [ ] Lazy load non-critical modules
- [ ] Minimize bundle size

### Rendering

- [ ] FlatList for all lists (not ScrollView)
- [ ] Proper `keyExtractor` on all lists
- [ ] `getItemLayout` for fixed-height items
- [ ] `windowSize` prop on FlatList (5-10)
- [ ] `removeClippedSubviews` on large lists
- [ ] Image caching (expo-image or FastImage)
- [ ] No unnecessary re-renders (memo, useMemo, useCallback)

### Network

- [ ] Request timeout configured (30s)
- [ ] React Query staleTime configured
- [ ] Cache-first for static data (services, branches)
- [ ] No duplicate API calls
- [ ] Pagination for large lists
- [ ] Debounced search input

### Memory

- [ ] No memory leaks (useEffect cleanup)
- [ ] Subscription cleanup on unmount
- [ ] Timer cleanup on unmount
- [ ] Large image compression before upload

---

## 3. Accessibility Checklist

### Visual

- [ ] Color contrast ratio ≥ 4.5:1 (text)
- [ ] Color contrast ratio ≥ 3:1 (large text)
- [ ] Touch targets ≥ 44x44 points
- [ ] No color-only information (use icons/text too)
- [ ] Support for system font size
- [ ] Dark mode support (future)

### Screen Reader

- [ ] `accessibilityLabel` on all interactive elements
- [ ] `accessibilityHint` on complex actions
- [ ] `accessibilityRole` on custom components
- [ ] `accessibilityState` for disabled/selected states
- [ ] Logical reading order
- [ ] No orphaned buttons/links

### Input

- [ ] Form labels associated with inputs
- [ ] Error messages linked to inputs
- [ ] Required fields indicated
- [ ] Keyboard types match input type
- [ ] Return key type matches action
- [ ] Auto-capitalize appropriate

---

## 4. Deployment Checklist

### Pre-Deployment

- [ ] All environment variables configured
- [ ] API URL points to production
- [ ] Sentry DSN configured
- [ ] Analytics configured
- [ ] App icon (1024x1024)
- [ ] Splash screen (1284x2778)
- [ ] Adaptive icon (Android)
- [ ] Screenshots for store listing
- [ ] App description written
- [ ] Privacy policy URL
- [ ] Terms of service URL

### EAS Build

- [ ] `eas.json` configured
- [ ] Build profiles defined (development, preview, production)
- [ ] iOS provisioning profile configured
- [ ] Android keystore configured
- [ ] Build number incremented
- [ ] Version number updated

### Store Submission

- [ ] App Store (iOS) submission
- [ ] Play Store (Android) submission
- [ ] Store listing complete
- [ ] Screenshots uploaded (6.5", 5.5" iPhone, tablet)
- [ ] App preview video (optional)
- [ ] Content rating submitted
- [ ] Privacy policy linked
- [ ] Support URL provided

### Post-Deployment

- [ ] OTA update channel configured
- [ ] Crash reporting active
- [ ] Analytics tracking active
- [ ] Push notification service configured (future)
- [ ] Monitoring alerts configured

---

## 5. Testing Checklist

### Unit Tests

- [ ] Auth store logic
- [ ] Order draft store logic
- [ ] Status mapper functions
- [ ] Validation schemas
- [ ] Utility functions (format, date, etc.)

### Component Tests

- [ ] Button component
- [ ] Input component
- [ ] Card component
- [ ] Status badge
- [ ] Order card
- [ ] Service card

### Integration Tests

- [ ] Login flow
- [ ] Registration flow
- [ ] Order creation flow
- [ ] Order tracking flow
- [ ] Profile update flow

### E2E Tests (Detox)

- [ ] Complete order flow (happy path)
- [ ] Login → Create order → Track → Confirm
- [ ] Error handling (network error, 401, 404)
- [ ] Offline behavior

### Manual Testing

- [ ] iOS (iPhone 12+, iOS 15+)
- [ ] Android (Pixel 6+, Android 10+)
- [ ] Slow network (3G)
- [ ] No network (offline)
- [ ] Low memory device
- [ ] Large font size (accessibility)
- [ ] Landscape orientation (should be locked to portrait)

---

## 6. Code Quality Checklist

### Linting & Formatting

- [ ] ESLint passes with no errors
- [ ] Prettier formatting applied
- [ ] No `any` types (TypeScript strict)
- [ ] No unused imports
- [ ] No console.log in production

### TypeScript

- [ ] All props typed
- [ ] All API responses typed
- [ ] All store states typed
- [ ] No type assertions (`as`) without justification
- [ ] Strict mode enabled

### Git

- [ ] No secrets in git history
- [ ] .gitignore includes .env files
- [ ] .gitignore includes node_modules
- [ ] .gitignore includes .expo
- [ ] Commit messages follow convention

---

## 7. Monitoring Checklist

### Error Tracking

- [ ] Sentry initialized
- [ ] Source maps uploaded
- [ ] Release tracking configured
- [ ] User context attached (non-PII)
- [ ] Breadcrumb logging active

### Analytics

- [ ] PostHog initialized (or similar)
- [ ] Key events tracked:
  - [ ] App open
  - [ ] Login success/failure
  - [ ] Registration success/failure
  - [ ] Order created
  - [ ] Order viewed
  - [ ] QR scanned
  - [ ] Screen viewed
- [ ] No PII in events
- [ ] Session tracking active

### Performance Monitoring

- [ ] App startup time tracked
- [ ] API response times tracked
- [ ] Crash rate monitored
- [ ] ANR rate monitored (Android)

---

## 8. Rollback Plan

| Scenario | Action |
|----------|--------|
| Critical bug in production | Revert to previous EAS build |
| API breaking change | Pin to previous API version |
| Data corruption | Restore from backup |
| Security breach | Rotate JWT secret, force logout all users |

---

## 9. Support Channels

| Channel | Purpose |
|---------|---------|
| In-app feedback | Bug reports, feature requests |
| Email support | Account issues |
| WhatsApp | Quick support (Cameroon market) |
| Phone | Urgent issues |
