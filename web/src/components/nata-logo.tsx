import React from "react";

export function NataMark({ size = 24, className = "" }: { size?: number; className?: string }) {
  const small = size <= 20;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path
        d="M16 48V16L48 48V16"
        fill="none"
        stroke="currentColor"
        strokeWidth={small ? 4 : 2.5}
        strokeLinejoin="round"
      />
      <g fill="currentColor">
        {[16, 32, 48].flatMap((y) =>
          [16, 48].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r={small ? 6.5 : 5} />)
        )}
      </g>
      {!small && (
        <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".45">
          <circle cx="32" cy="16" r="3.5" />
          <circle cx="32" cy="48" r="3.5" />
        </g>
      )}
      <circle cx="32" cy="32" r={small ? 7.5 : 6} fill="#F59E0B" />
    </svg>
  );
}

export function NataLogo({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="grid size-8 place-items-center rounded-lg bg-foreground text-background">
        <NataMark size={size} className="text-background" />
      </span>
      <span className="font-sans text-base font-bold tracking-tight text-foreground">Nata</span>
    </span>
  );
}
