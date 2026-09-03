import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Fingerprint, 
  Delete, 
  AlertTriangle, 
  ShieldAlert, 
  KeyRound, 
  X, 
  CheckCircle2, 
  HelpCircle, 
  Camera,
  RefreshCw,
  EyeOff
} from 'lucide-react';
import { AppItem, SecuritySettings, IntruderLog } from '../types';
import { vibrateDevice, captureIntruderPhoto, authenticateWithBiometrics } from '../services/biometricService';

interface LockOverlayProps {
  app: AppItem;
  settings: SecuritySettings;
  onSuccess: () => void;
  onCancel: () => void;
  onIntruderCaptured: (log: IntruderLog) => void;
}

export const LockOverlay: React.FC<LockOverlayProps> = ({
  app,
  settings,
  onSuccess,
  onCancel,
  onIntruderCaptured,
}) => {
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);
  const [lockoutTimer, setLockoutTimer] = useState<number>(0);
  const [isBiometricPromptOpen, setIsBiometricPromptOpen] = useState<boolean>(false);
  const [isBiometricScanning, setIsBiometricScanning] = useState<boolean>(false);
  const [biometricSuccess, setBiometricSuccess] = useState<boolean>(false);
  const [showFakeCrash, setShowFakeCrash] = useState<boolean>(() => {
    return settings.fakeCrashCover && settings.fakeCrashTargetApps.includes(app.packageName);
  });
  const [showForgotPinModal, setShowForgotPinModal] = useState<boolean>(false);
  const [securityAnswerInput, setSecurityAnswerInput] = useState<string>('');
  const [securityAnswerError, setSecurityAnswerError] = useState<string>('');
  const [cameraFlash, setCameraFlash] = useState<boolean>(false);

  // Scramble keypad numbers if enabled
  const keypadNumbers = useMemo(() => {
    const base = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    if (!settings.scrambleKeypad) return base;
    return [...base].sort(() => Math.random() - 0.5);
  }, [settings.scrambleKeypad]);

  // Lockout countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLockedOut && lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            setIsLockedOut(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLockedOut, lockoutTimer]);

  // Automatically trigger biometric if enabled
  useEffect(() => {
    if (settings.biometricsEnabled && !showFakeCrash && !isLockedOut) {
      const timer = setTimeout(() => {
        handleTriggerBiometrics();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [showFakeCrash, isLockedOut]);

  // Handle number click
  const handleNumberClick = (num: number) => {
    if (isLockedOut || enteredPin.length >= settings.pinLength) return;
    if (settings.vibrationFeedback) vibrateDevice(25);

    const nextPin = enteredPin + num.toString();
    setEnteredPin(nextPin);
    setIsError(false);

    if (nextPin.length === settings.pinLength) {
      verifyPin(nextPin);
    }
  };

  // Backspace
  const handleBackspace = () => {
    if (isLockedOut || enteredPin.length === 0) return;
    if (settings.vibrationFeedback) vibrateDevice(20);
    setEnteredPin((prev) => prev.slice(0, -1));
    setIsError(false);
  };

  // Clear PIN
  const handleClear = () => {
    setEnteredPin('');
    setIsError(false);
  };

  // Verify PIN
  const verifyPin = async (candidate: string) => {
    if (candidate === settings.pin) {
      if (settings.vibrationFeedback) vibrateDevice([40, 80, 50]);
      onSuccess();
    } else {
      const nextFailed = failedAttempts + 1;
      setFailedAttempts(nextFailed);
      setIsError(true);
      if (settings.vibrationFeedback) vibrateDevice([60, 50, 60]);

      // Check intruder threshold
      if (settings.intruderSelfie && nextFailed >= settings.intruderThreshold) {
        setCameraFlash(true);
        setTimeout(() => setCameraFlash(false), 200);

        try {
          const photo = await captureIntruderPhoto();
          onIntruderCaptured({
            id: 'intruder_' + Date.now(),
            timestamp: Date.now(),
            appName: app.name,
            appPackage: app.packageName,
            attemptedPin: candidate.replace(/./g, '•'),
            failedCount: nextFailed,
            photoDataUrl: photo,
            status: photo?.startsWith('data:image/jpeg') ? 'captured' : 'simulated'
          });
        } catch (e) {
          console.error('Failed to capture intruder photo', e);
        }
      }

      // Check for lockout
      if (nextFailed >= 5) {
        setIsLockedOut(true);
        setLockoutTimer(30);
        setErrorMessage('Too many failed attempts. Device locked for 30s.');
      } else {
        setErrorMessage(`Incorrect PIN. ${5 - nextFailed} attempts remaining.`);
      }

      setTimeout(() => {
        setEnteredPin('');
      }, 450);
    }
  };

  // Biometric scanner trigger
  const handleTriggerBiometrics = async () => {
    if (isLockedOut) return;
    setIsBiometricPromptOpen(true);
    setIsBiometricScanning(true);
    setBiometricSuccess(false);

    try {
      const result = await authenticateWithBiometrics();
      if (result.success) {
        setIsBiometricScanning(false);
        setBiometricSuccess(true);
        setTimeout(() => {
          setIsBiometricPromptOpen(false);
          onSuccess();
        }, 500);
      } else {
        setIsBiometricScanning(false);
      }
    } catch {
      setIsBiometricScanning(false);
    }
  };

  // Handle Security Question Recovery
  const handleVerifySecurityQuestion = () => {
    if (securityAnswerInput.trim().toLowerCase() === settings.securityAnswer.trim().toLowerCase()) {
      setShowForgotPinModal(false);
      onSuccess();
    } else {
      setSecurityAnswerError('Incorrect answer. Please try again.');
    }
  };

  return (
    <div 
      id="applock-lock-overlay" 
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-50 text-slate-900 select-none p-4 sm:p-6 overflow-hidden font-sans"
    >
      {/* Camera flash effect for intruder selfie */}
      {cameraFlash && (
        <div className="fixed inset-0 z-50 bg-white opacity-80 pointer-events-none transition-opacity duration-150" />
      )}

      {/* TOP BAR / CANCEL BUTTON */}
      <div className="w-full max-w-sm flex items-center justify-between pt-2">
        <button
          id="btn-applock-cancel-exit"
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm transition"
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit to Home</span>
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold">
          <Lock className="w-3 h-3" />
          <span>ShieldLock Guard</span>
        </div>
      </div>

      {/* APP HEADER & SHIELD BADGE */}
      <div className="w-full max-w-sm flex flex-col items-center text-center mt-2">
        <div className="relative mb-3">
          <div 
            className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: app.accentColor }}
          >
            <Lock className="w-9 h-9 text-white drop-shadow-sm" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border border-slate-200 shadow-xs">
            <ShieldAlert className="w-4 h-4 text-indigo-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {app.name}
        </h2>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mt-1">
          Secured with ShieldLock
        </p>

        {app.disguiseIcon && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-medium">
            <EyeOff className="w-3.5 h-3.5 text-indigo-600" />
            <span>App Disguise Active: Decoy "{app.disguiseName || app.disguiseIcon}"</span>
          </div>
        )}

        {/* PIN DOTS DISPLAY */}
        <div className="mt-5 flex flex-col items-center">
          <div 
            className={`flex items-center gap-3.5 transition-transform duration-200 ${
              isError ? 'animate-shake' : ''
            }`}
          >
            {Array.from({ length: settings.pinLength }).map((_, idx) => {
              const isFilled = idx < enteredPin.length;
              return (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                    isError
                      ? 'bg-rose-500 border-rose-500 scale-110 shadow-xs shadow-rose-500/50'
                      : isFilled
                      ? 'bg-slate-900 border-slate-900 scale-110 shadow-xs'
                      : 'bg-slate-200 border-slate-300'
                  }`}
                />
              );
            })}
          </div>

          {/* Feedback & Error Message */}
          <div className="h-6 mt-2.5 text-center">
            {isLockedOut ? (
              <span className="text-xs font-semibold text-rose-600 flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Locked for {lockoutTimer}s
              </span>
            ) : isError ? (
              <span className="text-xs font-semibold text-rose-600 flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {errorMessage}
              </span>
            ) : settings.scrambleKeypad ? (
              <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <RefreshCw className="w-3 h-3" />
                Scrambled keypad active
              </span>
            ) : (
              <span className="text-xs text-slate-400">Enter your numeric PIN</span>
            )}
          </div>
        </div>
      </div>

      {/* CUSTOM NUMERIC KEYPAD */}
      <div className="w-full max-w-xs mb-2">
        <div className="grid grid-cols-3 gap-3.5 sm:gap-4 justify-items-center">
          {keypadNumbers.slice(0, 9).map((digit) => (
            <button
              key={digit}
              id={`btn-keypad-${digit}`}
              disabled={isLockedOut}
              onClick={() => handleNumberClick(digit)}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white border border-slate-200 text-slate-800 text-2xl font-light hover:bg-slate-100 active:scale-90 active:bg-slate-200 transition flex items-center justify-center shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {digit}
            </button>
          ))}

          {/* Bottom Row: Biometrics or Forgot, Zero, Backspace */}
          <div className="w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center">
            {settings.biometricsEnabled ? (
              <button
                id="btn-keypad-biometric"
                disabled={isLockedOut}
                onClick={handleTriggerBiometrics}
                title="Use Fingerprint"
                className="w-full h-full rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 hover:bg-indigo-100 active:scale-90 transition flex flex-col items-center justify-center gap-0.5 shadow-xs disabled:opacity-40"
              >
                <Fingerprint className="w-6 h-6 animate-pulse" />
                <span className="text-[9px] font-semibold tracking-wide">Touch ID</span>
              </button>
            ) : (
              <button
                id="btn-keypad-forgot"
                onClick={() => setShowForgotPinModal(true)}
                title="Forgot PIN"
                className="w-full h-full rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 active:scale-90 transition flex flex-col items-center justify-center gap-0.5 shadow-xs"
              >
                <KeyRound className="w-5 h-5" />
                <span className="text-[9px]">Forgot?</span>
              </button>
            )}
          </div>

          {/* 0 Button */}
          <button
            id="btn-keypad-0"
            disabled={isLockedOut}
            onClick={() => handleNumberClick(keypadNumbers[9])}
            className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white border border-slate-200 text-slate-800 text-2xl font-light hover:bg-slate-100 active:scale-90 active:bg-slate-200 transition flex items-center justify-center shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {keypadNumbers[9]}
          </button>

          {/* Backspace Button */}
          <div className="w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center">
            {enteredPin.length > 0 ? (
              <button
                id="btn-keypad-backspace"
                disabled={isLockedOut}
                onClick={handleBackspace}
                className="w-full h-full rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-90 transition flex items-center justify-center shadow-xs"
              >
                <Delete className="w-6 h-6" />
              </button>
            ) : (
              <button
                id="btn-keypad-security-question"
                onClick={() => setShowForgotPinModal(true)}
                className="w-full h-full rounded-full text-slate-400 hover:text-slate-700 transition flex flex-col items-center justify-center"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="text-[9px] mt-0.5">Help</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER OPTIONS */}
      <div className="w-full max-w-sm flex items-center justify-between pb-2 text-xs text-slate-500">
        <button
          onClick={() => setShowForgotPinModal(true)}
          className="hover:text-slate-900 underline underline-offset-4"
        >
          Reset via Security Question
        </button>
        {settings.intruderSelfie && (
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Camera className="w-3.5 h-3.5 text-slate-400" />
            <span>Intruder Guard Active</span>
          </div>
        )}
      </div>

      {/* BIOMETRIC SCANNER PROMPT MODAL */}
      <AnimatePresence>
        {isBiometricPromptOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs"
          >
            <div 
              id="biometric-prompt-card" 
              className="w-full max-w-xs bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl text-slate-900"
            >
              <div className="relative mb-5">
                <div 
                  className={`w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    biometricSuccess
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                      : 'bg-indigo-50 border-indigo-200 text-indigo-600'
                  }`}
                >
                  {biometricSuccess ? (
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  ) : (
                    <Fingerprint className="w-11 h-11 animate-pulse" />
                  )}
                </div>

                {isBiometricScanning && (
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-25" />
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                {biometricSuccess ? 'Fingerprint Recognized' : 'Biometric Verification'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {biometricSuccess
                  ? `Unlocking ${app.name}...`
                  : 'Touch the fingerprint sensor to authenticate'}
              </p>

              <div className="w-full mt-6 pt-4 border-t border-slate-100 flex justify-center">
                <button
                  id="btn-cancel-biometric"
                  onClick={() => setIsBiometricPromptOpen(false)}
                  className="text-xs text-slate-600 hover:text-slate-900 py-1.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 transition font-medium"
                >
                  Use PIN Instead
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAKE CRASH COVER SCREEN (Stealth Anti-Peeking) */}
      <AnimatePresence>
        {showFakeCrash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
          >
            <div 
              id="fake-crash-dialog" 
              className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-left font-sans"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-200">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Unfortunately, {app.name} has stopped.
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">{app.packageName}</p>
                </div>
              </div>

              <p className="text-xs text-slate-500 my-4 leading-relaxed">
                An unexpected error occurred while launching {app.name}. You can submit an error report to Android System.
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  id="btn-fake-crash-report"
                  onClick={onCancel}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 px-3 py-2"
                >
                  Report
                </button>
                <div className="flex items-center gap-2">
                  <button
                    id="btn-fake-crash-unlock-secret"
                    onClick={() => {
                      setShowFakeCrash(false);
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition"
                  >
                    Open app again
                  </button>
                </div>
              </div>
              <div className="mt-2 text-[10px] text-slate-400 text-center">
                (ShieldLock Stealth: Tap &quot;Open app again&quot; to reveal security pad)
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FORGOT PIN / SECURITY QUESTION MODAL */}
      <AnimatePresence>
        {showForgotPinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs"
          >
            <div 
              id="security-question-dialog" 
              className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Reset PIN Access</h3>
                </div>
                <button
                  onClick={() => setShowForgotPinModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500 mb-3">
                Answer your pre-configured security question to verify identity and unlock {app.name}:
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-3">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-0.5">Question</span>
                <span className="text-sm text-slate-800 font-semibold">{settings.securityQuestion}</span>
              </div>

              <div className="space-y-1 mb-4">
                <label className="text-xs text-slate-600 font-medium">Your Answer</label>
                <input
                  id="input-security-answer"
                  type="text"
                  value={securityAnswerInput}
                  onChange={(e) => {
                    setSecurityAnswerInput(e.target.value);
                    setSecurityAnswerError('');
                  }}
                  placeholder="e.g. Blue"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
                {securityAnswerError && (
                  <p className="text-xs text-rose-600 mt-1">{securityAnswerError}</p>
                )}
                <p className="text-[11px] text-slate-400">
                  (Default demo answer is &quot;{settings.securityAnswer}&quot;)
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowForgotPinModal(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-security-answer"
                  onClick={handleVerifySecurityQuestion}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition shadow-xs"
                >
                  Verify & Unlock
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
