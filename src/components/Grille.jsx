import {useEffect, useState} from "react";
import Case from "./Case.jsx";

function Grille({difficulte, data, dataUpdate}) {
    const [hauteur, setHauteur] = useState(1);
    const [largeur, setLargeur] = useState(1);
    const [nbBombes, setNbBombes] = useState(10);
    const [estPremierClick, setEstPremierClick] = useState(true);
    const [grilleEtat, setGrilleEtat] = useState([]);
    const [grilleEstDecouvert, setGrilleEstDecouvert] = useState([]);

    useEffect(() => {

        switch (difficulte) {
            case 1:
                setHauteur(() => 10);
                setLargeur(() => 10);
                setNbBombes(20);
                break;
            case 2:
                setHauteur(15);
                setLargeur(15);
                setNbBombes(50);
                break;
            default:
                setHauteur(20);
                setLargeur(20);
                setNbBombes(100);
                break;
        }
        setGrilleEtat(Array.from({ length: hauteur }, () => Array(largeur).fill(0)));
        setGrilleEstDecouvert(Array.from({ length: hauteur }, () => Array(largeur).fill(0)));
        console.log(grilleEtat)
    }, [difficulte]);

    const creerGrille = () => {

        let bombesPlacees = 0;
        while (bombesPlacees < nbBombes) {
            const x = Math.floor(Math.random() * hauteur);
            const y = Math.floor(Math.random() * largeur);

            // Si une bombe est déjà placée sur cette cellule, on passe
            if (setGrilleEtat((grilleEtat) => grilleEtat[x][y] === -1)) continue;

            // Sinon, on place une bombe
            setGrilleEtat((grilleEtat) => grilleEtat[x][y] = -1);
            bombesPlacees++;
        }


        setEstPremierClick(false)
    }

    return (
        <div>
            <div className="grid aspect-square w-full mw-[500px] gap-0"  style={{
                gridTemplateColumns: `repeat(${largeur}, 0fr)`,
                gridTemplateRows: `repeat(${hauteur}, 0fr)`,
                gap: 0
            }}>
                {grilleEtat.map((ligne, indice1) =>
                    ligne.map((_, indice2) => {
                        const estDecouvert = grilleEstDecouvert[indice1][indice2];
                        const etatCase = grilleEtat[indice1][indice2];
                        return (
                            <Case
                                key={`${indice1}-${indice2}`}
                                setGrilleEstDecouvert={setGrilleEstDecouvert}
                                creerGrille={creerGrille}
                                estDecouvert={estDecouvert}
                                etatCase={etatCase}
                                estPremierClick={estPremierClick}
                            />
                        );
                    })
                )}
            </div>


            <p>Grille de difficulté {difficulte}</p>
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

export default Grille;