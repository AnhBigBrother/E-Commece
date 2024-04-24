import { useEffect, useState } from 'react';
import axios from '../api/axios';

const useFetch = path => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(path)
      .then(res => {
        setData(res.data.results);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [path]);
  return [isLoading, data, setData];
};

export default useFetch;
