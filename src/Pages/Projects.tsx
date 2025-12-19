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
            <h5>Click the Cards for more information</h5>
        </Col>
      </Row>
      <Row>
        <Col  className=" d-flex align-items-center justify-content-center pt-5">
          <h3>Software</h3>
        </Col>
      </Row>

      <Row className="pt-5 g-4">
        <Col md={4} className=" d-flex align-items-center justify-content-center pt-5">
          <Card bg="dark" text="white" className="h-100 w-100">
            <a href="https://mtg.balloonhubgaming.com" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none", color:"white"}} >
            <Card.Header>
              <Card.Title>Magic the Gathering Assistant</Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Text>Magic the Gathering Web Application coded in Typescript with a Vite React framework for the frontend. Uses Websocket API in order
                to fetch data from the Magic the Gathering API. The application is designed to assist users in assisting with real time life and card tracking. Also included a feature to see stats of the current lobby.
                </Card.Text>
            </Card.Body>
            </a>
          </Card>
        </Col>
        <Col md={4} className=" d-flex align-items-center justify-content-center pt-5">
          <Card bg="dark" text="white" className="h-100 w-100">
            <a href="https://jobs.balloonhubgaming.com" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none", color:"white"}}>
            <Card.Header>
              <Card.Title>Job Application Tracker</Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Text>
                    A Web Application coded in Typescript and a Vite React framework for the frontend. The application is designed to assist users in tracking their job applications.
                    It includes an automatic fill for Applications by providing a link and job Description text to a server which allows it to use OpenAI to parse through the text and fill out the application for the user.
                </Card.Text>
            </Card.Body>
            </a>
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

      <Row className="pt-5 g-4" >
        <Col md={4} className=" d-flex align-items-center justify-content-center pt-5">
          <Card bg="dark" text="white" className="h-100 w-100">
            <Card.Header>
                <Card.Title>Selenium Scraper</Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Text> Created a python automated script, that scrapes html elements concerning element tags which usually indicate an out of stock product. I use a discord webhook to push updates about certain products
                that I am interested in.
                </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="pt-5 g-4 d-flex flex-column  ">
        <Col  className=" d-flex align-items-center justify-content-center pt-5">
            <h3>Hardware</h3>     
        </Col>
        <Row className="pt-5 g-4 d-flex flex-row">
        <Col md={4} className=" d-flex align-items-center justify-content-center pt-5">
                <Card bg="dark" text="white" className="h-100 w-100">
            <Card.Header>
                <Card.Title>Arduino Glasses</Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Text> Glasses built with arduino and bluetooth, that could connect to bluetooth
                        barcode scanners. The barcode scanners would send information to a databse 
                        and the glasses would be able to display it. There was also a second function for food calorie tracking.
                </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className=" d-flex align-items-center justify-content-center pt-5">
                <Card bg="dark" text="white" className="h-100 w-100">
            <Card.Header>
                <Card.Title>Automatic Dog Feeder</Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Text> Automated Dog feeder controlled by an arduino nano. 
                        Simple system that uses a servo motor to rotate a food dispenser.
                </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className=" d-flex align-items-center justify-content-center pt-5">
                <Card bg="dark" text="white" className="h-100 w-100">
            <Card.Header>
                <Card.Title>AM/FM Radio</Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Text>Assembled AM/FM radio using electrical components. Soldered individual components 
                        onto a PCB. Used electrical testing equipment such as Oscilloscope, signal generators, 
                        and spectrum analyzers for troubleshooting and testing.
                </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        </Row>
        <Row className="pt-5 g-4 d-flex flex-column  ">
            <Col md={4} className=" d-flex align-items-center justify-content-center pt-5">
                <Card bg="dark" text="white" className="h-100 w-100">
            <Card.Header>
                <Card.Title>Automatic Light Detection</Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Text> 
                    Designed PCB for sensors and Arduino nano.
                    Sensors trigger a relay which triggers a lamp.
                    Sensors used motion and light to check for occupancy or activity to turn on.
                </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        </Row>
      </Row>
    </Container>
  );
}
