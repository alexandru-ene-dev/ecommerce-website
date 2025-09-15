import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import delay from '../utils/delay';


const SearchBar = () => {
  const [ searchInput, setSearchInput ] = useState('');
  const [ isLoading, setLoading ] = useState(false);
  const navigate = useNavigate();


  const submitSearch = async (e: FormEvent) => {
    if (e) e.preventDefault();

    if (!searchInput) return;

    setLoading(true);
    await delay(700);
    setLoading(false);

    navigate(`/search?q=${searchInput}`);
  };

  return (
    <search className="search-wrapper">
      <LoadingSpinner isLoading={isLoading} />
      
      <form onSubmit={submitSearch} className="search-form">
        <input 
          className="input search-input"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)} 
          type="search"
          placeholder="Search"
          value={searchInput}
        />
  
        <button className="search-btn">
          <span className="material-symbols-outlined search-icon">search</span>
        </button>
      </form>
    </search>
  );
}

export default SearchBar;