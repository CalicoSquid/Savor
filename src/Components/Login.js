import { useState } from "react"

export default function Login(props) {

    const { passwordStrength, showLoginForm, setShowLoginForm, handleLoginChange, formData, setFormData, handleSubmit, handleRegister, errorMessage } = props.stateProps
    const [showPassword, setShowPassword] = useState(false)

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
      
    return (
        <>
        { showLoginForm && <div className="login-container">
            <h1>Login</h1>
            <br/>
            <form onSubmit={(e) => handleSubmit(e, props.stateProps)}>
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
                <button className="submit" type="submit">Sign In</button>
                <small className="forgot password">Forgot <span className="green">Password</span>?</small>
                <small>Dont have an account? <span className="green" onClick={handleShowReg} >Sign up here.</span></small>
            </form>
        </div>}
        
        { !showLoginForm && <div className="login-container">
            <h1>Sign Up</h1>
            <br/>
            <form onSubmit={(e) => handleRegister(e, props.stateProps)}>
                <input 
                minLength={6} 
                maxLength={20} 
                required
                type="text" 
                placeholder="Email/Username" 
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
                
                {errorMessage.register.message && <p className="error">{errorMessage.register.message}</p>}
                <button className="submit" type="submit">Sign Up</button>
                <small onClick={handleGoBack}> Already a member? 
                    <span className="green go-back"> Login</span>
                </small>
            </form>
        </div>}
        </> 
    )
}