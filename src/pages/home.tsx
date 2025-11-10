import "../components/styles/home.css"
import profilepic from "../assets/images/Profile1.png"
import cpp from "../assets/images/Cplusplus.png"
import js from "../assets/images/javascript.png"
import asm from "../assets/images/asm.jpg"
import python from "../assets/images/python.jpg"
import vhdl from "../assets/images/vhdl.png"
export default function Home() {
  return (
    <div className="background">
      <div className="mainbox">
        <div className="box1">
          <h1>Renz Dungo</h1>
          <h4>B.S Computer Engineering Technology</h4>
          <p className="text"> 
            Hello, I'm Renz — a Computer Engineer and 
            Software Developer with a strong passion for technology 
            that began at age 13. I design and build PCBs, 
            develop web applications, and assemble computers.
          </p>
          <div className="skillslist">
            <h4>Skills:</h4>
            <div className="skillsgallery">
            <div className="skillsimage">
              <img src={cpp} />
              <div className="overlay-text">C++</div>
            </div>
            <div className="skillsimage">
              <img src={js} />
              <div className="overlay-text">JavaScript</div>
            </div>
            <div className="skillsimage">
              <img src={asm} />
              <div className="overlay-text">Assembly</div>
            </div>
            <div className="skillsimage">
              <img src={python} />
              <div className="overlay-text">Python</div>
            </div>
            <div className="skillsimage">
              <img src={vhdl} />
              <div className="overlay-text">VHDL</div>
            </div>
            </div>
          </div>
        </div>  
        <div className="box2">
          <img className="profilepic" src={profilepic} />
        </div>
      </div>
    </div>
  );
} 
