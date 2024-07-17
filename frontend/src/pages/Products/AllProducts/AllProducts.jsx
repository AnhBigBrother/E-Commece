import { useCallback, useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import useInfiniteScroll from '../../../hooks/useInfiniteScroll';
import ProductCard from '../../../components/ProductCard';
import { CardSkeleton } from '../../../components/Skeleton';
import BrandRadioButton from './BrandRadioButton';
import CategoryCheckBox from './CategoryCheckBox';
import SortBy from './SortBy';
import { useSearchParams } from 'react-router-dom';
import PageLoader from '../../../components/PageLoader';

const AllProducts = () => {
  const [searchParams] = useSearchParams();
  const [categoriesIsLoading, categories] = useFetch('/admin/categories');
  const [brandIsLoading, brands] = useFetch('/admin/brands');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [loading, data, lastComponentRef] = useInfiniteScroll('/products', `categories=${selectedCategories.join(',')}&brand=${selectedBrand}&sort=${sortOrder}&search=${searchParams.get('search') ? searchParams.get('search') : ''}`);

  const setSortMemo = useCallback(x => setSortOrder(x), []);
  return (
    <div className='py-[3rem] flex flex-row gap-3 w-full'>
      <div className='sticky top-24 p-5 mb-24 rounded-lg flex flex-col gap-6 w-fit h-fit bg-neutral-200 dark:bg-neutral-800'>
        <div className='flex flex-col gap-3'>
          <p className='w-full rounded-full py-2 px-5 text-center bg-white dark:bg-black text-nowrap'>Filter by categories</p>
          {categoriesIsLoading ? (
            <PageLoader />
          ) : (
            <div className='flex flex-col gap-1 px-4'>
              {categories.map(e => (
                <CategoryCheckBox
                  key={`${e._id}-checkbox`}
                  category={e}
                  setSelectedCategories={setSelectedCategories}
                />
              ))}
            </div>
          )}
        </div>
        <div className='flex flex-col gap-3'>
          <p className='w-full rounded-full py-2 px-5 text-center bg-white dark:bg-black text-nowrap'>Filter by brand</p>
          {brandIsLoading ? (
            <PageLoader />
          ) : (
            <div className='flex flex-col gap-1 px-4'>
              {brands.map((e, i) => (
                <BrandRadioButton
                  key={`checkbox-${i}`}
                  brand={e}
                  selectedBrand={selectedBrand}
                  setSelectedBrand={setSelectedBrand}
                />
              ))}
            </div>
          )}
        </div>
        <div className='flex flex-col gap-3'>
          <p className='w-full rounded-full py-2 px-5 text-center bg-white dark:bg-black text-nowrap'>Sort products</p>
          <SortBy setSortOrder={setSortMemo} />
        </div>
      </div>
      <div className='flex flex-row flex-wrap w-full gap-5 items-start justify-center'>
        {data.length === 0 ? (
          loading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <p>There is nothing matched your search</p>
          )
        ) : (
          data.map((e, i) => {
            if (data.length === i + 1) {
              return (
                <div
                  ref={lastComponentRef}
                  key={e._id}>
                  <ProductCard
                    data={e}
                    selectedCategories={selectedCategories}
                  />
                </div>
              );
            } else {
              return (
                <ProductCard
                  data={e}
                  selectedCategories={selectedCategories}
                  key={e._id}
                />
              );
            }
          })
        )}
        {loading && <CardSkeleton />}
      </div>
    </div>
  );
};

export default AllProducts;
