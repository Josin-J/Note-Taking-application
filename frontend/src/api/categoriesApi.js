const API = '/api/categories';

function headers(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const getCategories = async (token) => {
  const res = await fetch(API, { headers: headers(token) });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

export const createCategory = async (token, name) => {
  const res = await fetch(API, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
};

export const updateCategory = async (token, id, name) => {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to update category');
  return res.json();
};

export const deleteCategory = async (token, id) => {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: headers(token),
  });
  if (!res.ok) throw new Error('Failed to delete category');
  return res.json();
};
