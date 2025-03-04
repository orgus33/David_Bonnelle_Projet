import PropTypes from 'prop-types';

const Case = ({estDecouvert, setGrilleEstDecouvert, creerGrille, estPremierClick, etatCase, position, activerDefaite}) => {
    const handleLeftClick = () => {

        if (estPremierClick) {
            creerGrille(position);
        }

        setGrilleEstDecouvert(prev => {
            const newGrille = prev.map(row => [...row]);

            if (estDecouvert === 0) {
                newGrille[position[0]][position[1]] = 1;
            } else if (estDecouvert === 2) {
                newGrille[position[0]][position[1]] = 0;
            }

            return newGrille;
        });

        if(etatCase === -1){
            activerDefaite();
        }

    };

    const handleRightClick = (event) => {
        event.preventDefault();
        setGrilleEstDecouvert(prev => {
            const newGrille = prev.map(row => [...row]);

            if (estDecouvert === 0) {
                newGrille[position[0]][position[1]] = 2;
            } else if (estDecouvert === 2) {
                newGrille[position[0]][position[1]] = 0;
            }
            return newGrille;
        });
    };

    return (
        <div
            className={`border-2 border-black flex items-center justify-center
                        ${estDecouvert === 0 ? "bg-gray-400" : (estDecouvert === 1 ? "bg-white" : estDecouvert === 2 ? "bg-gray-700" : "bg-white")}`}
            onClick={handleLeftClick}
            onContextMenu={handleRightClick}
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
                        d="M346-48q-125 0-212.5-88.5T46-350q0-125 86.5-211.5T344-648h13l27-47q12-22 36-28.5t46 6.5l30 17 5-8q23-43 72-56t92 12l35 20-40 69-35-20q-14-8-30.5-3.5T570-668l-5 8 40 23q21 12 27.5 36t-5.5 45l-27 48q23 36 34.5 76.5T646-348q0 125-87.5 212.5T346-48Zm0-80q91 0 155.5-64.5T566-348q0-31-8.5-61T532-466l-26-41 42-72-104-60-42 72h-44q-94 0-163.5 60T125-350q0 92 64.5 157T346-128Zm454-480v-80h120v80H800ZM580-828v-120h80v120h-80Zm195 81-56-56 85-85 56 56-85 85ZM346-348Z"/>
                </svg>
            )}
            {(etatCase !== -1 && etatCase !== 0 && estDecouvert === 1) && (
                <span>{etatCase}</span>
            )}
        </div>
    );
};

Case.propTypes = {
    estDecouvert: PropTypes.number.isRequired,
    setGrilleEstDecouvert: PropTypes.func.isRequired,
    creerGrille: PropTypes.func.isRequired,
    estPremierClick: PropTypes.bool.isRequired,
    etatCase: PropTypes.number.isRequired,
    position: PropTypes.arrayOf(PropTypes.number).isRequired
};

export default Case;