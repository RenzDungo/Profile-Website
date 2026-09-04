import { Row, Container, Col, Card, Alert} from 'react-bootstrap'
import ghimg from "../assets/GithubMark.png"
import liimg from "../assets/Linkedin.png"
import gmimg from "../assets/Gmail.png"
import { useRef, useState } from 'react';
import resumeimg from "../assets/resume.png"
import PCBTraces from '../components/PCBTraces';
import PCBBackground from '../components/PCBBackground';
import { boardDecorPattern } from '../components/pcbPattern';

export default function ContactPage() {
    const copyToClipboard = (text: string) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text);
        } else {
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
};
    const handleCopyEmail= () => {
        copyToClipboard("renzdungo2@gmail.com");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };
    const [showAlert, setShowAlert] = useState(false);

    const boardRef = useRef<HTMLDivElement>(null!);
    const chipRef = useRef<HTMLDivElement>(null!);
    const githubRef = useRef<HTMLDivElement>(null!);
    const linkedinRef = useRef<HTMLDivElement>(null!);
    const emailRef = useRef<HTMLDivElement>(null!);
    const hwResumeRef = useRef<HTMLDivElement>(null!);
    const swResumeRef = useRef<HTMLDivElement>(null!);

    return(
        <Container fluid>
        <div className="pcb-board pcb-board--fill" ref={boardRef}>
            <PCBBackground pattern={boardDecorPattern} />
            <PCBTraces
                containerRef={boardRef}
                links={[
                    { from: chipRef, to: githubRef },
                    { from: chipRef, to: linkedinRef },
                    { from: chipRef, to: emailRef },
                    { from: chipRef, to: hwResumeRef },
                    { from: chipRef, to: swResumeRef },
                ]}
            />
            <Row>
                <Col className="d-flex align-items-center justify-content-center">
                    <h1 className="pcb-chip" ref={chipRef}>References and Contact</h1>
                </Col>
            </Row>
            <Row className="pt-5 g-4 justify-content-center">
                <Col xs={6} md={2} className="d-flex justify-content-center pt-5">
                    <a href="https://github.com/RenzDungo" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                        <Card ref={githubRef} className="ic-chip text-center p-3">
                            <span className="ic-chip-dot" />
                            <img src={ghimg} style={{width:"70px",height:"70px"}}/>
                            <Card.Text className="mt-2 mb-0">Github</Card.Text>
                        </Card>
                    </a>
                </Col>
                <Col xs={6} md={2} className="d-flex justify-content-center pt-5">
                    <a href="https://www.linkedin.com/in/renz-dungo-6080b2210/" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                        <Card ref={linkedinRef} className="ic-chip text-center p-3">
                            <span className="ic-chip-dot" />
                            <img src={liimg} style={{width:"70px",height:"70px"}}/>
                            <Card.Text className="mt-2 mb-0">LinkedIn</Card.Text>
                        </Card>
                    </a>
                </Col>
                <Col xs={6} md={2} className="d-flex justify-content-center pt-5">
                    <Card ref={emailRef} className="ic-chip text-center p-3" onClick={handleCopyEmail} style={{cursor:"pointer"}}>
                        <span className="ic-chip-dot" />
                        <img src={gmimg} style={{width:"70px",height:"70px"}}/>
                        <Card.Text className="mt-2 mb-0">Email</Card.Text>
                    </Card>
                </Col>
                <Col xs={6} md={2} className="d-flex justify-content-center pt-5">
                    <a href="https://flowcv.com/resume/641uttpo3f7u" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                        <Card ref={hwResumeRef} className="ic-chip text-center p-3">
                            <span className="ic-chip-dot" />
                            <img src={resumeimg} style={{width:"70px",height:"70px"}}/>
                            <Card.Text className="mt-2 mb-0">Hardware Resume</Card.Text>
                        </Card>
                    </a>
                </Col>
                <Col xs={6} md={2} className="d-flex justify-content-center pt-5">
                    <a href="https://flowcv.com/resume/bt1raucui9t0" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                        <Card ref={swResumeRef} className="ic-chip text-center p-3">
                            <span className="ic-chip-dot" />
                            <img src={resumeimg} style={{width:"70px",height:"70px"}}/>
                            <Card.Text className="mt-2 mb-0">Software Resume</Card.Text>
                        </Card>
                    </a>
                </Col>
            </Row>
            {showAlert && (
            <Alert
                variant="success"
                className="position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow"
                style={{ zIndex: 1050 }}
            >
                Email copied to clipboard
            </Alert>
            )}
        </div>
    </Container>
    )
}
