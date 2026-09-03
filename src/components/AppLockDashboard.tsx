import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Search, 
  Settings, 
  Camera, 
  Layers, 
  Play, 
  Smartphone, 
  Fingerprint, 
  KeyRound,
  EyeOff,
  Palette,
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { AppItem, SecuritySettings, AppCategory, IntruderLog } from '../types';
import { renderAppIcon } from '../utils/iconRegistry';

interface AppLockDashboardProps {
  apps: AppItem[];
  settings: SecuritySettings;
  intruderLogs: IntruderLog[];
  onToggleAppLock: (appId: string) => void;
  onLockAll: (lock: boolean) => void;
  onLaunchApp: (app: AppItem) => void;
  onOpenSettings: () => void;
  onOpenIntruderLogs: () => void;
  onOpenArchitecture: () => void;
  onSwitchToHomeLauncher: () => void;
  onChangeDisplayIcon: (app: AppItem) => void;
}

export const AppLockDashboard: React.FC<AppLockDashboardProps> = ({
  apps,
  settings,
  intruderLogs,
  onToggleAppLock,
  onLockAll,
  onLaunchApp,
  onOpenSettings,
  onOpenIntruderLogs,
  onOpenArchitecture,
  onSwitchToHomeLauncher,
  onChangeDisplayIcon,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const lockedCount = apps.filter((a) => a.isLocked).length;
  const disguisedCount = apps.filter((a) => Boolean(a.disguiseIcon)).length;

  const filteredApps = apps.filter((app) => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.disguiseName && app.disguiseName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'locked') return app.isLocked;
    if (selectedCategory === 'disguised') return Boolean(app.disguiseIcon);
    return app.category === selectedCategory;
  });

  return (
    <div id="applock-dashboard" className="w-full max-w-4xl mx-auto space-y-6">
      {/* TOP HERO STATUS BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                ShieldLock Protected Apps
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                Active
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1 max-w-lg">
              You have {lockedCount} of {apps.length} sensitive applications secured with {settings.pinLength}-digit numeric PIN and local biometrics.
            </p>
          </div>
        </div>

        {/* QUICK SHORTCUT ACTIONS */}
        <div className="flex flex-wrap items-center gap-2.5 sm:self-center">
          <button
            id="btn-switch-launcher-view"
            onClick={onSwitchToHomeLauncher}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-sm transition active:scale-95"
          >
            <Smartphone className="w-4 h-4" />
            <span>Launch Phone Simulator</span>
          </button>

          <button
            id="btn-open-settings"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 shadow-sm transition"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Settings</span>
          </button>

          <button
            id="btn-open-architecture-docs"
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-medium border border-indigo-100 shadow-sm transition"
          >
            <Layers className="w-4 h-4" />
            <span>Architecture & Flow</span>
          </button>
        </div>
      </div>

      {/* STATS & METRICS ROW + SECURITY TIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">Secured</span>
              <span className="text-base font-bold text-slate-900">{lockedCount} Apps</span>
            </div>
          </div>

          <button 
            onClick={() => setSelectedCategory('disguised')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 shadow-sm flex items-center gap-3 text-left transition group"
            title="Filter disguised apps"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">Disguised</span>
              <span className="text-base font-bold text-indigo-600">{disguisedCount} Decoys</span>
            </div>
          </button>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">Biometrics</span>
              <span className="text-base font-bold text-slate-900">
                {settings.biometricsEnabled ? 'Enrolled' : 'Off'}
              </span>
            </div>
          </div>

          <button 
            onClick={onOpenIntruderLogs}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 shadow-sm flex items-center gap-3 text-left transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">Intruders</span>
              <span className="text-base font-bold text-rose-600">{intruderLogs.length} Caught</span>
            </div>
          </button>
        </div>

        {/* SECURITY TIP BOX (Clean Minimalism Element) */}
        <div className="p-5 bg-slate-900 rounded-2xl text-white shadow-sm flex flex-col justify-center">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Security Tip
          </p>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            Use the <strong>App Disguise</strong> feature to change display icons on the launcher so sensitive apps look like ordinary calculators or weather widgets.
          </p>
        </div>
      </div>

      {/* MAIN APPS LIST SECTION */}
      <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        {/* CONTROLS HEADER */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* SEARCH INPUT */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-apps"
              type="text"
              placeholder="Search installed applications or decoy names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          {/* BULK LOCK ACTIONS */}
          <div className="flex items-center gap-2">
            <button
              id="btn-lock-all-apps"
              onClick={() => onLockAll(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition"
            >
              Lock All
            </button>
            <button
              id="btn-unlock-all-apps"
              onClick={() => onLockAll(false)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition"
            >
              Unlock All
            </button>
          </div>
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Apps' },
            { id: 'locked', label: `Locked (${lockedCount})` },
            { id: 'disguised', label: `Disguised (${disguisedCount})` },
            { id: 'finance', label: 'Banking & UPI' },
            { id: 'messaging', label: 'Messaging & Mail' },
            { id: 'gallery', label: 'Photos & Media' },
            { id: 'social', label: 'Social Networks' },
            { id: 'crypto', label: 'Web3 & Crypto' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3.5 py-1 rounded-full whitespace-nowrap transition text-xs font-medium ${
                selectedCategory === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* APPS TABLE / LIST */}
        <div className="divide-y divide-slate-100">
          {filteredApps.length === 0 ? (
            <div className="py-14 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-600">No matching applications found</p>
              <p className="text-xs text-slate-400">Try adjusting your search query or filters</p>
            </div>
          ) : (
            filteredApps.map((app) => {
              const displayIconName = app.disguiseIcon || app.iconName;
              const displayBgColor = app.disguiseColor || app.accentColor;
              const isDisguised = Boolean(app.disguiseIcon);

              return (
                <div 
                  key={app.id} 
                  className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition group"
                >
                  {/* APP INFO */}
                  <div className="flex items-center gap-4 min-w-0">
                    {/* App Icon Container - click to change icon */}
                    <button
                      type="button"
                      onClick={() => onChangeDisplayIcon(app)}
                      title={`Change display icon for ${app.name}`}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm shrink-0 relative transition group-hover:scale-105 cursor-pointer"
                      style={{ backgroundColor: displayBgColor }}
                    >
                      {renderAppIcon(displayIconName, 'w-6 h-6 text-white')}
                      {app.isLocked && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border border-emerald-500 flex items-center justify-center shadow-xs">
                          <Lock className="w-2.5 h-2.5 text-emerald-600" />
                        </div>
                      )}
                      {isDisguised && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border border-indigo-500 flex items-center justify-center shadow-xs" title="Camouflaged">
                          <EyeOff className="w-2.5 h-2.5 text-indigo-600" />
                        </div>
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center flex-wrap gap-2">
                        <h3 className="text-sm font-bold text-slate-900 truncate">
                          {app.name}
                        </h3>
                        {app.isLocked && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <Lock className="w-2.5 h-2.5" />
                            Locked
                          </span>
                        )}
                        {isDisguised && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                            <EyeOff className="w-2.5 h-2.5" />
                            Disguised: {app.disguiseName || app.disguiseIcon}
                          </span>
                        )}
                        {settings.fakeCrashCover && settings.fakeCrashTargetApps.includes(app.packageName) && (
                          <span className="hidden sm:inline-flex text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Fake Crash
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-tighter truncate max-w-sm sm:max-w-md">
                        {app.description}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {app.packageName}
                        </span>
                        {isDisguised && (
                          <span className="text-[10px] text-indigo-600 font-medium">
                            • Decoy: {app.disguiseName || app.disguiseIcon}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CONTROLS */}
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {/* Change Display Icon / Disguise Button */}
                    <button
                      id={`btn-change-icon-${app.id}`}
                      onClick={() => onChangeDisplayIcon(app)}
                      title={`Change display icon for ${app.name}`}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition active:scale-95 shadow-2xs ${
                        isDisguised
                          ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Palette className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="hidden sm:inline">
                        {isDisguised ? 'Edit Disguise' : 'Disguise Icon'}
                      </span>
                    </button>

                    {/* Test Launch Button */}
                    <button
                      id={`btn-test-launch-${app.id}`}
                      onClick={() => onLaunchApp(app)}
                      title="Simulate opening this app"
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition active:scale-95 shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                      <span className="hidden sm:inline">Test Launch</span>
                    </button>

                    {/* Clean Minimalism Toggle Switch */}
                    <button
                      id={`btn-toggle-lock-${app.id}`}
                      onClick={() => onToggleAppLock(app.id)}
                      aria-label={`Toggle lock for ${app.name}`}
                      className={`w-12 h-6 rounded-full relative transition-colors duration-200 ease-in-out cursor-pointer ${
                        app.isLocked ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    >
                      <div 
                        className={`w-4 h-4 bg-white rounded-full shadow-sm absolute top-1 transition-all duration-200 flex items-center justify-center ${
                          app.isLocked ? 'right-1' : 'left-1'
                        }`}
                      >
                        {app.isLocked && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                      </div>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* CLEAN MINIMALISM DASHED METRIC FOOTER BAR */}
      <div className="p-6 border border-dashed border-slate-200 rounded-3xl flex items-center justify-center gap-8 sm:gap-14 text-slate-400 bg-white/70 shadow-sm">
        <div className="flex flex-col items-center">
          <span className="text-slate-900 font-bold text-lg">{lockedCount}</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Applications Secured</span>
        </div>
        <div className="w-px h-8 bg-slate-200" />
        <div className="flex flex-col items-center">
          <span className="text-slate-900 font-bold text-lg">0.0ms</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Interception Latency</span>
        </div>
        <div className="w-px h-8 bg-slate-200" />
        <div className="flex flex-col items-center">
          <span className="text-slate-900 font-bold text-lg">Local</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Storage Keystore Node</span>
        </div>
      </div>
    </div>
  );
};
