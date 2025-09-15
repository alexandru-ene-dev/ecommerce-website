import { useEffect, useState } from "react";
import { searchService } from "../services/searchService";
import { useLocation } from "react-router-dom";
import type { NewProductType } from "../components/types";
import NewProduct from "../components/NewProduct";
import { Link } from 'react-router-dom';
import noSearchPic from '../assets/images/no-search.png';


export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
  const [ results, setResults ] = useState<NewProductType[]>([]);
  const [ error, setError ] = useState('');
  const query = useQuery();
  const q = query.get('q') || '';


  useEffect(() => {
    setResults([]);
    setError('');

    const handleSearch = async () => {
      if (!q) return;

      try {
        const res = await searchService(q);

        if (!res.success) {
          setError(res.message);
          return;
        }

        setResults(res.results);

      } catch (err) {
        setError((err as any).message);
      }
    }

    handleSearch();
  }, [q]);


  const resultProductElements = results.map(result => {
    const imgSrc = new URL(`../assets/images/${result.img}`, import.meta.url).href;
    const encodedQuery = result.title.replaceAll(' ', '-');

    return <NewProduct
      key={result._id} 
      imgSrc={imgSrc} 
      encodedQuery={encodedQuery} 
      item={result}
    />
  });


  return (
    <section className="search-page">

      {error &&
        <>
          <div className="not-found-flex">
            <div className="not-found-img-wrap no-search-pic-wrapper">
              <img className="no-search-pic" src={noSearchPic} />
            </div>

            <div>
              <h1 className="section_title">
                Sorry, we didn't find anything matching '{q}'...
              </h1>

              <p className="empty-category-par">
                Let's try again with different terms - or head back to our <Link to="/">homepage</Link>.
              </p>
            </div>
            
          </div>
          
          <Link to="/" className="back-shopping-btn new-card-btn">Back to Main Page</Link>
        </>
      }

      {results.length? 
        <>
          <h1 className="section_title">
            Your results for {q}
          </h1>

          <div className="new-section-grid-wrapper">
            <div className="new-section-grid">
              {resultProductElements}
            </div>
          </div>
        </> : null
      }
    </section>
  );
};

export default SearchPage;