import { useState } from "react"
import { sendRecoverEmail } from "../Api/emailApi"

export default function RecoverPassword({setShowRecover, stateProps}) {

    const {setSuccessMessage, errorMessage } = stateProps;

    const [recoveryEmail, setRecoveryEmail] = useState("")

    function handleSendRecovery(e) {
        e.preventDefault()
        console.log(recoveryEmail.toLowerCase())
        sendRecoverEmail(recoveryEmail.toLowerCase(), stateProps).then(() => {
            setSuccessMessage(prev => ({
                ...prev,
                login: "Email sent. Check your inbox and follow the link."
            }))
        })
        setShowRecover(false)
    }

    return (
        <div className="login-container recover">
            <h1>Reset Password</h1>
            <br/>
            {errorMessage.login.message && <p className="error">{errorMessage.login.message}</p>}
            <p>Follow instruction in your email to reset your password:</p>
            <br/>
            <form onSubmit={handleSendRecovery}>
            <input 
            type="email" 
            placeholder="Your email address" 
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
            />
            <div className="recover-buttons">
                <button type="submit" className="save">Send</button>
                <button type="button" className="cancel" onClick={() => setShowRecover(false)}>Go Back</button>
            </div>
            
            </form>
            
        </div>
    )
}