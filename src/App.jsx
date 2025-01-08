import Grille from "./components/Grille.jsx";
import {useState} from "react";

const App = () => {

    const [isOpen, setIsOpen] = useState(false);

    const togglePopover = () => {
        setIsOpen(!isOpen);
    };

  return (
      <>
          <h1 className=" font-bold underline">
              TODO: Faire les consignes du jeu ici et le reste (style de base de la page, footer ?, ...)
          </h1>

          <div className="relative inline-block">
              <button
                  onClick={togglePopover}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                  Toggle Popover
              </button>
              {isOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <div className="p-4 text-sm text-gray-700">
                          <p>Voici un popover simple.</p>
                          <p>Ajoutez plus de contenu ici !</p>
                      </div>
                  </div>
              )}
          </div>

          <Grille/>
      </>
  )
}

export default App
