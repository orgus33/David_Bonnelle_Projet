import {useEffect, useState} from "react";
import Case from "./Case.jsx";

function Grille({difficulte, data, dataUpdate, activerDefaite}) {
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
        const newGrilleEtat = Array.from({ length: hauteur }, () => Array(largeur).fill(0));

        while (bombesPlacees < nbBombes) {
            const x = Math.floor(Math.random() * hauteur);
            const y = Math.floor(Math.random() * largeur);

            if (newGrilleEtat[x][y] === -1) continue;

            newGrilleEtat[x][y] = -1;
            bombesPlacees++;
        }

        for (let i = 0; i < hauteur; i++) {
            for (let j = 0; j < largeur; j++) {
                if (newGrilleEtat[i][j] === -1) continue;

                let bombCount = 0;
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        const ni = i + dx;
                        const nj = j + dy;
                        if (ni >= 0 && ni < hauteur && nj >= 0 && nj < largeur && newGrilleEtat[ni][nj] === -1) {
                            bombCount++;
                        }
                    }
                }
                newGrilleEtat[i][j] = bombCount;
            }
        }

        setGrilleEtat(newGrilleEtat);
        setEstPremierClick(false);
    };

    return (
        <div className="flex w-full justify-center items-center my-4">
            <div className="grid aspect-square w-full max-w-[85vh] gap-0" style={{
                gridTemplateColumns: `repeat(${largeur}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${hauteur}, minmax(0, 1fr))`,
                gap: 0,
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
                                activerDefaite={activerDefaite}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default Grille;