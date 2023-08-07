import { useEffect, useState } from 'react';

import Popup from 'reactjs-popup';

export function PopupIngred(props) {

    const [open, setOpen] = useState(false);  
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        setIngredients(props.recipe.ingredients);
      }, [props.recipe.ingredients]);

      const handleAddIngredient = () => {
        setIngredients((prevIngredients) => [...prevIngredients, '']);
      };

    const handleRemoveIngredient = (index) => {
        setIngredients((prevIngredients) => prevIngredients.filter((_, i) => i !== index));
    };

    const handleIngredientChange = (index, value) => {
        setIngredients((prevIngredients) => {
        const updatedIngredients = [...prevIngredients];
        updatedIngredients[index] = value;
        return updatedIngredients;
        });
    };

    function handleSaveChanges() {
        setOpen(false)
        props.setRecipe(prev => {
            return {
                ...prev,
                ingredients: ingredients.filter(Boolean),
            }
        })
    }

    const handleCancelChanges = () => {
        setOpen(false);
        setIngredients(props.recipe.ingredients);
      };


    return (
    <>
        <button onClick={() => setOpen(o => !o)}>Edit ingredients</button>
        <Popup className="popup" position="right" open={open}>
            <div className="ingred-list">
            <p>Ingredients</p>
            <ul className="editable">
                {ingredients.map((ingredient, index) => (
                <li key={index} className="list">
                    <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    />
                    <button onClick={() => handleRemoveIngredient(index)}><span>X</span></button>
                </li>
                ))}
                <button className="add" onClick={handleAddIngredient}>
                Add Ingredient
            </button>
            </ul>
            
            <button className="save" onClick={handleSaveChanges}>
                Save
            </button>
            <button className="cancel" onClick={handleCancelChanges}>
                Cancel
            </button>
            </div>
        </Popup>
    </>
        
    )
}

export function PopupInstruct(props) {

    const [open, setOpen] = useState(false);  
    const [instructions, setInstructions] = useState([]);

    useEffect(() => {
        setInstructions(props.recipe.instructions);
      }, [props.recipe.instructions]);

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
        setOpen(false)
        props.setRecipe(prev => {
            return {
                ...prev,
                instructions: instructions
            }
        })
    }

    const handleCancelChanges = () => {
        setOpen(false);
        setInstructions(props.recipe.instructions);
      };

    return (
    <>
        <button onClick={() => setOpen(o => !o)}>Edit instructions</button>
        <Popup className="popup" position="right" open={open}>
            <div className="ingred-list">
            <p>Instructions</p>
            <ul className="editable">
                {instructions.map((instruction, index) => (
                <li key={index} className="list">
                    <input
                    type="text"
                    value={instruction.text}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    />
                    <button onClick={() => handleRemoveInstructions(index)}><span class="material-symbols-outlined">close</span></button>
                </li>
                ))}
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
        </Popup>
    </>
        
    )
}

export function PopupImageUpload(props) {
    const [open, setOpen] = useState(false);
    const [dragOver, setDragOver] = useState(false);
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        props.setRecipeData((prevRecipeData) => ({
          ...prevRecipeData,
          image: imageUrl,
        }));
      }
      setOpen(o => !o)
    };
  
    const handleBrowseClick = () => {
      
      const fileInput = document.getElementById('fileInput');
      fileInput.click();
    };
  
    const handleDragOver = (e) => {
      e.preventDefault();
      setDragOver(true);
    };
  
    const handleDragEnter = (e) => {
      e.preventDefault();
      setDragOver(true);
    };
  
    const handleDragLeave = (e) => {
      e.preventDefault();
      setDragOver(false);
    };
  
    const handleDrop = (e) => {
      e.preventDefault();
      setDragOver(false);
  
      const file = e.dataTransfer.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageSrc = event.target.result;
          props.setRecipeData((prevState) => ({
            ...prevState,
            image: imageSrc,
          }));
        };
        reader.readAsDataURL(file);
      }
    };
  
    return (
      <>
        <button onClick={() => setOpen((o) => !o)}>Upload Image</button>
        <Popup className="popup" position="right" open={open}>
          <div
            className={`image-upload ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="fileInput"
              accept=".png, .jpg, .jpeg"
              onChange={handleImageChange}
            />
            <label htmlFor="fileInput">
              <div className="drop-area">
                <p>Drag and drop images here</p>
                <p>or</p>
                <button onClick={handleBrowseClick}>Browse</button>
              </div>
            </label>
          </div>
        </Popup>
      </>
    );
  }

