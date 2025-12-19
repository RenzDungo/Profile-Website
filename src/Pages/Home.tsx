import { Container, Row, Col, Card, Image } from "react-bootstrap";
import profile from "../assets/Profile3.png";
import js from "../assets/javascript.png";
import cpp from "../assets/Cplusplus.png";
import python from "../assets/python.jpg";
import asm from "../assets/asm.jpg";
interface SectionProps {
  innerRef: React.RefObject<HTMLDivElement>;
}

export default function Home({ innerRef }: SectionProps) {
  return (
    <Container ref={innerRef} fluid className="px-0" style={{ height: "100%" }}>
      <Row className="g-0 h-100">
        <Col xs={12} className="h-100">
          <Card className="border-0 w-100 h-100">
            <Card.Img
              src={profile}
              style={{ height: "100%", objectFit: "fill" }}
            />
            <Card.ImgOverlay className="d-flex  justify-content-start align-items-end pe-5 text-start text-white flex-column">
              <div className="overlay-content text-end">
                <Card.Title
                  className="pt-3"
                  style={{ fontSize: "clamp(1rem, 5vw, 3rem)" }}
                >
                  Automating Life
                </Card.Title>
                <div className="section-separator" />
                <Card.Text className="intro-text">
                  Hello I'm Renz and I'm a Computer Engineer and Software
                  Developer and I love making my life easier through automation,
                  whether that be through coding or creating hardware systems.
                </Card.Text>
              </div>
            </Card.ImgOverlay>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col className="pt-5 d-flex justify-content-center align-items-center">
          <div className=" d-flex justify-content-center align-items-center flex-column">
            <Row className="mb-1">
              <h2 className="mb-4">Languages</h2>
            </Row>
            <Row>
              <Col className="d-flex justify-content-center">
                <Image src={js} className="tech-icon" />
              </Col>
              <Col className="d-flex justify-content-center">
                <Image src={cpp} className="tech-icon" />
              </Col>
              <Col className="d-flex justify-content-center">
                <Image src={python} className="tech-icon" />
              </Col>
              <Col className="d-flex justify-content-center">
                <Image src={asm} className="tech-icon" />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row className="pt-5">
        <div className="d-flex justify-content-center align-items-center pt-5">
          <h2>About Me</h2>
        </div>
      </Row>
      <Row className="pt-5">
        <Col className="d-flex justify-content-center align-items-center">
          <p style={{ maxWidth: "60%", textAlign: "center" }}>
            As a kid, I was always fascinated with how computers worked and the intracies with what you could do with them.
            This curiosity led me to
            pursue a degree in Computer Engineering and eventually fostered a
            love for tinkering and coding.
          </p>
        </Col>
      </Row>
    </Container>
  );
}
