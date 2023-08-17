import { useState, useEffect } from "react"

import defaultAvatar from './Assets/Avatars/AVT-13.png';

import './SCSS/index.scss';

import Main from './Components/Main';
import checkPasswordStrength from "./Utilities/checkPassword";
import isAuthenticated from "./Utilities/auth";

import { 
  getUserData,
  handleRegister,
  handleSubmit,
  handleDeleteRecipe,
  getUserRecipes,
  handleUpdateRecipe,
  } from "./Utilities/api";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [imgToDownload, setImgToDownload] = useState("")
  const [loadingImage, setLoadingImage] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true)
  const [loginError, setLoginError] = useState(null)
  const [passwordStrength, setPasswordStrength] = useState("");
  const [savedRecipes, setSavedRecipes] = useState([])
  
  const [userData, setUserData] = useState({
    createdAt: "",
    email: "",
    password: "",
    profilePicture: defaultAvatar,
    updatedAt: "",
    username: ""
  });
  const [isSaved, setIsSaved] = useState(true)
  const [devMode, setDevMode] = useState(false)
  const [previousPage, setPreviousPage] = useState(1);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showInstruct, setShowInstruct] = useState(false)
  const [showIngred, setShowIngred] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [baseURL, setBaseURL] = useState("https://savor-recipes-server.onrender.com/api")
  const [errorMessage, setErrorMessage] = useState({
    recipe: {message: "", err: ""},
    login: {message: "", err: ""},
    register: {message: "", err: ""},
    home: {message: "", err: ""},
    sidebar: {message: "", err: ""},
    })
  const [successMessage, setSuccessMessage] = useState({
    home: "",
    login: "",
    sidebar: "",
  })
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })

  const [recipeData, setRecipeData] = useState({
      recipeId: "",
      name: "",
      description: "",
      ingredients: [],
      instructions: [],
      image: "",
      author: "",
      isFavorite: false,
      recipeYield: "",
      times: {
        cook: "",
        prep: "",
        total: "",
      }
  });

  useEffect(() => {
    if(!isSaved) {
      const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is necessary to display the alert message in some browsers
      };
  
      window.addEventListener('beforeunload', handleBeforeUnload);
  
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  // eslint-disable-next-line 
  }, []);

  useEffect(() => {
    if (!isSaved) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = undefined;
    }
    return () => {
      window.onbeforeunload = undefined;
    };
  // eslint-disable-next-line
  }, [isSaved]);


  useEffect(() => {
    devMode ? setBaseURL("http://192.168.1.109:8080/api") : setBaseURL("https://savor-recipes-server.onrender.com/api")
  }, [devMode])

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (token) {
      const fetchUserData = async () => {
        try {
          console.log(baseURL);
          const data = await getUserData(token, baseURL);
  
          setUserData(data);
          setIsLoggedIn(true);
        } catch (error) {
          console.error(error);
          setLoginError(error.message);
          setIsLoggedIn(false);
        }
      };
  
      fetchUserData();
    } else {
      setIsLoggedIn(false);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {

    if (userData) {
      const fetchUserRecipes = async () => {
        try {
          const recipes = await getUserRecipes(userData.username, baseURL);
          setSavedRecipes(recipes);
        } catch (error) {
          console.error(error);
          setSavedRecipes([]); 
        }
      };
      fetchUserRecipes();
    }
    // eslint-disable-next-line
  }, [userData]);
  

  const handleLoginChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      const strength = checkPasswordStrength(value);
      strength <= 1 ? 
      setPasswordStrength("Weak") :
      strength === 2 ? 
      setPasswordStrength("Medium") :
      setPasswordStrength("Strong");
    }
    //console.log(formData)
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(isAuthenticated());
    setLoginError(null);
    setShowLoginForm(true);
    setSavedRecipes([])
    setFormData({
      username: "",
      password: "",
    });
    setRecipeData({
      recipeId: "",
      name: "",
      description: "",
      ingredients: [],
      instructions: [],
      image: "",
      author: "",
      recipeYield: "",
      isFavorite: false,
      times: {
        cook: "",
        prep: "",
        total: "",
      }
    });
    setUserData(null);
  };


  const stateProps = {
    isLoggedIn,
    formData,
    loginError,
    showLoginForm,
    passwordStrength,
    savedRecipes,
    userData,
    recipeData,
    errorMessage,
    successMessage,
    imgToDownload,
    loadingImage,
    devMode,
    baseURL,
    isExtracting,
    isSaved,
    previousPage,
    showInstruct,
    showIngred,
    showSettings,
    darkMode,
    setIsLoggedIn,
    setFormData,
    handleLoginChange,
    handleSubmit,
    handleRegister,
    setLoginError,
    handleLogout,
    isAuthenticated,
    setShowLoginForm,
    setSavedRecipes,
    setUserData,
    setRecipeData,
    setErrorMessage,
    handleDeleteRecipe, 
    setSuccessMessage,
    handleUpdateRecipe,
    setImgToDownload,
    setLoadingImage,
    setDevMode,
    setBaseURL,
    setIsExtracting,
    setIsSaved,
    setPreviousPage,
    setShowInstruct,
    setShowIngred,
    setShowSettings,
    setDarkMode

    }

  return (
    <div className={`App ${darkMode ? "dark" : ""}`}>
      <Main stateProps={stateProps} />
    </div>
  );
}

export default App;
