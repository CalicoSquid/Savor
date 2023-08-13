import axios from 'axios';

export default async function searchImages(query, handleChange, setImages, setIsGenerating, numResults) {
    const apiKey = 'AIzaSyB0YNbNdTxABd2HrKli0AoyLoIhJlddt24';
    const searchEngineId = 'd2889336936c04567';
    //const numResults = 3;
    setIsGenerating(true)
    try {
      const response = await axios.get(
        `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${query}&searchType=image&num=${numResults}`,
      
       

        );
      
      const imageResults = response.data.items.map(item => item.link)

      function isImageURLValid(url) {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = url;
        });
      }

      Promise
      .all(imageResults.map(isImageURLValid))
      .then((validationResults) => {
        const imageResults = response.data.items.map((item, index) => {
          const isValid = validationResults[index];
          return isValid ? 
                <div className="img-wrapper" key={index}>
                  <img src={item.link} name="image" onClick={(e) => handleChange(e)} alt={query}/>
                </div>
              : 
                null
        });

        setImages(imageResults.filter(image => image));
        setIsGenerating(false)
        return imageResults[0]
      });

    } catch (error) {
        setImages([<p className="error img-error">Error fetching images:</p>])
        setIsGenerating(false)
        throw new Error("Failed to fetch images");
        

    }
  }