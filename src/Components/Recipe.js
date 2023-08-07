import { useRef, useState, useEffect } from 'react';

import he from 'he';
import Popup from 'reactjs-popup';

import Error from "./Error";
import downloadPdf from "../Utilities/downloadPdf";
import { convertToPNGOnServer } from "../Utilities/convertToBase64";

import star from "../Assets/star-filled.png"


export default function Recipe(props){

    const {
        errorMessage,
        setErrorMessage,
        recipeData,
        loadingImage,
        imgToDownload,
        setImgToDownload,
        setShowRecipeMobile,
        isMobile,
        } = props.stateProps;

    const ingredientsEls = recipeData.ingredients.map((x,i) => <li key={i}>{he.decode(x)}</li>)
    const instructionEls = recipeData.instructions.map((y,i) => <><p key={i}>{y.text ? he.decode(y.text) : y.itemListElement ? y.itemListElement.map(z => he.decode(z.text)) : he.decode(y)}</p><br/></>)
    
    const prepTime = recipeData.times.prep
    const cookTime = recipeData.times.cook
    const totalTime = {
        hours: parseInt(prepTime.hours )+ parseInt(cookTime.hours),
        minutes: parseInt(prepTime.minutes) + parseInt(cookTime.minutes)
    }


    const [open, setOpen] = useState(false);
    const [name, setName] = useState("")
    const pdfRef = useRef(null);

    useEffect(() => {
        if (recipeData.name) {
            setName(recipeData.name);
        }
    }, [recipeData.name]);

   
    function handleSaveChange(e) {
        setName(e.target.value)
    }

    async function handleSavePopup() {
        let imgToDownloadData = recipeData.image;
      
        const isBase64Image =
          imgToDownloadData.startsWith('data:image/png;base64,') ||
          imgToDownloadData.startsWith('data:image/jpeg;base64,');
      
        if (!isBase64Image) {
          imgToDownloadData = await convertToPNGOnServer(imgToDownloadData, props.stateProps);
        }
      
        setImgToDownload(imgToDownloadData);
        setOpen(true);
    }

    function handlePopupClose() {
        setImgToDownload("")
        setOpen(false)
    }
    

    function handleBack() {
        setShowRecipeMobile(false)
    }

    const downloadProps ={pdfRef, setOpen, name, setImgToDownload, setErrorMessage}


    if(errorMessage.recipe.message){
        return <Error stateProps={props.stateProps} />
    }


    return (
    <div className="main-wrapper">
        <p className="preview">Preview Recipe</p>
        <div className="recipe-page">
        
            {loadingImage ? <h1>Loading Recipe...</h1> : 
            <div className="recipe-card" id="recipe-card">
                {isMobile && <button className="back" onClick={handleBack}>← Back</button>}
                <button className="download" onClick={handleSavePopup} >Download PDF</button>

                <Popup className="popup" position="right" open={open} onClose={handlePopupClose}>
                    <div className="save-pdf">
                        <p>Save As:</p> 
                        <input 
                        type="text" 
                        value={name} 
                        className="save-input"
                        onChange={handleSaveChange}
                        /><span>.pdf</span>

                        <button className="save" onClick={() => downloadPdf(downloadProps)}>
                            Save
                        </button>
                        <button className="cancel" onClick={handlePopupClose}>
                            Cancel
                        </button>
                    </div>
                </Popup>

                <div className="recipe-data" id="recipe-data"  ref={pdfRef}>
                    
                    <h1 className="title">{he.decode(recipeData.name)}{" "}{recipeData.isFavorite && <img src={star} className="favorite-recipe" alt="Favorite recipe"/>}</h1>
                    
                    { recipeData.name && <hr style={{border: "1px solid #4CAF50"}}/>}
                    <p className="subtitle">{he.decode(recipeData.description)}</p>
                    {recipeData.image && <img src={imgToDownload ? imgToDownload : recipeData.image} className="recipe-image" alt={recipeData.name} />}
                    
                    <div className="recipe-info">
                        <div className="author">
                            <b>{recipeData.author}</b>
                            {recipeData.recipeYield && <p>Serves: {recipeData.recipeYield}</p>}
                        </div>

                        <div className="times">
                            {prepTime && <div>
                                <h4>Prep</h4>
                                { prepTime.hours > 0 && <p>{prepTime.hours} hrs</p> }
                                { prepTime.minutes > 0 && <p>{prepTime.minutes} min</p> }
                            </div>}

                            {cookTime && <div>
                                <h4>Cook</h4>
                                { cookTime.hours > 0 && <p>{cookTime.hours} hrs</p> }
                                { cookTime.minutes > 0 && <p>{cookTime.minutes} min</p> }
                            </div>}

                            {totalTime.minutes > 0 && <div>
                                <h4>Total</h4>
                                { totalTime.hours > 0 && <p>{totalTime.hours} hrs</p> }
                                { totalTime.minutes > 0 && <p>{totalTime.minutes} min</p> }
                            </div>}

                        </div>
                    </div>
                    <div className="recipe-text">
                        {recipeData.ingredients.length > 0 && <div className="ingredients">
                            <h2>Ingredients</h2>
                            <ul>
                            {ingredientsEls}
                            </ul>
                        </div>}

                        {recipeData.instructions.length > 0 && <div className="instructions">
                            <h2>Instructions</h2>
                            <ul>
                            {instructionEls}
                            </ul>
                        </div>}

                    </div>
              
                </div>
            </div>}
        </div>
    </div>
    );
  };
  