import axios from 'axios';
import { parse } from 'tinyduration';
import config from './config';
import { nanoid } from 'nanoid';

import defaultImg from "../Assets/ff-default-recipe.png"

//const baseURL = config.baseURL;

export async function getUserData(token, baseURL) {
  try {
    const response = await axios.get(`${baseURL}/user-data`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch user data');
  }
}

export async function handleSubmit(e, stateProps) {
  e.preventDefault();

  const {
    formData,
    setUserData,
    setIsLoggedIn,
    isAuthenticated,
    setErrorMessage,
    setSuccessMessage,
    setSavedRecipes,
    baseURL
  } = stateProps;

  try {
    const response = await axios.post(`${baseURL}/login`, formData);
    const token = response.data.token;
    localStorage.setItem('token', token);
    const data = await getUserData(token, baseURL);
   
    const recipeArr = await getUserRecipes(data.username, baseURL)
    setSavedRecipes(recipeArr)
    setUserData(data);
    setIsLoggedIn(isAuthenticated());
    setErrorMessage((prevError) => ({
      ...prevError,
      recipe: { message: '', err: '' },
    }));
    setSuccessMessage((prevSuccess) => ({
      ...prevSuccess,
      recipe: response.data.message,
    }));
  } catch (error) {
    setErrorMessage((prevError) => ({
      ...prevError,
      recipe: {
        message: 'Failed to log in',
        err: error.response?.data?.message,
      },
    }));
  }
}

export async function handleRegister(e, stateProps) {
  e.preventDefault();
  const { 
    formData,
    setFormData,
    setErrorMessage,
    baseURL
    } = stateProps;

  setFormData((prevData) => ({ ...prevData, password: '' }));
  try {
    await axios.post(`${baseURL}/register`, formData);
    setErrorMessage((prevError) => ({
      ...prevError,
      register: { message: '', err: '' },
    }));
    handleSubmit(e, stateProps);
  } catch (error) {
    setErrorMessage((prevError) => ({
      ...prevError,
      register: {
        message: 'Failed to register new user',
        err: error.response.data.message,
      },
    }));
  }
}

export async function handleDeleteRecipe(id, stateProps) {

  const { 
    setSavedRecipes, 
    savedRecipes,
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
    console.log(savedRecipes)
    if (response.data.success) {
      setSavedRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe.recipeId !== id)
      );
      console.log(savedRecipes)
      setSuccessMessage((prevSuccess) => ({
        ...prevSuccess,
        home: response.data.message,
      }));
    } else {
      setErrorMessage((prevError) => ({
        ...prevError,
        home: {
          message: 'Failed to delete recipe',
          err: response.data.message,
        },
      }));
    }
  } catch (error) {
    setErrorMessage((prevError) => ({
      ...prevError,
      home: {
        message: 'Failed to delete recipe',
        err: error.message,
      },
    }));
  }
}

export async function handleExtractRecipe(stateProps) {
  const {
    setErrorMessage,
    setRecipeData,
    searchNestedObj,
    url,
    parseInstruct,
    baseURL,
  } = stateProps;

  try {
    const response = await axios.post(`${baseURL}/scrape`, { url });
    const data = response.data;
    if (!data) {
      setErrorMessage((prevError) => ({
        ...prevError,
        recipe: { message: 'No data found for the given URL', err: '' },
        sidebar: { message: 'No data found for the given URL', err: '' },
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
   
  } catch (error) {
    console.log(error)
    setErrorMessage((prevError) => ({
        ...prevError,
        recipe: { message: `Error extracting recipe from ${url}`, err: '' },
        sidebar: { message: `Error extracting recipe from ${url}`, err: '' },
      }));
  }
}

  export async function getUserRecipes(userId, baseURL) {

    try {
      const response = await axios.get(`${baseURL}/recipes/${userId}`);
      const recipes = response.data.recipes;
      
      return recipes.reverse();
      
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch user recipes");
    }
  };

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
      const response = await axios.post(`${baseURL}/save-recipe`, {
        userId: userData.username,
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
      });
  
      if (response.data.success) {
        const recipes = await getUserRecipes(userData.username, baseURL);
        setShowCreate(false);
        setSavedRecipes(recipes);
        setSuccessMessage((prevSuccess) => ({
          ...prevSuccess,
          home: 'Recipe saved successfully',
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
      const response = await axios.put(`${baseURL}/recipes/${recipeId}`, {
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
      });
  
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
          home: 'Recipe updated successfully',
        }));
      }
    } catch (error) {
      setErrorMessage((prevError) => ({
        ...prevError,
        sidebar: {
          message: 'Recipe failed to update',
          err: error.response.message,
        },
      }));
    }
  }



