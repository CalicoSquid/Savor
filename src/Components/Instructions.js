import {useState, useEffect} from "react";

import food from "../Assets/no-image.jpg"

export default function Instructions(props) {

    const {recipeData, setRecipeData, setShowInstruct} = props.stateProps
    const [instructions, setInstructions] = useState([]);

    useEffect(() => {
        setInstructions(recipeData.instructions);
      }, [recipeData.instructions]);

    const handleAddInstructions = () => {
        setInstructions((prevInstructions) => [...prevInstructions, '']);
    };

    const handleRemoveInstructions = (index) => {
        setInstructions((prevInstructions) => prevInstructions.filter((_, i) => i !== index));
    };

    const handleInstructionChange = (index, value) => {
        setInstructions((prevInstructions) => {
        const updatedInstructions = [...prevInstructions];
        updatedInstructions[index] = {text: value};
        return updatedInstructions;
        });
    };

    function handleSaveChanges() {
        setShowInstruct(false)
        setRecipeData(prev => {
            return {
                ...prev,
                instructions: instructions
            }
        })
    }

    const handleCancelChanges = () => {
        setShowInstruct(false);
        setInstructions(recipeData.instructions);
      };

      function calculateRowCount(text) {
        if(text) {
            const lines = text.split('\n'); // Split text into lines
            const lineCount = lines.length; // Count the number of lines
            const minHeight = 1; // Minimum number of rows

            return Math.max(lineCount, minHeight);
        }
        
      }

    return (
            <div className="ingred-list">
                <div className="ingred-head">
                    <img src={recipeData.image ? recipeData.image : food} alt={recipeData.name}/>
                    <h1>{recipeData.name}</h1>
                </div>
                <br/>
                <p>Instructions</p>
                <ul className="editable">
                {instructions.length > 0 ? (
                    instructions.map((instruction, index) => (
                    <li key={index} className="list">
                        <textarea
                        type="text"
                        rows={calculateRowCount(instruction.text)}
                        value={instruction.text}
                        onChange={(e) => handleInstructionChange(index, e.target.value)}
                        />
                        <button onClick={() => handleRemoveInstructions(index)}>
                        <span>X</span>
                        </button>
                    </li>
                    ))
                ) : (
                    Array(5)
                    .fill('')
                    .map((x, index) => (
                        <li key={index} className="list">
                        <input
                            type="text"
                            value=""
                            onChange={(e) => handleInstructionChange(index, e.target.value)}
                        />
                        <button onClick={() => handleRemoveInstructions(index)}>
                            <span>X</span>
                        </button>
                        </li>
                    ))
                )}
                <br/>
                <button className="add" onClick={handleAddInstructions}>
                    Add Instructions
                </button>
                </ul>
                
                <button className="save" onClick={handleSaveChanges}>
                    Save
                </button>
                <button className="cancel" onClick={handleCancelChanges}>
                    Cancel
                </button>
            </div>
        
    )
}