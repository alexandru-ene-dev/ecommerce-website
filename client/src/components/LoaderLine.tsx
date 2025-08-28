import useLoadingContext from "../hooks/useLoadingContext";


const LoaderLine = () => {
  const { isLoading } = useLoadingContext();


  return (
    <div className="loader-line-wrap">
      <div data-loading={isLoading? 'true' : 'false'} className="loader-line"></div>
      <span data-loading={isLoading? 'true' : 'false'} className="small-loader"></span>
    </div>
  );
};

export default LoaderLine;