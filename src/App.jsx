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
  { key: 'bill_templates', label: 'Bill Templates', icon: FileImage },
];

// Client-private modules that a Guest House user cannot open on client weddings
const CLIENT_PRIVATE_MODULES = ['guests', 'invites', 'expenses', 'tasks'];

const BOOKING_SLOTS = ['Full Day (24 Hrs)', 'Day / Morning', 'Night / Evening'];

const WEDDING_STATUSES = ['Active', 'Upcoming', 'Completed', 'On Hold'];


const DEFAULT_BILL_TEMPLATES = [
  {
    id: 'tpl_gst_tax_invoice',
    name: 'GST Tax Invoice (Standard Banquet & Rooms)',
    style: 'classic',
    businessName: '',
    tagline: 'Banquet Hall, Lawn & Luxury Guest House',
    address: '',
    phone: '',
    email: '',
    gstin: '',
    sacCode: '996311',
    defaultCgst: 9,
    defaultSgst: 9,
    upiId: '',
    bankDetails: '',
    signatoryLabel: 'Authorized Signatory',
    terms:
      '1. 50% advance required at the time of booking confirmation.\n2. Balance settlement due 24 hours prior to the event.\n3. Electricity backup / generator charges as per actual usage if outside package.',
    isDefault: true,
    ownerUserId: 'system',
  },
  {
    id: 'tpl_token_receipt',
    name: 'Token / Advance Payment Receipt',
    style: 'compact',
    businessName: '',
    tagline: 'Official Booking & Advance Acknowledgement',
    address: '',
    phone: '',
    email: '',
    gstin: '',
    sacCode: '996311',
    defaultCgst: 0,
    defaultSgst: 0,
    upiId: '',
    bankDetails: '',
    signatoryLabel: 'Cashier / Manager',
    terms:
      'Token amount is non-refundable upon cancellation within 30 days of event date. Date shift subject to hall availability.',
    isDefault: false,
    ownerUserId: 'system',
  },
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
  spaces: [],
  billTemplates: DEFAULT_BILL_TEMPLATES,
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
            spaces: Array.isArray(parsed.spaces) ? parsed.spaces : [],
            billTemplates:
              Array.isArray(parsed.billTemplates) && parsed.billTemplates.length > 0
                ? parsed.billTemplates
                : DEFAULT_BILL_TEMPLATES,
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem(`${STORAGE_KEY}_sidebar_collapsed`) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_sidebar_collapsed`, String(sidebarCollapsed));
    } catch {
      // ignore storage errors
    }
  }, [sidebarCollapsed]);

  const [toast, setToast] = useState(null);
  const [weddingModalOpen, setWeddingModalOpen] = useState(false);
  const [editingWedding, setEditingWedding] = useState(null);
  const [deleteWeddingTarget, setDeleteWeddingTarget] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [cloudStatus, setCloudStatus] = useState(supabase ? 'connecting' : 'local');
  const isRemoteUpdateRef = useRef(false);
  const hasLoadedCloudRef = useRef(false);
  const hasUserMutatedRef = useRef(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Wrapper so only genuine user/app mutations trigger a cloud upsert
  const updateState = (updater) => {
    hasUserMutatedRef.current = true;
    setState(updater);
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
          hasLoadedCloudRef.current = true;
          setCloudStatus('error');
          return;
        }
        if (data?.payload) {
          isRemoteUpdateRef.current = true;
          setState((prev) => ({
            ...DEFAULT_STATE,
            ...data.payload,
            billTemplates:
              Array.isArray(data.payload.billTemplates) && data.payload.billTemplates.length > 0
                ? data.payload.billTemplates
                : DEFAULT_BILL_TEMPLATES,
            activeWeddingId: prev.activeWeddingId || data.payload.activeWeddingId || '',
          }));
        }
        hasLoadedCloudRef.current = true;
        setCloudStatus('connected');
      } catch {
        hasLoadedCloudRef.current = true;
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
              billTemplates:
                Array.isArray(payload.new.payload.billTemplates) &&
                payload.new.payload.billTemplates.length > 0
                  ? payload.new.payload.billTemplates
                  : DEFAULT_BILL_TEMPLATES,
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

  // Persist to localStorage & safely sync to Supabase ONLY after initial cloud load and real user changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota limits
    }

    if (!supabase) return;
    if (!hasLoadedCloudRef.current) return;
    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
      return;
    }
    if (!hasUserMutatedRef.current) return;

    const timer = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('app_state')
          .upsert({ id: CLOUD_ROW_ID, payload: state, updated_at: new Date().toISOString() });
        if (!error) {
          hasUserMutatedRef.current = false;
          setCloudStatus('connected');
        }
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
  const isGuestHouse = currentUser?.role === 'guest_house';
  const isSubAdmin = currentUser?.role === 'sub_admin';

  // Resolve Guest House affiliation & default venue for current user
  const resolvedGuestHouseInfo = useMemo(() => {
    if (!currentUser) return { id: '', name: '', city: '', address: '', phone: '', gstin: '' };
    if (currentUser.role === 'guest_house') {
      return {
        id: currentUser?.id,
        name: currentUser.guestHouseName || currentUser.name || '',
        city: currentUser.city || '',
        address: currentUser.address || '',
        phone: currentUser.phone || '',
        gstin: currentUser.gstin || '',
      };
    }
    if (currentUser.guestHouseId) {
      const gh = (state.users || []).find((u) => u.id === currentUser.guestHouseId);
      if (gh) {
        return {
          id: gh.id,
          name: gh.guestHouseName || currentUser.guestHouseName || gh.name || '',
          city: gh.city || '',
          address: gh.address || '',
          phone: gh.phone || '',
          gstin: gh.gstin || '',
        };
      }
    }
    return {
      id: currentUser.guestHouseId || '',
      name: currentUser.guestHouseName || '',
      city: '',
      address: '',
      phone: '',
      gstin: '',
    };
  }, [currentUser, state.users]);

  const defaultVenueName = resolvedGuestHouseInfo.name || '';

  // Accessible weddings for current user:
  // - Super Admin: all weddings
  // - Guest House: ONLY weddings created/owned by this Guest House user
  // - Sub-Admin & Member: ONLY assignedWeddingIds
  const [ghWeddingViewOptIn, setGhWeddingViewOptIn] = useState(false);

  const accessibleWeddings = useMemo(() => {
    if (!currentUser) return [];
    if (isSuperAdmin) return state.weddings;
    if (isGuestHouse) {
      return state.weddings.filter(
        (w) => w.ownerUserId === currentUser?.id || w.guestHouseId === currentUser?.id
      );
    }
    const allowedIds = Array.isArray(currentUser.assignedWeddingIds)
      ? currentUser.assignedWeddingIds
      : [];
    return state.weddings.filter((w) => allowedIds.includes(w.id));
  }, [currentUser, isSuperAdmin, isGuestHouse, state.weddings]);

  // Only Active weddings appear in workspace dropdowns
  const activeDropdownWeddings = useMemo(() => {
    return accessibleWeddings.filter((w) => (w.status || 'Active') === 'Active');
  }, [accessibleWeddings]);

  const activeWedding = useMemo(() => {
    if (activeDropdownWeddings.length === 0) return null;
    return (
      activeDropdownWeddings.find((w) => w.id === state.activeWeddingId) ||
      activeDropdownWeddings[0]
    );
  }, [activeDropdownWeddings, state.activeWeddingId]);

  useEffect(() => {
    if (activeWedding && activeWedding.id !== state.activeWeddingId) {
      updateState((prev) => ({ ...prev, activeWeddingId: activeWedding.id }));
    }
  }, [activeWedding, state.activeWeddingId]);

  // Permissions helper with Guest House client-privacy enforcement
  const getModulePerms = (modKey) => {
    if (!currentUser) return { enabled: false, readOnly: true, add: false, update: false, delete: false };
    if (isSuperAdmin) {
      return { enabled: true, readOnly: false, add: true, update: true, delete: true };
    }
    if (isGuestHouse) {
      // Guest House users cannot view private client family modules
      if (CLIENT_PRIVATE_MODULES.includes(modKey)) {
        return { enabled: false, readOnly: true, add: false, update: false, delete: false };
      }
      return { enabled: true, readOnly: false, add: true, update: true, delete: true };
    }
    if (isSubAdmin) {
      if (modKey === 'bill_templates') {
        return { enabled: false, readOnly: true, add: false, update: false, delete: false };
      }
      return { enabled: true, readOnly: false, add: true, update: true, delete: true };
    }
    // Member role
    if (modKey === 'bill_templates') {
      return { enabled: false, readOnly: true, add: false, update: false, delete: false };
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
      userId: currentUser?.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar || '',
      userRole: currentUser.role,
      module: moduleName,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    updateState((prev) => ({
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

  // Wedding CRUD (Super Admin & Guest House)
  const canManageWeddings = isSuperAdmin || isGuestHouse;

  const handleSaveWedding = (form) => {
    if (!canManageWeddings) return;
    if (editingWedding) {
      updateState((prev) => ({
        ...prev,
        weddings: prev.weddings.map((w) => (w.id === editingWedding.id ? { ...w, ...form } : w)),
      }));
      recordAudit('Weddings', 'Updated', `Updated wedding "${form.title}"`, editingWedding.id);
      showToast('Wedding plan updated');
    } else {
      const newWedding = {
        id: uid('wed'),
        status: 'Active',
        ...form,
        ownerUserId: currentUser?.id,
        guestHouseId: isGuestHouse ? currentUser?.id : resolvedGuestHouseInfo.id || '',
        guestHouseName: isGuestHouse
          ? currentUser.guestHouseName || currentUser.name
          : resolvedGuestHouseInfo.name || '',
        createdAt: new Date().toISOString(),
      };
      updateState((prev) => ({
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
    if (!canManageWeddings || !deleteWeddingTarget) return;
    const targetId = deleteWeddingTarget.id;
    const title = deleteWeddingTarget.title;
    updateState((prev) => {
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

  // Function/Event scoping for Sub-Admins and Members
  const allowedEventNames = useMemo(() => {
    if (!currentUser || isSuperAdmin || isGuestHouse) return null;
    const ids = Array.isArray(currentUser.assignedEventIds) ? currentUser.assignedEventIds : [];
    if (ids.length === 0) return null; // Empty means all functions within assigned wedding
    const matched = state.events
      .filter((e) => e.weddingId === activeWedding?.id && ids.includes(e.id))
      .map((e) => e.name.toLowerCase());
    return new Set(matched);
  }, [currentUser, isSuperAdmin, isGuestHouse, state.events, activeWedding?.id]);

  // All bookings owned by this Guest House across all its weddings (for conflict detection & calendar)
  const guestHouseAllBookings = useMemo(() => {
    if (isSuperAdmin) return state.bookings || [];
    const myWedIds = new Set(accessibleWeddings.map((w) => w.id));
    return (state.bookings || []).filter(
      (b) => myWedIds.has(b.weddingId) || b.ownerUserId === currentUser?.id
    );
  }, [isSuperAdmin, state.bookings, accessibleWeddings, currentUser?.id]);

  const scopedBillTemplates = useMemo(() => {
    const all = Array.isArray(state.billTemplates) && state.billTemplates.length > 0
      ? state.billTemplates
      : DEFAULT_BILL_TEMPLATES;
    if (isSuperAdmin) return all;
    const ownerId = isGuestHouse ? currentUser?.id : resolvedGuestHouseInfo.id;
    return all.filter((t) => t.ownerUserId === 'system' || t.ownerUserId === ownerId);
  }, [state.billTemplates, isSuperAdmin, isGuestHouse, currentUser?.id, resolvedGuestHouseInfo.id]);

  if (!currentUser) {
    return (
      <LoginScreen
        users={state.users}
        onLogin={(userId) => {
          setCurrentUserId(userId);
          const foundUser = (state.users || []).find((u) => u.id === userId);
          setGhWeddingViewOptIn(false);
          setActiveTab(foundUser?.role === 'guest_house' ? 'bookings' : 'dashboard');
        }}
        cloudStatus={cloudStatus}
      />
    );
  }

  // Scoped records for active wedding (and assigned functions if restricted)
  const allWeddingEvents = state.events.filter((e) => e.weddingId === activeWedding?.id);
  const weddingEvents = allowedEventNames
    ? allWeddingEvents.filter((e) => allowedEventNames.has((e.name || '').toLowerCase()))
    : allWeddingEvents;

  const weddingBookings = (state.bookings || []).filter((b) => {
    if (b.weddingId !== activeWedding?.id) return false;
    if (isGuestHouse && b.ownerUserId && b.ownerUserId !== currentUser.id) return false;
    if (allowedEventNames && b.eventTag && b.eventTag !== 'All Events') {
      return allowedEventNames.has(b.eventTag.toLowerCase());
    }
    return true;
  });

  const weddingGuests = isGuestHouse
    ? []
    : state.guests.filter((g) => g.weddingId === activeWedding?.id);
  const weddingInvites = isGuestHouse
    ? []
    : state.invites.filter((i) => i.weddingId === activeWedding?.id);

  const weddingMenu = state.menu.filter((m) => {
    if (m.weddingId !== activeWedding?.id) return false;
    if (allowedEventNames && m.event) {
      return allowedEventNames.has(m.event.toLowerCase());
    }
    return true;
  });

  const weddingExpenses = isGuestHouse
    ? []
    : state.expenses.filter((x) => x.weddingId === activeWedding?.id);

  const weddingTasks = isGuestHouse
    ? []
    : state.tasks.filter((t) => {
        if (t.weddingId !== activeWedding?.id) return false;
        if (allowedEventNames && t.eventTag && t.eventTag !== 'All Events') {
          return allowedEventNames.has(t.eventTag.toLowerCase());
        }
        return true;
      });

  // Scoped spaces & bill templates
  const scopedSpaces = (state.spaces || []).filter((sp) => {
    if (isSuperAdmin) return true;
    const ownerId = isGuestHouse ? currentUser.id : resolvedGuestHouseInfo.id;
    return !ownerId || sp.ownerUserId === ownerId;
  });

  const canManageAdminTabs = isSuperAdmin || isGuestHouse || isSubAdmin;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col lg:flex-row">
      {/* DESKTOP SIDEBAR (COLLAPSIBLE) */}
      <aside
        className={`hidden lg:flex ${
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        } lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-stone-200/90 shadow-xs z-30 transition-all duration-200`}
      >
        {/* Brand Header */}
        <div className="p-3.5 border-b border-stone-200/80 bg-gradient-to-br from-[#7A1C24] to-[#561117] text-white">
          <div
            className={`flex items-center ${
              sidebarCollapsed ? 'flex-col gap-2 justify-center' : 'justify-between gap-2'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <ATLogo size={sidebarCollapsed ? 38 : 40} />
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <h1 className="font-bold text-sm tracking-tight truncate">AT Wedding Planner</h1>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <KGLogo size={15} />
                    <span className="text-[11px] text-amber-200 truncate">
                      {resolvedGuestHouseInfo.name || 'Krishna Groups'}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSidebarCollapsed((c) => !c)}
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 transition shrink-0"
            >
              {sidebarCollapsed ? <MenuIcon size={16} /> : <X size={16} />}
            </button>
          </div>
        </div>

        {/* Active Wedding Switcher (Hidden for Guest House users) */}
        {!isGuestHouse && (
          <div className="p-3 border-b border-stone-200/80 bg-stone-50/70">
            {!sidebarCollapsed ? (
              <>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Active Wedding Workspace
                </label>
                {accessibleWeddings.length > 0 ? (
                  <div className="flex items-center gap-2">
                    {activeWedding?.dp && (
                      <img
                        src={activeWedding.dp}
                        alt={activeWedding.title}
                        className="w-8 h-8 rounded-lg object-cover border border-amber-300 shrink-0"
                      />
                    )}
                    <select
                      value={activeWedding?.id || ''}
                      onChange={(e) =>
                        updateState((prev) => ({ ...prev, activeWeddingId: e.target.value }))
                      }
                      className="w-full px-2.5 py-2 rounded-xl border border-stone-300 bg-white text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-[#7A1C24]"
                    >
                      {activeDropdownWeddings.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.title}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="text-xs text-stone-500 italic py-1">No wedding plan yet</div>
                )}

                {canManageWeddings && (
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
              </>
            ) : (
              canManageWeddings && (
                <button
                  onClick={() => {
                    setEditingWedding(null);
                    setWeddingModalOpen(true);
                  }}
                  title="Add Wedding Plan"
                  className="w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#7A1C24] border border-amber-300/80 flex items-center justify-center transition"
                >
                  <Plus size={16} />
                </button>
              )
            )}
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 p-2.5 space-y-1 overflow-y-auto">
          {visibleModules.map((mod) => {
            const Icon = mod.icon;
            const active = activeTab === mod.key;
            return (
              <button
                key={mod.key}
                onClick={() => setActiveTab(mod.key)}
                title={mod.label}
                className={`w-full flex items-center ${
                  sidebarCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'
                } rounded-xl text-sm font-semibold transition ${
                  active
                    ? 'bg-[#7A1C24] text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Icon
                  size={18}
                  className={`shrink-0 ${active ? 'text-amber-300' : 'text-stone-500'}`}
                />
                {!sidebarCollapsed && <span className="truncate">{mod.label}</span>}
              </button>
            );
          })}

          {canManageAdminTabs && (
            <div className="pt-3 mt-3 border-t border-stone-200 space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Administration
                </div>
              )}
              {canManageWeddings && (
                <button
                  onClick={() => setActiveTab('weddings')}
                  title="Manage Weddings"
                  className={`w-full flex items-center ${
                    sidebarCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'
                  } rounded-xl text-sm font-semibold transition ${
                    activeTab === 'weddings'
                      ? 'bg-[#7A1C24] text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Heart
                    size={18}
                    className={`shrink-0 ${
                      activeTab === 'weddings' ? 'text-amber-300' : 'text-stone-500'
                    }`}
                  />
                  {!sidebarCollapsed && <span className="truncate">Manage Weddings</span>}
                </button>
              )}
              <button
                onClick={() => setActiveTab('users')}
                title="Users & Permissions"
                className={`w-full flex items-center ${
                  sidebarCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'
                } rounded-xl text-sm font-semibold transition ${
                  activeTab === 'users'
                    ? 'bg-[#7A1C24] text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <ShieldCheck
                  size={18}
                  className={`shrink-0 ${
                    activeTab === 'users' ? 'text-amber-300' : 'text-stone-500'
                  }`}
                />
                {!sidebarCollapsed && <span className="truncate">Users & Permissions</span>}
              </button>
            </div>
          )}
        </nav>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-stone-200 bg-stone-50/80">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-2.5">
              <UserAvatar name={currentUser.name} avatar={currentUser.avatar} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-stone-900 truncate">{currentUser.name}</p>
                <div className="flex flex-wrap items-center gap-1 mt-0.5">
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-[#7A1C24]">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                  {resolvedGuestHouseInfo.name && (
                    <span className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded bg-sky-100 text-sky-900 truncate max-w-[110px]">
                      {resolvedGuestHouseInfo.name}
                    </span>
                  )}
                </div>
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
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => setProfileModalOpen(true)}
                title={`${currentUser.name} — Edit Profile & Password`}
              >
                <UserAvatar name={currentUser.name} avatar={currentUser.avatar} size="sm" />
              </button>
              <button
                onClick={() => setCurrentUserId(null)}
                title="Sign Out"
                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={15} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT SHELL */}
      <div
        className={`flex-1 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        } flex flex-col min-h-screen pb-20 lg:pb-0 transition-all duration-200`}
      >
        {/* TOP HEADER */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-stone-200 px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-stone-200 text-stone-700"
            >
              <MenuIcon size={18} />
            </button>
            <button
              type="button"
              onClick={() => setSidebarCollapsed((c) => !c)}
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              className="hidden lg:inline-flex p-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 transition"
            >
              {sidebarCollapsed ? <MenuIcon size={17} /> : <X size={17} />}
            </button>
            {activeWedding?.dp ? (
              <img
                src={activeWedding.dp}
                alt={activeWedding.title}
                className="w-9 h-9 rounded-xl object-cover border border-amber-300 shadow-xs shrink-0"
              />
            ) : (
              <div className="lg:hidden">
                <ATLogo size={34} />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-bold text-sm sm:text-base text-stone-900 truncate">
                  {isGuestHouse
                    ? resolvedGuestHouseInfo.name || 'Guest House Dashboard'
                    : activeWedding
                    ? activeWedding.title
                    : 'AT Wedding Planner'}
                </h2>
                {resolvedGuestHouseInfo.name && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-900 text-[11px] font-semibold">
                    <Building2 size={11} /> {resolvedGuestHouseInfo.name}
                  </span>
                )}
                {activeWedding?.city && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs text-stone-500">
                    <MapPin size={12} /> {activeWedding.city}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 truncate">
                {isGuestHouse
                  ? 'Weddings Bookings, Payment Updates & Billing'
                  : activeWedding
                  ? `${activeWedding.coupleNames || 'Wedding Workspace'}${
                      activeWedding.date ? ` • ${activeWedding.date}` : ''
                    }${activeWedding.venue ? ` • ${activeWedding.venue}` : ''}`
                  : 'Krishna Groups • Select or create a wedding workspace'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">

            {countdown !== null && (!isGuestHouse || ghWeddingViewOptIn) && (
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
                    <div className="text-[10px] text-amber-200">
                      {resolvedGuestHouseInfo.name || 'Krishna Groups'}
                    </div>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1">
                  <X size={18} />
                </button>
              </div>

              {!isGuestHouse && (
              <div className="p-3 border-b border-stone-200 bg-stone-50">
                <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                  Active Wedding
                </label>
                {accessibleWeddings.length > 0 ? (
                  <select
                    value={activeWedding?.id || ''}
                    onChange={(e) => {
                      updateState((prev) => ({ ...prev, activeWeddingId: e.target.value }));
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-2.5 py-2 rounded-lg border border-stone-300 bg-white text-xs font-semibold"
                  >
                    {activeDropdownWeddings.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-xs text-stone-500">No wedding created</div>
                )}
                {canManageWeddings && (
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
              )}

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
                {canManageWeddings && (
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
                {canManageAdminTabs && (
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
          {activeTab === 'weddings' && canManageWeddings ? (
            <WeddingsManager
              weddings={accessibleWeddings}
              activeWeddingId={activeWedding?.id}
              onSelect={(id) => {
                updateState((prev) => ({ ...prev, activeWeddingId: id }));
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
          ) : activeTab === 'users' && canManageAdminTabs ? (
            <UsersAdminModule
              state={state}
              setState={updateState}
              currentUser={currentUser}
              accessibleWeddings={accessibleWeddings}
              resolvedGuestHouseInfo={resolvedGuestHouseInfo}
              recordAudit={recordAudit}
              showToast={showToast}
            />
          ) : activeTab === 'bill_templates' && (isSuperAdmin || isGuestHouse) ? (
            <BillTemplatesModule
              templates={scopedBillTemplates}
              currentUser={currentUser}
              resolvedGuestHouseInfo={resolvedGuestHouseInfo}
              setState={updateState}
              recordAudit={recordAudit}
              showToast={showToast}
            />
          ) : isGuestHouse ? (
            <GuestHouseDashboard
              activeWeddings={activeDropdownWeddings}
              allWeddings={accessibleWeddings}
              bookings={guestHouseAllBookings}
              events={state.events || []}
              menu={state.menu || []}
              spaces={scopedSpaces}
              billTemplates={scopedBillTemplates}
              currentUser={currentUser}
              resolvedGuestHouseInfo={resolvedGuestHouseInfo}
              defaultVenue={defaultVenueName}
              setState={updateState}
              stampUser={stampUser}
              recordAudit={recordAudit}
              showToast={showToast}
            />
          ) : !activeWedding ? (
            <NoWeddingEmptyState
              canCreateWedding={canManageWeddings}
              guestHouseName={resolvedGuestHouseInfo.name}
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
                  defaultVenue={defaultVenueName}
                  perms={getModulePerms('events')}
                  setState={updateState}
                  stampUser={stampUser}
                  recordAudit={recordAudit}
                  showToast={showToast}
                />
              )}
              {activeTab === 'bookings' && (
                <BookingsModule
                  bookings={weddingBookings}
                  allScopeBookings={guestHouseAllBookings}
                  spaces={scopedSpaces}
                  billTemplates={scopedBillTemplates}
                  weddingEvents={allWeddingEvents}
                  weddingMenu={state.menu.filter((m) => m.weddingId === activeWedding?.id)}
                  ghWeddingViewOptIn={ghWeddingViewOptIn}
                  onToggleWeddingView={() => setGhWeddingViewOptIn((v) => !v)}
                  activeWedding={activeWedding}
                  weddingId={activeWedding.id}
                  currentUser={currentUser}
                  resolvedGuestHouseInfo={resolvedGuestHouseInfo}
                  defaultVenue={defaultVenueName}
                  perms={getModulePerms('bookings')}
                  setState={updateState}
                  stampUser={stampUser}
                  recordAudit={recordAudit}
                  showToast={showToast}
                />
              )}
              {activeTab === 'guests' && !isGuestHouse && (
                <GuestsModule
                  guests={weddingGuests}
                  activeWedding={activeWedding}
                  perms={getModulePerms('guests')}
                  setState={updateState}
                  stampUser={stampUser}
                  recordAudit={recordAudit}
                  showToast={showToast}
                />
              )}
              {activeTab === 'invites' && !isGuestHouse && (
                <InvitesMediaModule
                  invites={weddingInvites}
                  activeWedding={activeWedding}
                  perms={getModulePerms('invites')}
                  setState={updateState}
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
                  setState={updateState}
                  stampUser={stampUser}
                  recordAudit={recordAudit}
                  showToast={showToast}
                />
              )}
              {activeTab === 'expenses' && !isGuestHouse && (
                <ExpensesModule
                  expenses={weddingExpenses}
                  weddingId={activeWedding.id}
                  perms={getModulePerms('expenses')}
                  setState={updateState}
                  stampUser={stampUser}
                  recordAudit={recordAudit}
                  showToast={showToast}
                />
              )}
              {activeTab === 'tasks' && !isGuestHouse && (
                <TasksModule
                  tasks={weddingTasks}
                  users={state.users}
                  weddingId={activeWedding.id}
                  perms={getModulePerms('tasks')}
                  setState={updateState}
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

      {/* ADD / EDIT WEDDING MODAL */}
      <WeddingFormModal
        isOpen={weddingModalOpen}
        onClose={() => {
          setWeddingModalOpen(false);
          setEditingWedding(null);
        }}
        initialData={editingWedding}
        defaultVenue={defaultVenueName}
        defaultCity={resolvedGuestHouseInfo.city}
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
        resolvedGuestHouseInfo={resolvedGuestHouseInfo}
        onSave={(updates) => {
          updateState((prev) => ({
            ...prev,
            users: prev.users.map((u) => (u.id === currentUser.id ? { ...u, ...updates } : u)),
          }));
          recordAudit('Profile', 'Updated', 'Updated profile settings');
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
function NoWeddingEmptyState({ canCreateWedding, guestHouseName, onCreateWedding }) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-8 sm:p-12 text-center max-w-xl mx-auto my-8 space-y-5">
      <div className="flex justify-center items-center gap-3">
        <ATLogo size={56} />
        <KGLogo size={42} />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold text-stone-900">Welcome to AT Wedding Planner</h2>
        <p className="text-xs font-semibold text-[#7A1C24] uppercase tracking-wider">
          {guestHouseName || 'Krishna Groups'}
        </p>
        <p className="text-sm text-stone-600 pt-2">
          {canCreateWedding
            ? 'No wedding plan has been created yet. Create your first wedding workspace to start managing bookings, events, menus, and client access.'
            : 'No wedding workspace has been assigned to your account yet. Please contact your administrator.'}
        </p>
      </div>
      {canCreateWedding && (
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
// WEDDING WORKSPACE MODAL & MANAGER (WITH DP & DEFAULT VENUE)
// ==========================================
function WeddingFormModal({
  isOpen,
  onClose,
  initialData,
  defaultVenue = '',
  defaultCity = '',
  onSave,
}) {
  const [title, setTitle] = useState('');
  const [coupleNames, setCoupleNames] = useState('');
  const [status, setStatus] = useState('Active');
  const [date, setDate] = useState('');
  const [city, setCity] = useState('');
  const [venue, setVenue] = useState('');
  const [dp, setDp] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCoupleNames(initialData.coupleNames || '');
      setStatus(initialData.status || 'Active');
      setDate(initialData.date || '');
      setCity(initialData.city || '');
      setVenue(initialData.venue || defaultVenue || '');
      setDp(initialData.dp || '');
    } else {
      setTitle('');
      setCoupleNames('');
      setStatus('Active');
      setDate('');
      setCity(defaultCity || '');
      setVenue(defaultVenue || '');
      setDp('');
    }
  }, [initialData, isOpen, defaultVenue, defaultCity]);

  const handleDpUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImageFile(file, 450, 0.8);
    setDp(compressed);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      coupleNames: coupleNames.trim(),
      status: status || 'Active',
      date,
      city: city.trim(),
      venue: venue.trim(),
      dp,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Wedding Plan' : 'Create New Wedding Plan'}
      subtitle="Configure wedding display picture, dates, and venue"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Wedding DP Uploader */}
        <div className="flex items-center gap-4 p-3 rounded-xl bg-amber-50/50 border border-amber-200/80">
          {dp ? (
            <img
              src={dp}
              alt="Wedding DP"
              className="w-16 h-16 rounded-2xl object-cover border border-amber-300 shadow-xs shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7A1C24] to-[#C59B27] text-white flex items-center justify-center shrink-0">
              <Heart size={24} />
            </div>
          )}
          <div className="space-y-1">
            <div className="text-xs font-bold text-stone-800">Wedding Display Picture (DP)</div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs font-semibold text-stone-800 cursor-pointer hover:bg-stone-100">
                <Camera size={14} /> {dp ? 'Change DP' : 'Upload Wedding DP'}
                <input type="file" accept="image/*" onChange={handleDpUpload} className="hidden" />
              </label>
              {dp && (
                <button
                  type="button"
                  onClick={() => setDp('')}
                  className="text-[11px] text-red-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Wedding Status (Active shows in dropdowns)
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
            >
              {WEDDING_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
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
  const groups = WEDDING_STATUSES.map((st) => ({
    status: st,
    items: weddings.filter((w) => (w.status || 'Active') === st),
  })).filter((g) => g.items.length > 0 || g.status === 'Active');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Manage Wedding Plans</h2>
          <p className="text-xs text-stone-500">
            Grouped by status. Only &ldquo;Active&rdquo; weddings appear in the workspace dropdown.
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
        <div className="space-y-6">
          {groups.map((grp) => (
            <div key={grp.status} className="space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      grp.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : grp.status === 'Upcoming'
                        ? 'bg-sky-100 text-sky-900'
                        : grp.status === 'Completed'
                        ? 'bg-stone-200 text-stone-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {grp.status}
                  </span>
                  <span className="text-xs font-semibold text-stone-500">
                    ({grp.items.length})
                  </span>
                </div>
              </div>

              {grp.items.length === 0 ? (
                <p className="text-xs text-stone-400 italic">No {grp.status.toLowerCase()} weddings.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grp.items.map((w) => {
                    const isActiveWorkspace = w.id === activeWeddingId && grp.status === 'Active';
                    return (
                      <div
                        key={w.id}
                        className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between space-y-4 ${
                          isActiveWorkspace
                            ? 'border-[#7A1C24] ring-2 ring-[#7A1C24]/15'
                            : 'border-stone-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-start gap-3">
                            {w.dp ? (
                              <img
                                src={w.dp}
                                alt={w.title}
                                className="w-12 h-12 rounded-xl object-cover border border-amber-300 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#7A1C24] flex items-center justify-center shrink-0">
                                <Heart size={20} />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-bold text-base text-stone-900 truncate">
                                  {w.title}
                                </h3>
                                {isActiveWorkspace && (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-[#7A1C24] text-[10px] font-bold shrink-0">
                                    Selected
                                  </span>
                                )}
                              </div>
                              {w.coupleNames && (
                                <p className="text-xs text-stone-600 mt-0.5 font-medium truncate">
                                  {w.coupleNames}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mt-3 space-y-1 text-xs text-stone-500">
                            {w.date && (
                              <div className="flex items-center gap-1.5">
                                <Calendar size={13} /> {w.date}
                              </div>
                            )}
                            {(w.city || w.venue) && (
                              <div className="flex items-center gap-1.5">
                                <MapPin size={13} /> {w.city} {w.venue ? `• ${w.venue}` : ''}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                          {(w.status || 'Active') === 'Active' ? (
                            <button
                              onClick={() => onSelect(w.id)}
                              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold"
                            >
                              Open Workspace
                            </button>
                          ) : (
                            <span className="text-[11px] text-stone-400 font-medium">
                              Set Active to open
                            </span>
                          )}
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
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// PROFILE & PASSWORD MODAL
// ==========================================
function ProfileSettingsModal({ isOpen, onClose, user, resolvedGuestHouseInfo, onSave }) {
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [newPassword, setNewPassword] = useState('');
  const [guestHouseName, setGuestHouseName] = useState(user?.guestHouseName || '');
  const [city, setCity] = useState(user?.city || '');
  const [address, setAddress] = useState(user?.address || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [gstin, setGstin] = useState(user?.gstin || '');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
      setNewPassword('');
      setGuestHouseName(user.guestHouseName || '');
      setCity(user.city || '');
      setAddress(user.address || '');
      setPhone(user.phone || '');
      setGstin(user.gstin || '');
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
    if (user?.role === 'guest_house') {
      updates.guestHouseName = guestHouseName.trim();
      updates.city = city.trim();
      updates.address = address.trim();
      updates.phone = phone.trim();
      updates.gstin = gstin.trim();
    }
    onSave(updates);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Profile & Settings" maxWidth="max-w-md">
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

        {resolvedGuestHouseInfo?.name && user?.role !== 'guest_house' && (
          <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-center gap-2">
            <Building2 size={15} className="shrink-0" />
            <span>
              Affiliated Guest House: <strong>{resolvedGuestHouseInfo.name}</strong>
            </span>
          </div>
        )}

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

        {user?.role === 'guest_house' && (
          <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-200 space-y-3">
            <div className="text-xs font-bold text-sky-950">Guest House / Venue Details</div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Guest House / Banquet Name
              </label>
              <input
                type="text"
                value={guestHouseName}
                onChange={(e) => setGuestHouseName(e.target.value)}
                placeholder="Enter guest house name"
                className="w-full px-3 py-2 border border-stone-300 bg-white rounded-lg text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city"
                  className="w-full px-3 py-2 border border-stone-300 bg-white rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2 border border-stone-300 bg-white rounded-lg text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter full address"
                className="w-full px-3 py-2 border border-stone-300 bg-white rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">GSTIN</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                placeholder="Enter GSTIN"
                className="w-full px-3 py-2 border border-stone-300 bg-white rounded-lg text-sm"
              />
            </div>
          </div>
        )}

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
function EventsModule({ events, weddingId, defaultVenue = '', perms, setState, stampUser, recordAudit, showToast }) {
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
      venue: defaultVenue || '',
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
  const [subGroupFilter, setSubGroupFilter] = useState('ALL');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [cardFilter, setCardFilter] = useState('ALL');
  const [rsvpFilter, setRsvpFilter] = useState('ALL');
  const [stayFilter, setStayFilter] = useState('ALL');
  const [cardReqFilter, setCardReqFilter] = useState('ALL');
  const [moneyFilter, setMoneyFilter] = useState('ALL');
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
    subGroup: '',
    city: '',
    adults: '',
    kids: '',
    cardRequired: '',
    moneyRequired: '',
    moneyAmount: '',
    moneyGiven: '',
    accommodation: '',
    cardStatus: '',
    rsvpStatus: '',
  });

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    side: "Groom's Side",
    group: 'Relatives',
    subGroup: '',
    city: '',
    adults: 2,
    kids: 0,
    cardRequired: false,
    moneyRequired: false,
    moneyAmount: '',
    moneyGiven: false,
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
      subGroup: '',
      city: '',
      adults: 2,
      kids: 0,
      cardRequired: false,
      moneyRequired: false,
      moneyAmount: '',
      moneyGiven: false,
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
      subGroup: g.subGroup || '',
      city: g.city || '',
      adults: g.adults ?? 1,
      kids: g.kids ?? 0,
      cardRequired: Boolean(g.cardRequired),
      moneyRequired: Boolean(g.moneyRequired),
      moneyAmount: g.moneyAmount ?? '',
      moneyGiven: Boolean(g.moneyGiven),
      accommodation: g.accommodation || 'No',
      cardStatus: g.cardStatus || 'Not Sent',
      rsvpStatus: g.rsvpStatus || 'Pending',
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) return;
    const normalizedPayload = {
      ...form,
      subGroup: (form.subGroup || '').trim(),
      adults: Number(form.adults) || 0,
      kids: Number(form.kids) || 0,
      cardRequired: Boolean(form.cardRequired),
      moneyRequired: Boolean(form.moneyRequired),
      moneyAmount: form.moneyRequired ? Number(form.moneyAmount) || 0 : 0,
      moneyGiven: form.moneyRequired ? Boolean(form.moneyGiven) : false,
    };
    if (editing) {
      setState((prev) => ({
        ...prev,
        guests: prev.guests.map((g) =>
          g.id === editing.id
            ? {
                ...g,
                ...normalizedPayload,
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
        ...normalizedPayload,
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
      guests: prev.guests.map((g) => {
        if (g.id !== guestId) return g;
        const extra =
          field === 'moneyRequired' && !value
            ? { moneyAmount: 0, moneyGiven: false }
            : {};
        return { ...g, [field]: value, ...extra, ...stampUser(g) };
      }),
    }));
    if (target) {
      recordAudit('Guests', 'Updated', `Updated ${field} to "${value}" for ${target.fullName}`);
    }
  };

  const parseBoolCell = (val) => {
    const s = String(val ?? '').trim().toLowerCase();
    return ['yes', 'true', '1', 'y', 'checked'].includes(s);
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
        subGroup: findCol(['sub-group', 'subgroup', 'sub group']),
        city: findCol(['city', 'location', 'place']),
        adults: findCol(['adult', 'headcount', 'members', 'count']),
        kids: findCol(['kid', 'child']),
        cardRequired: findCol(['card required', 'need card', 'give card']),
        moneyRequired: findCol(['money applicable', 'need money', 'get money', 'money required']),
        moneyAmount: findCol(['amount', 'money amount', 'shagun']),
        moneyGiven: findCol(['money given', 'amount given', 'paid']),
        accommodation: findCol(['accommodation', 'stay', 'room', 'pickup']),
        cardStatus: findCol(['card status', 'card', 'invite']),
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

      const resolvedMoneyRequired =
        mapping.moneyRequired && row[mapping.moneyRequired] !== ''
          ? parseBoolCell(row[mapping.moneyRequired])
          : Boolean(matched?.moneyRequired);

      const nextData = {
        fullName: incomingName,
        phone: incomingPhone || matched?.phone || '',
        side: (mapping.side && row[mapping.side]?.trim()) || matched?.side || "Groom's Side",
        group: (mapping.group && row[mapping.group]?.trim()) || matched?.group || 'Relatives',
        subGroup: (mapping.subGroup && row[mapping.subGroup]?.trim()) || matched?.subGroup || '',
        city: incomingCity || matched?.city || '',
        adults:
          mapping.adults && row[mapping.adults] !== ''
            ? Number(row[mapping.adults]) || 0
            : matched?.adults ?? 2,
        kids:
          mapping.kids && row[mapping.kids] !== ''
            ? Number(row[mapping.kids]) || 0
            : matched?.kids ?? 0,
        cardRequired:
          mapping.cardRequired && row[mapping.cardRequired] !== ''
            ? parseBoolCell(row[mapping.cardRequired])
            : Boolean(matched?.cardRequired),
        moneyRequired: resolvedMoneyRequired,
        moneyAmount: resolvedMoneyRequired
          ? mapping.moneyAmount && row[mapping.moneyAmount] !== ''
            ? Number(row[mapping.moneyAmount]) || 0
            : Number(matched?.moneyAmount) || 0
          : 0,
        moneyGiven: resolvedMoneyRequired
          ? mapping.moneyGiven && row[mapping.moneyGiven] !== ''
            ? parseBoolCell(row[mapping.moneyGiven])
            : Boolean(matched?.moneyGiven)
          : false,
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
          (matched.subGroup || '') !== nextData.subGroup ||
          (matched.city || '') !== nextData.city ||
          Number(matched.adults) !== Number(nextData.adults) ||
          Number(matched.kids) !== Number(nextData.kids) ||
          Boolean(matched.cardRequired) !== nextData.cardRequired ||
          Boolean(matched.moneyRequired) !== nextData.moneyRequired ||
          (Number(matched.moneyAmount) || 0) !== nextData.moneyAmount ||
          Boolean(matched.moneyGiven) !== nextData.moneyGiven ||
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
      'Sub-Group',
      'City',
      'Adults',
      'Kids',
      'Card Required',
      'Money Applicable',
      'Amount',
      'Money Given',
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
        'Sub-Group': 'Maternal Side',
        City: 'Prayagraj',
        Adults: '2',
        Kids: '1',
        'Card Required': 'Yes',
        'Money Applicable': 'Yes',
        Amount: '1100',
        'Money Given': 'No',
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
      'Sub-Group',
      'City',
      'Adults',
      'Kids',
      'Total Headcount',
      'Card Required',
      'Money Applicable',
      'Amount',
      'Money Given',
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
      'Sub-Group': g.subGroup || '',
      City: g.city || '',
      Adults: g.adults,
      Kids: g.kids,
      'Total Headcount': (Number(g.adults) || 0) + (Number(g.kids) || 0),
      'Card Required': g.cardRequired ? 'Yes' : 'No',
      'Money Applicable': g.moneyRequired ? 'Yes' : 'No',
      Amount: g.moneyRequired ? Number(g.moneyAmount) || 0 : 0,
      'Money Given': g.moneyRequired && g.moneyGiven ? 'Yes' : 'No',
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

  // Dynamic Filter Options derived from standard + all custom user-added entries
  const dynamicSides = useMemo(() => {
    return Array.from(new Set([...GUEST_SIDES, ...guests.map((g) => g.side).filter(Boolean)]));
  }, [guests]);

  const dynamicGroups = useMemo(() => {
    return Array.from(new Set([...GUEST_GROUPS, ...guests.map((g) => g.group).filter(Boolean)]));
  }, [guests]);

  const dynamicSubGroups = useMemo(() => {
    return Array.from(new Set(guests.map((g) => (g.subGroup || '').trim()).filter(Boolean))).sort();
  }, [guests]);

  const uniqueCities = useMemo(() => {
    return Array.from(new Set(guests.map((g) => g.city).filter(Boolean))).sort();
  }, [guests]);

  const dynamicCardStatuses = useMemo(() => {
    return Array.from(
      new Set([...CARD_STATUSES, ...guests.map((g) => g.cardStatus).filter(Boolean)])
    );
  }, [guests]);

  const dynamicRsvpStatuses = useMemo(() => {
    return Array.from(
      new Set([...RSVP_STATUSES, ...guests.map((g) => g.rsvpStatus).filter(Boolean)])
    );
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
        if (subGroupFilter !== 'ALL' && (g.subGroup || '').trim() !== subGroupFilter) return false;
        if (cityFilter !== 'ALL' && (g.city || '') !== cityFilter) return false;
        if (cardFilter !== 'ALL' && g.cardStatus !== cardFilter) return false;
        if (rsvpFilter !== 'ALL' && g.rsvpStatus !== rsvpFilter) return false;
        if (stayFilter !== 'ALL' && g.accommodation !== stayFilter) return false;
        if (cardReqFilter === 'YES' && !g.cardRequired) return false;
        if (cardReqFilter === 'NO' && Boolean(g.cardRequired)) return false;
        if (moneyFilter === 'APPLICABLE' && !g.moneyRequired) return false;
        if (moneyFilter === 'NOT_APPLICABLE' && Boolean(g.moneyRequired)) return false;
        if (moneyFilter === 'PENDING' && (!g.moneyRequired || Boolean(g.moneyGiven))) return false;
        if (moneyFilter === 'GIVEN' && (!g.moneyRequired || !g.moneyGiven)) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            g.fullName.toLowerCase().includes(q) ||
            (g.phone || '').toLowerCase().includes(q) ||
            (g.city || '').toLowerCase().includes(q) ||
            (g.group || '').toLowerCase().includes(q) ||
            (g.subGroup || '').toLowerCase().includes(q)
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
        if (sort.key === 'moneyAmount') {
          const mA = a.moneyRequired ? Number(a.moneyAmount) || 0 : -1;
          const mB = b.moneyRequired ? Number(b.moneyAmount) || 0 : -1;
          return sort.dir === 'asc' ? mA - mB : mB - mA;
        }
        if (
          sort.key === 'cardRequired' ||
          sort.key === 'moneyRequired' ||
          sort.key === 'moneyGiven'
        ) {
          const bA = a[sort.key] ? 1 : 0;
          const bB = b[sort.key] ? 1 : 0;
          return sort.dir === 'asc' ? bA - bB : bB - bA;
        }
        const vA = String(a[sort.key] || '');
        const vB = String(b[sort.key] || '');
        return sort.dir === 'asc' ? vA.localeCompare(vB) : vB.localeCompare(vA);
      });
  }, [
    guests,
    sideFilter,
    groupFilter,
    subGroupFilter,
    cityFilter,
    cardFilter,
    rsvpFilter,
    stayFilter,
    cardReqFilter,
    moneyFilter,
    search,
    sort,
  ]);

  const totalHeadcount = guests.reduce(
    (sum, g) => sum + (Number(g.adults) || 0) + (Number(g.kids) || 0),
    0
  );
  const cardsNeededCount = guests.filter((g) => Boolean(g.cardRequired)).length;
  const totalMoneyPlanned = guests.reduce(
    (sum, g) => sum + (g.moneyRequired ? Number(g.moneyAmount) || 0 : 0),
    0
  );
  const totalMoneyGiven = guests.reduce(
    (sum, g) => sum + (g.moneyRequired && g.moneyGiven ? Number(g.moneyAmount) || 0 : 0),
    0
  );
  const confirmedCount = guests.filter((g) => g.rsvpStatus === 'Confirmed').length;

  const hasActiveFilter =
    search ||
    sideFilter !== 'ALL' ||
    groupFilter !== 'ALL' ||
    subGroupFilter !== 'ALL' ||
    cityFilter !== 'ALL' ||
    cardFilter !== 'ALL' ||
    rsvpFilter !== 'ALL' ||
    stayFilter !== 'ALL' ||
    cardReqFilter !== 'ALL' ||
    moneyFilter !== 'ALL';

  return (
    <div className="space-y-5">
      {/* Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Guest List & Card Distribution</h2>
          <p className="text-xs text-stone-500">
            Smart CSV import/update without duplicates, card checklist, money tracking & RSVPs.
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
          <div className="text-[11px] text-stone-500 font-semibold">Cards Required</div>
          <div className="text-lg font-bold text-blue-700 mt-0.5">{cardsNeededCount}</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-3">
          <div className="text-[11px] text-stone-500 font-semibold">Money Given / Total</div>
          <div className="text-sm font-bold text-amber-800 mt-1">
            {formatINR(totalMoneyGiven)}{' '}
            <span className="text-stone-400 font-normal">/ {formatINR(totalMoneyPlanned)}</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-3 col-span-2 sm:col-span-1">
          <div className="text-[11px] text-stone-500 font-semibold">RSVP Confirmed</div>
          <div className="text-lg font-bold text-emerald-700 mt-0.5">{confirmedCount}</div>
        </div>
      </div>

      {/* Multi-Filter Bar (All Groups + Sub-Groups Included Dynamically) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3.5 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guests by name, phone, city, group, or sub-group..."
              className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl text-xs"
            />
          </div>
          <select
            value={sideFilter}
            onChange={(e) => setSideFilter(e.target.value)}
            className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
          >
            <option value="ALL">All Sides</option>
            {dynamicSides.map((s) => (
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
            <option value="ALL">All Groups ({dynamicGroups.length})</option>
            {dynamicGroups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <select
            value={subGroupFilter}
            onChange={(e) => setSubGroupFilter(e.target.value)}
            className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
          >
            <option value="ALL">
              All Sub-Groups {dynamicSubGroups.length > 0 ? `(${dynamicSubGroups.length})` : ''}
            </option>
            {dynamicSubGroups.map((sg) => (
              <option key={sg} value={sg}>
                {sg}
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
            value={cardReqFilter}
            onChange={(e) => setCardReqFilter(e.target.value)}
            className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
          >
            <option value="ALL">Card Required: Any</option>
            <option value="YES">Card Required: Yes</option>
            <option value="NO">Card Required: No</option>
          </select>
          <select
            value={moneyFilter}
            onChange={(e) => setMoneyFilter(e.target.value)}
            className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
          >
            <option value="ALL">Money: Any</option>
            <option value="APPLICABLE">Money Applicable: Yes</option>
            <option value="NOT_APPLICABLE">Money Applicable: No</option>
            <option value="PENDING">Money Pending (Not Given)</option>
            <option value="GIVEN">Money Given</option>
          </select>
          <select
            value={cardFilter}
            onChange={(e) => setCardFilter(e.target.value)}
            className="px-2.5 py-2 border border-stone-300 rounded-xl text-xs bg-white"
          >
            <option value="ALL">All Card Status</option>
            {dynamicCardStatuses.map((c) => (
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
            {dynamicRsvpStatuses.map((r) => (
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
          {hasActiveFilter && (
            <button
              onClick={() => {
                setSearch('');
                setSideFilter('ALL');
                setGroupFilter('ALL');
                setSubGroupFilter('ALL');
                setCityFilter('ALL');
                setCardFilter('ALL');
                setRsvpFilter('ALL');
                setStayFilter('ALL');
                setCardReqFilter('ALL');
                setMoneyFilter('ALL');
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
                <SortableHeader label="Side, Group & Sub-Group" sortKey="side" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="City" sortKey="city" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="Headcount" sortKey="headcount" currentSort={sort} onSort={handleSort} align="center" />
                <SortableHeader label="Card Req." sortKey="cardRequired" currentSort={sort} onSort={handleSort} align="center" />
                <SortableHeader label="Money Req." sortKey="moneyRequired" currentSort={sort} onSort={handleSort} align="center" />
                <SortableHeader label="Amount (₹)" sortKey="moneyAmount" currentSort={sort} onSort={handleSort} align="right" />
                <SortableHeader label="Money Given" sortKey="moneyGiven" currentSort={sort} onSort={handleSort} align="center" />
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
                  <td colSpan={12} className="px-4 py-10 text-center text-stone-500">
                    No guests found. Add guests manually or import your CSV file.
                  </td>
                </tr>
              ) : (
                filtered.map((g) => {
                  const total = (Number(g.adults) || 0) + (Number(g.kids) || 0);
                  const isMoneyReq = Boolean(g.moneyRequired);
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
                        <div className="text-[11px] text-stone-500">
                          {g.group}
                          {g.subGroup ? ` • ${g.subGroup}` : ''}
                        </div>
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

                      {/* Card Required Checkbox */}
                      <td className="px-3 py-3 text-center">
                        <input
                          type="checkbox"
                          disabled={!perms.update}
                          checked={Boolean(g.cardRequired)}
                          onChange={(e) =>
                            quickUpdateField(g.id, 'cardRequired', e.target.checked)
                          }
                          title="Card Required"
                          className="w-4 h-4 rounded border-stone-300 text-[#7A1C24] cursor-pointer"
                        />
                      </td>

                      {/* Money Applicable Checkbox */}
                      <td className="px-3 py-3 text-center">
                        <input
                          type="checkbox"
                          disabled={!perms.update}
                          checked={isMoneyReq}
                          onChange={(e) =>
                            quickUpdateField(g.id, 'moneyRequired', e.target.checked)
                          }
                          title="Money Applicable"
                          className="w-4 h-4 rounded border-stone-300 text-[#7A1C24] cursor-pointer"
                        />
                      </td>

                      {/* Editable Amount (₹) when Money Applicable is checked */}
                      <td className="px-3 py-3 text-right">
                        {isMoneyReq ? (
                          <input
                            type="number"
                            min="0"
                            disabled={!perms.update}
                            value={g.moneyAmount ?? ''}
                            onChange={(e) =>
                              quickUpdateField(
                                g.id,
                                'moneyAmount',
                                e.target.value === '' ? '' : Number(e.target.value) || 0
                              )
                            }
                            placeholder="0"
                            className="w-24 px-2 py-1 border border-amber-300 bg-amber-50/40 rounded-lg text-xs text-right font-semibold text-stone-900 focus:ring-2 focus:ring-[#7A1C24]"
                          />
                        ) : (
                          <span className="text-stone-300 select-none">—</span>
                        )}
                      </td>

                      {/* Money Given Checkbox */}
                      <td className="px-3 py-3 text-center">
                        {isMoneyReq ? (
                          <input
                            type="checkbox"
                            disabled={!perms.update}
                            checked={Boolean(g.moneyGiven)}
                            onChange={(e) =>
                              quickUpdateField(g.id, 'moneyGiven', e.target.checked)
                            }
                            title="Money Given"
                            className="w-4 h-4 rounded border-stone-300 text-emerald-600 cursor-pointer"
                          />
                        ) : (
                          <span className="text-stone-300 select-none">—</span>
                        )}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <DropdownWithOther
              label="Side"
              value={form.side}
              onChange={(val) => setForm({ ...form, side: val })}
              options={dynamicSides}
              placeholder="Enter side"
            />
            <DropdownWithOther
              label="Group / Relation"
              value={form.group}
              onChange={(val) => setForm({ ...form, group: val })}
              options={dynamicGroups}
              placeholder="Enter group"
            />
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Sub-Group
              </label>
              <input
                type="text"
                list="guest-subgroup-suggestions"
                value={form.subGroup}
                onChange={(e) => setForm({ ...form, subGroup: e.target.value })}
                placeholder="Enter sub-group"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
              <datalist id="guest-subgroup-suggestions">
                {dynamicSubGroups.map((sg) => (
                  <option key={sg} value={sg} />
                ))}
              </datalist>
            </div>
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

          {/* Card Required & Money Tracking Controls */}
          <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-3">
            <div className="flex flex-wrap items-center gap-6">
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(form.cardRequired)}
                  onChange={(e) => setForm({ ...form, cardRequired: e.target.checked })}
                  className="w-4 h-4 rounded border-stone-300 text-[#7A1C24]"
                />
                <span>Card Required (Need to give card)</span>
              </label>

              <label className="inline-flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(form.moneyRequired)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      moneyRequired: e.target.checked,
                      moneyAmount: e.target.checked ? form.moneyAmount : '',
                      moneyGiven: e.target.checked ? form.moneyGiven : false,
                    })
                  }
                  className="w-4 h-4 rounded border-stone-300 text-[#7A1C24]"
                />
                <span>Money Applicable</span>
              </label>
            </div>

            {form.moneyRequired && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200/60">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Amount to Give (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.moneyAmount}
                    onChange={(e) => setForm({ ...form, moneyAmount: e.target.value })}
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-stone-300 bg-white rounded-lg text-sm"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(form.moneyGiven)}
                      onChange={(e) => setForm({ ...form, moneyGiven: e.target.checked })}
                      className="w-4 h-4 rounded border-stone-300 text-emerald-600"
                    />
                    <span>Money Given</span>
                  </label>
                </div>
              </div>
            )}
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
              { key: 'subGroup', label: 'Sub-Group' },
              { key: 'city', label: 'City' },
              { key: 'adults', label: 'Adults Count' },
              { key: 'kids', label: 'Kids Count' },
              { key: 'cardRequired', label: 'Card Required (Yes/No)' },
              { key: 'moneyRequired', label: 'Money Applicable (Yes/No)' },
              { key: 'moneyAmount', label: 'Amount (₹)' },
              { key: 'moneyGiven', label: 'Money Given (Yes/No)' },
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
    const lines = [
      `${item.title} — ${activeWedding.coupleNames || activeWedding.title}`,
      item.eventTag ? `Ceremony: ${item.eventTag}` : '',
      item.notes || '',
      item.linkUrl ? `Invitation Link: ${item.linkUrl}` : '',
    ].filter(Boolean);
    const shareText = lines.join('\n');

    if (navigator.share) {
      try {
        // If an image/media file is attached, convert dataUrl to File and share the actual content
        if (item.mediaDataUrl && item.mediaDataUrl.startsWith('data:')) {
          const res = await fetch(item.mediaDataUrl);
          const blob = await res.blob();
          const ext = (item.mediaMime || blob.type || 'image/jpeg').split('/')[1] || 'jpg';
          const safeTitle = (item.title || 'Invitation').replace(/[^a-zA-Z0-9_-]/g, '_');
          const file = new File([blob], `${safeTitle}.${ext}`, {
            type: item.mediaMime || blob.type || 'image/jpeg',
          });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: item.title,
              text: shareText,
              files: [file],
            });
            return;
          }
        }

        // Share link or rich text content without injecting the app website URL
        const sharePayload = {
          title: item.title,
          text: shareText,
        };
        if (item.linkUrl) {
          sharePayload.url = item.linkUrl;
        }
        await navigator.share(sharePayload);
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return;
      }
    }

    navigator.clipboard.writeText(shareText);
    showToast('Invitation content copied to clipboard!');
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
  resolvedGuestHouseInfo,
  recordAudit,
  showToast,
}) {
  const isSuperAdmin = currentUser.role === 'super_admin';
  const isGuestHouse = currentUser.role === 'guest_house';
  const isSubAdmin = currentUser.role === 'sub_admin';

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const defaultRoleForCreator = isSuperAdmin
    ? 'guest_house'
    : isGuestHouse
    ? 'sub_admin'
    : 'member';

  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    role: defaultRoleForCreator,
    guestHouseName: '',
    city: '',
    address: '',
    phone: '',
    gstin: '',
    avatar: '',
    active: true,
    assignedWeddingIds: [],
    assignedEventIds: [],
    permissions: defaultMemberPermissions(),
  });

  // Strict hierarchical visibility:
  // - Super Admin sees all users
  // - Guest House sees users created under its Guest House (Sub-Admins & Members)
  // - Sub-Admin sees Members assigned to their weddings (never Guest House accounts)
  const manageableUsers = useMemo(() => {
    const allUsers = Array.isArray(state.users) ? state.users : [];
    let scoped = [];
    if (isSuperAdmin) {
      scoped = allUsers;
    } else if (isGuestHouse) {
      scoped = allUsers.filter(
        (u) =>
          u.role !== 'super_admin' &&
          u.role !== 'guest_house' &&
          (u.guestHouseId === currentUser.id || u.createdByUserId === currentUser.id)
      );
    } else {
      const myWeddingIds = currentUser.assignedWeddingIds || [];
      scoped = allUsers.filter(
        (u) =>
          u.role === 'member' &&
          (u.assignedWeddingIds || []).some((id) => myWeddingIds.includes(id))
      );
    }
    if (!search.trim()) return scoped;
    const q = search.toLowerCase();
    return scoped.filter(
      (u) =>
        (u.name || '').toLowerCase().includes(q) ||
        (u.username || '').toLowerCase().includes(q) ||
        (u.guestHouseName || '').toLowerCase().includes(q)
    );
  }, [isSuperAdmin, isGuestHouse, state.users, currentUser, search]);

  // Group users by role
  const groupedUsers = useMemo(() => {
    const groups = [
      {
        key: 'super_admin',
        title: 'Super Admins',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
        users: manageableUsers.filter((u) => u.role === 'super_admin'),
      },
      {
        key: 'guest_house',
        title: 'Guest Houses & Venues',
        badgeClass: 'bg-sky-100 text-sky-900 border-sky-200',
        users: manageableUsers.filter((u) => u.role === 'guest_house'),
      },
      {
        key: 'sub_admin',
        title: 'Sub-Admins (Wedding / Function Coordinators)',
        badgeClass: 'bg-amber-100 text-[#7A1C24] border-amber-200',
        users: manageableUsers.filter((u) => u.role === 'sub_admin'),
      },
      {
        key: 'member',
        title: 'Members (Custom Module Access)',
        badgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
        users: manageableUsers.filter((u) => u.role === 'member'),
      },
    ];
    return groups.filter((g) => {
      if (isSuperAdmin) return true;
      if (isGuestHouse) return g.key === 'sub_admin' || g.key === 'member';
      return g.key === 'member';
    });
  }, [manageableUsers, isSuperAdmin, isGuestHouse]);

  const openAdd = () => {
    setEditingUser(null);
    setForm({
      name: '',
      username: '',
      password: '',
      role: defaultRoleForCreator,
      guestHouseName: isGuestHouse ? resolvedGuestHouseInfo.name : '',
      city: '',
      address: '',
      phone: '',
      gstin: '',
      avatar: '',
      active: true,
      assignedWeddingIds: accessibleWeddings[0] ? [accessibleWeddings[0].id] : [],
      assignedEventIds: [],
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
      guestHouseName: u.guestHouseName || '',
      city: u.city || '',
      address: u.address || '',
      phone: u.phone || '',
      gstin: u.gstin || '',
      avatar: u.avatar || '',
      active: u.active !== false,
      assignedWeddingIds: Array.isArray(u.assignedWeddingIds) ? u.assignedWeddingIds : [],
      assignedEventIds: Array.isArray(u.assignedEventIds) ? u.assignedEventIds : [],
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
      const nextWeddings = exists
        ? prev.assignedWeddingIds.filter((id) => id !== wId)
        : [...prev.assignedWeddingIds, wId];
      // Prune any assignedEventIds that belong to unselected weddings
      const validEventIds = (state.events || [])
        .filter((ev) => nextWeddings.includes(ev.weddingId))
        .map((ev) => ev.id);
      return {
        ...prev,
        assignedWeddingIds: nextWeddings,
        assignedEventIds: prev.assignedEventIds.filter((id) => validEventIds.includes(id)),
      };
    });
  };

  const toggleEventAssignment = (evId) => {
    setForm((prev) => {
      const exists = prev.assignedEventIds.includes(evId);
      return {
        ...prev,
        assignedEventIds: exists
          ? prev.assignedEventIds.filter((id) => id !== evId)
          : [...prev.assignedEventIds, evId],
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

    // Enforce role hierarchy rules
    let effectiveRole = form.role;
    if (!isSuperAdmin && effectiveRole === 'super_admin') effectiveRole = 'member';
    if (!isSuperAdmin && effectiveRole === 'guest_house') effectiveRole = 'sub_admin';
    if (isSubAdmin) effectiveRole = 'member';

    const effectivePerms =
      effectiveRole === 'super_admin' ||
      effectiveRole === 'guest_house' ||
      effectiveRole === 'sub_admin'
        ? fullPermissions()
        : form.permissions;

    // Inherit Guest House affiliation when created by a Guest House user or Sub-Admin under a Guest House
    const inheritedGuestHouseId =
      effectiveRole === 'guest_house'
        ? ''
        : editingUser?.guestHouseId || resolvedGuestHouseInfo.id || '';
    const inheritedGuestHouseName =
      effectiveRole === 'guest_house'
        ? (form.guestHouseName || form.name).trim()
        : editingUser?.guestHouseName || resolvedGuestHouseInfo.name || '';

    const userPayload = {
      ...form,
      username: form.username.trim(),
      role: effectiveRole,
      guestHouseId: inheritedGuestHouseId,
      guestHouseName: inheritedGuestHouseName,
      assignedWeddingIds:
        effectiveRole === 'super_admin' || effectiveRole === 'guest_house'
          ? []
          : form.assignedWeddingIds,
      assignedEventIds:
        effectiveRole === 'super_admin' || effectiveRole === 'guest_house'
          ? []
          : form.assignedEventIds,
      permissions: effectivePerms,
    };

    if (editingUser) {
      setState((prev) => ({
        ...prev,
        users: prev.users.map((u) =>
          u.id === editingUser.id ? { ...u, ...userPayload } : u
        ),
      }));
      recordAudit('Users', 'Updated', `Updated user "${form.name}" (${effectiveRole})`);
      showToast('User updated');
    } else {
      const created = {
        id: uid('usr'),
        ...userPayload,
        createdByUserId: currentUser.id,
      };
      setState((prev) => ({ ...prev, users: [...prev.users, created] }));
      recordAudit('Users', 'Created', `Created user "${form.name}" (${effectiveRole})`);
      showToast('User account created');
    }
    setModalOpen(false);
  };

  const handleDeleteUser = (u) => {
    if (u.id === 'user_super_admin' || u.id === currentUser.id) return;
    if (u.role === 'guest_house' && !isSuperAdmin) return;
    setState((prev) => ({ ...prev, users: prev.users.filter((x) => x.id !== u.id) }));
    recordAudit('Users', 'Deleted', `Deleted user "${u.name}"`);
    showToast('User removed');
    setDeleteTarget(null);
  };

  // Events available for function-level scoping based on selected weddings in form
  const assignableEvents = useMemo(() => {
    return (state.events || []).filter((ev) =>
      form.assignedWeddingIds.includes(ev.weddingId)
    );
  }, [state.events, form.assignedWeddingIds]);

  const roleModulesForMatrix = MODULES.filter((m) => m.key !== 'bill_templates');

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Users, Roles & Module Permissions</h2>
          <p className="text-xs text-stone-500">
            {isSuperAdmin
              ? 'Manage Super Admins, Guest Houses, Sub-Admins & Members grouped by role.'
              : isGuestHouse
              ? `Manage Sub-Admins & Members for ${resolvedGuestHouseInfo.name || 'your Guest House'} and assign wedding/function access.`
              : 'Manage Member accounts and module permissions for your assigned weddings/functions.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users or guest house..."
              className="pl-8 pr-3 py-2 border border-stone-300 rounded-xl text-xs bg-white"
            />
          </div>
          <button
            onClick={openAdd}
            className="px-4 py-2.5 rounded-xl bg-[#7A1C24] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:bg-[#5E141B]"
          >
            <Plus size={16} /> Add User Account
          </button>
        </div>
      </div>

      {/* Role-Grouped User Sections */}
      <div className="space-y-5">
        {groupedUsers.map((grp) => (
          <div
            key={grp.key}
            className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden"
          >
            <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${grp.badgeClass}`}
                >
                  {grp.title}
                </span>
                <span className="text-xs font-semibold text-stone-500">
                  {grp.users.length} {grp.users.length === 1 ? 'User' : 'Users'}
                </span>
              </div>
            </div>

            {grp.users.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-stone-400">
                No users in this role group yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-stone-50/60 border-b border-stone-200 text-[11px] font-semibold uppercase text-stone-500">
                    <tr>
                      <th className="px-4 py-2.5">User</th>
                      <th className="px-4 py-2.5">Guest House / Venue</th>
                      <th className="px-4 py-2.5">Assigned Weddings & Functions</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs">
                    {grp.users.map((u) => {
                      const assignedWedNames =
                        u.role === 'super_admin'
                          ? ['All Weddings']
                          : u.role === 'guest_house'
                          ? ['Own Created Weddings']
                          : (u.assignedWeddingIds || [])
                              .map((id) => state.weddings.find((w) => w.id === id)?.title)
                              .filter(Boolean);

                      const assignedFnNames = (u.assignedEventIds || [])
                        .map((id) => state.events.find((ev) => ev.id === id)?.name)
                        .filter(Boolean);

                      const canDeleteThisUser =
                        u.id !== 'user_super_admin' &&
                        u.id !== currentUser.id &&
                        (isSuperAdmin || u.role !== 'guest_house');

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
                            {u.guestHouseName ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-sky-900 text-[11px] font-semibold">
                                <Building2 size={11} /> {u.guestHouseName}
                              </span>
                            ) : (
                              <span className="text-stone-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-stone-600">
                            <div>
                              {assignedWedNames.length > 0
                                ? assignedWedNames.join(', ')
                                : 'None assigned'}
                            </div>
                            {assignedFnNames.length > 0 && (
                              <div className="text-[10px] text-amber-800 font-semibold mt-0.5">
                                Functions: {assignedFnNames.join(', ')}
                              </div>
                            )}
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
                              {canDeleteThisUser && (
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
            )}
          </div>
        ))}
      </div>

      {/* Add / Edit User Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? `Edit User: ${editingUser.name}` : 'Create New User Account'}
        subtitle="Configure role, Guest House affiliation, wedding/function scope & permissions"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {/* Avatar + Guest House Affiliation Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center gap-4">
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

            {resolvedGuestHouseInfo?.name && form.role !== 'guest_house' && (
              <div className="px-3 py-2 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900">
                <div className="text-[10px] font-bold uppercase text-sky-700">
                  Affiliated Guest House
                </div>
                <div className="font-bold flex items-center gap-1.5 mt-0.5">
                  <Building2 size={13} /> {resolvedGuestHouseInfo.name}
                </div>
              </div>
            )}
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
                  {(isSuperAdmin || isGuestHouse) && (
                    <option value="sub_admin">
                      Sub-Admin (Full Access to Assigned Weddings & Functions)
                    </option>
                  )}
                  {isSuperAdmin && (
                    <option value="guest_house">
                      Guest House (Manage Own Venue Bookings, Bill Templates & Sub-Admins)
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
                disabled={
                  editingUser?.id === 'user_super_admin' || editingUser?.id === currentUser.id
                }
                value={form.active ? 'active' : 'disabled'}
                onChange={(e) => setForm({ ...form, active: e.target.value === 'active' })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
              >
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>

          {/* Guest House Profile Fields (When Creating / Editing a Guest House Account) */}
          {form.role === 'guest_house' && (
            <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 space-y-3">
              <div className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                <Building2 size={14} /> Guest House / Banquet Venue Details
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Guest House Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.guestHouseName}
                    onChange={(e) => setForm({ ...form, guestHouseName: e.target.value })}
                    placeholder="Enter guest house name"
                    className="w-full px-3 py-2 border border-stone-300 bg-white rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Enter city"
                    className="w-full px-3 py-2 border border-stone-300 bg-white rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Enter phone number"
                    className="w-full px-3 py-2 border border-stone-300 bg-white rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={form.gstin}
                    onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                    placeholder="Enter GSTIN"
                    className="w-full px-3 py-2 border border-stone-300 bg-white rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Enter address"
                    className="w-full px-3 py-2 border border-stone-300 bg-white rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Wedding & Function Workspace Assignment (For Sub-Admin and Member Roles) */}
          {(form.role === 'sub_admin' || form.role === 'member') && (
            <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
              <div>
                <div className="text-xs font-bold text-stone-800 mb-1.5">
                  Assigned Wedding Workspaces
                </div>
                {accessibleWeddings.length === 0 ? (
                  <p className="text-xs text-stone-500">
                    No wedding plans created yet. Create a wedding plan first to assign it.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    {activeDropdownWeddings.map((w) => (
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

              {/* Function / Event Scoping */}
              {assignableEvents.length > 0 && (
                <div className="pt-2.5 border-t border-amber-200/70">
                  <div className="text-xs font-bold text-stone-800">
                    Assigned Functions / Ceremonies{' '}
                    <span className="font-normal text-stone-500">
                      (Leave unchecked to allow all functions in assigned weddings)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {assignableEvents.map((ev) => {
                      const wedTitle =
                        state.weddings.find((w) => w.id === ev.weddingId)?.title || '';
                      return (
                        <label
                          key={ev.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-stone-300 text-xs cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={form.assignedEventIds.includes(ev.id)}
                            onChange={() => toggleEventAssignment(ev.id)}
                            className="rounded text-[#7A1C24]"
                          />
                          <span className="font-semibold text-stone-800">{ev.name}</span>
                          {wedTitle && (
                            <span className="text-[10px] text-stone-400">({wedTitle})</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
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
                    {roleModulesForMatrix.map((m) => {
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
// MODULE: VENDOR, HALL/ROOM BOOKINGS, BEO & BILL RECEIPTS
// ==========================================
function BookingsModule({
  bookings,
  allScopeBookings = [],
  spaces = [],
  billTemplates = [],
  weddingEvents = [],
  weddingMenu = [],
  ghWeddingViewOptIn = false,
  onToggleWeddingView = null,
  activeWedding,
  weddingId,
  currentUser,
  resolvedGuestHouseInfo,
  defaultVenue = '',
  perms,
  setState,
  stampUser,
  recordAudit,
  showToast,
}) {
  const isGuestHouse = currentUser?.role === 'guest_house';
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const showGuestHouseTools = isGuestHouse || isSuperAdmin || spaces.length > 0;

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar' | 'spaces'
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

  // Bill Receipt & BEO Modals
  const [receiptBooking, setReceiptBooking] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [beoBooking, setBeoBooking] = useState(null);

  // Hall / Room Inventory Modal State
  const [spaceModalOpen, setSpaceModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState(null);
  const [spaceForm, setSpaceForm] = useState({
    name: '',
    type: 'Banquet Hall',
    capacity: 250,
    totalUnits: 1,
    rate: '',
    notes: '',
  });

  // Calendar Date Filter
  const [calendarDate, setCalendarDate] = useState(
    () => activeWedding?.date || new Date().toISOString().slice(0, 10)
  );

  const emptyForm = () => ({
    title: '',
    category: 'Venue & Banquet Hall',
    categories: ['Venue & Banquet Hall'],
    customCategories: [],
    vendorName: '',
    phone: '',
    altPhone: '',
    location: defaultVenue || activeWedding?.venue || '',
    spaceId: '',
    spaceName: defaultVenue || '',
    slot: 'Full Day (24 Hrs)',
    expectedPax: '',
    followUpDate: '',
    eventTag: 'All Events',
    bookingDate: new Date().toISOString().slice(0, 10),
    serviceDate: activeWedding?.date || '',
    checkOutDate: '',
    status: 'Confirmed',
    lineItems: [],
    discountType: 'flat',
    discountValue: 0,
    gstEnabled: false,
    cgstRate: 9,
    sgstRate: 9,
    totalAmount: '',
    advancePaid: '',
    paymentMode: 'UPI',
    installments: [],
    notes: '',
    bills: [],
  });

  const [form, setForm] = useState(emptyForm);
  const [newCustomCategory, setNewCustomCategory] = useState('');
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemRate, setNewItemRate] = useState('');
  const [selectedEventToAdd, setSelectedEventToAdd] = useState('');
  const [selectedMenuToAdd, setSelectedMenuToAdd] = useState('');
  const [newInstallmentAmt, setNewInstallmentAmt] = useState('');
  const [newInstallmentMode, setNewInstallmentMode] = useState('UPI');
  const [newInstallmentRef, setNewInstallmentRef] = useState('');

  const defaultTpl = useMemo(() => {
    const list = billTemplates.length > 0 ? billTemplates : DEFAULT_BILL_TEMPLATES;
    return list.find((t) => t.isDefault) || list[0];
  }, [billTemplates]);

  useEffect(() => {
    if (defaultTpl && !selectedTemplateId) {
      setSelectedTemplateId(defaultTpl.id);
    }
  }, [defaultTpl, selectedTemplateId]);

  const openAdd = (presetDate = '') => {
    setEditing(null);
    const base = emptyForm();
    if (presetDate) base.serviceDate = presetDate;
    setForm(base);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title || '',
      category:
        item.category ||
        (Array.isArray(item.categories) && item.categories[0]) ||
        'Venue & Banquet Hall',
      categories: Array.isArray(item.categories)
        ? item.categories
        : item.category
        ? [item.category]
        : ['Venue & Banquet Hall'],
      customCategories: Array.isArray(item.customCategories) ? item.customCategories : [],
      vendorName: item.vendorName || '',
      phone: item.phone || '',
      altPhone: item.altPhone || '',
      location: item.location || defaultVenue || '',
      spaceId: item.spaceId || '',
      spaceName: item.spaceName || item.location || '',
      slot: item.slot || 'Full Day (24 Hrs)',
      expectedPax: item.expectedPax ?? '',
      followUpDate: item.followUpDate || '',
      eventTag: item.eventTag || 'All Events',
      bookingDate: item.bookingDate || '',
      serviceDate: item.serviceDate || '',
      checkOutDate: item.checkOutDate || '',
      status: item.status || 'Confirmed',
      lineItems: Array.isArray(item.lineItems) ? item.lineItems : [],
      discountType: item.discountType || 'flat',
      discountValue: item.discountValue ?? 0,
      gstEnabled: Boolean(item.gstEnabled),
      cgstRate: item.cgstRate ?? 9,
      sgstRate: item.sgstRate ?? 9,
      totalAmount: item.totalAmount ?? '',
      advancePaid: item.advancePaid ?? '',
      paymentMode: item.paymentMode || 'UPI',
      installments: Array.isArray(item.installments) ? item.installments : [],
      notes: item.notes || '',
      bills: Array.isArray(item.bills) ? item.bills : [],
    });
    setModalOpen(true);
  };

  const computeBillTotalFromState = (nextState) => {
    const items = Array.isArray(nextState.lineItems) ? nextState.lineItems : [];
    const subtotal = items.reduce((s, x) => s + (Number(x.amount) || 0), 0);
    if (items.length === 0) return nextState.totalAmount;
    const discVal = Math.max(0, Number(nextState.discountValue) || 0);
    const discAmt =
      nextState.discountType === 'percent'
        ? Math.round((subtotal * Math.min(100, discVal)) / 100)
        : Math.min(subtotal, Math.round(discVal));
    const taxable = Math.max(0, subtotal - discAmt);
    const taxPct = nextState.gstEnabled
      ? (Number(nextState.cgstRate) || 0) + (Number(nextState.sgstRate) || 0)
      : 0;
    return Math.round(taxable * (1 + taxPct / 100));
  };

  // Add itemized charge & auto-recalculate totalAmount when line items exist
  const addLineItem = () => {
    if (!newItemLabel.trim()) return;
    const qty = Math.max(1, Number(newItemQty) || 1);
    const rate = Math.max(0, Number(newItemRate) || 0);
    const nextItems = [
      ...(form.lineItems || []),
      { id: uid('li'), label: newItemLabel.trim(), qty, rate, amount: qty * rate },
    ];
    setForm((prev) => {
      const updated = { ...prev, lineItems: nextItems };
      return { ...updated, totalAmount: computeBillTotalFromState(updated) };
    });
    setNewItemLabel('');
    setNewItemQty(1);
    setNewItemRate('');
  };

  const addEventToBill = () => {
    const ev = (weddingEvents || []).find((e) => e.id === selectedEventToAdd);
    if (!ev) return;
    const rate = Math.max(0, Number(newItemRate) || 0);
    const qty = Math.max(1, Number(newItemQty) || 1);
    const label = `Event: ${ev.name}${ev.date ? ` (${ev.date})` : ''}`;
    const nextItems = [
      ...(form.lineItems || []),
      { id: uid('li'), sourceType: 'event', label, qty, rate, amount: qty * rate },
    ];
    setForm((prev) => {
      const updated = { ...prev, lineItems: nextItems };
      return { ...updated, totalAmount: computeBillTotalFromState(updated) };
    });
    setSelectedEventToAdd('');
    setNewItemRate('');
  };

  const addMenuDishToBill = () => {
    const dish = (weddingMenu || []).find((m) => m.id === selectedMenuToAdd);
    if (!dish) return;
    const qty = Math.max(1, Number(newItemQty) || Number(form.expectedPax) || 1);
    const rate = Math.max(0, Number(newItemRate) || 0);
    const label = `Menu: ${dish.dishName}${dish.course ? ` [${dish.course}]` : ''}${
      dish.event ? ` - ${dish.event}` : ''
    }`;
    const nextItems = [
      ...(form.lineItems || []),
      { id: uid('li'), sourceType: 'menu', label, qty, rate, amount: qty * rate },
    ];
    setForm((prev) => {
      const updated = { ...prev, lineItems: nextItems };
      return { ...updated, totalAmount: computeBillTotalFromState(updated) };
    });
    setSelectedMenuToAdd('');
    setNewItemRate('');
  };

  const addAllEventsAndMenuToBill = () => {
    const evItems = (weddingEvents || []).map((ev) => ({
      id: uid('li'),
      sourceType: 'event',
      label: `Event: ${ev.name}${ev.date ? ` (${ev.date})` : ''}`,
      qty: 1,
      rate: 0,
      amount: 0,
    }));
    const menuItems = (weddingMenu || []).map((dish) => ({
      id: uid('li'),
      sourceType: 'menu',
      label: `Menu: ${dish.dishName}${dish.event ? ` (${dish.event})` : ''}`,
      qty: Math.max(1, Number(form.expectedPax) || 1),
      rate: 0,
      amount: 0,
    }));
    const combined = [...(form.lineItems || []), ...evItems, ...menuItems];
    if (combined.length === (form.lineItems || []).length) return;
    setForm((prev) => {
      const updated = { ...prev, lineItems: combined };
      return { ...updated, totalAmount: computeBillTotalFromState(updated) };
    });
    showToast(`Added ${evItems.length} event(s) & ${menuItems.length} menu item(s) to bill`);
  };

  const updateLineItemRow = (liId, field, rawVal) => {
    const nextItems = (form.lineItems || []).map((li) => {
      if (li.id !== liId) return li;
      const qty = field === 'qty' ? Math.max(1, Number(rawVal) || 1) : Number(li.qty) || 1;
      const rate = field === 'rate' ? Math.max(0, Number(rawVal) || 0) : Number(li.rate) || 0;
      return { ...li, qty, rate, amount: qty * rate };
    });
    setForm((prev) => {
      const updated = { ...prev, lineItems: nextItems };
      return { ...updated, totalAmount: computeBillTotalFromState(updated) };
    });
  };

  const removeLineItem = (liId) => {
    const nextItems = (form.lineItems || []).filter((x) => x.id !== liId);
    setForm((prev) => {
      const updated = { ...prev, lineItems: nextItems };
      return {
        ...updated,
        totalAmount: nextItems.length > 0 ? computeBillTotalFromState(updated) : prev.totalAmount,
      };
    });
  };

  // Add payment installment & auto-update advancePaid
  const addInstallment = () => {
    const amt = Number(newInstallmentAmt) || 0;
    if (amt <= 0) return;
    const nextInst = [
      ...(form.installments || []),
      {
        id: uid('inst'),
        date: new Date().toISOString().slice(0, 10),
        amount: amt,
        mode: newInstallmentMode,
        ref: newInstallmentRef.trim(),
      },
    ];
    const paidSum = nextInst.reduce((s, x) => s + (Number(x.amount) || 0), 0);
    setForm((prev) => ({
      ...prev,
      installments: nextInst,
      advancePaid: paidSum,
      paymentMode: newInstallmentMode,
    }));
    setNewInstallmentAmt('');
    setNewInstallmentRef('');
  };

  const removeInstallment = (instId) => {
    const nextInst = (form.installments || []).filter((x) => x.id !== instId);
    const paidSum = nextInst.reduce((s, x) => s + (Number(x.amount) || 0), 0);
    setForm((prev) => ({ ...prev, installments: nextInst, advancePaid: paidSum }));
  };

  // Conflict detection for double-booking on same date, hall/space & slot
  const bookingConflicts = useMemo(() => {
    if (!form.serviceDate || form.status === 'Cancelled') return [];
    const targetSpace = (form.spaceName || form.location || '').trim().toLowerCase();
    return allScopeBookings.filter((b) => {
      if (editing && b.id === editing.id) return false;
      if (b.status === 'Cancelled') return false;
      if (!b.serviceDate || b.serviceDate !== form.serviceDate) return false;
      const otherSpace = (b.spaceName || b.location || '').trim().toLowerCase();
      if (!targetSpace || !otherSpace || targetSpace !== otherSpace) return false;
      const sameSlot =
        b.slot === form.slot ||
        b.slot === 'Full Day (24 Hrs)' ||
        form.slot === 'Full Day (24 Hrs)';
      return sameSlot;
    });
  }, [allScopeBookings, editing, form.serviceDate, form.spaceName, form.location, form.slot, form.status]);

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
    const mergedCats = Array.from(
      new Set([...(form.categories || []), ...(form.customCategories || [])].filter(Boolean))
    );
    const payload = {
      ...form,
      categories: mergedCats,
      customCategories: form.customCategories || [],
      category: mergedCats[0] || form.category || 'Miscellaneous',
      discountType: form.discountType || 'flat',
      discountValue: Number(form.discountValue) || 0,
      expectedPax: Number(form.expectedPax) || 0,
      totalAmount: Number(form.totalAmount) || 0,
      advancePaid: Number(form.advancePaid) || 0,
      cgstRate: Number(form.cgstRate) || 0,
      sgstRate: Number(form.sgstRate) || 0,
      ownerUserId: editing?.ownerUserId || currentUser.id,
      guestHouseId: editing?.guestHouseId || resolvedGuestHouseInfo.id || '',
      guestHouseName: editing?.guestHouseName || resolvedGuestHouseInfo.name || '',
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
        receiptNo: `RCP-${String(Date.now()).slice(-6)}`,
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

  // Hall / Room Space CRUD
  const openSpaceAdd = () => {
    setEditingSpace(null);
    setSpaceForm({
      name: '',
      type: 'Banquet Hall',
      capacity: 250,
      totalUnits: 1,
      rate: '',
      notes: '',
    });
    setSpaceModalOpen(true);
  };

  const openSpaceEdit = (sp) => {
    setEditingSpace(sp);
    setSpaceForm({
      name: sp.name || '',
      type: sp.type || 'Banquet Hall',
      capacity: sp.capacity ?? 100,
      totalUnits: sp.totalUnits ?? 1,
      rate: sp.rate ?? '',
      notes: sp.notes || '',
    });
    setSpaceModalOpen(true);
  };

  const handleSaveSpace = (e) => {
    e.preventDefault();
    if (!spaceForm.name.trim()) return;
    const ownerId = isGuestHouse ? currentUser.id : resolvedGuestHouseInfo.id || currentUser.id;
    if (editingSpace) {
      setState((prev) => ({
        ...prev,
        spaces: (prev.spaces || []).map((s) =>
          s.id === editingSpace.id ? { ...s, ...spaceForm, rate: Number(spaceForm.rate) || 0 } : s
        ),
      }));
      showToast('Space updated');
    } else {
      setState((prev) => ({
        ...prev,
        spaces: [
          ...(prev.spaces || []),
          {
            id: uid('spc'),
            ownerUserId: ownerId,
            guestHouseName: resolvedGuestHouseInfo.name || '',
            ...spaceForm,
            rate: Number(spaceForm.rate) || 0,
          },
        ],
      }));
      showToast('Hall / Room added');
    }
    setSpaceModalOpen(false);
  };

  const handleDeleteSpace = (spId) => {
    setState((prev) => ({
      ...prev,
      spaces: (prev.spaces || []).filter((s) => s.id !== spId),
    }));
    showToast('Space removed');
  };

  const activeReceiptTemplate = useMemo(() => {
    const list = billTemplates.length > 0 ? billTemplates : DEFAULT_BILL_TEMPLATES;
    return list.find((t) => t.id === selectedTemplateId) || defaultTpl;
  }, [billTemplates, selectedTemplateId, defaultTpl]);

  // Pure client-side PDF generator for Booking Details + Bill Receipt + Attached Receipt/Bill Photos
  const buildBookingReceiptPDF = async (item, tpl = activeReceiptTemplate) => {
    const escPdf = (str) =>
      String(str ?? '')
        .replace(/[^\x20-\x7E]/g, 'Rs.')
        .replace(/\\/g, '\\')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)');

    const lines = [];
    const wrapText = (text, maxChars = 76) => {
      const words = String(text || '').split(/\s+/);
      let curr = '';
      const out = [];
      for (const w of words) {
        if (!w) continue;
        if ((curr + ' ' + w).trim().length > maxChars) {
          if (curr) out.push(curr);
          curr = w;
        } else {
          curr = curr ? `${curr} ${w}` : w;
        }
      }
      if (curr) out.push(curr);
      return out.length ? out : [''];
    };

    const ghName =
      tpl?.businessName ||
      item.guestHouseName ||
      resolvedGuestHouseInfo?.name ||
      activeWedding?.venue ||
      'AT Wedding Planner';
    const rcpCode = item.receiptNo || item.id.slice(-8).toUpperCase();
    const total = Number(item.totalAmount) || 0;
    const paid = Number(item.advancePaid) || 0;
    const due = Math.max(0, total - paid);

    lines.push({ text: `${ghName} - BOOKING & BILL RECEIPT`, bold: true, size: 14 });
    if (tpl?.tagline) lines.push({ text: tpl.tagline, bold: false, size: 9 });
    lines.push({
      text: `Receipt No: ${rcpCode} | Date: ${item.bookingDate || new Date().toISOString().slice(0, 10)} | Status: ${item.status || 'Confirmed'}`,
      bold: false,
      size: 9,
    });
    if (tpl?.gstin || resolvedGuestHouseInfo?.gstin) {
      lines.push({
        text: `GSTIN: ${tpl?.gstin || resolvedGuestHouseInfo?.gstin}${tpl?.sacCode ? ` | SAC: ${tpl.sacCode}` : ''}`,
        bold: false,
        size: 9,
      });
    }
    if (tpl?.address || resolvedGuestHouseInfo?.address) {
      wrapText(`Address: ${tpl?.address || resolvedGuestHouseInfo?.address}`).forEach((ln) =>
        lines.push({ text: ln, bold: false, size: 9 })
      );
    }
    lines.push({ text: '-------------------------------------------------------------------------', bold: false, size: 9 });
    lines.push({ text: 'BOOKING DETAILS', bold: true, size: 11 });
    lines.push({ text: `Booking / Event: ${item.title} (${activeWedding?.title || 'Workspace'})`, bold: false, size: 10 });
    lines.push({
      text: `Client / Vendor: ${item.vendorName || '-'} | Phone: ${item.phone || '-'}${item.altPhone ? ` | Alt: ${item.altPhone}` : ''}`,
      bold: false,
      size: 9,
    });
    lines.push({
      text: `Hall / Venue: ${item.spaceName || item.location || ghName} | Date: ${item.serviceDate || 'TBD'} | Slot: ${item.slot || 'Full Day'}`,
      bold: false,
      size: 9,
    });
    if (item.expectedPax > 0 || item.followUpDate) {
      lines.push({
        text: `Expected Pax: ${item.expectedPax || 0}${item.followUpDate ? ` | Follow-Up: ${item.followUpDate}` : ''}`,
        bold: false,
        size: 9,
      });
    }
    lines.push({ text: '-------------------------------------------------------------------------', bold: false, size: 9 });
    lines.push({ text: 'CHARGES & RECEIPT SUMMARY', bold: true, size: 11 });

    if (Array.isArray(item.lineItems) && item.lineItems.length > 0) {
      item.lineItems.forEach((li) => {
        lines.push({
          text: `* ${li.label} - ${li.qty} x Rs.${Number(li.rate) || 0} = Rs.${Number(li.amount) || 0}`,
          bold: false,
          size: 9,
        });
      });
    } else {
      lines.push({ text: `* ${item.title} - Total: Rs.${total}`, bold: false, size: 9 });
    }

    lines.push({
      text: `Total Amount: Rs.${total}   |   Advance Paid (${item.paymentMode || 'UPI'}): Rs.${paid}   |   Balance Due: Rs.${due}`,
      bold: true,
      size: 10,
    });

    if (Array.isArray(item.installments) && item.installments.length > 0) {
      lines.push({ text: 'Installments:', bold: true, size: 9 });
      item.installments.forEach((inst) => {
        lines.push({
          text: `  - ${inst.date}: Rs.${Number(inst.amount) || 0} (${inst.mode}${inst.ref ? `, Ref: ${inst.ref}` : ''})`,
          bold: false,
          size: 9,
        });
      });
    }

    if (item.notes) {
      wrapText(`Notes: ${item.notes}`).forEach((ln) =>
        lines.push({ text: ln, bold: false, size: 9 })
      );
    }
    if (tpl?.upiId || tpl?.bankDetails) {
      if (tpl.upiId) lines.push({ text: `UPI ID: ${tpl.upiId}`, bold: false, size: 9 });
      if (tpl.bankDetails) {
        wrapText(`Bank: ${tpl.bankDetails}`).forEach((ln) =>
          lines.push({ text: ln, bold: false, size: 9 })
        );
      }
    }
    if (tpl?.terms) {
      lines.push({ text: 'Terms & Conditions:', bold: true, size: 9 });
      String(tpl.terms)
        .split('\n')
        .forEach((tLine) => {
          wrapText(tLine).forEach((ln) => lines.push({ text: ln, bold: false, size: 8 }));
        });
    }
    const attachedPhotos = Array.isArray(item.bills) ? item.bills : [];
    if (attachedPhotos.length > 0) {
      lines.push({
        text: `Attached Bill/Receipt Photos: ${attachedPhotos.length} image(s) included in receipt`,
        bold: false,
        size: 9,
      });
    }

    // Build valid single-page/multi-line PDF binary stream
    const objects = [];
    const addObj = (body) => {
      objects.push(body);
      return objects.length;
    };

    const fontRegId = addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
    const fontBoldId = addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');

    const streamOps = ['BT'];
    let y = 795;
    for (const ln of lines) {
      if (y < 55) break;
      const fRef = ln.bold ? `/F2 ${ln.size} Tf` : `/F1 ${ln.size} Tf`;
      streamOps.push(fRef);
      streamOps.push(`1 0 0 1 42 ${y} Tm`);
      streamOps.push(`(${escPdf(ln.text)}) Tj`);
      y -= ln.size + 6;
    }
    streamOps.push('ET');
    const contentStr = streamOps.join('\n');
    const contentId = addObj(
      `<< /Length ${contentStr.length} >>
stream
${contentStr}
endstream`
    );
    const pageId = addObj(
      `<< /Type /Page /Parent 4 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontRegId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentId} 0 R >>`
    );
    const pagesId = addObj(`<< /Type /Pages /Kids [${pageId} 0 R] /Count 1 >>`);
    const catalogId = addObj(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

    // Ensure /Pages is object 4 by reordering cleanly
    let pdf = '%PDF-1.4\n';
    const ordered = [
      objects[0],
      objects[1],
      objects[2],
      pagesId ? objects[pagesId - 1] : '',
      objects[pageId - 1],
      objects[catalogId - 1],
    ];
    // Rebuild cleanly with exact object numbers 1..6
    const objs1to6 = [
      `1 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
`,
      `2 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
`,
      `3 0 obj
<< /Length ${contentStr.length} >>
stream
${contentStr}
endstream
endobj
`,
      `4 0 obj
<< /Type /Pages /Kids [5 0 R] /Count 1 >>
endobj
`,
      `5 0 obj
<< /Type /Page /Parent 4 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 1 0 R /F2 2 0 R >> >> /Contents 3 0 R >>
endobj
`,
      `6 0 obj
<< /Type /Catalog /Pages 4 0 R >>
endobj
`,
    ];

    const offsets = [0];
    for (const chunk of objs1to6) {
      offsets.push(pdf.length);
      pdf += chunk;
    }
    const xrefPos = pdf.length;
    pdf += `xref
0 7
0000000000 65535 f 
`;
    for (let i = 1; i <= 6; i++) {
      pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n 
`;
    }
    pdf += `trailer
<< /Size 7 /Root 6 0 R >>
startxref
${xrefPos}
%%EOF`;

    const safeName = `${(item.title || 'Booking_Receipt').replace(/[^a-zA-Z0-9_-]/g, '_')}_${rcpCode}.pdf`;
    const blob = new Blob([pdf], { type: 'application/pdf' });
    const file = new File([blob], safeName, { type: 'application/pdf' });
    return { blob, file, fileName: safeName };
  };

  const formatExactBillText = (item, tpl = activeReceiptTemplate) => {
    const total = Number(item.totalAmount) || 0;
    const paid = Number(item.advancePaid) || 0;
    const due = Math.max(0, total - paid);
    const ghName =
      tpl?.businessName ||
      item.guestHouseName ||
      resolvedGuestHouseInfo?.name ||
      activeWedding?.venue ||
      'AT Wedding Planner';
    const rcpCode = item.receiptNo || item.id.slice(-8).toUpperCase();
    const catsList = Array.isArray(item.categories) && item.categories.length > 0
      ? item.categories.join(', ')
      : item.category || '';

    const itemsArr =
      Array.isArray(item.lineItems) && item.lineItems.length > 0
        ? item.lineItems.map(
            (li) => `• ${li.label}: ${li.qty} × ${formatINR(li.rate)} = ${formatINR(li.amount)}`
          )
        : [`• ${item.title}: ${formatINR(total)}`];

    const discVal = Number(item.discountValue) || 0;
    const discLine =
      discVal > 0
        ? `Discount (${item.discountType === 'percent' ? `${discVal}%` : 'Flat'}): ${
            item.discountType === 'percent' ? `${discVal}%` : formatINR(discVal)
          }`
        : '';

    const taxLine = item.gstEnabled
      ? `Tax: CGST ${Number(item.cgstRate) || 0}% + SGST ${Number(item.sgstRate) || 0}%`
      : '';

    const summaryLines = [
      `BILL RECEIPT — ${ghName}`,
      tpl?.tagline ? `${tpl.tagline}` : '',
      `Receipt No: ${rcpCode} | Date: ${item.bookingDate || new Date().toISOString().slice(0, 10)}`,
      (tpl?.gstin || resolvedGuestHouseInfo?.gstin)
        ? `GSTIN: ${tpl?.gstin || resolvedGuestHouseInfo?.gstin}${
            tpl?.sacCode ? ` | SAC: ${tpl.sacCode}` : ''
          }`
        : '',
      '----------------------------------------',
      `Booking: ${item.title}`,
      catsList ? `Categories: ${catsList}` : '',
      activeWedding?.title ? `Wedding: ${activeWedding.title}` : '',
      `Client/Vendor: ${item.vendorName || '-'} | Phone: ${item.phone || '-'}`,
      `Venue/Hall: ${item.spaceName || item.location || ghName}`,
      `Date: ${item.serviceDate || 'TBD'} | Slot: ${item.slot || 'Full Day'}${
        item.expectedPax > 0 ? ` | Pax: ${item.expectedPax}` : ''
      }`,
      '----------------------------------------',
      'CHARGES & ITEMS:',
      ...itemsArr,
      discLine,
      taxLine,
      '----------------------------------------',
      `Total Amount: ${formatINR(total)}`,
      `Advance Paid (${item.paymentMode || 'UPI'}): ${formatINR(paid)}`,
      `Balance Due: ${formatINR(due)}`,
      `Status: ${item.status || 'Confirmed'}`,
      tpl?.upiId ? `UPI ID: ${tpl.upiId}` : '',
      tpl?.bankDetails ? `Bank: ${tpl.bankDetails}` : '',
      tpl?.terms ? `Terms:
${tpl.terms}` : '',
    ].filter(Boolean);
    return summaryLines.join('\n');
  };

  const shareBookingPDFViaWhatsApp = async (item, tpl = activeReceiptTemplate) => {
    const rcpCode = item.receiptNo || item.id.slice(-8).toUpperCase();
    const summaryText = formatExactBillText(item, tpl);

    const { blob, file, fileName } = await buildBookingReceiptPDF(item, tpl);

    // Trigger PDF download so the user always has the generated PDF ready to attach if needed
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);

    // If browser supports Web Share with PDF files, share PDF file + summary directly
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: `${item.title} - Receipt PDF`,
          text: summaryText,
          files: [file],
        });
        showToast(`PDF "${fileName}" shared & downloaded`);
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return;
      }
    }

    // Open WhatsApp with formatted booking & receipt summary while PDF is downloaded
    const cleanPhone = String(item.phone || '').replace(/\D/g, '');
    const waUrl =
      cleanPhone.length >= 10
        ? `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${encodeURIComponent(
            summaryText
          )}`
        : `https://wa.me/?text=${encodeURIComponent(summaryText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    showToast(`Downloaded "${fileName}" — attach it in WhatsApp`);
  };

  const sendWhatsAppReceipt = (item) => {
    shareBookingPDFViaWhatsApp(item, activeReceiptTemplate);
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
            (b.spaceName || '').toLowerCase().includes(q) ||
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
  const enquiryCount = bookings.filter((b) => b.status === 'Enquiry / Hold').length;
  const totalValue = bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
  const totalPaid = bookings.reduce((sum, b) => sum + (Number(b.advancePaid) || 0), 0);
  const totalDue = bookings.reduce(
    (sum, b) => sum + Math.max(0, (Number(b.totalAmount) || 0) - (Number(b.advancePaid) || 0)),
    0
  );

  // Date-wise availability across all bookings in Guest House / Admin scope
  const bookingsOnCalendarDate = useMemo(() => {
    return allScopeBookings.filter(
      (b) => b.serviceDate === calendarDate && b.status !== 'Cancelled'
    );
  }, [allScopeBookings, calendarDate]);



  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900">
            {isGuestHouse ? 'Guest House Bookings, Halls & Receipts' : 'Bookings & Service Ledger'}
          </h2>
          <p className="text-xs text-stone-500">
            {isGuestHouse
              ? `Manage bookings, hall/room availability, itemized bills, BEO sheets & receipts for ${
                  resolvedGuestHouseInfo.name || 'your Guest House'
                }.`
              : 'Store all bookings, contact numbers, locations, payment terms, bill receipts & photos.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {showGuestHouseTools && (
            <div className="inline-flex rounded-xl bg-white border border-stone-300 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  viewMode === 'list' ? 'bg-[#7A1C24] text-white' : 'text-stone-700'
                }`}
              >
                Bookings Ledger
              </button>
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  viewMode === 'calendar' ? 'bg-[#7A1C24] text-white' : 'text-stone-700'
                }`}
              >
                Availability
              </button>
              <button
                type="button"
                onClick={() => setViewMode('spaces')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  viewMode === 'spaces' ? 'bg-[#7A1C24] text-white' : 'text-stone-700'
                }`}
              >
                Halls & Rooms ({spaces.length})
              </button>
            </div>
          )}

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
              onClick={() => openAdd()}
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
            <span className="text-xs font-normal text-emerald-700">
              ({confirmedCount} Active{enquiryCount > 0 ? `, ${enquiryCount} Hold` : ''})
            </span>
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

      {/* VIEW 1: HALL / ROOM AVAILABILITY CALENDAR */}
      {viewMode === 'calendar' && showGuestHouseTools && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Calendar size={17} className="text-[#7A1C24]" /> Hall, Lawn & Room Availability
              </h3>
              <p className="text-xs text-stone-500">
                Inspect booked slots across your halls and rooms for any date.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={calendarDate}
                onChange={(e) => setCalendarDate(e.target.value)}
                className="px-3 py-2 border border-stone-300 rounded-xl text-xs font-semibold"
              />
              {perms.add && (
                <button
                  type="button"
                  onClick={() => openAdd(calendarDate)}
                  className="px-3.5 py-2 rounded-xl bg-[#7A1C24] text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Plus size={14} /> Book Date
                </button>
              )}
            </div>
          </div>

          {spaces.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {spaces.map((sp) => {
                const slotBookings = bookingsOnCalendarDate.filter(
                  (b) =>
                    (b.spaceId && b.spaceId === sp.id) ||
                    ((b.spaceName || b.location || '').toLowerCase() ===
                      (sp.name || '').toLowerCase() &&
                      sp.name)
                );
                const isBooked = slotBookings.length > 0;
                return (
                  <div
                    key={sp.id}
                    className={`p-4 rounded-xl border space-y-2 ${
                      isBooked
                        ? 'bg-amber-50/60 border-amber-300'
                        : 'bg-emerald-50/40 border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-stone-900">{sp.name}</div>
                        <div className="text-[11px] text-stone-500">
                          {sp.type} • Cap: {sp.capacity || '—'} • {formatINR(sp.rate)}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isBooked
                            ? 'bg-amber-200 text-amber-950'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isBooked ? `${slotBookings.length} Booked` : 'Available'}
                      </span>
                    </div>
                    {slotBookings.map((sb) => (
                      <div
                        key={sb.id}
                        className="p-2 rounded-lg bg-white border border-stone-200 text-xs flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-stone-800 truncate">{sb.title}</div>
                          <div className="text-[10px] text-stone-500">
                            {sb.slot || 'Full Day'} • {sb.status}
                          </div>
                        </div>
                        {perms.update && (
                          <button
                            type="button"
                            onClick={() => openEdit(sb)}
                            className="text-[11px] font-semibold text-[#7A1C24] hover:underline shrink-0"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-2 border-t border-stone-100">
            <div className="text-xs font-bold text-stone-700 mb-2">
              All Scheduled Bookings on {calendarDate} ({bookingsOnCalendarDate.length})
            </div>
            {bookingsOnCalendarDate.length === 0 ? (
              <p className="text-xs text-stone-500 py-4 text-center">
                No bookings on this date. All halls and rooms are open.
              </p>
            ) : (
              <div className="space-y-2">
                {bookingsOnCalendarDate.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-bold text-stone-900">{b.title}</span>{' '}
                      <span className="text-stone-500">
                        • {b.spaceName || b.location || 'Venue'} ({b.slot || 'Full Day'})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-[#7A1C24] font-bold text-[10px]">
                        {b.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => setReceiptBooking(b)}
                        className="px-2.5 py-1 rounded-lg bg-[#7A1C24] text-white font-semibold text-[11px]"
                      >
                        Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: HALLS & ROOMS INVENTORY */}
      {viewMode === 'spaces' && showGuestHouseTools && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Building2 size={17} className="text-[#7A1C24]" /> Hall, Lawn & Room Inventory
              </h3>
              <p className="text-xs text-stone-500">
                Define banquet halls, lawns, and room blocks for slot conflict checks and billing.
              </p>
            </div>
            <button
              type="button"
              onClick={openSpaceAdd}
              className="px-3.5 py-2 rounded-xl bg-[#7A1C24] text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus size={15} /> Add Hall / Room
            </button>
          </div>

          {spaces.length === 0 ? (
            <p className="text-xs text-stone-500 py-8 text-center">
              No halls or rooms added yet. Click "+ Add Hall / Room" to define your inventory.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {spaces.map((sp) => (
                <div
                  key={sp.id}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-stone-900">{sp.name}</div>
                        <div className="text-[11px] font-semibold text-[#7A1C24]">{sp.type}</div>
                      </div>
                      <span className="text-xs font-bold text-stone-900">
                        {formatINR(sp.rate)}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 mt-1.5">
                      Capacity: {sp.capacity || 0} Guests • Units: {sp.totalUnits || 1}
                    </div>
                    {sp.notes && <p className="text-xs text-stone-600 mt-1">{sp.notes}</p>}
                  </div>
                  <div className="flex justify-end gap-1 pt-2 border-t border-stone-200/70">
                    <button
                      type="button"
                      onClick={() => openSpaceEdit(sp)}
                      className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-200/60"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSpace(sp.id)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: BOOKINGS LEDGER */}
      {viewMode === 'list' && (
        <>
          {/* Filter & Sort Bar */}
          <div className="bg-white rounded-2xl border border-stone-200 p-3.5 flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bookings, vendors, phone numbers, halls, locations..."
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
                    <SortableHeader label="Contact & Hall/Venue" sortKey="phone" currentSort={sort} onSort={handleSort} />
                    <SortableHeader label="Event, Date & Slot" sortKey="serviceDate" currentSort={sort} onSort={handleSort} />
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
                        No bookings recorded yet.{' '}
                        {perms.add && 'Click "+ Add Booking" to log your first booking.'}
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
                            {item.expectedPax > 0 && (
                              <div className="text-[10px] text-stone-500">
                                Pax: {item.expectedPax}
                                {item.followUpDate ? ` • Follow-up: ${item.followUpDate}` : ''}
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            {item.phone ? (
                              <div className="flex items-center gap-1.5">
                                <a
                                  href={`tel:${item.phone}`}
                                  className="inline-flex items-center gap-1 font-semibold text-[#7A1C24] hover:underline"
                                  title="Call"
                                >
                                  <PhoneCall size={11} /> {item.phone}
                                </a>
                                {cleanPhone.length >= 10 && (
                                  <a
                                    href={`https://wa.me/${
                                      cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone
                                    }`}
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
                            {(item.spaceName || item.location) && (
                              <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                                <MapPin size={10} /> {item.spaceName || item.location}
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            <div className="font-medium text-stone-800">
                              {item.eventTag || 'All Events'}
                            </div>
                            <div className="text-[11px] text-stone-500">
                              {item.serviceDate ? `${item.serviceDate}` : 'Date TBD'}
                              {item.slot ? ` • ${item.slot}` : ''}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-right">
                            <div className="font-bold text-stone-900">
                              {formatINR(item.totalAmount)}
                            </div>
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
                            <div className="inline-flex items-center gap-1 justify-end flex-wrap">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedTemplateId(defaultTpl?.id || '');
                                  setReceiptBooking(item);
                                }}
                                title="Generate Bill Receipt"
                                className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#7A1C24] border border-amber-300 text-[11px] font-semibold inline-flex items-center gap-1"
                              >
                                <BookmarkCheck size={12} /> Bill
                              </button>
                              {showGuestHouseTools && (
                                <button
                                  type="button"
                                  onClick={() => setBeoBooking(item)}
                                  title="Banquet Event Order (BEO)"
                                  className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold inline-flex items-center gap-1"
                                >
                                  <CheckSquare size={12} /> BEO
                                </button>
                              )}
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
        </>
      )}

      {/* Add / Edit Booking Modal (with Conflict Alerts, Line Items, Installments & Bill Photos) */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          stopWebcam();
          setModalOpen(false);
        }}
        title={editing ? 'Edit Booking Details' : 'Add New Booking'}
        subtitle="Record hall/slot, contact info, itemized charges, installments & bill photos"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {bookingConflicts.length > 0 && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
              <div>
                <div className="font-bold">Double-Booking Conflict Detected!</div>
                <div>
                  Overlaps with {bookingConflicts.map((c) => `"${c.title}" (${c.status})`).join(', ')}{' '}
                  on {form.serviceDate} ({form.slot}).
                </div>
              </div>
            </div>
          )}

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
                placeholder="Enter booking or client title"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Booking Categories (Multi-Select)
              </label>
              <div className="max-h-28 overflow-y-auto p-2 border border-stone-300 rounded-lg bg-white space-y-1">
                {BOOKING_CATEGORIES.map((catOpt) => {
                  const checked = (form.categories || []).includes(catOpt);
                  return (
                    <label
                      key={catOpt}
                      className="flex items-center gap-2 text-xs text-stone-800 cursor-pointer py-0.5"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...(form.categories || []), catOpt]
                            : (form.categories || []).filter((c) => c !== catOpt);
                          setForm({
                            ...form,
                            categories: next,
                            category: next[0] || (form.customCategories || [])[0] || '',
                          });
                        }}
                        className="rounded border-stone-300 text-[#7A1C24]"
                      />
                      <span>{catOpt}</span>
                    </label>
                  );
                })}
              </div>
              <div className="mt-2 flex gap-1.5">
                <input
                  type="text"
                  value={newCustomCategory}
                  onChange={(e) => setNewCustomCategory(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = newCustomCategory.trim();
                      if (!val) return;
                      const nextCustom = Array.from(new Set([...(form.customCategories || []), val]));
                      const nextCats = Array.from(new Set([...(form.categories || []), val]));
                      setForm({
                        ...form,
                        customCategories: nextCustom,
                        categories: nextCats,
                        category: nextCats[0] || val,
                      });
                      setNewCustomCategory('');
                    }
                  }}
                  placeholder="Add custom 'Other' category..."
                  className="flex-1 px-2.5 py-1.5 border border-amber-300 bg-amber-50/40 rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    const val = newCustomCategory.trim();
                    if (!val) return;
                    const nextCustom = Array.from(new Set([...(form.customCategories || []), val]));
                    const nextCats = Array.from(new Set([...(form.categories || []), val]));
                    setForm({
                      ...form,
                      customCategories: nextCustom,
                      categories: nextCats,
                      category: nextCats[0] || val,
                    });
                    setNewCustomCategory('');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-[#7A1C24] text-white text-xs font-semibold shrink-0"
                >
                  + Other
                </button>
              </div>
              {(form.customCategories || []).length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {form.customCategories.map((cc) => (
                    <span
                      key={cc}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-[#7A1C24] text-[10px] font-bold"
                    >
                      {cc}
                      <button
                        type="button"
                        onClick={() => {
                          const nextCustom = (form.customCategories || []).filter((x) => x !== cc);
                          const nextCats = (form.categories || []).filter((x) => x !== cc);
                          setForm({
                            ...form,
                            customCategories: nextCustom,
                            categories: nextCats,
                            category: nextCats[0] || '',
                          });
                        }}
                        className="hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Client / Vendor Name
              </label>
              <input
                type="text"
                value={form.vendorName}
                onChange={(e) => setForm({ ...form, vendorName: e.target.value })}
                placeholder="Enter client or vendor name"
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Venue / Hall / Room
              </label>
              {spaces.length > 0 ? (
                <select
                  value={form.spaceId || ''}
                  onChange={(e) => {
                    const chosen = spaces.find((s) => s.id === e.target.value);
                    setForm({
                      ...form,
                      spaceId: chosen ? chosen.id : '',
                      spaceName: chosen ? chosen.name : form.location,
                      location: chosen ? chosen.name : form.location,
                    });
                  }}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
                >
                  <option value="">{defaultVenue || 'Custom / Select Space'}</option>
                  {spaces.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.type})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value, spaceName: e.target.value })
                  }
                  placeholder="Enter venue or hall name"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              )}
            </div>
            <DropdownWithOther
              label="Time Slot"
              value={form.slot}
              onChange={(val) => setForm({ ...form, slot: val })}
              options={BOOKING_SLOTS}
              placeholder="Enter time slot"
            />
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
                Event / Check-In Date
              </label>
              <input
                type="date"
                value={form.serviceDate}
                onChange={(e) => setForm({ ...form, serviceDate: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Expected Pax (Guests)
              </label>
              <input
                type="number"
                min="0"
                value={form.expectedPax}
                onChange={(e) => setForm({ ...form, expectedPax: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <DropdownWithOther
              label="Booking / Lead Status"
              value={form.status}
              onChange={(val) => setForm({ ...form, status: val })}
              options={BOOKING_STATUSES}
              placeholder="Enter booking status"
            />
          </div>

          {form.status === 'Enquiry / Hold' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Next Follow-Up Date
                </label>
                <input
                  type="date"
                  value={form.followUpDate}
                  onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 bg-white rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Booking Date
                </label>
                <input
                  type="date"
                  value={form.bookingDate}
                  onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 bg-white rounded-lg text-sm"
                />
              </div>
            </div>
          )}

          {/* Itemized Package / Bill Line Items */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-stone-800">
                  Itemized Charges, Events &amp; Menu (Auto-Calculates Total)
                </span>
                {((weddingEvents && weddingEvents.length > 0) ||
                  (weddingMenu && weddingMenu.length > 0)) && (
                  <button
                    type="button"
                    onClick={addAllEventsAndMenuToBill}
                    className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-[#7A1C24] text-[10px] font-bold"
                  >
                    + Include All Events &amp; Menu
                  </button>
                )}
              </div>
              <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(form.gstEnabled)}
                  onChange={(e) => {
                    const enabled = e.target.checked;
                    const sub = (form.lineItems || []).reduce(
                      (s, x) => s + (Number(x.amount) || 0),
                      0
                    );
                    const pct = enabled
                      ? (Number(form.cgstRate) || 0) + (Number(form.sgstRate) || 0)
                      : 0;
                    setForm((prev) => ({
                      ...prev,
                      gstEnabled: enabled,
                      totalAmount: sub > 0 ? Math.round(sub * (1 + pct / 100)) : prev.totalAmount,
                    }));
                  }}
                />
                <span>Apply GST</span>
              </label>
            </div>

            {form.gstEnabled && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                    CGST (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.5"
                    value={form.cgstRate}
                    onChange={(e) => setForm({ ...form, cgstRate: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-300 bg-white rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                    SGST (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.5"
                    value={form.sgstRate}
                    onChange={(e) => setForm({ ...form, sgstRate: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-300 bg-white rounded-lg text-xs"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                value={newItemLabel}
                onChange={(e) => setNewItemLabel(e.target.value)}
                placeholder="Item (e.g. Hall / Rooms / Plate)"
                className="sm:col-span-2 px-2.5 py-1.5 border border-stone-300 bg-white rounded-lg text-xs"
              />
              <input
                type="number"
                min="1"
                value={newItemQty}
                onChange={(e) => setNewItemQty(e.target.value)}
                placeholder="Qty"
                className="px-2.5 py-1.5 border border-stone-300 bg-white rounded-lg text-xs"
              />
              <div className="flex gap-1">
                <input
                  type="number"
                  min="0"
                  value={newItemRate}
                  onChange={(e) => setNewItemRate(e.target.value)}
                  placeholder="Rate ₹"
                  className="w-full px-2.5 py-1.5 border border-stone-300 bg-white rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={addLineItem}
                  className="px-2.5 py-1.5 rounded-lg bg-[#7A1C24] text-white text-xs font-semibold shrink-0"
                >
                  +
                </button>
              </div>
            </div>

            {((weddingEvents && weddingEvents.length > 0) ||
              (weddingMenu && weddingMenu.length > 0)) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {weddingEvents && weddingEvents.length > 0 && (
                  <div className="flex gap-1.5">
                    <select
                      value={selectedEventToAdd}
                      onChange={(e) => setSelectedEventToAdd(e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-stone-300 bg-white rounded-lg text-xs"
                    >
                      <option value="">-- Select Wedding Event to Bill --</option>
                      {weddingEvents.map((ev) => (
                        <option key={ev.id} value={ev.id}>
                          {ev.name} {ev.date ? `(${ev.date})` : ''}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={addEventToBill}
                      className="px-2.5 py-1.5 rounded-lg bg-stone-800 text-white text-xs font-semibold shrink-0"
                    >
                      + Event
                    </button>
                  </div>
                )}
                {weddingMenu && weddingMenu.length > 0 && (
                  <div className="flex gap-1.5">
                    <select
                      value={selectedMenuToAdd}
                      onChange={(e) => setSelectedMenuToAdd(e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-stone-300 bg-white rounded-lg text-xs"
                    >
                      <option value="">-- Select Menu Dish to Bill --</option>
                      {weddingMenu.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.dishName} ({m.event || 'Menu'})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={addMenuDishToBill}
                      className="px-2.5 py-1.5 rounded-lg bg-stone-800 text-white text-xs font-semibold shrink-0"
                    >
                      + Menu
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                  Discount Type
                </label>
                <select
                  value={form.discountType || 'flat'}
                  onChange={(e) => {
                    const nextType = e.target.value;
                    setForm((prev) => {
                      const updated = { ...prev, discountType: nextType };
                      return { ...updated, totalAmount: computeBillTotalFromState(updated) };
                    });
                  }}
                  className="w-full px-2.5 py-1.5 border border-stone-300 bg-white rounded-lg text-xs"
                >
                  <option value="flat">Flat Amount (₹)</option>
                  <option value="percent">Percentage (%)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                  Discount Value ({form.discountType === 'percent' ? '%' : '₹'})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={form.discountValue ?? 0}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm((prev) => {
                      const updated = { ...prev, discountValue: val };
                      return { ...updated, totalAmount: computeBillTotalFromState(updated) };
                    });
                  }}
                  className="w-full px-2.5 py-1.5 border border-stone-300 bg-white rounded-lg text-xs"
                />
              </div>
            </div>

            {(form.lineItems || []).length > 0 && (
              <div className="divide-y divide-stone-200 bg-white rounded-lg border border-stone-200 text-xs">
                {form.lineItems.map((li) => (
                  <div
                    key={li.id}
                    className="px-3 py-1.5 flex flex-wrap items-center justify-between gap-2"
                  >
                    <span className="font-medium text-stone-800 flex-1 min-w-[140px]">
                      {li.label}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        value={li.qty}
                        onChange={(e) => updateLineItemRow(li.id, 'qty', e.target.value)}
                        className="w-14 px-1.5 py-1 border border-stone-300 rounded text-xs text-center"
                        title="Qty"
                      />
                      <span>×</span>
                      <input
                        type="number"
                        min="0"
                        value={li.rate}
                        onChange={(e) => updateLineItemRow(li.id, 'rate', e.target.value)}
                        className="w-20 px-1.5 py-1 border border-stone-300 rounded text-xs text-right"
                        title="Rate ₹"
                      />
                      <span className="font-bold text-stone-900 w-20 text-right">
                        {formatINR(li.amount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeLineItem(li.id)}
                        className="text-red-600 hover:underline"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

          {/* Payment Installment Ledger */}
          <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200/80 space-y-2">
            <div className="text-xs font-bold text-stone-800">
              Payment Installments ({(form.installments || []).length})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="number"
                min="0"
                value={newInstallmentAmt}
                onChange={(e) => setNewInstallmentAmt(e.target.value)}
                placeholder="Payment ₹"
                className="px-2.5 py-1.5 border border-stone-300 bg-white rounded-lg text-xs"
              />
              <select
                value={newInstallmentMode}
                onChange={(e) => setNewInstallmentMode(e.target.value)}
                className="px-2.5 py-1.5 border border-stone-300 bg-white rounded-lg text-xs"
              >
                {PAYMENT_MODES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newInstallmentRef}
                onChange={(e) => setNewInstallmentRef(e.target.value)}
                placeholder="UTR / Receipt Ref"
                className="px-2.5 py-1.5 border border-stone-300 bg-white rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={addInstallment}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold"
              >
                Add Payment
              </button>
            </div>
            {(form.installments || []).length > 0 && (
              <div className="divide-y divide-emerald-100 bg-white rounded-lg border border-emerald-200 text-xs">
                {form.installments.map((inst) => (
                  <div key={inst.id} className="px-3 py-1.5 flex items-center justify-between">
                    <span>
                      {inst.date} • {inst.mode} {inst.ref ? `(${inst.ref})` : ''}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-800">
                        {formatINR(inst.amount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeInstallment(inst.id)}
                        className="text-red-600"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

      {/* Add / Edit Hall or Room Modal */}
      <Modal
        isOpen={spaceModalOpen}
        onClose={() => setSpaceModalOpen(false)}
        title={editingSpace ? 'Edit Hall / Room' : 'Add Hall / Lawn / Room'}
      >
        <form onSubmit={handleSaveSpace} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Space Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={spaceForm.name}
                onChange={(e) => setSpaceForm({ ...spaceForm, name: e.target.value })}
                placeholder="e.g. Grand Banquet Hall / Royal Lawn"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <DropdownWithOther
              label="Category"
              value={spaceForm.type}
              onChange={(val) => setSpaceForm({ ...spaceForm, type: val })}
              options={['Banquet Hall', 'Lawn', 'AC Rooms', 'Bridal Suite', 'Conference / Dining']}
              placeholder="Enter space type"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Capacity</label>
              <input
                type="number"
                min="1"
                value={spaceForm.capacity}
                onChange={(e) => setSpaceForm({ ...spaceForm, capacity: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Rooms / Units
              </label>
              <input
                type="number"
                min="1"
                value={spaceForm.totalUnits}
                onChange={(e) => setSpaceForm({ ...spaceForm, totalUnits: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Base Tariff (₹)
              </label>
              <input
                type="number"
                min="0"
                value={spaceForm.rate}
                onChange={(e) => setSpaceForm({ ...spaceForm, rate: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Notes</label>
            <input
              type="text"
              value={spaceForm.notes}
              onChange={(e) => setSpaceForm({ ...spaceForm, notes: e.target.value })}
              placeholder="Amenities, AC details, inclusions..."
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setSpaceModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#7A1C24] text-white text-xs font-semibold"
            >
              Save Space
            </button>
          </div>
        </form>
      </Modal>

      {/* Bill Receipt Generator Modal */}
      <Modal
        isOpen={Boolean(receiptBooking)}
        onClose={() => setReceiptBooking(null)}
        title="Generate Bill Receipt"
        subtitle={receiptBooking?.title}
        maxWidth="max-w-2xl"
      >
        {receiptBooking && activeReceiptTemplate && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-stone-700">Bill Template:</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="px-2.5 py-1.5 border border-stone-300 bg-white rounded-lg text-xs font-semibold"
                >
                  {(billTemplates.length > 0 ? billTemplates : DEFAULT_BILL_TEMPLATES).map(
                    (tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name} {tpl.isDefault ? '(Default)' : ''}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => shareBookingPDFViaWhatsApp(receiptBooking, activeReceiptTemplate)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1"
                >
                  <Share2 size={13} /> Share PDF on WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-[#7A1C24] text-white text-xs font-semibold inline-flex items-center gap-1"
                >
                  <Download size={13} /> Print / PDF
                </button>
              </div>
            </div>

            {/* Exact Bill Format Preview (Matches WhatsApp Share Line-for-Line) */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Exact Bill Format (WhatsApp &amp; Receipt Text)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      formatExactBillText(receiptBooking, activeReceiptTemplate)
                    );
                    showToast('Copied exact formatted bill');
                  }}
                  className="text-[11px] font-semibold text-[#7A1C24] hover:underline"
                >
                  Copy Text
                </button>
              </div>
              <pre className="text-xs text-stone-800 whitespace-pre-wrap font-mono bg-white p-3 rounded-lg border border-stone-200">
                {formatExactBillText(receiptBooking, activeReceiptTemplate)}
              </pre>
            </div>

            {/* Printable Receipt Slip */}
            <div className="p-6 rounded-2xl border-2 border-stone-300 bg-white text-stone-900 space-y-4">
              <div className="flex items-start justify-between border-b border-stone-200 pb-4">
                <div>
                  <h4 className="text-lg font-extrabold text-[#7A1C24]">
                    {activeReceiptTemplate.businessName ||
                      receiptBooking.guestHouseName ||
                      resolvedGuestHouseInfo.name ||
                      activeWedding?.venue ||
                      'AT Wedding Planner'}
                  </h4>
                  {activeReceiptTemplate.tagline && (
                    <p className="text-xs text-stone-500">{activeReceiptTemplate.tagline}</p>
                  )}
                  {(activeReceiptTemplate.address || resolvedGuestHouseInfo.address) && (
                    <p className="text-xs text-stone-600 mt-1">
                      {activeReceiptTemplate.address || resolvedGuestHouseInfo.address}
                    </p>
                  )}
                  <div className="text-[11px] text-stone-500 mt-0.5 flex flex-wrap gap-3">
                    {(activeReceiptTemplate.phone || resolvedGuestHouseInfo.phone) && (
                      <span>
                        Ph: {activeReceiptTemplate.phone || resolvedGuestHouseInfo.phone}
                      </span>
                    )}
                    {(activeReceiptTemplate.gstin || resolvedGuestHouseInfo.gstin) && (
                      <span>
                        GSTIN: {activeReceiptTemplate.gstin || resolvedGuestHouseInfo.gstin}
                      </span>
                    )}
                    {activeReceiptTemplate.sacCode && (
                      <span>SAC: {activeReceiptTemplate.sacCode}</span>
                    )}
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-bold uppercase tracking-wider text-stone-500">
                    Bill Receipt
                  </div>
                  <div className="font-bold text-sm text-stone-900 mt-0.5">
                    {receiptBooking.receiptNo || receiptBooking.id.slice(-8).toUpperCase()}
                  </div>
                  <div className="text-stone-500 mt-0.5">
                    Date: {receiptBooking.bookingDate || new Date().toISOString().slice(0, 10)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50 p-3.5 rounded-xl">
                <div>
                  <div className="text-[10px] font-bold uppercase text-stone-400">
                    Billed To / Client
                  </div>
                  <div className="font-bold text-stone-900">
                    {receiptBooking.vendorName || receiptBooking.title}
                  </div>
                  {receiptBooking.phone && <div className="text-stone-600">{receiptBooking.phone}</div>}
                </div>
                <div className="sm:text-right">
                  <div className="text-[10px] font-bold uppercase text-stone-400">
                    Event & Venue Details
                  </div>
                  <div className="font-semibold text-stone-800">{activeWedding?.title}</div>
                  <div className="text-stone-600">
                    {receiptBooking.serviceDate || 'Date TBD'} • {receiptBooking.slot || 'Full Day'}
                  </div>
                  <div className="text-stone-600">
                    {receiptBooking.spaceName || receiptBooking.location || ''}
                  </div>
                </div>
              </div>

              {/* Charges Table */}
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-300 text-stone-600">
                    <th className="py-2 text-left">Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Rate</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {Array.isArray(receiptBooking.lineItems) && receiptBooking.lineItems.length > 0 ? (
                    receiptBooking.lineItems.map((li) => (
                      <tr key={li.id}>
                        <td className="py-2 font-medium">{li.label}</td>
                        <td className="py-2 text-center">{li.qty}</td>
                        <td className="py-2 text-right">{formatINR(li.rate)}</td>
                        <td className="py-2 text-right font-semibold">{formatINR(li.amount)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-2 font-medium">{receiptBooking.title}</td>
                      <td className="py-2 text-center">1</td>
                      <td className="py-2 text-right">{formatINR(receiptBooking.totalAmount)}</td>
                      <td className="py-2 text-right font-semibold">
                        {formatINR(receiptBooking.totalAmount)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Totals Summary */}
              {(() => {
                const total = Number(receiptBooking.totalAmount) || 0;
                const paid = Number(receiptBooking.advancePaid) || 0;
                const due = Math.max(0, total - paid);
                return (
                  <div className="flex justify-end pt-2 border-t border-stone-200 text-xs">
                    <div className="w-64 space-y-1.5">
                      <div className="flex justify-between font-bold text-sm text-stone-900">
                        <span>Total Amount</span>
                        <span>{formatINR(total)}</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Paid ({receiptBooking.paymentMode || 'UPI'})</span>
                        <span>{formatINR(paid)}</span>
                      </div>
                      <div className="flex justify-between text-amber-800 font-bold pt-1 border-t border-stone-200">
                        <span>Balance Due</span>
                        <span>{formatINR(due)}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {(activeReceiptTemplate.upiId || activeReceiptTemplate.bankDetails) && (
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs space-y-0.5">
                  {activeReceiptTemplate.upiId && (
                    <div>
                      <strong>UPI ID:</strong> {activeReceiptTemplate.upiId}
                    </div>
                  )}
                  {activeReceiptTemplate.bankDetails && (
                    <div>
                      <strong>Bank Details:</strong> {activeReceiptTemplate.bankDetails}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-end justify-between gap-4 pt-3 border-t border-stone-200 text-[11px] text-stone-500">
                <div className="max-w-md whitespace-pre-line">
                  {activeReceiptTemplate.terms}
                </div>
                <div className="text-right font-semibold text-stone-700">
                  {activeReceiptTemplate.signatoryLabel || 'Authorized Signatory'}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Banquet Event Order (BEO) Modal */}
      <Modal
        isOpen={Boolean(beoBooking)}
        onClose={() => setBeoBooking(null)}
        title="Banquet Event Order (BEO)"
        subtitle="Staff & Operations Sheet"
        maxWidth="max-w-xl"
      >
        {beoBooking && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-stone-900">{beoBooking.title}</h4>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#7A1C24] font-bold text-[10px]">
                  {beoBooking.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-stone-700 pt-1">
                <div>
                  <strong>Wedding:</strong> {activeWedding?.title}
                </div>
                <div>
                  <strong>Date:</strong> {beoBooking.serviceDate || 'TBD'}
                </div>
                <div>
                  <strong>Hall / Space:</strong> {beoBooking.spaceName || beoBooking.location || '—'}
                </div>
                <div>
                  <strong>Slot:</strong> {beoBooking.slot || 'Full Day'}
                </div>
                <div>
                  <strong>Expected Pax:</strong> {beoBooking.expectedPax || 0} Guests
                </div>
                <div>
                  <strong>Contact:</strong> {beoBooking.vendorName || '—'} ({beoBooking.phone || '—'})
                </div>
              </div>
              {beoBooking.notes && (
                <div className="pt-2 border-t border-stone-200 text-stone-700">
                  <strong>Setup & Operational Notes:</strong> {beoBooking.notes}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-[#7A1C24] text-white font-semibold inline-flex items-center gap-1.5"
              >
                <Download size={14} /> Print BEO
              </button>
            </div>
          </div>
        )}
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
// MODULE: MULTI-TEMPLATE BILL & RECEIPT STUDIO
// ==========================================
function BillTemplatesModule({
  templates = [],
  currentUser,
  resolvedGuestHouseInfo,
  setState,
  recordAudit,
  showToast,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTpl, setEditingTpl] = useState(null);
  const [previewTpl, setPreviewTpl] = useState(null);

  const blankTemplate = () => ({
    name: '',
    style: 'classic',
    businessName: resolvedGuestHouseInfo?.name || '',
    tagline: 'Banquet Hall, Lawn & Guest House',
    address: resolvedGuestHouseInfo?.address || '',
    phone: resolvedGuestHouseInfo?.phone || '',
    email: '',
    gstin: resolvedGuestHouseInfo?.gstin || '',
    sacCode: '996311',
    defaultCgst: 9,
    defaultSgst: 9,
    upiId: '',
    bankDetails: '',
    signatoryLabel: 'Authorized Signatory',
    terms: '1. 50% advance required at booking confirmation.\n2. Balance due prior to event start.\n3. Terms & conditions apply as per venue agreement.',
    isDefault: false,
  });

  const [form, setForm] = useState(blankTemplate);

  const openAdd = () => {
    setEditingTpl(null);
    setForm(blankTemplate());
    setModalOpen(true);
  };

  const openEdit = (tpl) => {
    setEditingTpl(tpl);
    setForm({
      name: tpl.name || '',
      style: tpl.style || 'classic',
      businessName: tpl.businessName || resolvedGuestHouseInfo?.name || '',
      tagline: tpl.tagline || '',
      address: tpl.address || '',
      phone: tpl.phone || '',
      email: tpl.email || '',
      gstin: tpl.gstin || '',
      sacCode: tpl.sacCode || '996311',
      defaultCgst: tpl.defaultCgst ?? 9,
      defaultSgst: tpl.defaultSgst ?? 9,
      upiId: tpl.upiId || '',
      bankDetails: tpl.bankDetails || '',
      signatoryLabel: tpl.signatoryLabel || 'Authorized Signatory',
      terms: tpl.terms || '',
      isDefault: Boolean(tpl.isDefault),
    });
    setModalOpen(true);
  };

  const duplicateTemplate = (tpl) => {
    const copy = {
      ...tpl,
      id: uid('tpl'),
      name: `${tpl.name} (Copy)`,
      isDefault: false,
      ownerUserId: currentUser.id,
    };
    setState((prev) => ({
      ...prev,
      billTemplates: [...(prev.billTemplates || DEFAULT_BILL_TEMPLATES), copy],
    }));
    recordAudit('Bill Templates', 'Created', `Duplicated bill template "${copy.name}"`);
    showToast('Template duplicated');
  };

  const setAsDefault = (tplId) => {
    setState((prev) => ({
      ...prev,
      billTemplates: (prev.billTemplates || DEFAULT_BILL_TEMPLATES).map((t) => ({
        ...t,
        isDefault: t.id === tplId,
      })),
    }));
    showToast('Default bill template updated');
  };

  const deleteTemplate = (tpl) => {
    if ((templates || []).length <= 1) {
      showToast('At least one bill template is required', 'error');
      return;
    }
    setState((prev) => {
      const remaining = (prev.billTemplates || []).filter((t) => t.id !== tpl.id);
      if (tpl.isDefault && remaining[0]) remaining[0].isDefault = true;
      return { ...prev, billTemplates: remaining };
    });
    recordAudit('Bill Templates', 'Deleted', `Deleted bill template "${tpl.name}"`);
    showToast('Template deleted');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const payload = {
      ...form,
      name: form.name.trim(),
      defaultCgst: Number(form.defaultCgst) || 0,
      defaultSgst: Number(form.defaultSgst) || 0,
    };

    if (editingTpl) {
      setState((prev) => {
        const base = (prev.billTemplates || DEFAULT_BILL_TEMPLATES).map((t) =>
          t.id === editingTpl.id ? { ...t, ...payload } : t
        );
        const normalized = payload.isDefault
          ? base.map((t) => ({ ...t, isDefault: t.id === editingTpl.id }))
          : base;
        return { ...prev, billTemplates: normalized };
      });
      recordAudit('Bill Templates', 'Updated', `Updated bill template "${payload.name}"`);
      showToast('Bill template updated');
    } else {
      const created = {
        id: uid('tpl'),
        ownerUserId: currentUser.id,
        ...payload,
      };
      setState((prev) => {
        const existing = (prev.billTemplates || DEFAULT_BILL_TEMPLATES).map((t) =>
          payload.isDefault ? { ...t, isDefault: false } : t
        );
        return { ...prev, billTemplates: [...existing, created] };
      });
      recordAudit('Bill Templates', 'Created', `Created bill template "${payload.name}"`);
      showToast('New bill template added');
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Bill & Receipt Templates</h2>
          <p className="text-xs text-stone-500">
            Create and manage multiple receipt/invoice templates with your Guest House branding, GSTIN, UPI & terms.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="px-4 py-2.5 rounded-xl bg-[#7A1C24] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:bg-[#5E141B]"
        >
          <Plus size={16} /> Add Bill Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between space-y-4 ${
              tpl.isDefault ? 'border-[#7A1C24] ring-2 ring-[#7A1C24]/15' : 'border-stone-200'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">{tpl.name}</h3>
                  <p className="text-xs text-stone-600 font-medium mt-0.5">
                    {tpl.businessName || resolvedGuestHouseInfo?.name || 'Guest House / Venue'}
                  </p>
                </div>
                {tpl.isDefault && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-[#7A1C24] text-[10px] font-bold shrink-0">
                    Default
                  </span>
                )}
              </div>

              <div className="text-[11px] text-stone-500 space-y-0.5 pt-1">
                <div>Layout: {tpl.style === 'compact' ? 'Compact Receipt' : 'Standard Tax Invoice'}</div>
                {tpl.gstin && <div>GSTIN: {tpl.gstin}</div>}
                {tpl.phone && <div>Phone: {tpl.phone}</div>}
                {tpl.upiId && <div>UPI: {tpl.upiId}</div>}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {!tpl.isDefault && (
                  <button
                    type="button"
                    onClick={() => setAsDefault(tpl.id)}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#7A1C24] text-[11px] font-semibold"
                  >
                    Set Default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPreviewTpl(tpl)}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold"
                >
                  Preview
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => duplicateTemplate(tpl)}
                  title="Duplicate Template"
                  className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
                >
                  <Copy size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(tpl)}
                  title="Edit Template"
                  className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => deleteTemplate(tpl)}
                  title="Delete Template"
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Bill Template Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTpl ? 'Edit Bill Template' : 'Create Bill Template'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Template Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Banquet Hall GST Bill"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Receipt Layout Style
              </label>
              <select
                value={form.style}
                onChange={(e) => setForm({ ...form, style: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
              >
                <option value="classic">Classic Invoice Layout</option>
                <option value="compact">Compact Receipt Layout</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Guest House / Business Name
              </label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                placeholder="Enter guest house name"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">GSTIN</label>
              <input
                type="text"
                value={form.gstin}
                onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">SAC Code</label>
              <input
                type="text"
                value={form.sacCode}
                onChange={(e) => setForm({ ...form, sacCode: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">UPI ID</label>
              <input
                type="text"
                value={form.upiId}
                onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                placeholder="e.g. venue@upi"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Signatory Label
              </label>
              <input
                type="text"
                value={form.signatoryLabel}
                onChange={(e) => setForm({ ...form, signatoryLabel: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Bank Account Details
            </label>
            <input
              type="text"
              value={form.bankDetails}
              onChange={(e) => setForm({ ...form, bankDetails: e.target.value })}
              placeholder="Bank name, A/C No, IFSC"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Terms & Conditions
            </label>
            <textarea
              rows={3}
              value={form.terms}
              onChange={(e) => setForm({ ...form, terms: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
            />
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(form.isDefault)}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
            />
            <span>Set as default bill template</span>
          </label>

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
              Save Template
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(previewTpl)}
        onClose={() => setPreviewTpl(null)}
        title={previewTpl?.name || 'Template Preview'}
        maxWidth="max-w-lg"
      >
        {previewTpl && (
          <div className="p-5 rounded-2xl border border-stone-300 bg-white space-y-3 text-xs">
            <div className="border-b border-stone-200 pb-3">
              <div className="text-base font-extrabold text-[#7A1C24]">
                {previewTpl.businessName || resolvedGuestHouseInfo?.name || 'Guest House'}
              </div>
              {previewTpl.tagline && <div className="text-stone-500">{previewTpl.tagline}</div>}
              {previewTpl.address && <div className="text-stone-600 mt-1">{previewTpl.address}</div>}
              <div className="text-[11px] text-stone-500 mt-1">
                {previewTpl.phone ? `Phone: ${previewTpl.phone} • ` : ''}
                {previewTpl.gstin ? `GSTIN: ${previewTpl.gstin}` : ''}
              </div>
            </div>
            {(previewTpl.upiId || previewTpl.bankDetails) && (
              <div className="p-2.5 rounded-lg bg-amber-50/70 text-[11px] space-y-0.5">
                {previewTpl.upiId && <div>UPI: {previewTpl.upiId}</div>}
                {previewTpl.bankDetails && <div>Bank: {previewTpl.bankDetails}</div>}
              </div>
            )}
            <div className="text-[11px] text-stone-500 whitespace-pre-line">{previewTpl.terms}</div>
            <div className="text-right font-semibold text-stone-700 pt-2">
              {previewTpl.signatoryLabel || 'Authorized Signatory'}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}


// ==========================================
// DEDICATED GUEST HOUSE DASHBOARD & SCOPED WEDDING VIEW
// ==========================================
function GuestHouseDashboard({
  activeWeddings = [],
  allWeddings = [],
  bookings = [],
  events = [],
  menu = [],
  spaces = [],
  billTemplates = [],
  currentUser,
  resolvedGuestHouseInfo,
  defaultVenue = '',
  setState,
  stampUser,
  recordAudit,
  showToast,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeddingId, setSelectedWeddingId] = useState('');
  const [detailTab, setDetailTab] = useState('dashboard'); // 'dashboard' | 'events' | 'menu' | 'bookings'
  const [paymentModalBookingId, setPaymentModalBookingId] = useState(null);
  const [instAmount, setInstAmount] = useState('');
  const [instMode, setInstMode] = useState('UPI');
  const [instRef, setInstRef] = useState('');
  const [instDate, setInstDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [manualAdvance, setManualAdvance] = useState('');
  const [manualStatus, setManualStatus] = useState('Confirmed');
  const [billPreviewBooking, setBillPreviewBooking] = useState(null);
  const [selectedTplId, setSelectedTplId] = useState('');

  const defaultTpl = useMemo(() => {
    const list = billTemplates.length > 0 ? billTemplates : DEFAULT_BILL_TEMPLATES;
    return list.find((t) => t.isDefault) || list[0];
  }, [billTemplates]);

  useEffect(() => {
    if (defaultTpl && !selectedTplId) setSelectedTplId(defaultTpl.id);
  }, [defaultTpl, selectedTplId]);

  const activeTemplate = useMemo(() => {
    const list = billTemplates.length > 0 ? billTemplates : DEFAULT_BILL_TEMPLATES;
    return list.find((t) => t.id === selectedTplId) || defaultTpl;
  }, [billTemplates, selectedTplId, defaultTpl]);

  const weddingMap = useMemo(() => {
    const m = {};
    allWeddings.forEach((w) => {
      m[w.id] = w;
    });
    return m;
  }, [allWeddings]);

  // All-field search across weddings and bookings
  const matchesSearch = (w, b) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const wText = w
      ? [w.title, w.coupleNames, w.city, w.venue, w.date, w.status].filter(Boolean).join(' ')
      : '';
    const bText = b
      ? [
          b.title,
          b.category,
          Array.isArray(b.categories) ? b.categories.join(' ') : '',
          b.vendorName,
          b.phone,
          b.altPhone,
          b.location,
          b.spaceName,
          b.slot,
          b.eventTag,
          b.serviceDate,
          b.status,
          b.receiptNo,
          b.paymentMode,
          b.notes,
        ]
          .filter(Boolean)
          .join(' ')
      : '';
    return `${wText} ${bText}`.toLowerCase().includes(q);
  };

  const filteredActiveWeddings = useMemo(() => {
    return activeWeddings.filter((w) => {
      const wedBookings = bookings.filter((b) => b.weddingId === w.id);
      return matchesSearch(w, null) || wedBookings.some((b) => matchesSearch(w, b));
    });
  }, [activeWeddings, bookings, searchQuery]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => matchesSearch(weddingMap[b.weddingId] || null, b));
  }, [bookings, weddingMap, searchQuery]);

  // Bookings & Wedding KPIs ONLY
  const totalBookingValue = filteredBookings.reduce(
    (sum, b) => sum + (Number(b.totalAmount) || 0),
    0
  );
  const totalPaid = filteredBookings.reduce((sum, b) => sum + (Number(b.advancePaid) || 0), 0);
  const totalDue = filteredBookings.reduce(
    (sum, b) => sum + Math.max(0, (Number(b.totalAmount) || 0) - (Number(b.advancePaid) || 0)),
    0
  );

  const selectedWedding = useMemo(() => {
    if (!selectedWeddingId) return null;
    return activeWeddings.find((w) => w.id === selectedWeddingId) || null;
  }, [selectedWeddingId, activeWeddings]);

  const openPaymentUpdater = (b) => {
    setPaymentModalBookingId(b.id);
    setInstAmount('');
    setInstMode(b.paymentMode || 'UPI');
    setInstRef('');
    setInstDate(new Date().toISOString().slice(0, 10));
    setManualAdvance(String(b.advancePaid ?? 0));
    setManualStatus(b.status || 'Confirmed');
  };

  const paymentBooking = useMemo(
    () => bookings.find((b) => b.id === paymentModalBookingId) || null,
    [bookings, paymentModalBookingId]
  );

  const handleAddInstallmentToBooking = (e) => {
    e.preventDefault();
    if (!paymentBooking) return;
    const amt = Number(instAmount) || 0;
    const newInst =
      amt > 0
        ? [
            ...(paymentBooking.installments || []),
            {
              id: uid('inst'),
              date: instDate || new Date().toISOString().slice(0, 10),
              amount: amt,
              mode: instMode || 'UPI',
              ref: instRef.trim(),
            },
          ]
        : paymentBooking.installments || [];
    const instSum = newInst.reduce((s, x) => s + (Number(x.amount) || 0), 0);
    const nextPaid = amt > 0 ? Math.max(instSum, Number(manualAdvance) || 0) : Number(manualAdvance) || 0;

    setState((prev) => ({
      ...prev,
      bookings: (prev.bookings || []).map((b) =>
        b.id === paymentBooking.id
          ? {
              ...b,
              installments: newInst,
              advancePaid: nextPaid,
              paymentMode: instMode || b.paymentMode || 'UPI',
              status: manualStatus || b.status,
              ...stampUser(b),
            }
          : b
      ),
    }));
    recordAudit(
      'Bookings',
      'Payment Updated',
      `Updated payment for "${paymentBooking.title}" (Paid: ${formatINR(nextPaid)})`,
      paymentBooking.weddingId
    );
    showToast('Payment details updated');
    setPaymentModalBookingId(null);
  };

  const handleSaveManualPaymentOnly = () => {
    if (!paymentBooking) return;
    const nextPaid = Math.max(0, Number(manualAdvance) || 0);
    setState((prev) => ({
      ...prev,
      bookings: (prev.bookings || []).map((b) =>
        b.id === paymentBooking.id
          ? {
              ...b,
              advancePaid: nextPaid,
              paymentMode: instMode || b.paymentMode || 'UPI',
              status: manualStatus || b.status,
              ...stampUser(b),
            }
          : b
      ),
    }));
    recordAudit(
      'Bookings',
      'Payment Updated',
      `Updated advance to ${formatINR(nextPaid)} for "${paymentBooking.title}"`,
      paymentBooking.weddingId
    );
    showToast('Payment details saved');
    setPaymentModalBookingId(null);
  };

  const formatBillOutput = (item, tpl = activeTemplate) => {
    const wed = weddingMap[item.weddingId] || selectedWedding;
    const total = Number(item.totalAmount) || 0;
    const paid = Number(item.advancePaid) || 0;
    const due = Math.max(0, total - paid);
    const ghName =
      tpl?.businessName ||
      item.guestHouseName ||
      resolvedGuestHouseInfo?.name ||
      defaultVenue ||
      'Guest House';
    const rcpCode = item.receiptNo || item.id.slice(-8).toUpperCase();
    const catsList =
      Array.isArray(item.categories) && item.categories.length > 0
        ? item.categories.join(', ')
        : item.category || '';

    const itemsArr =
      Array.isArray(item.lineItems) && item.lineItems.length > 0
        ? item.lineItems.map(
            (li) => `• ${li.label}: ${li.qty} × ${formatINR(li.rate)} = ${formatINR(li.amount)}`
          )
        : [`• ${item.title}: ${formatINR(total)}`];

    const discVal = Number(item.discountValue) || 0;
    const discLine =
      discVal > 0
        ? `Discount (${item.discountType === 'percent' ? `${discVal}%` : 'Flat'}): ${
            item.discountType === 'percent' ? `${discVal}%` : formatINR(discVal)
          }`
        : '';

    const taxLine = item.gstEnabled
      ? `Tax: CGST ${Number(item.cgstRate) || 0}% + SGST ${Number(item.sgstRate) || 0}%`
      : '';

    return [
      `BILL RECEIPT — ${ghName}`,
      tpl?.tagline || '',
      `Receipt No: ${rcpCode} | Date: ${item.bookingDate || new Date().toISOString().slice(0, 10)}`,
      tpl?.gstin || resolvedGuestHouseInfo?.gstin
        ? `GSTIN: ${tpl?.gstin || resolvedGuestHouseInfo?.gstin}${
            tpl?.sacCode ? ` | SAC: ${tpl.sacCode}` : ''
          }`
        : '',
      '----------------------------------------',
      `Booking: ${item.title}`,
      catsList ? `Categories: ${catsList}` : '',
      wed?.title ? `Wedding: ${wed.title}` : '',
      `Client/Vendor: ${item.vendorName || '-'} | Phone: ${item.phone || '-'}`,
      `Venue/Hall: ${item.spaceName || item.location || ghName}`,
      `Date: ${item.serviceDate || 'TBD'} | Slot: ${item.slot || 'Full Day'}${
        item.expectedPax > 0 ? ` | Pax: ${item.expectedPax}` : ''
      }`,
      '----------------------------------------',
      'CHARGES & ITEMS:',
      ...itemsArr,
      discLine,
      taxLine,
      '----------------------------------------',
      `Total Amount: ${formatINR(total)}`,
      `Advance Paid (${item.paymentMode || 'UPI'}): ${formatINR(paid)}`,
      `Balance Due: ${formatINR(due)}`,
      `Status: ${item.status || 'Confirmed'}`,
      tpl?.upiId ? `UPI ID: ${tpl.upiId}` : '',
      tpl?.bankDetails ? `Bank: ${tpl.bankDetails}` : '',
      tpl?.terms ? `Terms:\n${tpl.terms}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  };

  const shareBillWhatsApp = (item) => {
    const text = formatBillOutput(item, activeTemplate);
    const cleanPhone = String(item.phone || '').replace(/\D/g, '');
    const waUrl =
      cleanPhone.length >= 10
        ? `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${encodeURIComponent(
            text
          )}`
        : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // SCOPED VIEW FOR A SINGLE SELECTED ACTIVE WEDDING
  if (selectedWedding) {
    const wedBookings = bookings.filter(
      (b) => b.weddingId === selectedWedding.id && matchesSearch(selectedWedding, b)
    );
    const wedEvents = events.filter(
      (e) =>
        e.weddingId === selectedWedding.id &&
        (!searchQuery.trim() ||
          [e.name, e.date, e.time, e.venue, e.dressCode, e.notes]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase()))
    );
    const wedMenu = menu.filter(
      (m) =>
        m.weddingId === selectedWedding.id &&
        (!searchQuery.trim() ||
          [m.dishName, m.event, m.course, m.dietaryTag, m.status, m.notes]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase()))
    );

    const wTotal = wedBookings.reduce((s, b) => s + (Number(b.totalAmount) || 0), 0);
    const wPaid = wedBookings.reduce((s, b) => s + (Number(b.advancePaid) || 0), 0);
    const wDue = wedBookings.reduce(
      (s, b) => s + Math.max(0, (Number(b.totalAmount) || 0) - (Number(b.advancePaid) || 0)),
      0
    );

    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => {
                setSelectedWeddingId('');
                setDetailTab('dashboard');
              }}
              className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold shrink-0"
            >
              ← Back to Dashboard
            </button>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 truncate">
                {selectedWedding.title}
              </h2>
              <p className="text-xs text-stone-500 truncate">
                {selectedWedding.coupleNames || 'Wedding'}
                {selectedWedding.date ? ` • ${selectedWedding.date}` : ''}
                {selectedWedding.venue ? ` • ${selectedWedding.venue}` : ''}
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all fields..."
              className="w-full pl-8 pr-3 py-2 border border-stone-300 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Scoped Tabs for Selected Wedding Only */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'dashboard', label: 'Wedding Dashboard' },
            { key: 'events', label: `Events (${wedEvents.length})` },
            { key: 'menu', label: `Menu (${wedMenu.length})` },
            { key: 'bookings', label: `Booking Details & Bill (${wedBookings.length})` },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setDetailTab(t.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                detailTab === t.key
                  ? 'bg-[#7A1C24] text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {detailTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-2xl border border-stone-200 p-4">
                <div className="text-xs font-semibold text-stone-500">Wedding Bookings</div>
                <div className="text-2xl font-bold text-stone-900 mt-1">{wedBookings.length}</div>
              </div>
              <div className="bg-white rounded-2xl border border-stone-200 p-4">
                <div className="text-xs font-semibold text-stone-500">Booking Value</div>
                <div className="text-2xl font-bold text-stone-900 mt-1">{formatINR(wTotal)}</div>
              </div>
              <div className="bg-white rounded-2xl border border-stone-200 p-4">
                <div className="text-xs font-semibold text-stone-500">Paid / Received</div>
                <div className="text-2xl font-bold text-emerald-700 mt-1">{formatINR(wPaid)}</div>
              </div>
              <div className="bg-white rounded-2xl border border-stone-200 p-4">
                <div className="text-xs font-semibold text-stone-500">Balance Due</div>
                <div className="text-2xl font-bold text-amber-700 mt-1">{formatINR(wDue)}</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-2 text-xs">
              <h3 className="font-bold text-sm text-stone-900">Wedding Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
                <div><strong>Title:</strong> {selectedWedding.title}</div>
                <div><strong>Couple:</strong> {selectedWedding.coupleNames || '—'}</div>
                <div><strong>Date:</strong> {selectedWedding.date || '—'}</div>
                <div><strong>Venue / City:</strong> {selectedWedding.venue || '—'} {selectedWedding.city ? `(${selectedWedding.city})` : ''}</div>
                <div><strong>Events:</strong> {wedEvents.length}</div>
                <div><strong>Menu Dishes:</strong> {wedMenu.length}</div>
              </div>
            </div>
          </div>
        )}

        {detailTab === 'events' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3">
            <h3 className="font-bold text-sm text-stone-900">Wedding Events</h3>
            {wedEvents.length === 0 ? (
              <p className="text-xs text-stone-500 py-6 text-center">No events found for this wedding.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {wedEvents.map((ev) => (
                  <div key={ev.id} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                    <div className="font-bold text-stone-900">{ev.name}</div>
                    <div className="text-stone-600">
                      {ev.date || 'Date TBD'} {ev.time ? `• ${ev.time}` : ''} {ev.venue ? `• ${ev.venue}` : ''}
                    </div>
                    {ev.dressCode && <div className="text-stone-500">Dress Code: {ev.dressCode}</div>}
                    {ev.notes && <div className="text-stone-500">{ev.notes}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {detailTab === 'menu' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3">
            <h3 className="font-bold text-sm text-stone-900">Wedding Menu</h3>
            {wedMenu.length === 0 ? (
              <p className="text-xs text-stone-500 py-6 text-center">No menu dishes found for this wedding.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {wedMenu.map((dish) => (
                  <div key={dish.id} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-stone-900">{dish.dishName}</div>
                      <div className="text-stone-500">
                        {dish.event || 'Event'} • {dish.course || 'Course'} • {dish.dietaryTag || 'Veg'}
                      </div>
                      {dish.notes && <div className="text-stone-600 mt-0.5">{dish.notes}</div>}
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-[#7A1C24] font-bold text-[10px]">
                      {dish.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {detailTab === 'bookings' && (
          <div className="space-y-3">
            {wedBookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-xs text-stone-500">
                No bookings found for this wedding.
              </div>
            ) : (
              wedBookings.map((b) => {
                const due = Math.max(0, (Number(b.totalAmount) || 0) - (Number(b.advancePaid) || 0));
                const cats =
                  Array.isArray(b.categories) && b.categories.length > 0
                    ? b.categories.join(', ')
                    : b.category || '';
                return (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-sm text-stone-900">{b.title}</div>
                      {cats && <div className="text-[#7A1C24] font-semibold">{cats}</div>}
                      <div className="text-stone-600">
                        {b.vendorName ? `${b.vendorName} • ` : ''}
                        {b.phone ? `${b.phone} • ` : ''}
                        {b.spaceName || b.location || ''} • {b.serviceDate || 'TBD'} ({b.slot || 'Full Day'})
                      </div>
                      <div className="font-semibold text-stone-800 pt-0.5">
                        Total: {formatINR(b.totalAmount)} | Paid: {formatINR(b.advancePaid)} ({b.paymentMode || 'UPI'}) | Due:{' '}
                        <span className="text-amber-700 font-bold">{formatINR(due)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openPaymentUpdater(b)}
                        className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold"
                      >
                        Update Payment
                      </button>
                      <button
                        type="button"
                        onClick={() => setBillPreviewBooking(b)}
                        className="px-3 py-2 rounded-xl bg-[#7A1C24] hover:bg-[#5E141B] text-white font-bold"
                      >
                        View Bill
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    );
  }

  // DEFAULT GUEST HOUSE DASHBOARD VIEW
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Guest House Bookings Dashboard</h2>
          <p className="text-xs text-stone-500">
            Search across all fields, update payment details, and open any active wedding.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search weddings, bookings, phone, hall, status..."
            className="w-full pl-9 pr-3 py-2.5 border border-stone-300 bg-white rounded-xl text-xs shadow-2xs"
          />
        </div>
      </div>

      {/* Weddings & Bookings KPIs ONLY */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
          <div className="text-xs font-semibold text-stone-500">ACTIVE WEDDINGS</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">
            {filteredActiveWeddings.length}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
          <div className="text-xs font-semibold text-stone-500">TOTAL BOOKINGS</div>
          <div className="text-2xl font-bold text-[#7A1C24] mt-1">{filteredBookings.length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
          <div className="text-xs font-semibold text-stone-500">BOOKING VALUE &amp; PAID</div>
          <div className="text-lg font-bold text-stone-900 mt-1">
            {formatINR(totalBookingValue)}
          </div>
          <div className="text-xs font-semibold text-emerald-700 mt-0.5">
            Paid: {formatINR(totalPaid)}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
          <div className="text-xs font-semibold text-stone-500">BALANCE DUE</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{formatINR(totalDue)}</div>
        </div>
      </div>

      {/* Active Weddings List */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-stone-900">
            Active Weddings ({filteredActiveWeddings.length})
          </h3>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-[#7A1C24] hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>

        {filteredActiveWeddings.length === 0 ? (
          <p className="text-xs text-stone-500 py-6 text-center">
            No active weddings match your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredActiveWeddings.map((w) => {
              const wCount = bookings.filter((b) => b.weddingId === w.id).length;
              return (
                <div
                  key={w.id}
                  onClick={() => {
                    setSelectedWeddingId(w.id);
                    setDetailTab('dashboard');
                  }}
                  className="p-4 rounded-xl border border-stone-200 hover:border-[#7A1C24] bg-stone-50/50 hover:bg-amber-50/30 cursor-pointer transition flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-stone-900 truncate">{w.title}</div>
                    <div className="text-xs text-stone-600 truncate">
                      {w.coupleNames || w.city || 'Active Wedding'}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {w.date || 'Date TBD'} • {wCount} {wCount === 1 ? 'Booking' : 'Bookings'}
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg bg-[#7A1C24] text-white text-xs font-semibold shrink-0">
                    Open
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bookings & Payment Updates List */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-stone-900">
          Bookings &amp; Payment Details ({filteredBookings.length})
        </h3>

        {filteredBookings.length === 0 ? (
          <p className="text-xs text-stone-500 py-6 text-center">No bookings found.</p>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredBookings.map((b) => {
              const wed = weddingMap[b.weddingId];
              const due = Math.max(0, (Number(b.totalAmount) || 0) - (Number(b.advancePaid) || 0));
              const cats =
                Array.isArray(b.categories) && b.categories.length > 0
                  ? b.categories.join(', ')
                  : b.category || '';
              return (
                <div
                  key={b.id}
                  className="py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-stone-900">{b.title}</span>
                      {wed?.title && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-[#7A1C24] font-bold text-[10px]">
                          {wed.title}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold text-[10px]">
                        {b.status || 'Confirmed'}
                      </span>
                    </div>
                    {cats && <div className="text-stone-600 font-medium">{cats}</div>}
                    <div className="text-stone-500">
                      {b.vendorName ? `${b.vendorName} • ` : ''}
                      {b.phone ? `${b.phone} • ` : ''}
                      {b.spaceName || b.location || ''} • {b.serviceDate || 'TBD'} ({b.slot || 'Full Day'})
                    </div>
                    <div className="font-semibold text-stone-800">
                      Total: {formatINR(b.totalAmount)} | Paid:{' '}
                      <span className="text-emerald-700">{formatINR(b.advancePaid)}</span> (
                      {b.paymentMode || 'UPI'}) | Due:{' '}
                      <span className="text-amber-700 font-bold">{formatINR(due)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openPaymentUpdater(b)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold"
                    >
                      Update Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillPreviewBooking(b)}
                      className="px-3 py-1.5 rounded-lg bg-[#7A1C24] hover:bg-[#5E141B] text-white font-bold"
                    >
                      Bill
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment Details Update Modal */}
      <Modal
        isOpen={Boolean(paymentBooking)}
        onClose={() => setPaymentModalBookingId(null)}
        title="Update Payment Details"
        subtitle={paymentBooking?.title}
      >
        {paymentBooking && (
          <form onSubmit={handleAddInstallmentToBooking} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex flex-wrap justify-between gap-2">
              <span><strong>Total:</strong> {formatINR(paymentBooking.totalAmount)}</span>
              <span className="text-emerald-700"><strong>Paid:</strong> {formatINR(paymentBooking.advancePaid)}</span>
              <span className="text-amber-700">
                <strong>Due:</strong>{' '}
                {formatINR(
                  Math.max(
                    0,
                    (Number(paymentBooking.totalAmount) || 0) -
                      (Number(paymentBooking.advancePaid) || 0)
                  )
                )}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Total Paid / Advance Amount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={manualAdvance}
                  onChange={(e) => setManualAdvance(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Payment Status</label>
                <select
                  value={manualStatus}
                  onChange={(e) => setManualStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white"
                >
                  {BOOKING_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2.5">
              <div className="font-bold text-stone-800">Record New Payment Installment</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                    Installment Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={instAmount}
                    onChange={(e) => setInstAmount(e.target.value)}
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 border border-stone-300 bg-white rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                    Payment Mode
                  </label>
                  <select
                    value={instMode}
                    onChange={(e) => setInstMode(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-stone-300 bg-white rounded-lg text-xs"
                  >
                    {PAYMENT_MODES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={instDate}
                    onChange={(e) => setInstDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-stone-300 bg-white rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                    UTR / Receipt Ref
                  </label>
                  <input
                    type="text"
                    value={instRef}
                    onChange={(e) => setInstRef(e.target.value)}
                    placeholder="Optional reference"
                    className="w-full px-2.5 py-1.5 border border-stone-300 bg-white rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {(paymentBooking.installments || []).length > 0 && (
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl bg-white">
                {paymentBooking.installments.map((inst) => (
                  <div key={inst.id} className="px-3 py-2 flex items-center justify-between">
                    <span>
                      {inst.date} • {inst.mode} {inst.ref ? `(${inst.ref})` : ''}
                    </span>
                    <span className="font-bold text-emerald-700">{formatINR(inst.amount)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={handleSaveManualPaymentOnly}
                className="px-3.5 py-2 rounded-lg bg-stone-800 text-white font-semibold"
              >
                Save Paid &amp; Status
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold"
              >
                Add Installment &amp; Save
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Bill Preview Modal */}
      <Modal
        isOpen={Boolean(billPreviewBooking)}
        onClose={() => setBillPreviewBooking(null)}
        title="Booking Bill"
        subtitle={billPreviewBooking?.title}
        maxWidth="max-w-xl"
      >
        {billPreviewBooking && activeTemplate && (
          <div className="space-y-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
              <select
                value={selectedTplId}
                onChange={(e) => setSelectedTplId(e.target.value)}
                className="px-2.5 py-1.5 border border-stone-300 bg-white rounded-lg text-xs font-semibold"
              >
                {(billTemplates.length > 0 ? billTemplates : DEFAULT_BILL_TEMPLATES).map(
                  (tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name}
                    </option>
                  )
                )}
              </select>
              <button
                type="button"
                onClick={() => shareBillWhatsApp(billPreviewBooking)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold inline-flex items-center gap-1"
              >
                <Share2 size={13} /> Share on WhatsApp
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-white border border-stone-300 whitespace-pre-wrap font-mono text-xs text-stone-800">
              {formatBillOutput(billPreviewBooking, activeTemplate)}
            </pre>
          </div>
        )}
      </Modal>
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
