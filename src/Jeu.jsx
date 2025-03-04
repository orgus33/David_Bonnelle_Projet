import {useEffect, useState} from "react";
import Grille from "./components/Grille.jsx";

const Jeu = () => {
    const [difficulte, setDifficulte] = useState(1);
    const [dataJeu, setDataJeu] = useState([1, 0]);
    const [montrerRegles, setMontrerRegles] = useState(false);
    const [montrerModalDefaite, setMontrerModalDefaite] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setDataJeu(([drapeaux, temps]) => [drapeaux, ++temps]);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const togglePopover = () => {
        setMontrerRegles(!montrerRegles);
    };

    const activerDefaite = () => {
        setMontrerModalDefaite(true); // Update this function
    };

    const closeModal = () => {
        setMontrerModalDefaite(false);
    };

    return (
        <div>
            <div className="flex flex-row justify-between p-3 bg-gray-200">
                <div className="flex gap-3">
                    <select
                        className="border border-gray-300 rounded p-2"
                        aria-label="Sélectionner la difficulté"
                        value={difficulte}
                        onChange={(event) => setDifficulte(Number(event.target.value))}
                    >
                        <option value="1">Facile</option>
                        <option value="2">Moyen</option>
                        <option value="3">Difficile</option>
                    </select>
                    <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" viewBox="0 0 16 16">
                            <path
                                d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001"/>
                        </svg>
                        <p className="m-0">{dataJeu[0]}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                             viewBox="0 0 16 16">
                            <path
                                d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9z"/>
                            <path
                                d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1z"/>
                        </svg>
                        <p className="m-0">{dataJeu[1]}</p>
                    </div>
                </div>
                <div className="relative inline-block">
                    <button
                        onClick={togglePopover}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        <div className="flex flex-row gap-3">
                            Règles
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                 viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path
                                    d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                            </svg>
                        </div>

                    </button>
                    {montrerRegles && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
                            <div className="p-4 text-sm text-gray-700">
                                <p><strong>Click gauche:</strong> Dévoiler la case <br></br><strong>Click droit :</strong> Mettre un drapeau</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Grille difficulte={difficulte} data={dataJeu} dataUpdate={setDataJeu} activerDefaite={activerDefaite}/>
            {montrerModalDefaite && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg flex flex-col items-center gap-2">
                        <h2 className="text-xl w-full border-b-2 border-gray-500 text-center">Défaite</h2>
                        <p>Vous avez perdu ! Rejouer ?</p>
                        <button
                            onClick={closeModal}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Rejouer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Jeu;
