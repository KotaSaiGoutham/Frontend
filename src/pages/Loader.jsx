import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-overlay">
      <img src="/spaceship.png" alt="Loading..." className="loader-image" />
      <p>Booking your demo...</p>
    </div>
  );
};

export default Loader;
