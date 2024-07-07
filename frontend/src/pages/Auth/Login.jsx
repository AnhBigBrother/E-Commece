import { useState } from 'react';
import axios from '../../api/axios.js';
import updateUserProfile from '../../redux/actions/updateUserProfile.js';
import updateCart from '../../redux/actions/updateCart.js';
import updateFavorite from '../../redux/actions/updateFavorite.js';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ButtonLoader from '../../components/ButtonLoader.jsx';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isloading, setIsloading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (isloading) {
      return;
    }
    if (email.length === 0 || password.length === 0) {
      toast.warn('Missing information!');
      return;
    }
    setIsloading(true);
    axios
      .post('/auth/login', {
        email,
        password,
      })
      .then(res => {
        dispatch(updateUserProfile(res.data.results));
        localStorage.setItem('user', JSON.stringify(res.data.results));
        const cart = {};
        const favorite = {};
        res.data.results.cart.forEach(e => (cart[e] = true));
        res.data.results.favorite.forEach(e => (favorite[e] = true));
        dispatch(updateCart(cart));
        dispatch(updateFavorite(favorite));
        setIsloading(false);
        toast.success('Success!');
        navigate('/home');
      })
      .catch(err => {
        setIsloading(false);
        toast.error(err.response.data.error || 'Something wrong, try later!');
      });
  };

  const googleAuth = async () => {
    const res = await axios.post('/auth/google');
    const { url } = res.data;
    window.location.href = url;
  };

  return (
    <section className='pl-[10rem] flex flex-wrap'>
      <div className='mr-[4rem] mt-[4rem]'>
        <h1 className='text-2xl font-semibold mb-8'>Sign in</h1>
        <form
          onSubmit={e => handleSubmit(e)}
          className='container w-[40rem]'>
          <div className='my-[2rem]'>
            <label
              htmlFor='email'
              className='block text-sm font-medium'>
              Email
            </label>
            <input
              type='email'
              id='email'
              className='border border-neutral-300 mt-1 p-2 rounded-md w-full bg-neutral-100 dark:bg-neutral-800'
              value={email}
              onChange={e => setEmail(e.target.value)}></input>
          </div>

          <div className='my-[2rem]'>
            <label
              htmlFor='password'
              className='block text-sm font-medium'>
              Password
            </label>
            <input
              type='password'
              id='password'
              className='border border-neutral-300 mt-1 p-2 rounded-md w-full bg-neutral-100 dark:bg-neutral-800'
              value={password}
              onChange={e => setPassword(e.target.value)}></input>
          </div>
          <div className='flex flex-row gap-3 items-center justify-start'>
            <button
              type='submit'
              className='bg-rose-500 hover:bg-rose-600 rounded-md p-2 w-24 text-white flex items-center justify-center'>
              {isloading ? <ButtonLoader /> : <span>Sign in</span>}
            </button>
            <p>or</p>
            <button
              type='button'
              onClick={() => googleAuth()}
              className='flex flex-row items-center justify-center p-2 border rounded-lg gap-2 w-60 hover:bg-neutral-200 dark:hover:bg-neutral-800'>
              <FcGoogle className='w-6 h-6' />
              <p>Continue with Google</p>
            </button>
          </div>
        </form>

        <p className='mt-6'>
          New customer?&nbsp;
          <a
            className='text-rose-500 hover:underline cursor-pointer'
            onClick={() => navigate('/auth/signup')}>
            Sign up
          </a>
          &nbsp;here
        </p>
      </div>
    </section>
  );
};

export default Login;
