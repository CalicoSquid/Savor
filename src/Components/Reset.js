import React, { useState } from 'react';
import { changePassword } from '../Api/authApi';
import checkPasswordStrength from '../Utilities/checkPassword';
import { useTimedMessage } from '../Utilities/useTimedMessage';

export default function RecoverPassword({ setShowReset, setShowRecover, showReset, passwordStrength, setPasswordStrength, stateProps }) {

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {errorMessage} = stateProps;
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token'); // Extract the 'token' query parameter

  const handleResetPassword = () => {
    if (token && newPassword === confirmPassword) {
      changePassword(newPassword, token, stateProps)
        .then(() => {
            const newUrl = window.location.origin;
            window.history.replaceState({}, document.title, newUrl);
            setShowReset(false);
            setShowRecover(false)
        })
        .catch(error => {
          console.error('Error resetting password:', error);
        });
    }
  };

  function handleResetPasswordChange(e) {
    const strength = checkPasswordStrength(e.target.value);
      strength <= 1 ? 
      setPasswordStrength("Weak") :
      strength === 2 ? 
      setPasswordStrength("Medium") :
      setPasswordStrength("Strong");
    setNewPassword(e.target.value)

  }

  //useTimedMessage(stateProps, "login");

  return (
    <div className="login-container reset">
      <h1>Reset Password</h1>
      <br/>
      {(errorMessage.login.message && showReset) && <p className="error">{errorMessage.login.message}</p>}
        <div className="password-wrapper">
        <input
        minLength={8} 
        required
        type="password"
        value={newPassword}
        placeholder="New Password"
        onChange={(e) => handleResetPasswordChange(e)}
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
        type="password"
        value={confirmPassword}
        placeholder="Confirm New Password"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <br/>
      <button onClick={handleResetPassword}>Reset</button>
    </div>
  );
}
