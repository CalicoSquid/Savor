import axios from 'axios';

import defaultAvatar from '../Assets/Avatars/AVT-1.png';

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
      baseURL,
      setIsProUser,
    } = stateProps;
  
    try {
      const response = await axios.post(`${baseURL}/login`, formData);
      const token = response.data.token;
      localStorage.setItem('token', token);
      const data = await getUserData(token, baseURL);
      console.log(data)
      const recipeArr = await getUserRecipes(data.username, baseURL)
  
      if (!data.profilePicture) {
        console.log("setting Avatar")
        handleUpdateAvatar(stateProps, defaultAvatar)
      }

      if (data.subscribed === true) {
        console.log("PRO")
        setIsProUser(true)
      } else {
        console.log("FALSE")
        setIsProUser(false)
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


  export async function changePassword(newPassword, token, stateProps) {

    const {
      setErrorMessage,
      setSuccessMessage,
      baseURL,
    } = stateProps;
    
    try {
      const response = await axios.post(`${baseURL}/reset-password`, {
        newPassword,
        token, // Include the token in the request body
      });
      if (response.data.success) {
        setSuccessMessage(prevSuccess => ({
          ...prevSuccess,
          login: response.data.message
        }))
      }
    } catch (error) {
      console.log(error)
      setErrorMessage(prevError => ({
        ...prevError,
        login: {
          message: "Failed to update password",
          err: error?.message
        }
      }))
    }
  }
  