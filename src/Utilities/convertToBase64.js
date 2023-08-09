import axios from 'axios';
import config from './config';

//const baseURL = config.baseURL

async function convertBlobUrlToDataURL(blobUrl, stateProps) {
    console.log("KKK")
    const {setErrorMessage, baseURL} = stateProps
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", blobUrl);
        xhr.responseType = "blob";
        xhr.onload = () => {
            if (xhr.status === 200) {
                const blob = xhr.response;
                const reader = new FileReader();
                reader.onloadend = () => {
                    const dataUrl = reader.result;
                    resolve(dataUrl);
                };
                reader.readAsDataURL(blob);
            } else {
                reject(new Error(`Failed to fetch the Blob URL. Status code: ${xhr.status}`));
                setErrorMessage(prevError => ({
                    ...prevError,
                    recipe: {message: `Failed to fetch the Blob URL. Status code: ${xhr.status}`, err: xhr.status}
                }))
            }
        };
        xhr.onerror = () => {
            reject(new Error("Network error occurred."));
            setErrorMessage(prevError => ({
                ...prevError,
                recipe: {message: "Network error occurred.", err: xhr.status}
            }))
        };
        xhr.send();
    });
}


export async function convertToPNGOnServer(imageUrl, stateProps) {

    const {setErrorMessage, baseURL} = stateProps;
    console.log(baseURL)

    try {
      const response = await axios.post(`${baseURL}/convert-to-png`, { imageUrl }, { responseType: 'arraybuffer' });
      console.log(response)
      const convertedImageBlob = new Blob([response.data], { type: 'image/png' });
      const convertedImageUrl = URL.createObjectURL(convertedImageBlob);
      return await convertBlobUrlToDataURL(convertedImageUrl, stateProps)

      
    } catch (error) {
        setErrorMessage(prevError => ({
            ...prevError,
            recipe: {message: 'Conversion failed:', err: error}
        }))
      console.error('Conversion failed:', error);
      throw error;
    }
  }
  