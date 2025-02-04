import {useEffect, useState} from "react";
import Case from "./Case.jsx";

function Grille({mode, data, dataUpdate}) {
    let [hauteur, setHauteur] = useState(1);
    let [largeur, setLargeur] = useState(1);
    useEffect(() => {
        switch (mode) {
            case 1:
                setHauteur(10);
                setLargeur(10);
                break;
            case 2:
                setHauteur(15);
                setLargeur(15);
                break;
            case 3:
                setHauteur(20);
                setLargeur(20);
                break;
            default:
                setHauteur(10);
                setLargeur(10);
        }
    }, [mode]);

    return (
        <div>
            <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${largeur}, 0fr)` }}>
                {Array.from({ length: hauteur * largeur }).map((_, index) => (
                    <Case key={index} state={0}/>
                ))}
            </div>

            <p>Grille de difficulté {mode}</p>
            <input type="range" className="form-range" id="customRange1" value={data[0]}
                   min="0" max="200"
                   onChange={event => {
                       const newData = [...data];
                       newData[0] = Number(event.target.value);
                       dataUpdate(newData);
                   }}/>
            <input type="range" className="form-range" id="customRange1" value={data[1]}
                   min="0" max="200"
                   onChange={event => {
                       const newData = [...data];
                       newData[1] = Number(event.target.value);
                       dataUpdate(newData);
                   }}/>
        </div>
    );
}
export default  Grille;