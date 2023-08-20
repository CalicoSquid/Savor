import Recipe from "./Recipe";
import Sidebar from "./Sidebar";

import { useState, useEffect } from "react"

import searchImages from "../Utilities/searchImages";
import { handleExtractRecipe } from "../Api/recipeApi";
import searchNestedObj from "../Utilities/searchNestedObj";
import parseInstruct from "../Utilities/parseInstructions";

export default function Main(props) {

    const {setRecipeData, recipeData, setIsSaved} = props.stateProps;
    
    const [images, setImages] = useState([])
    const [url, setUrl] = useState('');
    const [showRecipeMobile, setShowRecipeMobile] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);

    useEffect(() => {
      const handleResize = () => {
          setIsMobile(window.innerWidth <= 800);
      };

      window.addEventListener("resize", handleResize);

      return () => {
          window.removeEventListener("resize", handleResize);
      };
    }, []);

    useEffect(() => {
      setImages([]);
    }, [recipeData.name, recipeData.image]);


    async function handleChange(e) {
      setIsSaved(false)
      const {value, name, src} = e.target;
      setRecipeData(prevState => {
          return {
              ...prevState,
              [name]: name === "image" ? src : value
          }
      })
    }

    const stateProps = {
      ...props.stateProps,
      url,
      recipeData,
      setRecipeData,
      images,
      isMobile,
      setUrl,
      handleExtractRecipe,
      searchImages,
      handleChange,
      setImages,
      searchNestedObj,
      parseInstruct,
      setShowRecipeMobile,
    }


    return (
        <div className="main">
            {(!isMobile || !showRecipeMobile) && <Sidebar stateProps={stateProps}/>}
            {(!isMobile || showRecipeMobile) && <Recipe stateProps={stateProps}/>}          
        </div>
    )
}