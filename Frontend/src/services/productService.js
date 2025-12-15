import axios from "axios";

// Backend base URL
const BASE_URL = "http://localhost:3001/api/products";

export const fetchProducts = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const createProduct = async (productFormData) => {
  const res = await axios.post(BASE_URL, productFormData);
  return res.data;
};


export const updateProduct = async (id, product) => {
  const formData = new FormData();
  formData.append("name", product.name);
  formData.append("category", product.category);
  formData.append("description", product.description);
  if (product.imageFile) formData.append("image", product.imageFile);

  const res = await axios.put(`${BASE_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};
