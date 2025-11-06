import React from "react"
import "../components/styles/contact.css"
import ghimg from "../assets/images/GithubMark.png"
import liimg from "../assets/images/Linkedin.png"
import gmimg from "../assets/images/Gmail.png"

const handleCopyEmail = () => {
  const email = "renzdungo2@gmail.com";
  navigator.clipboard.writeText(email);
  const popup = document.createElement("div");
  popup.textContent = "✅ Email copied!";
  popup.style.position = "fixed";
  popup.style.bottom = "30px";
  popup.style.left = "50%";             // centers horizontally
  popup.style.transform = "translateX(-50%)"; // shift back half its width
  popup.style.width = "200px";           // 10% of viewport width
  popup.style.textAlign = "center";     // center the text inside
  popup.style.background = "rgba(0,0,0,0.8)";
  popup.style.color = "#fff";
  popup.style.padding = "10px 0";
  popup.style.borderRadius = "8px";
  popup.style.zIndex = "1000";
  popup.style.fontSize = ".8rem";
  popup.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
  popup.style.backdropFilter = "blur(4px)";
  popup.style.transition = "opacity 0.3s ease";
  popup.style.opacity = "1";

  document.body.appendChild(popup);

  // Smooth fade out before removal
  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => popup.remove(), 300);
  }, 2000); 
};


export default function Contact() {
    return( /*
        <div style={{
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
            minHeight:"100vh",
            minWidth:"100vw",
            paddingTop:"150px",

        }}>
            <div style={{color:"#E0E0E0"}}>
                <div style={{display:"flex",justifyContent:"center", width:"100%"}}>
                    <h1>Contact Me!</h1>
                </div>
            </div>
            <div className="contact">
                <a href="https://github.com/RenzDungo" target="_blank" rel="noopener noreferrer">
                    <img className="img-hover" src={ghimg} style={{width:"150px",height:"150px"}}/>
                </a>
                <h1>Github </h1>
            </div>
            <div className="contact">
                <a href="https://www.linkedin.com/in/renz-dungo-6080b2210/" target="_blank" rel="noopener noreferrer">
                    <img className="img-hover" src={liimg} style={{width:"150px",height:"150px"}}/>
                </a>
                <h1>LinkedIn</h1>
            </div>
            <div className="contact">
                <div onClick={handleCopyEmail} style={{cursor:"pointer", display:"inline-block"}}>
                    <img className="img-hover" src={gmimg} style={{width:"150px",height:"150px"}}/>
                </div>
                <h1>Gmail</h1>
            </div>
        </div> */
        <div className="contactpage"> 
            <div className="contactcontainer">
                <div className="itemcontainer">
                    <a href="https://github.com/RenzDungo" target="_blank" rel="noopener noreferrer">
                        <img className="img-hover" src={ghimg} style={{width:"100px",height:"100px"}}/>
                    </a>
                    <h1>Github </h1>
                </div>
                <div className="itemcontainer">
                    <a href="https://www.linkedin.com/in/renz-dungo-6080b2210/" target="_blank" rel="noopener noreferrer">
                        <img className="img-hover" src={liimg} style={{width:"100px",height:"100px"}}/>
                    </a>
                    <h1>LinkedIn</h1>
                </div>
                <div className="itemcontainer">
                    <a onClick={handleCopyEmail} style={{cursor:"pointer", display:"inline-block"}}>
                        <img className="img-hover" src={gmimg} style={{width:"100px",height:"100px"}}/>
                    </a>
                    <h1>Gmail</h1>
                </div>
            </div>
        </div>
    ) 
}