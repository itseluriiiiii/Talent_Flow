import './Preloader.css';

interface PreloaderProps {
  isVisible?: boolean;
  isFadingOut?: boolean;
}

export default function Preloader({ isVisible = true, isFadingOut = false }: PreloaderProps) {
  if (!isVisible && !isFadingOut) return null;

  return (
    <>
      {/* Overlay to prevent white flash */}
      <div className={`preloader-overlay ${isFadingOut ? 'fade-out' : ''}`} />
      
      {/* Main preloader */}
      <div className={`preloader-container ${isFadingOut ? 'fade-out' : ''}`}>
        <div className="loader">
          <span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </span>
          <div className="base">
            <span></span>
            <div className="face"></div>
          </div>
        </div>
        <div className="longfazers">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="clouds">
          <div className="cloud cloud1"></div>
          <div className="cloud cloud2"></div>
          <div className="cloud cloud3"></div>
          <div className="cloud cloud4"></div>
          <div className="cloud cloud5"></div>
        </div>
      </div>
    </>
  );
}
