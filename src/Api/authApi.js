import axios from 'axios';

import defaultAvatar from '../Assets/Avatars/AVT-13.png';

import { getUserData, getUserRecipes, handleUpdateAvatar } from './userApi';


//Login User!
export async function handleSubmit( stateProps) {

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
  
      if (!data.profilePicture) {
        console.log("setting Avatar")
        handleUpdateAvatar(stateProps, defaultAvatar)
      }
  
      setSavedRecipes(recipeArr)
      setUserData(data);
      setIsLoggedIn(isAuthenticated());
      setSuccessMessage((prevSuccess) => ({
        ...prevSuccess,
        login: response.data.message,
      }));
    } catch (error) {
  
      setErrorMessage((prevError) => ({
        ...prevError,
        login: {
          message: 'Failed to log in',
          err: error.response?.data?.message,
        },
      }));
    }
  }


  //Register user
  export async function handleRegister(stateProps) {

    const { 
      formData,
      setFormData,
      setErrorMessage,
      baseURL
      } = stateProps;
  
    setFormData((prevData) => ({ ...prevData, password: '' }));
    try {
      await axios.post(`${baseURL}/register`, formData);
      handleSubmit(stateProps);
  
    } catch (error) {
      setErrorMessage((prevError) => ({
        ...prevError,
        register: {
          message: 'Failed to register new user',
          err: error.response?.data?.message,
        },
      }));
    }
  }
  