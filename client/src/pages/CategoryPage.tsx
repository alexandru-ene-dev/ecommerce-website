import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import fetchProducts from '../services/fetchProducts.ts';
import NewProduct from "../components/NewProduct.tsx";
import { type NewProductType } from "../components/types.ts";

import { nanoid } from 'nanoid';
import { Link, useLocation } from 'react-router-dom';
import delay from "../utils/delay.ts";
import useLoadingContext from "../hooks/useLoadingContext.ts";
import { useSearchParams } from "react-router-dom";


const CategoryPage = () => {
  const { setLoading } = useLoadingContext();
  const { subcategory, subSubcategory } = useParams();
  const { pathname } = useLocation();
  const [ products, setProducts ] = useState<NewProductType[]>([]);

  const [ _, setBtnIsVisible ] = useState(true);
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
      
      
  useEffect(() => {
    try {
      const slug = 
        subSubcategory ? 
        `${subcategory}/${subSubcategory}` : 
        (subcategory === 'matrix'? 'collections' : subcategory);
  
      if (!slug) return;
      
      const fetchProd = async () => {
        setLoading(true);

        const result = await fetchProducts(slug, Object.keys(filters).length ? filters : undefined);
        
        if (!result || !result.success) {
          setError(result.message);
          setProducts([]);
          return;
        }
        
        setError(null);
        setProducts(result.products);
      };
  
      fetchProd();
    } catch (err) {
      setError((err as Error).message);
      setProducts([]);

    } finally {
      const awaitDelay = async () => {
        await delay(500);
        setLoading(false);
      };

      awaitDelay();
    }
  }, [subcategory, subSubcategory]);


  if (!products[0]?.content) return;
  const isSubcategoryPage = products[0]?.content?.length > 0 && !subSubcategory;
  const isProductPage = !!(products.length > 0 && subSubcategory) || !products[0]?.content?.length;


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
  

  const productElements = isProductPage && products.map(prod => {
    const imgSrc = new URL(`../assets/images/${prod.img}`, import.meta.url).href;
    const slug = prod.title.replaceAll(' ', '-')
    
    return (
        <NewProduct
          key={prod._id}
          setIsBtnVisible={setBtnIsVisible} 
          imgSrc={imgSrc} 
          encodedQuery={slug}
          item={prod} 
        />
    );
  });
  
  
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