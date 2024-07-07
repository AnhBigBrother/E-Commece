import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import validator from 'validator';
import { useNavigate } from 'react-router-dom';
import updateUserProfile from '../../redux/actions/updateUserProfile';
import ButtonLoader from '../../components/ButtonLoader';

const Profile = () => {
  const user = useSelector(store => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [isloading, setIsloading] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    if (isloading) {
      return;
    }
    if (password.length > 0) {
      if (password.length < 6) {
        toast.warn('Password must be at least 6 character');
        return;
      }
      if (password !== confirmPassword) {
        toast.warn('Password not match');
        return;
      }
    }
    if (phonenumber.length > 0 && !validator.isMobilePhone(phonenumber)) {
      toast.warn('Invalid phone numbers');
      return;
    }
    setIsloading(true);
    axios
      .patch('/user', {
        username,
        password,
        address,
        phonenumber,
      })
      .then(res => {
        dispatch(updateUserProfile(res.data.results));
        localStorage.setItem('user', JSON.stringify(res.data.results));
        setIsloading(false);
        toast.success('Success!');
        navigate('/home');
      })
      .catch(err => {
        console.log(err);
        toast.error(err.response?.data?.error || 'Something wrong, try later!');
        setIsloading(false);
        navigate('/home');
      });
  };

  return (
    <form
      onSubmit={e => handleSubmit(e)}
      className='flex flex-col items-center gap-[1rem] lg:gap-[2rem] pt-[4rem] w-auto'>
      <h1 className='text-2xl font-semibold '>Your profile</h1>
      <div className='flex flex-col items-center lg:items-start lg:flex-row justify-start gap-[2rem] lg:gap-[3rem]'>
        <div className='flex flex-col w-[30rem]'>
          <div className='py-[1rem] flex flex-col'>
            <label htmlFor='email'>Email</label>
            <input
              className='border mt-1 p-2 rounded-md w-full border-neutral-300 bg-neutral-100 dark:bg-neutral-800'
              id='email'
              defaultValue={user.email}
              readOnly></input>
          </div>
          <div className='py-[1rem] flex flex-col'>
            <label htmlFor='password'>New password</label>
            <input
              className='border mt-1 p-2 rounded-md w-full border-neutral-300 bg-neutral-100 dark:bg-neutral-800'
              type='password'
              id='password'
              value={password}
              onChange={e => setPassword(e.target.value)}></input>
          </div>
          <div className='py-[1rem] flex flex-col'>
            <label htmlFor='confirmPassword'>Confirm new password</label>
            <input
              className='border mt-1 p-2 rounded-md w-full border-neutral-300 bg-neutral-100 dark:bg-neutral-800'
              type='password'
              id='confirmPassword'
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}></input>
          </div>
        </div>
        <div className='flex flex-col  w-[30rem]'>
          <div className='py-[1rem] flex flex-col'>
            <label htmlFor='username'>Name</label>
            <input
              className='border mt-1 p-2 rounded-md w-full border-neutral-300 bg-neutral-100 dark:bg-neutral-800'
              type='text'
              id='username'
              placeholder={user.username}
              value={username}
              onChange={e => setUsername(e.target.value)}></input>
          </div>
          <div className='py-[1rem] flex flex-col'>
            <label htmlFor='address'>Address</label>
            <input
              className='border mt-1 p-2 rounded-md w-full border-neutral-300 bg-neutral-100 dark:bg-neutral-800'
              id='address'
              type='text'
              value={address}
              placeholder={user.address || ''}
              onChange={e => setAddress(e.target.value)}></input>
          </div>
          <div className='py-[1rem] flex flex-col'>
            <label htmlFor='phonenumber'>Phone numbers</label>
            <input
              type='number'
              className='border mt-1 p-2 rounded-md w-full border-neutral-300 bg-neutral-100 dark:bg-neutral-800'
              id='phonenumber'
              value={phonenumber}
              placeholder={user.phonenumber || ''}
              onChange={e => setPhonenumber(e.target.value)}></input>
          </div>
        </div>
      </div>
      <button
        type='submit'
        className='bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-md w-24'>
        {isloading ? <ButtonLoader /> : <span>Update</span>}
      </button>
    </form>
  );
};

export default Profile;
