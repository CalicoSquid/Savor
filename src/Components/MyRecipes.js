import Login from "./Login";
import Home from "./Home";
import Footer from "./Footer";

export default function MyRecipes(props) {

    const { isLoggedIn, darkMode } = props.stateProps
 
    return (
        <div className="sidebar-home-x">
            { isLoggedIn ?
            <Home stateProps={props.stateProps} />
            :
            <>
            <Login stateProps={props.stateProps} />  
            <Footer darkMode={darkMode}/>
            </>
            
            }
        </div>
    )
}