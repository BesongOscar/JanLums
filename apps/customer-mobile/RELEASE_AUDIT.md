# JanLums Customer Mobile — Release Asset Audit

## 1. App Identity

| Item              | Value                  | Status |
|-------------------|------------------------|--------|
| Display Name      | JanLums                | ✅     |
| Slug              | janlums-customer       | ✅     |
| Scheme            | janlums                | ✅     |
| iOS Bundle ID     | com.janlums.customer   | ✅     |
| Android Package   | com.janlums.customer   | ✅     |
| Version           | 1.0.0                  | ✅     |
| UI Style          | light only             | ⚠️ Dark mode not supported |

## 2. App Icon Assets

| Asset                   | Path                                      | Status |
|-------------------------|-------------------------------------------|--------|
| App Icon (iOS/Android)  | `./assets/images/icon.png`                | ✅     |
| Adaptive Icon (Android) | `./assets/images/adaptive-icon.png`       | ✅     |
| Splash Screen           | `./assets/images/splash.png`              | ✅     |
| Favicon (Web)           | `./assets/images/favicon.png`             | ✅     |

## 3. Splash Screen Configuration

| Setting        | Value    | Status |
|----------------|----------|--------|
| Image          | splash   | ✅     |
| Resize Mode    | contain  | ✅     |
| Background     | #0078D4  | ✅     |

## 4. iOS Configuration

| Setting              | Value                                      | Status |
|----------------------|--------------------------------------------|--------|
| Supports Tablet      | true                                       | ✅     |
| Camera Usage Desc    | JanLums needs camera access...             | ✅     |
| Photo Library Desc   | JanLums needs photo library access...      | ✅     |

## 5. Android Configuration

| Setting              | Value                                      | Status |
|----------------------|--------------------------------------------|--------|
| Adaptive Icon BG     | #0078D4                                    | ✅     |
| Permissions          | CAMERA, READ_EXTERNAL_STORAGE              | ✅     |

## 6. EAS Build Configuration

| Profile     | Distribution | AutoIncrement | Notes                     |
|-------------|-------------|---------------|---------------------------|
| development | internal    | ❌ No         | dev client                |
| preview     | internal    | ❌ No         | staging env               |
| production  | app store   | ✅ Yes        | production env            |

## 7. EAS Submit Configuration

| Platform | Issue                                      | Status |
|----------|--------------------------------------------|--------|
| iOS      | `appleId` is placeholder (`your-apple-id`) | ❌     |
| iOS      | `ascAppId` is placeholder (`your-asc-app-id`) | ❌   |
| Android  | `serviceAccountKeyPath` → file missing     | ❌     |

## 8. Environment Files

| File              | Status |
|-------------------|--------|
| .env.development  | ✅     |
| .env.staging      | ✅     |
| .env.production   | ✅     |

## 9. Critical Gaps (Must Fix Before Production Release)

1. **`eas.json` → `submit.production.ios.appleId`**: Replace placeholder with real Apple ID
2. **`eas.json` → `submit.production.ios.ascAppId`**: Replace placeholder with real App Store Connect app ID
3. **`google-service-account.json`**: Create and place at project root for Android Play Store submissions
4. **`extra.eas.projectId` in `app.json`**: Replace placeholder `"your-project-id"` with real EAS Project ID
5. **`extra.sentryDsn` and `extra.posthogKey`**: Both empty — configure before production
