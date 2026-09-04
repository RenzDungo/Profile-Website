import { Container, Row, Col, Card, Image } from "react-bootstrap";
import { useRef } from "react";
import profile from "../assets/Profile3.png";
import js from "../assets/javascript.png";
import cpp from "../assets/Cplusplus.png";
import python from "../assets/python.jpg";
import asm from "../assets/asm.jpg";
import PCBTraces from "../components/PCBTraces";
import PCBBackground from "../components/PCBBackground";
import { boardDecorPattern } from "../components/pcbPattern";

export default function Home() {
  const boardRef = useRef<HTMLDivElement>(null!);
  const profileRef = useRef<HTMLDivElement>(null!);
  const introRef = useRef<HTMLDivElement>(null!);
  const languagesRef = useRef<HTMLDivElement>(null!);
  const aboutRef = useRef<HTMLDivElement>(null!);

  return (
    <Container fluid>
      <div className="pcb-board" ref={boardRef}>
        <PCBBackground pattern={boardDecorPattern} />
        <PCBTraces
          containerRef={boardRef}
          links={[
            { from: profileRef, to: introRef },
            { from: introRef, to: languagesRef },
            { from: languagesRef, to: aboutRef },
          ]}
        />

        <Row className="g-4 align-items-stretch">
          <Col md={5} ref={profileRef}>
            <Card className="ic-chip h-100">
              <span className="ic-chip-dot" />
              <Card.Img src={profile} style={{ objectFit: "cover", maxHeight: "420px" }} />
            </Card>
          </Col>
          <Col md={7} ref={introRef}>
            <Card className="ic-chip h-100">
              <span className="ic-chip-dot" />
              <Card.Body className="d-flex flex-column justify-content-center">
                <Card.Title style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f2b84b" }}>
                  Automating Life
                </Card.Title>
                <Card.Text style={{ fontSize: "clamp(1rem, 1.4vw, 1.25rem)" }}>
                  Hello I'm Renz and I'm a Computer Engineer and Software
                  Developer and I love making my life easier through automation,
                  whether that be through coding or creating hardware systems.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="pt-5">
          <Col ref={languagesRef}>
            <Card className="ic-chip">
              <span className="ic-chip-dot" />
              <Card.Body>
                <h2 className="text-center mb-4" style={{ color: "#f2b84b" }}>Languages</h2>
                <Row className="justify-content-center g-4">
                  <Col xs="auto">
                    <Image src={js} className="tech-icon" />
                  </Col>
                  <Col xs="auto">
                    <Image src={cpp} className="tech-icon" />
                  </Col>
                  <Col xs="auto">
                    <Image src={python} className="tech-icon" />
                  </Col>
                  <Col xs="auto">
                    <Image src={asm} className="tech-icon" />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="pt-5">
          <Col ref={aboutRef}>
            <Card className="ic-chip">
              <span className="ic-chip-dot" />
              <Card.Body>
                <h2 className="text-center mb-4" style={{ color: "#f2b84b" }}>About Me</h2>
                <p className="text-center mx-auto" style={{ maxWidth: "60%" }}>
                  As a kid, I was always fascinated with how computers worked and the intracies with what you could do with them.
                  This curiosity led me to
                  pursue a degree in Computer Engineering and eventually fostered a
                  love for tinkering and coding.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
}
