import { useState } from 'react';
import axios from '../../api/axios.js';
import useInfiniteScroll from '../../hooks/useInfiniteScroll.jsx';
import PageLoader from '../../components/PageLoader.jsx';
import { toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import { LuCheck } from 'react-icons/lu';
import { LuX } from 'react-icons/lu';

const UserRow = ({ user }) => {
  const [edit, setEdit] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [visible, setVisible] = useState(true);

  const handleChangeName = () => {
    if (isLoading || isLoading2) {
      return;
    } else if (!username) {
      toast.warn('Username cannot be empty');
      setUsername(user.username);
    } else if (user.username === username) {
      setEdit(false);
    } else if (confirm('Are you sure want to update this user?')) {
      setIsLoading(true);
      axios
        .patch(`/admin/users/${user._id}`, {
          username,
        })
        .then(res => {
          console.log(res);
          toast.success('Update user successfuly');
          setIsLoading(false);
          setEdit(false);
          user.username = username;
        })
        .catch(err => {
          console.error(err);
          setIsLoading(false);
          setEdit(false);
          toast.error('Something wrong, try later');
        });
    }
  };
  const handleDeleteUser = () => {
    if (isLoading || isLoading2) {
      return;
    }
    if (confirm('Are you sure want to delete this user?')) {
      setIsLoading2(true);
      axios
        .delete(`/admin/users/${user._id}`)
        .then(res => {
          console.log(res);
          toast.success('Delete user successfuly');
          setIsLoading2(false);
          setVisible(false);
        })
        .catch(err => {
          console.error(err);
          setIsLoading2(false);
          toast.error('Something wrong, try later');
        });
    }
  };
  return (
    <>
      {visible && (
        <div className='w-full grid grid-cols-11 gap-[1rem]'>
          <p className='col-span-3 truncate'>{user._id}</p>
          <div className='col-span-3 grid grid-cols-3 gap-1'>
            {edit ? (
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                className='col-span-2 bg-neutral-200 dark:bg-neutral-800 border rounded-md px-2 w-full'
              />
            ) : (
              <p className='col-span-2 truncate'>{user.username}</p>
            )}
            <div className='col-span-1'>
              {!user.isAdmin &&
                (edit ? (
                  isLoading ? (
                    <PageLoader />
                  ) : (
                    <LuCheck
                      className='h-6 w-auto px-3 py-1 bg-rose-500 hover:bg-rose-600 rounded-md cursor-pointer'
                      onClick={() => handleChangeName()}
                    />
                  )
                ) : (
                  <FaRegEdit
                    className='h-5 w-auto cursor-pointer hover:fill-rose-500'
                    onClick={() => setEdit(true)}
                  />
                ))}
            </div>
          </div>
          <p className='col-span-3 truncate'>{user.email}</p>
          <p className='col-span-1'>{user.isAdmin ? <LuCheck className='h-6 w-auto stroke-green-500' /> : <LuX className='h-6 w-auto stroke-red-500' />}</p>
          {!user.isAdmin &&
            (isLoading2 ? (
              <PageLoader />
            ) : (
              <MdDelete
                className='h-6 w-auto px-2 py-1 fill-white bg-red-500 hover:bg-red-700 rounded-md cursor-pointer'
                onClick={() => handleDeleteUser()}
              />
            ))}
        </div>
      )}
    </>
  );
};

const ManageUsers = () => {
  const [loading, data, lastComponentRef] = useInfiniteScroll('/admin/users');
  return (
    <div className='pt-[3rem] flex flex-col justify-start items-center gap-5'>
      <div className='w-full grid grid-cols-11 gap-[1rem] font-bold'>
        <p className='col-span-3'>User id</p>
        <p className='col-span-3'>User name</p>
        <p className='col-span-3'>Email</p>
        <p className='col-span-1'>Admin</p>
        <p>Delete</p>
      </div>
      {data.map((x, i) => {
        if (data.length === i + 1) {
          return (
            <div
              className='w-full'
              key={x._id}
              ref={lastComponentRef}>
              <UserRow user={x} />
            </div>
          );
        } else {
          return (
            <UserRow
              user={x}
              key={x._id}
            />
          );
        }
      })}
      {loading && <PageLoader />}
    </div>
  );
};

export default ManageUsers;
