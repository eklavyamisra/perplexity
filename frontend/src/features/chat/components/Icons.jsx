const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const PlusIcon = () => <svg {...base}><path d="M12 5v14M5 12h14" /></svg>;
export const ArrowUpIcon = () => <svg {...base}><path d="M12 19V5M6 11l6-6 6 6" /></svg>;
export const TrashIcon = () => <svg {...base}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>;
export const MenuIcon = () => <svg {...base}><path d="M4 8h16M4 16h10" /></svg>;
export const CloseIcon = () => <svg {...base}><path d="M6 6l12 12M18 6L6 18" /></svg>;
export const LogoutIcon = () => <svg {...base}><path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11" /></svg>;
export const CopyIcon = () => <svg {...base}><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></svg>;
export const CheckIcon = () => <svg {...base}><path d="M5 12l5 5 9-10" /></svg>;
export const GlobeIcon = () => <svg {...base}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" /></svg>;
export const SparkIcon = () => <svg {...base}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" /></svg>;
export const ArrowUpRightIcon = () => <svg {...base}><path d="M7 17L17 7M8 7h9v9" /></svg>;
