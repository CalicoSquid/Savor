import { useState } from "react"
import { sendWelcomeEmail } from "../Api/emailApi";
import RecoverPassword from "./RecoverPassword";
import ResetPassword from "./Reset"

export default function Login(props) {

    const { 
        passwordStrength, 
        setPasswordStrength,
        showLoginForm, 
        setShowLoginForm, 
        handleLoginChange, 
        formData, 
        setFormData, 
        handleSubmit, 
        handleRegister, 
        errorMessage,
        setErrorMessage,
        successMessage,
        baseURL,
        showReset,
        setShowReset
    } = props.stateProps

    const [showPassword, setShowPassword] = useState(false)
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showRecover, setShowRecover] = useState(false)

    function handleShowReg() {
        setShowLoginForm(false)
        setFormData(prevData => ({...prevData, password: ""}))
    }

    function toggleShowPassword() {
        setShowPassword(p => !p)
    }

    function handleGoBack() {
        setShowLoginForm(true)
    }

    async function handleLogin(e) {
        e.preventDefault()
        console.log("Logging in")
        setIsLoggingIn(true)
        await handleSubmit(props.stateProps)
        setIsLoggingIn(false)
    }

    async function handleUserRegister(e) {
        e.preventDefault();
        console.log(formData)
        if (formData.password === confirmPassword) {
            setIsRegistering(true)
            await handleRegister(props.stateProps)
            
            sendWelcomeEmail(formData.email, formData.username, baseURL)
            setIsRegistering(false)
        } else {
            setErrorMessage(prevError => ({
                ...prevError,
                register: {
                    message: "Password does not match",
                    err: "Password does not match",
                }
            }))
        }
        
    }

    if(showReset) {
        return (
            <ResetPassword 
            setShowReset={setShowReset} 
            showReset={showReset}
            passwordStrength={passwordStrength}
            setPasswordStrength={setPasswordStrength}
            setShowRecover={setShowRecover}
            stateProps={props.stateProps}
            />
        )
    }

    if (showRecover) {
        return (
            <RecoverPassword 
            setShowRecover={setShowRecover} 
            showRecover={showRecover}
            stateProps={props.stateProps}
            />
        )
    }

    return (
        <>
        { showLoginForm && <div className="login-container">
            <h1>Login</h1>
            <br/>
            <form onSubmit={(e) => handleLogin(e)}>
                <input 
                type="text" 
                placeholder="Username" 
                onChange={handleLoginChange}
                name="username"
                value={formData.username}
                />

                <input 
                type={showPassword ? "text" : "password" }
                placeholder="Password" 
                onChange={handleLoginChange}
                name="password"
                value={formData.password}
                />
                
                <label className="check-label">
                    <input 
                    type="checkbox" 
                    id="checkbox" 
                    className="checkbox" 
                    value={showPassword}
                    onChange={toggleShowPassword}
                    />
                    {" "}
                    Show Password
                </label>

                {errorMessage.login.message && <p className="error">{errorMessage.login.err}</p>}
                {successMessage.login && <p className="green">{successMessage.login}</p>}

                <button className="submit" type="submit">{isLoggingIn ? "Logging in..." : "Login"}</button>
                <small className="forgot password">Forgot <span className="green" onClick={() => setShowRecover(true)}>Password</span>?</small>
                <small>Dont have an account? <span className="green" onClick={handleShowReg} >Sign up here.</span></small>
            </form>
        </div>}
        
        { !showLoginForm && <div className="login-container">
            <h1>Sign Up</h1>
            <br/>
            <form onSubmit={(e) => handleUserRegister(e)}>
                <input 
                minLength={6} 
                maxLength={20} 
                required
                type="text" 
                placeholder="Username" 
                onChange={handleLoginChange}
                name="username"
                value={formData.username}
                />

                <input 
                type="email" 
                placeholder="Email" 
                onChange={handleLoginChange}
                name="email"
                value={formData.email}
                />

                <div className="password-wrapper">
                    <input 
                    minLength={8} 
                    required
                    type={showPassword ? "text" : "password" }
                    placeholder="Password" 
                    onChange={handleLoginChange}
                    name="password"
                    value={formData.password}
                    className="password"
                    />
                    {
                    passwordStrength && 
                    <small style={{
                        color: 
                        passwordStrength === "Weak" ?
                        "red" :
                        passwordStrength === "Medium" ?
                        "orange" :
                        "green"
                    }}>{passwordStrength}</small>
                    }
                </div>
                <input 
                    required
                    type={showPassword ? "text" : "password" }
                    placeholder="Confirm Password" 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    name="confirmPassword"
                    value={confirmPassword}
                    className="password"
                    />
                
                <label className="check-label">
                    <input 
                    type="checkbox" 
                    id="checkbox" 
                    className="checkbox" 
                    value={showPassword}
                    onChange={toggleShowPassword}
                    />
                    {" "}
                    Show Password
                </label>
                
                {errorMessage.register.message && <p className="error">{errorMessage.register.err ? errorMessage.register.err: errorMessage.register.message}</p>}

                <button className="submit" type="submit">{isRegistering ? "Signing up..." : "Sign Up"}</button>
                <small onClick={handleGoBack}> Already a member? 
                    <span className="green go-back"> Login</span>
                </small>
            </form>
        </div>}
        </> 
    )
}