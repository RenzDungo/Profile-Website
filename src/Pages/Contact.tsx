import { Row, Container, Col } from "react-bootstrap";
import ghimg from "../assets/GithubMark.png";
import liimg from "../assets/Linkedin.png";
import gmimg from "../assets/Gmail.png";
import resumeimg from "../assets/resume.png";
import { useRef, useState } from "react";
import PCBTraces from "../components/PCBTraces";
import ICChip from "../components/ICChip";

const EMAIL = "renzdungo2@gmail.com";

function copyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for HTTP / older browsers
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export default function ContactPage() {
  const [copied, setCopied] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null!);
  const hubRef = useRef<HTMLDivElement>(null!);
  const githubRef = useRef<HTMLDivElement>(null!);
  const linkedinRef = useRef<HTMLDivElement>(null!);
  const emailRef = useRef<HTMLDivElement>(null!);
  const hwResumeRef = useRef<HTMLDivElement>(null!);
  const swResumeRef = useRef<HTMLDivElement>(null!);

  const handleCopyEmail = () => {
    copyToClipboard(EMAIL);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Container fluid className="px-0">
      <header className="pcb-titleblock">
        <h1 className="pcb-title">Contact</h1>
        <p className="pcb-subtitle">External ports. Each connector opens a profile, a resume, or copies my email.</p>
      </header>

      <div className="pcb-region pcb-region--fill" ref={boardRef}>
        <span className="pcb-region__label">SEC A · I/O PORTS</span>
        <PCBTraces
          containerRef={boardRef}
          links={[
            { from: hubRef, to: githubRef },
            { from: hubRef, to: linkedinRef },
            { from: hubRef, to: emailRef },
            { from: hubRef, to: hwResumeRef },
            { from: hubRef, to: swResumeRef },
          ]}
        />
        <div className="pcb-hubrow">
          <ICChip ref={hubRef} designator="U40" part="IO-CTRL" pkg="qfp" className="ic--hub">
            <h2 className="ic__title">References &amp; Contact</h2>
          </ICChip>
        </div>

        <Row className="g-4 pt-5 justify-content-center align-items-stretch">
          <Col xs={6} sm={4} lg={2}>
            <ICChip
              ref={githubRef}
              designator="J1"
              part="GITHUB"
              pkg="sot"
              href="https://github.com/RenzDungo"
              ariaLabel="Open my GitHub profile"
              className="ic--port"
            >
              <img src={ghimg} alt="" className="ic__port-icon" />
              <span className="ic__port-label">GitHub</span>
            </ICChip>
          </Col>
          <Col xs={6} sm={4} lg={2}>
            <ICChip
              ref={linkedinRef}
              designator="J2"
              part="LINKEDIN"
              pkg="sot"
              href="https://www.linkedin.com/in/renz-dungo-6080b2210/"
              ariaLabel="Open my LinkedIn profile"
              className="ic--port"
            >
              <img src={liimg} alt="" className="ic__port-icon" />
              <span className="ic__port-label">LinkedIn</span>
            </ICChip>
          </Col>
          <Col xs={6} sm={4} lg={2}>
            <ICChip
              ref={emailRef}
              designator="J3"
              part="EMAIL"
              pkg="sot"
              onClick={handleCopyEmail}
              ariaLabel="Copy my email address"
              className="ic--port"
            >
              <img src={gmimg} alt="" className="ic__port-icon" />
              <span className="ic__port-label">{copied ? "Copied!" : "Email"}</span>
            </ICChip>
          </Col>
          <Col xs={6} sm={4} lg={2}>
            <ICChip
              ref={hwResumeRef}
              designator="J4"
              part="CV-HW"
              pkg="sot"
              href="https://flowcv.com/resume/641uttpo3f7u"
              ariaLabel="Open my hardware resume"
              className="ic--port"
            >
              <img src={resumeimg} alt="" className="ic__port-icon" />
              <span className="ic__port-label">Hardware Resume</span>
            </ICChip>
          </Col>
          <Col xs={6} sm={4} lg={2}>
            <ICChip
              ref={swResumeRef}
              designator="J5"
              part="CV-SW"
              pkg="sot"
              href="https://flowcv.com/resume/bt1raucui9t0"
              ariaLabel="Open my software resume"
              className="ic--port"
            >
              <img src={resumeimg} alt="" className="ic__port-icon" />
              <span className="ic__port-label">Software Resume</span>
            </ICChip>
          </Col>
        </Row>
      </div>

      <div className={`pcb-toast${copied ? " is-visible" : ""}`} role="status" aria-live="polite">
        <span className="pcb-led pcb-led--ok" aria-hidden="true" />
        {copied ? `${EMAIL} copied to clipboard` : ""}
      </div>
    </Container>
  );
}
