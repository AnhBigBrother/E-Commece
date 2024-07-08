import { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import ButtonLoader from '../components/ButtonLoader';
import updateCart from '../redux/actions/updateCart';
import updateFavorite from '../redux/actions/updateFavorite';
import { FaArrowRight } from 'react-icons/fa6';
import { BsCartPlus } from 'react-icons/bs';
import { BsCartCheck } from 'react-icons/bs';
import { FaRegHeart } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';
import { FaRegStar } from 'react-icons/fa';

const ProductCard = ({ data }) => {
  const cart = useSelector(store => store.cart);
  const favorite = useSelector(store => store.favorite);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const handleAddToCart = id => {
    if (isLoading) return;
    setIsLoading(true);
    axios
      .post('user/cart', { id })
      .then(res => {
        const newCart = {};
        res.data.results.forEach(e => (newCart[e] = true));
        dispatch(updateCart(newCart));
        setIsLoading(false);
        toast.success('Added to your cart!');
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
        toast.error(err.response.data.error || 'Something wrong, try later');
      });
  };
  const handleAddToFavorite = id => {
    if (isLoading2) return;
    setIsLoading2(true);
    axios
      .post('user/favorite', { id })
      .then(res => {
        const newFavorite = {};
        res.data.results.forEach(e => (newFavorite[e] = true));
        dispatch(updateFavorite(newFavorite));
        setIsLoading2(false);
        toast.success('Added to your favorite!');
      })
      .catch(err => {
        console.error(err);
        setIsLoading2(false);
        toast.error(err.response.data.error || 'Something wrong, try later');
      });
  };
  const handleRemoveFromFavorite = id => {
    if (isLoading2) return;
    setIsLoading2(true);
    axios
      .patch('user/favorite', { id: id })
      .then(res => {
        const newFavorite = {};
        res.data.results.forEach(e => (newFavorite[e] = true));
        dispatch(updateFavorite(newFavorite));
        setIsLoading2(false);
        toast.success('Removed from favorite!');
      })
      .catch(err => {
        console.error(err);
        setIsLoading2(false);
        toast.error(err.response.data.error || 'Something wrong, try later');
      });
  };
  return (
    <div className='relative flex flex-col bg-neutral-200 dark:bg-neutral-800 rounded-md items-start w-[20rem] xl:w-[24rem] h-fit flex-shrink-0'>
      <div className='absolute top-0 right-0'>
        {favorite[data._id] ? (
          <FaHeart
            className='w-7 p-1 h-auto cursor-pointer fill-red-500'
            onClick={() => handleRemoveFromFavorite(data._id)}
            title='favorited'
          />
        ) : (
          <FaRegHeart
            className='w-7 p-1 h-auto cursor-pointer fill-white'
            onClick={() => handleAddToFavorite(data._id)}
            title='add to favorite'
          />
        )}
      </div>
      <img
        className='aspect-video w-full object-cover rounded-t-md'
        src={data.imageUrl}></img>
      <div className='flex flex-col gap-1 p-3 w-full'>
        <div className='flex flex-row gap-2 items-start justify-between'>
          <p className='text-lg font-semibold line-clamp-2'>{data.name}</p>
          <p className='text-lg font-semibold text-rose-500'>&#36;{data.price}</p>
        </div>
        <div className='flex flex-row gap-1 items-center'>
          <div className='flex flex-row'>
            {new Array(5).fill(0).map((e, i) => {
              return i + 1 <= Math.round(data.rating) ? (
                <FaStar
                  className='w-4 h-4'
                  key={`productStar#${i + 1}`}
                />
              ) : (
                <FaRegStar
                  className='w-4 h-4'
                  key={`productStar#${i + 1}`}
                />
              );
            })}
          </div>
          <span>{data.rating}/5</span>
        </div>
        <p className='line-clamp-2 mb-2 text-sm font-light'>{data.description}</p>
        <div className='flex flex-row items-center justify-between'>
          <button
            className='px-3 py-2 rounded-md bg-rose-500 hover:bg-rose-600 flex flex-row items-center gap-2'
            onClick={() => navigate(`/products/${data._id}`)}>
            <span>Read more</span>
            <FaArrowRight />
          </button>
          {isLoading ? (
            <ButtonLoader />
          ) : cart[data._id] ? (
            <BsCartCheck className='h-7 w-auto fill-green-500' />
          ) : (
            <BsCartPlus
              className='h-7 w-auto cursor-pointer hover:fill-rose-500'
              onClick={() => handleAddToCart(data._id)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default memo(ProductCard);
