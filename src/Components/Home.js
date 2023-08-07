import { useState, useEffect } from "react";

import Popup from 'reactjs-popup';

import Pagify from "./Pagify";
import { useTimedMessage } from "../Utilities/useTimedMessage";

import star from "../Assets/star.png"
import starFilled from "../Assets/star-filled.png"


export default function Home(props) {
    
    const { 
      handleLogout,
      savedRecipes,
      setRecipeData,
      handleDeleteRecipe,
      handleUpdateRecipe,
      errorMessage,
      setErrorMessage,
      successMessage,
      setSuccessMessage,
      setLoadingImage,
      setImgToDownload,
      setShowCreate,
      setShowRecipeMobile,
      isMobile,
    } = props.stateProps;

    const [hoveredIndex, setHoveredIndex] = useState(-1);
    const [openRecipeIndex, setOpenRecipeIndex] = useState(-1);
    const [prompt, setPrompt] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredRecipes, setFilteredRecipes] = useState([]);

    const recipesPerPage = 6;
    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
    const startIndex = (currentPage - 1) * recipesPerPage;
    const endIndex = startIndex + recipesPerPage;
    const recipesToDisplay = filteredRecipes.slice(startIndex, endIndex);

    useEffect(() => {
        const filtered = savedRecipes.filter(recipe =>
          recipe.name.toLowerCase().includes(prompt.toLowerCase())
        );
      setFilteredRecipes(filtered);
      setCurrentPage(1);
      // eslint-disable-next-line 
    }, [ prompt]);

    async function handleShowRecipe(recipe) {
      setLoadingImage(true)
      setImgToDownload("")
      setRecipeData(recipe);
      setLoadingImage(false)
      setShowCreate(true)
      setShowRecipeMobile(true)
      setErrorMessage({
          recipe: {message: "", err: ""},
          login: {message: "", err: ""},
          register: {message: "", err: ""},
          home: {message: "", err: ""},
          sidebar: {message: "", err: ""},
      })
    }

    function handleMouseEnter(index) {
        setHoveredIndex(index);
    }

    function handleMouseLeave() {
        setHoveredIndex(-1);
    }

    function openPopup(index, favorite) {
      if(!favorite) {
        setOpenRecipeIndex(index);
      } else {
        setErrorMessage(prevError => ({
          ...prevError,
          home: {message: "Cannot delete a favorited recipe", err: "Cannot delete a favorited recipe"}
        }))
      }
        
    }
    
    function closePopup() {
        setOpenRecipeIndex(-1);
    }

    function handleDelete(id) {
        handleDeleteRecipe(id, props.stateProps);
        closePopup()
    }

    function handleSearch(e) {
      setPrompt(e.target.value)
    }

    function handleFavorite(index) {
      const currentRecipe = recipesToDisplay[index]
      currentRecipe.isFavorite = !currentRecipe.isFavorite
      handleUpdateRecipe(props.stateProps, currentRecipe);
    }

    function handleClearSearch() {
      setPrompt("")
    }

    useTimedMessage(errorMessage, setErrorMessage, successMessage, setSuccessMessage, "home");

    const recipeArray = recipesToDisplay
    .map((recipe, index) => {
        const showButtons = hoveredIndex === index;
    
        return (
          <div
            className="recipe-img-wrapper"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            key={index}
          >
            <img
              src={recipe.image}
              className="recipe-img"
              onClick={() => handleShowRecipe(recipe)}
              alt={recipe.name}
            />
    
            {(showButtons || isMobile) && (
              <div>
                <img 
                src={recipe.isFavorite ? starFilled : star} 
                onClick={() => handleFavorite(index)}
                className="favorite" 
                alt="Favorite Star"
                />
                <button
                  className="remove-item"
                  onClick={() => openPopup(index, recipe.isFavorite)}
                >
                  X
                </button>
                <p>{recipe.name}</p>
              </div>
            )}
    
            <Popup
              className="delete-recipe"
              open={openRecipeIndex === index}
              onClose={closePopup}
              position="right"
              modal
            >  
            <div className="recipe-popup">
                <p>Are you sure you want to delete this recipe?</p>
                <button className="delete-recipe" onClick={() => handleDelete(recipe.recipeId)}>Delete</button>
                <button className="cancel-delete-recipe" onClick={closePopup}>Cancel</button>
            </div>
            </Popup>
          </div>
        );
      });

      const pagifyProps = {
        currentPage,
        totalPages,
        setCurrentPage,
      }


      return (
        <div className="home-container">
            <div>
              <input 
              type="text" 
              className="search" 
              placeholder="Search Recipes"
              name="search"
              value={prompt}
              onChange={(e) => handleSearch(e)}
              />
              <span className="clear-search" onClick={handleClearSearch}>X</span>
              <br/>
              {errorMessage.home.message && <><br/><p className="error">{errorMessage.home.message}</p></>}
              {successMessage.home && <><br/><p className="green">{successMessage.home}</p></>}
              <br/>
              <Pagify pagifyProps={pagifyProps}/>
              <br/>
              <div className="recipe-image-grid">
                  {recipeArray}
              </div>
            </div>
            <br/>
            <Pagify pagifyProps={pagifyProps}/>
            <button onClick={handleLogout} className="logout">Logout</button>
        </div>
      ) 
    
}