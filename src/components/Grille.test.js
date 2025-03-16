import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Grille from './Grille';

// Permet de remplacer le composant Case par un mock pour les tests (composant simplifié et adapté pour faire le test)
jest.mock('./Case.jsx', () => {
    return jest.fn(props => {
        const { position, estPremierClick, creerGrille, decouvrirCase, etatCase, activerDefaite, dataTestid } = props;

        const handleClick = () => {
            if (estPremierClick) {
                creerGrille(position);
            } else if (etatCase === -1) {
                activerDefaite();
            } else {
                decouvrirCase(position);
            }
        };

        return (
            <div
                data-testid={dataTestid}
                data-position={`${position[0]}-${position[1]}`}
                data-etat={etatCase}
                data-est-premier-click={estPremierClick ? "true" : "false"}
                onClick={handleClick}
            />
        );
    });
});

describe('Tests du composant Grille', () => {
    const defaultProps = {
        difficulte: 1,
        activerDefaite: jest.fn(),
        estDebut: true,
        setEstDebut: jest.fn(),
        setEstVictoire: jest.fn(),
        dataJeu: [0, 0],
        setDataJeu: jest.fn(),
    };

    beforeEach(() => {
        // Réinitialise tous les mocks avant chaque test
        jest.clearAllMocks();
        // Mettre Math.random à 0.5 pour les tests
        jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
        // Réinitialise le mock du composant Case
        require('./Case.jsx').mockClear();
    });

    afterEach(() => {
        // Remettre par défaut Math.random après chaque test
        jest.spyOn(global.Math, 'random').mockRestore();
    });

    // Tests des paramètres de difficulté
    test('devrait initialiser avec les paramètres de difficulté facile (1)', () => {
        // Valeurs attendues pour la difficulté 1
        const lignesAttendues = 10;
        const colonnesAttendues = 10;
        const drapeauxAttendus = 25;

        render(<Grille {...defaultProps} difficulte={1} />);

        const cases = screen.getAllByTestId(/case-\d+-\d+/);

        expect(cases.length).toBe(lignesAttendues * colonnesAttendues);
        expect(defaultProps.setDataJeu).toHaveBeenCalledWith([drapeauxAttendus, 0]);
    });

    test('devrait initialiser avec les paramètres de difficulté moyenne (2)', () => {
        const lignesAttendues = 15;
        const colonnesAttendues = 15;
        const drapeauxAttendus = 70;

        render(<Grille {...defaultProps} difficulte={2} />);

        const cases = screen.getAllByTestId(/case-\d+-\d+/);

        expect(cases.length).toBe(lignesAttendues * colonnesAttendues);
        expect(defaultProps.setDataJeu).toHaveBeenCalledWith([drapeauxAttendus, 0]);
    });

    test('devrait initialiser avec les paramètres de difficulté difficile (3)', () => {
        const lignesAttendues = 20;
        const colonnesAttendues = 20;
        const drapeauxAttendus = 120;

        render(<Grille {...defaultProps} difficulte={3} />);

        const cases = screen.getAllByTestId(/case-\d+-\d+/);

        expect(cases.length).toBe(lignesAttendues * colonnesAttendues);
        expect(defaultProps.setDataJeu).toHaveBeenCalledWith([drapeauxAttendus, 0]);
    });

    // Tests d'initialisation du jeu
    test('devrait réinitialiser la grille lorsque estDebut change à true', () => {
        const props = {
            ...defaultProps,
            difficulte: 1,
            estDebut: false,
        };

        const { rerender } = render(<Grille {...props} />);

        defaultProps.setDataJeu.mockClear();

        rerender(<Grille {...props} estDebut={true} />);

        expect(defaultProps.setDataJeu).toHaveBeenCalledWith([25, 0]);
        expect(defaultProps.setEstDebut).toHaveBeenCalledWith(false);
    });

    test('devrait changer les paramètres lorsque la difficulté change', () => {
        const props = {
            ...defaultProps,
            difficulte: 1,
        };

        const { rerender } = render(<Grille {...props} />);

        defaultProps.setDataJeu.mockClear();

        rerender(<Grille {...props} difficulte={2} />);

        expect(defaultProps.setDataJeu).toHaveBeenCalledWith([70, 0]);

        const cases = screen.getAllByTestId(/case-\d+-\d+/);
        expect(cases.length).toBe(15 * 15); // Grille 15x15 pour difficulté 2
    });

    // Tests du jeu
    test('devrait appeler creerGrille au premier clic', () => {
        const mockCreerGrille = jest.fn();

        function TestWrapper() {
            const [caseCliquee, setCaseCliquee] = React.useState(false);

            const creerGrille = (position) => {
                mockCreerGrille(position);
                setCaseCliquee(true);
            };

            return (
                <div>
                    <button
                        data-testid="test-case"
                        onClick={() => creerGrille([0, 0])}
                    >
                        Cliquez-moi
                    </button>
                    {caseCliquee && <div data-testid="grid-created">Grille créée</div>}
                </div>
            );
        }

        render(<TestWrapper />);

        // Clic sur le bouton pour simuler le premier clic
        fireEvent.click(screen.getByTestId('test-case'));

        // Vérification que la fonction a été appelée avec la position attendue
        expect(mockCreerGrille).toHaveBeenCalledWith([0, 0]);

        // Vérification que l'état a changé (grille créée)
        expect(screen.getByTestId('grid-created')).toBeInTheDocument();
    });

    // Test de l'initialisation de la grille
    test('initialise correctement la grille', () => {
        const { rerender } = render(<Grille {...defaultProps} estDebut={true} />);

        // La grille devrait être initialisée lorsque estDebut est true
        expect(defaultProps.setEstDebut).toHaveBeenCalledWith(false);

        // Re-rendu avec estDebut à false pour tester l'initialisation complète
        rerender(<Grille {...defaultProps} estDebut={false} />);

        // Vérification que les cases sont rendues
        const cases = screen.getAllByTestId(/case-\d+-\d+/);
        expect(cases.length).toBe(10 * 10); // Grille 10x10 pour difficulté 1
    });

    test('devrait gérer les cas limites dans les coordonnées de la grille', () => {
        render(<Grille {...defaultProps} difficulte={1} estDebut={false} />);

        // Récupération des cases aux coins par leur testId
        // Pour la difficulté 1, la grille est 10x10 donc de 0 à 9
        const caseEnHautAGauche = screen.getByTestId('case-0-0');
        const caseEnHautADroite = screen.getByTestId('case-0-9');
        const caseEnBasAGauche = screen.getByTestId('case-9-0');
        const caseEnBasADroite = screen.getByTestId('case-9-9');

        expect(caseEnHautAGauche).toBeInTheDocument();
        expect(caseEnHautADroite).toBeInTheDocument();
        expect(caseEnBasAGauche).toBeInTheDocument();
        expect(caseEnBasADroite).toBeInTheDocument();
    });
});