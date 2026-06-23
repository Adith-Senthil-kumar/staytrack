import Svg, { Path, Circle, Rect } from 'react-native-svg';


type IconProps = { size?: number; color?: string; className?: string };
const base = (size: number) => ({ width: size, height: size, viewBox: '0 0 24 24' });

export const RoomsIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 21h18" /><Path d="M5 21V7l7-4 7 4v14" />
    <Path d="M9 9h2M9 13h2M9 17h2M14 9h1M14 13h1M14 17h1" />
  </Svg>
);
export const TenantsIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><Circle cx={9} cy={7} r={4} /><Path d="M22 21v-2a4 4 0 0 0-3-3.87" />
  </Svg>
);
export const RentIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={2} y={5} width={20} height={14} rx={2} /><Circle cx={12} cy={12} r={2.5} /><Path d="M6 9v6M18 9v6" />
  </Svg>
);
export const ExpensesIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2v20" /><Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </Svg>
);
export const MenuIcon = ({ size = 18, color, className }: IconProps) => (
  <Svg {...base(size)} className={className} fill="none" stroke={color ?? 'currentColor'} strokeWidth={2} strokeLinecap="round"><Path d="M3 12h18M3 6h18M3 18h18" /></Svg>
);
export const SearchIcon = ({ size = 16, color = '#999' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><Circle cx={11} cy={11} r={7} /><Path d="m21 21-4.3-4.3" /></Svg>
);
export const SunIcon = ({ size = 17, color, className }: IconProps) => (
  <Svg {...base(size)} className={className} fill="none" stroke={color ?? 'currentColor'} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx={12} cy={12} r={4} /><Path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </Svg>
);
export const MoonIcon = ({ size = 16, color, className }: IconProps) => (
  <Svg {...base(size)} className={className} fill="none" stroke={color ?? 'currentColor'} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></Svg>
);
export const PlusIcon = ({ size = 16, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round"><Path d="M12 5v14M5 12h14" /></Svg>
);
export const LogoutIcon = ({ size = 14, color = '#9CBBAF' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><Path d="m16 17 5-5-5-5M21 12H9" />
  </Svg>
);
export const ArrowRightIcon = ({ size = 16, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><Path d="M10 17l5-5-5-5M15 12H3" />
  </Svg>
);
export const StaffIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><Circle cx={9} cy={7} r={4} /><Path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);
export const MaintenanceIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </Svg>
);
export const ShortStayIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" />
  </Svg>
);
export const CheckIcon = ({ size = 14, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 6 9 17l-5-5" />
  </Svg>
);
export const PaperPlaneIcon = ({ size = 15, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <Path d="m22 2-7 20-4-9-9-4z" /><Path d="M22 2 11 13" />
  </Svg>
);
export const PhoneIcon = ({ size = 16, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);
export const MessageIcon = ({ size = 16, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Svg>
);
export const FileTextIcon = ({ size = 16, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </Svg>
);
export const PencilIcon = ({ size = 16, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 20h9" /><Path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </Svg>
);
export const TrashIcon = ({ size = 16, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <Path d="M10 11v6M14 11v6" />
  </Svg>
);
export const ThumbsUpIcon = ({ size = 16, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
  </Svg>
);
export const ThumbsDownIcon = ({ size = 16, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 14V2M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
  </Svg>
);
export const PlayIcon = ({ size = 16, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <Path d="m5 3 14 9-14 9V3z" />
  </Svg>
);
export const ImageIcon = ({ size = 16, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={3} y={3} width={18} height={18} rx={2} />
    <Circle cx={9} cy={9} r={2} />
    <Path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21" />
  </Svg>
);
export const WrenchIcon = ({ size = 16, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </Svg>
);
export const AlertTriangleIcon = ({ size = 16, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <Path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <Path d="M12 9v4M12 17h.01" />
  </Svg>
);
export const XIcon = ({ size = 16, color = '#fff' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round">
    <Path d="M18 6 6 18M6 6l12 12" />
  </Svg>
);
