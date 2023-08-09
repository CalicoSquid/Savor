import { useState, useEffect } from "react"

import Popup from 'reactjs-popup';

import Nav from "./Nav";
import CreateRecipe from "./CreateRecipe";
import MyRecipes from "./MyRecipes";

import logo from "../Assets/logo.png";
import prod from "../Assets/prod.png";
import dev from "../Assets/dev.png";

export default function Sidebar(props) {

    const { setRecipeData, images, handleChange, devMode, setDevMode } = props.stateProps

    const [showTimes, setShowTimes] = useState(false)
    const [showCreate, setShowCreate] = useState(true)

    const [devPW, setDevPW] = useState("")
    const [correctPW, setCorrectPW] = useState(true)

    useEffect(() => {
        const storedDevMode = localStorage.getItem('devMode');
        if (storedDevMode !== null) {
          setDevMode(JSON.parse(storedDevMode));
        } else {
          setDevMode(true); // Set a default value if not found in local storage
        }
      }, []);

    function handleToggle() {
        setShowTimes(prev => !prev)
    }

    function handleTime(e, time) {
      const { value, name } = e.target
      setRecipeData(prevState => {
          return {
              ...prevState,
              times: {
                  ...prevState.times,
                  [name] : {
                      ...prevState.times[name],
                      [time]: value
                  }
              }
          }
      })
    }

    function handleChangeDevmode() {
            const newDevMode = !devMode;
            setDevMode(newDevMode);
            localStorage.setItem('devMode', JSON.stringify(newDevMode));
            setDevPW("")
        
    }

    function handleDevPassword(e) {
        setDevPW(e.target.value)
    }





    const stateProps = {
      ...props.stateProps,
      handleChange,
      images,
      showTimes,
      showCreate,
      handleToggle,
      handleTime,
      setShowCreate,
    }

    return (
        <div className="sidebar">
            <div className="title-bar">
              <img src={logo} className="logo-img" style={{height: "100px"}} alt="Measuring spoons logo"/>
                <div className="logo-text">
                  <h1 className="logo-title">Savor</h1>
                  
                </div>

                <Popup 
                className="popup" 
                position="bottom" 
                closeOnDocumentClick={true}
                trigger={
                    <button className="devmode">
                        <img src={devMode ? prod : dev} style={{height: "30px"}} alt=""/>
                    </button>
                }>
                {close => ( // Receive the close function as a parameter
                    <div className="dev-mode-form">
                        <p>{`Enter password to switch to ${devMode ? "production" : "local"} server`}</p>
                        <input type="password" onChange={(e) => handleDevPassword(e)} value={devPW} />
                        <button
                            onClick={() => {
                                if (devPW === 'admin') {
                                    handleChangeDevmode();
                                    close();
                                    setCorrectPW(true)
                                } else {
                                    setCorrectPW(false)
                                }
                             
                            }}
                        >
                            Go
                        </button>
                        {!correctPW && <p className="error">Wrong Password!</p>}
                    </div>
  )}

                </Popup>

                <Nav stateProps={stateProps}/>
            </div>
            {showCreate && <CreateRecipe stateProps={stateProps} />}
            {!showCreate && <MyRecipes stateProps={stateProps} /> }
        </div>
    )
}