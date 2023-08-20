import { sendEmail } from "../Api/emailApi";

export default function Error(props) {

    const { errorMessage, setErrorMessage, userData } = props.stateProps

    function handleError() {
        sendEmail(userData.email, errorMessage.recipe.err)
        setErrorMessage({
            recipe: {message: "", err: ""},
            login: {message: "", err: ""},
            register: {message: "", err: ""},
            home: {message: "", err: ""},
            sidebar: {message: "", err: ""},
        })
        
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