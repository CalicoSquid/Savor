import { useState, useEffect } from "react"
import { useSwipeable } from 'react-swipeable';

import Popup from 'reactjs-popup';
import Nav from "./Nav";
import CreateRecipe from "./CreateRecipe";
import MyRecipes from "./MyRecipes";

import logo from "../Assets/logo.png";
import logoWhite from "../Assets/logo-white.png"
import prod from "../Assets/prod.png";
import dev from "../Assets/dev.png";
import Instructions from "./Instructions";
import Ingredients from "./Ingredients";

import HomeHead from "./HomeHead";

export default function Sidebar(props) {

    const { 
        setRecipeData, 
        images, 
        handleChange, 
        devMode, 
        setDevMode, 
        showInstruct, 
        showIngred, 
        darkMode,
        setShowInstruct,
        setShowIngred,
        isProUser,
        setShowPayment,
        isLoggedIn,
    } = props.stateProps

    const [showTimes, setShowTimes] = useState(false)
    const [showCreate, setShowCreate] = useState(false)

    const [devPW, setDevPW] = useState("")
    const [correctPW, setCorrectPW] = useState(true)

    useEffect(() => {
        const storedDevMode = localStorage.getItem('devMode');
        if (storedDevMode !== null) {
          setDevMode(JSON.parse(storedDevMode));
        } else {
          setDevMode(true); // Set a default value if not found in local storage
        }
        // eslint-disable-next-line
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

    function handleLeftSwipe() {
        setShowCreate(false)
        setShowInstruct(false)
        setShowIngred(false)
    }

    function handlePay() {
        setShowPayment(true);
        setShowCreate(false);
    }

    const handlers = useSwipeable({
        onSwipedLeft: handleLeftSwipe, // Swipe left to hide CreateRecipe
        onSwipedRight: () => setShowCreate(true), // Swipe right to show CreateRecipe
      });




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
        <div
        className="sidebar"

        {...handlers}
        >
            <div className="title-bar">
              <img src={darkMode ? logoWhite : logo} className="logo-img" style={{height: "80px"}} alt="Measuring spoons logo"/>
              <div className="logo-text">
                  <h1 className="logo-title">Savor{isProUser && <span>pro</span>}</h1>
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
            
            {showInstruct && <Instructions stateProps={stateProps} />}
            {showIngred && <Ingredients stateProps={stateProps} />}

            <div className={`create-component ${showCreate ? 'slide-in-r' : 'slide-out-r'}`}>
            
            { isLoggedIn && 
            <div 
            className={`go-pro-create`} 
            style={isProUser ? {cursor: "default"} : {}}
            onClick={!isProUser ? handlePay : null}
            >
            {(!isProUser && showCreate) && <h2>Upgrade to Savor Pro!</h2>}
            </div>
            }
            <CreateRecipe stateProps={stateProps} />
            </div>
            
            <div className={`my-recipes-component ${showCreate ? 'slide-out' : 'slide-in'}`}>
            <MyRecipes stateProps={stateProps} />
            </div>
           
           
        </div>
    )
}