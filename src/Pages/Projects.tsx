import { Container, Row, Col, Card,} from "react-bootstrap";

interface SectionProps {
  innerRef: React.RefObject<HTMLDivElement>;
}

export default function Projectpage({ innerRef }: SectionProps) {
  return (
    <Container ref={innerRef}>
      <Row>
        <Col className=" d-flex align-items-center justify-content-center">
          <h1>Projects</h1>
        </Col>
      </Row>
      <Row>
        <Col  className=" d-flex align-items-center justify-content-center pt-5">
          <h3>Software</h3>
        </Col>
      </Row>
      <Row className="pt-5 g-4" >
        <Col md={4} className=" d-flex align-items-center justify-content-center pt-5">
          <Card bg="dark" text="white" className="h-100 w-100">
            <Card.Header>
              <Card.Title>Magic the Gathering Assistant</Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Text>Magic the Gathering Web Application coded in Typescript with a Vite React framework for the frontend. Uses Websocket API in order
                to fetch data from the Magic the Gathering API. The application is designed to assist users in assisting with real time life and card tracking. Also included a feature to see stats of the current lobby.
                </Card.Text>
                <Card.Text>
                    <a href="https://mtg.balloonhubgaming.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    >mtg.balloonhubgaming.com</a>
                </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className=" d-flex align-items-center justify-content-center pt-5">
          <Card bg="dark" text="white" className="h-100 w-100">
            <Card.Header>
              <Card.Title>Job Application Tracker</Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Text>
                    A Web Application coded in Typescript and a Vite React framework for the frontend. The application is designed to assist users in tracking their job applications.
                    It includes an automatic fill for Applications by providing a link and job Description text to a server which allows it to use OpenAI to parse through the text and fill out the application for the user.
                </Card.Text>
                <Card.Text>
                    <a href="https://jobs.balloonhubgaming.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    >jobs.balloonhubgaming.com</a>
                </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className=" d-flex align-items-center justify-content-center pt-5">
          <Card bg="dark" text="white" className="h-100 w-100">
            <Card.Header>
              <Card.Title>OpenCV Card Detection</Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Text>
                    A Python script that uses OpenCV to detect cards through an image and identify them using scryfall's API by comparing them to a database of cards.
                </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
