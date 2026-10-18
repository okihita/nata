import * as React from "react";

interface AvatarProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export function AvatarMaya({ size = 40, className = "", ...props }: AvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 rounded-full ${className}`}
      {...props}
    >
      <rect width="64" height="64" rx="32" fill="#047857" />
      <circle cx="32" cy="27" r="14" fill="#FDE68A" />
      <path
        d="M18 25C18 16 24 13 32 13C40 13 46 16 46 25C46 28 44 33 42 34C40 31 38 27 38 27H26C26 27 24 31 22 34C20 33 18 28 18 25Z"
        fill="#1F2937"
      />
      <circle cx="28" cy="27" r="1.75" fill="#1F2937" />
      <circle cx="36" cy="27" r="1.75" fill="#1F2937" />
      <path
        d="M29 32C30.5 33.5 33.5 33.5 35 32"
        stroke="#D97706"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M18 64C18 52 24 45 32 45C40 45 46 52 46 64H18Z"
        fill="#065F46"
      />
      <path
        d="M26 45L32 55L38 45H26Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function AvatarDimas({ size = 40, className = "", ...props }: AvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 rounded-full ${className}`}
      {...props}
    >
      <rect width="64" height="64" rx="32" fill="#1D4ED8" />
      <circle cx="32" cy="27" r="14" fill="#FCD34D" />
      <path
        d="M18 23C19 15 25 12 32 12C39 12 45 15 46 23C46 24 40 21 32 21C24 21 18 24 18 23Z"
        fill="#111827"
      />
      {/* Glasses */}
      <rect x="23" y="24" width="7" height="6" rx="1.5" fill="none" stroke="#1F2937" strokeWidth="1.5" />
      <rect x="34" y="24" width="7" height="6" rx="1.5" fill="none" stroke="#1F2937" strokeWidth="1.5" />
      <line x1="30" y1="27" x2="34" y2="27" stroke="#1F2937" strokeWidth="1.5" />
      <circle cx="26.5" cy="27" r="1.25" fill="#1F2937" />
      <circle cx="37.5" cy="27" r="1.25" fill="#1F2937" />
      <path
        d="M29 33C30.5 34.5 33.5 34.5 35 33"
        stroke="#B45309"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 64C16 51 23 44 32 44C41 44 48 51 48 64H16Z"
        fill="#1E40AF"
      />
      <path
        d="M28 44L32 50L36 44H28Z"
        fill="#E0E7FF"
      />
    </svg>
  );
}

export function AvatarArief({ size = 40, className = "", ...props }: AvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 rounded-full ${className}`}
      {...props}
    >
      <rect width="64" height="64" rx="32" fill="#6D28D9" />
      <circle cx="32" cy="27" r="14" fill="#FDE68A" />
      {/* Hair with grey temple touches */}
      <path
        d="M18 24C19 16 25 13 32 13C39 13 45 16 46 24C46 25 43 21 32 21C21 21 18 25 18 24Z"
        fill="#374151"
      />
      <path d="M18 23C19 25 20 28 20 29" stroke="#9CA3AF" strokeWidth="1.5" />
      <path d="M46 23C45 25 44 28 44 29" stroke="#9CA3AF" strokeWidth="1.5" />
      <circle cx="28" cy="27" r="1.5" fill="#1F2937" />
      <circle cx="36" cy="27" r="1.5" fill="#1F2937" />
      {/* Friendly mature mustache */}
      <path
        d="M27 32C29 33 31 31.5 32 32C33 31.5 35 33 37 32"
        stroke="#4B5563"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M29 35C30.5 36 33.5 36 35 35"
        stroke="#B45309"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      {/* Suit jacket */}
      <path
        d="M16 64C16 50 23 43 32 43C41 43 48 50 48 64H16Z"
        fill="#4C1D95"
      />
      <path
        d="M29 43L32 54L35 43H29Z"
        fill="#EDE9FE"
      />
      <path
        d="M31 49L32 57L33 49H31Z"
        fill="#F59E0B"
      />
    </svg>
  );
}

export function AvatarNata({ size = 40, className = "", ...props }: AvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 rounded-full ${className}`}
      {...props}
    >
      <rect width="64" height="64" rx="32" fill="#B45309" />
      <circle cx="32" cy="27" r="14" fill="#FDE68A" />
      {/* Modern hair */}
      <path
        d="M18 24C19 14 26 11 34 11C42 11 46 15 46 22C46 23 41 20 32 20C23 20 18 24 18 24Z"
        fill="#111827"
      />
      <circle cx="28" cy="27" r="1.5" fill="#111827" />
      <circle cx="36" cy="27" r="1.5" fill="#111827" />
      <path
        d="M29 32C30.5 34 33.5 34 35 32"
        stroke="#B45309"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      {/* Clean modern blazer */}
      <path
        d="M16 64C16 50 23 43 32 43C41 43 48 50 48 64H16Z"
        fill="#78350F"
      />
      <path
        d="M26 43L32 55L38 43H26Z"
        fill="#FEF3C7"
      />
    </svg>
  );
}
