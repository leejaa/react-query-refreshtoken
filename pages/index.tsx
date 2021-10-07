import axios from 'axios';
import type { NextPage } from 'next';
import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

const Home: NextPage = () => {
  const queryClient = useQueryClient();

  const { status, data, error, isFetching } = useQuery('todos', async () => {
    const res = await axios.get('/api/data');
    return res.data;
  });

  const addListMutation = useMutation(
    () =>
      axios.post('/api/data', {
        accessToken: localStorage.getItem('accessToken'),
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('todos');
      },
    }
  );

  const handleClick = useCallback(() => {
    addListMutation.mutate();
  }, [addListMutation]);

  return (
    <div>
      {JSON.stringify(data, null, 2)}
      <button onClick={handleClick}>버튼</button>
    </div>
  );
};

export default Home;
