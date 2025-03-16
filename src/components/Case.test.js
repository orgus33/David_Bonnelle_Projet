import {render, fireEvent} from "@testing-library/react";
import "@testing-library/jest-dom";
import Case from "./Case";
import React from 'react';


describe("Case Component", () => {
    let props;

    beforeEach(() => {
        props = {
            estDecouvert: 0,
            setGrilleEstDecouvert: jest.fn(),
            creerGrille: jest.fn(),
            estPremierClick: false,
            etatCase: 0,
            position: [0, 0],
            activerDefaite: jest.fn(),
            decouvrirCase: jest.fn(),
            dataJeu: [10, 0],
            setDataJeu: jest.fn(),
            verifierVictoire: jest.fn(),
        };
    });

    test("doit afficher un bouton", () => {
        const {getByRole} = render(<Case {...props} />);
        expect(getByRole("button")).toBeInTheDocument();
    });

    test("doit appeler creerGrille au premier clic", () => {
        props.estPremierClick = true;
        const {getByRole} = render(<Case {...props} />);
        fireEvent.click(getByRole("button"));
        expect(props.creerGrille).toHaveBeenCalledWith([0, 0]);
    });

    test("doit appeler decouvrirCase après le premier clic", () => {
        const {getByRole} = render(<Case {...props} />);
        fireEvent.click(getByRole("button"));
        expect(props.decouvrirCase).toHaveBeenCalledWith([0, 0]);
    });

    test("doit appeler activerDefaite si une mine est découverte", () => {
        props.etatCase = -1;
        props.estDecouvert = 0;
        const {getByRole} = render(<Case {...props} />);
        fireEvent.click(getByRole("button"));
        expect(props.activerDefaite).toHaveBeenCalled();
    });

    test("doit gérer le clic droit pour marquer une case", () => {
        const {getByRole} = render(<Case {...props} />);
        fireEvent.contextMenu(getByRole("button"));
        expect(props.setGrilleEstDecouvert).toHaveBeenCalled();
        expect(props.verifierVictoire).toHaveBeenCalled();
    });

    test("doit révéler le contenu d'une cellule sans mine au clic gauche", () => {
        props.etatCase = 2; // Un chiffre (2 mines adjacentes)
        const {getByRole} = render(<Case {...props} />);
        fireEvent.click(getByRole("button"));
        expect(props.decouvrirCase).toHaveBeenCalledWith([0, 0]);
    });

    test("doit terminer le jeu si une mine est découverte", () => {
        props.etatCase = -1; // Mine
        const {getByRole} = render(<Case {...props} />);
        fireEvent.click(getByRole("button"));
        expect(props.activerDefaite).toHaveBeenCalled();
    });

    test("doit poser un drapeau au clic droit", () => {
        const {getByRole} = render(<Case {...props} />);

        // Premier clic droit pour poser le drapeau
        fireEvent.contextMenu(getByRole("button"));

        // Vérifie que setGrilleEstDecouvert a été appelé avec la valeur 2 (drapeau)
        expect(props.setGrilleEstDecouvert).toHaveBeenCalledWith(expect.any(Function));

        // Imite le comportement de setGrilleEstDecouvert en appelant la fonction de callback
        const setStateMock = props.setGrilleEstDecouvert.mock.calls[0][0];
        const fakeState = Array(10).fill().map(() => Array(10).fill(0));
        const newState = setStateMock(fakeState);

        // Vérifie que la position [0, 0] a été changée à 2 (drapeau)
        expect(newState[0][0]).toBe(2);

        // Vérifie que le compteur de drapeaux a été mis à jour
        expect(props.setDataJeu).toHaveBeenCalledWith([9, 0]);
    });

    test("doit retirer un drapeau au second clic droit", () => {
        // Prépare la case avec un drapeau déjà posé
        props.estDecouvert = 2; // 2 représente un drapeau

        const {getByRole} = render(<Case {...props} />);

        // Réinitialise les mocks pour ne pas compter les appels précédents
        props.setGrilleEstDecouvert.mockClear();
        props.setDataJeu.mockClear();

        // Second clic droit pour retirer le drapeau
        fireEvent.contextMenu(getByRole("button"));

        // Vérifie que setGrilleEstDecouvert a été appelé
        expect(props.setGrilleEstDecouvert).toHaveBeenCalledWith(expect.any(Function));

        // Imite le comportement de setGrilleEstDecouvert
        const setStateMock = props.setGrilleEstDecouvert.mock.calls[0][0];
        const fakeState = Array(10).fill().map(() => Array(10).fill(0));
        fakeState[0][0] = 2; // État initial avec drapeau
        const newState = setStateMock(fakeState);

        // Vérifie que la position [0, 0] est revenue à 0 (non découvert)
        expect(newState[0][0]).toBe(0);

        // Vérifie que le compteur de drapeaux a été mis à jour
        expect(props.setDataJeu).toHaveBeenCalledWith([11, 0]);
    });

    test("doit vérifier la victoire après avoir posé un drapeau", () => {
        const {getByRole} = render(<Case {...props} />);

        fireEvent.contextMenu(getByRole("button"));
        expect(props.verifierVictoire).toHaveBeenCalled();
    });

    test("doit afficher correctement une cellule avec un nombre", () => {
        props.etatCase = 3; // 3 mines adjacentes
        props.estDecouvert = 1; // Cellule découverte

        const {getByText} = render(<Case {...props} />);
        expect(getByText("3")).toBeInTheDocument();
    });

    test("doit afficher correctement une mine quand le jeu est perdu", () => {
        props.etatCase = -1; // Mine
        props.estDecouvert = 1; // Cellule découverte (après défaite)

        const {container} = render(<Case {...props} />);
        // Vérifie la présence de l'icône de mine en cherchant l'élément SVG avec fill="darkred"
        expect(container.querySelector('svg[fill="darkred"]')).toBeInTheDocument();
    });
});
