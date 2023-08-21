import { useState, useEffect } from "react";

import Popup from 'reactjs-popup';

import Pagify from "./Pagify";
import HomeHead from "./HomeHead";
import { Settings } from "./Settings";
import { useTimedMessage } from "../Utilities/useTimedMessage";

import star from "../Assets/star.png"
import starFilled from "../Assets/star-filled.png"
import empty from "../Assets/empty.png"
import avatar from "../Assets/Avatars/AVT-13.png"

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
      setLoadingImage,
      setImgToDownload,
      setShowCreate,
      setShowRecipeMobile,
      isMobile,
      recipeData,
      isSaved,
      previousPage,
      setPreviousPage,
      showSettings,
      userData,
      setDarkMode
    } = props.stateProps;

    const [hoveredIndex, setHoveredIndex] = useState(-1);
    const [openRecipeIndex, setOpenRecipeIndex] = useState(-1);
    const [prompt, setPrompt] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [selectedAvatar, setSelectedAvatar] = useState(avatar);
    const [imgSrc, setImgSrc] = useState("")
    const [displayName, setDisplayName] = useState(userData.username)

    const recipesPerPage = 6;
    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
    const startIndex = (currentPage - 1) * recipesPerPage;
    const endIndex = startIndex + recipesPerPage;
    const recipesToDisplay = filteredRecipes.slice(startIndex, endIndex);

    useEffect(() => {
      const storedDisplayName = localStorage.getItem(`userDisplayName_${userData.username}`);
      if (storedDisplayName) {
        setDisplayName(storedDisplayName);
      }

      const storedDarkMode = localStorage.getItem(`userDarkMode_${userData.username}`);
    if (storedDarkMode) {
      setDarkMode(storedDarkMode === 'true');
    } else {
      setDarkMode(false)
    }
      // eslint-disable-next-line
    }, []); 

    useEffect(() => {
        const filtered = savedRecipes.filter(recipe =>
          recipe.name.toLowerCase().includes(prompt.toLowerCase())
        );
      setFilteredRecipes(filtered);
      setCurrentPage(1);
      // eslint-disable-next-line 
    }, [ prompt]);

    useEffect(() => {
      setFilteredRecipes(savedRecipes)
      setCurrentPage(previousPage);
    // eslint-disable-next-line
    }, [savedRecipes])

    
    async function handleShowRecipe(recipe) {

      if (!isSaved && recipe.recipeId !== recipeData.recipeId) {
        const userConfirmed = window.confirm(
          "You have unsaved changes! Are you sure you want to leave this page?"
        );
    
        if (!userConfirmed) {
          return; 
        }
      }

      setPreviousPage(currentPage);
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

    async function handleDelete(id) {
       await handleDeleteRecipe(id, props.stateProps);
        closePopup()
    }

    function handleFavorite(index) {
      const currentRecipe = recipesToDisplay[index]
      currentRecipe.isFavorite = !currentRecipe.isFavorite
      handleUpdateRecipe(props.stateProps, currentRecipe);
    }

    useTimedMessage(props.stateProps, "home");

    if(recipesToDisplay.length === 0 && !showSettings && !prompt) {
      return (
        <div className="empty">
          <HomeHead 
          stateProps={props.stateProps} 
          handleLogout={handleLogout}
          imgSrc={imgSrc}
          prompt={prompt}
          setPrompt={setPrompt}
          />
          <br/>
          <h2>There seems to be nothing here...</h2>
          <br/>
          <p>Start adding some recipes 
            {" "}
            <span className="green" onClick={() => setShowCreate(true)} style={{cursor: "pointer"}}>here</span>
            , or click the Create/Edit tab above.
          </p>
          <br/>
          <img src={empty} alt="empty avocado"/>
        </div>
      )
    }


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
              <div style={{cursor: "pointer"}}>
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
                <p className="desktop-text" onClick={() => handleShowRecipe(recipe)} >{recipe.name}</p>
                
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
        setPreviousPage,
        recipesPerPage
      }


      return (

        <div className="home-container">
          <HomeHead 
          stateProps={props.stateProps} 
          handleLogout={handleLogout}
          imgSrc={imgSrc}
          prompt={prompt}
          setPrompt={setPrompt}
          />
         {showSettings ? 
          <Settings 
          stateProps={props.stateProps} 
          selectedAvatar={selectedAvatar} 
          setSelectedAvatar={setSelectedAvatar}
          imgSrc={imgSrc}
          setImgSrc={setImgSrc}
          displayName={displayName}
          setDisplayName={setDisplayName}
          /> : 
            <div>
              <br/>
              {errorMessage.home.message && <><br/><p className="error">{errorMessage.home.message}</p></>}
              {successMessage.home && <><br/><p className="green">{successMessage.home}</p></>}
              <br/>
              {recipeArray.length > 0 ? 
              <>
              <h2>{`${displayName}'s Recipes`}</h2>
              <br/>
              <Pagify pagifyProps={pagifyProps}/>
              <br/>
              <div className="recipe-image-grid">
                  {recipeArray}
              </div>
              <br/>
              <Pagify pagifyProps={pagifyProps}/></> 
              :<>
              <br/>
              <h2>No Recipes found!</h2>
              <br/>
              <p onClick={() => setPrompt("")} style={{cursor: "pointer"}}><span className="green">←</span> Go Back</p>
              </>
              
               }
              <br/>
            </div>}
        </div>
      ) 
    
}