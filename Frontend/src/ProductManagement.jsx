import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  addProduct,
  editProduct,
  removeProduct,
} from "./store/productSlice";

const CARD_WIDTH = 450;
const GAP = 16;
const VISIBLE_CARDS = 2;

const ProductManagement = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    imageFile: null,
    imagePreview: null,
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);
  const products = Array.isArray(items) ? items : [];

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) setErrorMsg(error);
    else setErrorMsg("");
  }, [error]);

  const scrollToIndex = (index) => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollTo({
      left: index * (CARD_WIDTH + GAP),
      behavior: "smooth",
    });
  };

  const handleNext = () => {
    const maxIndex = products.length - VISIBLE_CARDS;
    if (currentIndex < maxIndex) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // inside handleImageChange
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size < 1.3 MB
    const maxSize = 1.3 * 1024 * 1024; // 1.3MB
    if (file.size > maxSize) {
      setErrorMsg("Image size should be less than 1.3 MB");
      return;
    }

    setForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  // inside handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (
      !form.name ||
      !form.category ||
      !form.description ||
      (!form.imageFile && !editId)
    ) {
      setErrorMsg("All fields are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("description", form.description);
      if (form.imageFile) formData.append("imageFile", form.imageFile);

      if (editId) {
        await dispatch(editProduct({ id: editId, product: form })).unwrap();
      } else {
        await dispatch(addProduct(formData)).unwrap();
      }

      setForm({
        name: "",
        category: "",
        description: "",
        imageFile: null,
        imagePreview: null,
      });
      setEditId(null);
    } catch (err) {
      if (typeof err === "string" && err.includes("request entity too large")) {
        setErrorMsg("Upload image less than 1.3 MB");
      } else {
        setErrorMsg(err || "Failed to save product");
      }
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      imageFile: null,
      imagePreview: `http://localhost:3001/${product.image}`,
    });
    setEditId(product._id);
    setErrorMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(removeProduct(id)).unwrap();
      } catch (err) {
        setErrorMsg(err || "Failed to delete product");
      }
    }
  };

  return (
    <>
      {/* Header */}
      <div className="bg-gray-300 ps-16">
        <h1 className="text-2xl font-bold ">👋 Product Management</h1>
        <h1 className=" mb-6 text-gray-600">
          Welcome back. Manage products here
        </h1>
      </div>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 rounded-lg p-6 mb-6 shadow border"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center items-center">
            <div className="flex flex-col gap-4">
              <label className="-mb-3">Product Name</label>
              <input
                type="text"
                placeholder="Product Name"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className="border border-gray-800 rounded px-3 py-2 w-full"
              />
              <label className="-mb-3">Category</label>
              <input
                type="text"
                placeholder="Category"
                name="category"
                value={form.category}
                onChange={handleInputChange}
                className="border border-gray-800 rounded px-3 py-2 w-full"
              />
              <label className="-mb-3">Description</label>
              <textarea
                placeholder="Description"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                className="border border-gray-800 rounded px-3 py-2 w-full md:col-span-2"
              />
            </div>
            <div className="flex justify-center items-center rounded h-32 cursor-pointer relative">
              {form.imagePreview ? (
                <img
                  src={form.imagePreview}
                  alt="Preview"
                  className="object-cover w-full h-full rounded"
                />
              ) : (
                <div className="flex flex-col justify-center items-center gap-2 ">
                  <div className="rounded-full w-24 h-24 p-5 flex justify-center items-center bg-gray-100 ">
                    <svg
                      width="50"
                      height="57"
                      viewBox="0 0 61 67"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M26.6658 10.3445C26.6658 13.0881 25.6621 15.7193 23.8756 17.6592C22.0891 19.5992 19.6661 20.6891 17.1396 20.6891C14.613 20.6891 12.19 19.5992 10.4035 17.6592C8.617 15.7193 7.61335 13.0881 7.61335 10.3445C7.61335 7.601 8.617 4.96982 10.4035 3.02985C12.19 1.08987 14.613 0 17.1396 0C19.6661 0 22.0891 1.08987 23.8756 3.02985C25.6621 4.96982 26.6658 7.601 26.6658 10.3445ZM42.7651 27.1151C42.4077 26.9207 42.0031 26.8533 41.6086 26.9224C41.214 26.9914 40.8494 27.1935 40.5664 27.4999L26.4295 46.989L16.2936 35.519C15.9277 35.2544 15.4887 35.1354 15.0512 35.1822C14.6136 35.229 14.2045 35.4386 13.893 35.7756L0 53.7916V62.0672C0 63.1647 0.40146 64.2171 1.11606 64.9931C1.83067 65.7691 2.79988 66.2051 3.81048 66.2051H57.1573C57.6577 66.2051 58.1532 66.098 58.6155 65.8901C59.0778 65.6821 59.4978 65.3774 59.8517 64.9931C60.2055 64.6089 60.4862 64.1527 60.6777 63.6507C60.8692 63.1487 60.9677 62.6106 60.9677 62.0672V43.4471L42.7651 27.1151Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">Upload Image</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
          {errorMsg && <div className="text-red-600 mt-2">{errorMsg}</div>}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-14 py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>

        <div className="bg-gray-50 rounded-lg p-6 mb-6 shadow border">
          {/* Search & Filter */}
          <div className="flex items-center gap-4 mb-4">
            {/* Search Input */}
            <div className="flex items-center border border-gray-300 rounded-full px-3 py-2 w-[60%] bg-gray-300">
              <FiSearch className="text-gray-700 mr-2" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-300 placeholder-black outline-none text-sm"
              />
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-full px-4 py-2 bg-gray-300 text-sm"
            >
              <option value="">All Categories</option>
              {/* Dynamically list categories if needed */}
              {[...new Set(products.map((p) => p.category))].map(
                (cat) =>
                  cat && (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  )
              )}
            </select>
          </div>

          {/* Slider */}
          <div className="relative flex items-center justify-center p-6 ">
            {/* Left Arrow */}
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="bg-white p-3 rounded-full mr-5 shadow-2xl z-10 disabled:opacity-40"
            >
              <FaChevronLeft size={35} />
            </button>

            {/* Carousel */}
            <div ref={carouselRef} className="flex gap-4 overflow-hidden px-12">
              {products
                .filter(
                  (product) =>
                    (!search ||
                      product.name
                        .toLowerCase()
                        .includes(search.toLowerCase())) &&
                    (!selectedCategory || product.category === selectedCategory)
                )
                .map((product) => (
                  <div
                    key={product._id}
                    className="w-[450px] flex-shrink-0 bg-white rounded-lg shadow overflow-hidden relative"
                  >
                    <img
                      src={`http://localhost:3001/${product.image}`}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />

                    <div className="absolute bottom-0 left-0 w-full bg-black/80 text-white p-3 flex justify-between">
                      <div>
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="text-sm">{product.category}</p>
                      </div>
                      <div className="flex gap-6">
                        <button
                          className="rounded"
                          onClick={() => handleEdit(product)}
                          type="button"
                        >
                          <FiEdit size={20} />
                        </button>
                        <button
                          className="rounded text-red-700"
                          onClick={() => handleDelete(product._id)}
                          type="button"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              {products.length === 0 && (
                <div className="text-center w-full text-gray-500">
                  No products found.
                </div>
              )}
            </div>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              disabled={currentIndex >= products.length - VISIBLE_CARDS}
              className="bg-white p-3 rounded-full ml-5 shadow-2xl z-10 disabled:opacity-40"
            >
              <FaChevronRight size={35} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductManagement;
