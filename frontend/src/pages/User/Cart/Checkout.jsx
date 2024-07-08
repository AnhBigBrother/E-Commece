import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';
import { toast } from 'react-toastify';
import validator from 'validator';
import ButtonLoader from '../../../components/ButtonLoader';
import updateCart from '../../../redux/actions/updateCart';

const Checkout = () => {
  const { state } = useLocation();
  const user = useSelector(store => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [total, setTotal] = useState(0);
  const [phonenumber, setPhonenumber] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setloading] = useState(false);
  useEffect(() => {
    let sum = 0;
    state.forEach(e => (sum += e.item.price * e.quantity));
    setTotal(sum);
    setPhonenumber(user.phonenumber);
    setAddress(user.address);
  }, []);
  const handlePlaceOrder = () => {
    if (loading) return;
    if (!phonenumber) {
      toast.warn('Please enter you phone number');
      return;
    } else if (!validator.isMobilePhone(phonenumber)) {
      toast.warn('Invalid phone number');
      return;
    }
    if (!address) {
      toast.warn('Please enter you address');
      return;
    }
    if (confirm('Confirm this order?')) {
      setloading(true);
      const items = [];
      state.forEach(s => items.push({ product: s.item._id, quantity: s.quantity }));
      axios
        .post('/user/order', { items, phonenumber, shippingAddress: address, paymentMethod: 'payUponReceipt' })
        .then(res => {
          console.log(res);
          const newCart = {};
          res.data.cart.forEach(e => (newCart[e] = true));
          dispatch(updateCart(newCart));
          setloading(false);
          navigate('/user/ordered');
          toast.success('Order successfully!');
        })
        .catch(err => {
          console.log(err);
          setloading(false);
          navigate('/user/ordered');
          toast.error(err.response.data.error || 'Something wrong, try later');
        });
    }
  };
  return (
    <div className='w-full flex flex-col gap-[3rem] py-[3rem]'>
      <div className='w-full flex flex-col gap-3 p-[1rem] rounded-lg bg-neutral-200 dark:bg-neutral-800'>
        <div className='grid grid-cols-7 gap-2 font-bold text-lg'>
          <p className='col-span-4'>Item</p>
          <p className=''>Quantity</p>
          <p className=''>Unit price</p>
          <p className=''>Cost</p>
        </div>
        {state.map(e => {
          return (
            <div
              className='grid grid-cols-7 gap-2 items-center'
              key={e.item._id}>
              <div className='col-span-4 w-full flex flex-row gap-2 rounded-lg'>
                <img
                  src={e.item.imageUrl}
                  className='h-16 rounded-md aspect-video object-cover'></img>
                <div className='flex flex-col'>
                  <p className='font-bold'>{e.item.name}</p>
                  <p>Brand: {e.item.brand}</p>
                </div>
              </div>
              <p className=''>x {e.quantity}</p>
              <p className=''>&#36; {e.item.price}</p>
              <p className=''>&#36; {e.item.price * e.quantity}</p>
            </div>
          );
        })}
        <div className='grid grid-cols-7 gap-2'>
          <p className='col-start-6 col-span-2 text-xl font-semibold text-nowrap text-rose-500'>Total cost: &#36;{total}</p>
        </div>
      </div>
      <div className='w-full flex gap-[5rem] pl-4'>
        <div className='flex flex-col gap-2'>
          <p className='text-lg font-bold'>Contact information:</p>
          <div className='flex flex-col gap-1'>
            <label>Phone number:</label>
            <input
              className='bg-neutral-200 dark:bg-neutral-800 rounded-md p-3 w-[30rem]'
              type='number'
              value={phonenumber || ''}
              onChange={e => setPhonenumber(e.target.value)}></input>
            <label>Address:</label>
            <input
              className='bg-neutral-200 dark:bg-neutral-800 rounded-md p-3 w-[30rem]'
              value={address || ''}
              onChange={e => setAddress(e.target.value)}></input>
          </div>
        </div>
        <div className='w-full flex flex-col gap-2'>
          <p className='text-lg font-bold'>Payment method:</p>
          <div className='flex flex-row items-center gap-2'>
            <div className='rounded-full w-5 h-5 border border-rose-500 flex justify-center items-center'>
              <div className='w-3 h-3 rounded-full bg-rose-500'></div>
            </div>
            <p>Pay in cash upon receipt</p>
          </div>
        </div>
      </div>
      <button
        className='w-[30rem] ml-4 bg-rose-500 hover:bg-rose-600 p-3 rounded-lg flex justify-center items-center'
        onClick={handlePlaceOrder}>
        {loading ? <ButtonLoader /> : <span>Place order</span>}
      </button>
    </div>
  );
};

export default Checkout;
