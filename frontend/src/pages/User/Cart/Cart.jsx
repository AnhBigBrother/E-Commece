import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import PageLoader from '../../../components/PageLoader';
import CartItem from './CartIems';
import { toast } from 'react-toastify';

const Cart = () => {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [isLoading, data] = useFetch('/user/cart');
  const [chossedItems, setChossedItems] = useState([]);
  const [itemQuantity, setItemQuantity] = useState({});
  useEffect(() => {
    const x = {};
    data?.map(item => (x[item._id] = 1));
    setItemQuantity(x);
  }, [data]);

  const updateItemQty = useCallback((id, num) => {
    setItemQuantity(pre => {
      const x = { ...pre };
      x[id] += num;
      return x;
    });
  }, []);
  const addItem = useCallback(item => {
    setChossedItems(pre => [...pre, item]);
  }, []);
  const removeItem = useCallback(item => {
    setChossedItems(pre => {
      const newItems = pre.filter(i => i._id !== item._id);
      return newItems;
    });
  }, []);
  const calculatePrice = useCallback(price => {
    setTotal(pre => pre + price);
  }, []);
  const handleCheckout = () => {
    if (chossedItems.length === 0) {
      toast.warn("You haven't selected anything yet");
      return;
    }
    const data = [];
    chossedItems.forEach(i => data.push({ item: i, quantity: itemQuantity[i._id] }));
    navigate('/user/checkout', { state: data });
  };

  return (
    <div className='w-full py-[3rem] flex flex-col gap-10'>
      <p className='text-3xl'>Shopping cart</p>
      <div className='w-full flex flex-col gap-5'>
        {isLoading ? (
          <PageLoader />
        ) : data.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          data.toReversed().map(e => (
            <CartItem
              data={e}
              updateItemQty={updateItemQty}
              addItem={addItem}
              removeItem={removeItem}
              calculatePrice={calculatePrice}
              key={e._id}
            />
          ))
        )}
      </div>
      <div className='flex flex-col gap-3 w-[20rem]'>
        <p className='text-xl font-semibold text-rose-500'>Total price: &#36;{total}</p>
        <button
          className='p-2 w-full bg-rose-500 hover:bg-rose-600 rounded-md'
          onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
