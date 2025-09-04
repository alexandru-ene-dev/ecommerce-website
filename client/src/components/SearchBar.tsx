import { useState, type ChangeEvent, type FormEvent } from 'react';


const SearchBar = () => {
  const [ searchInput, setSearchInput ] = useState('');

  const submitSearch = (e: FormEvent) => {
    if (e) e.preventDefault();
  }

  return (
    <search className="search-wrapper">
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