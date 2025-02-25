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
        let newHauteur, newLargeur, newNbBombes;

        switch (difficulte) {
            case 1:
                newHauteur = 10;
                newLargeur = 10;
                newNbBombes = 20;
                break;
            case 2:
                newHauteur = 15;
                newLargeur = 15;
                newNbBombes = 50;
                break;
            default:
                newHauteur = 20;
                newLargeur = 20;
                newNbBombes = 100;
                break;
        }

        setHauteur(newHauteur);
        setLargeur(newLargeur);
        setNbBombes(newNbBombes);

        setGrilleEtat(Array.from({ length: newHauteur }, () => Array(newLargeur).fill(0)));
        setGrilleEstDecouvert(Array.from({ length: newHauteur }, () => Array(newLargeur).fill(0)));
    }, [difficulte]);

    const creerGrille = () => {
        let bombesPlacees = 0;
        while (bombesPlacees < nbBombes) {
            const x = Math.floor(Math.random() * hauteur);
            const y = Math.floor(Math.random() * largeur);

            if (grilleEtat[x][y] === -1) continue;

            setGrilleEtat((prevGrilleEtat) => {
                const newGrilleEtat = [...prevGrilleEtat];
                newGrilleEtat[x][y] = -1;
                return newGrilleEtat;
            });
            bombesPlacees++;
        }
        setEstPremierClick(false);
    };

    return (
        <div className="flex w-full justify-center items-center my-4">
            <div className="grid aspect-square w-full max-w-[85vh] gap-0" style={{
                gridTemplateColumns: `repeat(${largeur}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${hauteur}, minmax(0, 1fr))`,
                gap: 0
            }}>
                {grilleEtat.map((ligne, indice1) =>
                    ligne.map((_, indice2) => {
                        if (indice1 >= hauteur || indice2 >= largeur) return null;
                        const estDecouvert = grilleEstDecouvert[indice1]?.[indice2];
                        const etatCase = grilleEtat[indice1]?.[indice2];
                        return (
                            <Case
                                key={`${indice1}-${indice2}`}
                                position={[indice1, indice2]}
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
        </div>
    );
}

export default Grille;