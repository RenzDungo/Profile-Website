import { Container, Row, Col, Modal } from "react-bootstrap";
import demoVideo from "../assets/videodemonstration.mp4";
import { PCB_PHOTO_SIZES, lightPcbImage, spotifyPcbBottomImage, spotifyPcbTopImage } from "../assets/images";
import type { ImageSet } from "../assets/images";
import { memo, useRef, useState } from "react";
import PCBTraces from "../components/PCBTraces";
import ICChip from "../components/ICChip";

// Board photos sit at the bottom of a board that is usually off-screen, so
// they load lazily and never compete with the first board for bandwidth.
function PcbPhoto({ image, alt }: { image: ImageSet; alt: string }) {
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={PCB_PHOTO_SIZES}
      width={image.width}
      height={image.height}
      style={{ aspectRatio: image.aspectRatio }}
      loading="lazy"
      decoding="async"
      alt={alt}
    />
  );
}

function Projectpage() {
  const [show, setShow] = useState(false);

  const softwareBoardRef = useRef<HTMLDivElement>(null!);
  const softwareHubRef = useRef<HTMLDivElement>(null!);
  const mtgRef = useRef<HTMLDivElement>(null!);
  const jobsRef = useRef<HTMLDivElement>(null!);
  const openCvRef = useRef<HTMLDivElement>(null!);
  const seleniumRef = useRef<HTMLDivElement>(null!);

  const hardwareBoardRef = useRef<HTMLDivElement>(null!);
  const hardwareHubRef = useRef<HTMLDivElement>(null!);
  const glassesRef = useRef<HTMLDivElement>(null!);
  const feederRef = useRef<HTMLDivElement>(null!);
  const radioRef = useRef<HTMLDivElement>(null!);
  const lightRef = useRef<HTMLDivElement>(null!);
  const spotifyRef = useRef<HTMLDivElement>(null!);

  const imagesBoardRef = useRef<HTMLDivElement>(null!);
  const imagesHubRef = useRef<HTMLDivElement>(null!);
  const lightPcbRef = useRef<HTMLDivElement>(null!);
  const spotifyPcbRef = useRef<HTMLDivElement>(null!);

  return (
    <Container fluid className="px-0">
      <header className="pcb-titleblock">
        <h1 className="pcb-title">Projects</h1>
        <p className="pcb-subtitle">
          <span className="pcb-legend">
            <span className="pcb-led pcb-led--hint" aria-hidden="true" /> A lit LED means the chip opens a link or demo.
          </span>
        </p>
      </header>

      {/* ---------------------------------------------------------------- */}
      <div className="pcb-region" ref={softwareBoardRef}>
        <span className="pcb-region__label">SEC A · SOFTWARE</span>
        <PCBTraces
          containerRef={softwareBoardRef}
          links={[
            { from: softwareHubRef, to: mtgRef },
            { from: softwareHubRef, to: jobsRef },
            { from: softwareHubRef, to: openCvRef },
            { from: softwareHubRef, to: seleniumRef },
          ]}
        />
        <div className="pcb-hubrow">
          <ICChip ref={softwareHubRef} designator="U10" part="SW-CTRL" pkg="qfp" className="ic--hub">
            <h2 className="ic__title">Software</h2>
          </ICChip>
        </div>

        <Row className="g-4 pt-5 align-items-stretch">
          <Col xs={12} sm={6} lg={3}>
            <ICChip
              ref={mtgRef}
              designator="U11"
              part="MTG-ASSIST"
              href="https://mtg.balloonhubgaming.com"
              ariaLabel="Open the Magic the Gathering Assistant"
            >
              <h3 className="ic__title">Magic the Gathering Assistant</h3>
              <p className="ic__text">
                Magic the Gathering web application coded in TypeScript with a Vite React frontend. Uses a
                WebSocket API to fetch data from the Magic the Gathering API. Designed to assist users with
                real-time life and card tracking, and includes stats for the current lobby.
              </p>
            </ICChip>
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <ICChip
              ref={jobsRef}
              designator="U12"
              part="JOB-TRACK"
              href="https://jobs.balloonhubgaming.com"
              ariaLabel="Open the Job Application Tracker"
            >
              <h3 className="ic__title">Job Application Tracker</h3>
              <p className="ic__text">
                A web application coded in TypeScript with a Vite React frontend that helps users track
                their job applications. Includes an automatic fill: provide a link and job description and a
                server uses OpenAI to parse the text and fill out the application for you.
              </p>
            </ICChip>
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <ICChip ref={openCvRef} designator="U13" part="OCV-CARD">
              <h3 className="ic__title">OpenCV Card Detection</h3>
              <p className="ic__text">
                A Python script that uses OpenCV to detect cards in an image and identify them through
                Scryfall's API by comparing them against a database of cards.
              </p>
            </ICChip>
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <ICChip ref={seleniumRef} designator="U14" part="SEL-SCRAPE">
              <h3 className="ic__title">Selenium Scraper</h3>
              <p className="ic__text">
                An automated Python script that scrapes HTML elements whose tags usually indicate an
                out-of-stock product. A Discord webhook pushes updates about products I'm interested in.
              </p>
            </ICChip>
          </Col>
        </Row>
      </div>

      {/* ---------------------------------------------------------------- */}
      <div className="pcb-region" ref={hardwareBoardRef}>
        <span className="pcb-region__label">SEC B · HARDWARE</span>
        <PCBTraces
          containerRef={hardwareBoardRef}
          links={[
            { from: hardwareHubRef, to: glassesRef },
            { from: hardwareHubRef, to: feederRef },
            { from: hardwareHubRef, to: radioRef },
            { from: hardwareHubRef, to: lightRef },
            { from: hardwareHubRef, to: spotifyRef },
          ]}
        />
        <div className="pcb-hubrow">
          <ICChip ref={hardwareHubRef} designator="U20" part="HW-CTRL" pkg="qfp" className="ic--hub">
            <h2 className="ic__title">Hardware</h2>
          </ICChip>
        </div>

        <Row className="g-4 pt-5 align-items-stretch justify-content-center">
          <Col xs={12} sm={6} lg={4}>
            <ICChip ref={glassesRef} designator="U21" part="ARD-GLASS">
              <h3 className="ic__title">Arduino Glasses</h3>
              <p className="ic__text">
                Glasses built with Arduino and Bluetooth that connect to Bluetooth barcode scanners. The
                scanners send information to a database and the glasses display it. A second mode handled
                food calorie tracking.
              </p>
            </ICChip>
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <ICChip ref={feederRef} designator="U22" part="DOG-FEED">
              <h3 className="ic__title">Automatic Dog Feeder</h3>
              <p className="ic__text">
                Automated dog feeder controlled by an Arduino Nano. A simple system that uses a servo motor
                and gears to rotate a food dispenser.
              </p>
            </ICChip>
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <ICChip ref={radioRef} designator="U23" part="AM-FM-RX">
              <h3 className="ic__title">AM/FM Radio</h3>
              <p className="ic__text">
                Assembled an AM/FM radio from discrete electrical components, soldering each onto a PCB.
                Used oscilloscopes, signal generators and spectrum analyzers for troubleshooting and testing.
              </p>
            </ICChip>
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <ICChip ref={lightRef} designator="U24" part="LIGHT-DET">
              <h3 className="ic__title">Automatic Light Detection</h3>
              <p className="ic__text">
                Designed a PCB for sensors and an Arduino Nano. Motion and light sensors check for occupancy
                or activity and trigger a relay that switches a lamp.
              </p>
            </ICChip>
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <ICChip ref={spotifyRef} designator="U25" part="ESP32-MP3" onClick={() => setShow(true)} ariaLabel="Play the Spotify MP3 player demo">
              <h3 className="ic__title">Spotify MP3 Player</h3>
              <p className="ic__text">
                Designed a PCB around an ESP32 that talks to Spotify's API to control playback. Built my own
                server to handle Spotify refresh tokens while the ESP32 pulls the current song list and
                changes tracks.
              </p>
            </ICChip>
          </Col>
        </Row>
      </div>

      <Modal show={show} onHide={() => setShow(false)} size="lg" centered dialogClassName="pcb-modal">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="ic__marking ic__marking--modal">
            <span className="ic__ref">U25</span>
            <span className="ic__part">ESP32-MP3 · DEMO</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <video src={demoVideo} controls autoPlay playsInline style={{ width: "100%", display: "block" }} />
        </Modal.Body>
      </Modal>

      {/* ---------------------------------------------------------------- */}
      <div className="pcb-region" ref={imagesBoardRef}>
        <span className="pcb-region__label">SEC C · FABRICATED BOARDS</span>
        <PCBTraces
          containerRef={imagesBoardRef}
          links={[
            { from: imagesHubRef, to: lightPcbRef },
            { from: imagesHubRef, to: spotifyPcbRef },
          ]}
        />
        <div className="pcb-hubrow">
          <ICChip ref={imagesHubRef} designator="U30" part="IMG-BUS" pkg="qfp" className="ic--hub">
            <h2 className="ic__title">PCB Images</h2>
          </ICChip>
        </div>

        <Row className="g-4 pt-5 align-items-stretch justify-content-center">
          <Col xs={12} md={6} lg={5}>
            <ICChip ref={lightPcbRef} designator="U31" part="LIGHT-DET-PCB" className="ic--photo">
              <h3 className="ic__title">Light Sensor PCB</h3>
              <div className="ic__window">
                <PcbPhoto image={lightPcbImage} alt="Light sensor PCB layout" />
              </div>
            </ICChip>
          </Col>
          <Col xs={12} md={6} lg={5}>
            <ICChip ref={spotifyPcbRef} designator="U32" part="ESP32-MP3-PCB" className="ic--photo">
              <h3 className="ic__title">Spotify MP3 Player PCB</h3>
              <div className="ic__window">
                <PcbPhoto image={spotifyPcbTopImage} alt="Spotify MP3 player PCB, top" />
              </div>
              <div className="ic__window">
                <PcbPhoto image={spotifyPcbBottomImage} alt="Spotify MP3 player PCB, bottom" />
              </div>
            </ICChip>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

// Memoised so App re-rendering on a board change does not re-render the page.
export default memo(Projectpage);
