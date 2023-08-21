import axios from 'axios';
import { parse } from 'tinyduration';
import { nanoid } from 'nanoid';

import defaultImg from "../Assets/no-image.jpg";
import food from "../Assets/ff-default-recipe.png";

import { getUserRecipes } from './userApi';

// Delete Recipe from Database
export async function handleDeleteRecipe(id, stateProps) {

    const { 
      setSavedRecipes, 
      setErrorMessage, 
      setSuccessMessage, 
      baseURL
    } = stateProps;
  
    try {
      const response = await axios.delete(`${baseURL}/recipes/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.data.success) {
        setSavedRecipes((prevRecipes) =>
          prevRecipes.filter((recipe) => recipe.recipeId !== id)
        );
  
        setSuccessMessage((prevSuccess) => ({
          ...prevSuccess,
          home: response.data.message,
        }));
      } else {
  
        setErrorMessage((prevError) => ({
          ...prevError,
          home: {
            message: 'Failed to delete recipe',
            err: response?.data?.message,
          },
        }));
      }
    } catch (error) {
      setErrorMessage((prevError) => ({
        ...prevError,
        home: {
          message: 'Failed to delete recipe',
          err: error?.message,
        },
      }));
    }
  }
  
  //Recipe WebScraper... Extract Recipe from HTML
  export async function handleExtractRecipe(stateProps) {
    const {
      setErrorMessage,
      setRecipeData,
      searchNestedObj,
      url,
      parseInstruct,
      baseURL,
      setIsExtracting
    } = stateProps;
  
    setIsExtracting(true)
  
    try {
      const response = await axios.post(`${baseURL}/scrape`, { url });
      const data = response.data;
      if (!data) {
        setErrorMessage((prevError) => ({
          ...prevError,
          recipe: { message: `No data found for ${url}`, err: '' },
          sidebar: { message: `No data found for ${url}`, err: '' },
        }));
        return;
      }
  
      let recipe = Array.isArray(data) ? data[0] : data;
  
      if (!recipe.name) recipe = searchNestedObj(recipe, ['recipeInstructions', 'ingredients',]).object;
  
  
      let image = Array.isArray(recipe.image)
        ? recipe.image[0]
        : recipe.image.hasOwnProperty('url')
        ? recipe.image.url
        : defaultImg;
  
      setRecipeData({
        recipeId: nanoid(),
        name: recipe.name.trim(),
        description: recipe.description,
        ingredients: recipe.recipeIngredient ? recipe.recipeIngredient : [],
        instructions:
            typeof recipe.recipeInstructions !== 'string'
            ? recipe.recipeInstructions
            : parseInstruct(recipe.recipeInstructions),
        image: image,
        isFavorite: false,
        author: recipe.author ? recipe.author.name : "",
        recipeYield: recipe.recipeYield,
        times: {
          cook: recipe.cookTime
            ? {
                hours: parse(recipe.cookTime).hours || 0,
                minutes: parse(recipe.cookTime).minutes || 0,
              }
            : { hours: 0, minutes: 0 },
          prep: recipe.prepTime
            ? {
                hours: parse(recipe.prepTime).hours || 0,
                minutes: parse(recipe.prepTime).minutes || 0,
              }
            : { hours: 0, minutes: 0 },
          total: recipe.totalTime
            ? {
                hours: parse(recipe.totalTime).hours || 0,
                minutes: parse(recipe.totalTime).minutes || 0,
              }
            : { hours: 0, minutes: 0 },
        },
      });
     setIsExtracting(false)
  
    } catch (error) {
      console.log(error)
      setIsExtracting(false)
      setErrorMessage((prevError) => ({
          ...prevError,
          recipe: { message: `Error extracting recipe from ${url}`, err: '' },
          sidebar: { message: `Error extracting recipe from ${url}`, err: '' },
        }));
    }
  }
  
// Save New Recipoe to Database
export async function handleSaveRecipe(stateProps) {
      const {
        recipeData,
        setSavedRecipes,
        userData,
        setErrorMessage,
        setSuccessMessage,
        setShowCreate,
        baseURL,
      } = stateProps;
    
      let {
        recipeId,
        name,
        description,
        ingredients,
        instructions,
        author,
        image,
        isFavorite,
        recipeYield,
        times,
      } = recipeData;
      name = name.trim();
    
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage or your preferred storage mechanism
    
        const response = await axios.post(
          `${baseURL}/save-recipe`,
          {
            userId: userData.username,
            recipeId: recipeId ? recipeId : nanoid(),
            name,
            description,
            ingredients,
            instructions,
            author,
            image: image ? image : defaultImg,
            isFavorite,
            recipeYield,
            times,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the Authorization header
            },
          }
        );
    
        if (response.data.success) {
          const recipes = await getUserRecipes(userData.username, baseURL);
          setShowCreate(false);
          setSavedRecipes(recipes);
          setSuccessMessage((prevSuccess) => ({
            ...prevSuccess,
            home: 'Recipe saved',
          }));
        }
      } catch (error) {
        setErrorMessage((prevError) => ({
          ...prevError,
          sidebar: {
            message: 'Failed to save recipe',
            err: error.response.data.message,
          },
        }));
      }
    }
    
    //Update existing recipe in database
    export async function handleUpdateRecipe(stateProps, recipe) {
      const {
        recipeData,
        userData,
        setErrorMessage,
        setSuccessMessage,
        savedRecipes,
        setSavedRecipes,
        setShowCreate,
        baseURL,
      } = stateProps;
    
      const {
        recipeId,
        name,
        description,
        ingredients,
        instructions,
        author,
        image,
        isFavorite,
        recipeYield,
        times,
      } = recipe ? recipe : recipeData;
    
      try {
        const token = localStorage.getItem('token'); 
    
        const response = await axios.put(
          `${baseURL}/recipes/${recipeId}`,
          {
            userId: userData.username,
            name,
            description,
            ingredients,
            instructions,
            author,
            image,
            isFavorite,
            recipeYield,
            times,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );
    
        if (response.data.success) {
          const updatedRecipe = response.data.updatedRecipe;
    
          const updatedIndex = savedRecipes.findIndex(
            (recipe) => recipe.recipeId === recipeId
          );
    
          if (updatedIndex !== -1) {
            const newSavedRecipes = savedRecipes.filter(
              (recipe, index) => index !== updatedIndex
            );
    
            newSavedRecipes.unshift(updatedRecipe);
    
            setSavedRecipes(newSavedRecipes);
            setShowCreate(false);
          }
    
          setSuccessMessage((prevSuccess) => ({
            ...prevSuccess,
            home: 'Recipe updated',
          }));
        } else {
          setErrorMessage((prevError) => ({
            ...prevError,
            sidebar: {
              message: 'Failed to update recipe',
              err: response?.data?.message,
            },
          }));
        }
      } catch (error) {
        setErrorMessage((prevError) => ({
          ...prevError,
          sidebar: {
            message: 'Recipe failed to update',
            err: error?.response?.message,
          },
        }));
      }
    }
    