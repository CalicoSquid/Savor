import { useEffect } from 'react';

export function useTimedMessage(stateProps) {

  const { errorMessage, setErrorMessage, successMessage, setSuccessMessage } = stateProps
  useEffect(() => {
    let errorTimer;
    let successTimer;

    if (errorMessage && !errorMessage.recipe.message) {
      errorTimer = setTimeout(() => {
        setErrorMessage({
          recipe: {message: "", err: ""},
          login: {message: "", err: ""},
          register: {message: "", err: ""},
          home: {message: "", err: ""},
          sidebar: {message: "", err: ""},
      });
      }, 5000); // Hide the error message after 5 seconds
    }

    if (successMessage) {
      successTimer = setTimeout(() => {
        setSuccessMessage({
          home: "",
          login: "",
          sidebar: "",
        });
      }, 5000); // Hide the success message after 5 seconds
    }

    return () => {
      clearTimeout(errorTimer);
      clearTimeout(successTimer);
    };
  }, [errorMessage, setErrorMessage, successMessage, setSuccessMessage]);
}