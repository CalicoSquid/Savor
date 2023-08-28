import { useState, useEffect } from "react"

import defaultAvatar from './Assets/Avatars/AVT-1.png';

import './SCSS/index.scss';

import Main from './Components/Main';
import checkPasswordStrength from "./Utilities/checkPassword";
import isAuthenticated from "./Utilities/auth";
import { useTimedMessage } from "./Utilities/useTimedMessage";


import { handleDeleteRecipe, handleUpdateRecipe } from "./Api/recipeApi";
import { getUserData, getUserRecipes } from "./Api/userApi";
import { handleSubmit, handleRegister } from "./Api/authApi";
import { handleGoPro } from "./Api/userApi";

//localStorage.clear()

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [imgToDownload, setImgToDownload] = useState("")
  const [loadingImage, setLoadingImage] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true)
  const [loginError, setLoginError] = useState(null)
  const [passwordStrength, setPasswordStrength] = useState("");
  const [savedRecipes, setSavedRecipes] = useState([])
  const [isSaved, setIsSaved] = useState(true)
  const [devMode, setDevMode] = useState(false)
  const [previousPage, setPreviousPage] = useState(1);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showInstruct, setShowInstruct] = useState(false)
  const [showIngred, setShowIngred] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [resetToken, setResetToken] = useState('');
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

  const [userData, setUserData] = useState({
    createdAt: "",
    email: "",
    password: "",
    profilePicture: defaultAvatar,
    updatedAt: "",
    username: "",
    subscribed: "",
  });

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

  const [isProUser, setIsProUser] = useState(userData?.subscribed ? userData.subscribed : false);
  const [showPayment, setShowPayment] = useState(false);
  const [message, setMessage] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("")


  //////

  useEffect(() => {
    console.log(userData?.subscribed)
    if (userData?.subscribed === true) {
      setIsProUser(true)
    }
  }, [userData])


  //////

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isSuccess = urlParams.get('success');
    const isCanceled = urlParams.get('canceled');
    const newUrl = window.location.origin;

    if (isSuccess) {
      window.history.replaceState({}, document.title, newUrl);
      setShowPayment(true)
      setIsProUser(true)
      setMessage('Payment Successful! Start enjoying Savor Pro now.');
      handleGoPro(baseURL, setUserData, setSuccessMessage, setErrorMessage)
      
      
    } else if (isCanceled) {
      setShowPayment(true)
      setMessage('Order canceled -- continue to shop around and checkout when you\'re ready.');
      setIsProUser(false)
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  /////

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setResetToken(token);
      setShowReset(true)
    }
  }, []);

  /////

  useEffect(() => {
    if(!isSaved) {
      const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = '';
      };
  
      window.addEventListener('beforeunload', handleBeforeUnload);
  
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  // eslint-disable-next-line 
  }, []);

  /////

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

  /////

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

  /////

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

  /////

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
    setUserData({
      createdAt: "",
      email: "",
      password: "",
      profilePicture: defaultAvatar,
      updatedAt: "",
      username: "",
      subscribed: "",
    });
    setIsProUser(false)
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
    resetToken,
    showReset,
    isProUser,
    showPayment,
    message,
    paymentMessage,
    setIsLoggedIn,
    setFormData,
    setPasswordStrength,
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
    setDarkMode,
    setResetToken,
    setShowReset,
    setIsProUser,
    setShowPayment,
    setMessage,
    setPaymentMessage,
    }

    useTimedMessage(stateProps)

  return (
    <div className={`App ${darkMode ? "dark" : ""}`}>
      <Main stateProps={stateProps} />
    </div>
  );
}

export default App;
