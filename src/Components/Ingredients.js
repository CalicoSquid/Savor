import {useState, useEffect} from "react";

import food from "../Assets/ff-default-recipe.png"

export default function Ingredients(props) {

    const {recipeData, setRecipeData, setShowIngred} = props.stateProps

    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        setIngredients(recipeData.ingredients);
      }, [recipeData.ingredients]);

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
        setShowIngred(false)
        setRecipeData(prev => {
            return {
                ...prev,
                ingredients: ingredients.filter(Boolean),
            }
        })
    }

    const handleCancelChanges = () => {
        setIngredients(recipeData.ingredients);
        setShowIngred(false)
      };


    return (    
            <div className="ingred-list">
                <div className="ingred-head">
                    <img src={recipeData.image ? recipeData.image : food} alt={recipeData.name}/>
                    <h1>{recipeData.name}</h1>
                </div>
                <br/>
                <p>Ingredients</p>
                <ul className="editable">
                    {ingredients.length > 0 ? ingredients.map((ingredient, index) => (
                    <li key={index} className="list">
                        <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                        />
                        <button onClick={() => handleRemoveIngredient(index)}><span>X</span></button>
                    </li>
                    )) : 
                    (
                        Array(5)
                        .fill('')
                        .map((x, index) => (
                            <li key={index} className="list">
                            <input
                                type="text"
                                value=""
                                onChange={(e) => handleIngredientChange(index, e.target.value)}
                            />
                            <button onClick={() => handleRemoveIngredient(index)}>
                                <span>X</span>
                            </button>
                            </li>
                        ))
                    )}
                    <br/>
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
    )
}