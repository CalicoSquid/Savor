import { handleUpdateAvatar } from "../Api/userApi"
import AvatarSelectionPage from "./Avatar"

export function Settings(props) {

  const {
    setShowSettings, 
    userData, 
    darkMode, 
    setDarkMode, 
    isProUser, 
    setShowPayment,
    savedRecipes,
  } = props.stateProps


  function handleAvatarSelect(src) {
    props.setImgSrc(src)
  }

  const handleDisplayNameChange = (event) => {
    props.setDisplayName(event.target.value);
  };
  

  async function handlesaveSettings() {
    if (props.imgSrc) {
      await handleUpdateAvatar(props.stateProps, props.imgSrc)
      props.setImgSrc("")
    }
    localStorage.setItem(`userDisplayName_${userData.username}`, props.displayName);
    localStorage.setItem(`userDarkMode_${userData.username}`, darkMode);
    setShowSettings(false)
  }

  function handleCancelSetting() {
    props.setImgSrc("")
    setShowSettings(false)
  }

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const maxRecipes = isProUser ? "Unlimited" : "20";
  const userRecipesAmount = savedRecipes.length
    
    return (
        <div className="settings">
            <br/>
            {!isProUser &&  
            <>
              <div className="go-pro-container">
                <h1>Go Pro</h1>
                <p>Get Savor pro and unlock unlimited recipes for only $5!</p>
                <button onClick={() => setShowPayment(true)}>Upgrade to Savor Pro</button>
              </div>
              <br/>
              <hr style={{border: "1px solid #4CAF50"}}/>
            </>
            }
            
            <br/>
            <p>Your Recipes: <span className="recipe-count">{`${userRecipesAmount} / ${maxRecipes} `}</span></p>
            <br/>
            <hr style={{border: "1px solid #4CAF50"}}/>
            <br/>
            <p>Display Name: 
              {" "}
              <input
                id="change-name"
                type="text"
                value={props.displayName}
                onChange={handleDisplayNameChange}
                placeholder="Enter new display name"
              />
          </p>
     
            <br/>
            <hr style={{border: "1px solid #4CAF50"}}/>
            <br/>
            <p>Choose your chef!</p>
            <br/>
            <AvatarSelectionPage selectedAvatar={props.selectedAvatar} handleAvatarSelect={handleAvatarSelect}/>
            <hr style={{border: "1px solid #4CAF50"}}/>
            <br/>
            <div className="dark-mode-toggle">
              <input
                type="checkbox"
                id="darkModeToggle" 
                checked={darkMode}
                onChange={handleDarkModeToggle}
              />
              <label htmlFor="darkModeToggle" className="toggle-slider"></label>
              <span>{`Switch to ${darkMode ? "light" : "dark"} mode:`}</span>
            </div>
            <br/>
            <hr style={{border: "1px solid #4CAF50"}}/>
            <br/>
          <div className="settings-buttons">
            <button className="save" onClick={handlesaveSettings}>Save Settings</button>
            <button className="cancel" onClick={handleCancelSetting}>Cancel</button>
          </div> 
        </div>
    )
  }