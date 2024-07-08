import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch.jsx';
import { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ButtonLoader from '../../components/ButtonLoader';

const UpdateProduct = () => {
  const { id } = useParams();
  const [isLoading, data, setData] = useFetch(`/admin/products/${id}`);
  const navigate = useNavigate();
  const uploadWarn = useRef();
  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectOption, setSelectoption] = useState([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [loader1, setLoader1] = useState(false);
  const [loader2, setLoader2] = useState(false);

  useEffect(() => {
    if (data._id) {
      setFilePath(data.imageUrl);
      setProductName(data.name);
      setPrice(data.price);
      setBrand(data.brand);
      setQuantity(data.quantity);
      setCategory(data.category);
      setDescription(data.description);
    }
    axios
      .get('/admin/categories')
      .then(res =>
        setSelectoption(
          res.data.results.map(ca => {
            return { label: ca.name, value: ca.name };
          })
        )
      )
      .catch(err => console.error(err));
  }, [data]);

  useEffect(() => {
    if (file?.size > 3145728) {
      uploadWarn.current.classList.remove('hidden');
    } else {
      uploadWarn.current.classList.add('hidden');
    }
  }, [file]);

  const handleUploadImage = e => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setFilePath(URL.createObjectURL(e.target.files[0]));
    }
  };
  const handleUpdateProduct = () => {
    if (loader2) {
      return;
    }
    if (file?.size > 3145728) {
      toast.warn('Image cannot bigger than 3MB');
      return;
    }
    setLoader2(true);
    const formData = new FormData();
    if (file) formData.append('productImage', file);
    formData.append('name', productName.trim());
    formData.append('price', price);
    formData.append('brand', brand.trim());
    formData.append('quantity', quantity);
    formData.append('category', category.trim());
    formData.append('description', description.trim());
    axios
      .patch(`/admin/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(res => {
        toast.success('Product updated!');
        console.log(res);
        setLoader2(false);
        navigate('/admin/products');
      })
      .catch(err => {
        console.error(err);
        toast.error(err.response?.data.error || 'Something wrong, try later');
        setLoader2(false);
        navigate('/admin/products');
      });
  };
  const handleDeleteProduct = () => {
    if (loader2) {
      return;
    }
    setLoader2(true);
    axios
      .delete(`/admin/products/${id}`)
      .then(res => {
        console.log(res);
        setLoader2(false);
        toast.success('Product deleted successfuly');
        navigate('/admin/products');
      })
      .catch(err => {
        console.error(err);
        setLoader2(false);
        toast.error(err.response?.data.error || 'Something wrong, try later');
        navigate('/admin/products');
      });
  };
  const handleCreateCategory = () => {
    if (loader1) {
      return;
    }
    if (categoryInput === '') {
      toast.warn('Cannot create empty category');
      return;
    }
    setLoader1(true);
    let newCategory = categoryInput.trim();
    newCategory = newCategory.charAt(0).toUpperCase() + newCategory.slice(1);
    axios
      .post('/admin/categories', {
        name: newCategory,
      })
      .then(res => {
        setCategoryInput('');
        toast.success('Category created successfuly!');
        setSelectoption([
          ...selectOption,
          {
            label: res.data.results.name,
            value: res.data.results.name,
          },
        ]);
        setLoader1(false);
      })
      .catch(err => {
        console.error(err);
        toast.error(err.response?.data.error || 'Something wrong, try later!');
        setLoader1(false);
      });
  };
  const handleSelectCategory = selectedItem => {
    if (selectedItem) {
      setCategory(selectedItem.value);
    }
  };
  return (
    <div className='w-full flex flex-col xl:flex-row items-center xl:items-start justify-center py-[3rem] xl:py-[6rem] gap-[2rem]'>
      <div className='flex flex-col gap-0 items-center'>
        <div className='w-[40rem] aspect-video border border-neutral-400 rounded-md overflow-hidden'>
          {filePath && (
            <img
              className='object-contain w-full h-full'
              src={filePath}
            />
          )}
        </div>
        <p
          ref={uploadWarn}
          className='hidden text-center text-red-500 mt-2'>
          Size of images must be less than 3MB, please upload another image!
        </p>
        <label className='cursor-pointer text-center font-semibold hover:underline hover:text-rose-500 mt-2'>
          <input
            className='hidden'
            type='file'
            accept='image/*'
            onChange={e => handleUploadImage(e)}
          />
          Change image <span className='font-normal'>(size &le; 3MB)</span>
        </label>
      </div>
      <div className='w-[40rem] xl:w-[48rem] grid grid-cols-2 gap-y-3 gap-x-10'>
        <div className=''>
          <label
            title='required'
            htmlFor='name'
            className='block text-sm font-medium'>
            Product name <span className='font-normal'>*</span>
          </label>
          <input
            type='text'
            id='name'
            value={productName}
            onChange={e => setProductName(e.target.value)}
            className='border mt-1 p-2 rounded-md w-full border-neutral-400 bg-neutral-100 dark:bg-neutral-800'></input>
        </div>
        <div className=''>
          <label
            title='required'
            htmlFor='price'
            className='block text-sm font-medium'>
            Price (&#36;) <span className='font-normal'>*</span>
          </label>
          <input
            type='number'
            id='price'
            value={price}
            onChange={e => setPrice(e.target.value)}
            className='border mt-1 p-2 rounded-md w-full border-neutral-400 bg-neutral-100 dark:bg-neutral-800'></input>
        </div>
        <div className=''>
          <label
            title='required'
            htmlFor='brand'
            className='block text-sm font-medium'>
            Brand <span className='font-normal'>*</span>
          </label>
          <input
            type='text'
            id='brand'
            value={brand}
            onChange={e => setBrand(e.target.value)}
            className='border mt-1 p-2 rounded-md w-full border-neutral-400 bg-neutral-100 dark:bg-neutral-800'></input>
        </div>
        <div className=''>
          <label
            title='required'
            htmlFor='quantity'
            className='block text-sm font-medium'>
            Quantity <span className='font-normal'>*</span>
          </label>
          <input
            type='number'
            id='quantity'
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            className='border mt-1 p-2 rounded-md w-full border-neutral-400 bg-neutral-100 dark:bg-neutral-800'></input>
        </div>
        <div>
          <label
            className='block text-sm font-medium mb-1'
            title='required'>
            Select category <span className='font-normal'>*</span>
          </label>
          <Select
            name='Category'
            options={selectOption}
            value={{ label: category, value: category }}
            onChange={handleSelectCategory}
            placeholder='Category'
            styles={{
              control: (base, state) => ({
                ...base,
                width: 'auto',
                minHeight: '42px',
                backgroundColor: 'var(--bg-element)',
                color: 'var(--main-text-color)',

                border: state.isFocused ? '1px solid #F43F5E' : '1px solid inherit',
                boxShadow: 'none',
                '&:hover': {
                  border: state.isFocused ? '1px solid #F43F5E' : '1px solid inherit',
                },
              }),
              option: (base, item) => {
                return {
                  ...base,
                  color: 'var(--main-text-color)',
                  backgroundColor: item.isFocused ? '#F43F5E' : 'var(--bg-element)',
                };
              },
              menu: base => {
                return {
                  ...base,
                  backgroundColor: 'var(--bg-element)',
                  border: '1px solid white',
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
              multiValueRemove: base => {
                return {
                  ...base,
                  color: 'var(--bg-element)',
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
        <div className=''>
          <label className='block text-sm font-medium mb-1'>Create category?</label>
          <div className='flex flex-row gap-2 justify-center items-center'>
            <input
              className='border p-2 rounded-md w-full border-neutral-400 bg-neutral-100 dark:bg-neutral-800'
              value={categoryInput}
              onChange={e => setCategoryInput(e.target.value)}></input>
            <button
              className='bg-rose-500 hover:bg-rose-600 p-2 rounded-md'
              onClick={() => handleCreateCategory()}>
              {loader1 ? <ButtonLoader /> : <p>Create</p>}
            </button>
          </div>
        </div>
        <div className='col-span-2'>
          <label
            title='required'
            htmlFor='description'
            className='block text-sm font-medium'>
            Description <span className='font-normal'>*</span>
          </label>
          <textarea
            rows={5}
            value={description}
            onChange={e => setDescription(e.target.value)}
            id='description'
            className='border mt-1 p-2 rounded-md w-full border-neutral-400 bg-neutral-100 dark:bg-neutral-800 resize-none'></textarea>
        </div>
        <button
          className='py-2 bg-rose-500 hover:bg-rose-600 rounded-md w-full flex flex-row justify-center'
          onClick={() => handleUpdateProduct()}>
          {loader2 ? <ButtonLoader /> : <p>Update product</p>}
        </button>
        <button
          className='py-2 bg-rose-500 hover:bg-rose-600 rounded-md w-full flex flex-row justify-center'
          onClick={() => handleDeleteProduct()}>
          {loader2 ? <ButtonLoader /> : <p>Delete product</p>}
        </button>
      </div>
    </div>
  );
};

export default UpdateProduct;
