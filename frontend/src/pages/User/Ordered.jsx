import { useState } from 'react';
import axios from '../../api/axios';
import useFetch from '../../hooks/useFetch';
import PageLoader from '../../components/PageLoader';
import ButtonLoader from '../../components/PageLoader';

const Order = ({ order }) => {
  const [orderStatus, setOrderStatus] = useState(order.state);
  const [isCanceling, setIsCanceling] = useState(false);
  const handleCancelOrder = id => {
    if (isCanceling) return;
    if (confirm('Are you sure?')) {
      setIsCanceling(true);
      axios
        .delete(`/user/order/${id}`)
        .then(res => {
          console.log(res);
          setOrderStatus('canceled');
          setIsCanceling(false);
        })
        .catch(err => {
          console.log(err);
          setIsCanceling(false);
        });
    }
  };
  return (
    <div
      className='w-full flex flex-col gap-3 p-[1rem] rounded-lg bg-neutral-200 dark:bg-neutral-800'
      key={order._id}>
      <div className='grid grid-cols-7 gap-2 font-bold text-lg'>
        <p className='col-span-4'>Item</p>
        <p className=''>Quantity</p>
        <p className=''>Unit price</p>
        <p className=''>Cost</p>
      </div>
      {order.items.map(e => (
        <div
          className='grid grid-cols-7 gap-2 items-center'
          key={e._id}>
          <div className='col-span-4 w-full flex flex-row gap-2 rounded-lg'>
            <img
              src={e.product.imageUrl}
              className='h-16 rounded-md aspect-video object-cover'></img>
            <div className='flex flex-col'>
              <p className='font-bold'>{e.product.name}</p>
              <p>Brand: {e.product.brand}</p>
            </div>
          </div>
          <p className=''>x {e.quantity}</p>
          <p className=''>&#36; {e.product.price}</p>
          <p className=''>&#36; {e.product.price * e.quantity}</p>
        </div>
      ))}
      <div className='text-nowrap flex flex-col'>
        <p className='text-lg font-medium'>Total amount: &#36;{order.totalAmount}</p>
        <p className='text-sm'>
          Order at: <span>{new Date(order.createdAt).toDateString()}</span>
        </p>
        <p className='text-sm'>
          Status: <span className={`${orderStatus === 'pending' ? 'text-yellow-500' : orderStatus === 'canceled' ? 'text-red-500' : 'text-green-500'}`}>{orderStatus}</span>
        </p>
        {orderStatus === 'pending' && (
          <button
            className='w-fit bg-rose-500 hover:bg-rose-600 rounded-md px-3 py-2 mt-1'
            onClick={() => handleCancelOrder(order._id)}>
            {isCanceling ? <ButtonLoader /> : <span>Cancel this order</span>}
          </button>
        )}
      </div>
    </div>
  );
};

const UserOrdered = () => {
  const [isLoading, data] = useFetch('/user/order');

  return (
    <div className='w-full flex flex-col gap-[1rem] py-[3rem]'>
      <p className='text-3xl'>Your orders</p>
      {!isLoading && data.length === 0 && <p>You haven't ordered anything yet</p>}
      {isLoading ? <PageLoader /> : data.toReversed().map(order => <Order order={order} />)}
    </div>
  );
};

export default UserOrdered;
