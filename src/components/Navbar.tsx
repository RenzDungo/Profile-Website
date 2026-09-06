import { Container, Navbar } from "react-bootstrap";
import { useState } from "react";

interface NavigationBarProps {
  active: number;
  onSelect: (index: number) => void;
}

const PAGES = [
  { label: "HOME", pin: "1" },
  { label: "PROJECTS", pin: "2" },
  { label: "CONTACT", pin: "3" },
];

// The board's edge header: silkscreen title block with a power LED on the
// left, and a pin-header connector on the right whose pads act as the
// navigation. The soldered (gold) pad is the page you are on.
export default function Navigationbar({ active, onSelect }: NavigationBarProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar className="pcb-nav" expand="sm" expanded={expanded} onToggle={(next) => setExpanded(Boolean(next))}>
      <Container fluid className="px-3 px-md-4">
        <Navbar.Brand className="pcb-nav__brand" href="#home" onClick={(e) => { e.preventDefault(); onSelect(0); setExpanded(false); }}>
          <span className="pcb-led pcb-led--pwr" aria-hidden="true" />
          <span className="pcb-nav__title">RENZ DUNGO</span>
          <span className="pcb-nav__rev">REV 2.0</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="pcb-nav-header" className="pcb-nav__toggle">
          <span className="pcb-nav__toggle-pins" aria-hidden="true" />
          <span className="pcb-nav__toggle-label">MENU</span>
        </Navbar.Toggle>
        <Navbar.Collapse id="pcb-nav-header">
          <nav className="pcb-header ms-sm-auto" aria-label="Site pages">
            <span className="pcb-header__ref" aria-hidden="true">J1</span>
            <ul className="pcb-header__pins">
              {PAGES.map((page, i) => (
                <li key={page.label}>
                  <button
                    type="button"
                    className={`pcb-header__pad${active === i ? " is-active" : ""}`}
                    aria-current={active === i ? "page" : undefined}
                    onClick={() => {
                      onSelect(i);
                      setExpanded(false);
                    }}
                  >
                    <span className="pcb-header__pin" aria-hidden="true">{page.pin}</span>
                    <span className="pcb-header__label">{page.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
