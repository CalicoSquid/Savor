import { useState, useEffect } from "react"

import Nav from "./Nav";
import CreateRecipe from "./CreateRecipe";
import MyRecipes from "./MyRecipes";

import logo from "../Assets/logo.png"

export default function Sidebar(props) {

    const { setRecipeData, images, handleChange, devMode, setDevMode } = props.stateProps

    const [showTimes, setShowTimes] = useState(false)
    const [showCreate, setShowCreate] = useState(true)

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
                <button className="devmode" onClick={handleChangeDevmode}>{!devMode ? "→ Dev mode" : "→ Production"}</button>
                <Nav stateProps={stateProps}/>
            </div>
            {showCreate && <CreateRecipe stateProps={stateProps} />}
            {!showCreate && <MyRecipes stateProps={stateProps} /> }
        </div>
    )
}