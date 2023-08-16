import {handleUpdateAvatar} from "../Utilities/api"
import AvatarSelectionPage from "./Avatar"

import { useState } from "react"

export function Settings(props) {

  const {setShowSettings, userData} = props.stateProps

  function handleAvatarSelect(src) {
    props.setImgSrc(src)
  }

  async function handlesaveSettings() {
    await handleUpdateAvatar(props.stateProps, props.imgSrc)
    props.setImgSrc("")
    setShowSettings(false)
  }

  function handleCancelSetting() {
    props.setImgSrc("")
    setShowSettings(false)
  }
    
    return (
        <div className="settings">
            <div className="settings-top">
              <h3>{`Hey, ${userData.username}`}</h3>
            </div>
            <AvatarSelectionPage selectedAvatar={props.selectedAvatar} handleAvatarSelect={handleAvatarSelect}/>
          <div className="settings-buttons">
            <button className="save" onClick={handlesaveSettings}>Save Settings</button>
            <button className="cancel" onClick={handleCancelSetting}>Cancel</button>
          </div> 
        </div>
    )
  }