import PropTypes from 'prop-types';

const Case = ({
                  estDecouvert,
                  setGrilleEstDecouvert,
                  creerGrille,
                  estPremierClick,
                  etatCase,
                  position,
                  activerDefaite,
                  decouvrirCase,
                  dataJeu,
                  setDataJeu,
                  verifierVictoire,
                  dataTestid
              }) => {
    const handleLeftClick = () => {

        if (estPremierClick) {
            creerGrille(position);
        } else {
            decouvrirCase(position);
        }

        if (etatCase === -1 && estDecouvert === 0) {
            activerDefaite();
        }
    };

    const handleRightClick = (event) => {
        event.preventDefault();
        setGrilleEstDecouvert(prev => {
            const newGrille = prev.map(row => [...row]);


            if (estDecouvert === 0) {
                newGrille[position[0]][position[1]] = 2;
                setDataJeu([dataJeu[0] - 1, dataJeu[1]]);
            } else if (estDecouvert === 2) {
                newGrille[position[0]][position[1]] = 0;
                setDataJeu([dataJeu[0] + 1, dataJeu[1]]);
            }
            return newGrille;
        });
        verifierVictoire();
    };

    const getBackgroundColor = () => {
        if (estDecouvert === 0 || estDecouvert === 2) {
            return (position[0] + position[1]) % 2 === 0 ? "bg-[#b4d567]" : "bg-[#adcf60]";
        }

        if (estDecouvert === 1) {
            return (position[0] + position[1]) % 2 === 0 ? "bg-[#cfb99d]" : "bg-[#dcc3a4]";
        }

        return "bg-white";
    };

    return (

        <button
            className={`flex items-center justify-center hover:bg-[#cfcfcf54] ${getBackgroundColor()}`}
            data-testid={dataTestid}
            tabIndex={0}
            onClick={handleLeftClick}
            onContextMenu={(e) => handleRightClick(e)}
        >

            {estDecouvert === 2 && (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" viewBox="0 0 16 16">
                    <path
                        d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001"/>
                </svg>
            )}

            {(etatCase === -1 && estDecouvert === 1) && (
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                     fill="darkred">
                    <path
                        d="M321.33-8Q190-8 99-99.83 8-191.67 8-322.33q0-130.34 92-221.34t223.33-91h1.34l19.66-35.66Q361-699 392.5-707t60.17 8l22.66 13.33 3.67-6.66q26.67-46 77.5-59.17 50.83-13.17 97.17 12.17L696-715l-48.67 83.33L605-656q-12-6.33-24.5-2.67-12.5 3.67-18.83 15l-3 6 23.66 13.34q27 17.33 35.84 48 8.83 30.66-7.5 59.33L591-481.33q21 37 32.33 77.5 11.34 40.5 11.34 83.5Q634.67-190 542.83-99 451-8 321.33-8Zm495.34-555.33V-660h136.66v96.67H816.67Zm-258-258V-958h96.66v136.67h-96.66ZM806-742l-68.67-68.67L834-907.33l68.67 68.66L806-742Z"/>
                </svg>
            )}
            {(etatCase > 0 && estDecouvert === 1) && (
                <span>{etatCase}</span>
            )}
        </button>
    );
};

Case.propTypes = {
    estDecouvert: PropTypes.number.isRequired,
    setGrilleEstDecouvert: PropTypes.func.isRequired,
    creerGrille: PropTypes.func.isRequired,
    estPremierClick: PropTypes.bool.isRequired,
    etatCase: PropTypes.number.isRequired,
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
    activerDefaite: PropTypes.func.isRequired,
    decouvrirCase: PropTypes.func.isRequired,
    dataJeu: PropTypes.arrayOf(PropTypes.number).isRequired,
    setDataJeu: PropTypes.func.isRequired,
    verifierVictoire: PropTypes.func.isRequired,
};

export default Case;