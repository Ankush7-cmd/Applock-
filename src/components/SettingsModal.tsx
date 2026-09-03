import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  Fingerprint, 
  Clock, 
  Camera, 
  ShieldAlert, 
  Vibrate, 
  HelpCircle, 
  Check, 
  AlertCircle,
  EyeOff,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { SecuritySettings, RelockOption, AndroidPermissions, AppItem } from '../types';
import { vibrateDevice } from '../services/biometricService';

interface SettingsModalProps {
  settings: SecuritySettings;
  permissions: AndroidPermissions;
  apps: AppItem[];
  onSaveSettings: (newSettings: SecuritySettings) => void;
  onUpdatePermissions: (newPerms: AndroidPermissions) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  permissions,
  apps,
  onSaveSettings,
  onUpdatePermissions,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'security' | 'permissions' | 'disguise'>('security');
  const [currentSettings, setCurrentSettings] = useState<SecuritySettings>({ ...settings });
  
  // PIN change states
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [oldPinInput, setOldPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeError, setPinChangeError] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  const handleToggleBiometrics = () => {
    setCurrentSettings((prev) => ({
      ...prev,
      biometricsEnabled: !prev.biometricsEnabled
    }));
  };

  const handleRelockChange = (option: RelockOption) => {
    setCurrentSettings((prev) => ({ ...prev, relockOption: option }));
  };

  const handleApplyPinChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeError('');

    if (oldPinInput !== currentSettings.pin) {
      setPinChangeError('Current PIN does not match.');
      vibrateDevice([50, 50, 50]);
      return;
    }

    if (newPinInput.length !== currentSettings.pinLength) {
      setPinChangeError(`New PIN must be exactly ${currentSettings.pinLength} digits.`);
      return;
    }

    if (!/^\d+$/.test(newPinInput)) {
      setPinChangeError('PIN must contain numeric digits only.');
      return;
    }

    if (newPinInput !== confirmPinInput) {
      setPinChangeError('New PINs do not match.');
      return;
    }

    // Success
    setCurrentSettings((prev) => ({ ...prev, pin: newPinInput }));
    setPinChangeSuccess(true);
    vibrateDevice([30, 40, 50]);
    setTimeout(() => {
      setIsChangingPin(false);
      setPinChangeSuccess(false);
      setOldPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
    }, 1200);
  };

  const handleSaveAll = () => {
    onSaveSettings(currentSettings);
    onClose();
  };

  const toggleFakeCrashApp = (pkg: string) => {
    setCurrentSettings((prev) => {
      const exists = prev.fakeCrashTargetApps.includes(pkg);
      const next = exists
        ? prev.fakeCrashTargetApps.filter((p) => p !== pkg)
        : [...prev.fakeCrashTargetApps, pkg];
      return { ...prev, fakeCrashTargetApps: next };
    });
  };

  return (
    <div 
      id="settings-modal-overlay" 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 sm:p-4 backdrop-blur-xs"
    >
      <div 
        id="settings-modal-card" 
        className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-indigo-600" />
              <span>AppLock Security Settings</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Configure authentication, biometrics & stealth features</p>
          </div>
          <button 
            id="btn-close-settings-x"
            onClick={onClose} 
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS */}
        <div className="flex border-b border-slate-200 px-6 pt-2 gap-4 text-xs font-medium">
          <button
            id="tab-security-settings"
            onClick={() => setActiveTab('security')}
            className={`pb-2.5 transition border-b-2 ${
              activeTab === 'security'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Security & PIN
          </button>
          <button
            id="tab-permissions"
            onClick={() => setActiveTab('permissions')}
            className={`pb-2.5 transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'permissions'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Android Permissions</span>
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
          </button>
          <button
            id="tab-disguise"
            onClick={() => setActiveTab('disguise')}
            className={`pb-2.5 transition border-b-2 ${
              activeTab === 'disguise'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Stealth & Disguise
          </button>
        </div>

        {/* MODAL CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-600">
          {activeTab === 'security' && (
            <>
              {/* PIN MANAGEMENT */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Numeric PIN</h3>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Currently active: {currentSettings.pinLength}-digit PIN ({currentSettings.pin.replace(/./g, '•')})
                    </p>
                  </div>
                  <button
                    id="btn-open-pin-change"
                    onClick={() => setIsChangingPin(!isChangingPin)}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs transition shadow-2xs"
                  >
                    {isChangingPin ? 'Cancel' : 'Change PIN'}
                  </button>
                </div>

                {isChangingPin && (
                  <form onSubmit={handleApplyPinChange} className="pt-3 border-t border-slate-200 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">PIN Length:</span>
                      <button
                        type="button"
                        onClick={() => setCurrentSettings(s => ({ ...s, pinLength: 4 }))}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                          currentSettings.pinLength === 4
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-600'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        4 Digits
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentSettings(s => ({ ...s, pinLength: 6 }))}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                          currentSettings.pinLength === 6
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-600'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        6 Digits
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-1">Old PIN</label>
                        <input
                          type="password"
                          maxLength={currentSettings.pinLength}
                          value={oldPinInput}
                          onChange={(e) => setOldPinInput(e.target.value)}
                          placeholder="Current PIN"
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 shadow-2xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-1">New PIN</label>
                        <input
                          type="password"
                          maxLength={currentSettings.pinLength}
                          value={newPinInput}
                          onChange={(e) => setNewPinInput(e.target.value)}
                          placeholder={`${currentSettings.pinLength} digits`}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 shadow-2xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 block mb-1">Confirm</label>
                        <input
                          type="password"
                          maxLength={currentSettings.pinLength}
                          value={confirmPinInput}
                          onChange={(e) => setConfirmPinInput(e.target.value)}
                          placeholder="Confirm"
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 shadow-2xs"
                        />
                      </div>
                    </div>

                    {pinChangeError && (
                      <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {pinChangeError}
                      </p>
                    )}
                    {pinChangeSuccess && (
                      <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                        <Check className="w-3.5 h-3.5" />
                        PIN changed successfully!
                      </p>
                    )}

                    <button
                      type="submit"
                      id="btn-confirm-pin-change"
                      className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-xs"
                    >
                      Update PIN
                    </button>
                  </form>
                )}
              </div>

              {/* BIOMETRICS SWITCH */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Biometric Unlock</h3>
                    <p className="text-[11px] text-slate-500">Fingerprint, Face Recognition & WebAuthn</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentSettings.biometricsEnabled}
                    onChange={handleToggleBiometrics}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* RELOCK TIMEOUT */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-800">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold">Auto-Relock Policy</h3>
                </div>
                <p className="text-[11px] text-slate-500">
                  Controls how quickly protected apps relock after switching tasks or turning screen off
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {[
                    { id: 'immediate', label: 'Immediately' },
                    { id: '1_min', label: 'After 1 min' },
                    { id: '5_min', label: 'After 5 min' },
                    { id: 'screen_off', label: 'Screen off' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleRelockChange(opt.id as RelockOption)}
                      className={`p-2 rounded-xl text-xs font-semibold border text-center transition ${
                        currentSettings.relockOption === opt.id
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-600'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* TOGGLES: SCRAMBLE KEYPAD & HAPTIC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Scramble Keypad</h4>
                    <p className="text-[10px] text-slate-500">Randomize numbers against shoulder surfers</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={currentSettings.scrambleKeypad}
                    onChange={(e) => setCurrentSettings(s => ({ ...s, scrambleKeypad: e.target.checked }))}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Haptic Feedback</h4>
                    <p className="text-[10px] text-slate-500">Vibration pulse on keypad taps</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={currentSettings.vibrationFeedback}
                    onChange={(e) => setCurrentSettings(s => ({ ...s, vibrationFeedback: e.target.checked }))}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                </div>
              </div>

              {/* INTRUDER SELFIE SETTINGS */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Intruder Selfie</h4>
                      <p className="text-[11px] text-slate-500">Snap a secret photo of failed unlock attempts</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={currentSettings.intruderSelfie}
                    onChange={(e) => setCurrentSettings(s => ({ ...s, intruderSelfie: e.target.checked }))}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                  />
                </div>

                {currentSettings.intruderSelfie && (
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">Capture photo after:</span>
                    <select
                      value={currentSettings.intruderThreshold}
                      onChange={(e) => setCurrentSettings(s => ({ ...s, intruderThreshold: Number(e.target.value) }))}
                      className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    >
                      <option value={1}>1 failed attempt</option>
                      <option value={2}>2 failed attempts</option>
                      <option value={3}>3 failed attempts (Recommended)</option>
                      <option value={5}>5 failed attempts</option>
                    </select>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs">
                <div className="font-bold mb-1 flex items-center gap-1.5 text-indigo-900">
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  <span>Android Core System Privileges</span>
                </div>
                For real-time app launch detection and floating lock overlays, Android requires system accessibility and window overlay permissions.
              </div>

              <div className="space-y-2">
                {[
                  {
                    key: 'accessibilityService',
                    title: 'Accessibility Service (Detect Apps)',
                    desc: 'Monitors foreground window activity to detect when a sensitive app launches'
                  },
                  {
                    key: 'usageAccess',
                    title: 'Usage Access (App Usage Stats)',
                    desc: 'Grants query permission for foreground task changes and background sessions'
                  },
                  {
                    key: 'overlayPermission',
                    title: 'Overlay Permission (SYSTEM_ALERT_WINDOW)',
                    desc: 'Draws the biometric & PIN lock screen immediately over protected apps'
                  },
                  {
                    key: 'biometricPermission',
                    title: 'Biometric Hardware (USE_BIOMETRIC)',
                    desc: 'Enables Android BiometricPrompt for fingerprint and face unlock'
                  },
                  {
                    key: 'cameraPermission',
                    title: 'Camera Permission (Intruder Snapshot)',
                    desc: 'Silent capture of unauthorized intruders on consecutive failed PINs'
                  }
                ].map((perm) => {
                  const isGranted = (permissions as Record<string, boolean>)[perm.key];
                  return (
                    <div 
                      key={perm.key}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{perm.title}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">{perm.desc}</p>
                      </div>
                      <button
                        onClick={() => {
                          onUpdatePermissions({
                            ...permissions,
                            [perm.key]: !isGranted
                          });
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                          isGranted
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {isGranted ? 'Granted ✓' : 'Enable'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'disguise' && (
            <div className="space-y-4">
              {/* FAKE CRASH COVER */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Fake Crash Cover</h4>
                      <p className="text-[11px] text-slate-500">Shows &quot;Unfortunately app has stopped&quot; dialog</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={currentSettings.fakeCrashCover}
                    onChange={(e) => setCurrentSettings(s => ({ ...s, fakeCrashCover: e.target.checked }))}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                  />
                </div>

                <p className="text-[11px] text-slate-500">
                  Intruders assume the app is malfunctioning. Only you know the secret: tapping or holding &quot;Open app again&quot; displays the real PIN pad.
                </p>

                {currentSettings.fakeCrashCover && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-xs font-bold text-slate-700 block mb-2">
                      Apply Fake Crash Cover to:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {apps.map((app) => {
                        const isChecked = currentSettings.fakeCrashTargetApps.includes(app.packageName);
                        return (
                          <button
                            key={app.id}
                            type="button"
                            onClick={() => toggleFakeCrashApp(app.packageName)}
                            className={`p-2 rounded-lg text-left text-xs border flex items-center gap-2 transition ${
                              isChecked
                                ? 'bg-amber-50 border-amber-300 text-amber-800 font-medium'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: app.accentColor }} />
                            <span className="truncate">{app.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* APP ICON DISGUISE */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Launcher Icon Disguise</h4>
                  <p className="text-[11px] text-slate-500">Disguise AppLock as an innocuous utility app</p>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'applock', name: 'AppLock', icon: '🛡️' },
                    { id: 'calculator', name: 'Calculator', icon: '🔢' },
                    { id: 'weather', name: 'Weather', icon: '☀️' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCurrentSettings(s => ({ ...s, appDisguise: item.id as any }))}
                      className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition ${
                        currentSettings.appDisguise === item.id
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-semibold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-xs">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Android 15 Architecture Compliant</span>
          <div className="flex gap-2">
            <button
              id="btn-cancel-settings"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Cancel
            </button>
            <button
              id="btn-save-settings"
              onClick={handleSaveAll}
              className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
