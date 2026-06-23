import { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Linking,
  Platform,
} from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useQrParser } from '../../src/hooks/useQrParser';
import { colors } from '../../src/config/colors';
import { spacing, borderRadius } from '../../src/config/spacing';
import { typography } from '../../src/config/typography';

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [torchEnabled, setTorchEnabled] = useState(false);
  const processingRef = useRef(false);

  const {
    phase,
    error,
    parsedPayload,
    isParsing,
    isLoadingOrder,
    isError,
    isParsed,
    processQrCode,
    resolveOrder,
    reset,
  } = useQrParser();

  const handleBarCodeScanned = useCallback(
    async (result: { data: string }) => {
      if (scanned || processingRef.current) return;
      processingRef.current = true;
      setScanned(true);
      await processQrCode(result.data);
    },
    [scanned, processQrCode]
  );

  useEffect(() => {
    if (isParsed && parsedPayload) {
      resolveOrder().then((result) => {
        if (result === 'success' && parsedPayload.orderId) {
          router.replace(`/orders/${parsedPayload.orderId}` as any);
        }
        processingRef.current = false;
      });
    }
  }, [isParsed, parsedPayload, resolveOrder, router]);

  const handleRescan = useCallback(() => {
    setScanned(false);
    processingRef.current = false;
    reset();
  }, [reset]);

  const handleManualLookup = useCallback(async () => {
    if (!manualCode.trim()) return;
    processingRef.current = true;
    setScanned(true);
    await processQrCode(manualCode.trim());
  }, [manualCode, processQrCode]);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleOpenSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  if (permission === null) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.statusText}>Initializing camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    const isPermanentlyDenied = !permission.canAskAgain;
    return (
      <View style={[styles.container, styles.centerContent, { paddingTop: insets.top }]}>
        <MaterialCommunityIcons
          name="camera-off"
          size={64}
          color={colors.text.tertiary}
        />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          {isPermanentlyDenied
            ? 'Camera access is permanently denied. Please enable it in your device settings.'
            : 'JanLums needs camera access to scan QR codes for order lookup.'}
        </Text>
        {isPermanentlyDenied ? (
          <Button
            mode="contained"
            onPress={handleOpenSettings}
            style={styles.permissionButton}
            buttonColor={colors.primary[500]}
            textColor={colors.white}
          >
            Open Settings
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={requestPermission}
            style={styles.permissionButton}
            buttonColor={colors.primary[500]}
            textColor={colors.white}
          >
            Grant Access
          </Button>
        )}
        <TouchableOpacity
          style={styles.manualEntryToggle}
          onPress={() => setShowManualEntry(true)}
        >
          <Text style={styles.manualEntryLink}>Enter Order Code Manually</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        enableTorch={torchEnabled}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={[styles.overlay, { paddingTop: insets.top }]}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={handleGoBack} style={styles.topBarButton} accessibilityLabel="Close scanner" accessibilityRole="button">
              <MaterialCommunityIcons name="close" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.topBarTitle} accessibilityRole="header">Scan QR Code</Text>
            <TouchableOpacity
              onPress={() => setTorchEnabled((prev) => !prev)}
              style={styles.topBarButton}
              accessibilityLabel={torchEnabled ? 'Disable flash' : 'Enable flash'}
              accessibilityRole="button"
              accessibilityState={{ selected: torchEnabled }}
            >
              <MaterialCommunityIcons
                name={torchEnabled ? 'flashlight' : 'flashlight-off'}
                size={24}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.scanFrameContainer}>
            <View style={styles.scanFrame}>
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={200}
                color="rgba(255,255,255,0.2)"
              />
            </View>
          </View>

          <View style={styles.bottomArea}>
            {(isParsing || isLoadingOrder) && (
              <View style={styles.statusOverlay}>
                <ActivityIndicator size="large" color={colors.white} />
                <Text style={styles.statusText}>
                  {isParsing ? 'Reading QR code...' : 'Loading order...'}
                </Text>
              </View>
            )}

            {isError && error && (
              <View style={styles.errorOverlay}>
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={32}
                  color={colors.error.DEFAULT}
                />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                  style={styles.rescanButton}
                  onPress={handleRescan}
                >
                  <MaterialCommunityIcons
                    name="refresh"
                    size={18}
                    color={colors.white}
                  />
                  <Text style={styles.rescanButtonText}>Scan Again</Text>
                </TouchableOpacity>
              </View>
            )}

            {!isParsing && !isLoadingOrder && !isError && (
              <View style={styles.instructionsArea}>
                <Text style={styles.instructionText}>
                  Point your camera at the QR code on your order tag
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.manualEntryButton}
              onPress={() => setShowManualEntry(true)}
            >
              <MaterialCommunityIcons
                name="keyboard-outline"
                size={18}
                color={colors.primary[500]}
              />
              <Text style={styles.manualEntryText}>Enter Order Code Manually</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>

      <Modal
        visible={showManualEntry}
        transparent
        animationType="slide"
        onRequestClose={() => setShowManualEntry(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Manual Code Entry</Text>
              <TouchableOpacity onPress={() => setShowManualEntry(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colors.text.primary}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Enter your order code to look up your order.
            </Text>

            <TextInput
              style={styles.codeInput}
              placeholder="ORD-XXXXX"
              placeholderTextColor={colors.text.tertiary}
              value={manualCode}
              onChangeText={setManualCode}
              autoCapitalize="characters"
              autoCorrect={false}
            />

            <Button
              mode="contained"
              onPress={handleManualLookup}
              style={styles.lookupButton}
              buttonColor={colors.primary[500]}
              textColor={colors.white}
              disabled={!manualCode.trim() || isParsing}
              loading={isParsing}
            >
              Lookup Order
            </Button>

            <Text style={styles.modalNote}>
              Note: Manual code lookup requires backend support for resolving order
              codes. If lookup fails, please scan the QR code directly.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  topBarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    ...typography['label-lg'],
    color: colors.white,
    fontWeight: '600',
  },
  scanFrameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 240,
    height: 240,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  bottomArea: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[8],
    alignItems: 'center',
  },
  statusOverlay: {
    alignItems: 'center',
    marginBottom: spacing[4],
    gap: spacing[2],
  },
  statusText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
  },
  errorOverlay: {
    alignItems: 'center',
    marginBottom: spacing[4],
    gap: spacing[2],
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    width: '100%',
  },
  errorText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
  },
  rescanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    gap: spacing[2],
    marginTop: spacing[2],
  },
  rescanButtonText: {
    ...typography.button,
    color: colors.white,
  },
  instructionsArea: {
    marginBottom: spacing[4],
    paddingHorizontal: spacing[4],
  },
  instructionText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  manualEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[2],
  },
  manualEntryText: {
    ...typography.button,
    color: colors.primary[500],
  },
  permissionTitle: {
    ...typography.heading,
    color: colors.text.primary,
    marginTop: spacing[4],
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  permissionText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[5],
    lineHeight: 20,
  },
  permissionButton: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[6],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing[6],
    paddingBottom: spacing[10],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  modalTitle: {
    ...typography.heading,
    color: colors.text.primary,
  },
  modalDescription: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing[4],
  },
  codeInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: spacing[4],
  },
  lookupButton: {
    borderRadius: borderRadius.full,
    paddingVertical: spacing[1],
  },
  manualEntryToggle: {
    marginTop: spacing[5],
  },
  manualEntryLink: {
    ...typography.button,
    color: colors.primary[500],
    textAlign: 'center',
  },
  modalNote: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing[3],
    lineHeight: 16,
  },
});
