export default function Hardwareprojects () {
    return(
        <ul className="projectlist">
            <div className="mainbox">
                <div className="titlebox">
                    <h2>Arduino Glasses</h2>
                </div>
                <div className="description">
                    <p>
                        Glasses built with arduino and bluetooth, that could connect to bluetooth
                        barcode scanners. The barcode scanners would send information to a databse 
                        and the glasses would be able to display it. There was also a second function for food calorie tracking.

                    </p>
                </div>
                <div className="gallery">
                </div>
            </div>
            <div className="mainbox"> 
                <div className="titlebox">
                    <h2>Automatic Dog Feeder</h2>
                </div>
                <div className="description">
                    <p>
                        Automated Dog feeder controlled by an arduino nano. 
                        Simple system that uses a servo motor to rotate a food dispenser.
                    </p>
                </div>
                <div className="gallery"></div>
            </div>
            <div className="mainbox"> 
                <div className="titlebox">
                    <h2>AM/FM Radio</h2>
                </div>
                <div className="description">
                    <p>
                        Assembled AM/FM radio using electrical components. Soldered individual components 
                        onto a PCB. Used electrical testing equipment such as Oscilloscope, signal generators, 
                        and spectrum analyzers for troubleshooting and testing.
                    </p>
                </div>
                <div className="gallery"></div>
            </div>
            <div className="mainbox"> 
                <div className="titlebox">
                    <h2>Automatic Light Detection</h2>
                </div>
                <div className="description">
                    <p>
                        Designed PCB for sensors and Arduino nano.
                        Sensors trigger a relay which triggers a lamp.
                        Sensors used motion and light to check for occupancy or activity to turn on.
                    </p>
                </div>
                <div className="gallery"></div>
            </div>
        </ul>
    )
}