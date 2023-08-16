import { useState } from 'react';

import Popup from 'reactjs-popup';

export function PopupImageUpload(props) {
    const [open, setOpen] = useState(false);
    const [dragOver, setDragOver] = useState(false);
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        props.setRecipeData((prevRecipeData) => ({
          ...prevRecipeData,
          image: imageUrl,
        }));
      }
      setOpen(o => !o)
    };
  
    const handleBrowseClick = () => {
      
      const fileInput = document.getElementById('fileInput');
      fileInput.click();
    };
  
    const handleDragOver = (e) => {
      e.preventDefault();
      setDragOver(true);
    };
  
    const handleDragEnter = (e) => {
      e.preventDefault();
      setDragOver(true);
    };
  
    const handleDragLeave = (e) => {
      e.preventDefault();
      setDragOver(false);
    };
  
    const handleDrop = (e) => {
      e.preventDefault();
      setDragOver(false);
  
      const file = e.dataTransfer.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageSrc = event.target.result;
          props.setRecipeData((prevState) => ({
            ...prevState,
            image: imageSrc,
          }));
        };
        reader.readAsDataURL(file);
      }
    };
  
    return (
      <>
        <button onClick={() => setOpen((o) => !o)}>Upload Image</button>
        <Popup className="popup" position="right" open={open}>
          <div
            className={`image-upload ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="fileInput"
              accept=".png, .jpg, .jpeg"
              onChange={handleImageChange}
            />
            <label htmlFor="fileInput">
              <div className="drop-area">
                <p>Drag and drop images here</p>
                <p>or</p>
                <button onClick={handleBrowseClick}>Browse</button>
              </div>
            </label>
          </div>
        </Popup>
      </>
    );
  }

  export function SettingsPopup(props) {

    const {userData, setRecipesPerPage} = props.stateProps
    const [rpp, setRpp] = useState(6)

    function handleRPP(e) {
      setRpp(e.target.value)
    }

    function handlesaveSettings() {
      setRecipesPerPage(rpp)
      props.setOpen(o => !o)
    }
    
    return (
      <Popup className="popup" open={props.open}>
        <div className="settings">
          <h2>Settings</h2>
          <br/>
          <p>{userData.username}</p>
          <br/>
          <label htmlFor='recipes-per-page'>Recipes Per Page: 
          <input type="number" id="recipes-per-page" value={rpp} onChange={handleRPP}/>
          </label>
          <div>
          <button className="save" onClick={handlesaveSettings}>Save Changes</button>
          <button className="cancel" onClick={() => props.setOpen(o => !o)}>Cancel Changes</button>
          </div>
          
        </div>
      </Popup>
    )
  }

