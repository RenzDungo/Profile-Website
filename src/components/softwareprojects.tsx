import "./styles/projects.css"

export default function Softwareprojects () {
    return(
        <ul className="projectlist">
            <div className="mainbox">
                <div className="titlebox">
                    <h2>MTG Web Application</h2>
                </div>
                <div className="description">
                    <p>
                        React Web application built for tabletop Magic Games.
                        API server built with typescript that uses a sqlite3 database.
                        Synchronized life counter through the use of polling. 
                        Card tracking with scryfall API.
                    </p>
                </div>
                <div className="gallery">

                </div>
            </div>
            <div className="mainbox"> 
                <div className="titlebox">
                    <h2>Selenium stock scraper</h2>
                </div>
                <div className="description">
                    <p>
                        Scraper built in python to look for html elements that would indicate
                        if an item is in stock. 
                    </p>
                    </div>
                <div className="gallery"></div>
            </div>
            <div className="mainbox"> 
                <div className="titlebox">
                    <h2>OpenCV card detection</h2>
                </div>
                <div className="description">
                    <p>
                        Python OpenCV program that used a text detection to find cards through live video.
                    </p>
                    </div>
                <div className="gallery"></div>
            </div>
            <div className="mainbox"> 
                <div className="titlebox">
                    <h2>Automated gameplay</h2>
                </div>
                <div className="description">
                    <p>
                        Using OpenCV I automated gameplay for a turn-based action game.
                        Depending on the images shown, several actions would be automated.
                        Used a webhook to send results to my phone.
                    </p>
                    </div>
                <div className="gallery"></div>
            </div>
        </ul>
    )
}