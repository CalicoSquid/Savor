import gear from "../Assets/settings.png"
import logout from "../Assets/logout.png"
import gearWhite from "../Assets/settings-white.png"
import logoutWhite from "../Assets/logout-white.png"

export default function HomeHead({stateProps, prompt, setPrompt, handleLogout, imgSrc}) {

    const {userData, setShowSettings, darkMode} = stateProps;

    function handleSettings() {
        setShowSettings(s => !s)
    }

    return (
        <div className="home-head-container">
            <div className="home-head-user">
                <img src={imgSrc ? imgSrc : userData.profilePicture} alt="avatar"/>
                
            </div>

            <div className="home-head-search">
                    <input 
                    type="text" 
                    className="search" 
                    placeholder="Search"
                    name="search"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    />
                    
                </div>


            
                <div className="home-head-buttons">
                    <img 
                    src={darkMode ? gearWhite :gear} 
                    alt="settings" 
                    style={{height: "30px", cursor: "pointer"}}
                    onClick={handleSettings}
                    />
                    <img 
                    src={darkMode ? logoutWhite : logout} 
                    alt="logout" 
                    style={{height: "30px", cursor: "pointer"}}
                    onClick={handleLogout}
                    />              
                </div>          

                
            
            
        </div>
    )
}