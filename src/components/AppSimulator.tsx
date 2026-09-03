import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MoreVertical, 
  Send, 
  CreditCard, 
  DollarSign, 
  Image as ImageIcon, 
  ShieldCheck, 
  Plus, 
  Check, 
  Lock,
  Wifi,
  BatteryCharging,
  Home,
  Square,
  ChevronLeft,
  EyeOff
} from 'lucide-react';
import { AppItem, SecuritySettings } from '../types';

interface AppSimulatorProps {
  app: AppItem;
  settings: SecuritySettings;
  onExitApp: () => void;
  onLockNow: () => void;
}

export const AppSimulator: React.FC<AppSimulatorProps> = ({
  app,
  settings,
  onExitApp,
  onLockNow,
}) => {
  // App-specific mock states
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([
    'Dinner is at 7:30 PM tonight!',
    'Great, see you all there! Bringing dessert 🍰'
  ]);
  const [walletBalance, setWalletBalance] = useState(8420.50);
  const [transferSent, setTransferSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'chats' | 'status' | 'calls'>('chats');
  const [noteTitle, setNoteTitle] = useState('');
  const [notesList, setNotesList] = useState([
    { title: 'Safe Code', content: '9402 - Master bedroom box' },
    { title: 'Wi-Fi Password', content: 'FiberOptics_982#ultra' }
  ]);

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setMessages((prev) => [...prev, chatMessage.trim()]);
    setChatMessage('');
  };

  const handleSendMoneyDemo = () => {
    if (walletBalance >= 50) {
      setWalletBalance((prev) => prev - 50);
      setTransferSent(true);
      setTimeout(() => setTransferSent(false), 3000);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    setNotesList((prev) => [...prev, { title: noteTitle.trim(), content: 'Protected note created just now.' }]);
    setNoteTitle('');
  };

  return (
    <div 
      id="android-simulated-app-container"
      className="w-full max-w-md mx-auto bg-slate-50 text-slate-900 rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[740px] select-none font-sans"
    >
      {/* ANDROID SYSTEM STATUS BAR */}
      <div className="h-8 bg-white flex items-center justify-between px-4 text-xs text-slate-600 border-b border-slate-200 shrink-0">
        <span className="font-semibold text-[11px]">{currentTime}</span>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="font-bold text-[10px] tracking-wider text-indigo-600">5G</span>
          <Wifi className="w-3.5 h-3.5 text-slate-500" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-medium text-slate-600">98%</span>
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* APPLOCK SECURITY BADGE NOTICE (TOP PILL) */}
      <div className="bg-indigo-50/80 border-b border-indigo-100 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-indigo-700 shrink-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span className="font-medium">Unlocked via {settings.biometricsEnabled ? 'Biometrics / PIN' : 'Custom PIN'}</span>
          {app.disguiseIcon && (
            <span className="inline-flex items-center gap-1 text-[10px] text-indigo-800 bg-white/90 px-2 py-0.5 rounded-full border border-indigo-200">
              <EyeOff className="w-2.5 h-2.5 text-indigo-600" />
              <span>Decoy: {app.disguiseName || app.disguiseIcon}</span>
            </span>
          )}
        </div>
        <button
          id="btn-app-re-lock"
          onClick={onLockNow}
          className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white hover:bg-slate-50 text-[10px] font-semibold text-slate-700 border border-slate-200 shadow-2xs transition shrink-0 ml-2"
        >
          <Lock className="w-2.5 h-2.5 text-slate-600" />
          <span>Lock Now</span>
        </button>
      </div>

      {/* APP HEADER */}
      <div 
        className="px-4 py-3 flex items-center justify-between shadow-xs shrink-0"
        style={{ backgroundColor: app.accentColor }}
      >
        <div className="flex items-center gap-3">
          <button 
            id="btn-app-back-nav"
            onClick={onExitApp} 
            className="p-1 -ml-1 text-white hover:bg-black/15 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="font-bold text-white leading-tight text-base drop-shadow-sm">{app.name}</h3>
            <p className="text-[11px] text-white/90 leading-none">Android Protected Sandbox</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-white">
          <button className="p-1.5 hover:bg-black/15 rounded-full transition">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* APP BODY (SPECIFIC MOCK INTERFACES) */}
      <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
        {/* WHATSAPP MOCK */}
        {app.id === 'whatsapp' && (
          <div className="space-y-4 flex flex-col h-full justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <div className="w-11 h-11 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white shadow-xs">
                  FG
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-sm font-bold text-slate-900 truncate">Family Group</h4>
                    <span className="text-[10px] text-emerald-600 font-semibold">Just now</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">Alex, Sarah, Mom, You</p>
                </div>
              </div>

              {/* Chat bubbles */}
              <div className="space-y-2 py-2">
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs shadow-xs ${
                        i % 2 === 0 
                          ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-none' 
                          : 'bg-emerald-600 text-white rounded-tr-none'
                      }`}
                    >
                      <p>{msg}</p>
                      <span className="text-[9px] opacity-70 block text-right mt-1">12:34 PM ✓✓</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input bar */}
            <form onSubmit={handleSendChatMessage} className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <input
                id="input-whatsapp-chat"
                type="text"
                placeholder="Type a sensitive message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <button 
                type="submit" 
                id="btn-whatsapp-send"
                className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* GOOGLE PAY & BANKING MOCK */}
        {app.id === 'gpay' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Checking Balance</span>
              <h2 className="text-3xl font-bold text-slate-900 mt-1">
                ${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h2>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Account •••• 8291</span>
                <span className="font-semibold text-emerald-600">FDIC Insured</span>
              </div>
            </div>

            {transferSent && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">$50.00 transfer completed securely!</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button 
                id="btn-banking-send-demo"
                onClick={handleSendMoneyDemo}
                className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1.5">
                  <Send className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 block">Send $50 Test</span>
                <span className="text-[10px] text-slate-500">Instant UPI wire</span>
              </button>

              <button className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 block">Virtual Card</span>
                <span className="text-[10px] text-slate-500">CVV Protected</span>
              </button>
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recent Transactions</h4>
              <div className="space-y-2">
                {app.simulatedData?.details.map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between text-slate-700 shadow-2xs">
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PHOTOS & GALLERY MOCK */}
        {app.id === 'gallery' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-bold text-slate-800">Protected Cloud Vault</span>
              </div>
              <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
                18 Locked Items
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { bg: 'from-amber-500 to-orange-600', label: 'Passport Scan' },
                { bg: 'from-blue-500 to-indigo-600', label: 'Tax Return 2025' },
                { bg: 'from-emerald-500 to-teal-700', label: 'House Deed' },
                { bg: 'from-purple-500 to-pink-600', label: 'Private Key Backup' },
                { bg: 'from-rose-500 to-red-700', label: 'Medical Records' },
                { bg: 'from-indigo-500 to-slate-700', label: 'Contracts' },
              ].map((pic, idx) => (
                <div 
                  key={idx}
                  className={`aspect-square rounded-xl bg-gradient-to-br ${pic.bg} p-2 flex flex-col justify-between text-white shadow-xs relative group cursor-pointer hover:opacity-90 transition`}
                >
                  <Lock className="w-3.5 h-3.5 text-white/90" />
                  <span className="text-[10px] font-semibold leading-tight drop-shadow-xs">{pic.label}</span>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 shadow-2xs">
              <p className="font-bold text-slate-900 mb-1">Private Folder Security</p>
              Photos in this locked folder are invisible in the default system gallery and require AppLock PIN / Touch ID to decrypt.
            </div>
          </div>
        )}

        {/* CRYPTO WALLET MOCK */}
        {app.id === 'crypto' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Portfolio Net Worth</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">$14,890.30 USD</h2>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">+4.8% past 24h</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Protected Assets</h4>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center text-xs shadow-2xs">
                <div>
                  <p className="font-bold text-slate-900">Ethereum (ETH)</p>
                  <p className="text-[10px] text-slate-500">4.15 ETH</p>
                </div>
                <span className="font-bold text-slate-800">$10,250.00</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center text-xs shadow-2xs">
                <div>
                  <p className="font-bold text-slate-900">Bitcoin (BTC)</p>
                  <p className="text-[10px] text-slate-500">0.082 BTC</p>
                </div>
                <span className="font-bold text-slate-800">$4,640.30</span>
              </div>
            </div>
          </div>
        )}

        {/* SECURE NOTES MOCK */}
        {app.id === 'notes' && (
          <div className="space-y-4">
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                id="input-note-title"
                type="text"
                placeholder="Add confidential note..."
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
              <button 
                type="submit"
                id="btn-add-note"
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-xs"
              >
                Add
              </button>
            </form>

            <div className="space-y-2">
              {notesList.map((n, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs">
                  <h5 className="font-bold text-slate-900">{n.title}</h5>
                  <p className="text-slate-600 mt-1">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DEFAULT FALLBACK APP VIEW */}
        {!['whatsapp', 'gpay', 'gallery', 'crypto', 'notes'].includes(app.id) && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900">{app.simulatedData?.subtitle}</h4>
              <p className="text-xs text-slate-500 mt-1">{app.description}</p>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Protected Records</h5>
              {app.simulatedData?.details.map((detail, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-2xs">
                  {detail}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ANDROID SYSTEM BOTTOM NAVIGATION BAR (BACK, HOME, RECENTS) */}
      <div className="h-12 bg-white border-t border-slate-200 flex items-center justify-around px-8 text-slate-400 shrink-0">
        {/* Android Back Button */}
        <button
          id="btn-android-nav-back"
          onClick={onExitApp}
          title="Android Back"
          className="p-2 hover:text-slate-700 active:scale-90 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Android Home Button */}
        <button
          id="btn-android-nav-home"
          onClick={onExitApp}
          title="Android Home"
          className="p-2 hover:text-slate-700 active:scale-90 transition"
        >
          <div className="w-4 h-4 rounded-full border-2 border-slate-400 hover:border-slate-700 transition" />
        </button>

        {/* Android Recents / Overview Button */}
        <button
          id="btn-android-nav-recents"
          onClick={onExitApp}
          title="Android Recents"
          className="p-2 hover:text-slate-700 active:scale-90 transition"
        >
          <Square className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
