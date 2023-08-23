import { useEffect, useState } from "react";
import requestFullscreen from "../Utilities/requestFullScreen";

function FullscreenButton({ fullscreenElement }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => {
    if (!isFullscreen && fullscreenElement.current) {
      setIsFullscreen(true)
      requestFullscreen(fullscreenElement.current);
    } else {
      exitFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const exitFullscreenHandler = () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
      setIsFullscreen(false); // Update state to indicate not in full screen
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

  return (
    <div>
      <p className="full-screen" onClick={handleFullscreen}>
        {isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}
      </p>
    </div>
  );
}

export default FullscreenButton;
