import { AppItem } from '../types';

export const INITIAL_APPS: AppItem[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    packageName: 'com.whatsapp',
    category: 'messaging',
    iconName: 'MessageSquare',
    accentColor: '#25D366',
    isLocked: true,
    description: 'Chats, media, and voice calls with end-to-end encryption',
    simulatedData: {
      subtitle: 'Active Chats & Calls',
      details: [
        'Family Group: "Dinner is at 7:30 PM tonight!" (10m ago)',
        'Alex Miller: Sent 3 media photos (25m ago)',
        'Project Alpha: "Check the design specs attached" (1h ago)',
        'Banking Bot: "OTP is 492041 for transaction..." (2h ago)'
      ]
    }
  },
  {
    id: 'gpay',
    name: 'Google Pay & Banking',
    packageName: 'com.google.android.apps.walletnfcrel',
    category: 'finance',
    iconName: 'CreditCard',
    accentColor: '#1A73E8',
    isLocked: true,
    description: 'Bank accounts, UPI transactions, credit cards, and cash balances',
    simulatedData: {
      subtitle: 'Primary Checking: $8,420.50',
      details: [
        'Recent Transfer: -$45.00 (Blue Bottle Coffee)',
        'Salary Deposit: +$3,850.00 (Direct Deposit)',
        'Electric Bill Auto-Pay: -$112.40 (Utility Co)',
        'Virtual Visa Card: Active •••• 9104'
      ]
    }
  },
  {
    id: 'gallery',
    name: 'Google Photos & Gallery',
    packageName: 'com.google.android.apps.photos',
    category: 'gallery',
    iconName: 'Image',
    accentColor: '#EA4335',
    isLocked: true,
    description: 'Camera roll, private locked folder, family albums, and screenshots',
    simulatedData: {
      subtitle: '1,420 Photos • 88 Videos • Locked Folder',
      details: [
        'Locked Folder: 18 confidential documents & IDs',
        'Recent Album: Summer Roadtrip 2026 (124 items)',
        'Camera Roll: 14 new high-res portraits',
        'Cloud Backup: Synced with Google Drive'
      ]
    }
  },
  {
    id: 'crypto',
    name: 'Crypto & Web3 Wallet',
    packageName: 'io.metamask',
    category: 'crypto',
    iconName: 'Coins',
    accentColor: '#F6851B',
    isLocked: true,
    description: 'Private keys, hardware wallet bridge, and decentralized token balances',
    simulatedData: {
      subtitle: 'Portfolio Value: $14,890.30',
      details: [
        'Ethereum (ETH): 4.15 ETH ($10,250.00)',
        'Bitcoin (BTC): 0.082 BTC ($4,640.30)',
        'Seed Phrase Vault: Hardware encrypted',
        'Recent Swap: 0.5 ETH -> USDC'
      ]
    }
  },
  {
    id: 'instagram',
    name: 'Instagram',
    packageName: 'com.instagram.android',
    category: 'social',
    iconName: 'Instagram',
    accentColor: '#E1306C',
    isLocked: false,
    description: 'Direct messages, close friends stories, and saved collections',
    simulatedData: {
      subtitle: '3 Unread Direct Messages',
      details: [
        'sarah_design: "Did you see the new mockups?"',
        'mike_dev: Reacted ❤️ to your story',
        'Archived Posts: 42 private memories',
        'Saved audio & inspiration boards'
      ]
    }
  },
  {
    id: 'gmail',
    name: 'Gmail & Work Mail',
    packageName: 'com.google.android.gm',
    category: 'messaging',
    iconName: 'Mail',
    accentColor: '#D93025',
    isLocked: false,
    description: 'Work inbox, personal receipts, tax filings, and 2FA recovery codes',
    simulatedData: {
      subtitle: 'Primary Inbox (12 new)',
      details: [
        'Google Security: "New sign-in on Android device"',
        'IRS / Tax Authority: "Your 2025 Statement is ready"',
        'Flight Confirmation: Flight DL402 to SFO',
        'Payroll Notification: Payslip generated'
      ]
    }
  },
  {
    id: 'notes',
    name: 'Secure Notes & Keep',
    packageName: 'com.google.android.keep',
    category: 'system',
    iconName: 'FileText',
    accentColor: '#FBBC04',
    isLocked: false,
    description: 'Encrypted notes, passport numbers, Wi-Fi passwords, and reminders',
    simulatedData: {
      subtitle: 'Pinned Protected Notes',
      details: [
        'Safe Code: 9402 - Master bedroom box',
        'Passport & Visa numbers (US & EU)',
        'Investment account recovery hints',
        'Health insurance policy ID'
      ]
    }
  },
  {
    id: 'settings',
    name: 'Android Settings',
    packageName: 'com.android.settings',
    category: 'system',
    iconName: 'Settings',
    accentColor: '#5F6368',
    isLocked: false,
    description: 'System controls, app uninstallation, network preferences, and security',
    simulatedData: {
      subtitle: 'Android 15 (Material You Core)',
      details: [
        'App Permissions: Prevent uninstallation of AppLock',
        'Biometrics & Passwords: 1 Fingerprint enrolled',
        'Storage: 128 GB (45% used)',
        'Developer Options: USB Debugging enabled'
      ]
    }
  }
];
