import { useState } from "react"
import { useTimedMessage } from "../Utilities/useTimedMessage";

export default function Login(props) {

    const { 
        passwordStrength, 
        showLoginForm, 
        setShowLoginForm, 
        handleLoginChange, 
        formData, 
        setFormData, 
        handleSubmit, 
        handleRegister, 
        errorMessage,
        setErrorMessage,
    } = props.stateProps

    const [showPassword, setShowPassword] = useState(false)
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")

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
        if (formData.password === confirmPassword) {
            setIsRegistering(true)
            handleRegister(props.stateProps)
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

    useTimedMessage(props.stateProps, "register");
    useTimedMessage(props.stateProps, "login");

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
                <button className="submit" type="submit">{isLoggingIn ? "Logging in..." : "Login"}</button>
                <small className="forgot password">Forgot <span className="green">Password</span>?</small>
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
                    <span className="green go-back">Login</span>
                </small>
            </form>
        </div>}
        </> 
    )
}