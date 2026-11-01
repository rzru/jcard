import type { ReactNode } from 'react';

type IconProps = {
  readonly className?: string;
};

function IconFrame({ className, children }: IconProps & { readonly children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function PrintIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M6 9V3h12v6" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 14h12v7H6z" />
    </IconFrame>
  );
}

export function UploadIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M12 16V3" />
      <path d="m7 8 5-5 5 5" />
      <path d="M4 15v5h16v-5" />
    </IconFrame>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M12 5v14M5 12h14" />
    </IconFrame>
  );
}

export function ArrowIcon({
  direction,
  ...props
}: IconProps & { readonly direction: 'up' | 'down' }) {
  return (
    <IconFrame {...props}>
      <path d={direction === 'up' ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6'} />
    </IconFrame>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M4 7h16M9 3h6l1 4H8l1-4Z" />
      <path d="m9 11 .5 7m5.5-7-.5 7M6 7l1 14h10l1-14" />
    </IconFrame>
  );
}
