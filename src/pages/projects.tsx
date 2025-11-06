import React from "react";
import { useState } from 'react'
import "../components/styles/projects.css"
import project1img from "../assets/images/asm.jpg"
import ToggleSwitch from "../components/projectswitch";
import Softwareprojects from "../components/softwareprojects";
import Hardwareprojects from "../components/hardwareprojects";
export default function Projects() {
    const [isHardware, setIsHardware] = useState(false)
    return(
        <div className="projectpage">
            <ToggleSwitch onToggle={setIsHardware}/> 
            {isHardware === true && <Hardwareprojects/>}
            {isHardware === false && <Softwareprojects/>}
        </div>
    )
}