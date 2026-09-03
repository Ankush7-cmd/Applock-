import React from 'react';
import { 
  Wifi, 
  BatteryCharging, 
  Search, 
  Lock, 
  ShieldCheck, 
  EyeOff
} from 'lucide-react';
import { AppItem, SecuritySettings } from '../types';
import { renderAppIcon, getAppDisplayProperties } from '../utils/iconRegistry';

interface AndroidHomeScreenProps {
  apps: AppItem[];
  settings: SecuritySettings;
  onLaunchApp: (app: AppItem) => void;
  onOpenAppLockManager: () => void;
}

export const AndroidHomeScreen: React.FC<AndroidHomeScreenProps> = ({
  apps,
  settings,
  onLaunchApp,
  onOpenAppLockManager,
}) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div 
      id="android-home-screen-device"
      className="w-full max-w-sm mx-auto bg-slate-50 text-slate-900 rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[740px] select-none font-sans relative"
    >
      {/* SYSTEM STATUS BAR */}
      <div className="h-8 flex items-center justify-between px-5 text-xs text-slate-600 z-10 shrink-0">
        <span className="font-semibold text-[11px]">{currentTime}</span>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="font-bold text-[10px] text-indigo-600">5G</span>
          <Wifi className="w-3.5 h-3.5 text-slate-500" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-medium text-slate-600">98%</span>
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* CLOCK & WEATHER WIDGET */}
      <div className="pt-6 pb-4 px-6 text-center z-10">
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-slate-900">
          {currentTime}
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium tracking-wide">
          {currentDate} • 72°F Sunny
        </p>

        {/* GOOGLE SEARCH PILL */}
        <div className="mt-4 mx-auto w-full bg-white border border-slate-200 rounded-full px-4 py-2 flex items-center justify-between text-xs text-slate-500 shadow-xs">
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px]">Search apps & web...</span>
          </div>
          <span className="text-indigo-600 text-xs font-semibold">G</span>
        </div>
      </div>

      {/* ACTIVE PROTECTION BANNER */}
      <div className="px-5 my-1 z-10">
        <div 
          onClick={onOpenAppLockManager}
          className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-900 block">
                ShieldLock Service Active
              </span>
              <span className="text-[10px] text-slate-500">
                {apps.filter((a) => a.isLocked).length} apps locked • Tap to manage
              </span>
            </div>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
            Running
          </span>
        </div>
      </div>

      {/* APPS GRID */}
      <div className="flex-1 overflow-y-auto px-5 py-4 z-10">
        <div className="grid grid-cols-4 gap-y-5 gap-x-2 justify-items-center">
          {apps.map((app) => {
            const display = getAppDisplayProperties(app);
            const isDisguised = Boolean(app.disguiseIcon);

            return (
              <button
                key={app.id}
                id={`home-app-icon-${app.id}`}
                onClick={() => onLaunchApp(app)}
                title={isDisguised ? `${app.name} (Disguised as ${display.displayName})` : app.name}
                className="flex flex-col items-center group active:scale-90 transition relative"
              >
                {/* App Icon Container */}
                <div 
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-xs relative transition group-hover:brightness-95"
                  style={{ backgroundColor: display.accentColor }}
                >
                  {renderAppIcon(display.iconName, 'w-7 h-7 text-white')}
                  
                  {/* Discreet disguise dot or lock badge */}
                  {app.isLocked && (
                    <div 
                      className={`absolute -top-1 -right-1 rounded-full bg-white flex items-center justify-center shadow-xs ${
                        isDisguised 
                          ? 'w-3.5 h-3.5 border border-indigo-400' 
                          : 'w-5 h-5 border border-emerald-500'
                      }`}
                      title={isDisguised ? `Disguised & Locked with PIN/Biometric` : `Locked`}
                    >
                      {isDisguised ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      ) : (
                        <Lock className="w-2.5 h-2.5 text-emerald-600" />
                      )}
                    </div>
                  )}
                </div>

                {/* App Name */}
                <span className="text-[10px] font-medium text-slate-700 mt-1.5 truncate max-w-[64px] text-center">
                  {display.displayName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DOCK BAR */}
      <div className="h-20 bg-white border-t border-slate-200 flex items-center justify-around px-4 z-10 shrink-0 shadow-xs">
        {/* AppLock Manager shortcut */}
        <button
          id="btn-dock-applock"
          onClick={onOpenAppLockManager}
          className="flex flex-col items-center group active:scale-90 transition"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-[9px] text-slate-700 mt-1 font-semibold">
            {settings.appDisguise === 'calculator' ? 'Calculator' : settings.appDisguise === 'weather' ? 'Weather' : 'ShieldLock'}
          </span>
        </button>

        {/* WhatsApp shortcut */}
        {(() => {
          const waApp = apps.find(a => a.id === 'whatsapp');
          if (!waApp) return null;
          const display = getAppDisplayProperties(waApp);
          return (
            <button
              onClick={() => onLaunchApp(waApp)}
              className="flex flex-col items-center group active:scale-90 transition relative"
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs relative"
                style={{ backgroundColor: display.accentColor }}
              >
                {renderAppIcon(display.iconName, 'w-6 h-6 text-white')}
                {waApp.isLocked && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border border-emerald-500 flex items-center justify-center shadow-xs">
                    <Lock className="w-2 h-2 text-emerald-600" />
                  </div>
                )}
              </div>
              <span className="text-[9px] text-slate-600 mt-1 truncate max-w-[56px] text-center">
                {display.displayName}
              </span>
            </button>
          );
        })()}

        {/* Google Pay shortcut */}
        {(() => {
          const gpayApp = apps.find(a => a.id === 'gpay');
          if (!gpayApp) return null;
          const display = getAppDisplayProperties(gpayApp);
          return (
            <button
              onClick={() => onLaunchApp(gpayApp)}
              className="flex flex-col items-center group active:scale-90 transition relative"
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs relative"
                style={{ backgroundColor: display.accentColor }}
              >
                {renderAppIcon(display.iconName, 'w-6 h-6 text-white')}
                {gpayApp.isLocked && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border border-emerald-500 flex items-center justify-center shadow-xs">
                    <Lock className="w-2 h-2 text-emerald-600" />
                  </div>
                )}
              </div>
              <span className="text-[9px] text-slate-600 mt-1 truncate max-w-[56px] text-center">
                {display.displayName}
              </span>
            </button>
          );
        })()}

        {/* Photos shortcut */}
        {(() => {
          const galleryApp = apps.find(a => a.id === 'gallery');
          if (!galleryApp) return null;
          const display = getAppDisplayProperties(galleryApp);
          return (
            <button
              onClick={() => onLaunchApp(galleryApp)}
              className="flex flex-col items-center group active:scale-90 transition relative"
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs relative"
                style={{ backgroundColor: display.accentColor }}
              >
                {renderAppIcon(display.iconName, 'w-6 h-6 text-white')}
                {galleryApp.isLocked && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border border-emerald-500 flex items-center justify-center shadow-xs">
                    <Lock className="w-2 h-2 text-emerald-600" />
                  </div>
                )}
              </div>
              <span className="text-[9px] text-slate-600 mt-1 truncate max-w-[56px] text-center">
                {display.displayName}
              </span>
            </button>
          );
        })()}
      </div>
    </div>
  );
};
