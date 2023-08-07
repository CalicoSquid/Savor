
export default function Nav(props) {

    const {showCreate, setShowCreate} = props.stateProps;
    
    const handleClick = (tab) => {
        setShowCreate(tab === "home" ? false : true)
    }

    return (
        <nav>
            <div 
            className="create" 
            onClick={() => handleClick("create")}
            style={{
                backgroundColor: showCreate? "#4CAF50" : "#f0f0f0",
                color: showCreate? "white" : "black" 
            }}
            >
            Create/Edit
            </div>

            <div 
            className="home" 
            onClick={() => handleClick("home")} 
            style={{
                backgroundColor: !showCreate? "#4CAF50" : "#f0f0f0",
                color: !showCreate? "white" : "black",
            }}
            >
            My Recipes
            </div>
        </nav>
    )
}