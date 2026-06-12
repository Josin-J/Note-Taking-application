const API = '/api/notes';

function headers(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const getNotes = async (token, categoryId, search) => {
  const params = new URLSearchParams();
  if (categoryId) params.set('category', categoryId);
  if (search) params.set('search', search);
  const qs = params.toString();
  const url = qs ? `${API}?${qs}` : API;
  const res = await fetch(url, { headers: headers(token) });
  if (!res.ok) throw new Error('Failed to fetch notes');
  return res.json();
};

export const createNote = async (token, note) => {
  const res = await fetch(API, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error('Failed to create note');
  return res.json();
};

export const updateNote = async (token, id, note) => {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error('Failed to update note');
  return res.json();
};

export const deleteNote = async (token, id) => {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: headers(token),
  });
  if (!res.ok) throw new Error('Failed to delete note');
  return res.json();
};
