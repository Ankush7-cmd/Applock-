import React from 'react';
import {
  MessageSquare,
  CreditCard,
  Image as ImageIcon,
  Coins,
  Instagram,
  Mail,
  FileText,
  Settings as SettingsIcon,
  Lock,
  Calculator,
  CloudSun,
  Clock,
  Compass,
  Folder,
  Calendar,
  Radio,
  Wrench,
  Zap,
  Music,
  CheckSquare,
  Heart,
  Cpu,
  BookOpen,
  Camera,
  Coffee,
  Globe,
  HelpCircle,
  ShieldCheck,
  Search,
  Sliders,
  Phone,
  Terminal,
  Bookmark
} from 'lucide-react';
import { AppItem } from '../types';

export interface DisguisePreset {
  id: string;
  name: string;
  iconName: string;
  color: string;
  description: string;
}

export const CAMOUFLAGE_PRESETS: DisguisePreset[] = [
  {
    id: 'calculator',
    name: 'Calculator',
    iconName: 'Calculator',
    color: '#334155',
    description: 'Classic math decoy. Indistinguishable from built-in calculator.',
  },
  {
    id: 'weather',
    name: 'Weather',
    iconName: 'CloudSun',
    color: '#0284C7',
    description: 'Everyday weather & temperature forecast decoy.',
  },
  {
    id: 'clock',
    name: 'Clock',
    iconName: 'Clock',
    color: '#D97706',
    description: 'World clock, timer & alarm utility decoy.',
  },
  {
    id: 'compass',
    name: 'Compass',
    iconName: 'Compass',
    color: '#059669',
    description: 'Directional sensor & orientation tool decoy.',
  },
  {
    id: 'notes',
    name: 'Notes',
    iconName: 'FileText',
    color: '#CA8A04',
    description: 'Simple scratchpad & memo notepad decoy.',
  },
  {
    id: 'calendar',
    name: 'Calendar',
    iconName: 'Calendar',
    color: '#2563EB',
    description: 'Daily agenda & event scheduler decoy.',
  },
  {
    id: 'files',
    name: 'Files',
    iconName: 'Folder',
    color: '#4F46E5',
    description: 'Local storage & document manager decoy.',
  },
  {
    id: 'radio',
    name: 'FM Radio',
    iconName: 'Radio',
    color: '#E11D48',
    description: 'Audio tuner & broadcast station decoy.',
  },
  {
    id: 'tools',
    name: 'Toolkit',
    iconName: 'Wrench',
    color: '#475569',
    description: 'Device maintenance & system utility decoy.',
  },
  {
    id: 'flashlight',
    name: 'Flashlight',
    iconName: 'Zap',
    color: '#F59E0B',
    description: 'Torchlight & power sensor decoy.',
  },
  {
    id: 'music',
    name: 'Music Player',
    iconName: 'Music',
    color: '#7C3AED',
    description: 'Audio playback & MP3 decoy.',
  },
  {
    id: 'tasks',
    name: 'To-Do List',
    iconName: 'CheckSquare',
    color: '#0D9488',
    description: 'Checklist & daily reminder decoy.',
  },
  {
    id: 'health',
    name: 'Step Counter',
    iconName: 'Heart',
    color: '#DC2626',
    description: 'Pedometer & daily wellness tracker decoy.',
  },
  {
    id: 'cpu',
    name: 'System Monitor',
    iconName: 'Cpu',
    color: '#64748B',
    description: 'CPU & RAM hardware diagnostic decoy.',
  }
];

export const AVAILABLE_ICONS = [
  { id: 'Calculator', label: 'Calculator' },
  { id: 'CloudSun', label: 'Weather' },
  { id: 'Clock', label: 'Clock' },
  { id: 'Compass', label: 'Compass' },
  { id: 'Folder', label: 'Folder' },
  { id: 'Calendar', label: 'Calendar' },
  { id: 'FileText', label: 'Notes' },
  { id: 'Radio', label: 'Radio' },
  { id: 'Wrench', label: 'Tools' },
  { id: 'Zap', label: 'Flashlight' },
  { id: 'Music', label: 'Music' },
  { id: 'CheckSquare', label: 'Tasks' },
  { id: 'Heart', label: 'Health' },
  { id: 'Cpu', label: 'CPU' },
  { id: 'BookOpen', label: 'Reader' },
  { id: 'Camera', label: 'Camera' },
  { id: 'Coffee', label: 'Coffee' },
  { id: 'Globe', label: 'Browser' },
  { id: 'Phone', label: 'Phone' },
  { id: 'Terminal', label: 'Terminal' },
  { id: 'Bookmark', label: 'Bookmark' },
  { id: 'HelpCircle', label: 'Help' },
  { id: 'MessageSquare', label: 'Message' },
  { id: 'CreditCard', label: 'Card' },
  { id: 'Image', label: 'Gallery' },
  { id: 'Coins', label: 'Coins' },
  { id: 'Instagram', label: 'Social' },
  { id: 'Mail', label: 'Mail' },
  { id: 'Settings', label: 'Settings' },
  { id: 'Lock', label: 'Lock' },
];

export const DISGUISE_PALETTE = [
  { hex: '#334155', name: 'Slate' },
  { hex: '#1E293B', name: 'Dark Slate' },
  { hex: '#2563EB', name: 'Royal Blue' },
  { hex: '#0284C7', name: 'Sky Blue' },
  { hex: '#059669', name: 'Emerald' },
  { hex: '#16A34A', name: 'Green' },
  { hex: '#D97706', name: 'Amber' },
  { hex: '#EA580C', name: 'Orange' },
  { hex: '#DC2626', name: 'Crimson' },
  { hex: '#E11D48', name: 'Rose' },
  { hex: '#7C3AED', name: 'Purple' },
  { hex: '#4F46E5', name: 'Indigo' },
  { hex: '#0D9488', name: 'Teal' },
  { hex: '#475569', name: 'Cool Gray' },
];

export function renderAppIcon(iconName: string, className: string = 'w-6 h-6 text-white'): React.ReactElement {
  switch (iconName) {
    case 'MessageSquare': return <MessageSquare className={className} />;
    case 'CreditCard': return <CreditCard className={className} />;
    case 'Image': return <ImageIcon className={className} />;
    case 'Coins': return <Coins className={className} />;
    case 'Instagram': return <Instagram className={className} />;
    case 'Mail': return <Mail className={className} />;
    case 'FileText': return <FileText className={className} />;
    case 'Settings': return <SettingsIcon className={className} />;
    case 'Calculator': return <Calculator className={className} />;
    case 'CloudSun': return <CloudSun className={className} />;
    case 'Clock': return <Clock className={className} />;
    case 'Compass': return <Compass className={className} />;
    case 'Folder': return <Folder className={className} />;
    case 'Calendar': return <Calendar className={className} />;
    case 'Radio': return <Radio className={className} />;
    case 'Wrench': return <Wrench className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Music': return <Music className={className} />;
    case 'CheckSquare': return <CheckSquare className={className} />;
    case 'Heart': return <Heart className={className} />;
    case 'Cpu': return <Cpu className={className} />;
    case 'BookOpen': return <BookOpen className={className} />;
    case 'Camera': return <Camera className={className} />;
    case 'Coffee': return <Coffee className={className} />;
    case 'Globe': return <Globe className={className} />;
    case 'Phone': return <Phone className={className} />;
    case 'Terminal': return <Terminal className={className} />;
    case 'Bookmark': return <Bookmark className={className} />;
    case 'HelpCircle': return <HelpCircle className={className} />;
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    default: return <Lock className={className} />;
  }
}

/**
 * Returns effective display properties for an app, factoring in disguise overrides
 */
export function getAppDisplayProperties(app: AppItem, useDisguise: boolean = true) {
  if (useDisguise && app.disguiseIcon) {
    return {
      iconName: app.disguiseIcon,
      displayName: app.disguiseName || app.name,
      accentColor: app.disguiseColor || app.accentColor,
      isDisguised: true,
      originalName: app.name,
      originalIcon: app.iconName,
      originalColor: app.accentColor,
    };
  }
  return {
    iconName: app.iconName,
    displayName: app.name,
    accentColor: app.accentColor,
    isDisguised: false,
    originalName: app.name,
    originalIcon: app.iconName,
    originalColor: app.accentColor,
  };
}
