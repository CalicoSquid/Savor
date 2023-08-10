import { PopupIngred, PopupInstruct, PopupImageUpload } from "./Popups";
import searchImages from "../Utilities/searchImages";
import { handleSaveRecipe } from "../Utilities/api";

import food from "../Assets/ff-default-recipe.png"

export default function CreateRecipe(props) {
    
    const { 
        url,
        setUrl,
        handleExtractRecipe,
        recipeData,
        setRecipeData,
        handleToggle,
        handleChange,
        handleTime,
        images,
        showTimes,
        setImages,
        errorMessage,
        successMessage,
        setErrorMessage,
        setSuccessMessage,
        handleUpdateRecipe,
        savedRecipes,
    } = props.stateProps

    //useTimedMessage(errorMessage, setErrorMessage, successMessage, setSuccessMessage, "sidebar");

    async function handleGetImages() {     
        await searchImages(recipeData.name, handleChange, setImages, 3)

    }

    async function handleSaveOrUpdateRecipe(recipe) {
        const existingRecipe = savedRecipes.find(savedRecipe => savedRecipe.recipeId === recipe.recipeId);

        if (existingRecipe) {
            await handleUpdateRecipe(props.stateProps);
        } else {
            await handleSaveRecipe(props.stateProps);
        }
    }

    function isValidUrl(url) {
        const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
        return pattern.test(url);
      }


    return (
        <div className="sidebar-info">
                <div className="recipe-form">
                    <p className="side-header">Import Recipe:</p>
                    <input
                        type="url"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Url"
                        required
                    />
                    <button onClick={() => handleExtractRecipe(props.stateProps)} disabled={!isValidUrl(url)}>
                        Extract Recipe
                    </button>
                    {errorMessage.sidebar.message && <p className="error">{errorMessage.sidebar.message}</p>}
                    </div>

                <br/>
                <p className="green">Or</p>
                <br/>
                
                <div className="add-own recipe-form">
                    <p className="side-header">Add your Own:</p>
                    <small>Title</small>
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Title" 
                        value={recipeData.name} 
                        onChange={handleChange}
                    >
                    </input>

                    <div className="form-buttons">
                        <PopupIngred recipe={recipeData} setRecipe={setRecipeData}/>
                        <PopupInstruct recipe={recipeData} setRecipe={setRecipeData} />
                        <PopupImageUpload setRecipeData={setRecipeData}/>
                        <button onClick={handleGetImages}>Generate New Images</button>                  
                    </div>
                    
                    <div className="image-grid">
                        {
                        images.length > 0 ? images : 
                        <div className="img-wrapper">
                            <img src={recipeData.image ? recipeData.image : food} alt={recipeData.name}/>
                        </div>
                        }
                    </div>

                    <small>Description</small>
                    <textarea 
                        type="textarea" 
                        rows={4}
                        name="description" 
                        placeholder="Add description" 
                        onChange={handleChange}
                        value={recipeData.description}
                    >
                    </textarea>
                    <small>Yield</small>
                    <input 
                    type="text" 
                    name="recipeYield" 
                    placeholder="1" 
                    onChange={handleChange}
                    value={recipeData.recipeYield}
                    >
                    </input>
                    
                    <small>Author</small>
                    <input 
                    type="text" 
                    name="author" 
                    placeholder="Author" 
                    onChange={handleChange}
                    value={recipeData.author}
                    >
                    </input>

                    <small>Link</small>
                    <input 
                    type="text" 
                    name="url" 
                    placeholder="URL" 
                    onChange={handleChange}
                    value={recipeData.url}
                    >
                    </input>

                    <button onClick={handleToggle}>Add cooking times</button>
                    {showTimes && 
                    <div className="times-wrapper">
                        <div className="prep times">
                        <p>Prep Time:</p>
                        <div className="time-col">
                            <small>Hours</small>
                            <input 
                                type="number" 
                                value={recipeData.times.prep.hours}
                                name="prep" 
                                placeholder={0}
                                onChange={(e) => handleTime(e, "hours")}
                            ></input>
                        </div>
                        <div className="time-col">
                            <small>Minutes</small>
                            <input 
                                type="number" 
                                value={recipeData.times.prep.minutes}
                                name="prep" 
                                placeholder={0}
                                onChange={(e) => handleTime(e, "minutes")}
                            ></input>
                        </div>
                    </div>
                    <div className="cook times">
                    <p>Cook Time:</p>
                    <div className="time-col">
                        <input 
                        type="number" 
                        value={recipeData.times.cook.hours}
                        name="cook" 
                        placeholder={0}
                        onChange={(e) => handleTime(e, "hours")}
                        ></input>
                    </div>
                    <div className="time-col">
                        <input 
                        type="number" 
                        value={recipeData.times.cook.minutes}
                        name="cook" 
                        placeholder={0}
                        onChange={(e) => handleTime(e, "minutes")}
                        ></input>
                    </div>
                    
                </div>
            </div>    
                    }
            {successMessage.sidebar && <p className="green">{successMessage.sidebar}</p>}
            {errorMessage.sidebar.message && <p className="error">{errorMessage.sidebar.message}</p>}
            <button className="save" onClick={() => handleSaveOrUpdateRecipe(recipeData)}>Save Recipe</button>
            </div>
        </div>    
    )
}