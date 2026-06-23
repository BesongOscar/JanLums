# JanLums Customer Mobile — E2E Test Plan

## 1. Authentication

### TC-AUTH-01: Successful Login
- **Precondition**: Registered user exists, app is online
- **Steps**: 1. Launch app 2. Enter valid email/password 3. Tap "Log In"
- **Expected**: Navigate to Home screen, session persisted
- **Failure path**: Invalid credentials → error message "Invalid email or password"

### TC-AUTH-02: Login with Network Error
- **Precondition**: Device is offline
- **Steps**: 1. Launch app 2. Enter valid credentials 3. Tap "Log In"
- **Expected**: Alert "No Internet Connection. You need an internet connection to log in."
- **Outcome**: No API call made, user stays on login screen

### TC-AUTH-03: Successful Registration
- **Precondition**: App online, email not registered
- **Steps**: 1. Tap "Sign Up" 2. Fill all fields 3. Tap "Create Account"
- **Expected**: Navigate to Home screen, session persisted

### TC-AUTH-04: Registration Validation
- **Precondition**: App online
- **Steps**: 1. Tap "Sign Up" 2. Submit with invalid email, short password
- **Expected**: Field-level validation errors displayed

### TC-AUTH-05: Logout
- **Precondition**: Authenticated session active
- **Steps**: 1. Navigate to Account tab 2. Tap "Log Out" 3. Confirm
- **Expected**: Tokens cleared, navigated to login screen
- **Failure path**: (none — local operation)

### TC-AUTH-06: Session Restoration
- **Precondition**: Valid tokens in SecureStore
- **Steps**: 1. Kill app 2. Re-launch
- **Expected**: Skip login, land on Home screen

## 2. Order Creation

### TC-ORDER-01: Create Full Order (Happy Path)
- **Precondition**: Authenticated, app online, at least one branch and service exist
- **Steps**: 1. Home → "New Order" 2. Select services with quantities 3. Select branch 4. Add notes 5. Tap "Submit Order" 6. Confirm
- **Expected**: Order created, navigate to success screen with order ID
- **Post-condition**: Draft cleared

### TC-ORDER-02: Create Order Offline
- **Precondition**: Device offline
- **Steps**: Follow TC-ORDER-01
- **Expected**: On "Confirm" → Alert "No Internet Connection. You need an internet connection to submit your order."

### TC-ORDER-03: Empty Draft Submission
- **Precondition**: No services selected
- **Steps**: Navigate to Review screen
- **Expected**: "Your order is empty" empty state shown, Submit button disabled

### TC-ORDER-04: Service Quantity Management
- **Precondition**: At least one service added
- **Steps**: 1. On Review, tap + / - buttons 2. Try to go below 1
- **Expected**: Quantity changes, minimum 1 enforced, minus disabled at 1

### TC-ORDER-05: Order Submission API Failure
- **Precondition**: API returns 500 on POST /orders
- **Steps**: Complete order flow, tap Confirm
- **Expected**: Error message "Server error. Please try again later."

## 3. Order Tracking

### TC-TRACK-01: View Active Orders
- **Precondition**: Authenticated, has active orders
- **Steps**: 1. Navigate to Track tab
- **Expected**: Active orders listed with status badges, relative time

### TC-TRACK-02: View Order Detail
- **Precondition**: Active orders exist
- **Steps**: Tap an order card on Track screen
- **Expected**: Navigate to Order Detail screen with timeline, pricing, items

### TC-TRACK-03: Empty Track Screen
- **Precondition**: No active orders
- **Steps**: Navigate to Track tab
- **Expected**: "No active orders" empty state with "View Order History" button

### TC-TRACK-04: Pull to Refresh
- **Precondition**: Track screen loaded
- **Steps**: Pull down to refresh
- **Expected**: Orders refreshed, loading indicator shown

## 4. QR Scanning

### TC-QR-01: Successful QR Scan (Happy Path)
- **Precondition**: Camera permission granted, valid order QR code available
- **Steps**: 1. Navigate to Scan tab 2. Point camera at QR code
- **Expected**: QR scanned → order resolved → navigated to Order Detail

### TC-QR-02: Camera Permission Denied
- **Precondition**: Camera permission denied
- **Steps**: Navigate to Scan tab
- **Expected**: "Camera Access Required" screen with "Grant Access" or "Open Settings" button

### TC-QR-03: Invalid QR Code
- **Precondition**: Camera permission granted
- **Steps**: 1. Scan a non-order QR code
- **Expected**: Error message "Invalid QR code" with "Scan Again" button

### TC-QR-04: Manual Code Entry
- **Precondition**: Scan screen loaded
- **Steps**: 1. Tap "Enter Order Code Manually" 2. Type order code 3. Tap Lookup
- **Expected**: Order code submitted, order resolved

## 5. Notifications

### TC-NOTIF-01: Notification List Loads
- **Precondition**: Authenticated, notifications exist
- **Steps**: 1. Navigate to Account → Notifications card 2. Notification screen opens
- **Expected**: Notifications listed with type icons, timestamps, read/unread styling

### TC-NOTIF-02: Mark Notification as Read
- **Precondition**: Unread notification exists
- **Steps**: Tap a notification
- **Expected**: Background changes from unread to read, API call made

### TC-NOTIF-03: Mark All Read
- **Precondition**: Multiple unread notifications exist
- **Steps**: 1. Tap "Mark all read" 2. Confirm dialog
- **Expected**: All notifications marked read, badge count cleared

### TC-NOTIF-04: Delete Notification
- **Precondition**: At least one notification exists
- **Steps**: Swipe or tap delete on a notification
- **Expected**: Notification removed from list

### TC-NOTIF-05: Delete All
- **Precondition**: At least one notification exists
- **Steps**: 1. Tap "Delete all" 2. Confirm destructive dialog
- **Expected**: All notifications removed

### TC-NOTIF-06: Notification Opens Order
- **Precondition**: Notification with orderId exists
- **Steps**: Tap notification
- **Expected**: Navigated to Order Detail for that order

## 6. Profile Updates

### TC-PROF-01: View Profile
- **Precondition**: Authenticated
- **Steps**: 1. Navigate to Account tab
- **Expected**: Profile data displayed (name, email, phone, address, city)

### TC-PROF-02: Edit Profile (Happy Path)
- **Precondition**: Authenticated, online
- **Steps**: 1. Tap "Edit Profile" 2. Change fields 3. Tap "Save Changes"
- **Expected**: Success snackbar, navigate back, updated data displayed

### TC-PROF-03: Edit Profile Validation
- **Precondition**: Edit Profile screen open
- **Steps**: 1. Clear required fields 2. Tap Save
- **Expected**: Field-level validation errors shown

### TC-PROF-04: Edit Profile Network Failure
- **Precondition**: Device offline
- **Steps**: 1. Edit fields 2. Tap Save
- **Expected**: Alert: "You need an internet connection to update your profile"

## 7. Logout

### TC-LOGOUT-01: Logout from Settings
- **Precondition**: Authenticated
- **Steps**: 1. Account → Settings 2. Tap "Log Out" 3. Confirm dialog
- **Expected**: Tokens cleared, redirect to login

### TC-LOGOUT-02: Logout from Account
- **Precondition**: Authenticated
- **Steps**: 1. Account tab 2. Tap "Log Out" 3. Confirm
- **Expected**: Tokens cleared, redirect to login

## 8. Onboarding

### TC-ONB-01: First Launch
- **Precondition**: Fresh install, no tokens
- **Steps**: Launch app
- **Expected**: Onboarding screen shown with 3 slides

### TC-ONB-02: Complete Onboarding
- **Precondition**: Onboarding shown
- **Steps**: Tap through all 3 slides → "Get Started"
- **Expected**: Onboarding complete, navigate to login, never shown again

### TC-ONB-03: Skip Onboarding
- **Precondition**: Onboarding shown
- **Steps**: Tap "Skip"
- **Expected**: Onboarding complete, navigate to login

## 9. Offline Behavior

### TC-OFF-01: Offline Banner Appears
- **Precondition**: App in foreground
- **Steps**: Enable Airplane Mode
- **Expected**: "No Internet Connection" banner slides down from top

### TC-OFF-02: Offline Banner Disappears
- **Precondition**: Offline banner visible
- **Steps**: Disable Airplane Mode
- **Expected**: Banner slides up and disappears

### TC-OFF-03: Mutation Guard
- **Precondition**: Device offline
- **Steps**: Try any mutation (login, order submit, profile update, delete notification)
- **Expected**: Alert blocks the action, no API call made

## 10. Off-Script Checks

- App responsiveness under slow network (throttle to 3G)
- Rotate device — layout should not break
- Deep links — `janlums://orders/:id` should navigate to order detail
- Push notification tap — should open relevant screen
- Background/foreground cycle — session preserved
- Error boundary — force crash in dev, should show "Something went wrong" screen
