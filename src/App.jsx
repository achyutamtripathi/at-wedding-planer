import React, { useState, useEffect, useMemo, useRef, Component } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  LayoutDashboard,
  Calendar,
  BookmarkCheck,
  PhoneCall,
  Users,
  Utensils,
  Wallet,
  CheckSquare,
  ShieldCheck,
  LogOut,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Upload,
  Download,
  Copy,
  Check,
  X,
  Camera,
  Image as ImageIcon,
  Eye,
  Clock,
  MapPin,
  Phone,
  AlertCircle,
  Key,
  Menu as MenuIcon,
  UserCheck,
  Activity,
  Heart,
  Crown,
  Building2,
  Video,
  Link as LinkIcon,
  Share2,
  ExternalLink,
  FileImage,
  Cloud,
  CloudOff,
  RefreshCw,
} from 'lucide-react';

// ==========================================
// SUPABASE CLOUD SYNC CONFIGURATION
// ==========================================
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const CLOUD_ROW_ID = 'at_wedding_planner_main_v1';

// ==========================================
// ERROR BOUNDARY (PREVENTS WHITE SCREEN)
// ==========================================
class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || 'Unexpected rendering error' };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-stone-200 shadow-xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <h2 className="text-lg font-bold text-stone-900">Something went wrong</h2>
            <p className="text-xs text-stone-600">{this.state.errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2.5 rounded-xl bg-[#7A1C24] text-white text-sm font-semibold hover:bg-[#5E141B]"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ==========================================
// BRANDING LOGOS: AT WEDDING PLANNER & KRISHNA GROUPS
// ==========================================
function ATLogo({ size = 44, className = '' }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-2xl bg-[#050505] border border-[#C59B27]/50 flex items-center justify-center shadow-md shrink-0 overflow-hidden select-none ${className}`}
      title="AT Wedding Planner"
    >
      <svg viewBox="0 0 120 120" className="w-[78%] h-[78%]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M57 38C45 34 32 39 27 49C24 55 29 59 34 55C39 50 45 45 56 42L57 38Z"
          fill="#FFFFFF"
        />
        <path
          d="M64 31L74 25V47H88V54H74V77C74 84 78 87 84 87C87 87 90 86 92 85L91 91C86 95 79 97 73 96C65 95 62 89 62 80V55C48 61 39 68 39 76C39 84 46 89 55 88C60 87 63 85 66 83L67 87C61 94 52 98 42 97C31 96 24 88 25 77C26 65 38 57 59 50L38 51L40 47L62 46V33L64 31Z"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
}

function KGLogo({ size = 36, className = '' }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full bg-[#060B14] border border-sky-500/40 flex items-center justify-center shadow-sm shrink-0 overflow-hidden ${className}`}
      title="Krishna Groups"
    >
      <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="kgBlueGrad" x1="15" y1="15" x2="105" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="45%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>
        <path
          d="M22 68C18 42 36 18 64 16C88 14 106 30 108 52"
          stroke="url(#kgBlueGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M98 54C102 80 84 102 56 104C32 106 14 90 12 68"
          stroke="url(#kgBlueGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M32 39V81M32 60L53 39M41 52L63 81"
          stroke="#60A5FA"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M86 46C81 40 72 38 64 42C55 46 51 56 54 66C57 76 67 82 77 80C84 78 88 73 89 66H75"
          stroke="#93C5FD"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ==========================================
// CONSTANTS & DEFAULT CLEAN STATE
// ==========================================
const STORAGE_KEY = 'at_wedding_planner_stable_v1';

const MODULES = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'events', label: 'Events', icon: Calendar },
  { key: 'bookings', label: 'Bookings', icon: BookmarkCheck },
  { key: 'guests', label: 'Guests & Cards', icon: Users },
  { key: 'invites', label: 'Invites & Media', icon: FileImage },
  { key: 'menu', label: 'Menu List', icon: Utensils },
  { key: 'expenses', label: 'Expenses', icon: Wallet },
  { key: 'tasks', label: 'Work Balancing', icon: CheckSquare },
];

const EVENT_PRESETS = [
  'Roka',
  'Tilak',
  'Haldi',
  'Mehendi',
  'Sangeet',
  'Baraat & Wedding Ceremony',
  'Vidaai',
  'Reception',
];

const BOOKING_CATEGORIES = [
  'Venue & Banquet Hall',
  'Catering & Halwai',
  'Tent, Lighting & Decor',
  'Photography & Videography',
  'DJ, Sound & Entertainment',
  'Pandit & Rituals',
  'Makeup & Mehendi Artist',
  'Band, Ghodi & Dhol',
  'Hotel & Guest Accommodation',
  'Transport & Luxury Cars',
  'Travel & Tickets',
  'Jewellery & Attire',
  'Miscellaneous',
];
const BOOKING_STATUSES = [
  'Confirmed',
  'Token Paid',
  'Enquiry / Hold',
  'Completed',
  'Cancelled',
];

const GUEST_SIDES = ["Groom's Side", "Bride's Side", 'Mutual'];
const GUEST_GROUPS = ['Immediate Family', 'Relatives', 'Friends', 'Colleagues', 'VIP'];
const CARD_STATUSES = [
  'Not Sent',
  'Digital Invite Sent',
  'Physical Card Handed Over',
  'Couriered',
];
const RSVP_STATUSES = ['Pending', 'Confirmed', 'Declined'];

const MEDIA_TYPES = ['Wedding Card', 'Invitation Poster', 'Invitation Video', 'Save the Date', 'Web Link / Microsite'];

const MENU_EVENTS = ['Haldi', 'Mehendi', 'Sangeet', 'Wedding', 'Reception'];
const MENU_COURSES = [
  'Welcome Drinks',
  'Starters / Chaat Counter',
  'Main Course',
  'Breads & Rice',
  'Desserts & Sweets',
  'Live Counters',
];
const DIETARY_TAGS = ['Pure Veg', 'Jain', 'No Onion/Garlic'];
const DISH_STATUSES = ['Shortlisted', 'Finalized', 'Rejected'];

const EXPENSE_CATEGORIES = [
  'Venue',
  'Catering',
  'Decor',
  'Photography & Videography',
  'Attire & Jewelry',
  'Invitation Cards',
  'Travel & Accommodation',
  'Gifts & Shagun',
  'Miscellaneous',
];
const PAYMENT_MODES = ['UPI', 'Bank Transfer', 'Cash', 'Card'];
const PAYMENT_STATUSES = ['Paid', 'Partial', 'Unpaid', 'Overdue'];

const TASK_DEPARTMENTS = [
  'Catering',
  'Guest Logistics & Pickup',
  'Pandit & Rituals',
  'Decor & Stage',
  'Shagun & Gifts',
  'Photography & Media',
];
const TASK_PRIORITIES = ['High', 'Medium', 'Low'];
const TASK_STATUSES = ['To-Do', 'In Progress', 'Done'];

const fullPermissions = () => {
  const perms = {};
  MODULES.forEach((m) => {
    perms[m.key] = { enabled: true, readOnly: false, add: true, update: true, delete: true };
  });
  return perms;
};

const defaultMemberPermissions = () => {
  const perms = {};
  MODULES.forEach((m) => {
    perms[m.key] = {
      enabled: m.key === 'dashboard' || m.key === 'guests' || m.key === 'invites',
      readOnly: m.key === 'dashboard',
      add: m.key !== 'dashboard',
      update: m.key !== 'dashboard',
      delete: false,
    };
  });
  return perms;
};

const DEFAULT_USERS = [
  {
    id: 'user_super_admin',
    name: 'Super Admin',
    username: 'admin',
    password: 'password',
    role: 'super_admin',
    avatar: '',
    active: true,
    assignedWeddingIds: [],
    permissions: fullPermissions(),
  },
];

// Zero demo data & zero default weddings
const DEFAULT_STATE = {
  weddings: [],
  activeWeddingId: '',
  users: DEFAULT_USERS,
  events: [],
  bookings: [],
  guests: [],
  invites: [],
  menu: [],
  expenses: [],
  tasks: [],
  auditLogs: [],
};

// ==========================================
// UTILITY HELPERS
// ==========================================
const uid = (prefix = 'id') => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const formatINR = (num) => {
  const n = Number(num) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
};

const normalizePhone = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
};

const compressImageFile = (file, maxWidth = 850, quality = 0.72) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

function parseCSV(text) {
  const rows = [];
  let row = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
    } else if ((char === '\n' || (char === '\r' && next === '\n')) && !inQuotes) {
      if (char === '\r') i++;
      row.push(current.trim());
      if (row.some((cell) => cell !== '')) rows.push(row);
      row = [];
      current = '';
    } else {
      current += char;
    }
  }
  row.push(current.trim());
  if (row.some((cell) => cell !== '')) rows.push(row);
  if (rows.length === 0) return { headers: [], data: [] };
  const headers = rows[0];
  const data = rows.slice(1).map((r) => {
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = r[idx] !== undefined ? r[idx] : '';
    });
    return obj;
  });
  return { headers, data };
}

function downloadCSVFile(filename, headers, rows) {
  const escapeCell = (val) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const csvLines = [
    headers.map(escapeCell).join(','),
    ...rows.map((r) => headers.map((h) => escapeCell(r[h])).join(',')),
  ];
  const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ==========================================
// SHARED REUSABLE UI COMPONENTS
// ==========================================
function UserAvatar({ name = 'U', avatar = '', size = 'md' }) {
  const dims =
    size === 'xs'
      ? 'w-6 h-6 text-[10px]'
      : size === 'sm'
      ? 'w-8 h-8 text-xs'
      : size === 'lg'
      ? 'w-14 h-14 text-lg'
      : 'w-10 h-10 text-sm';

  const initials = String(name || 'U')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${dims} rounded-full object-cover border border-amber-300/60 shrink-0 bg-stone-100`}
      />
    );
  }
  return (
    <div
      className={`${dims} rounded-full bg-gradient-to-br from-[#7A1C24] to-[#C59B27] text-white font-bold flex items-center justify-center shrink-0 shadow-sm`}
    >
      {initials || 'U'}
    </div>
  );
}

function DropdownWithOther({
  label,
  value,
  onChange,
  options = [],
  required = false,
  placeholder = 'Specify custom value...',
}) {
  const isCustom = value !== '' && !options.includes(value);
  const [showOtherInput, setShowOtherInput] = useState(isCustom);

  useEffect(() => {
    if (value !== '' && !options.includes(value)) {
      setShowOtherInput(true);
    } else if (options.includes(value)) {
      setShowOtherInput(false);
    }
  }, [value, options]);

  const selectValue = showOtherInput ? '__OTHER__' : value;

  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-stone-700 mb-1">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <select
        required={required}
        value={selectValue}
        onChange={(e) => {
          const val = e.target.value;
          if (val === '__OTHER__') {
            setShowOtherInput(true);
            onChange('');
          } else {
            setShowOtherInput(false);
            onChange(val);
          }
        }}
        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#7A1C24] focus:border-transparent"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
        <option value="__OTHER__">Other (Specify...)</option>
      </select>

      {showOtherInput && (
        <input
          type="text"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-2 w-full px-3 py-2 border border-amber-300 bg-amber-50/40 rounded-lg text-sm focus:ring-2 focus:ring-[#7A1C24] focus:border-transparent"
        />
      )}
    </div>
  );
}

function SortableHeader({ label, sortKey, currentSort, onSort, align = 'left' }) {
  const isActive = currentSort.key === sortKey;
  return (
    <th
      onClick={() => onSort(sortKey)}
      className={`px-3 py-3 text-xs font-semibold uppercase tracking-wider text-stone-600 cursor-pointer select-none hover:bg-stone-100/80 transition ${
        align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
      }`}
    >
      <div
        className={`inline-flex items-center gap-1 ${
          align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'
        }`}
      >
        <span>{label}</span>
        {isActive ? (
          currentSort.dir === 'asc' ? (
            <ArrowUp size={13} className="text-[#7A1C24]" />
          ) : (
            <ArrowDown size={13} className="text-[#7A1C24]" />
          )
        ) : (
          <ArrowUpDown size={12} className="text-stone-400" />
        )}
      </div>
    </th>
  );
}

function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-xl' }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div
        className={`bg-white rounded-2xl shadow-2xl border border-stone-200 w-full ${maxWidth} overflow-hidden my-auto`}
      >
        <div className="px-5 py-4 bg-gradient-to-r from-[#7A1C24] to-[#591218] text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base sm:text-lg leading-tight">{title}</h3>
            {subtitle && <p className="text-xs text-amber-200 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/15 text-white transition"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5 max-h-[82vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete' }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
            <AlertCircle size={20} />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-base">{title}</h4>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function ToastBanner({ toast, onClose }) {
  if (!toast) return null;
  const isError = toast.type === 'error';
  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 max-w-sm animate-bounce">
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl border text-xs font-semibold ${
          isError
            ? 'bg-red-900 text-white border-red-700'
            : 'bg-stone-900 text-white border-amber-500/40'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
        <span className="flex-1">{toast.message}</span>
        <button onClick={onClose} className="text-stone-400 hover:text-white">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

// ==========================================
// LOGIN SCREEN (CLEAN — NO CREDENTIALS SHOWN)
// ==========================================
function LoginScreen({ users = [], onLogin, cloudStatus }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const safeUsers = Array.isArray(users) && users.length > 0 ? users : DEFAULT_USERS;
    const found = safeUsers.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );
    if (!found) {
      setError('Invalid username or password.');
      return;
    }
    if (!found.active) {
      setError('Your account has been disabled. Please contact the Super Admin.');
      return;
    }
    setError('');
    onLogin(found.id);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between p-4">
      <div className="flex justify-end max-w-5xl w-full mx-auto pt-2">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
            cloudStatus === 'connected'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-stone-100 text-stone-600 border-stone-200'
          }`}
        >
          {cloudStatus === 'connected' ? <Cloud size={12} /> : <CloudOff size={12} />}
          {cloudStatus === 'connected' ? 'Cloud Sync Active' : 'Local Mode'}
        </span>
      </div>

      <div className="max-w-md w-full mx-auto my-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200/80 overflow-hidden">
          <div className="bg-gradient-to-br from-[#7A1C24] via-[#64151C] to-[#3F0B10] px-6 py-8 text-center text-white relative">
            <div className="flex justify-center mb-3">
              <ATLogo size={64} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">AT Wedding Planner</h1>
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-black/25 border border-amber-300/30">
              <KGLogo size={20} />
              <span className="text-xs font-medium text-amber-200 tracking-wide">
                A Venture of Krishna Groups
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Member Sign In</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Enter your assigned credentials to access your wedding workspace.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Username</label>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-[#7A1C24] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-[#7A1C24] focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#7A1C24] hover:bg-[#5E141B] text-white font-semibold text-sm shadow-md transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>

      <footer className="text-center py-3 text-xs text-stone-500 flex items-center justify-center gap-2">
        <KGLogo size={18} />
        <span>Powered by Krishna Groups • AT Wedding Planner</span>
      </footer>
    </div>
  );
}

// ==========================================
// MAIN APPLICATION
// ==========================================
export default function App() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.users) && parsed.users.length > 0) {
          return {
            ...DEFAULT_STATE,
            ...parsed,
            weddings: Array.isArray(parsed.weddings) ? parsed.weddings : [],
            events: Array.isArray(parsed.events) ? parsed.events : [],
            bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
            guests: Array.isArray(parsed.guests) ? parsed.guests : [],
            invites: Array.isArray(parsed.invites) ? parsed.invites : [],
            menu: Array.isArray(parsed.menu) ? parsed.menu : [],
            expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
            tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
            auditLogs: Array.isArray(parsed.auditLogs) ? parsed.auditLogs : [],
          };
        }
      }
    } catch {
      // ignore corrupted storage
    }
    return DEFAULT_STATE;
  });

  const [currentUserId, setCurrentUserId] = useState(() => {
    try {
      return localStorage.getItem(`${STORAGE_KEY}_uid`) || null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [weddingModalOpen, setWeddingModalOpen] = useState(false);
  const [editingWedding, setEditingWedding] = useState(null);
  const [deleteWeddingTarget, setDeleteWeddingTarget] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [cloudStatus, setCloudStatus] = useState(supabase ? 'connecting' : 'local');
  const isRemoteUpdateRef = useRef(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Initial Supabase Load + Real-Time Subscription
  useEffect(() => {
    if (!supabase) return;
    let channel = null;

    const loadCloudState = async () => {
      try {
        const { data, error } = await supabase
          .from('app_state')
          .select('payload')
          .eq('id', CLOUD_ROW_ID)
          .maybeSingle();

        if (error) {
          console.error('Supabase fetch error:', error);
          setCloudStatus('error');
          return;
        }
        if (data?.payload) {
          isRemoteUpdateRef.current = true;
          setState((prev) => ({
            ...DEFAULT_STATE,
            ...data.payload,
            activeWeddingId: prev.activeWeddingId || data.payload.activeWeddingId || '',
          }));
        }
        setCloudStatus('connected');
      } catch {
        setCloudStatus('error');
      }
    };

    loadCloudState();

    channel = supabase
      .channel('at_wedding_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'app_state', filter: `id=eq.${CLOUD_ROW_ID}` },
        (payload) => {
          if (payload?.new?.payload) {
            isRemoteUpdateRef.current = true;
            setState((prev) => ({
              ...DEFAULT_STATE,
              ...payload.new.payload,
              activeWeddingId: prev.activeWeddingId || payload.new.payload.activeWeddingId || '',
            }));
          }
        }
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  // Persist to localStorage & sync to Supabase
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota limits
    }

    if (!supabase) return;
    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('app_state')
          .upsert({ id: CLOUD_ROW_ID, payload: state, updated_at: new Date().toISOString() });
        if (!error) setCloudStatus('connected');
      } catch {
        // ignore transient network drop
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [state]);

  useEffect(() => {
    try {
      if (currentUserId) localStorage.setItem(`${STORAGE_KEY}_uid`, currentUserId);
      else localStorage.removeItem(`${STORAGE_KEY}_uid`);
    } catch {
      // ignore storage errors
    }
  }, [currentUserId]);

  const currentUser = useMemo(() => {
    const users = Array.isArray(state.users) ? state.users : DEFAULT_USERS;
    return users.find((u) => u.id === currentUserId) || null;
  }, [state.users, currentUserId]);

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isSubAdmin = currentUser?.role === 'sub_admin';

  // Accessible weddings for current user
  const accessibleWeddings = useMemo(() => {
    if (!currentUser) return [];
    if (isSuperAdmin) return state.weddings;
    const allowedIds = Array.isArray(currentUser.assignedWeddingIds)
      ? currentUser.assignedWeddingIds
      : [];
    return state.weddings.filter((w) => allowedIds.includes(w.id));
  }, [currentUser, isSuperAdmin, state.weddings]);

  const activeWedding = useMemo(() => {
    if (accessibleWeddings.length === 0) return null;
    return (
      accessibleWeddings.find((w) => w.id === state.activeWeddingId) || accessibleWeddings[0]
    );
  }, [accessibleWeddings, state.activeWeddingId]);

  useEffect(() => {
    if (activeWedding && activeWedding.id !== state.activeWeddingId) {
      setState((prev) => ({ ...prev, activeWeddingId: activeWedding.id }));
    }
  }, [activeWedding, state.activeWeddingId]);

  // Permissions helper for current user
  const getModulePerms = (modKey) => {
    if (!currentUser) return { enabled: false, readOnly: true, add: false, update: false, delete: false };
    if (isSuperAdmin || isSubAdmin) {
      return { enabled: true, readOnly: false, add: true, update: true, delete: true };
    }
    const p = currentUser.permissions?.[modKey];
    if (!p || !p.enabled) {
      return { enabled: false, readOnly: true, add: false, update: false, delete: false };
    }
    if (p.readOnly) {
      return { enabled: true, readOnly: true, add: false, update: false, delete: false };
    }
    return {
      enabled: true,
      readOnly: false,
      add: Boolean(p.add),
      update: Boolean(p.update),
      delete: Boolean(p.delete),
    };
  };

  const visibleModules = useMemo(() => {
    return MODULES.filter((m) => getModulePerms(m.key).enabled);
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const specialTabs = ['users', 'weddings'];
    if (specialTabs.includes(activeTab)) return;
    if (!visibleModules.some((m) => m.key === activeTab)) {
      setActiveTab(visibleModules[0]?.key || 'dashboard');
    }
  }, [currentUser, activeTab, visibleModules]);

  // Audit logger helper
  const recordAudit = (moduleName, action, details, weddingIdOverride = null) => {
    if (!currentUser) return;
    const targetWeddingId = weddingIdOverride || activeWedding?.id || '';
    const targetWedding = state.weddings.find((w) => w.id === targetWeddingId);
    const logEntry = {
      id: uid('log'),
      weddingId: targetWeddingId,
      weddingTitle: targetWedding?.title || 'System',
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar || '',
      userRole: currentUser.role,
      module: moduleName,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      auditLogs: [logEntry, ...(prev.auditLogs || [])].slice(0, 500),
    }));
  };

  const stampUser = (existingItem = null) => {
    const now = new Date().toISOString();
    const actor = {
      id: currentUser?.id || 'system',
      name: currentUser?.name || 'Admin',
      avatar: currentUser?.avatar || '',
    };
    if (!existingItem) {
      return { createdBy: actor, createdAt: now, updatedBy: actor, updatedAt: now };
    }
    return {
      createdBy: existingItem.createdBy || actor,
      createdAt: existingItem.createdAt || now,
      updatedBy: actor,
      updatedAt: now,
    };
  };

  // Wedding CRUD (Super Admin Only)
  const handleSaveWedding = (form) => {
    if (!isSuperAdmin) return;
    if (editingWedding) {
      setState((prev) => ({
        ...prev,
        weddings: prev.weddings.map((w) => (w.id === editingWedding.id ? { ...w, ...form } : w)),
      }));
      recordAudit('Weddings', 'Updated', `Updated wedding "${form.title}"`, editingWedding.id);
      showToast('Wedding plan updated');
    } else {
      const newWedding = {
        id: uid('wed'),
        ...form,
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        weddings: [...prev.weddings, newWedding],
        activeWeddingId: newWedding.id,
      }));
      recordAudit('Weddings', 'Created', `Created wedding "${form.title}"`, newWedding.id);
      showToast('New wedding plan created');
    }
    setWeddingModalOpen(false);
    setEditingWedding(null);
  };

  const handleConfirmDeleteWedding = () => {
    if (!isSuperAdmin || !deleteWeddingTarget) return;
    const targetId = deleteWeddingTarget.id;
    const title = deleteWeddingTarget.title;
    setState((prev) => {
      const remaining = prev.weddings.filter((w) => w.id !== targetId);
      return {
        ...prev,
        weddings: remaining,
        activeWeddingId: prev.activeWeddingId === targetId ? remaining[0]?.id || '' : prev.activeWeddingId,
        events: prev.events.filter((e) => e.weddingId !== targetId),
        bookings: (prev.bookings || []).filter((b) => b.weddingId !== targetId),
        guests: prev.guests.filter((g) => g.weddingId !== targetId),
        invites: prev.invites.filter((i) => i.weddingId !== targetId),
        menu: prev.menu.filter((m) => m.weddingId !== targetId),
        expenses: prev.expenses.filter((x) => x.weddingId !== targetId),
        tasks: prev.tasks.filter((t) => t.weddingId !== targetId),
      };
    });
    recordAudit('Weddings', 'Deleted', `Deleted wedding "${title}"`, targetId);
    showToast('Wedding plan deleted');
    setDeleteWeddingTarget(null);
  };

  // Countdown calculation for active wedding
  const countdown = useMemo(() => {
    if (!activeWedding?.date) return null;
    const target = new Date(`${activeWedding.date}T00:00:00`);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  }, [activeWedding]);

  if (!currentUser) {
    return (
      <LoginScreen
        users={state.users}
        onLogin={(userId) => {
          setCurrentUserId(userId);
          setActiveTab('dashboard');
        }}
        cloudStatus={cloudStatus}
      />
    );
  }

  // Scoped records for active wedding
  const weddingEvents = state.events.filter((e) => e.weddingId === activeWedding?.id);
  const weddingBookings = (state.bookings || []).filter((b) => b.weddingId === activeWedding?.id);
  const weddingGuests = state.guests.filter((g) => g.weddingId === activeWedding?.id);
  const weddingInvites = state.invites.filter((i) => i.weddingId === activeWedding?.id);
  const weddingMenu = state.menu.filter((m) => m.weddingId === activeWedding?.id);
  const weddingExpenses = state.expenses.filter((x) => x.weddingId === activeWedding?.id);
  const weddingTasks = state.tasks.filter((t) => t.weddingId === activeWedding?.id);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col lg:flex-row">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex lg:w-68 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-stone-200/90 shadow-xs z-30">
        {/* Brand Header */}
        <div className="p-4 border-b border-stone-200/80 bg-gradient-to-br from-[#7A1C24] to-[#561117] text-white">
          <div className="flex items-center gap-3">
            <ATLogo size={42} />
            <div className="min-w-0">
              <h1 className="font-bold text-base tracking-tight truncate">AT Wedding Planner</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <KGLogo size={16} />
                <span className="text-[11px] text-amber-200 truncate">Krishna Groups</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Wedding Switcher */}
        <div className="p-3 border-b border-stone-200/80 bg-stone-50/70">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Active Wedding Workspace
          </label>
          {accessibleWeddings.length > 0 ? (
            <select
              value={activeWedding?.id || ''}
              onChange={(e) => setState((prev) => ({ ...prev, activeWeddingId: e.target.value }))}
              className="w-full px-2.5 py-2 rounded-xl border border-stone-300 bg-white text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-[#7A1C24]"
            >
              {accessibleWeddings.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.title}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-xs text-stone-500 italic py-1">No wedding plan yet</div>
          )}

          {isSuperAdmin && (
            <button
              onClick={() => {
                setEditingWedding(null);
                setWeddingModalOpen(true);
              }}
              className="mt-2 w-full py-1.5 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#7A1C24] border border-amber-300/80 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Plus size={14} /> Add Wedding Plan
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {visibleModules.map((mod) => {
            const Icon = mod.icon;
            const active = activeTab === mod.key;
            return (
              <button
                key={mod.key}
                onClick={() => setActiveTab(mod.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                  active
                    ? 'bg-[#7A1C24] text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Icon size={18} className={active ? 'text-amber-300' : 'text-stone-500'} />
                <span>{mod.label}</span>
              </button>
            );
          })}

          {(isSuperAdmin || isSubAdmin) && (
            <div className="pt-3 mt-3 border-t border-stone-200 space-y-1">
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Administration
              </div>
              {isSuperAdmin && (
                <button
                  onClick={() => setActiveTab('weddings')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                    activeTab === 'weddings'
                      ? 'bg-[#7A1C24] text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Heart
                    size={18}
                    className={activeTab === 'weddings' ? 'text-amber-300' : 'text-stone-500'}
                  />
                  <span>Manage Weddings</span>
                </button>
              )}
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                  activeTab === 'users'
                    ? 'bg-[#7A1C24] text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <ShieldCheck
                  size={18}
                  className={activeTab === 'users' ? 'text-amber-300' : 'text-stone-500'}
                />
                <span>Users & Permissions</span>
              </button>
            </div>
          )}
        </nav>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-stone-200 bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <UserAvatar name={currentUser.name} avatar={currentUser.avatar} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-stone-900 truncate">{currentUser.name}</p>
              <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-[#7A1C24]">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
            <button
              onClick={() => setProfileModalOpen(true)}
              title="Edit Profile & Password"
              className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-200/70 transition"
            >
              <Key size={15} />
            </button>
            <button
              onClick={() => setCurrentUserId(null)}
              title="Sign Out"
              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT SHELL */}
      <div className="flex-1 lg:pl-68 flex flex-col min-h-screen pb-20 lg:pb-0">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-stone-200 px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-stone-200 text-stone-700"
            >
              <MenuIcon size={18} />
            </button>
            <div className="lg:hidden">
              <ATLogo size={34} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm sm:text-base text-stone-900 truncate">
                  {activeWedding ? activeWedding.title : 'AT Wedding Planner'}
                </h2>
                {activeWedding?.city && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs text-stone-500">
                    <MapPin size={12} /> {activeWedding.city}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 truncate">
                {activeWedding
                  ? `${activeWedding.coupleNames || 'Wedding Workspace'}${
                      activeWedding.date ? ` • ${activeWedding.date}` : ''
                    }`
                  : 'Krishna Groups • Select or create a wedding workspace'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {countdown !== null && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300/80 text-[#7A1C24] text-xs font-bold">
                <Clock size={14} />
                <span>
                  {countdown > 0
                    ? `${countdown} Days to Go`
                    : countdown === 0
                    ? 'Wedding Day!'
                    : `${Math.abs(countdown)} Days Since`}
                </span>
              </div>
            )}

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border ${
                cloudStatus === 'connected'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-stone-100 text-stone-600 border-stone-200'
              }`}
              title={
                cloudStatus === 'connected'
                  ? 'Real-time Supabase cloud sync active'
                  : 'Saved in local browser storage'
              }
            >
              {cloudStatus === 'connected' ? <Cloud size={13} /> : <CloudOff size={13} />}
              <span className="hidden md:inline">
                {cloudStatus === 'connected' ? 'Cloud Synced' : 'Local Storage'}
              </span>
            </span>

            <button
              onClick={() => setProfileModalOpen(true)}
              className="lg:hidden p-1 rounded-full"
              title="Profile"
            >
              <UserAvatar name={currentUser.name} avatar={currentUser.avatar} size="sm" />
            </button>
          </div>
        </header>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[85vw] bg-white h-full flex flex-col shadow-2xl z-10">
              <div className="p-4 bg-[#7A1C24] text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ATLogo size={36} />
                  <div>
                    <div className="font-bold text-sm">AT Wedding Planner</div>
                    <div className="text-[10px] text-amber-200">Krishna Groups</div>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1">
                  <X size={18} />
                </button>
              </div>

              <div className="p-3 border-b border-stone-200 bg-stone-50">
                <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                  Active Wedding
                </label>
                {accessibleWeddings.length > 0 ? (
                  <select
                    value={activeWedding?.id || ''}
                    onChange={(e) => {
                      setState((prev) => ({ ...prev, activeWeddingId: e.target.value }));
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-2.5 py-2 rounded-lg border border-stone-300 bg-white text-xs font-semibold"
                  >
                    {accessibleWeddings.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-xs text-stone-500">No wedding created</div>
                )}
                {isSuperAdmin && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setEditingWedding(null);
                      setWeddingModalOpen(true);
                    }}
                    className="mt-2 w-full py-1.5 rounded-lg bg-amber-100 text-[#7A1C24] text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <Plus size={14} /> Add Wedding Plan
                  </button>
                )}
              </div>

              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {visibleModules.map((mod) => {
                  const Icon = mod.icon;
                  const active = activeTab === mod.key;
                  return (
                    <button
                      key={mod.key}
                      onClick={() => {
                        setActiveTab(mod.key);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                        active ? 'bg-[#7A1C24] text-white' : 'text-stone-700'
                      }`}
                    >
                      <Icon size={17} />
                      <span>{mod.label}</span>
                    </button>
                  );
                })}
                {isSuperAdmin && (
                  <button
                    onClick={() => {
                      setActiveTab('weddings');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                      activeTab === 'weddings' ? 'bg-[#7A1C24] text-white' : 'text-stone-700'
                    }`}
                  >
                    <Heart size={17} />
                    <span>Manage Weddings</span>
                  </button>
                )}
                {(isSuperAdmin || isSubAdmin) && (
                  <button
                    onClick={() => {
                      setActiveTab('users');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                      activeTab === 'users' ? 'bg-[#7A1C24] text-white' : 'text-stone-700'
                    }`}
                  >
                    <ShieldCheck size={17} />
                    <span>Users & Permissions</span>
                  </button>
                )}
              </nav>

              <div className="p-3 border-t border-stone-200 flex items-center justify-between">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setProfileModalOpen(true);
                  }}
                  className="text-xs font-semibold text-stone-700 flex items-center gap-1.5"
                >
                  <Key size={14} /> Profile & Password
                </button>
                <button
                  onClick={() => setCurrentUserId(null)}
                  className="text-xs font-semibold text-red-600 flex items-center gap-1"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WORKSPACE BODY */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'weddings' && isSuperAdmin ? (
            <WeddingsManager
              weddings={state.weddings}
              activeWeddingId={activeWedding?.id}
              onSelect={(id) => {
                setState((prev) => ({ ...prev, activeWeddingId: id }));
                setActiveTab('dashboard');
              }}
              onAdd={() => {
                setEditingWedding(null);
                setWeddingModalOpen(true);
              }}
              onEdit={(w) => {
                setEditingWedding(w);
                setWeddingModalOpen(true);
              }}
              onDelete={(w) => setDeleteWeddingTarget(w)}
            />
          ) : activeTab === 'users' && (isSuperAdmin || isSubAdmin) ? (
            <UsersAdminModule
              state={state}
              setState={setState}
              currentUser={currentUser}
              accessibleWeddings={accessibleWeddings}
              recordAudit={recordAudit}
              showToast={showToast}
            />
          ) : !activeWedding ? (
            <NoWeddingEmptyState
              isSuperAdmin={isSuperAdmin}
              onCreateWedding={() => {
                setEditingWedding(null);
                setWeddingModalOpen(true);
              }}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardModule
                  activeWedding={activeWedding}
                  events={weddingEvents}
                  bookings={weddingBookings}
                  guests={weddingGuests}
                  invites={weddingInvites}
                  menu={weddingMenu}
                  expenses={weddingExpenses}
                  tasks={weddingTasks}
                  auditLogs={state.auditLogs}
                  currentUser={currentUser}
                  onNavigate={setActiveTab}
                />
              )}
              {activeTab === 'events' && (
                <EventsModule
                  events={weddingEvents}
                  weddingId={activeWedding.id}
                  perms={getModulePerms('events')}
                  setState={setState}
                  stampUser={stampUser}
                  recordAudit={recordAudit}
                  showToast={showToast}
                />
              )}
              {activeTab === 'bookings' && (
                <BookingsModule
                  bookings={weddingBookings}
                  weddingId={activeWedding.id}
                  perms={getModulePerms('bookings')}
                  setState={setState}
                  stampUser={stampUser}
                  recordAudit={recordAudit}
                  showToast={showToast}
                />
              )}
              {activeTab === 'guests' && (
                <GuestsModule
                  guests={weddingGuests}
                  activeWedding={activeWedding}
                  perms={getModulePerms('guests')}
                  setState={setState}
                  stampUser={stampUser}
                  recordAudit={recordAudit}
                  showToast={showToast}
                />
              )}
              {activeTab === 'invites' && (
                <InvitesMediaModule
                  invites={weddingInvites}
                  activeWedding={activeWedding}
                  perms={getModulePerms('invites')}
                  setState={setState}
                  stampUser={stampUser}
                  recordAudit={recordAudit}
                  showToast={showToast}
                />
              )}
              {activeTab === 'menu' && (
                <MenuModule
                  menu={weddingMenu}
                  weddingId={activeWedding.id}
                  perms={getModulePerms('menu')}
                  setState={setState}
                  stampUser={stampUser}
                  recordAudit={recordAudit}
                  showToast={showToast}
                />
              )}
              {activeTab === 'expenses' && (
                <ExpensesModule
                  expenses={weddingExpenses}
                  weddingId={activeWedding.id}
                  perms={getModulePerms('expenses')}
                  setState={setState}
                  stampUser={stampUser}
                  recordAudit={recordAudit}
                  showToast={showToast}
                />
              )}
              {activeTab === 'tasks' && (
                <TasksModule
                  tasks={weddingTasks}
                  users={state.users}
                  weddingId={activeWedding.id}
                  perms={getModulePerms('tasks')}
                  setState={setState}
                  stampUser={stampUser}
                  recordAudit={recordAudit}
                  showToast={showToast}
                />
              )}
            </>
          )}
        </main>

        {/* MOBILE BOTTOM NAVIGATION */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-stone-200 flex items-center justify-between overflow-x-auto px-1 py-1.5 z-30">
          {visibleModules.map((mod) => {
            const Icon = mod.icon;
            const active = activeTab === mod.key;
            return (
              <button
                key={mod.key}
                onClick={() => setActiveTab(mod.key)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-semibold ${
                  active ? 'text-[#7A1C24]' : 'text-stone-500'
                }`}
              >
                <Icon size={17} />
                <span className="truncate max-w-[64px]">{mod.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ADD / EDIT WEDDING MODAL (SUPER ADMIN) */}
      <WeddingFormModal
        isOpen={weddingModalOpen}
        onClose={() => {
          setWeddingModalOpen(false);
          setEditingWedding(null);
        }}
        initialData={editingWedding}
        onSave={handleSaveWedding}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteWeddingTarget)}
        title="Delete Wedding Plan?"
        message={`This will permanently delete "${deleteWeddingTarget?.title}" and all its events, guests, invites, menu, expenses, and tasks.`}
        onConfirm={handleConfirmDeleteWedding}
        onCancel={() => setDeleteWeddingTarget(null)}
      />

      {/* USER PROFILE & PASSWORD MODAL */}
      <ProfileSettingsModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={currentUser}
        onSave={(updates) => {
          setState((prev) => ({
            ...prev,
            users: prev.users.map((u) => (u.id === currentUser.id ? { ...u, ...updates } : u)),
          }));
          recordAudit('Profile', 'Updated', 'Updated profile photo or password');
          showToast('Profile updated successfully');
          setProfileModalOpen(false);
        }}
      />

      <ToastBanner toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

// ==========================================
// NO WEDDING EMPTY STATE
// ==========================================
function NoWeddingEmptyState({ isSuperAdmin, onCreateWedding }) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-8 sm:p-12 text-center max-w-xl mx-auto my-8 space-y-5">
      <div className="flex justify-center items-center gap-3">
        <ATLogo size={56} />
        <KGLogo size={42} />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold text-stone-900">Welcome to AT Wedding Planner</h2>
        <p className="text-xs font-semibold text-[#7A1C24] uppercase tracking-wider">
          Krishna Groups
        </p>
        <p className="text-sm text-stone-600 pt-2">
          {isSuperAdmin
            ? 'No wedding plan has been created yet. Create your first wedding workspace to start managing events, guests, cards, menu, expenses, and team tasks.'
            : 'No wedding workspace has been assigned to your account yet. Please contact the Super Admin.'}
        </p>
      </div>
      {isSuperAdmin && (
        <button
          onClick={onCreateWedding}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#7A1C24] hover:bg-[#5E141B] text-white text-sm font-semibold shadow-md transition"
        >
          <Plus size={18} /> Create First Wedding Plan
        </button>
      )}
    </div>
  );
}

// ==========================================
// WEDDING WORKSPACE MODAL & MANAGER (SUPER ADMIN)
// ==========================================
function WeddingFormModal({ isOpen, onClose, initialData, onSave }) {
  const [title, setTitle] = useState('');
  const [coupleNames, setCoupleNames] = useState('');
  const [date, setDate] = useState('');
  const [city, setCity] = useState('');
  const [venue, setVenue] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCoupleNames(initialData.coupleNames || '');
      setDate(initialData.date || '');
      setCity(initialData.city || '');
      setVenue(initialData.venue || '');
    } else {
      setTitle('');
      setCoupleNames('');
      setDate('');
      setCity('');
      setVenue('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      coupleNames: coupleNames.trim(),
      date,
      city: city.trim(),
      venue: venue.trim(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Wedding Plan' : 'Create New Wedding Plan'}
      subtitle="Super Admin Workspace Management"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Wedding Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter wedding title"
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Couple Names</label>
          <input
            type="text"
            value={coupleNames}
            onChange={(e) => setCoupleNames(e.target.value)}
            placeholder="Enter couple names"
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Main Wedding Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Primary Venue</label>
          <input
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="Enter primary venue"
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
          />
        </div>
        <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#7A1C24] text-white text-xs font-semibold hover:bg-[#5E141B]"
          >
            {initialData ? 'Save Changes' : 'Create Wedding'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function WeddingsManager({ weddings, activeWeddingId, onSelect, onAdd, onEdit, onDelete }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Manage Wedding Plans</h2>
          <p className="text-xs text-stone-500">
            Super Admin control to create, edit, switch, or delete wedding workspaces.
          </p>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7A1C24] text-white text-xs font-semibold shadow-sm hover:bg-[#5E141B]"
        >
          <Plus size={16} /> Add Wedding Plan
        </button>
      </div>

      {weddings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center space-y-3">
          <p className="text-sm text-stone-600">No wedding plans created yet.</p>
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7A1C24] text-white text-xs font-semibold"
          >
            <Plus size={15} /> Create First Wedding Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weddings.map((w) => {
            const isActive = w.id === activeWeddingId;
            return (
              <div
                key={w.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between space-y-4 ${
                  isActive ? 'border-[#7A1C24] ring-2 ring-[#7A1C24]/15' : 'border-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-stone-900">{w.title}</h3>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-[#7A1C24] text-[10px] font-bold">
                        Active
                      </span>
                    )}
                  </div>
                  {w.coupleNames && (
                    <p className="text-xs text-stone-600 mt-1 font-medium">{w.coupleNames}</p>
                  )}
                  <div className="mt-3 space-y-1 text-xs text-stone-500">
                    {w.date && (
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} /> {w.date}
                      </div>
                    )}
                    {w.city && (
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} /> {w.city} {w.venue ? `• ${w.venue}` : ''}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelect(w.id)}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold"
                  >
                    Open Workspace
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(w)}
                      className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
                      title="Edit"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(w)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ==========================================
// PROFILE & PASSWORD MODAL
// ==========================================
function ProfileSettingsModal({ isOpen, onClose, user, onSave }) {
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
      setNewPassword('');
    }
  }, [user, isOpen]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImageFile(file, 300, 0.8);
    setAvatar(compressed);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updates = { name: name.trim() || user.name, avatar };
    if (newPassword.trim()) {
      updates.password = newPassword.trim();
    }
    onSave(updates);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Profile & Password" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
          <UserAvatar name={name} avatar={avatar} size="lg" />
          <div className="space-y-1.5">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-800 cursor-pointer">
              <Camera size={14} /> Upload Display Picture
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
            {avatar && (
              <button
                type="button"
                onClick={() => setAvatar('')}
                className="block text-[11px] text-red-600 hover:underline"
              >
                Remove Photo
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Display Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            New Password (leave blank to keep current)
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#7A1C24] text-white text-xs font-semibold"
          >
            Save Profile
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ==========================================
// MODULE 0: DASHBOARD & ADMIN MASTER AUDIT LOG
// ==========================================
function DashboardModule({
  activeWedding,
  events,
  bookings = [],
  guests,
  invites,
  menu,
  expenses,
  tasks,
  auditLogs,
  currentUser,
  onNavigate,
}) {
  const [logSearch, setLogSearch] = useState('');
  const [logModuleFilter, setLogModuleFilter] = useState('ALL');

  const totalFamilies = guests.length;
  const totalHeadcount = guests.reduce(
    (sum, g) => sum + (Number(g.adults) || 0) + (Number(g.kids) || 0),
    0
  );
  const confirmedGuests = guests.filter((g) => g.rsvpStatus === 'Confirmed').length;
  const cardsSent = guests.filter((g) => g.cardStatus && g.cardStatus !== 'Not Sent').length;

  const totalCommitted = expenses.reduce((sum, x) => sum + (Number(x.totalAmount) || 0), 0);
  const totalPaid = expenses.reduce((sum, x) => sum + (Number(x.advancePaid) || 0), 0);
  const totalBalance = expenses.reduce(
    (sum, x) => sum + Math.max(0, (Number(x.totalAmount) || 0) - (Number(x.advancePaid) || 0)),
    0
  );

  const completedTasks = tasks.filter((t) => t.status === 'Done').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'Done').length;

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isSubAdmin = currentUser?.role === 'sub_admin';

  const visibleLogs = useMemo(() => {
    const base = isSuperAdmin
      ? auditLogs
      : auditLogs.filter((l) => l.weddingId === activeWedding.id);
    return base.filter((l) => {
      if (logModuleFilter !== 'ALL' && l.module !== logModuleFilter) return false;
      if (logSearch.trim()) {
        const q = logSearch.toLowerCase();
        return (
          l.userName?.toLowerCase().includes(q) ||
          l.details?.toLowerCase().includes(q) ||
          l.module?.toLowerCase().includes(q) ||
          l.weddingTitle?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [auditLogs, isSuperAdmin, activeWedding.id, logModuleFilter, logSearch]);

  return (
    <div className="space-y-6">
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('guests')}
          className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs hover:border-[#7A1C24]/50 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>GUESTS & CARDS</span>
            <Users size={16} className="text-[#7A1C24]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-stone-900">
            {totalHeadcount}{' '}
            <span className="text-xs font-normal text-stone-500">({totalFamilies} Families)</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-600">
            <span>Cards Sent: {cardsSent}</span>
            <span className="text-emerald-700 font-semibold">Confirmed: {confirmedGuests}</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('expenses')}
          className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs hover:border-[#7A1C24]/50 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>EXPENSES & PAYMENTS</span>
            <Wallet size={16} className="text-[#C59B27]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-stone-900">{formatINR(totalCommitted)}</div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-semibold">Paid: {formatINR(totalPaid)}</span>
            <span className="text-amber-700 font-semibold">Due: {formatINR(totalBalance)}</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('tasks')}
          className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs hover:border-[#7A1C24]/50 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>WORK BALANCING</span>
            <CheckSquare size={16} className="text-[#7A1C24]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-stone-900">
            {completedTasks}/{tasks.length}{' '}
            <span className="text-xs font-normal text-stone-500">Done</span>
          </div>
          <div className="mt-2 text-xs text-stone-600">Pending Tasks: {pendingTasks}</div>
        </div>

        <div
          onClick={() => onNavigate('invites')}
          className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs hover:border-[#7A1C24]/50 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>EVENTS & INVITE MEDIA</span>
            <FileImage size={16} className="text-[#C59B27]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-stone-900">
            {events.length} <span className="text-xs font-normal text-stone-500">Events</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-600">
            <span>Bookings: {bookings.length}</span>
            <span>Invites: {invites.length} • Menu: {menu.length}</span>
          </div>
        </div>
      </div>

      {/* UPCOMING EVENTS & PENDING EXPENSES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Calendar size={16} className="text-[#7A1C24]" /> Upcoming Ceremonies
            </h3>
            <button
              onClick={() => onNavigate('events')}
              className="text-xs font-semibold text-[#7A1C24] hover:underline"
            >
              View All
            </button>
          </div>
          {events.length === 0 ? (
            <p className="text-xs text-stone-500 py-6 text-center">No events added yet.</p>
          ) : (
            <div className="space-y-2.5">
              {events.slice(0, 4).map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-stone-900">{ev.name}</div>
                    <div className="text-[11px] text-stone-500">
                      {ev.date || 'Date TBD'} {ev.time ? `• ${ev.time}` : ''}{' '}
                      {ev.venue ? `• ${ev.venue}` : ''}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-[#7A1C24]">
                    {ev.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Wallet size={16} className="text-[#C59B27]" /> Category-Wise Spend Summary
            </h3>
            <button
              onClick={() => onNavigate('expenses')}
              className="text-xs font-semibold text-[#7A1C24] hover:underline"
            >
              Manage Expenses
            </button>
          </div>
          {expenses.length === 0 ? (
            <p className="text-xs text-stone-500 py-6 text-center">No expenses logged yet.</p>
          ) : (
            <div className="space-y-2.5">
              {Object.entries(
                expenses.reduce((acc, item) => {
                  const cat = item.category || 'Other';
                  acc[cat] = (acc[cat] || 0) + (Number(item.totalAmount) || 0);
                  return acc;
                }, {})
              )
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4)
                .map(([cat, amt]) => (
                  <div
                    key={cat}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 flex items-center justify-between"
                  >
                    <span className="text-xs font-semibold text-stone-800">{cat}</span>
                    <span className="text-xs font-bold text-[#7A1C24]">{formatINR(amt)}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* ADMIN & SUB-ADMIN MASTER ACTIVITY AUDIT LOG */}
      {(isSuperAdmin || isSubAdmin) && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Activity size={18} className="text-[#7A1C24]" /> Master Activity & Audit Log
              </h3>
              <p className="text-xs text-stone-500">
                Complete real-time log of everything added, updated, or deleted by any user.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  type="text"
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  placeholder="Search by user or action..."
                  className="pl-8 pr-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                />
              </div>
              <select
                value={logModuleFilter}
                onChange={(e) => setLogModuleFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs bg-white"
              >
                <option value="ALL">All Modules</option>
                <option value="Weddings">Weddings</option>
                <option value="Events">Events</option>
                <option value="Bookings">Bookings</option>
                <option value="Guests">Guests</option>
                <option value="Invites & Media">Invites & Media</option>
                <option value="Menu">Menu</option>
                <option value="Expenses">Expenses</option>
                <option value="Tasks">Tasks</option>
                <option value="Users">Users</option>
              </select>
            </div>
          </div>

          {visibleLogs.length === 0 ? (
            <p className="text-xs text-stone-500 py-6 text-center">No activity logged yet.</p>
          ) : (
            <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
              {visibleLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <UserAvatar name={log.userName} avatar={log.userAvatar} size="xs" />
                    <div className="min-w-0">
                      <p className="text-stone-800 truncate">
                        <span className="font-bold">{log.userName}</span>{' '}
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            log.action === 'Deleted'
                              ? 'bg-red-100 text-red-700'
                              : log.action === 'Created' || log.action === 'Imported'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {log.action}
                        </span>{' '}
                        <span className="text-stone-600">in {log.module}:</span>{' '}
                        <span className="font-medium text-stone-900">{log.details}</span>
                      </p>
                      {isSuperAdmin && log.weddingTitle && (
                        <span className="text-[10px] text-stone-400">
                          Workspace: {log.weddingTitle}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-stone-400 shrink-0">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// MODULE 1: EVENTS & CEREMONY PLANNER
// ==========================================
function EventsModule({ events, weddingId, perms, setState, stampUser, recordAudit, showToast }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sort, setSort] = useState({ key: 'date', dir: 'asc' });
  const [selectedIds, setSelectedIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [newChecklistText, setNewChecklistText] = useState({});

  const [form, setForm] = useState({
    name: 'Haldi',
    date: '',
    time: '',
    venue: '',
    dressCode: '',
    notes: '',
    status: 'Upcoming',
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: 'Haldi',
      date: '',
      time: '',
      venue: '',
      dressCode: '',
      notes: '',
      status: 'Upcoming',
    });
    setModalOpen(true);
  };

  const openEdit = (ev) => {
    setEditing(ev);
    setForm({
      name: ev.name,
      date: ev.date || '',
      time: ev.time || '',
      venue: ev.venue || '',
      dressCode: ev.dressCode || '',
      notes: ev.notes || '',
      status: ev.status || 'Upcoming',
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editing) {
      setState((prev) => ({
        ...prev,
        events: prev.events.map((ev) =>
          ev.id === editing.id ? { ...ev, ...form, ...stampUser(ev) } : ev
        ),
      }));
      recordAudit('Events', 'Updated', `Updated event "${form.name}"`);
      showToast('Event updated');
    } else {
      const created = {
        id: uid('evt'),
        weddingId,
        ...form,
        checklist: [],
        ...stampUser(),
      };
      setState((prev) => ({ ...prev, events: [...prev.events, created] }));
      recordAudit('Events', 'Created', `Added event "${form.name}"`);
      showToast('Event added');
    }
    setModalOpen(false);
  };

  const handleDelete = (ev) => {
    setState((prev) => ({ ...prev, events: prev.events.filter((x) => x.id !== ev.id) }));
    recordAudit('Events', 'Deleted', `Deleted event "${ev.name}"`);
    showToast('Event deleted');
    setDeleteTarget(null);
  };

  const handleBulkDelete = () => {
    setState((prev) => ({
      ...prev,
      events: prev.events.filter((x) => !selectedIds.includes(x.id)),
    }));
    recordAudit('Events', 'Deleted', `Bulk deleted ${selectedIds.length} events`);
    showToast(`Deleted ${selectedIds.length} events`);
    setSelectedIds([]);
    setBulkDeleteConfirm(false);
  };

  const addChecklistItem = (eventId) => {
    const text = (newChecklistText[eventId] || '').trim();
    if (!text) return;
    setState((prev) => ({
      ...prev,
      events: prev.events.map((ev) =>
        ev.id === eventId
          ? {
              ...ev,
              checklist: [...(ev.checklist || []), { id: uid('chk'), text, done: false }],
              ...stampUser(ev),
            }
          : ev
      ),
    }));
    setNewChecklistText((prev) => ({ ...prev, [eventId]: '' }));
  };

  const toggleChecklistItem = (eventId, chkId) => {
    if (!perms.update) return;
    setState((prev) => ({
      ...prev,
      events: prev.events.map((ev) =>
        ev.id === eventId
          ? {
              ...ev,
              checklist: (ev.checklist || []).map((c) =>
                c.id === chkId ? { ...c, done: !c.done } : c
              ),
            }
          : ev
      ),
    }));
  };

  const deleteChecklistItem = (eventId, chkId) => {
    if (!perms.update && !perms.delete) return;
    setState((prev) => ({
      ...prev,
      events: prev.events.map((ev) =>
        ev.id === eventId
          ? { ...ev, checklist: (ev.checklist || []).filter((c) => c.id !== chkId) }
          : ev
      ),
    }));
  };

  const filtered = useMemo(() => {
    return events
      .filter((ev) => {
        if (statusFilter !== 'ALL' && ev.status !== statusFilter) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            ev.name.toLowerCase().includes(q) ||
            (ev.venue || '').toLowerCase().includes(q) ||
            (ev.dressCode || '').toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const valA = String(a[sort.key] || '');
        const valB = String(b[sort.key] || '');
        return sort.dir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
  }, [events, statusFilter, search, sort]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Events & Ceremonies</h2>
          <p className="text-xs text-stone-500">
            Schedule functions, venues, dress codes, and ritual checklists.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {perms.delete && selectedIds.length > 0 && (
            <button
              onClick={() => setBulkDeleteConfirm(true)}
              className="px-3.5 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Trash2 size={14} /> Delete ({selectedIds.length})
            </button>
          )}
          {perms.add && (
            <button
              onClick={openAdd}
              className="px-4 py-2.5 rounded-xl bg-[#7A1C24] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:bg-[#5E141B]"
            >
              <Plus size={16} /> Add Event
            </button>
          )}
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3.5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, venues, dress codes..."
            className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl text-xs"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-stone-300 rounded-xl text-xs bg-white"
        >
          <option value="ALL">All Statuses</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Completed">Completed</option>
        </select>
        <select
          value={`${sort.key}_${sort.dir}`}
          onChange={(e) => {
            const [key, dir] = e.target.value.split('_');
            setSort({ key, dir });
          }}
          className="px-3 py-2 border border-stone-300 rounded-xl text-xs bg-white"
        >
          <option value="date_asc">Date (Earliest First)</option>
          <option value="date_desc">Date (Latest First)</option>
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
        </select>
        {(search || statusFilter !== 'ALL') && (
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('ALL');
            }}
            className="text-xs font-semibold text-[#7A1C24] hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center text-xs text-stone-500">
          No events found. {perms.add && 'Click "+ Add Event" to create your first ceremony.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((ev) => {
            const checked = selectedIds.includes(ev.id);
            return (
              <div
                key={ev.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    {perms.delete && (
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          setSelectedIds((prev) =>
                            e.target.checked ? [...prev, ev.id] : prev.filter((id) => id !== ev.id)
                          )
                        }
                        className="mt-1 rounded border-stone-300 text-[#7A1C24]"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-base text-stone-900">{ev.name}</h3>
                      <div className="text-xs text-stone-500 flex flex-wrap gap-2 mt-0.5">
                        {ev.date && <span>📅 {ev.date}</span>}
                        {ev.time && <span>⏰ {ev.time}</span>}
                        {ev.venue && <span>📍 {ev.venue}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ev.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-[#7A1C24]'
                      }`}
                    >
                      {ev.status}
                    </span>
                    {perms.update && (
                      <button
                        onClick={() => openEdit(ev)}
                        className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                    {perms.delete && (
                      <button
                        onClick={() => setDeleteTarget(ev)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {ev.dressCode && (
                  <div className="text-xs bg-amber-50/70 border border-amber-200/70 px-3 py-1.5 rounded-lg text-stone-700">
                    <span className="font-semibold">Dress Code:</span> {ev.dressCode}
                  </div>
                )}
                {ev.notes && <p className="text-xs text-stone-600">{ev.notes}</p>}

                {/* Event Sub-Checklist */}
                <div className="pt-2 border-t border-stone-100 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    Ceremony Checklist
                  </div>
                  {(ev.checklist || []).map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs gap-2">
                      <label className="flex items-center gap-2 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={item.done}
                          disabled={!perms.update}
                          onChange={() => toggleChecklistItem(ev.id, item.id)}
                          className="rounded text-[#7A1C24]"
                        />
                        <span className={item.done ? 'line-through text-stone-400' : 'text-stone-800'}>
                          {item.text}
                        </span>
                      </label>
                      {(perms.update || perms.delete) && (
                        <button
                          onClick={() => deleteChecklistItem(ev.id, item.id)}
                          className="text-stone-400 hover:text-red-600"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                  {perms.update && (
                    <div className="flex gap-1.5 pt-1">
                      <input
                        type="text"
                        value={newChecklistText[ev.id] || ''}
                        onChange={(e) =>
                          setNewChecklistText((prev) => ({ ...prev, [ev.id]: e.target.value }))
                        }
                        onKeyDown={(e) => e.key === 'Enter' && addChecklistItem(ev.id)}
                        placeholder="Add checklist item..."
                        className="flex-1 px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => addChecklistItem(ev.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-semibold"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>

                {ev.updatedBy && (
                  <div className="text-[10px] text-stone-400 pt-1">
                    Updated by {ev.updatedBy.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Ceremony / Event' : 'Add Ceremony / Event'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <DropdownWithOther
            label="Event / Ceremony Name"
            required
            value={form.name}
            onChange={(val) => setForm({ ...form, name: val })}
            options={EVENT_PRESETS}
            placeholder="Enter ceremony name"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Time</label>
              <input
                type="text"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                placeholder="Enter event time"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Venue</label>
              <input
                type="text"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                placeholder="Enter venue or hall name"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <DropdownWithOther
              label="Status"
              value={form.status}
              onChange={(val) => setForm({ ...form, status: val })}
              options={['Upcoming', 'Completed']}
              placeholder="Enter status"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Dress Code</label>
            <input
              type="text"
              value={form.dressCode}
              onChange={(e) => setForm({ ...form, dressCode: e.target.value })}
              placeholder="Enter dress code"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Rituals & Notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#7A1C24] text-white text-xs font-semibold"
            >
              Save Event
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Event?"
        message={`Delete "${deleteTarget?.name}" permanently?`}
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        isOpen={bulkDeleteConfirm}
        title="Delete Selected Events?"
        message={`Delete ${selectedIds.length} selected events?`}
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteConfirm(false)}
      />
    </div>
  );
}

// ==========================================
// MODULE 2: GUEST LIST, SMART CSV UPSERT & CARD TRACKER
// (CSV IMPORT/EXPORT STRICTLY IN THIS MODULE ONLY)
// ==========================================
function GuestsModule({
  guests,
  activeWedding,
  perms,
  setState,
  stampUser,
  recordAudit,
  showToast,
}) {
  const [search, setSearch] = useState('');
  const [sideFilter, setSideFilter] = useState('ALL');
  const [groupFilter, setGroupFilter] = useState('ALL');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [cardFilter, setCardFilter] = useState('ALL');
  const [rsvpFilter, setRsvpFilter] = useState('ALL');
  const [stayFilter, setStayFilter] = useState('ALL');
  const [sort, setSort] = useState({ key: 'fullName', dir: 'asc' });

  const [selectedIds, setSelectedIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // CSV Import State
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvRows, setCsvRows] = useState([]);
  const [mapping, setMapping] = useState({
    guestId: '',
    fullName: '',
    phone: '',
    side: '',
    group: '',
    city: '',
    adults: '',
    kids: '',
    accommodation: '',
    cardStatus: '',
    rsvpStatus: '',
  });

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    side: "Groom's Side",
    group: 'Relatives',
    city: '',
    adults: 2,
    kids: 0,
    accommodation: 'No',
    cardStatus: 'Not Sent',
    rsvpStatus: 'Pending',
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      fullName: '',
      phone: '',
      side: "Groom's Side",
      group: 'Relatives',
      city: '',
      adults: 2,
      kids: 0,
      accommodation: 'No',
      cardStatus: 'Not Sent',
      rsvpStatus: 'Pending',
    });
    setModalOpen(true);
  };

  const openEdit = (g) => {
    setEditing(g);
    setForm({
      fullName: g.fullName,
      phone: g.phone || '',
      side: g.side || "Groom's Side",
      group: g.group || 'Relatives',
      city: g.city || '',
      adults: g.adults ?? 1,
      kids: g.kids ?? 0,
      accommodation: g.accommodation || 'No',
      cardStatus: g.cardStatus || 'Not Sent',
      rsvpStatus: g.rsvpStatus || 'Pending',
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) return;
    if (editing) {
      setState((prev) => ({
        ...prev,
        guests: prev.guests.map((g) =>
          g.id === editing.id
            ? {
                ...g,
                ...form,
                adults: Number(form.adults) || 0,
                kids: Number(form.kids) || 0,
                ...stampUser(g),
              }
            : g
        ),
      }));
      recordAudit('Guests', 'Updated', `Updated guest "${form.fullName}"`);
      showToast('Guest updated');
    } else {
      const created = {
        id: uid('gst'),
        weddingId: activeWedding.id,
        ...form,
        adults: Number(form.adults) || 0,
        kids: Number(form.kids) || 0,
        ...stampUser(),
      };
      setState((prev) => ({ ...prev, guests: [...prev.guests, created] }));
      recordAudit('Guests', 'Created', `Added guest "${form.fullName}"`);
      showToast('Guest added');
    }
    setModalOpen(false);
  };

  const handleDelete = (g) => {
    setState((prev) => ({ ...prev, guests: prev.guests.filter((x) => x.id !== g.id) }));
    recordAudit('Guests', 'Deleted', `Deleted guest "${g.fullName}"`);
    showToast('Guest deleted');
    setDeleteTarget(null);
  };

  const handleBulkDelete = () => {
    setState((prev) => ({
      ...prev,
      guests: prev.guests.filter((x) => !selectedIds.includes(x.id)),
    }));
    recordAudit('Guests', 'Deleted', `Bulk deleted ${selectedIds.length} guests`);
    showToast(`Deleted ${selectedIds.length} guests`);
    setSelectedIds([]);
    setBulkDeleteConfirm(false);
  };

  const quickUpdateField = (guestId, field, value) => {
    if (!perms.update) return;
    const target = guests.find((g) => g.id === guestId);
    setState((prev) => ({
      ...prev,
      guests: prev.guests.map((g) =>
        g.id === guestId ? { ...g, [field]: value, ...stampUser(g) } : g
      ),
    }));
    if (target) {
      recordAudit('Guests', 'Updated', `Updated ${field} to "${value}" for ${target.fullName}`);
    }
  };

  // CSV File Upload & Smart Column Auto-Match
  const handleCSVFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const { headers, data } = parseCSV(ev.target.result || '');
      if (headers.length === 0 || data.length === 0) {
        showToast('CSV file appears empty or invalid', 'error');
        return;
      }
      setCsvHeaders(headers);
      setCsvRows(data);

      const findCol = (keywords) =>
        headers.find((h) => keywords.some((k) => h.toLowerCase().includes(k))) || '';

      setMapping({
        guestId: findCol(['guest_id', 'guestid', 'id']),
        fullName: findCol(['name', 'guest']),
        phone: findCol(['phone', 'mobile', 'whatsapp', 'contact']),
        side: findCol(['side']),
        group: findCol(['group', 'category', 'relation']),
        city: findCol(['city', 'location', 'place']),
        adults: findCol(['adult', 'headcount', 'members', 'count']),
        kids: findCol(['kid', 'child']),
        accommodation: findCol(['accommodation', 'stay', 'room', 'pickup']),
        cardStatus: findCol(['card', 'invite']),
        rsvpStatus: findCol(['rsvp', 'confirm', 'status']),
      });
      setCsvModalOpen(true);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Smart Upsert Preview Diff
  const upsertPreview = useMemo(() => {
    if (!csvModalOpen || !mapping.fullName) {
      return { toAdd: [], toUpdate: [], unchanged: 0 };
    }
    const toAdd = [];
    const toUpdate = [];
    let unchanged = 0;

    csvRows.forEach((row) => {
      const incomingName = (row[mapping.fullName] || '').trim();
      if (!incomingName) return;

      const incomingId = mapping.guestId ? (row[mapping.guestId] || '').trim() : '';
      const incomingPhone = mapping.phone ? (row[mapping.phone] || '').trim() : '';
      const normPhone = normalizePhone(incomingPhone);
      const incomingCity = mapping.city ? (row[mapping.city] || '').trim() : '';

      // Priority match: 1. Guest_ID -> 2. Normalized 10-digit Phone -> 3. Exact Full Name + City
      const matched = guests.find((g) => {
        if (incomingId && g.id === incomingId) return true;
        if (normPhone && normPhone.length >= 10 && normalizePhone(g.phone) === normPhone) return true;
        if (
          incomingName.toLowerCase() === g.fullName.toLowerCase() &&
          incomingCity.toLowerCase() === (g.city || '').toLowerCase()
        ) {
          return true;
        }
        return false;
      });

      const nextData = {
        fullName: incomingName,
        phone: incomingPhone || matched?.phone || '',
        side: (mapping.side && row[mapping.side]?.trim()) || matched?.side || "Groom's Side",
        group: (mapping.group && row[mapping.group]?.trim()) || matched?.group || 'Relatives',
        city: incomingCity || matched?.city || '',
        adults:
          mapping.adults && row[mapping.adults] !== ''
            ? Number(row[mapping.adults]) || 0
            : matched?.adults ?? 2,
        kids:
          mapping.kids && row[mapping.kids] !== ''
            ? Number(row[mapping.kids]) || 0
            : matched?.kids ?? 0,
        accommodation:
          (mapping.accommodation && row[mapping.accommodation]?.trim()) ||
          matched?.accommodation ||
          'No',
        cardStatus:
          (mapping.cardStatus && row[mapping.cardStatus]?.trim()) ||
          matched?.cardStatus ||
          'Not Sent',
        rsvpStatus:
          (mapping.rsvpStatus && row[mapping.rsvpStatus]?.trim()) ||
          matched?.rsvpStatus ||
          'Pending',
      };

      if (matched) {
        const hasDiff =
          matched.fullName !== nextData.fullName ||
          (matched.phone || '') !== nextData.phone ||
          matched.side !== nextData.side ||
          matched.group !== nextData.group ||
          (matched.city || '') !== nextData.city ||
          Number(matched.adults) !== Number(nextData.adults) ||
          Number(matched.kids) !== Number(nextData.kids) ||
          matched.accommodation !== nextData.accommodation ||
          matched.cardStatus !== nextData.cardStatus ||
          matched.rsvpStatus !== nextData.rsvpStatus;

        if (hasDiff) {
          toUpdate.push({ existingId: matched.id, data: nextData });
        } else {
          unchanged++;
        }
      } else {
        toAdd.push({
          id: incomingId || uid('gst'),
          weddingId: activeWedding.id,
          ...nextData,
        });
      }
    });

    return { toAdd, toUpdate, unchanged };
  }, [csvModalOpen, csvRows, mapping, guests, activeWedding.id]);

  const confirmCSVUpsert = () => {
    const { toAdd, toUpdate } = upsertPreview;
    setState((prev) => {
      const updateMap = new Map(toUpdate.map((u) => [u.existingId, u.data]));
      const updatedExisting = prev.guests.map((g) => {
        if (updateMap.has(g.id)) {
          return { ...g, ...updateMap.get(g.id), ...stampUser(g) };
        }
        return g;
      });
      const stampedNew = toAdd.map((n) => ({ ...n, ...stampUser() }));
      return {
        ...prev,
        guests: [...updatedExisting, ...stampedNew],
      };
    });
    recordAudit(
      'Guests',
      'Imported',
      `CSV Sync: ${toAdd.length} added, ${toUpdate.length} updated`
    );
    showToast(`CSV Imported: ${toAdd.length} added, ${toUpdate.length} updated`);
    setCsvModalOpen(false);
  };

  const handleDownloadSampleCSV = () => {
    const headers = [
      'Guest_ID',
      'Full Name',
      'Phone',
      'Side',
      'Group',
      'City',
      'Adults',
      'Kids',
      'Accommodation',
      'Card Status',
      'RSVP Status',
    ];
    const sample = [
      {
        Guest_ID: '',
        'Full Name': 'Ramesh Sharma',
        Phone: '9876543210',
        Side: "Groom's Side",
        Group: 'Relatives',
        City: 'Prayagraj',
        Adults: '2',
        Kids: '1',
        Accommodation: 'Yes',
        'Card Status': 'Not Sent',
        'RSVP Status': 'Pending',
      },
    ];
    downloadCSVFile('AT_Wedding_Guest_Template.csv', headers, sample);
  };

  const handleExportGuestsCSV = () => {
    const headers = [
      'Guest_ID',
      'Full Name',
      'Phone',
      'Side',
      'Group',
      'City',
      'Adults',
      'Kids',
      'Total Headcount',
      'Accommodation',
      'Card Status',
      'RSVP Status',
    ];
    const rows = filtered.map((g) => ({
      Guest_ID: g.id,
      'Full Name': g.fullName,
      Phone: g.phone || '',
      Side: g.side,
      Group: g.group,
      City: g.city || '',
      Adults: g.adults,
      Kids: g.kids,
      'Total Headcount': (Number(g.adults) || 0) + (Number(g.kids) || 0),
      Accommodation: g.accommodation,
      'Card Status': g.cardStatus,
      'RSVP Status': g.rsvpStatus,
    }));
    downloadCSVFile(`${activeWedding.title.replace(/\s+/g, '_')}_Guests.csv`, headers, rows);
  };

  const copyWhatsAppInvite = (g) => {
    const msg = `Namaste ${g.fullName} Ji,\n\nWe warmly invite you and your family to the wedding celebrations of ${
      activeWedding.coupleNames || activeWedding.title
    }${activeWedding.date ? ` on ${activeWedding.date}` : ''}${
      activeWedding.city ? ` in ${activeWedding.city}` : ''
    }.\n\nYour presence will make our celebration truly special!`;
    navigator.clipboard.writeText(msg);
    setCopiedId(g.id);
    showToast(`Copied invite for ${g.fullName}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const uniqueCities = useMemo(() => {
    return Array.from(new Set(guests.map((g) => g.city).filter(Boolean))).sort();
  }, [guests]);

  const handleSort = (key) => {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    );
  };

  const filtered = useMemo(() => {
    return guests
      .filter((g) => {
        if (sideFilter !== 'ALL' && g.side !== sideFilter) return false;
        if (groupFilter !== 'ALL' && g.group !== groupFilter) return false;
        if (cityFilter !== 'ALL' && (g.city || '') !== cityFilter) return false;
        if (cardFilter !== 'ALL' && g.cardStatus !== cardFilter) return false;
        if (rsvpFilter !== 'ALL' && g.rsvpStatus !== rsvpFilter) return false;
        if (stayFilter !== 'ALL' && g.accommodation !== stayFilter) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            g.fullName.toLowerCase().includes(q) ||
            (g.phone || '').toLowerCase().includes(q) ||
            (g.city || '').toLowerCase().includes(q) ||
            (g.group || '').toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sort.key === 'headcount') {
          const hA = (Number(a.adults) || 0) + (Number(a.kids) || 0);
          const hB = (Number(b.adults) || 0) + (Number(b.kids) || 0);
          return sort.dir === 'asc' ? hA - hB : hB - hA;
        }
        const vA = String(a[sort.key] || '');
        const vB = String(b[sort.key] || '');
        return sort.dir === 'asc' ? vA.localeCompare(vB) : vB.localeCompare(vA);
      });
  }, [
    guests,
    sideFilter,
    groupFilter,
    cityFilter,
    cardFilter,
    rsvpFilter,
    stayFilter,
    search,
    sort,
  ]);

  const totalHeadcount = guests.reduce(
    (sum, g) => sum + (Number(g.adults) || 0) + (Number(g.kids) || 0),
    0
  );
  const digitalSent = guests.filter((g) => g.cardStatus === 'Digital Invite Sent').length;
  const physicalSent = guests.filter(
    (g) => g.cardStatus === 'Physical Card Handed Over' || g.cardStatus === 'Couriered'
  ).length;
  const confirmedCount = guests.filter((g) => g.rsvpStatus === 'Confirmed').length;

  return (
    <div className="space-y-5">
      {/* Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Guest List & Card Distribution</h2>
          <p className="text-xs text-stone-500">
            Smart CSV import/update without duplicates, invitation tracking & RSVPs.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {perms.delete && selectedIds.length > 0 && (
            <button
              onClick={() => setBulkDeleteConfirm(true)}
              className="px-3 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Trash2 size={14} /> Delete ({selectedIds.length})
            </button>
          )}
          <button
            onClick={handleDownloadSampleCSV}
            className="px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5"
          >
            <Download size={14} /> CSV Template
          </button>
          <button
            onClick={handleExportGuestsCSV}
            className="px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5"
          >
            <Download size={14} /> Export CSV
          </button>
          {perms.add && (
            <label className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-[#7A1C24] hover:bg-amber-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <Upload size={14} /> Import / Update CSV
              <input type="file" accept=".csv" onChange={handleCSVFileSelect} className="hidden" />
            </label>
          )}
          {perms.add && (
            <button
              onClick={openAdd}
              className="px-4 py-2 rounded-xl bg-[#7A1C24] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:bg-[#5E141B]"
            >
              <Plus size={15} /> Add Guest
            </button>
          )}
        </div>
      </div>

      {/* Summary Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-stone-200 p-3">
          <div className="text-[11px] text-stone-500 font-semibold">Total Families</div>
          <div className="text-lg font-bold text-stone-900 mt-0.5">{guests.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-3">
          <div className="text-[11px] text-stone-500 font-semibold">Total Headcount</div>
          <div className="text-lg font-bold text-[#7A1C24] mt-0.5">{totalHeadcount}</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-3">
          <div className="text-[11px] text-stone-500 font-semibold">Digital Invites</div>
          <div className="text-lg font-bold text-blue-700 mt-0.5">{digitalSent}</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-3">
          <div className="text-[11px] text-stone-500 font-semibold">Physical / Courier</div>
          <div className="text-lg font-bold text-amber-700 mt-0.5">{physicalSent}</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-3 col-span-2 sm:col-span-1">
          <div className="text-[11px] text-stone-500 font-semibold">RSVP Confirmed</div>
          <div className="text-lg font-bold text-emerald-700 mt-0.5">{confirmedCount}</div>
        </div>
      </div>

      {/* Multi-Filter Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3.5 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guests by name, phone, city, or group..."
              className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl text-xs"
            />
          </div>
          <select
            value={sideFilter}
            onChange={(e) => setSideFilter(e.target.value)}
            className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
          >
            <option value="ALL">All Sides</option>
            {GUEST_SIDES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
          >
            <option value="ALL">All Groups</option>
            {GUEST_GROUPS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
          >
            <option value="ALL">All Cities</option>
            {uniqueCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={cardFilter}
            onChange={(e) => setCardFilter(e.target.value)}
            className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
          >
            <option value="ALL">All Card Status</option>
            {CARD_STATUSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={rsvpFilter}
            onChange={(e) => setRsvpFilter(e.target.value)}
            className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
          >
            <option value="ALL">All RSVP</option>
            {RSVP_STATUSES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            value={stayFilter}
            onChange={(e) => setStayFilter(e.target.value)}
            className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
          >
            <option value="ALL">Stay: Any</option>
            <option value="Yes">Stay Needed: Yes</option>
            <option value="No">Stay Needed: No</option>
          </select>
          {(search ||
            sideFilter !== 'ALL' ||
            groupFilter !== 'ALL' ||
            cityFilter !== 'ALL' ||
            cardFilter !== 'ALL' ||
            rsvpFilter !== 'ALL' ||
            stayFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearch('');
                setSideFilter('ALL');
                setGroupFilter('ALL');
                setCityFilter('ALL');
                setCardFilter('ALL');
                setRsvpFilter('ALL');
                setStayFilter('ALL');
              }}
              className="text-xs font-semibold text-[#7A1C24] hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Guests Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                {perms.delete && (
                  <th className="px-3 py-3 w-8">
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && selectedIds.length === filtered.length}
                      onChange={(e) =>
                        setSelectedIds(e.target.checked ? filtered.map((g) => g.id) : [])
                      }
                      className="rounded border-stone-300"
                    />
                  </th>
                )}
                <SortableHeader label="Guest / Family" sortKey="fullName" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="Side & Group" sortKey="side" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="City" sortKey="city" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="Headcount" sortKey="headcount" currentSort={sort} onSort={handleSort} align="center" />
                <SortableHeader label="Card Status" sortKey="cardStatus" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="RSVP" sortKey="rsvpStatus" currentSort={sort} onSort={handleSort} />
                <th className="px-3 py-3 text-xs font-semibold uppercase text-stone-600 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-stone-500">
                    No guests found. Add guests manually or import your CSV file.
                  </td>
                </tr>
              ) : (
                filtered.map((g) => {
                  const total = (Number(g.adults) || 0) + (Number(g.kids) || 0);
                  return (
                    <tr key={g.id} className="hover:bg-stone-50/70">
                      {perms.delete && (
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(g.id)}
                            onChange={(e) =>
                              setSelectedIds((prev) =>
                                e.target.checked ? [...prev, g.id] : prev.filter((id) => id !== g.id)
                              )
                            }
                            className="rounded border-stone-300"
                          />
                        </td>
                      )}
                      <td className="px-3 py-3">
                        <div className="font-bold text-stone-900">{g.fullName}</div>
                        {g.phone && (
                          <div className="text-[11px] text-stone-500 flex items-center gap-1">
                            <Phone size={10} /> {g.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-medium text-stone-800">{g.side}</div>
                        <div className="text-[11px] text-stone-500">{g.group}</div>
                      </td>
                      <td className="px-3 py-3 text-stone-700">
                        <div>{g.city || '—'}</div>
                        {g.accommodation === 'Yes' && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[10px] font-semibold">
                            Stay Needed
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="font-bold text-stone-900">{total}</span>
                        <div className="text-[10px] text-stone-400">
                          {g.adults}A + {g.kids}K
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <select
                          disabled={!perms.update}
                          value={g.cardStatus}
                          onChange={(e) => quickUpdateField(g.id, 'cardStatus', e.target.value)}
                          className="px-2 py-1 border border-stone-200 rounded-lg text-xs bg-white"
                        >
                          {Array.from(new Set([...CARD_STATUSES, g.cardStatus])).map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-3">
                        <select
                          disabled={!perms.update}
                          value={g.rsvpStatus}
                          onChange={(e) => quickUpdateField(g.id, 'rsvpStatus', e.target.value)}
                          className={`px-2 py-1 border rounded-lg text-xs font-semibold ${
                            g.rsvpStatus === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : g.rsvpStatus === 'Declined'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-white text-stone-700 border-stone-200'
                          }`}
                        >
                          {Array.from(new Set([...RSVP_STATUSES, g.rsvpStatus])).map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => copyWhatsAppInvite(g)}
                            title="Copy WhatsApp Invite"
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50"
                          >
                            {copiedId === g.id ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                          {perms.update && (
                            <button
                              onClick={() => openEdit(g)}
                              className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}
                          {perms.delete && (
                            <button
                              onClick={() => setDeleteTarget(g)}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Guest Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Guest' : 'Add New Guest'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Phone / WhatsApp
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DropdownWithOther
              label="Side"
              value={form.side}
              onChange={(val) => setForm({ ...form, side: val })}
              options={GUEST_SIDES}
              placeholder="Enter side"
            />
            <DropdownWithOther
              label="Group / Relation"
              value={form.group}
              onChange={(val) => setForm({ ...form, group: val })}
              options={GUEST_GROUPS}
              placeholder="Enter group"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Adults</label>
              <input
                type="number"
                min="0"
                value={form.adults}
                onChange={(e) => setForm({ ...form, adults: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Kids</label>
              <input
                type="number"
                min="0"
                value={form.kids}
                onChange={(e) => setForm({ ...form, kids: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <DropdownWithOther
              label="Accommodation"
              value={form.accommodation}
              onChange={(val) => setForm({ ...form, accommodation: val })}
              options={['No', 'Yes']}
              placeholder="Enter accommodation details"
            />
            <DropdownWithOther
              label="Card Status"
              value={form.cardStatus}
              onChange={(val) => setForm({ ...form, cardStatus: val })}
              options={CARD_STATUSES}
              placeholder="Enter card status"
            />
            <DropdownWithOther
              label="RSVP Status"
              value={form.rsvpStatus}
              onChange={(val) => setForm({ ...form, rsvpStatus: val })}
              options={RSVP_STATUSES}
              placeholder="Enter RSVP status"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#7A1C24] text-white text-xs font-semibold"
            >
              Save Guest
            </button>
          </div>
        </form>
      </Modal>

      {/* CSV Smart Upsert Modal */}
      <Modal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        title="Smart CSV Import & Re-Import (Upsert)"
        subtitle="Existing guests are matched and updated automatically without creating duplicates."
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-lg font-bold text-emerald-800">{upsertPreview.toAdd.length}</div>
              <div className="text-[11px] text-emerald-700 font-semibold">New Guests to Add</div>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-lg font-bold text-amber-800">
                {upsertPreview.toUpdate.length}
              </div>
              <div className="text-[11px] text-amber-700 font-semibold">
                Existing Guests to Update
              </div>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <div className="text-lg font-bold text-stone-700">{upsertPreview.unchanged}</div>
              <div className="text-[11px] text-stone-500 font-semibold">Unchanged</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { key: 'fullName', label: 'Full Name (Required)' },
              { key: 'phone', label: 'Phone / WhatsApp' },
              { key: 'guestId', label: 'Guest_ID (For exact re-import)' },
              { key: 'side', label: 'Side' },
              { key: 'group', label: 'Group / Relation' },
              { key: 'city', label: 'City' },
              { key: 'adults', label: 'Adults Count' },
              { key: 'kids', label: 'Kids Count' },
              { key: 'accommodation', label: 'Accommodation' },
              { key: 'cardStatus', label: 'Card Status' },
              { key: 'rsvpStatus', label: 'RSVP Status' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block font-semibold text-stone-700 mb-1">{field.label}</label>
                <select
                  value={mapping[field.key]}
                  onChange={(e) => setMapping({ ...mapping, [field.key]: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg bg-white"
                >
                  <option value="">-- Ignore / Default --</option>
                  {csvHeaders.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setCsvModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!mapping.fullName}
              onClick={confirmCSVUpsert}
              className="px-4 py-2 rounded-lg bg-[#7A1C24] disabled:opacity-50 text-white text-xs font-semibold"
            >
              Confirm Import ({upsertPreview.toAdd.length + upsertPreview.toUpdate.length} Changes)
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Guest?"
        message={`Remove "${deleteTarget?.fullName}" from the guest list?`}
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        isOpen={bulkDeleteConfirm}
        title="Delete Selected Guests?"
        message={`Delete ${selectedIds.length} selected guests permanently?`}
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteConfirm(false)}
      />
    </div>
  );
}

// ==========================================
// MODULE 3: INVITES & MEDIA STUDIO
// (CARDS, POSTERS, VIDEOS, HYPERLINKS & SHARE)
// ==========================================
function InvitesMediaModule({
  invites,
  activeWedding,
  perms,
  setState,
  stampUser,
  recordAudit,
  showToast,
}) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [sort, setSort] = useState({ key: 'createdAt', dir: 'desc' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState({
    title: '',
    mediaType: 'Wedding Card',
    eventTag: 'All Events',
    linkUrl: '',
    mediaDataUrl: '',
    mediaMime: '',
    notes: '',
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      title: '',
      mediaType: 'Wedding Card',
      eventTag: 'All Events',
      linkUrl: '',
      mediaDataUrl: '',
      mediaMime: '',
      notes: '',
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title,
      mediaType: item.mediaType || 'Wedding Card',
      eventTag: item.eventTag || 'All Events',
      linkUrl: item.linkUrl || '',
      mediaDataUrl: item.mediaDataUrl || '',
      mediaMime: item.mediaMime || '',
      notes: item.notes || '',
    });
    setModalOpen(true);
  };

  const handleMediaFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type.startsWith('image/')) {
      const compressed = await compressImageFile(file, 1200, 0.82);
      setForm((prev) => ({ ...prev, mediaDataUrl: compressed, mediaMime: 'image/jpeg' }));
    } else if (file.type.startsWith('video/')) {
      if (file.size > 8 * 1024 * 1024) {
        showToast('Video over 8MB: consider adding a YouTube/Drive hyperlink instead', 'error');
      }
      const dataUrl = await readFileAsDataURL(file);
      setForm((prev) => ({ ...prev, mediaDataUrl: dataUrl, mediaMime: file.type }));
    } else {
      const dataUrl = await readFileAsDataURL(file);
      setForm((prev) => ({ ...prev, mediaDataUrl: dataUrl, mediaMime: file.type }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editing) {
      setState((prev) => ({
        ...prev,
        invites: prev.invites.map((it) =>
          it.id === editing.id ? { ...it, ...form, ...stampUser(it) } : it
        ),
      }));
      recordAudit('Invites & Media', 'Updated', `Updated invite "${form.title}"`);
      showToast('Invite media updated');
    } else {
      const created = {
        id: uid('inv'),
        weddingId: activeWedding.id,
        ...form,
        ...stampUser(),
      };
      setState((prev) => ({ ...prev, invites: [created, ...prev.invites] }));
      recordAudit('Invites & Media', 'Created', `Added invite "${form.title}"`);
      showToast('Invite media added');
    }
    setModalOpen(false);
  };

  const handleDelete = (item) => {
    setState((prev) => ({ ...prev, invites: prev.invites.filter((x) => x.id !== item.id) }));
    recordAudit('Invites & Media', 'Deleted', `Deleted invite "${item.title}"`);
    showToast('Invite deleted');
    setDeleteTarget(null);
  };

  const handleShare = async (item) => {
    const shareText = `${item.title} — ${activeWedding.coupleNames || activeWedding.title}${
      item.linkUrl ? `\nView Invite: ${item.linkUrl}` : ''
    }`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: shareText,
          url: item.linkUrl || window.location.href,
        });
        return;
      } catch {
        // fallback to clipboard
      }
    }
    navigator.clipboard.writeText(shareText);
    showToast('Shareable invite message & link copied to clipboard!');
  };

  const handleWhatsAppShare = (item) => {
    const text = encodeURIComponent(
      `Namaste! You are cordially invited to ${
        activeWedding.coupleNames || activeWedding.title
      } (${item.title}).${item.linkUrl ? `\n\nOpen Invitation: ${item.linkUrl}` : ''}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const filtered = useMemo(() => {
    return invites
      .filter((it) => {
        if (typeFilter !== 'ALL' && it.mediaType !== typeFilter) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            it.title.toLowerCase().includes(q) ||
            (it.eventTag || '').toLowerCase().includes(q) ||
            (it.notes || '').toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const vA = String(a[sort.key] || '');
        const vB = String(b[sort.key] || '');
        return sort.dir === 'asc' ? vA.localeCompare(vB) : vB.localeCompare(vA);
      });
  }, [invites, typeFilter, search, sort]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Wedding Cards, Invites & Media</h2>
          <p className="text-xs text-stone-500">
            Upload cards, posters, invitation videos, or hyperlinks with one-click sharing.
          </p>
        </div>
        {perms.add && (
          <button
            onClick={openAdd}
            className="px-4 py-2.5 rounded-xl bg-[#7A1C24] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:bg-[#5E141B]"
          >
            <Plus size={16} /> Add Card / Media / Link
          </button>
        )}
      </div>

      {/* Filter & Sort */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3.5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invites by title or ceremony..."
            className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl text-xs"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-stone-300 rounded-xl text-xs bg-white"
        >
          <option value="ALL">All Media Types</option>
          {MEDIA_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={`${sort.key}_${sort.dir}`}
          onChange={(e) => {
            const [key, dir] = e.target.value.split('_');
            setSort({ key, dir });
          }}
          className="px-3 py-2 border border-stone-300 rounded-xl text-xs bg-white"
        >
          <option value="createdAt_desc">Newest First</option>
          <option value="createdAt_asc">Oldest First</option>
          <option value="title_asc">Title (A-Z)</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center text-xs text-stone-500">
          No wedding cards, posters, videos, or invite links added yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const isVideo = item.mediaMime?.startsWith('video/');
            const isImage = item.mediaMime?.startsWith('image/');
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Media Preview Box */}
                  <div
                    onClick={() => setPreviewItem(item)}
                    className="h-48 bg-stone-100 relative flex items-center justify-center cursor-pointer overflow-hidden group"
                  >
                    {isImage && item.mediaDataUrl ? (
                      <img
                        src={item.mediaDataUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : isVideo && item.mediaDataUrl ? (
                      <video
                        src={item.mediaDataUrl}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <div className="text-center p-4 space-y-1.5">
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#7A1C24] flex items-center justify-center mx-auto">
                          {item.linkUrl ? <LinkIcon size={22} /> : <FileImage size={22} />}
                        </div>
                        <p className="text-xs font-semibold text-stone-700">{item.mediaType}</p>
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/70 text-white text-[10px] font-semibold">
                      {item.mediaType}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-stone-900">{item.title}</h3>
                        <p className="text-[11px] text-stone-500">{item.eventTag}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {perms.update && (
                          <button
                            onClick={() => openEdit(item)}
                            className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                        {perms.delete && (
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {item.notes && <p className="text-xs text-stone-600 line-clamp-2">{item.notes}</p>}

                    {item.linkUrl && (
                      <a
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A1C24] hover:underline break-all"
                      >
                        <ExternalLink size={12} /> Open Attached Hyperlink
                      </a>
                    )}
                  </div>
                </div>

                {/* Share Footer */}
                <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleWhatsAppShare(item)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Share2 size={13} /> WhatsApp
                  </button>
                  <button
                    onClick={() => handleShare(item)}
                    className="py-1.5 px-3 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1"
                  >
                    <Copy size={13} /> Copy / Share
                  </button>
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="p-1.5 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-100"
                    title="Preview"
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Invite Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Invitation / Media' : 'Add Wedding Card, Poster, Video or Link'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter invitation title"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DropdownWithOther
              label="Media Type"
              value={form.mediaType}
              onChange={(val) => setForm({ ...form, mediaType: val })}
              options={MEDIA_TYPES}
              placeholder="Enter media type"
            />
            <DropdownWithOther
              label="Ceremony / Tag"
              value={form.eventTag}
              onChange={(val) => setForm({ ...form, eventTag: val })}
              options={['All Events', ...EVENT_PRESETS]}
              placeholder="Enter ceremony tag"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Hyperlink URL (YouTube, Google Drive, Canva, Map or Website Link)
            </label>
            <input
              type="url"
              value={form.linkUrl}
              onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
              placeholder="Enter URL link"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Upload Card Image, Poster, or Short Video
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaFile}
              className="w-full text-xs text-stone-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-amber-50 file:text-[#7A1C24] file:font-semibold"
            />
            {form.mediaDataUrl && (
              <div className="mt-2 flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-200 text-xs">
                <span className="text-emerald-700 font-semibold">Media file attached</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, mediaDataUrl: '', mediaMime: '' })}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Caption / Share Message Notes
            </label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#7A1C24] text-white text-xs font-semibold"
            >
              Save Invite
            </button>
          </div>
        </form>
      </Modal>

      {/* Lightbox Preview Modal */}
      <Modal
        isOpen={Boolean(previewItem)}
        onClose={() => setPreviewItem(null)}
        title={previewItem?.title || 'Preview'}
        subtitle={previewItem?.mediaType}
        maxWidth="max-w-2xl"
      >
        {previewItem && (
          <div className="space-y-4">
            {previewItem.mediaMime?.startsWith('image/') && previewItem.mediaDataUrl && (
              <img
                src={previewItem.mediaDataUrl}
                alt={previewItem.title}
                className="w-full max-h-[60vh] object-contain rounded-xl bg-stone-900"
              />
            )}
            {previewItem.mediaMime?.startsWith('video/') && previewItem.mediaDataUrl && (
              <video
                src={previewItem.mediaDataUrl}
                controls
                className="w-full max-h-[60vh] rounded-xl bg-black"
              />
            )}
            {previewItem.notes && <p className="text-xs text-stone-700">{previewItem.notes}</p>}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200">
              {previewItem.linkUrl ? (
                <a
                  href={previewItem.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 text-[#7A1C24] text-xs font-semibold"
                >
                  <ExternalLink size={14} /> Open Hyperlink
                </a>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleWhatsAppShare(previewItem)}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                >
                  Share on WhatsApp
                </button>
                <button
                  onClick={() => handleShare(previewItem)}
                  className="px-3.5 py-2 rounded-lg bg-stone-800 text-white text-xs font-semibold"
                >
                  Copy Share Link
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Invite Media?"
        message={`Delete "${deleteTarget?.title}"?`}
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

// ==========================================
// MODULE 4: PURE MENU LIST (NO PLATING CALCULATOR, NO CSV)
// ==========================================
function MenuModule({ menu, weddingId, perms, setState, stampUser, recordAudit, showToast }) {
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('ALL');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [dietFilter, setDietFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sort, setSort] = useState({ key: 'dishName', dir: 'asc' });

  const [selectedIds, setSelectedIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  const [form, setForm] = useState({
    dishName: '',
    event: 'Wedding',
    course: 'Main Course',
    dietaryTag: 'Pure Veg',
    status: 'Shortlisted',
    notes: '',
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      dishName: '',
      event: 'Wedding',
      course: 'Main Course',
      dietaryTag: 'Pure Veg',
      status: 'Shortlisted',
      notes: '',
    });
    setModalOpen(true);
  };

  const openEdit = (dish) => {
    setEditing(dish);
    setForm({
      dishName: dish.dishName,
      event: dish.event || 'Wedding',
      course: dish.course || 'Main Course',
      dietaryTag: dish.dietaryTag || 'Pure Veg',
      status: dish.status || 'Shortlisted',
      notes: dish.notes || '',
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.dishName.trim()) return;
    if (editing) {
      setState((prev) => ({
        ...prev,
        menu: prev.menu.map((m) =>
          m.id === editing.id ? { ...m, ...form, ...stampUser(m) } : m
        ),
      }));
      recordAudit('Menu', 'Updated', `Updated dish "${form.dishName}"`);
      showToast('Dish updated');
    } else {
      const created = {
        id: uid('dish'),
        weddingId,
        ...form,
        ...stampUser(),
      };
      setState((prev) => ({ ...prev, menu: [...prev.menu, created] }));
      recordAudit('Menu', 'Created', `Added dish "${form.dishName}"`);
      showToast('Dish added to menu');
    }
    setModalOpen(false);
  };

  const handleDelete = (dish) => {
    setState((prev) => ({ ...prev, menu: prev.menu.filter((x) => x.id !== dish.id) }));
    recordAudit('Menu', 'Deleted', `Deleted dish "${dish.dishName}"`);
    showToast('Dish deleted');
    setDeleteTarget(null);
  };

  const handleBulkDelete = () => {
    setState((prev) => ({
      ...prev,
      menu: prev.menu.filter((x) => !selectedIds.includes(x.id)),
    }));
    recordAudit('Menu', 'Deleted', `Bulk deleted ${selectedIds.length} dishes`);
    showToast(`Deleted ${selectedIds.length} dishes`);
    setSelectedIds([]);
    setBulkDeleteConfirm(false);
  };

  const handleSort = (key) => {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    );
  };

  const filtered = useMemo(() => {
    return menu
      .filter((m) => {
        if (eventFilter !== 'ALL' && m.event !== eventFilter) return false;
        if (courseFilter !== 'ALL' && m.course !== courseFilter) return false;
        if (dietFilter !== 'ALL' && m.dietaryTag !== dietFilter) return false;
        if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            m.dishName.toLowerCase().includes(q) ||
            (m.course || '').toLowerCase().includes(q) ||
            (m.notes || '').toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const vA = String(a[sort.key] || '');
        const vB = String(b[sort.key] || '');
        return sort.dir === 'asc' ? vA.localeCompare(vB) : vB.localeCompare(vA);
      });
  }, [menu, eventFilter, courseFilter, dietFilter, statusFilter, search, sort]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Catering & Menu List</h2>
          <p className="text-xs text-stone-500">
            Organize and finalize dishes by ceremony, course, and dietary preferences.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {perms.delete && selectedIds.length > 0 && (
            <button
              onClick={() => setBulkDeleteConfirm(true)}
              className="px-3.5 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Trash2 size={14} /> Delete ({selectedIds.length})
            </button>
          )}
          {perms.add && (
            <button
              onClick={openAdd}
              className="px-4 py-2.5 rounded-xl bg-[#7A1C24] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:bg-[#5E141B]"
            >
              <Plus size={16} /> Add Dish
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3.5 flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes..."
            className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl text-xs"
          />
        </div>
        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
        >
          <option value="ALL">All Events</option>
          {MENU_EVENTS.map((ev) => (
            <option key={ev} value={ev}>
              {ev}
            </option>
          ))}
        </select>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
        >
          <option value="ALL">All Courses</option>
          {MENU_COURSES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={dietFilter}
          onChange={(e) => setDietFilter(e.target.value)}
          className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
        >
          <option value="ALL">All Dietary Tags</option>
          {DIETARY_TAGS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
        >
          <option value="ALL">All Statuses</option>
          {DISH_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Menu Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                {perms.delete && (
                  <th className="px-3 py-3 w-8">
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && selectedIds.length === filtered.length}
                      onChange={(e) =>
                        setSelectedIds(e.target.checked ? filtered.map((m) => m.id) : [])
                      }
                      className="rounded border-stone-300"
                    />
                  </th>
                )}
                <SortableHeader label="Dish Name" sortKey="dishName" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="Event" sortKey="event" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="Course" sortKey="course" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="Dietary" sortKey="dietaryTag" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="Status" sortKey="status" currentSort={sort} onSort={handleSort} />
                <th className="px-3 py-3 text-xs font-semibold uppercase text-stone-600 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-stone-500">
                    No dishes added to the menu yet.
                  </td>
                </tr>
              ) : (
                filtered.map((dish) => (
                  <tr key={dish.id} className="hover:bg-stone-50/70">
                    {perms.delete && (
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(dish.id)}
                          onChange={(e) =>
                            setSelectedIds((prev) =>
                              e.target.checked
                                ? [...prev, dish.id]
                                : prev.filter((id) => id !== dish.id)
                            )
                          }
                          className="rounded border-stone-300"
                        />
                      </td>
                    )}
                    <td className="px-3 py-3">
                      <div className="font-bold text-stone-900">{dish.dishName}</div>
                      {dish.notes && <div className="text-[11px] text-stone-500">{dish.notes}</div>}
                    </td>
                    <td className="px-3 py-3 font-medium text-stone-800">{dish.event}</td>
                    <td className="px-3 py-3 text-stone-700">{dish.course}</td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                        {dish.dietaryTag}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          dish.status === 'Finalized'
                            ? 'bg-emerald-100 text-emerald-800'
                            : dish.status === 'Rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {dish.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        {perms.update && (
                          <button
                            onClick={() => openEdit(dish)}
                            className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                        {perms.delete && (
                          <button
                            onClick={() => setDeleteTarget(dish)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Menu Dish' : 'Add Dish to Menu'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Dish Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={form.dishName}
              onChange={(e) => setForm({ ...form, dishName: e.target.value })}
              placeholder="Enter dish name"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DropdownWithOther
              label="Event"
              value={form.event}
              onChange={(val) => setForm({ ...form, event: val })}
              options={MENU_EVENTS}
              placeholder="Enter event name"
            />
            <DropdownWithOther
              label="Course"
              value={form.course}
              onChange={(val) => setForm({ ...form, course: val })}
              options={MENU_COURSES}
              placeholder="Enter course name"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DropdownWithOther
              label="Dietary Tag"
              value={form.dietaryTag}
              onChange={(val) => setForm({ ...form, dietaryTag: val })}
              options={DIETARY_TAGS}
              placeholder="Enter dietary tag"
            />
            <DropdownWithOther
              label="Selection Status"
              value={form.status}
              onChange={(val) => setForm({ ...form, status: val })}
              options={DISH_STATUSES}
              placeholder="Enter status"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Tasting Notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#7A1C24] text-white text-xs font-semibold"
            >
              Save Dish
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Dish?"
        message={`Remove "${deleteTarget?.dishName}" from the menu?`}
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        isOpen={bulkDeleteConfirm}
        title="Delete Selected Dishes?"
        message={`Delete ${selectedIds.length} selected dishes?`}
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteConfirm(false)}
      />
    </div>
  );
}

// ==========================================
// MODULE 5: EXPENSE MANAGEMENT & MULTI-PHOTO RECEIPT CAMERA
// (NO TARGET BUDGET, NO CSV)
// ==========================================
function ExpensesModule({
  expenses,
  weddingId,
  perms,
  setState,
  stampUser,
  recordAudit,
  showToast,
}) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState('ALL');
  const [sort, setSort] = useState({ key: 'dueDate', dir: 'asc' });

  const [selectedIds, setSelectedIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  // Receipt Camera & Gallery Lightbox
  const [webcamOpen, setWebcamOpen] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [lightboxPhotos, setLightboxPhotos] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [form, setForm] = useState({
    description: '',
    category: 'Venue',
    vendor: '',
    totalAmount: '',
    advancePaid: '',
    paymentMode: 'UPI',
    paymentStatus: 'Partial',
    dueDate: '',
    receipts: [],
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      description: '',
      category: 'Venue',
      vendor: '',
      totalAmount: '',
      advancePaid: '',
      paymentMode: 'UPI',
      paymentStatus: 'Partial',
      dueDate: '',
      receipts: [],
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      description: item.description,
      category: item.category || 'Venue',
      vendor: item.vendor || '',
      totalAmount: item.totalAmount ?? '',
      advancePaid: item.advancePaid ?? '',
      paymentMode: item.paymentMode || 'UPI',
      paymentStatus: item.paymentStatus || 'Partial',
      dueDate: item.dueDate || '',
      receipts: Array.isArray(item.receipts) ? item.receipts : [],
    });
    setModalOpen(true);
  };

  const handleReceiptFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const compressedList = await Promise.all(
      files.map((f) => compressImageFile(f, 900, 0.72))
    );
    setForm((prev) => ({ ...prev, receipts: [...prev.receipts, ...compressedList] }));
    e.target.value = '';
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      setWebcamOpen(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch {
      showToast('Camera access unavailable; use Device Camera or Upload Photos instead', 'error');
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setWebcamOpen(false);
  };

  const captureWebcamPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
    setForm((prev) => ({ ...prev, receipts: [...prev.receipts, dataUrl] }));
    showToast('Receipt photo captured!');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.description.trim()) return;
    const payload = {
      ...form,
      totalAmount: Number(form.totalAmount) || 0,
      advancePaid: Number(form.advancePaid) || 0,
    };
    if (editing) {
      setState((prev) => ({
        ...prev,
        expenses: prev.expenses.map((x) =>
          x.id === editing.id ? { ...x, ...payload, ...stampUser(x) } : x
        ),
      }));
      recordAudit(
        'Expenses',
        'Updated',
        `Updated expense "${payload.description}" (${formatINR(payload.totalAmount)})`
      );
      showToast('Expense updated');
    } else {
      const created = {
        id: uid('exp'),
        weddingId,
        ...payload,
        ...stampUser(),
      };
      setState((prev) => ({ ...prev, expenses: [...prev.expenses, created] }));
      recordAudit(
        'Expenses',
        'Created',
        `Added expense "${payload.description}" (${formatINR(payload.totalAmount)})`
      );
      showToast('Expense added');
    }
    stopWebcam();
    setModalOpen(false);
  };

  const handleDelete = (item) => {
    setState((prev) => ({ ...prev, expenses: prev.expenses.filter((x) => x.id !== item.id) }));
    recordAudit('Expenses', 'Deleted', `Deleted expense "${item.description}"`);
    showToast('Expense deleted');
    setDeleteTarget(null);
  };

  const handleBulkDelete = () => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((x) => !selectedIds.includes(x.id)),
    }));
    recordAudit('Expenses', 'Deleted', `Bulk deleted ${selectedIds.length} expenses`);
    showToast(`Deleted ${selectedIds.length} expenses`);
    setSelectedIds([]);
    setBulkDeleteConfirm(false);
  };

  const handleSort = (key) => {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    );
  };

  const filtered = useMemo(() => {
    return expenses
      .filter((x) => {
        if (categoryFilter !== 'ALL' && x.category !== categoryFilter) return false;
        if (statusFilter !== 'ALL' && x.paymentStatus !== statusFilter) return false;
        if (modeFilter !== 'ALL' && x.paymentMode !== modeFilter) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            x.description.toLowerCase().includes(q) ||
            (x.vendor || '').toLowerCase().includes(q) ||
            (x.category || '').toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sort.key === 'totalAmount' || sort.key === 'advancePaid') {
          return sort.dir === 'asc'
            ? (Number(a[sort.key]) || 0) - (Number(b[sort.key]) || 0)
            : (Number(b[sort.key]) || 0) - (Number(a[sort.key]) || 0);
        }
        if (sort.key === 'balanceDue') {
          const bA = (Number(a.totalAmount) || 0) - (Number(a.advancePaid) || 0);
          const bB = (Number(b.totalAmount) || 0) - (Number(b.advancePaid) || 0);
          return sort.dir === 'asc' ? bA - bB : bB - bA;
        }
        const vA = String(a[sort.key] || '');
        const vB = String(b[sort.key] || '');
        return sort.dir === 'asc' ? vA.localeCompare(vB) : vB.localeCompare(vA);
      });
  }, [expenses, categoryFilter, statusFilter, modeFilter, search, sort]);

  const totalCommitted = expenses.reduce((sum, x) => sum + (Number(x.totalAmount) || 0), 0);
  const totalPaid = expenses.reduce((sum, x) => sum + (Number(x.advancePaid) || 0), 0);
  const totalBalance = expenses.reduce(
    (sum, x) => sum + Math.max(0, (Number(x.totalAmount) || 0) - (Number(x.advancePaid) || 0)),
    0
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Expenses & Receipt Tracker</h2>
          <p className="text-xs text-stone-500">
            Track vendor payments, balances due, and multi-photo receipt proofs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {perms.delete && selectedIds.length > 0 && (
            <button
              onClick={() => setBulkDeleteConfirm(true)}
              className="px-3.5 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Trash2 size={14} /> Delete ({selectedIds.length})
            </button>
          )}
          {perms.add && (
            <button
              onClick={openAdd}
              className="px-4 py-2.5 rounded-xl bg-[#7A1C24] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:bg-[#5E141B]"
            >
              <Plus size={16} /> Add Expense
            </button>
          )}
        </div>
      </div>

      {/* Financial Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-4">
          <div className="text-xs font-semibold text-stone-500">Total Committed Cost</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">{formatINR(totalCommitted)}</div>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-4">
          <div className="text-xs font-semibold text-stone-500">Total Advance / Paid</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{formatINR(totalPaid)}</div>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-4">
          <div className="text-xs font-semibold text-stone-500">Total Balance Due</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{formatINR(totalBalance)}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3.5 flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses, vendors, categories..."
            className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl text-xs"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
        >
          <option value="ALL">All Categories</option>
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
        >
          <option value="ALL">All Payment Status</option>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={modeFilter}
          onChange={(e) => setModeFilter(e.target.value)}
          className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
        >
          <option value="ALL">All Modes</option>
          {PAYMENT_MODES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Expense Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                {perms.delete && (
                  <th className="px-3 py-3 w-8">
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && selectedIds.length === filtered.length}
                      onChange={(e) =>
                        setSelectedIds(e.target.checked ? filtered.map((x) => x.id) : [])
                      }
                      className="rounded border-stone-300"
                    />
                  </th>
                )}
                <SortableHeader label="Item & Vendor" sortKey="description" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="Category" sortKey="category" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="Agreed" sortKey="totalAmount" currentSort={sort} onSort={handleSort} align="right" />
                <SortableHeader label="Paid" sortKey="advancePaid" currentSort={sort} onSort={handleSort} align="right" />
                <SortableHeader label="Balance" sortKey="balanceDue" currentSort={sort} onSort={handleSort} align="right" />
                <SortableHeader label="Status" sortKey="paymentStatus" currentSort={sort} onSort={handleSort} />
                <th className="px-3 py-3 text-xs font-semibold uppercase text-stone-600 text-center">
                  Receipts
                </th>
                <th className="px-3 py-3 text-xs font-semibold uppercase text-stone-600 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-stone-500">
                    No expenses logged yet.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const balance = Math.max(
                    0,
                    (Number(item.totalAmount) || 0) - (Number(item.advancePaid) || 0)
                  );
                  const receiptCount = Array.isArray(item.receipts) ? item.receipts.length : 0;
                  return (
                    <tr key={item.id} className="hover:bg-stone-50/70">
                      {perms.delete && (
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(item.id)}
                            onChange={(e) =>
                              setSelectedIds((prev) =>
                                e.target.checked
                                  ? [...prev, item.id]
                                  : prev.filter((id) => id !== item.id)
                              )
                            }
                            className="rounded border-stone-300"
                          />
                        </td>
                      )}
                      <td className="px-3 py-3">
                        <div className="font-bold text-stone-900">{item.description}</div>
                        <div className="text-[11px] text-stone-500">
                          {item.vendor || 'No vendor'} {item.dueDate ? `• Due: ${item.dueDate}` : ''}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-stone-700">{item.category}</td>
                      <td className="px-3 py-3 text-right font-semibold">
                        {formatINR(item.totalAmount)}
                      </td>
                      <td className="px-3 py-3 text-right text-emerald-700 font-semibold">
                        {formatINR(item.advancePaid)}
                      </td>
                      <td className="px-3 py-3 text-right text-amber-700 font-bold">
                        {formatINR(balance)}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.paymentStatus === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.paymentStatus === 'Overdue'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.paymentStatus} ({item.paymentMode})
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {receiptCount > 0 ? (
                          <button
                            onClick={() => {
                              setLightboxPhotos(item.receipts);
                              setLightboxIndex(0);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-300 text-[#7A1C24] font-semibold hover:bg-amber-100"
                          >
                            <ImageIcon size={12} /> View ({receiptCount})
                          </button>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          {perms.update && (
                            <button
                              onClick={() => openEdit(item)}
                              className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}
                          {perms.delete && (
                            <button
                              onClick={() => setDeleteTarget(item)}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Expense Modal with Multi-Photo Receipt Camera */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          stopWebcam();
          setModalOpen(false);
        }}
        title={editing ? 'Edit Expense & Receipts' : 'Log New Expense'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Expense Description <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter expense description"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <DropdownWithOther
              label="Category"
              value={form.category}
              onChange={(val) => setForm({ ...form, category: val })}
              options={EXPENSE_CATEGORIES}
              placeholder="Enter category"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Vendor Name</label>
              <input
                type="text"
                value={form.vendor}
                onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Total Agreed (₹) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={form.totalAmount}
                onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Advance Paid (₹)
              </label>
              <input
                type="number"
                min="0"
                value={form.advancePaid}
                onChange={(e) => setForm({ ...form, advancePaid: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <DropdownWithOther
              label="Payment Mode"
              value={form.paymentMode}
              onChange={(val) => setForm({ ...form, paymentMode: val })}
              options={PAYMENT_MODES}
              placeholder="Enter payment mode"
            />
            <DropdownWithOther
              label="Payment Status"
              value={form.paymentStatus}
              onChange={(val) => setForm({ ...form, paymentStatus: val })}
              options={PAYMENT_STATUSES}
              placeholder="Enter payment status"
            />
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Multi-Photo Receipt Section */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-stone-800">
                Receipt / Bill Photos ({form.receipts.length})
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={webcamOpen ? stopWebcam : startWebcam}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7A1C24] text-white text-xs font-semibold"
                >
                  <Camera size={14} /> {webcamOpen ? 'Close Camera' : 'Open Camera'}
                </button>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-700 text-xs font-semibold cursor-pointer">
                  <Camera size={14} /> Mobile Camera
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    onChange={handleReceiptFiles}
                    className="hidden"
                  />
                </label>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-700 text-xs font-semibold cursor-pointer">
                  <Upload size={14} /> Upload Photos
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleReceiptFiles}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {webcamOpen && (
              <div className="space-y-2 bg-black p-2 rounded-xl text-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-h-56 object-contain mx-auto rounded-lg"
                />
                <button
                  type="button"
                  onClick={captureWebcamPhoto}
                  className="px-4 py-1.5 rounded-lg bg-amber-400 text-stone-950 text-xs font-bold"
                >
                  Snap Receipt Photo
                </button>
              </div>
            )}

            {form.receipts.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {form.receipts.map((src, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-stone-300 aspect-square bg-white">
                    <img src={src} alt={`Receipt ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          receipts: prev.receipts.filter((_, i) => i !== idx),
                        }))
                      }
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-90 hover:opacity-100"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => {
                stopWebcam();
                setModalOpen(false);
              }}
              className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#7A1C24] text-white text-xs font-semibold"
            >
              Save Expense
            </button>
          </div>
        </form>
      </Modal>

      {/* Receipt Lightbox Gallery */}
      <Modal
        isOpen={Boolean(lightboxPhotos)}
        onClose={() => setLightboxPhotos(null)}
        title={`Receipt Gallery (${lightboxIndex + 1} of ${lightboxPhotos?.length || 0})`}
        maxWidth="max-w-2xl"
      >
        {lightboxPhotos && (
          <div className="space-y-3">
            <div className="bg-stone-950 rounded-xl p-2 flex items-center justify-center">
              <img
                src={lightboxPhotos[lightboxIndex]}
                alt="Receipt proof"
                className="max-h-[62vh] object-contain rounded-lg"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                disabled={lightboxIndex === 0}
                onClick={() => setLightboxIndex((i) => Math.max(0, i - 1))}
                className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold disabled:opacity-40"
              >
                Previous
              </button>
              <a
                href={lightboxPhotos[lightboxIndex]}
                download={`receipt_${lightboxIndex + 1}.jpg`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 text-xs font-semibold"
              >
                <Download size={13} /> Download Image
              </a>
              <button
                disabled={lightboxIndex >= lightboxPhotos.length - 1}
                onClick={() =>
                  setLightboxIndex((i) => Math.min(lightboxPhotos.length - 1, i + 1))
                }
                className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Expense?"
        message={`Delete "${deleteTarget?.description}"?`}
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        isOpen={bulkDeleteConfirm}
        title="Delete Selected Expenses?"
        message={`Delete ${selectedIds.length} selected expenses?`}
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteConfirm(false)}
      />
    </div>
  );
}

// ==========================================
// MODULE 6: WORK ASSIGNMENT & BALANCING
// ==========================================
function TasksModule({
  tasks,
  users,
  weddingId,
  perms,
  setState,
  stampUser,
  recordAudit,
  showToast,
}) {
  const [search, setSearch] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sort, setSort] = useState({ key: 'dueDate', dir: 'asc' });

  const [selectedIds, setSelectedIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  const memberOptions = useMemo(() => {
    const names = users.map((u) => u.name).filter(Boolean);
    return names.length > 0 ? names : ['Super Admin'];
  }, [users]);

  const [form, setForm] = useState({
    title: '',
    assignee: memberOptions[0] || 'Super Admin',
    eventTag: 'Wedding',
    department: 'Catering',
    priority: 'Medium',
    dueDate: '',
    status: 'To-Do',
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      title: '',
      assignee: memberOptions[0] || 'Super Admin',
      eventTag: 'Wedding',
      department: 'Catering',
      priority: 'Medium',
      dueDate: '',
      status: 'To-Do',
    });
    setModalOpen(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({
      title: t.title,
      assignee: t.assignee || memberOptions[0] || 'Super Admin',
      eventTag: t.eventTag || 'Wedding',
      department: t.department || 'Catering',
      priority: t.priority || 'Medium',
      dueDate: t.dueDate || '',
      status: t.status || 'To-Do',
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editing) {
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === editing.id ? { ...t, ...form, ...stampUser(t) } : t
        ),
      }));
      recordAudit('Tasks', 'Updated', `Updated task "${form.title}" (${form.assignee})`);
      showToast('Task updated');
    } else {
      const created = {
        id: uid('tsk'),
        weddingId,
        ...form,
        ...stampUser(),
      };
      setState((prev) => ({ ...prev, tasks: [...prev.tasks, created] }));
      recordAudit('Tasks', 'Created', `Assigned "${form.title}" to ${form.assignee}`);
      showToast('Task assigned');
    }
    setModalOpen(false);
  };

  const handleDelete = (t) => {
    setState((prev) => ({ ...prev, tasks: prev.tasks.filter((x) => x.id !== t.id) }));
    recordAudit('Tasks', 'Deleted', `Deleted task "${t.title}"`);
    showToast('Task deleted');
    setDeleteTarget(null);
  };

  const handleBulkDelete = () => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((x) => !selectedIds.includes(x.id)),
    }));
    recordAudit('Tasks', 'Deleted', `Bulk deleted ${selectedIds.length} tasks`);
    showToast(`Deleted ${selectedIds.length} tasks`);
    setSelectedIds([]);
    setBulkDeleteConfirm(false);
  };

  const handleSort = (key) => {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    );
  };

  // Workload Balancing Summary per Assignee
  const workloadStats = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      const person = t.assignee || 'Unassigned';
      if (!map[person]) map[person] = { name: person, total: 0, done: 0, pending: 0 };
      map[person].total++;
      if (t.status === 'Done') map[person].done++;
      else map[person].pending++;
    });
    return Object.values(map).sort((a, b) => b.pending - a.pending);
  }, [tasks]);

  const uniqueAssignees = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.assignee).filter(Boolean))),
    [tasks]
  );

  const filtered = useMemo(() => {
    return tasks
      .filter((t) => {
        if (assigneeFilter !== 'ALL' && t.assignee !== assigneeFilter) return false;
        if (deptFilter !== 'ALL' && t.department !== deptFilter) return false;
        if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
        if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            t.title.toLowerCase().includes(q) ||
            (t.assignee || '').toLowerCase().includes(q) ||
            (t.department || '').toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const vA = String(a[sort.key] || '');
        const vB = String(b[sort.key] || '');
        return sort.dir === 'asc' ? vA.localeCompare(vB) : vB.localeCompare(vA);
      });
  }, [tasks, assigneeFilter, deptFilter, priorityFilter, statusFilter, search, sort]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Work Assignment & Balancing</h2>
          <p className="text-xs text-stone-500">
            Distribute responsibilities evenly across family members and coordinators.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {perms.delete && selectedIds.length > 0 && (
            <button
              onClick={() => setBulkDeleteConfirm(true)}
              className="px-3.5 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Trash2 size={14} /> Delete ({selectedIds.length})
            </button>
          )}
          {perms.add && (
            <button
              onClick={openAdd}
              className="px-4 py-2.5 rounded-xl bg-[#7A1C24] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:bg-[#5E141B]"
            >
              <Plus size={16} /> Assign Task
            </button>
          )}
        </div>
      </div>

      {/* Workload Balancing Cards */}
      {workloadStats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {workloadStats.map((w) => {
            const pct = w.total > 0 ? Math.round((w.done / w.total) * 100) : 0;
            const matchedUser = users.find((u) => u.name === w.name);
            return (
              <div
                key={w.name}
                onClick={() =>
                  setAssigneeFilter((prev) => (prev === w.name ? 'ALL' : w.name))
                }
                className={`bg-white rounded-xl border p-3.5 cursor-pointer transition ${
                  assigneeFilter === w.name
                    ? 'border-[#7A1C24] ring-2 ring-[#7A1C24]/15'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserAvatar name={w.name} avatar={matchedUser?.avatar || ''} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-stone-900 truncate">{w.name}</div>
                    <div className="text-[11px] text-stone-500">
                      {w.done}/{w.total} Done • {w.pending} Pending
                    </div>
                  </div>
                </div>
                <div className="mt-2.5 w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#7A1C24]" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3.5 flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks, assignees, departments..."
            className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl text-xs"
          />
        </div>
        <select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
        >
          <option value="ALL">All Assignees</option>
          {uniqueAssignees.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
        >
          <option value="ALL">All Departments</option>
          {TASK_DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
        >
          <option value="ALL">All Priorities</option>
          {TASK_PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
        >
          <option value="ALL">All Statuses</option>
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                {perms.delete && (
                  <th className="px-3 py-3 w-8">
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && selectedIds.length === filtered.length}
                      onChange={(e) =>
                        setSelectedIds(e.target.checked ? filtered.map((t) => t.id) : [])
                      }
                      className="rounded border-stone-300"
                    />
                  </th>
                )}
                <SortableHeader label="Task" sortKey="title" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="Assigned To" sortKey="assignee" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="Department" sortKey="department" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="Priority" sortKey="priority" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="Due Date" sortKey="dueDate" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="Status" sortKey="status" currentSort={sort} onSort={handleSort} />
                <th className="px-3 py-3 text-xs font-semibold uppercase text-stone-600 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-stone-500">
                    No tasks assigned yet.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const matchedUser = users.find((u) => u.name === t.assignee);
                  return (
                    <tr key={t.id} className="hover:bg-stone-50/70">
                      {perms.delete && (
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(t.id)}
                            onChange={(e) =>
                              setSelectedIds((prev) =>
                                e.target.checked
                                  ? [...prev, t.id]
                                  : prev.filter((id) => id !== t.id)
                              )
                            }
                            className="rounded border-stone-300"
                          />
                        </td>
                      )}
                      <td className="px-3 py-3">
                        <div className="font-bold text-stone-900">{t.title}</div>
                        <div className="text-[11px] text-stone-500">{t.eventTag}</div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="inline-flex items-center gap-2">
                          <UserAvatar
                            name={t.assignee}
                            avatar={matchedUser?.avatar || ''}
                            size="xs"
                          />
                          <span className="font-semibold text-stone-800">{t.assignee}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-stone-700">{t.department}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.priority === 'High'
                              ? 'bg-red-100 text-red-700'
                              : t.priority === 'Low'
                              ? 'bg-stone-100 text-stone-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-stone-600">{t.dueDate || '—'}</td>
                      <td className="px-3 py-3">
                        <select
                          disabled={!perms.update}
                          value={t.status}
                          onChange={(e) => {
                            const val = e.target.value;
                            setState((prev) => ({
                              ...prev,
                              tasks: prev.tasks.map((item) =>
                                item.id === t.id
                                  ? { ...item, status: val, ...stampUser(item) }
                                  : item
                              ),
                            }));
                            recordAudit('Tasks', 'Updated', `Marked "${t.title}" as ${val}`);
                          }}
                          className={`px-2 py-1 border rounded-lg text-xs font-semibold ${
                            t.status === 'Done'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-white text-stone-700 border-stone-200'
                          }`}
                        >
                          {Array.from(new Set([...TASK_STATUSES, t.status])).map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          {perms.update && (
                            <button
                              onClick={() => openEdit(t)}
                              className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}
                          {perms.delete && (
                            <button
                              onClick={() => setDeleteTarget(t)}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Task' : 'Assign New Task'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Task Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter task description"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DropdownWithOther
              label="Assigned Person"
              required
              value={form.assignee}
              onChange={(val) => setForm({ ...form, assignee: val })}
              options={memberOptions}
              placeholder="Enter assignee name"
            />
            <DropdownWithOther
              label="Linked Event"
              value={form.eventTag}
              onChange={(val) => setForm({ ...form, eventTag: val })}
              options={['All Events', ...EVENT_PRESETS]}
              placeholder="Enter event name"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DropdownWithOther
              label="Department"
              value={form.department}
              onChange={(val) => setForm({ ...form, department: val })}
              options={TASK_DEPARTMENTS}
              placeholder="Enter department"
            />
            <DropdownWithOther
              label="Priority"
              value={form.priority}
              onChange={(val) => setForm({ ...form, priority: val })}
              options={TASK_PRIORITIES}
              placeholder="Enter priority"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <DropdownWithOther
              label="Status"
              value={form.status}
              onChange={(val) => setForm({ ...form, status: val })}
              options={TASK_STATUSES}
              placeholder="Enter status"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#7A1C24] text-white text-xs font-semibold"
            >
              Save Task
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Task?"
        message={`Delete "${deleteTarget?.title}"?`}
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        isOpen={bulkDeleteConfirm}
        title="Delete Selected Tasks?"
        message={`Delete ${selectedIds.length} selected tasks?`}
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteConfirm(false)}
      />
    </div>
  );
}

// ==========================================
// MODULE 7: USERS & PERMISSIONS (SUPER ADMIN & SUB-ADMIN)
// ==========================================
function UsersAdminModule({
  state,
  setState,
  currentUser,
  accessibleWeddings,
  recordAudit,
  showToast,
}) {
  const isSuperAdmin = currentUser.role === 'super_admin';
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    role: 'member',
    avatar: '',
    active: true,
    assignedWeddingIds: [],
    permissions: defaultMemberPermissions(),
  });

  const manageableUsers = useMemo(() => {
    if (isSuperAdmin) return state.users;
    // Sub-Admin can view & manage Members assigned to their weddings
    const myWeddingIds = currentUser.assignedWeddingIds || [];
    return state.users.filter(
      (u) =>
        u.role === 'member' &&
        (u.assignedWeddingIds || []).some((id) => myWeddingIds.includes(id))
    );
  }, [isSuperAdmin, state.users, currentUser]);

  const openAdd = () => {
    setEditingUser(null);
    setForm({
      name: '',
      username: '',
      password: '',
      role: 'member',
      avatar: '',
      active: true,
      assignedWeddingIds: accessibleWeddings[0] ? [accessibleWeddings[0].id] : [],
      permissions: defaultMemberPermissions(),
    });
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setEditingUser(u);
    setForm({
      name: u.name,
      username: u.username,
      password: u.password,
      role: u.role,
      avatar: u.avatar || '',
      active: u.active !== false,
      assignedWeddingIds: Array.isArray(u.assignedWeddingIds) ? u.assignedWeddingIds : [],
      permissions: u.permissions || defaultMemberPermissions(),
    });
    setModalOpen(true);
  };

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImageFile(file, 300, 0.8);
    setForm((prev) => ({ ...prev, avatar: compressed }));
  };

  const toggleWeddingAssignment = (wId) => {
    setForm((prev) => {
      const exists = prev.assignedWeddingIds.includes(wId);
      return {
        ...prev,
        assignedWeddingIds: exists
          ? prev.assignedWeddingIds.filter((id) => id !== wId)
          : [...prev.assignedWeddingIds, wId],
      };
    });
  };

  const updatePermCheckbox = (modKey, field, checked) => {
    setForm((prev) => {
      const current = prev.permissions[modKey] || {
        enabled: false,
        readOnly: false,
        add: false,
        update: false,
        delete: false,
      };
      let next = { ...current, [field]: checked };
      if (field === 'enabled' && !checked) {
        next = { enabled: false, readOnly: false, add: false, update: false, delete: false };
      }
      if (field === 'readOnly' && checked) {
        next = { ...next, enabled: true, readOnly: true, add: false, update: false, delete: false };
      }
      if (['add', 'update', 'delete'].includes(field) && checked) {
        next = { ...next, enabled: true, readOnly: false };
      }
      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [modKey]: next,
        },
      };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.username.trim() || !form.password.trim()) return;

    const duplicate = state.users.find(
      (u) =>
        u.username.toLowerCase() === form.username.trim().toLowerCase() &&
        u.id !== editingUser?.id
    );
    if (duplicate) {
      showToast('Username already exists', 'error');
      return;
    }

    const effectiveRole = isSuperAdmin ? form.role : 'member';
    const effectivePerms =
      effectiveRole === 'super_admin' || effectiveRole === 'sub_admin'
        ? fullPermissions()
        : form.permissions;

    if (editingUser) {
      setState((prev) => ({
        ...prev,
        users: prev.users.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                ...form,
                username: form.username.trim(),
                role: effectiveRole,
                permissions: effectivePerms,
              }
            : u
        ),
      }));
      recordAudit('Users', 'Updated', `Updated user "${form.name}" (${effectiveRole})`);
      showToast('User updated');
    } else {
      const created = {
        id: uid('usr'),
        ...form,
        username: form.username.trim(),
        role: effectiveRole,
        permissions: effectivePerms,
      };
      setState((prev) => ({ ...prev, users: [...prev.users, created] }));
      recordAudit('Users', 'Created', `Created user "${form.name}" (${effectiveRole})`);
      showToast('User account created');
    }
    setModalOpen(false);
  };

  const handleDeleteUser = (u) => {
    if (u.id === 'user_super_admin' || u.id === currentUser.id) return;
    setState((prev) => ({ ...prev, users: prev.users.filter((x) => x.id !== u.id) }));
    recordAudit('Users', 'Deleted', `Deleted user "${u.name}"`);
    showToast('User removed');
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Users, Roles & Module Permissions</h2>
          <p className="text-xs text-stone-500">
            {isSuperAdmin
              ? 'Manage Sub-Admins & Members, assign wedding workspaces, and control module permissions.'
              : 'Manage Member accounts and module permissions for your assigned wedding plans.'}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2.5 rounded-xl bg-[#7A1C24] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:bg-[#5E141B]"
        >
          <Plus size={16} /> Add User Account
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 border-b border-stone-200 text-xs font-semibold uppercase text-stone-600">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Assigned Weddings</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {manageableUsers.map((u) => {
                const assignedNames =
                  u.role === 'super_admin'
                    ? ['All Weddings']
                    : (u.assignedWeddingIds || [])
                        .map((id) => state.weddings.find((w) => w.id === id)?.title)
                        .filter(Boolean);
                return (
                  <tr key={u.id} className="hover:bg-stone-50/70">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar name={u.name} avatar={u.avatar} size="sm" />
                        <div>
                          <div className="font-bold text-stone-900">{u.name}</div>
                          <div className="text-[11px] text-stone-500">@{u.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'super_admin'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'sub_admin'
                            ? 'bg-amber-100 text-[#7A1C24]'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {assignedNames.length > 0 ? assignedNames.join(', ') : 'None assigned'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.active !== false
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {u.active !== false ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEdit(u)}
                          className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
                          title="Edit User & Permissions"
                        >
                          <Edit2 size={14} />
                        </button>
                        {isSuperAdmin && u.id !== 'user_super_admin' && u.id !== currentUser.id && (
                          <button
                            onClick={() => setDeleteTarget(u)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                            title="Delete User"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? `Edit User: ${editingUser.name}` : 'Create New User Account'}
        subtitle="Set display picture, role, wedding access & module checkboxes"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {/* Avatar + Basic Info */}
          <div className="flex flex-wrap items-center gap-4 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <UserAvatar name={form.name || 'U'} avatar={form.avatar} size="lg" />
            <div className="space-y-1">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs font-semibold text-stone-800 cursor-pointer hover:bg-stone-100">
                <Camera size={14} /> Upload Display Picture
                <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
              </label>
              {form.avatar && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, avatar: '' })}
                  className="block text-[11px] text-red-600 hover:underline"
                >
                  Remove Photo
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Login Username <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Password <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Role</label>
              {editingUser?.id === 'user_super_admin' ? (
                <input
                  type="text"
                  disabled
                  value="Super Admin (Primary)"
                  className="w-full px-3 py-2 border border-stone-200 bg-stone-100 rounded-lg text-sm"
                />
              ) : (
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
                >
                  <option value="member">Member (Custom Module Permissions)</option>
                  {isSuperAdmin && (
                    <option value="sub_admin">
                      Sub-Admin (Full Access to Assigned Weddings, Cannot Add Weddings)
                    </option>
                  )}
                  {isSuperAdmin && (
                    <option value="super_admin">
                      Super Admin (Full Control Across All Weddings & Users)
                    </option>
                  )}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Account Status
              </label>
              <select
                disabled={editingUser?.id === 'user_super_admin' || editingUser?.id === currentUser.id}
                value={form.active ? 'active' : 'disabled'}
                onChange={(e) => setForm({ ...form, active: e.target.value === 'active' })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
              >
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>

          {/* Wedding Workspace Assignment */}
          {form.role !== 'super_admin' && (
            <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
              <div className="text-xs font-bold text-stone-800">
                Assigned Wedding Workspaces
              </div>
              {accessibleWeddings.length === 0 ? (
                <p className="text-xs text-stone-500">
                  No wedding plans created yet. Create a wedding plan first to assign it.
                </p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {accessibleWeddings.map((w) => (
                    <label
                      key={w.id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs font-semibold cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={form.assignedWeddingIds.includes(w.id)}
                        onChange={() => toggleWeddingAssignment(w.id)}
                        className="rounded text-[#7A1C24]"
                      />
                      <span>{w.title}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Module Permissions Matrix (For Member Role) */}
          {form.role === 'member' && (
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <div className="px-3.5 py-2.5 bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-800">
                Module Access & Action Permissions
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-stone-50/70 border-b border-stone-200 text-[11px] text-stone-600">
                    <tr>
                      <th className="px-3 py-2">Module</th>
                      <th className="px-3 py-2 text-center">Enabled</th>
                      <th className="px-3 py-2 text-center">Read-Only</th>
                      <th className="px-3 py-2 text-center">Can Add</th>
                      <th className="px-3 py-2 text-center">Can Update</th>
                      <th className="px-3 py-2 text-center">Can Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {MODULES.map((m) => {
                      const p = form.permissions[m.key] || {
                        enabled: false,
                        readOnly: false,
                        add: false,
                        update: false,
                        delete: false,
                      };
                      return (
                        <tr key={m.key}>
                          <td className="px-3 py-2 font-semibold text-stone-800">{m.label}</td>
                          <td className="px-3 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={Boolean(p.enabled)}
                              onChange={(e) =>
                                updatePermCheckbox(m.key, 'enabled', e.target.checked)
                              }
                            />
                          </td>
                          <td className="px-3 py-2 text-center">
                            <input
                              type="checkbox"
                              disabled={!p.enabled}
                              checked={Boolean(p.readOnly)}
                              onChange={(e) =>
                                updatePermCheckbox(m.key, 'readOnly', e.target.checked)
                              }
                            />
                          </td>
                          <td className="px-3 py-2 text-center">
                            <input
                              type="checkbox"
                              disabled={!p.enabled || p.readOnly}
                              checked={Boolean(p.add)}
                              onChange={(e) => updatePermCheckbox(m.key, 'add', e.target.checked)}
                            />
                          </td>
                          <td className="px-3 py-2 text-center">
                            <input
                              type="checkbox"
                              disabled={!p.enabled || p.readOnly}
                              checked={Boolean(p.update)}
                              onChange={(e) =>
                                updatePermCheckbox(m.key, 'update', e.target.checked)
                              }
                            />
                          </td>
                          <td className="px-3 py-2 text-center">
                            <input
                              type="checkbox"
                              disabled={!p.enabled || p.readOnly}
                              checked={Boolean(p.delete)}
                              onChange={(e) =>
                                updatePermCheckbox(m.key, 'delete', e.target.checked)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#7A1C24] text-white text-xs font-semibold"
            >
              Save User
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete User?"
        message={`Delete user "${deleteTarget?.name}"?`}
        onConfirm={() => handleDeleteUser(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}


// ==========================================
// MODULE: VENDOR & SERVICE BOOKINGS (WITH PHONE & BILL PHOTOS)
// ==========================================
function BookingsModule({
  bookings,
  weddingId,
  perms,
  setState,
  stampUser,
  recordAudit,
  showToast,
}) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sort, setSort] = useState({ key: 'serviceDate', dir: 'asc' });

  const [selectedIds, setSelectedIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  // Bill Photo Camera & Gallery Lightbox
  const [webcamOpen, setWebcamOpen] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [lightboxPhotos, setLightboxPhotos] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [form, setForm] = useState({
    title: '',
    category: 'Venue & Banquet Hall',
    vendorName: '',
    phone: '',
    altPhone: '',
    location: '',
    eventTag: 'All Events',
    bookingDate: '',
    serviceDate: '',
    status: 'Confirmed',
    totalAmount: '',
    advancePaid: '',
    paymentMode: 'UPI',
    notes: '',
    bills: [],
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      title: '',
      category: 'Venue & Banquet Hall',
      vendorName: '',
      phone: '',
      altPhone: '',
      location: '',
      eventTag: 'All Events',
      bookingDate: new Date().toISOString().slice(0, 10),
      serviceDate: '',
      status: 'Confirmed',
      totalAmount: '',
      advancePaid: '',
      paymentMode: 'UPI',
      notes: '',
      bills: [],
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title || '',
      category: item.category || 'Venue & Banquet Hall',
      vendorName: item.vendorName || '',
      phone: item.phone || '',
      altPhone: item.altPhone || '',
      location: item.location || '',
      eventTag: item.eventTag || 'All Events',
      bookingDate: item.bookingDate || '',
      serviceDate: item.serviceDate || '',
      status: item.status || 'Confirmed',
      totalAmount: item.totalAmount ?? '',
      advancePaid: item.advancePaid ?? '',
      paymentMode: item.paymentMode || 'UPI',
      notes: item.notes || '',
      bills: Array.isArray(item.bills) ? item.bills : [],
    });
    setModalOpen(true);
  };

  const handleBillFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const compressedList = await Promise.all(
      files.map((f) => compressImageFile(f, 900, 0.72))
    );
    setForm((prev) => ({ ...prev, bills: [...prev.bills, ...compressedList] }));
    e.target.value = '';
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      setWebcamOpen(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch {
      showToast('Camera access unavailable; use Mobile Camera or Upload Photos instead', 'error');
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setWebcamOpen(false);
  };

  const captureWebcamPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
    setForm((prev) => ({ ...prev, bills: [...prev.bills, dataUrl] }));
    showToast('Bill photo captured!');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const payload = {
      ...form,
      totalAmount: Number(form.totalAmount) || 0,
      advancePaid: Number(form.advancePaid) || 0,
    };
    if (editing) {
      setState((prev) => ({
        ...prev,
        bookings: (prev.bookings || []).map((b) =>
          b.id === editing.id ? { ...b, ...payload, ...stampUser(b) } : b
        ),
      }));
      recordAudit('Bookings', 'Updated', `Updated booking "${payload.title}"`);
      showToast('Booking updated');
    } else {
      const created = {
        id: uid('bkg'),
        weddingId,
        ...payload,
        ...stampUser(),
      };
      setState((prev) => ({ ...prev, bookings: [created, ...(prev.bookings || [])] }));
      recordAudit('Bookings', 'Created', `Added booking "${payload.title}"`);
      showToast('Booking saved');
    }
    stopWebcam();
    setModalOpen(false);
  };

  const handleDelete = (item) => {
    setState((prev) => ({
      ...prev,
      bookings: (prev.bookings || []).filter((x) => x.id !== item.id),
    }));
    recordAudit('Bookings', 'Deleted', `Deleted booking "${item.title}"`);
    showToast('Booking deleted');
    setDeleteTarget(null);
  };

  const handleBulkDelete = () => {
    setState((prev) => ({
      ...prev,
      bookings: (prev.bookings || []).filter((x) => !selectedIds.includes(x.id)),
    }));
    recordAudit('Bookings', 'Deleted', `Bulk deleted ${selectedIds.length} bookings`);
    showToast(`Deleted ${selectedIds.length} bookings`);
    setSelectedIds([]);
    setBulkDeleteConfirm(false);
  };

  const handleSort = (key) => {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    );
  };

  const filtered = useMemo(() => {
    return bookings
      .filter((b) => {
        if (categoryFilter !== 'ALL' && b.category !== categoryFilter) return false;
        if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            (b.title || '').toLowerCase().includes(q) ||
            (b.vendorName || '').toLowerCase().includes(q) ||
            (b.phone || '').toLowerCase().includes(q) ||
            (b.location || '').toLowerCase().includes(q) ||
            (b.category || '').toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sort.key === 'totalAmount' || sort.key === 'advancePaid') {
          return sort.dir === 'asc'
            ? (Number(a[sort.key]) || 0) - (Number(b[sort.key]) || 0)
            : (Number(b[sort.key]) || 0) - (Number(a[sort.key]) || 0);
        }
        const vA = String(a[sort.key] || '');
        const vB = String(b[sort.key] || '');
        return sort.dir === 'asc' ? vA.localeCompare(vB) : vB.localeCompare(vA);
      });
  }, [bookings, categoryFilter, statusFilter, search, sort]);

  const confirmedCount = bookings.filter(
    (b) => b.status === 'Confirmed' || b.status === 'Token Paid' || b.status === 'Completed'
  ).length;
  const totalValue = bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
  const totalPaid = bookings.reduce((sum, b) => sum + (Number(b.advancePaid) || 0), 0);
  const totalDue = bookings.reduce(
    (sum, b) => sum + Math.max(0, (Number(b.totalAmount) || 0) - (Number(b.advancePaid) || 0)),
    0
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Vendor & Service Bookings</h2>
          <p className="text-xs text-stone-500">
            Store all vendor bookings, contact numbers, locations, payment terms & bill photos.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {perms.delete && selectedIds.length > 0 && (
            <button
              onClick={() => setBulkDeleteConfirm(true)}
              className="px-3.5 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Trash2 size={14} /> Delete ({selectedIds.length})
            </button>
          )}
          {perms.add && (
            <button
              onClick={openAdd}
              className="px-4 py-2.5 rounded-xl bg-[#7A1C24] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:bg-[#5E141B]"
            >
              <Plus size={16} /> Add Booking
            </button>
          )}
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-stone-200 p-4">
          <div className="text-xs font-semibold text-stone-500">Total Bookings</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">
            {bookings.length}{' '}
            <span className="text-xs font-normal text-emerald-700">({confirmedCount} Active)</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-4">
          <div className="text-xs font-semibold text-stone-500">Total Booking Value</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">{formatINR(totalValue)}</div>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-4">
          <div className="text-xs font-semibold text-stone-500">Advance Paid</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{formatINR(totalPaid)}</div>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-4">
          <div className="text-xs font-semibold text-stone-500">Balance Due</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{formatINR(totalDue)}</div>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3.5 flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookings, vendors, phone numbers, locations..."
            className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl text-xs"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
        >
          <option value="ALL">All Categories</option>
          {BOOKING_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
        >
          <option value="ALL">All Statuses</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {(search || categoryFilter !== 'ALL' || statusFilter !== 'ALL') && (
          <button
            onClick={() => {
              setSearch('');
              setCategoryFilter('ALL');
              setStatusFilter('ALL');
            }}
            className="text-xs font-semibold text-[#7A1C24] hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                {perms.delete && (
                  <th className="px-3 py-3 w-8">
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && selectedIds.length === filtered.length}
                      onChange={(e) =>
                        setSelectedIds(e.target.checked ? filtered.map((b) => b.id) : [])
                      }
                      className="rounded border-stone-300"
                    />
                  </th>
                )}
                <SortableHeader label="Booking & Vendor" sortKey="title" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="Contact & Location" sortKey="phone" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="Event & Date" sortKey="serviceDate" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="Amount & Due" sortKey="totalAmount" currentSort={sort} onSort={handleSort} align="right" />
                <SortableHeader label="Status" sortKey="status" currentSort={sort} onSort={handleSort} />
                <th className="px-3 py-3 text-xs font-semibold uppercase text-stone-600 text-center">
                  Bill Photos
                </th>
                <th className="px-3 py-3 text-xs font-semibold uppercase text-stone-600 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-stone-500">
                    No bookings recorded yet. {perms.add && 'Click "+ Add Booking" to log your first vendor booking.'}
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const balance = Math.max(
                    0,
                    (Number(item.totalAmount) || 0) - (Number(item.advancePaid) || 0)
                  );
                  const billCount = Array.isArray(item.bills) ? item.bills.length : 0;
                  const cleanPhone = String(item.phone || '').replace(/\D/g, '');
                  return (
                    <tr key={item.id} className="hover:bg-stone-50/70">
                      {perms.delete && (
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(item.id)}
                            onChange={(e) =>
                              setSelectedIds((prev) =>
                                e.target.checked
                                  ? [...prev, item.id]
                                  : prev.filter((id) => id !== item.id)
                              )
                            }
                            className="rounded border-stone-300"
                          />
                        </td>
                      )}
                      <td className="px-3 py-3">
                        <div className="font-bold text-stone-900">{item.title}</div>
                        <div className="text-[11px] text-stone-600">
                          {item.vendorName ? `${item.vendorName} • ` : ''}
                          <span className="text-stone-500">{item.category}</span>
                        </div>
                        {item.notes && (
                          <div className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                            {item.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        {item.phone ? (
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`tel:${item.phone}`}
                              className="inline-flex items-center gap-1 font-semibold text-[#7A1C24] hover:underline"
                              title="Call Vendor"
                            >
                              <PhoneCall size={11} /> {item.phone}
                            </a>
                            {cleanPhone.length >= 10 && (
                              <a
                                href={`https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold hover:bg-emerald-100"
                                title="Chat on WhatsApp"
                              >
                                WA
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-stone-400">No phone</span>
                        )}
                        {item.altPhone && (
                          <div className="text-[10px] text-stone-500">Alt: {item.altPhone}</div>
                        )}
                        {item.location && (
                          <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                            <MapPin size={10} /> {item.location}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-medium text-stone-800">{item.eventTag || 'All Events'}</div>
                        <div className="text-[11px] text-stone-500">
                          {item.serviceDate ? `Event: ${item.serviceDate}` : 'Date TBD'}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="font-bold text-stone-900">{formatINR(item.totalAmount)}</div>
                        <div className="text-[10px] text-emerald-700">
                          Paid: {formatINR(item.advancePaid)} ({item.paymentMode || 'UPI'})
                        </div>
                        {balance > 0 && (
                          <div className="text-[10px] font-bold text-amber-700">
                            Due: {formatINR(balance)}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Confirmed' || item.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {billCount > 0 ? (
                          <button
                            onClick={() => {
                              setLightboxPhotos(item.bills);
                              setLightboxIndex(0);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-300 text-[#7A1C24] font-semibold hover:bg-amber-100"
                          >
                            <ImageIcon size={12} /> View ({billCount})
                          </button>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          {perms.update && (
                            <button
                              onClick={() => openEdit(item)}
                              className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
                              title="Edit Booking"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}
                          {perms.delete && (
                            <button
                              onClick={() => setDeleteTarget(item)}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                              title="Delete Booking"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Booking Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          stopWebcam();
          setModalOpen(false);
        }}
        title={editing ? 'Edit Booking Details' : 'Add New Booking'}
        subtitle="Record vendor contact info, booking dates, payment summary & bill photos"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Booking / Service Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter booking or service title"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <DropdownWithOther
              label="Booking Category"
              value={form.category}
              onChange={(val) => setForm({ ...form, category: val })}
              options={BOOKING_CATEGORIES}
              placeholder="Enter booking category"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Vendor / Contact Person
              </label>
              <input
                type="text"
                value={form.vendorName}
                onChange={(e) => setForm({ ...form, vendorName: e.target.value })}
                placeholder="Enter vendor or contact name"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Enter phone number"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Alternate Phone
              </label>
              <input
                type="tel"
                value={form.altPhone}
                onChange={(e) => setForm({ ...form, altPhone: e.target.value })}
                placeholder="Enter alternate phone"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Address / Venue Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Enter address or location"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <DropdownWithOther
              label="For Ceremony / Event"
              value={form.eventTag}
              onChange={(val) => setForm({ ...form, eventTag: val })}
              options={['All Events', ...EVENT_PRESETS]}
              placeholder="Enter ceremony name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Booking Date
              </label>
              <input
                type="date"
                value={form.bookingDate}
                onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Service / Event Date
              </label>
              <input
                type="date"
                value={form.serviceDate}
                onChange={(e) => setForm({ ...form, serviceDate: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <DropdownWithOther
              label="Booking Status"
              value={form.status}
              onChange={(val) => setForm({ ...form, status: val })}
              options={BOOKING_STATUSES}
              placeholder="Enter booking status"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Total Agreed Amount (₹)
              </label>
              <input
                type="number"
                min="0"
                value={form.totalAmount}
                onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
                placeholder="Enter total amount"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Advance / Token Paid (₹)
              </label>
              <input
                type="number"
                min="0"
                value={form.advancePaid}
                onChange={(e) => setForm({ ...form, advancePaid: e.target.value })}
                placeholder="Enter advance paid"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <DropdownWithOther
              label="Payment Mode"
              value={form.paymentMode}
              onChange={(val) => setForm({ ...form, paymentMode: val })}
              options={PAYMENT_MODES}
              placeholder="Enter payment mode"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Package Inclusions, Terms & Notes
            </label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Enter booking details, package inclusions, or remarks"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
            />
          </div>

          {/* Multi-Photo Bill / Invoice Section */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-stone-800">
                Bill / Agreement Photos ({form.bills.length})
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={webcamOpen ? stopWebcam : startWebcam}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7A1C24] text-white text-xs font-semibold"
                >
                  <Camera size={14} /> {webcamOpen ? 'Close Camera' : 'Open Camera'}
                </button>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-700 text-xs font-semibold cursor-pointer">
                  <Camera size={14} /> Mobile Camera
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    onChange={handleBillFiles}
                    className="hidden"
                  />
                </label>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-700 text-xs font-semibold cursor-pointer">
                  <Upload size={14} /> Upload Bill Photos
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleBillFiles}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {webcamOpen && (
              <div className="space-y-2 bg-black p-2 rounded-xl text-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-h-56 object-contain mx-auto rounded-lg"
                />
                <button
                  type="button"
                  onClick={captureWebcamPhoto}
                  className="px-4 py-1.5 rounded-lg bg-amber-400 text-stone-950 text-xs font-bold"
                >
                  Snap Bill Photo
                </button>
              </div>
            )}

            {form.bills.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {form.bills.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-lg overflow-hidden border border-stone-300 aspect-square bg-white"
                  >
                    <img
                      src={src}
                      alt={`Bill ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          bills: prev.bills.filter((_, i) => i !== idx),
                        }))
                      }
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-90 hover:opacity-100"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => {
                stopWebcam();
                setModalOpen(false);
              }}
              className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#7A1C24] text-white text-xs font-semibold"
            >
              Save Booking
            </button>
          </div>
        </form>
      </Modal>

      {/* Bill Photo Lightbox Gallery */}
      <Modal
        isOpen={Boolean(lightboxPhotos)}
        onClose={() => setLightboxPhotos(null)}
        title={`Booking Bill Gallery (${lightboxIndex + 1} of ${lightboxPhotos?.length || 0})`}
        maxWidth="max-w-2xl"
      >
        {lightboxPhotos && (
          <div className="space-y-3">
            <div className="bg-stone-950 rounded-xl p-2 flex items-center justify-center">
              <img
                src={lightboxPhotos[lightboxIndex]}
                alt="Booking bill"
                className="max-h-[62vh] object-contain rounded-lg"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                disabled={lightboxIndex === 0}
                onClick={() => setLightboxIndex((i) => Math.max(0, i - 1))}
                className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold disabled:opacity-40"
              >
                Previous
              </button>
              <a
                href={lightboxPhotos[lightboxIndex]}
                download={`booking_bill_${lightboxIndex + 1}.jpg`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 text-xs font-semibold"
              >
                <Download size={13} /> Download Bill Photo
              </a>
              <button
                disabled={lightboxIndex >= lightboxPhotos.length - 1}
                onClick={() =>
                  setLightboxIndex((i) => Math.min(lightboxPhotos.length - 1, i + 1))
                }
                className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Booking?"
        message={`Delete booking "${deleteTarget?.title}"?`}
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        isOpen={bulkDeleteConfirm}
        title="Delete Selected Bookings?"
        message={`Delete ${selectedIds.length} selected bookings?`}
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteConfirm(false)}
      />
    </div>
  );
}

// ==========================================
// ROOT EXPORT WITH ERROR BOUNDARY
// ==========================================
export function RootApp() {
  return (
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  );
}
