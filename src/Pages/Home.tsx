import { Container, Row, Col } from "react-bootstrap";
import { useRef } from "react";
import profile from "../assets/Profile3.png";
import js from "../assets/javascript.png";
import cpp from "../assets/Cplusplus.png";
import python from "../assets/python.jpg";
import asm from "../assets/asm.jpg";
import PCBTraces from "../components/PCBTraces";
import ICChip from "../components/ICChip";

const LANGUAGES = [
  { src: js, label: "JavaScript", short: "JS" },
  { src: cpp, label: "C++", short: "C++" },
  { src: python, label: "Python", short: "PY" },
  { src: asm, label: "Assembly", short: "ASM" },
];

const SKILLS = ["Troubleshooting", "Designing", "Attention to Detail", "Testing"];

export default function Home() {
  const boardRef = useRef<HTMLDivElement>(null!);
  const profileRef = useRef<HTMLDivElement>(null!);
  const introRef = useRef<HTMLDivElement>(null!);
  const languagesRef = useRef<HTMLDivElement>(null!);
  const aboutRef = useRef<HTMLDivElement>(null!);

  return (
    <Container fluid className="px-0">
      <header className="pcb-titleblock">
        <h1 className="pcb-title">Home</h1>
        <p className="pcb-subtitle">Computer Engineer · Software Developer · Board-level tinkerer</p>
      </header>

      <div className="pcb-region" ref={boardRef}>
        <span className="pcb-region__label">SEC A · CORE</span>
        <PCBTraces
          containerRef={boardRef}
          links={[
            { from: profileRef, to: introRef },
            { from: introRef, to: languagesRef },
            { from: languagesRef, to: aboutRef },
          ]}
        />

        <Row className="g-4 align-items-stretch">
          <Col xs={12} md={5} lg={4}>
            <ICChip ref={profileRef} designator="U1" part="IMG-SENSOR" className="ic--photo">
              <div className="ic__window">
                <img src={profile} alt="Portrait of Renz Dungo" />
              </div>
            </ICChip>
          </Col>
          <Col xs={12} md={7} lg={8}>
            <ICChip ref={introRef} designator="U2" part="MCU-CORE-2026" pkg="qfp">
              <div className="ic__hero">
                <h2 className="ic__title ic__title--lg">Circuits 2 Code</h2>
                <p className="ic__text ic__text--lg">
                  Hello, I'm Renz. I'm a Computer Engineer and Software Developer. I develop Arduino-based
                  circuits for my hobbies, from airsoft gear to tools for playing card games, and I design
                  websites with backend functionality and working databases.
                </p>
              </div>
            </ICChip>
          </Col>
        </Row>

        <Row className="g-4 pt-4 align-items-stretch">
          <Col xs={12} md={6}>
            <ICChip ref={languagesRef} designator="U3" part="LANG-BUS-x4">
              <h2 className="ic__title">Languages</h2>
              <ul className="pcb-padgrid">
                {LANGUAGES.map((lang) => (
                  <li key={lang.label} className="pcb-padgrid__item" title={lang.label}>
                    <span className="pcb-padgrid__pad">
                      <img src={lang.src} alt={lang.label} className="tech-icon" />
                    </span>
                    <span className="pcb-padgrid__label">{lang.short}</span>
                  </li>
                ))}
              </ul>
            </ICChip>
          </Col>
          <Col xs={12} md={6}>
            <ICChip ref={aboutRef} designator="U4" part="SKILL-SET">
              <h2 className="ic__title">About Me</h2>
              <p className="ic__text">
                I take a circuit from idea to working board: designing it, building it, testing it, and
                troubleshooting it until it meets quality standards. I bring attention to detail to every step and am
                comfortable on the bench with the standard electronic test equipment.
              </p>
              <ul className="pcb-skills" aria-label="Skills">
                {SKILLS.map((skill) => (
                  <li key={skill} className="pcb-skills__item">
                    {skill}
                  </li>
                ))}
              </ul>
              <p className="pcb-skills__tools">
                <span className="pcb-skills__tools-label">TEST GEAR</span>
                Multimeter · Oscilloscope · Waveform Generator
              </p>
            </ICChip>
          </Col>
        </Row>
      </div>
    </Container>
  );
}
