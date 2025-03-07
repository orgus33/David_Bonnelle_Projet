import {useEffect, useState} from "react";
import Case from "./Case.jsx";
import PropTypes from "prop-types";

function Grille({difficulte, activerDefaite}) {
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

        setGrilleEtat(Array.from({length: newHauteur}, () => Array(newLargeur).fill(0)));
        setGrilleEstDecouvert(Array.from({length: newHauteur}, () => Array(newLargeur).fill(0)));
    }, [difficulte]);

    const creerGrille = (coord) => {
        let bombesPlacees = 0;
        const newGrilleEtat = Array.from({length: hauteur}, () => Array(largeur).fill(0));

        while (bombesPlacees < nbBombes) {
            const x = Math.floor(Math.random() * hauteur);
            const y = Math.floor(Math.random() * largeur);

            if ((x === coord[0] && y === coord[1]) || (x === coord[0] - 1) || (x === coord[0] + 1)
                || (y === coord[1] - 1) || (y === coord[1] + 1) || newGrilleEtat[x][y] === -1) continue;

            newGrilleEtat[x][y] = -1;
            bombesPlacees++;
        }

        for (let i = 0; i < hauteur; i++) {
            for (let j = 0; j < largeur; j++) {
                if (newGrilleEtat[i][j] === -1) continue;

                let bombesTrouvees = 0;
                for (let y = -1; y <= 1; y++) {
                    for (let x = -1; x <= 1; x++) {
                        const indiceY = i + y;
                        const indiceX = j + x;
                        if (indiceY >= 0 && indiceY < hauteur && indiceX >= 0 && indiceX < largeur && newGrilleEtat[indiceY][indiceX] === -1) {
                            bombesTrouvees++;
                        }
                    }
                }
                newGrilleEtat[i][j] = bombesTrouvees;
            }
        }

        setGrilleEtat(newGrilleEtat);
        setEstPremierClick(false);

        decouvrirCase(coord, newGrilleEtat)
    };

    useEffect(() => {
        console.log(grilleEstDecouvert)
    }, [grilleEstDecouvert]);

    const decouvrirCase = (coord, grilleEtatNoSetState = null) => {

        console.log("----------------")
        console.log(grilleEtat)
        console.log(grilleEtatNoSetState);
        console.log(grilleEstDecouvert);
        console.log("----------------")

        const newGrilleEstDecouvert = grilleEstDecouvert.map(row => [...row]);

        if (grilleEstDecouvert[coord[0]][coord[1]] === 0) {
            newGrilleEstDecouvert[coord[0]][coord[1]] = 1;
        } else if (grilleEstDecouvert[coord[0]][coord[1]] === 2) {
            newGrilleEstDecouvert[coord[0]][coord[1]] = 0;
        }

        let i = coord[0]

        while (i > -1) {
            let j = coord[1]
            explorerValeursColonnes(newGrilleEstDecouvert, i, j, coord[0], grilleEtatNoSetState ?? grilleEtat);
            i--;
        }
        i = coord[0]

        while (i < (grilleEtatNoSetState !== null ? grilleEtatNoSetState.length : grilleEtat.length)) {
            let j = coord[1]
            explorerValeursColonnes(newGrilleEstDecouvert, i, j, coord[0], grilleEtatNoSetState ?? grilleEtat);
            i++;
        }

        setGrilleEstDecouvert(newGrilleEstDecouvert);
    };

    const explorerValeursColonnes = (newGrilleEstDecouvert, i, j, ligne, grilleEtat) => {
        let arreterRechColonne = false;
        while (j > -1 && !arreterRechColonne) {
            if (grilleEtat[i][j] === 0) {
                newGrilleEstDecouvert[i][j] = 1;
            } else if (grilleEtat[i][j] !== -1) {
                newGrilleEstDecouvert[i][j] = 1;
                arreterRechColonne = true;
            }
            j--;
        }
        arreterRechColonne = false;
        j = ligne
        while (j < (grilleEtat[0].length) && !arreterRechColonne) {
            if (grilleEtat[i][j] === 0) {
                newGrilleEstDecouvert[i][j] = 1;
            } else if (grilleEtat[i][j] !== -1) {
                newGrilleEstDecouvert[i][j] = 1;
                arreterRechColonne = true;
            }
            j++;
        }
    };


    return (
        <div className="flex w-full justify-center items-center my-4">
            <div className="border grid aspect-square w-full max-w-[85vh] gap-0" style={{
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
                                decouvrirCase={decouvrirCase}
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


Grille.propTypes = {
    difficulte: PropTypes.number.isRequired,
    activerDefaite: PropTypes.func.isRequired,
};

export default Grille;