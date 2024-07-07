import { useState } from 'react';
import axios from '../../api/axios.js';
import updateUserProfile from '../../redux/actions/updateUserProfile.js';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import validator from 'validator';
import { useNavigate } from 'react-router-dom';
import ButtonLoader from '../../components/ButtonLoader.jsx';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isloading, setIsloading] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    if (isloading) {
      return;
    }
    if (username.length === 0 || password.length === 0 || email.length === 0 || confirmPassword.length === 0) {
      toast.warn('Missing information!');
      return;
    } else if (!validator.isEmail(email)) {
      toast.warn('Invalid email');
      return;
    } else if (confirmPassword !== password) {
      toast.warn('Password not match');
      return;
    } else if (password.length < 6) {
      toast.warn('Password must has at lest 6 character');
      return;
    }
    setIsloading(true);
    axios
      .post('/auth/signup', {
        username,
        email,
        password,
      })
      .then(res => {
        dispatch(updateUserProfile(res.data.results));
        localStorage.setItem('user', JSON.stringify(res.data.results));
        setIsloading(false);
        toast.success('Success!');
        navigate('/home');
      })
      .catch(err => {
        console.error(err);
        setIsloading(false);
        toast.error(err.response?.data?.error || 'Something wrong, try later!');
      });
  };

  return (
    <section className='pl-[10rem] flex flex-col flex-wrap'>
      <div className='mr-[4rem] mt-[4rem]'>
        <h1 className='text-2xl font-semibold mb-4'>Sign up</h1>
        <form
          onSubmit={e => handleSubmit(e)}
          className='container w-[40rem]'>
          <div className='my-[2rem]'>
            <label
              htmlFor='username'
              className='block text-sm font-medium '>
              Username
            </label>
            <input
              type='text'
              id='username'
              className='border mt-1 p-2 rounded-md w-full border-neutral-300 bg-neutral-100 dark:bg-neutral-800'
              value={username}
              onChange={e => setUsername(e.target.value)}></input>
          </div>
          <div className='my-[2rem]'>
            <label
              htmlFor='email'
              className='block text-sm font-medium '>
              Email
            </label>
            <input
              type='email'
              id='email'
              className='border mt-1 p-2 rounded-md w-full border-neutral-300 bg-neutral-100 dark:bg-neutral-800'
              value={email}
              onChange={e => setEmail(e.target.value)}></input>
          </div>

          <div className='my-[2rem]'>
            <label
              htmlFor='password'
              className='block text-sm font-medium '>
              Password
            </label>
            <input
              type='password'
              id='password'
              className='border mt-1 p-2 rounded-md w-full border-neutral-300 bg-neutral-100 dark:bg-neutral-800'
              value={password}
              onChange={e => setPassword(e.target.value)}></input>
          </div>

          <div className='my-[2rem]'>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium '>
              Confirm password
            </label>
            <input
              type='password'
              id='confirmPassword'
              className='border mt-1 p-2 rounded-md w-full border-neutral-300 bg-neutral-100 dark:bg-neutral-800'
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}></input>
          </div>

          <button
            type='submit'
            className='bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-md w-24 text-white flex items-center justify-center'>
            {isloading ? <ButtonLoader /> : <span>Sign up</span>}
          </button>
        </form>
        <p className='py-6'>
          Already have an account?&nbsp;
          <a
            className='text-rose-500 hover:underline cursor-pointer'
            onClick={() => navigate('/auth/login')}>
            Sign in
          </a>
          &nbsp;here
        </p>
      </div>
    </section>
  );
};

export default SignUp;
