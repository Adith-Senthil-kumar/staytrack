import Svg, { Path, Circle, Rect } from 'react-native-svg';

type IconProps = { size?: number; color?: string };
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
export const MenuIcon = ({ size = 18, color = '#000' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><Path d="M3 12h18M3 6h18M3 18h18" /></Svg>
);
export const SearchIcon = ({ size = 16, color = '#999' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><Circle cx={11} cy={11} r={7} /><Path d="m21 21-4.3-4.3" /></Svg>
);
export const SunIcon = ({ size = 17, color = '#000' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx={12} cy={12} r={4} /><Path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </Svg>
);
export const MoonIcon = ({ size = 16, color = '#000' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></Svg>
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
