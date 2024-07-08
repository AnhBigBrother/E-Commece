import { useState } from 'react';
import axios from '../../api/axios.js';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { useNavigate } from 'react-router-dom';
import ButtonLoader from '../../components/ButtonLoader.jsx';
import { toast } from 'react-toastify';
import { Skeleton4, Skeleton4Item } from '../../components/Skeleton.jsx';

const ProductItem = ({ data }) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const handleDeleteProduct = () => {
    if (isLoading) {
      return;
    }
    if (confirm('Are you sure want to delete this product?')) {
      setIsLoading(true);
      axios
        .delete(`/admin/products/${data._id}`)
        .then(res => {
          console.log(res);
          setIsLoading(false);
          toast.success('Product deleted successfuly');
          setVisible(false);
        })
        .catch(err => {
          console.error(err);
          setIsLoading(false);
          toast.error('Something wrong, try later');
        });
    }
  };
  return (
    <>
      {visible && (
        <div className='flex flex-row gap-3 bg-neutral-200 dark:bg-neutral-800 rounded-md p-3'>
          <img
            className='rounded-md h-40 aspect-square object-cover cursor-pointer'
            src={data.imageUrl}
            onClick={() => navigate(`/products/${data._id}`)}></img>
          <div className='flex flex-col gap-2 flex-grow'>
            <p className='text-lg font-semibold text-ellipsis line-clamp-1'>{data.name}</p>
            <p className='text-ellipsis line-clamp-2 h-[3rem]'>{data.description}</p>
            <p className='text-xl font-semibold'>&#36;&#32;{data.price}</p>
            <div className='flex flex-row gap-3 justify-start'>
              <button
                className='px-2 py-1 bg-rose-500 hover:bg-rose-600 rounded-md'
                onClick={() => navigate(`${data._id}`)}>
                Update
              </button>
              <button
                className='px-2 py-1 bg-rose-500 hover:bg-rose-600 rounded-md'
                onClick={() => handleDeleteProduct()}>
                {isLoading ? <ButtonLoader /> : <span>Delete</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ManageProducts = () => {
  const [loading, data, lastComponentRef] = useInfiniteScroll('/admin/products', '');

  return (
    <div className='py-[3rem] flex flex-col items-center gap-[2rem]'>
      <p className='text-2xl font-bold'>Manage products</p>
      <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-3'>
        {data.length === 0 && loading ? (
          <Skeleton4 />
        ) : (
          data.map((item, index) => {
            if (index + 1 === data.length) {
              return (
                <div
                  ref={lastComponentRef}
                  key={`item#${item._id}`}>
                  <ProductItem data={item} />
                </div>
              );
            } else {
              return (
                <ProductItem
                  key={`item#${item._id}`}
                  data={item}
                />
              );
            }
          })
        )}
        {loading && <Skeleton4Item />}
      </div>
    </div>
  );
};

export default ManageProducts;
