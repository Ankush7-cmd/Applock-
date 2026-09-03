import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  RotateCcw, 
  Sparkles, 
  Check, 
  ArrowRight,
  Smartphone,
  Palette,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { AppItem } from '../types';
import { 
  renderAppIcon, 
  CAMOUFLAGE_PRESETS, 
  AVAILABLE_ICONS, 
  DISGUISE_PALETTE,
  DisguisePreset
} from '../utils/iconRegistry';

interface AppDisguiseModalProps {
  app: AppItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveDisguise: (
    appId: string, 
    disguise: { disguiseIcon?: string; disguiseName?: string; disguiseColor?: string }
  ) => void;
}

export const AppDisguiseModal: React.FC<AppDisguiseModalProps> = ({
  app,
  isOpen,
  onClose,
  onSaveDisguise,
}) => {
  if (!isOpen || !app) return null;

  const [isDisguiseActive, setIsDisguiseActive] = useState<boolean>(Boolean(app.disguiseIcon));
  const [selectedIcon, setSelectedIcon] = useState<string>(app.disguiseIcon || 'Calculator');
  const [customName, setCustomName] = useState<string>(app.disguiseName || '');
  const [selectedColor, setSelectedColor] = useState<string>(app.disguiseColor || '#334155');
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Sync state when active app changes
  useEffect(() => {
    if (app) {
      setIsDisguiseActive(Boolean(app.disguiseIcon));
      setSelectedIcon(app.disguiseIcon || 'Calculator');
      setCustomName(app.disguiseName || '');
      setSelectedColor(app.disguiseColor || '#334155');
    }
  }, [app]);

  const handleApplyPreset = (preset: DisguisePreset) => {
    setIsDisguiseActive(true);
    setSelectedIcon(preset.iconName);
    setCustomName(preset.name);
    setSelectedColor(preset.color);
  };

  const handleResetToDefault = () => {
    setIsDisguiseActive(false);
    setSelectedIcon(app.iconName);
    setCustomName('');
    setSelectedColor(app.accentColor);
    onSaveDisguise(app.id, {
      disguiseIcon: undefined,
      disguiseName: undefined,
      disguiseColor: undefined
    });
    onClose();
  };

  const handleSave = () => {
    if (isDisguiseActive) {
      onSaveDisguise(app.id, {
        disguiseIcon: selectedIcon,
        disguiseName: customName.trim() || undefined,
        disguiseColor: selectedColor,
      });
    } else {
      onSaveDisguise(app.id, {
        disguiseIcon: undefined,
        disguiseName: undefined,
        disguiseColor: undefined,
      });
    }
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 400);
  };

  const currentDisplayName = isDisguiseActive
    ? customName.trim() || selectedIcon
    : app.name;

  return (
    <div 
      id="app-disguise-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 sm:p-5 backdrop-blur-xs"
    >
      <div 
        id="app-disguise-modal-card"
        className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-slate-900"
      >
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-2xs">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>App Disguise: Change Display Icon</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Protect <span className="font-semibold text-slate-800">{app.name}</span> with a decoy icon & label on the home screen
              </p>
            </div>
          </div>
          <button 
            id="btn-close-disguise-modal"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LIVE COMPARISON PREVIEW */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Live Home Launcher Simulation</span>
            {isDisguiseActive ? (
              <span className="text-indigo-600 font-bold bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                Stealth Decoy Active
              </span>
            ) : (
              <span className="text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                Original Launcher Icon
              </span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-around gap-4">
            {/* Real App Column */}
            <div className="flex flex-col items-center text-center">
              <div 
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-xs relative"
                style={{ backgroundColor: app.accentColor }}
              >
                {renderAppIcon(app.iconName, 'w-7 h-7 text-white')}
                {app.isLocked && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border border-emerald-500 flex items-center justify-center shadow-2xs">
                    <Lock className="w-2.5 h-2.5 text-emerald-600" />
                  </div>
                )}
              </div>
              <span className="text-xs font-bold text-slate-900 mt-1.5 max-w-[90px] truncate">
                {app.name}
              </span>
              <span className="text-[10px] text-slate-400">Real App</span>
            </div>

            {/* Transform Arrow */}
            <div className="flex flex-col items-center text-slate-300">
              <ArrowRight className="w-5 h-5 text-indigo-400 animate-pulse" />
              <span className="text-[9px] font-medium text-slate-400 mt-0.5">Camouflages As</span>
            </div>

            {/* Disguised App Column */}
            <div className="flex flex-col items-center text-center">
              <div 
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-xs relative transition-all duration-200"
                style={{ backgroundColor: isDisguiseActive ? selectedColor : app.accentColor }}
              >
                {renderAppIcon(isDisguiseActive ? selectedIcon : app.iconName, 'w-7 h-7 text-white')}
                {/* Subtle stealth dot indicating protection */}
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border border-slate-300 flex items-center justify-center shadow-2xs">
                  <EyeOff className="w-2.5 h-2.5 text-slate-600" />
                </div>
              </div>
              <span className="text-xs font-bold text-slate-900 mt-1.5 max-w-[90px] truncate">
                {currentDisplayName}
              </span>
              <span className="text-[10px] text-indigo-600 font-semibold">Decoy Display</span>
            </div>
          </div>
        </div>

        {/* MODAL TABS */}
        <div className="flex border-b border-slate-200 px-6 pt-2 gap-4 text-xs font-medium">
          <button
            id="tab-disguise-presets"
            onClick={() => setActiveTab('presets')}
            className={`pb-2.5 transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'presets'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Popular Decoys</span>
          </button>
          <button
            id="tab-disguise-custom"
            onClick={() => setActiveTab('custom')}
            className={`pb-2.5 transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'custom'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Custom Icon & Color</span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-600">
          {/* TOGGLE DISGUISE SWITCH */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between shadow-2xs">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Enable Display Disguise</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                When enabled, the phone home screen displays the chosen decoy icon instead of {app.name}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="toggle-enable-disguise"
                type="checkbox"
                checked={isDisguiseActive}
                onChange={(e) => setIsDisguiseActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {activeTab === 'presets' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Choose a Camouflage Decoy Profile</span>
                <span className="text-[11px] text-slate-500">Tap any decoy to select</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CAMOUFLAGE_PRESETS.map((preset) => {
                  const isSelected = isDisguiseActive && selectedIcon === preset.iconName;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 shadow-2xs ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-600 ring-1 ring-indigo-600'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div 
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                        style={{ backgroundColor: preset.color }}
                      >
                        {renderAppIcon(preset.iconName, 'w-5 h-5 text-white')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{preset.name}</h4>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{preset.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-5">
              {/* DISPLAY LABEL FIELD */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  Launcher Display Label
                </label>
                <p className="text-[11px] text-slate-500">
                  Text displayed under the icon on the Android launcher
                </p>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => {
                    setCustomName(e.target.value);
                    setIsDisguiseActive(true);
                  }}
                  placeholder={`e.g. Calculator, Notes, Tools, etc.`}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

              {/* ICON PICKER */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Select Display Icon</span>
                  <span className="text-[11px] text-slate-500">Selected: {selectedIcon}</span>
                </div>
                <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl max-h-48 overflow-y-auto">
                  {AVAILABLE_ICONS.map((iconItem) => {
                    const isIconSelected = selectedIcon === iconItem.id;
                    return (
                      <button
                        key={iconItem.id}
                        type="button"
                        onClick={() => {
                          setSelectedIcon(iconItem.id);
                          setIsDisguiseActive(true);
                        }}
                        title={iconItem.label}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition border shadow-2xs ${
                          isIconSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white scale-105'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {renderAppIcon(iconItem.id, `w-5 h-5 ${isIconSelected ? 'text-white' : 'text-slate-700'}`)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* COLOR PALETTE PICKER */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Icon Background Color</span>
                  <span className="text-[11px] text-slate-500 font-mono">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  {DISGUISE_PALETTE.map((c) => {
                    const isColorSelected = selectedColor.toLowerCase() === c.hex.toLowerCase();
                    return (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => {
                          setSelectedColor(c.hex);
                          setIsDisguiseActive(true);
                        }}
                        title={c.name}
                        className={`w-8 h-8 rounded-full border-2 transition-transform shadow-2xs flex items-center justify-center ${
                          isColorSelected
                            ? 'border-indigo-600 scale-110 ring-2 ring-indigo-200'
                            : 'border-white hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {isColorSelected && <Check className="w-4 h-4 text-white drop-shadow-sm" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SECURITY NOTE */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5 text-[11px] text-indigo-900 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-indigo-950">Disguise Security Notice: </span>
              Changing the display icon visually camouflages the app in the launcher list. Tapping the decoy icon still activates full PIN & biometric authentication before granting access to {app.name}.
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Original Icon</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              id="btn-apply-app-disguise"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition active:scale-95"
            >
              Apply Disguise Icon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
