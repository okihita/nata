import * as React from "react";
import Image from "next/image";

interface AgentAvatarProps {
  size?: number;
  className?: string;
  alt?: string;
}

export function AvatarMaya({ size = 40, className = "", alt = "Maya - Akuntan Pribadi" }: AgentAvatarProps) {
  return (
    <Image
      src="/avatars/finance.webp"
      width={size}
      height={size}
      alt={alt}
      className={`rounded-full shrink-0 object-cover bg-emerald-50 ${className}`}
    />
  );
}

export function AvatarDimas({ size = 40, className = "", alt = "Dimas - Konsultan Pajak" }: AgentAvatarProps) {
  return (
    <Image
      src="/avatars/strategy.webp"
      width={size}
      height={size}
      alt={alt}
      className={`rounded-full shrink-0 object-cover bg-blue-50 ${className}`}
    />
  );
}

export function AvatarArief({ size = 40, className = "", alt = "Arief - Spesialis Legal & Perizinan" }: AgentAvatarProps) {
  return (
    <Image
      src="/avatars/radar.webp"
      width={size}
      height={size}
      alt={alt}
      className={`rounded-full shrink-0 object-cover bg-purple-50 ${className}`}
    />
  );
}

export function AvatarNata({ size = 40, className = "", alt = "Nata - Chief of Staff" }: AgentAvatarProps) {
  return (
    <Image
      src="/avatars/chief.webp"
      width={size}
      height={size}
      alt={alt}
      className={`rounded-full shrink-0 object-cover bg-amber-50 ${className}`}
    />
  );
}

export function AvatarMarketing({ size = 40, className = "", alt = "Marketing & Sales" }: AgentAvatarProps) {
  return (
    <Image
      src="/avatars/marketing.webp"
      width={size}
      height={size}
      alt={alt}
      className={`rounded-full shrink-0 object-cover bg-rose-50 ${className}`}
    />
  );
}

export function AvatarCustomers({ size = 40, className = "", alt = "Customer Relations" }: AgentAvatarProps) {
  return (
    <Image
      src="/avatars/customers.webp"
      width={size}
      height={size}
      alt={alt}
      className={`rounded-full shrink-0 object-cover bg-indigo-50 ${className}`}
    />
  );
}

export function AvatarOps({ size = 40, className = "", alt = "Ops & Inventory" }: AgentAvatarProps) {
  return (
    <Image
      src="/avatars/ops.webp"
      width={size}
      height={size}
      alt={alt}
      className={`rounded-full shrink-0 object-cover bg-orange-50 ${className}`}
    />
  );
}

export function AvatarPeople({ size = 40, className = "", alt = "People & Payroll" }: AgentAvatarProps) {
  return (
    <Image
      src="/avatars/people.webp"
      width={size}
      height={size}
      alt={alt}
      className={`rounded-full shrink-0 object-cover bg-teal-50 ${className}`}
    />
  );
}
