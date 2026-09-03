import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  ShieldCheck, 
  Smartphone, 
  Sliders, 
  Layers, 
  Camera, 
  KeyRound, 
  Lock, 
  Info,
  ChevronRight
} from 'lucide-react';
import { AppItem, SecuritySettings, IntruderLog, AndroidPermissions } from './types';
import { INITIAL_APPS } from './data/initialApps';
import { AppLockDashboard } from './components/AppLockDashboard';
import { AndroidHomeScreen } from './components/AndroidHomeScreen';
import { AppSimulator } from './components/AppSimulator';
import { LockOverlay } from './components/LockOverlay';
import { SettingsModal } from './components/SettingsModal';
import { IntruderLogModal } from './components/IntruderLogModal';
import { ArchitectureDocModal } from './components/ArchitectureDocModal';
import { AppDisguiseModal } from './components/AppDisguiseModal';

const DEFAULT_SETTINGS: SecuritySettings = {
  pin: '1234',
  pinLength: 4,
  biometricsEnabled: true,
  biometricHardwareAvailable: true,
  relockOption: 'immediate',
  scrambleKeypad: false,
  vibrationFeedback: true,
  fakeCrashCover: false,
  fakeCrashTargetApps: ['com.whatsapp', 'com.google.android.apps.walletnfcrel'],
  intruderSelfie: true,
  intruderThreshold: 3,
  hideNotifications: true,
  appDisguise: 'applock',
  securityQuestion: 'What is your favorite color?',
  securityAnswer: 'Blue',
};

const DEFAULT_PERMISSIONS: AndroidPermissions = {
  accessibilityService: true,
  usageAccess: true,
  overlayPermission: true,
  biometricPermission: true,
  cameraPermission: true,
};

export default function App() {
  // State Initialization from LocalStorage
  const [apps, setApps] = useState<AppItem[]>(() => {
    try {
      const saved = localStorage.getItem('applock_apps');
      return saved ? JSON.parse(saved) : INITIAL_APPS;
    } catch {
      return INITIAL_APPS;
    }
  });

  const [settings, setSettings] = useState<SecuritySettings>(() => {
    try {
      const saved = localStorage.getItem('applock_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [intruderLogs, setIntruderLogs] = useState<IntruderLog[]>(() => {
    try {
      const saved = localStorage.getItem('applock_intruder_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [permissions, setPermissions] = useState<AndroidPermissions>(() => {
    try {
      const saved = localStorage.getItem('applock_permissions');
      return saved ? JSON.parse(saved) : DEFAULT_PERMISSIONS;
    } catch {
      return DEFAULT_PERMISSIONS;
    }
  });

  // Navigation and Interactive State
  const [currentView, setCurrentView] = useState<'dashboard' | 'launcher' | 'running_app'>('dashboard');
  const [activeApp, setActiveApp] = useState<AppItem | null>(null);
  const [isLockOverlayOpen, setIsLockOverlayOpen] = useState<boolean>(false);
  const [appPendingUnlock, setAppPendingUnlock] = useState<AppItem | null>(null);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isIntruderLogsOpen, setIsIntruderLogsOpen] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [disguiseTargetApp, setDisguiseTargetApp] = useState<AppItem | null>(null);
  const [isDisguiseModalOpen, setIsDisguiseModalOpen] = useState<boolean>(false);

  // Active Unlock Sessions (package name -> timestamp)
  const [unlockSessions, setUnlockSessions] = useState<Record<string, number>>({});

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('applock_apps', JSON.stringify(apps));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [apps]);

  useEffect(() => {
    try {
      localStorage.setItem('applock_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('applock_intruder_logs', JSON.stringify(intruderLogs));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [intruderLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('applock_permissions', JSON.stringify(permissions));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [permissions]);

  // Toggle single app lock
  const handleToggleAppLock = (appId: string) => {
    setApps((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, isLocked: !app.isLocked } : app))
    );
  };

  // Lock/Unlock all apps
  const handleLockAll = (lock: boolean) => {
    setApps((prev) => prev.map((app) => ({ ...app, isLocked: lock })));
  };

  // Open App Disguise Modal
  const handleOpenDisguiseModal = (app: AppItem) => {
    setDisguiseTargetApp(app);
    setIsDisguiseModalOpen(true);
  };

  // Save customized display icon / decoy
  const handleSaveAppDisguise = (
    appId: string,
    disguise: { disguiseIcon?: string; disguiseName?: string; disguiseColor?: string }
  ) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              disguiseIcon: disguise.disguiseIcon,
              disguiseName: disguise.disguiseName,
              disguiseColor: disguise.disguiseColor,
            }
          : app
      )
    );
    if (activeApp && activeApp.id === appId) {
      setActiveApp((prev) =>
        prev
          ? {
              ...prev,
              disguiseIcon: disguise.disguiseIcon,
              disguiseName: disguise.disguiseName,
              disguiseColor: disguise.disguiseColor,
            }
          : null
      );
    }
  };

  // App launch interceptor (Logical Flow Step 2 -> 3 -> 4)
  const handleLaunchApp = (app: AppItem) => {
    if (!app.isLocked) {
      // App is not locked, open directly
      setActiveApp(app);
      setCurrentView('running_app');
      return;
    }

    // App is locked - check if active session exists
    const lastUnlocked = unlockSessions[app.packageName];
    if (lastUnlocked) {
      const now = Date.now();
      const diffMinutes = (now - lastUnlocked) / 60000;
      if (settings.relockOption === '1_min' && diffMinutes < 1) {
        setActiveApp(app);
        setCurrentView('running_app');
        return;
      }
      if (settings.relockOption === '5_min' && diffMinutes < 5) {
        setActiveApp(app);
        setCurrentView('running_app');
        return;
      }
    }

    // Intercept: Show Lock Screen Overlay (Step 5)
    setAppPendingUnlock(app);
    setIsLockOverlayOpen(true);
  };

  // Authentication succeeded (Step 6)
  const handleUnlockSuccess = () => {
    if (appPendingUnlock) {
      setUnlockSessions((prev) => ({
        ...prev,
        [appPendingUnlock.packageName]: Date.now()
      }));
      setActiveApp(appPendingUnlock);
      setIsLockOverlayOpen(false);
      setAppPendingUnlock(null);
      setCurrentView('running_app');
    }
  };

  // Authentication canceled
  const handleUnlockCancel = () => {
    setIsLockOverlayOpen(false);
    setAppPendingUnlock(null);
  };

  // Manual relock from inside app
  const handleLockNow = () => {
    if (activeApp) {
      setUnlockSessions((prev) => {
        const next = { ...prev };
        delete next[activeApp.packageName];
        return next;
      });
      setCurrentView('dashboard');
      setActiveApp(null);
    }
  };

  // Intruder caught
  const handleIntruderCaptured = (log: IntruderLog) => {
    setIntruderLogs((prev) => [log, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
      {/* PERSISTENT TOP APP BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-slate-900 tracking-tight">
                  ShieldLock
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  v4.2 Enterprise
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                Biometric & PIN Security Engine
              </span>
            </div>
          </div>

          {/* VIEW TOGGLES & ACTIONS */}
          <div className="flex items-center gap-2">
            <button
              id="header-btn-dashboard"
              onClick={() => {
                setIsLockOverlayOpen(false);
                setCurrentView('dashboard');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                currentView === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Manager</span>
            </button>

            <button
              id="header-btn-launcher"
              onClick={() => {
                setIsLockOverlayOpen(false);
                setCurrentView('launcher');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                currentView === 'launcher'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Phone Simulator</span>
            </button>

            <button
              id="header-btn-architecture"
              onClick={() => setIsArchitectureOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition flex items-center gap-1.5 shadow-sm"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Architecture & Flow</span>
            </button>

            <button
              id="header-btn-settings"
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200 bg-white shadow-sm"
              title="AppLock Settings"
            >
              <KeyRound className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </div>
      </header>

      {/* QUICK SECURITY STATUS HELPER STRIP */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Service Active: Accessibility & Overlay Guard
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-slate-500">
              Default Numeric PIN: <strong className="text-slate-800 font-semibold tracking-wider">1234</strong>
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="hidden md:inline text-slate-500">
              Biometrics: <strong className="text-slate-800 font-semibold">{settings.biometricsEnabled ? 'Active' : 'Disabled'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsIntruderLogsOpen(true)}
              className="text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-medium transition text-[11px]"
            >
              <Camera className="w-3 h-3" />
              <span>Intruders: {intruderLogs.length}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER CONTENT */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {currentView === 'dashboard' && (
          <AppLockDashboard
            apps={apps}
            settings={settings}
            intruderLogs={intruderLogs}
            onToggleAppLock={handleToggleAppLock}
            onLockAll={handleLockAll}
            onLaunchApp={handleLaunchApp}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenIntruderLogs={() => setIsIntruderLogsOpen(true)}
            onOpenArchitecture={() => setIsArchitectureOpen(true)}
            onSwitchToHomeLauncher={() => setCurrentView('launcher')}
            onChangeDisplayIcon={handleOpenDisguiseModal}
          />
        )}

        {currentView === 'launcher' && (
          <div className="py-2">
            <div className="mb-4 text-center">
              <span className="text-xs text-zinc-400">
                Interactive Android 15 Simulator — Tap any locked app icon to test background lock interception
              </span>
            </div>
            <AndroidHomeScreen
              apps={apps}
              settings={settings}
              onLaunchApp={handleLaunchApp}
              onOpenAppLockManager={() => setCurrentView('dashboard')}
            />
          </div>
        )}

        {currentView === 'running_app' && activeApp && (
          <div className="py-2">
            <AppSimulator
              app={activeApp}
              settings={settings}
              onExitApp={() => {
                if (settings.relockOption === 'immediate') {
                  setUnlockSessions((prev) => {
                    const next = { ...prev };
                    delete next[activeApp.packageName];
                    return next;
                  });
                }
                setCurrentView('dashboard');
                setActiveApp(null);
              }}
              onLockNow={handleLockNow}
            />
          </div>
        )}
      </main>

      {/* LOCK SCREEN OVERLAY (Appears when protected app is opened) */}
      <AnimatePresence>
        {isLockOverlayOpen && appPendingUnlock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <LockOverlay
              app={appPendingUnlock}
              settings={settings}
              onSuccess={handleUnlockSuccess}
              onCancel={handleUnlockCancel}
              onIntruderCaptured={handleIntruderCaptured}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* SETTINGS MODAL */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          permissions={permissions}
          apps={apps}
          onSaveSettings={(newSettings) => setSettings(newSettings)}
          onUpdatePermissions={(newPerms) => setPermissions(newPerms)}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* INTRUDER LOGS MODAL */}
      {isIntruderLogsOpen && (
        <IntruderLogModal
          logs={intruderLogs}
          onClearLogs={() => setIntruderLogs([])}
          onAddLog={(newLog) => setIntruderLogs((prev) => [newLog, ...prev])}
          onClose={() => setIsIntruderLogsOpen(false)}
        />
      )}

      {/* ARCHITECTURE & FLOW MODAL */}
      {isArchitectureOpen && (
        <ArchitectureDocModal onClose={() => setIsArchitectureOpen(false)} />
      )}

      {/* APP DISGUISE MODAL */}
      <AppDisguiseModal
        app={disguiseTargetApp}
        isOpen={isDisguiseModalOpen}
        onClose={() => {
          setIsDisguiseModalOpen(false);
          setDisguiseTargetApp(null);
        }}
        onSaveDisguise={handleSaveAppDisguise}
      />
    </div>
  );
}
