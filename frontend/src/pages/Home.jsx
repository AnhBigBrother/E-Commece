import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { Skeleton1, Skeleton2 } from '../components/Skeleton';
import AutoPlaySlider from '../components/AutoPlaySlider';
import ProductCard from '../components/ProductCard';
import { FaArrowRight } from 'react-icons/fa6';

const SpecialProductItem = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div
      className='flex flex-col gap-1 w-[12rem] 2xl:w-[16rem] cursor-pointer'
      onClick={() => navigate(`/products/${data._id}`)}>
      <img
        className='w-full aspect-video object-cover rounded-md'
        src={data.imageUrl}></img>
      <div className='pt-2 flex flex-row gap-3 items-start justify-between'>
        <p className='font-semibold line-clamp-2'>{data.name}</p>
        <p className='text-rose-500 font-medium rounded-full w-fit h-fit'>&#36;{data.price}</p>
      </div>
    </div>
  );
};
const Home = () => {
  const navigate = useNavigate();
  const [specialIsLoading, specialProducts] = useFetch('/products?categories=Special');
  const [hotIsLoading, hotProducts] = useFetch('/products?sort=hot');
  const [newIsLoading, newProducts] = useFetch('/products?sort=new');

  return (
    <div className='flex flex-col gap-[5rem] justify-start items-center py-[3rem]'>
      {specialIsLoading ? (
        <Skeleton1 />
      ) : (
        <div className='flex flex-row justify-center xl:justify-between gap-[1rem] xl:gap-[3rem]'>
          <div className='grid-cols-2 gap-[1rem] xl:gap-[2rem] grid h-fit w-max'>
            {specialProducts.map(
              (e, i) =>
                i < 4 && (
                  <SpecialProductItem
                    data={e}
                    key={`banner#${e._id}}`}
                  />
                )
            )}
          </div>
          <AutoPlaySlider data={specialProducts} />
        </div>
      )}
      {specialIsLoading ? (
        <Skeleton2 />
      ) : (
        <div className='flex-col flex gap-5'>
          <div className='w-full flex flex-row items-center justify-between'>
            <h1 className='text-3xl font-bold'>Special</h1>
            <button
              className='py-2 px-5 rounded-full bg-rose-500 hover:bg-rose-600 flex flex-row gap-2 items-center'
              onClick={() => navigate('/products')}>
              <span>Shop now</span>
              <FaArrowRight />
            </button>
          </div>
          <div className='grid grid-cols-3 gap-[1rem] 2xl:gap-[3rem] w-max'>
            {specialProducts.map(
              (e, i) =>
                i < 6 && (
                  <ProductCard
                    data={e}
                    key={e._id}
                  />
                )
            )}
          </div>
        </div>
      )}
      {hotIsLoading ? (
        <Skeleton2 />
      ) : (
        <div className='flex-col flex gap-5'>
          <div className='w-full flex flex-row items-center justify-between'>
            <h1 className='text-3xl font-bold'>Best seller</h1>
            <button
              className='py-2 px-5 rounded-full bg-rose-500 hover:bg-rose-600 flex flex-row gap-2 items-center'
              onClick={() => navigate('/products')}>
              <span>Shop now</span>
              <FaArrowRight />
            </button>
          </div>
          <div className='grid grid-cols-3 gap-[1rem] 2xl:gap-[3rem] w-max'>
            {hotProducts.map(
              (e, i) =>
                i < 6 && (
                  <ProductCard
                    data={e}
                    key={e._id}
                  />
                )
            )}
          </div>
        </div>
      )}
      {newIsLoading ? (
        <Skeleton2 />
      ) : (
        <div className='flex-col flex gap-5'>
          <div className='w-full flex flex-row items-center justify-between'>
            <h1 className='text-3xl font-bold'>Newest</h1>
            <button
              className='py-2 px-5 rounded-full bg-rose-500 hover:bg-rose-600 flex flex-row gap-2 items-center'
              onClick={() => navigate('/products')}>
              <span>Shop now</span>
              <FaArrowRight />
            </button>
          </div>
          <div className='grid grid-cols-3 gap-[1rem] 2xl:gap-[3rem] w-max'>
            {newProducts.map(
              (e, i) =>
                i < 6 && (
                  <ProductCard
                    data={e}
                    key={e._id}
                  />
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
