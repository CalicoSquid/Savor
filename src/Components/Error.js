
export default function Error(props) {

    const { errorMessage, setErrorMessage } = props.stateProps

    function handleError() {
        setErrorMessage({
            recipe: {message: "", err: ""},
            login: {message: "", err: ""},
            register: {message: "", err: ""},
            home: {message: "", err: ""},
            sidebar: {message: "", err: ""},
        })
        console.log(errorMessage.recipe.err)
        //Set up nodemailer here...
    }

    return (
        <div className="error-container">
            <div className="error-box">
                <h2>Sorry, there seems to have been a problem.</h2>
                <br/>
                <p className="error">{errorMessage.recipe.message}</p>
                <br/>
                <button className="send-error-report" onClick={handleError}>Send error report</button>
            </div>
        </div>
    )
}