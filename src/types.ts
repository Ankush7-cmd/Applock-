export type AppCategory = 'finance' | 'social' | 'gallery' | 'messaging' | 'system' | 'crypto';

export interface AppItem {
  id: string;
  name: string;
  packageName: string;
  category: AppCategory;
  iconName: string;
  accentColor: string;
  isLocked: boolean;
  description: string;
  simulatedData?: {
    subtitle: string;
    details: string[];
  };
  disguiseIcon?: string;
  disguiseName?: string;
  disguiseColor?: string;
}

export type RelockOption = 'immediate' | '1_min' | '5_min' | 'screen_off';

export interface SecuritySettings {
  pin: string;
  pinLength: 4 | 6;
  biometricsEnabled: boolean;
  biometricHardwareAvailable: boolean;
  relockOption: RelockOption;
  scrambleKeypad: boolean;
  vibrationFeedback: boolean;
  fakeCrashCover: boolean;
  fakeCrashTargetApps: string[]; // package names
  intruderSelfie: boolean;
  intruderThreshold: number; // e.g. 3 attempts
  hideNotifications: boolean;
  appDisguise: 'applock' | 'calculator' | 'weather';
  securityQuestion: string;
  securityAnswer: string;
}

export interface IntruderLog {
  id: string;
  timestamp: number;
  appName: string;
  appPackage: string;
  attemptedPin: string;
  failedCount: number;
  photoDataUrl?: string;
  status: 'captured' | 'camera_unavailable' | 'simulated';
}

export interface AndroidPermissions {
  accessibilityService: boolean;
  usageAccess: boolean;
  overlayPermission: boolean;
  biometricPermission: boolean;
  cameraPermission: boolean;
}
