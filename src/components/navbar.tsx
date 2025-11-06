import React from "react";
import "./styles/navbar.css"
import { NavbarData } from "./navbardata";
interface NavBarProps{
  setCurrentPage: (page:string) => void;
  currentPage?: string;
}
export default function Navbar({setCurrentPage, currentPage}: NavBarProps) {
  return (
    <nav className="Mainbar">
      <ul className="toolbox">
        {NavbarData.map((val,key)=>{
          return(
            <div className="navbutton" key={key} onClick={()=> setCurrentPage(val.title)}>{val.title}</div>
          )
        })}
      </ul>
    </nav>
  );
}
