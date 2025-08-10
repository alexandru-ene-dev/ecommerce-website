import type { Dispatch, SetStateAction  } from 'react';

const LoadingSpinner  = (
  { isLoading, setLoading }:
  { isLoading: boolean, setLoading: Dispatch<SetStateAction<boolean>>}
) => {

  return (
    <div data-open={isLoading? "true": "false"} className="loader-modal">
      <span className="loader"></span>
    </div>
  );
};

export default LoadingSpinner;