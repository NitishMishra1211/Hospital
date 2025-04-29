import type { SVGProps } from "react";

// Simple placeholder SVG logo
const PlaceholderLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill="currentColor"
    {...props}
  >
    <rect width="100" height="100" rx="15" fill="hsl(var(--sidebar-primary))" />
    <text
      x="50%"
      y="50%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize="50"
      fontWeight="bold"
      fill="hsl(var(--sidebar-primary-foreground))"
    >
      M
    </text>
  </svg>
);


export function Logo({ className }: { className?: string }) {
  return (
     <div className={className}>
        <PlaceholderLogo className="h-8 w-8" />
     </div>
  );
}
