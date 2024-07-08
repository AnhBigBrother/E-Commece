import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import PageLoader from '../../components/PageLoader';
import ButtonLoader from '../../components/ButtonLoader';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import Select from 'react-select';

const Order = ({ order }) => {
  const [orderStatus, setOrderStatus] = useState(order.state);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeOrderStatus = stt => {
    if (isLoading) return;
    if (confirm(`Mark as ${stt} ?`)) {
      setIsLoading(true);
      axios
        .patch(`/admin/orders/${order._id}`, { newState: stt })
        .then(res => {
          setOrderStatus(stt);
          setIsLoading(false);
          toast.success(`Order ${order._id} is ${stt}`);
        })
        .catch(err => {
          console.error(err);
          setIsLoading(false);
          toast.error(err.response.data.error || 'Something wrong, try later');
        });
    }
  };
  return (
    <div
      className='w-full flex flex-col gap-3 p-[1rem] rounded-lg bg-neutral-200 dark:bg-neutral-800'
      key={order._id}>
      <div className='grid grid-cols-7 gap-2 font-bold text-lg'>
        <p className='col-span-4'>Item</p>
        <p>Quantity</p>
        <p>Unit price</p>
        <p>Cost</p>
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
          <p>x {e.quantity}</p>
          <p>&#36; {e.product.price}</p>
          <p>&#36; {e.product.price * e.quantity}</p>
        </div>
      ))}
      <div className='grid grid-cols-7 gap-2'>
        <div className='col-span-4 text-nowrap flex flex-col gap-1'>
          <p className='font-semibold text-rose-500 '>Total amount: &#36;{order.totalAmount}</p>
          <p>
            User: <span className='font-medium'>{order.user.username}</span>
          </p>
          <p>
            Order at: <span className='font-medium'>{new Date(order.createdAt).toUTCString()}</span>
          </p>
          <p>
            Phone number: <span className='font-medium'>{order.phonenumber}</span>
          </p>
          <p>
            Shipping address: <span className='font-medium'>{order.shippingAddress}</span>
          </p>
        </div>
        <div className='col-span-3 flex flex-col gap-1 w-fit'>
          <p>
            Payment method: <span className='font-medium'>{order.paymentMethod === 'payUponReceipt' ? 'Pay in cash upon receipt' : ''}</span>
          </p>
          <p>
            Order status: <span className={`${orderStatus === 'pending' ? 'text-yellow-500' : orderStatus === 'canceled' ? 'text-red-500' : 'text-green-500'} font-medium`}>{orderStatus}</span>
          </p>

          {orderStatus !== 'completed' && orderStatus !== 'canceled' && (
            <>
              {orderStatus === 'pending' ? (
                <button
                  className='p-2 bg-rose-500 hover:bg-rose-600 h-10 rounded-lg flex items-center justify-center'
                  onClick={() => handleChangeOrderStatus('accepted')}>
                  {isLoading ? <ButtonLoader /> : <span>Mark as accepted</span>}
                </button>
              ) : orderStatus === 'accepted' ? (
                <button
                  className='p-2 bg-rose-500 hover:bg-rose-600 h-10 rounded-lg flex items-center justify-center'
                  onClick={() => handleChangeOrderStatus('delivering')}>
                  {isLoading ? <ButtonLoader /> : <span>Mark as delivering</span>}
                </button>
              ) : (
                <button
                  className='p-2 bg-rose-500 hover:bg-rose-600 h-10 rounded-lg flex items-center justify-center'
                  onClick={() => handleChangeOrderStatus('completed')}>
                  {isLoading ? <ButtonLoader /> : <span>Mark as completed</span>}
                </button>
              )}
              <button
                className='p-2 bg-rose-500 hover:bg-rose-600 h-10 rounded-lg flex items-center justify-center'
                onClick={() => handleChangeOrderStatus('canceled')}>
                Cancel this order
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const options = [
  { label: 'Pending orders', value: 'pending' },
  { label: 'Accepted orders', value: 'accepted' },
  { label: 'Delivering orders', value: 'delivering' },
  { label: 'Completed orders', value: 'completed' },
  { label: 'Canceled orders', value: 'canceled' },
];

const ManageOrders = () => {
  const [filter, setFilter] = useState('');
  const [loading, data, lastComponentRef] = useInfiniteScroll('/admin/orders', `state=${filter}`);
  const handleSelect = selectedItem => {
    if (selectedItem === null) {
      setFilter('');
    } else {
      setFilter(selectedItem.value);
    }
  };

  return (
    <div className='w-full flex flex-col gap-[1rem] py-[3rem]'>
      <div className='w-[30rem]'>
        <Select
          name='Sort by'
          options={options}
          isClearable={true}
          onChange={handleSelect}
          placeholder='Filter order'
          styles={{
            control: (base, state) => ({
              ...base,
              width: 'auto',
              minHeight: '42px',
              backgroundColor: 'var(--bg-element)',
              color: 'var(--main-text-color)',
              borderRadius: '16px',
              boxShadow: 'none',
              border: '1px solid var(--main-text-color)',
            }),
            option: (base, item) => {
              return {
                ...base,
                color: 'var(--main-text-color)',
                backgroundColor: item.isFocused ? '#F43F5E' : 'var(--bg-element)',
                borderRadius: '10px',
                cursor: 'pointer',
              };
            },
            menu: base => {
              return {
                ...base,
                backgroundColor: 'var(--bg-element)',
                borderRadius: '10px',
                border: 'none',
              };
            },
            input: base => {
              return {
                ...base,
                color: 'var(--main-text-color)',
              };
            },
            placeholder: base => {
              return {
                ...base,
                color: 'var(--main-text-color)',
              };
            },
            singleValue: base => {
              return {
                ...base,
                color: 'var(--main-text-color)',
              };
            },
            dropdownIndicator: base => {
              return {
                ...base,
                cursor: 'pointer',
                color: 'var(--main-text-color)',
                '&:hover': { color: '#F43F5E' },
              };
            },
            clearIndicator: base => {
              return {
                ...base,
                cursor: 'pointer',
                color: 'var(--main-text-color)',
                '&:hover': { color: '#F43F5E' },
              };
            },
          }}
        />
      </div>
      {data.length === 0 && !loading ? (
        <p>There is nothing matched your search</p>
      ) : (
        data.map((order, i) => {
          return i + 1 === data.length ? (
            <div
              key={order._id}
              ref={lastComponentRef}>
              <Order order={order} />
            </div>
          ) : (
            <Order
              order={order}
              key={order._id}
            />
          );
        })
      )}
      {loading && <PageLoader />}
    </div>
  );
};

export default ManageOrders;
