import axios from 'axios';

export default async function searchImages(query, handleChange, setImages, setIsGenerating, numResults) {
  const apiKey = 'AIzaSyB0YNbNdTxABd2HrKli0AoyLoIhJlddt24';
  const searchEngineId = 'd2889336936c04567';
  setIsGenerating(true);

  function isImageURLValid(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  try {

    const response = await axios.get(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&safe=active&cx=${searchEngineId}&q=${query}&searchType=image&num=${numResults}`
    );
    console.log(response.data.items)
    const data =   response.data.items

    if (data) {
      const imageResults = data.map(item => item.link);
      const validationResults = await Promise.all(imageResults.map(isImageURLValid));
      const filteredImageResults = response.data.items
        .map((item, index) => {
          const isValid = validationResults[index];
          return isValid ? (
            <div className="img-wrapper" key={index}>
              <img src={item.link} name="image" onClick={(e) => handleChange(e)} alt={query} />
            </div>
          ) : null;
        })
        .filter(image => image);

      setImages(filteredImageResults);
      setIsGenerating(false);
      return filteredImageResults[0];
    } else {
      throw new Error("The search query may have triggered explicit content filtering.");
    }
    

  } catch (error) {
    console.log(error)
    let errorMessage = "Failed to fetch images";
    setImages(
      [
        <>
        <p className="error img-error">{errorMessage}</p>
        <br/>
        </>
        
      ]
    );
    setIsGenerating(false);
    //throw new Error(errorMessage);
  }
}