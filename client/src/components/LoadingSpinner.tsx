
const LoadingSpinner  = ({ isLoading }: { isLoading: boolean }) => {

  return (
    <div data-open={isLoading? "true": "false"} className="loader-modal">
      <span className="loader"></span>
    </div>
  );
};

export default LoadingSpinner;