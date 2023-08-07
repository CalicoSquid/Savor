import Login from "./Login";
import Home from "./Home";

export default function MyRecipes(props) {

    const { isLoggedIn } = props.stateProps
 
    return (
        <div className="sidebar-info">
            { isLoggedIn ?
            <Home stateProps={props.stateProps} />
            :
            <Login stateProps={props.stateProps} />  
            }
        </div>
    )
}