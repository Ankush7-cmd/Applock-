import React, { useState } from 'react';
import { X, ShieldAlert, Trash2, Camera, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { IntruderLog } from '../types';
import { captureIntruderPhoto } from '../services/biometricService';

interface IntruderLogModalProps {
  logs: IntruderLog[];
  onClearLogs: () => void;
  onAddLog: (log: IntruderLog) => void;
  onClose: () => void;
}

export const IntruderLogModal: React.FC<IntruderLogModalProps> = ({
  logs,
  onClearLogs,
  onAddLog,
  onClose,
}) => {
  const [isCapturingTest, setIsCapturingTest] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  const handleTriggerTestSelfie = async () => {
    setIsCapturingTest(true);
    setTestSuccess(false);

    try {
      const photo = await captureIntruderPhoto();
      const newLog: IntruderLog = {
        id: 'test_' + Date.now(),
        timestamp: Date.now(),
        appName: 'Intruder Guard Test',
        appPackage: 'com.applock.security.test',
        attemptedPin: '••••',
        failedCount: 3,
        photoDataUrl: photo,
        status: photo?.startsWith('data:image/jpeg') ? 'captured' : 'simulated'
      };
      onAddLog(newLog);
      setTestSuccess(true);
      setTimeout(() => setTestSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCapturingTest(false);
    }
  };

  return (
    <div 
      id="intruder-log-modal-overlay" 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 sm:p-4 backdrop-blur-xs"
    >
      <div 
        id="intruder-log-modal-card" 
        className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
      >
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Intruder Selfie Logs</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  {logs.length} Recorded
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Photos snapped during incorrect PIN / unlock attempts</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TEST SELFIE ACTION BAR */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-600 text-[11px] font-medium">Simulate unauthorized access attempt:</span>
          <button
            id="btn-test-intruder-capture"
            disabled={isCapturingTest}
            onClick={handleTriggerTestSelfie}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition disabled:opacity-50 shadow-2xs"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isCapturingTest ? 'Snapping Camera...' : 'Take Test Selfie'}</span>
          </button>
        </div>

        {testSuccess && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Selfie captured and logged successfully!</span>
          </div>
        )}

        {/* LOGS LIST */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5 text-xs">
          {logs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <ShieldAlert className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-700">No intruder events recorded yet</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                When someone types an incorrect PIN 3 times on a locked app, their photo is automatically snapped here.
              </p>
            </div>
          ) : (
            logs.map((log) => (
              <div 
                key={log.id} 
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  {/* Photo thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0 relative">
                    {log.photoDataUrl ? (
                      <img 
                        src={log.photoDataUrl} 
                        alt="Intruder Snapshot" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Camera className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900">{log.appName}</h4>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        {log.failedCount} Failed PINs
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{log.appPackage}</p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-500 self-end sm:self-center">
                  <span className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-medium shadow-2xs">
                    {log.status === 'captured' ? 'Real Front Camera' : 'Simulated Snapshot'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between">
          <button
            onClick={onClearLogs}
            disabled={logs.length === 0}
            className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 disabled:opacity-40 font-medium transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Log History</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
