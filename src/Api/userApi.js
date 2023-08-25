import axios from 'axios';

//Get users data from database
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


  // Get users stored recipes from database
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

  //Update avatar and save cahnges to database
  export async function handleUpdateAvatar(stateProps, avatarSrc) {  
    const {baseURL, setUserData, setSuccessMessage, setErrorMessage} = stateProps
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${baseURL}/update-profile-picture`,
        { avatar: avatarSrc },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const data = await getUserData(token, baseURL);
        setUserData(data)
        setSuccessMessage(prevSuccess => ({
          ...prevSuccess,
          home: "Avatar updated"
        }))
      }
    } catch (error) {
      setErrorMessage(prevError => ({
        ...prevError,
        home: {
          message: "Failed to update profile",
          err: "Failed to update profile"
        }
      }))
    }
  };

  export async function handleGoPro(baseURL, setUserData, setSuccessMessage, setErrorMessage) {

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${baseURL}/go-pro`,
        { subscribed: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const data = await getUserData(token, baseURL);
        setUserData(data)
        console.log("success" + data)
        setSuccessMessage(prevSuccess => ({
          ...prevSuccess,
          home: "Thank you! Welcome to Savor Pro!"
        }))
      }

    }catch (error) {
      console.log("error")
      setErrorMessage(prevError => ({
        ...prevError,
        home: {
          message: "Something went wrong",
          err: "Something went wrong"
        }
      }))
    }
  }
