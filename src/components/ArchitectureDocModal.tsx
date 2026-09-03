import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  Lock, 
  Fingerprint, 
  Key, 
  Code2, 
  Copy, 
  Check 
} from 'lucide-react';

interface ArchitectureDocModalProps {
  onClose: () => void;
}

export const ArchitectureDocModal: React.FC<ArchitectureDocModalProps> = ({ onClose }) => {
  const [activeSubTab, setActiveSubTab] = useState<'architecture' | 'flow' | 'kotlin'>('architecture');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  const KOTLIN_SNIPPETS = [
    {
      title: 'AppLockAccessibilityService.kt (Foreground Detection)',
      code: `class AppLockAccessibilityService : AccessibilityService() {
    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        if (event.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            val foregroundPackage = event.packageName?.toString() ?: return
            
            // Check if application is in locked list and not in active grace session
            val appLockCore = AppLockCore.getInstance(applicationContext)
            if (appLockCore.isAppLocked(foregroundPackage) && !appLockCore.isSessionUnlocked(foregroundPackage)) {
                // Launch Overlay LockScreenActivity immediately on top
                val lockIntent = Intent(this, LockScreenActivity::class.java).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
                    putExtra("TARGET_PACKAGE", foregroundPackage)
                }
                startActivity(lockIntent)
            }
        }
    }
    override fun onInterrupt() {}
}`
    },
    {
      title: 'BiometricPromptManager.kt (Android Biometrics)',
      code: `class BiometricPromptManager(private val activity: FragmentActivity) {
    fun authenticate(onSuccess: () -> Unit, onError: (String) -> Unit) {
        val executor = ContextCompat.getMainExecutor(activity)
        val prompt = BiometricPrompt(activity, executor,
            object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    super.onAuthenticationSucceeded(result)
                    onSuccess()
                }
                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    onError(errString.toString())
                }
            })

        val promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle("Unlock Application")
            .setSubtitle("Confirm your fingerprint or biometric credential")
            .setNegativeButtonText("Use PIN")
            .setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG)
            .build()

        prompt.authenticate(promptInfo)
    }
}`
    },
    {
      title: 'AndroidManifest.xml (Permissions & Services)',
      code: `<!-- Required Android App Lock Permissions -->
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
<uses-permission android:name="android.permission.PACKAGE_USAGE_STATS" tools:ignore="ProtectedPermissions" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />

<service
    android:name=".services.AppLockAccessibilityService"
    android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
    android:exported="true">
    <intent-filter>
        <action android:name="android.accessibilityservice.AccessibilityService" />
    </intent-filter>
    <meta-data
        android:name="android.accessibilityservice"
        android:resource="@xml/accessibility_service_config" />
</service>`
    }
  ];

  return (
    <div 
      id="architecture-doc-modal-overlay" 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 sm:p-5 backdrop-blur-xs"
    >
      <div 
        id="architecture-doc-modal-card" 
        className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                App Lock App – Architecture & Logical Flow
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Keep Your Apps Private and Secure on Android OS</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUBTABS */}
        <div className="flex border-b border-slate-200 px-6 pt-2 gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('architecture')}
            className={`pb-2.5 transition border-b-2 ${
              activeSubTab === 'architecture'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            System Architecture
          </button>
          <button
            onClick={() => setActiveSubTab('flow')}
            className={`pb-2.5 transition border-b-2 ${
              activeSubTab === 'flow'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Logical Flow (6 Steps)
          </button>
          <button
            onClick={() => setActiveSubTab('kotlin')}
            className={`pb-2.5 transition border-b-2 flex items-center gap-1.5 ${
              activeSubTab === 'kotlin'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Android Kotlin Source</span>
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-600">
          {activeSubTab === 'architecture' && (
            <div className="space-y-6">
              {/* DIAGRAM CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. UI Layer */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center gap-2 text-indigo-700">
                    <Smartphone className="w-4 h-4" />
                    <h3 className="font-bold text-sm text-slate-900">User Interface (UI)</h3>
                  </div>
                  <ul className="space-y-1 text-slate-600 list-disc list-inside text-[11px]">
                    <li>Main Activity</li>
                    <li>App List (Installed Apps)</li>
                    <li>Settings Panel</li>
                    <li>Lock Screen Overlay</li>
                    <li>Biometric / PIN Auth Keypad</li>
                  </ul>
                </div>

                {/* 2. App Lock Core */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <ShieldCheck className="w-4 h-4" />
                    <h3 className="font-bold text-sm text-slate-900">App Lock Core</h3>
                  </div>
                  <ul className="space-y-1 text-slate-600 list-disc list-inside text-[11px]">
                    <li>Manage Locked Apps Registry</li>
                    <li>Handle Biometrics & Verification</li>
                    <li>Control App Launch Flow</li>
                    <li>Enforce Security Policies</li>
                  </ul>
                </div>

                {/* 3. Data Layer */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center gap-2 text-purple-700">
                    <Database className="w-4 h-4" />
                    <h3 className="font-bold text-sm text-slate-900">Data Layer</h3>
                  </div>
                  <ul className="space-y-1 text-slate-600 list-disc list-inside text-[11px]">
                    <li>EncryptedSharedPreferences</li>
                    <li>Room Database for Locked Apps</li>
                    <li>Save User Preferences</li>
                    <li>Salted & Hashed PIN / Pattern</li>
                  </ul>
                </div>
              </div>

              {/* SECOND ROW: Background Service & Security Modules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Background Service */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-700">
                    <Cpu className="w-4 h-4" />
                    <h4 className="font-bold text-sm text-slate-900">Background Service (Detection)</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Accessibility Service monitors foreground window transitions in real-time. Checks if the newly launched package is protected, instantly displaying the lock screen.
                  </p>
                </div>

                {/* Security Modules */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Lock className="w-4 h-4" />
                    <h4 className="font-bold text-sm text-slate-900">Security Modules</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Custom Numeric PIN, Fingerprint / BiometricPrompt, Intruder Selfie capture via Camera API, App Disguise (custom display icon & decoy label camouflage), Fake Crash cover, and notification stealth shielding.
                  </p>
                </div>
              </div>

              {/* REQUIRED PERMISSIONS CALLOUT */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                <h4 className="text-xs font-bold text-indigo-950">Required Android Permissions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 font-medium">
                  <div>• Accessibility Service (Detects foreground apps)</div>
                  <div>• Usage Access (UsageStatsManager monitor)</div>
                  <div>• Overlay Permission (SYSTEM_ALERT_WINDOW overlay)</div>
                  <div>• Biometric Permission (Fingerprint / Face unlock)</div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'flow' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                The full 6-step logical execution flow as diagrammed:
              </p>

              <div className="space-y-3">
                {[
                  {
                    step: '1',
                    title: 'User Setup',
                    desc: 'User installs AppLock, configures custom numeric PIN or Biometrics, and selects sensitive apps to protect (e.g. WhatsApp, Banking).'
                  },
                  {
                    step: '2',
                    title: 'App Launch Detected',
                    desc: 'User or system launcher initiates a target application (e.g. tapping WhatsApp icon on home screen).'
                  },
                  {
                    step: '3',
                    title: 'Background Service Checks App',
                    desc: 'Accessibility Service / UsageStatsManager event fires on window state change and inspects the foreground package identifier.'
                  },
                  {
                    step: '4',
                    title: 'Is App Locked?',
                    desc: 'AppLock Core checks database: If package is registered as locked and has no active unlock session, launch interception triggers.'
                  },
                  {
                    step: '5',
                    title: 'Show Lock Screen',
                    desc: 'SYSTEM_ALERT_WINDOW floating overlay displays the biometric prompt and numeric keypad over the targeted app immediately.'
                  },
                  {
                    step: '6',
                    title: 'Authenticate & Open App',
                    desc: 'User verifies fingerprint or enters correct PIN. On success, overlay dismisses and the user accesses the protected application.'
                  }
                ].map((item) => (
                  <div 
                    key={item.step}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 shadow-2xs"
                  >
                    <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 font-bold flex items-center justify-center shrink-0 text-xs">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'kotlin' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Production-ready Kotlin implementations for Android Native deployment:
              </p>

              {KOTLIN_SNIPPETS.map((snippet, idx) => (
                <div key={idx} className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xs">
                  <div className="px-4 py-2.5 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-200 font-medium">{snippet.title}</span>
                    <button
                      onClick={() => copyCode(snippet.code, idx)}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-[11px] font-mono text-emerald-300/90 overflow-x-auto leading-relaxed">
                    {snippet.code}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition shadow-xs"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
