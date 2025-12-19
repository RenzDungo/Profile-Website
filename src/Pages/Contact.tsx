import { Row, Container, Col, Alert} from 'react-bootstrap'
import ghimg from "../assets/GithubMark.png"
import liimg from "../assets/Linkedin.png"
import gmimg from "../assets/Gmail.png"
import { useState } from 'react';
import resumeimg from "../assets/resume.png"
interface SectionProps {
  innerRef: React.RefObject<HTMLDivElement>;
}


export default function ContactPage({ innerRef }: SectionProps) {
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
    return(
        <Container fluid ref={innerRef} style={{ paddingTop:"20%"}}>
        <Row className='d-flex justify-content-center '>
            <Col xs={12} md={6} lg={4} className="d-flex flex-column align-items-center text-center gap-5"> 
                <h1>References and Contact</h1>
                <div>
                    <a href="https://github.com/RenzDungo" target="_blank" rel="noopener noreferrer">
                        <img className="img-hover" src={ghimg} style={{width:"100px",height:"100px"}}/>
                    </a>
                    <h1>Github</h1>
                </div>
                <div>
                    <a href="https://www.linkedin.com/in/renz-dungo-6080b2210/" target="_blank" rel="noopener noreferrer">
                        <img className="img-hover" src={liimg} style={{width:"100px",height:"100px"}}/>
                    </a>
                    <h1>LinkedIn</h1>
                </div>
                <div>
                    <img
                         className="img-hover"
                        src={gmimg}
                        style={{ width: "100px", height: "100px" }}
                        onClick={()=>{
                            handleCopyEmail();
                        }}
                    />
                    <h1>Email</h1>
                </div>
                <div>
                    <a href="https://flowcv.com/resume/641uttpo3f7u" target="_blank" rel="noopener noreferrer">
                        <img className="img-hover" src={resumeimg} style={{width:"100px",height:"100px"}}/>
                    </a>
                    <h1>Hardware Resume</h1>
                </div>
                <div>
                    <a href="https://flowcv.com/resume/bt1raucui9t0" target="_blank" rel="noopener noreferrer">
                        <img className="img-hover" src={resumeimg} style={{width:"100px",height:"100px"}}/>
                    </a>
                    <h1>Software Resume</h1>
                </div>
                {showAlert && (
                <Alert
                    variant="success"
                    className="position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow"
                    style={{ zIndex: 1050 }}
                >
                    Email copied to clipboard
                </Alert>
                )}
            </Col>

        </Row>
    </Container>
    )
}