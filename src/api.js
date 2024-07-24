const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// [
//   {
//     id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
//     name: 'string',
//     shortDesc: 'string',
//     fullDesc: 'string',
//     date: '2024-07-20T06:59:53.295Z',
//     status: true,
//   },
// ];
export const fetchTodos = async (query) => {
  if (query.type === 'all') {
    return fetchAllTodos(query);
  }

  if (query.type === 'byDate') {
    return fetchTodosByDate(query);
  }

  if (query.type === 'byName') {
    return fetchTodosByName(query);
  }
};

const fetchAllTodos = async (query) => {
  const response = await fetch(
    `${API_BASE_URL}/todos?limit=${query.limit}&offset=${query.offset}`,
    { method: 'GET' }
  );

  await checkError(response);

  return response.json();
};

const fetchTodosByDate = async (query) => {
  const response = await fetch(
    `${API_BASE_URL}/todos/date?from=${query.from}&to=${query.to}&limit=${
      query.limit
    }&offset=${query.offset}${
      query.status !== null ? `&status=${query.status}` : ''
    }`,
    { method: 'GET' }
  );
  await checkError(response);

  return response.json();
};

const fetchTodosByName = async (query) => {
  const response = await fetch(
    `${API_BASE_URL}/todos/find?q=${query.q}&limit=${query.limit}&offset=${query.offset}`,
    { method: 'GET' }
  );

  await checkError(response);

  return response.json();
};

async function checkError(response) {
  if (!response.ok) {
    const isJson = response.headers
      .get('Content-Type')
      .includes('application/json');

    if (isJson) {
      const error = await response.json();
      throw new Error(error.error);
    }

    throw new Error(response.statusText);
  }
}
