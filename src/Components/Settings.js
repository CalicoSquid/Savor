import {handleUpdateAvatar} from "../Api/api"
import AvatarSelectionPage from "./Avatar"
import gear from "../Assets/settings.png"
import gearWhite from "../Assets/settings-white.png"


export function Settings(props) {

  const {setShowSettings, userData, darkMode, setDarkMode} = props.stateProps


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
    
    return (
        <div className="settings">
          <br/>
            <div className="settings-top">
              <img src={darkMode ? gearWhite : gear} alt="settings" style={{height: "30px"}}/>
              <h2>Settings</h2>
            </div>
            <br/>
            <hr style={{border: "1px solid #4CAF50"}}/>
            <br/>
            <p>Change Display Name:</p>
            <br/>
            <input
              id="change-name"
              type="text"
              value={props.displayName}
              onChange={handleDisplayNameChange}
              placeholder="Enter new display name"
            />
          
     
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