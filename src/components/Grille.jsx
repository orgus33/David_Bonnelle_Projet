import {useEffect, useState} from "react";
import Case from "./Case.jsx";
import PropTypes from "prop-types";

function Grille({difficulte, activerDefaite, estDebut, setEstDebut}) {
    const [hauteur, setHauteur] = useState(1);
    const [largeur, setLargeur] = useState(1);
    const [nbBombes, setNbBombes] = useState(10);
    const [estPremierClick, setEstPremierClick] = useState(true);
    const [grilleEtat, setGrilleEtat] = useState([]);
    const [grilleEstDecouvert, setGrilleEstDecouvert] = useState([]);

    useEffect(() => {
        InitValeursPourDifficulte();
    }, [difficulte]);

    useEffect(() => {
        if(estDebut){
            InitValeursPourDifficulte();
            setEstPremierClick(true);
            setEstDebut(false);
        }
    }, [estDebut]);

    const InitValeursPourDifficulte = () => {
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
    }

    const creerGrille = (coord) => {
        let bombesPlacees = 0;
        const newGrilleEtat = Array.from({length: hauteur}, () => Array(largeur).fill(0));

        while (bombesPlacees < nbBombes) {
            const x = Math.floor(Math.random() * hauteur);
            const y = Math.floor(Math.random() * largeur);

            if ((x === coord[0] && y === coord[1]) || (x === coord[0] - 1) || (x === coord[0] + 1) || (y === coord[1] - 1) || (y === coord[1] + 1) || newGrilleEtat[x][y] === -1) continue;

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

    const decouvrirCase = (coord, grilleEtatNoSetState = null) => {
        const newGrilleEstDecouvert = grilleEstDecouvert.map(row => [...row]);

        if (grilleEstDecouvert[coord[0]][coord[1]] === 0) {
            newGrilleEstDecouvert[coord[0]][coord[1]] = 1;
        } else if (grilleEstDecouvert[coord[0]][coord[1]] === 2) {
            newGrilleEstDecouvert[coord[0]][coord[1]] = 0;
        }

        if (grilleEtatNoSetState !== null && grilleEtatNoSetState[coord[0]][coord[1]] !== -1) {
            let i = coord[0]

            let arreterRechLigne = false;
            while (i > -1 && !arreterRechLigne) {
                let j = coord[1]
                explorerValeursColonnes(newGrilleEstDecouvert, i, j, coord[1], grilleEtatNoSetState ?? grilleEtat);
                arreterRechLigne = grilleEtatNoSetState[i][j] > 0
                if ((i - 1) > -1) {
                    arreterRechLigne = arreterRechLigne && grilleEtatNoSetState[i - 1][j] < 0;
                }
                i--;
            }

            i = coord[0] + 1

            arreterRechLigne = false;
            while (i < (grilleEtatNoSetState != null ? grilleEtatNoSetState.length : grilleEtat.length)
            && !arreterRechLigne) {
                let j = coord[1] + 1
                explorerValeursColonnes(newGrilleEstDecouvert, i, j, coord[1], grilleEtatNoSetState ?? grilleEtat);
                arreterRechLigne = grilleEtatNoSetState[i][j] > 0
                if ((i + 1) < (grilleEtatNoSetState != null ? grilleEtatNoSetState.length : grilleEtat.length)) {
                    arreterRechLigne = arreterRechLigne && grilleEtatNoSetState[i + 1][j] < 0;
                }
                i++;
            }
        }


        setGrilleEstDecouvert(newGrilleEstDecouvert);
    };

    const explorerValeursColonnes = (newGrilleEstDecouvert, i, j, colonneDepart, grilleEtat) => {
        let arreterRechColonne = false;

        while (j > -1 && !arreterRechColonne) {
            if (grilleEtat[i][j] === 0) {
                newGrilleEstDecouvert[i][j] = 1;
            } else if (grilleEtat[i][j] !== -1) {
                newGrilleEstDecouvert[i][j] = 1;
                if ((j - 1) > -1) {
                    arreterRechColonne = grilleEtat[i][j - 1] < 0;
                }
            }
            j--;
        }

        arreterRechColonne = false;
        j = colonneDepart + 1;
        while (j < (grilleEtat[0].length) && !arreterRechColonne) {
            if (grilleEtat[i][j] === 0) {
                newGrilleEstDecouvert[i][j] = 1;
            } else if (grilleEtat[i][j] !== -1) {
                newGrilleEstDecouvert[i][j] = 1;
                if ((j + 1) < grilleEtat[0].length) {
                    arreterRechColonne = grilleEtat[i][j + 1] < 0;
                }
            }
            j++;
        }
    };


    return (<div className="flex w-full justify-center items-center my-4">
        <div className="border grid aspect-square w-full max-w-[85vh] gap-0" style={{
            gridTemplateColumns: `repeat(${largeur}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${hauteur}, minmax(0, 1fr))`,
            gap: 0
        }}>
            {grilleEtat.map((ligne, indice1) => ligne.map((_, indice2) => {
                if (indice1 >= hauteur || indice2 >= largeur) return null;
                const estDecouvert = grilleEstDecouvert[indice1]?.[indice2];
                const etatCase = grilleEtat[indice1]?.[indice2];
                return (<Case
                    key={`${indice1}-${indice2}`}
                    position={[indice1, indice2]}
                    setGrilleEstDecouvert={setGrilleEstDecouvert}
                    creerGrille={creerGrille}
                    estDecouvert={estDecouvert}
                    etatCase={etatCase}
                    decouvrirCase={decouvrirCase}
                    estPremierClick={estPremierClick}
                    activerDefaite={activerDefaite}
                />);
            }))}
        </div>
    </div>);
}


Grille.propTypes = {
    difficulte: PropTypes.number.isRequired,
    activerDefaite: PropTypes.func.isRequired,
    estDebut: PropTypes.bool.isRequired,
    setEstDebut: PropTypes.func.isRequired,
};

export default Grille;