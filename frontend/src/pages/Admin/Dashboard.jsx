import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useFetch from '../../hooks/useFetch';
import { BiDollar } from 'react-icons/bi';
import { TbUsersPlus } from 'react-icons/tb';
import { LuCalendarDays } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, data] = useFetch('/admin/statistic');
  const [statisticData, setStatisticData] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [countOrder, setCountOrder] = useState(0);
  const [countNewUser, setCountNewUser] = useState(0);
  useEffect(() => {
    const newStatisticData = data.map(m => {
      return { time: m.time, Sales: m.revenues, Orders: m.orders.length };
    });
    let newRevenue = 0;
    let newCountOrder = 0;
    let newCountUser = 0;
    data.forEach(m => {
      newRevenue += m.revenues;
      newCountOrder += m.orders.length;
      newCountUser += m.newUsers;
    });
    setStatisticData(newStatisticData);
    setRevenue(newRevenue);
    setCountOrder(newCountOrder);
    setCountNewUser(newCountUser);
  }, [data]);

  return (
    <div className='w-full flex flex-col xl:flex-row justify-start xl:justify-center gap-10 xl:gap-16 pt-[3rem] items-center'>
      <div className='flex flex-col gap-10 items-center'>
        <h1 className='font-semibold text-2xl'>Statistics for the last 6 months</h1>
        <div className='flex flex-row gap-[2rem] justify-items-center items-center'>
          <div className='flex flex-col gap-3 items-center bg-neutral-200 dark:bg-black bg-opacity-75 p-5 rounded-lg w-[12rem] xl:w-[15rem]'>
            <div className='flex flex-row gap-2 items-center justify-start'>
              <BiDollar className='fill-rose-500 w-[1.5rem] h-[1.5rem]' />
              <p className='text-lg'>Revenue</p>
            </div>
            <p className='text-xl font-medium'>{revenue} &#36;</p>
          </div>
          <div className='flex flex-col gap-3 items-center bg-neutral-200 dark:bg-black bg-opacity-75 p-5 rounded-lg w-[12rem] xl:w-[15rem]'>
            <div className='flex flex-row gap-2 items-center justify-start'>
              <LuCalendarDays className='stroke-rose-500 w-[1.5rem] h-[1.5rem]' />
              <p className='text-lg'>Total orders</p>
            </div>
            <p className='text-xl font-medium'>{countOrder}</p>
          </div>
          <div className='flex flex-col gap-3 items-center bg-neutral-200 dark:bg-black bg-opacity-75 p-5 rounded-lg w-[12rem] xl:w-[15rem]'>
            <div className='flex flex-row gap-2 items-center justify-start'>
              <TbUsersPlus className='stroke-rose-500 w-[1.5rem] h-[1.5rem]' />
              <p className='text-lg'>New users</p>
            </div>
            <p className='text-xl font-medium'>{countNewUser}</p>
          </div>
        </div>
        <div className='w-[40rem] h-[20rem] xl:w-[60rem] xl:h-[30rem]'>
          <ResponsiveContainer
            width='100%'
            height='100%'>
            <BarChart data={statisticData}>
              <XAxis dataKey='time' />
              <YAxis
                yAxisId='left'
                orientation='left'
                stroke='#8884d8'
              />
              <YAxis
                yAxisId='right'
                orientation='right'
                stroke='#82ca9d'
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'transparent' }}
              />
              <Legend />
              <Bar
                yAxisId='left'
                dataKey='Sales'
                fill='#8884d8'
              />
              <Bar
                yAxisId='right'
                dataKey='Orders'
                fill='#82ca9d'
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <button
          className='bg-rose-500 hover:bg-rose-600 p-2 rounded-md w-[16rem]'
          onClick={() => navigate('/admin/products/create')}>
          Create new product
        </button>
        <button
          className='bg-rose-500 hover:bg-rose-600 p-2 rounded-md w-[16rem]'
          onClick={() => navigate('/admin/products')}>
          Manage products
        </button>
        <button
          className='bg-rose-500 hover:bg-rose-600 p-2 rounded-md w-[16rem]'
          onClick={() => navigate('/admin/orders')}>
          Mange orders
        </button>
        <button
          className='bg-rose-500 hover:bg-rose-600 p-2 rounded-md w-[16rem]'
          onClick={() => navigate('/admin/users')}>
          Manage users
        </button>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className='custom-tooltip'
        style={{
          color: 'white',
          backgroundColor: '#363636',
          padding: 10,
          borderRadius: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
        }}>
        <p className='label'>{`${label}`}</p>
        <div>
          {payload.map((pld, i) => (
            <div
              style={{ display: 'flex', flexDirection: 'row', gap: 10 }}
              key={`payload#${i}`}>
              <div style={{ color: pld.fill }}>{`${pld.dataKey}: `}</div>
              <div style={{ color: pld.fill }}>{pld.value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default Dashboard;
