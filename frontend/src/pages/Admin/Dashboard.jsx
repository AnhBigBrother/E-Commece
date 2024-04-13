import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { BiDollar } from "react-icons/bi";
import { TbUsersPlus } from "react-icons/tb";
import { LuCalendarDays } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const data = [
  {
    name: "Jan",
    Orders: 4000,
    Sales: 2400,
  },
  {
    name: "Feb",
    Orders: 3000,
    Sales: 1398,
  },
  {
    name: "Mar",
    Orders: 2000,
    Sales: 9800,
  },
  {
    name: "Apr",
    Orders: 2780,
    Sales: 3908,
  },
  {
    name: "May",
    Orders: 1890,
    Sales: 4800,
  },
  {
    name: "Jun",
    Orders: 2390,
    Sales: 3800,
  },
  {
    name: "Jul",
    Orders: 3490,
    Sales: 4300,
  },
  {
    name: "Aug",
    Orders: 2000,
    Sales: 9800,
  },
  {
    name: "Seb",
    Orders: 2780,
    Sales: 3908,
  },
  {
    name: "Oct",
    Orders: 1890,
    Sales: 4800,
  },
  {
    name: "Nov",
    Orders: 2390,
    Sales: 3800,
  },
  {
    name: "Dec",
    Orders: 3490,
    Sales: 4300,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className='w-full flex flex-col xl:flex-row justify-start xl:justify-center gap-10 xl:gap-16 pt-[3rem] items-center'>
      <div className='flex flex-col gap-10 items-center'>
        <h1 className='font-semibold text-2xl'>Admin dashboard</h1>
        <div className='flex flex-row gap-[2rem] justify-items-center items-center'>
          <div className='flex flex-col gap-3 items-center bg-black bg-opacity-75 p-5 rounded-lg w-[12rem] xl:w-[15rem]'>
            <div className='flex flex-row gap-2 items-center justify-start'>
              <BiDollar className='fill-pink-500 w-[1.5rem] h-[1.5rem]' />
              <p className='text-lg'>Total sales:</p>
            </div>
            <p className='text-xl'>1.000.000.000 &#36;</p>
          </div>
          <div className='flex flex-col gap-3 items-center bg-black bg-opacity-75 p-5 rounded-lg w-[12rem] xl:w-[15rem]'>
            <div className='flex flex-row gap-2 items-center justify-start'>
              <LuCalendarDays className='stroke-pink-500 w-[1.5rem] h-[1.5rem]' />
              <p className='text-lg'>Total orders:</p>
            </div>
            <p className='text-xl'>1500</p>
          </div>
          <div className='flex flex-col gap-3 items-center bg-black bg-opacity-75 p-5 rounded-lg w-[12rem] xl:w-[15rem]'>
            <div className='flex flex-row gap-2 items-center justify-start'>
              <TbUsersPlus className='stroke-pink-500 w-[1.5rem] h-[1.5rem]' />
              <p className='text-lg'>New users</p>
            </div>
            <p className='text-xl'>1000</p>
          </div>
        </div>
        <div className='w-[40rem] h-[20rem] xl:w-[60rem] xl:h-[30rem]'>
          <ResponsiveContainer
            width='100%'
            height='100%'>
            <BarChart data={data}>
              <XAxis dataKey='name' />
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
                cursor={{ fill: "transparent" }}
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
          className='bg-pink-500 hover:bg-pink-700 p-2 rounded-md w-[16rem]'
          onClick={() => navigate("products/create")}>
          Create new product
        </button>
        <button
          className='bg-pink-500 hover:bg-pink-700 p-2 rounded-md w-[16rem]'
          onClick={() => navigate("products")}>
          Manage products
        </button>
        <button
          className='bg-pink-500 hover:bg-pink-700 p-2 rounded-md w-[16rem]'
          onClick={() => navigate("orders")}>
          Mange orders
        </button>
        <button
          className='bg-pink-500 hover:bg-pink-700 p-2 rounded-md w-[16rem]'
          onClick={() => navigate("users")}>
          Manage users
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className='custom-tooltip'
        style={{
          backgroundColor: "black",
          padding: 10,
          borderRadius: 10,
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}>
        <p className='label'>{`${label}`}</p>
        <div>
          {payload.map((pld, i) => (
            <div
              style={{ display: "flex", flexDirection: "row", gap: 10 }}
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
