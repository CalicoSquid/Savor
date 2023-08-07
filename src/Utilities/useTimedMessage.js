import { useEffect } from 'react';

export function useTimedMessage(errorObj, setErrorObj, successObj, setSuccessObj, prop) {
  useEffect(() => {
    let errorTimer;
    let successTimer;

    if (errorObj) {
      errorTimer = setTimeout(() => {
        setErrorObj(prevError => ({
          ...prevError,
          [prop]: { message: '', err: '' }
        }));
      }, 5000); // Hide the error message after 5 seconds
    }

    if (successObj) {
      successTimer = setTimeout(() => {
        setSuccessObj(prevSuccess => ({
          ...prevSuccess,
          [prop]: ""
        }));
      }, 5000); // Hide the success message after 5 seconds
    }

    return () => {
      clearTimeout(errorTimer);
      clearTimeout(successTimer);
    };
  }, [errorObj, setErrorObj, successObj, setSuccessObj, prop]);
}