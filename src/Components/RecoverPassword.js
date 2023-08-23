import { useState } from "react"
import { sendRecoverEmail } from "../Api/emailApi";

export default function RecoverPassword({setShowRecover, showRecover, stateProps}) {

    const { errorMessage } = stateProps;

    const [recoveryEmail, setRecoveryEmail] = useState("")
    const [isSending, setIsSending] = useState(false)

    async function handleSendRecovery(e) {
        e.preventDefault()
        setIsSending(true)
        await sendRecoverEmail(recoveryEmail.toLowerCase(), stateProps)
        .then(() => {
            setShowRecover(false)
            setIsSending(false)
        })
    }

    return (
        <div className="login-container recover">
            <h1>Reset Password</h1>
            <br/>
            {(errorMessage.login.message && showRecover) && <p className="error">{errorMessage.login.message}</p>}
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
                <button type="submit" className="save">{!isSending ? "Send" : "Sending..."}</button>
                <button type="button" className="cancel" onClick={() => setShowRecover(false)}>Go Back</button>
            </div>
            </form>  
        </div>
    )
}