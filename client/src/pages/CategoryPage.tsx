import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import fetchProducts from '../services/fetchProducts.ts';
import NewProduct from "../components/NewProduct.tsx";
import { type NewProductType } from "../components/types.ts";
import { nanoid } from 'nanoid';
import { Link, useLocation } from 'react-router-dom';


const CategoryPage = () => {
  const { subcategory, subSubcategory } = useParams();
  const { pathname } = useLocation();

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

  const [ products, setProducts ] = useState<NewProductType[]>([]);
  const [ subSubcategories, setSubSubcategories ] = useState<NewProductType[]>([]);
  const [ isBtnVisible, setBtnIsVisible ] = useState(true);
  const [ error, setError ] = useState<string | null>(null);


  const isProductFromSubSub = subSubcategories.length? true : false;
  const subSubElements = isProductFromSubSub &&
    subSubcategories.map(prod => {
      const imgSrc = new URL(`../assets/images/${prod.img}`, import.meta.url).href;
      const encodedQuery = prod.title.replaceAll(' ', '-');
    
      return (
          <NewProduct
            setIsBtnVisible={setBtnIsVisible} 
            imgSrc={imgSrc} 
            encodedQuery={encodedQuery}
            item={prod} 
          />
      );
    });


  const isSubcategoryPage = products.length > 0 && products[0]?.content?.length;
  const subcategoryElements = isSubcategoryPage &&
    products[0].content?.map((item: any) => {
      const subslug = item?.name.toLowerCase().replaceAll(' ', '-');
      const imgSrc = new URL(`../assets/images/${item.img}`, import.meta.url).href;

      return (
        <Link to={`${pathname}/${subslug}`} key={nanoid()} className="prod-category">
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
    
    return (
      <div key={prod.id}>
        <NewProduct
          setIsBtnVisible={setBtnIsVisible} 
          imgSrc={imgSrc} 
          encodedQuery={null}
          item={prod} 
          />
      </div>
    );
  });
  
  
  useEffect(() => {
    try {
      const slug = subSubcategory? `${subcategory}/${subSubcategory}` : subcategory;
  
      if (!slug) return;
      
      const fetchProd = async () => {
        const result = await fetchProducts(slug);
        
        if (!result || !result.success) {
          setError(result.message);
          setProducts([]);
          setSubSubcategories([]);
          return;
        }
  
        if (result.subSubcategories) {
          setError(null);
          setSubSubcategories(result.subSubcategories);
          setProducts(result.subSubcategories);
          console.log(result.message);
          return;
        }
        
        setError(null);
        setSubSubcategories([]);
        setProducts(result.products);
        console.log(result.message);
      };
  
      fetchProd();
    } catch (err) {
      setError((err as Error).message);
      setProducts([]);
      setSubSubcategories([]);
    }
  }, [subcategory, subSubcategory]);


  return (
    <main className="category-page-main">
      <h1 className="category-page-title">{title}</h1>

      {error && <div className="category-page-err">{error}</div>}

      <div className={
        isProductFromSubSub? "category-page-sub-prod new-section-grid-wrapper" : (isSubcategoryPage? "category-page-subcategories" : "category-page-products")
      }>
        {/* {isProductFromSubSub && <div className="new-section-grid">{subSubElements}</div>} */}
        {isProductFromSubSub? 
          <div className="new-section-grid">{subSubElements}</div> : 
          (isSubcategoryPage? subcategoryElements : productElements)
        }
      </div>
    </main>
  );
};

export default CategoryPage;