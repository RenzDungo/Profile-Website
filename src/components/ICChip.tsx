import type { ReactNode } from "react";

export type ICPackage = "dip" | "qfp" | "sot";

interface ICChipProps {
  // Reference designator printed on the silkscreen, e.g. "U1" or "J3".
  designator: string;
  // Laser-etched part number on the package top, e.g. "RD-HOME-01".
  part?: string;
  // DIP = pins on two sides, QFP = pins on all four, SOT = tiny 3-pin package.
  pkg?: ICPackage;
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  children: ReactNode;
}

// A card rendered as an integrated circuit: black epoxy body, metallic pin
// leads that hang outside the package, a pin-1 notch and dot, and a
// silkscreen header. Interactive ICs get a status LED that lights on hover
// so it is obvious which chips open something.
export default function ICChip({
  designator,
  part,
  pkg = "dip",
  href,
  onClick,
  ariaLabel,
  className,
  ref,
  children,
}: ICChipProps) {
  const interactive = Boolean(href || onClick);
  const classes = ["ic", `ic--${pkg}`, interactive ? "ic--interactive" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={classes}
      onClick={href ? undefined : onClick}
      role={onClick && !href ? "button" : undefined}
      tabIndex={onClick && !href ? 0 : undefined}
      onKeyDown={
        onClick && !href
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <span className="ic__pins ic__pins--left" />
      <span className="ic__pins ic__pins--right" />
      {pkg === "qfp" && (
        <>
          <span className="ic__pins ic__pins--top" />
          <span className="ic__pins ic__pins--bottom" />
        </>
      )}
      <div className="ic__body">
        <span className="ic__notch" />
        <span className="ic__dot" />
        <div className="ic__marking">
          <span className="ic__ref">{designator}</span>
          {part && <span className="ic__part">{part}</span>}
          {interactive && (
            <span className="ic__status">
              <span className="ic__led" />
              <span className="ic__status-text">{href ? "OPEN" : "RUN"}</span>
            </span>
          )}
        </div>
        <div className="ic__content">{children}</div>
      </div>
      {href && (
        <a
          className="ic__link"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel ?? `Open ${designator}`}
        />
      )}
    </div>
  );
}
