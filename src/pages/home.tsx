import "../components/styles/home.css"
import profilepic from "../assets/images/Profile1.png"
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
        </div>
        <div className="box2">
          <img className="profilepic" src={profilepic} />
        </div>
      </div>
    </div>
  );
} 
