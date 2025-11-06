import {useState} from "react";
import "./styles/projects.css"
interface ToggleSwitchProps {
    onToggle?: (isHardware:boolean) => void;
}

export default function ToggleSwitch ({onToggle}: ToggleSwitchProps) {
    const [isHardware, setIsHardware] = useState(false);

    const handleToggle = () => {
        const newState = !isHardware;
        setIsHardware(newState);
        if (onToggle) onToggle(newState);
    };

  return(
    <div className="switch" onClick={()=> handleToggle()}>
        <span className={!isHardware ? "active" : "inactive"}>Software</span>
        <span className={isHardware ? "active" : "inactive"}>Hardware</span>
    </div>
  )
}