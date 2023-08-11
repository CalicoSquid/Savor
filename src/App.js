import { useState, useEffect } from "react"

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
  const [userData, setUserData] = useState(null);
  const [devMode, setDevMode] = useState(false)
  const [baseURL, setBaseURL] = useState("https://server-puib.onrender.com/api")
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
    devMode ? setBaseURL("http://192.168.1.109:5000/api") : setBaseURL("https://server-puib.onrender.com/api")
    console.log(baseURL)
    // eslint-disable-next-line
  }, [devMode])

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUserData = async () => {
      try {
        if (token) {
          const data = await getUserData(token, baseURL);
          setUserData(data);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error(error);
        setLoginError(error.message)
        setIsLoggedIn(false);
      } 
    };

    fetchUserData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {

    if (userData) {
      const fetchUserRecipes = async () => {
        try {
          const recipes = await getUserRecipes(userData.username, baseURL);
          console.log(recipes)
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
    }

  return (
    <div className="App">
      <Main stateProps={stateProps} />
    </div>
  );
}

export default App;
