import { useEffect } from 'react';

export function useTimedMessage(stateProps, prop) {

  const { errorMessage, setErrorMessage, successMessage, setSuccessMessage } = stateProps
  useEffect(() => {
    let errorTimer;
    let successTimer;

    if (errorMessage) {
      errorTimer = setTimeout(() => {
        setErrorMessage(prevError => ({
          ...prevError,
          [prop]: { message: '', err: '' }
        }));
      }, 5000); // Hide the error message after 5 seconds
    }

    if (successMessage) {
      successTimer = setTimeout(() => {
        setSuccessMessage(prevSuccess => ({
          ...prevSuccess,
          [prop]: ""
        }));
      }, 5000); // Hide the success message after 5 seconds
    }

    return () => {
      clearTimeout(errorTimer);
      clearTimeout(successTimer);
    };
  }, [errorMessage, setErrorMessage, successMessage, setSuccessMessage, prop]);
}