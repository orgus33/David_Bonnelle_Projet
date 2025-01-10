function Grille({mode, data, dataUpdate}) {

    return (
        <div>
            <p>Grille de difficulté {mode}</p>
            <input type="range" className="form-range" id="customRange1" value={data[0]}
                   min="0" max="200"
           onChange={event => {
               const newData = [...data];
               newData[0] = Number(event.target.value);
               dataUpdate(newData);
            }}/>
            <input type="range" className="form-range" id="customRange1" value={data[1]}
                   min="0" max="200"
           onChange={event => {
               const newData = [...data];
               newData[1] = Number(event.target.value);
               dataUpdate(newData);
            }}/>
        </div>
    );
}
export default  Grille;