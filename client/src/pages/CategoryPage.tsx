import { useParams } from "react-router-dom";
import { useState, useLayoutEffect } from 'react';
import fetchProducts from '../services/fetchProducts.ts';
import NewProduct from "../components/NewProduct.tsx";
import { type NewProductType } from "../components/types.ts";

import { nanoid } from 'nanoid';
import { Link, useLocation } from 'react-router-dom';
import delay from "../utils/delay.ts";
import useLoadingContext from "../hooks/useLoadingContext.ts";
import { useSearchParams } from "react-router-dom";
import NoProductsPic from '../assets/images/no-products.jpg';
import LoadingSpinner from "../components/LoadingSpinner.tsx";


const CategoryPage = () => {
  const { setLoading } = useLoadingContext();
  const [ isLoading, setIsLoading ] = useState(true);
  const { subcategory, subSubcategory } = useParams();
  const { pathname } = useLocation();
  const [ products, setProducts ] = useState<NewProductType[]>([]);

  const [ error, setError ] = useState<string | null>(null);
  const [ searchParams ] = useSearchParams();
  const sale = searchParams.get('sale');

  const filters: Record<string, any> = {};
  if (sale) filters.sale = sale;


  const title = subSubcategory?
    subSubcategory
      ?.replaceAll('-', ' ')
      .split(' ')
      .map(letter => letter[0].toUpperCase() + letter.slice(1))
      .join(' ').replace('And', 'and') :
    subcategory
      ?.replaceAll('-', ' ')
      .split(' ')
      .map(letter => letter[0].toUpperCase() + letter.slice(1))
      .join(' ').replace('And', 'and');
      
      
  useLayoutEffect(() => {
    const fetchProd = async () => {
      setProducts([]);
      setLoading(true);
      setIsLoading(true);

      try {
        const slug = 
          subSubcategory ? 
          `${subcategory}/${subSubcategory}` : 
          (subcategory === 'matrix'? 'collections' : subcategory);
    
        if (!slug) return;

        const result = await fetchProducts(slug, Object.keys(filters).length ? filters : undefined);
        
        if (!result || !result.success) {
          setError(result.message);
          setProducts([]);
          return;
        }
        
        setError(null);
        setProducts(result.products);
    
      } catch (err) {
        setError((err as Error).message);
        setProducts([]);
        
      } finally {
        await delay(500);
        setLoading(false);
        setIsLoading(false);
      }
    }

    fetchProd();
  }, [subcategory, subSubcategory, searchParams]);


  let isSubcategoryPage: boolean = false;
  if (products[0]?.content) {
    isSubcategoryPage = products[0]?.content?.length > 0 && !subSubcategory;
  }
  // const isProductPage = !!(products.length > 0 && subSubcategory) || !products[0]?.content?.length;


  const subcategoryElements = isSubcategoryPage &&
    products[0]?.content?.map((item: any) => {
      const subslug = item?.name.toLowerCase().replaceAll(' ', '-');
      const imgSrc = new URL(`../assets/images/${item.img}`, import.meta.url).href;

      return (
        <Link 
          key={nanoid()} 
          className="prod-category"
          to={`${pathname}/${subslug}`}
        >
          <h2 className="prod-category_subtitle">{item.name}</h2>

          <div className="img-description-flex">
            <div className="prod-category_img-wrap">
              <img className="prod-category_img" src={imgSrc} />
            </div>

            <p className="prod-category_description">{item.description}</p>
          </div>
        </Link>
      );
    });


  const productElements = products.map(prod => {
    const imgSrc = new URL(`../assets/images/${prod.img}`, import.meta.url).href;
    const slug = prod.title.replaceAll(' ', '-')
    
    return (
      <NewProduct
        key={prod._id}
        imgSrc={imgSrc} 
        encodedQuery={slug}
        item={prod} 
      />
    );
  });


  if (isLoading) {
    return (
      <div className="loading-products">
        <h1 className="category-page-title">Loading...</h1>
        <LoadingSpinner isLoading={isLoading}/>
      </div>
    );
  }


  if (!products.length) {
    return (
      <main className="category-page-main">
        <div className="not-found-flex">
          <div className="not-found-img-wrap">
            <img className="not-found-product-img" src={NoProductsPic} />
          </div>

          <div>
            <h1 className="category-page-title">
              Sorry, we couldn't find any products here... 
            </h1>

            <p className="empty-category-par">
              It looks like this category is empty at the moment. We're working on filling it up!
            </p>

            <p className="empty-category-par">
              Until we fill it up, why not check out our <Link to='/#new'>new arrivals</Link>?
            </p>
          </div>
        </div>

        <Link to="/" className="back-shopping-btn new-card-btn">Back to Main Page</Link>
      </main>
    );
  }


  if (subcategory === 'all') {
    return (
      <div className="all-prod-section">
        <h1 className="category-page-title">Everything Progressio has to offer</h1>
        <div data-all="true" className="new-section-grid-wrapper">
          <div className="new-section-grid">
            {productElements}
          </div>
        </div>
      </div>
    );
  }


  return (
    <main className="category-page-main">
      <h1 className="category-page-title">{title}</h1>

      {error && <div className="category-page-err">{error}</div>}

      <div className={
        isSubcategoryPage ? "category-page-subcategories" : "new-section-grid-wrapper"
      }>
        {isSubcategoryPage ?
          subcategoryElements :
          <div className="new-section-grid">{productElements}</div>
        }
      </div>
    </main>
  );
};

export default CategoryPage;