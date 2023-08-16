import { useEffect } from "react";
import requestFullscreen from "../Utilities/requestFullScreen";


function FullscreenButton({ fullscreenElement }) {
  
    const handleFullscreen = () => {
        if (fullscreenElement.current) {
          requestFullscreen(fullscreenElement.current);
        }
      };
  
    useEffect(() => {
      document.addEventListener('fullscreenchange', exitFullscreenHandler);
      document.addEventListener('webkitfullscreenchange', exitFullscreenHandler);
      document.addEventListener('mozfullscreenchange', exitFullscreenHandler);
      document.addEventListener('MSFullscreenChange', exitFullscreenHandler);
  
      return () => {
        document.removeEventListener('fullscreenchange', exitFullscreenHandler);
        document.removeEventListener('webkitfullscreenchange', exitFullscreenHandler);
        document.removeEventListener('mozfullscreenchange', exitFullscreenHandler);
        document.removeEventListener('MSFullscreenChange', exitFullscreenHandler);
      };
    }, []);
  
    const exitFullscreenHandler = () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
        // Handle exit fullscreen logic here if needed
      }
    };
  
    return (
      <p className="full-screen" onClick={handleFullscreen}>Go Fullscreen</p>
      
    );
  }
  
  export default FullscreenButton;