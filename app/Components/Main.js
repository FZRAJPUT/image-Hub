"use client";
import { Download, Search } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Loader from "./Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const Main = () => {
  const [input, setInput] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [download, setDownload] = useState(false);
  const observer = useRef(null);

  const API_KEY = "BxzsLkkcx-jlK6zfPM_mA2baONy2k1NY9rTdvhkFghs";

  const fetchImages = async (newPage = 1, searchTerm = input) => {
    setLoading(true);
    try {
      const url = searchTerm
        ? `https://api.unsplash.com/search/photos?page=${newPage}&query=${searchTerm}&client_id=${API_KEY}&per_page=12`
        : `https://api.unsplash.com/photos/random?client_id=${API_KEY}&count=12`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch images");

      const data = await response.json();
      const result = searchTerm ? data.results : data;

      setImages(newPage > 1 ? (prev) => [...prev, ...result] : result);
      setPage(newPage);
    } catch (err) {
      toast.error("Failed to fetch images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (input.trim() === "") {
      toast.warning("Please enter an image name to search");
      return;
    }
    fetchImages(1, input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleDownload = async (url) => {
    setDownload(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to download image");

      const blob = await response.blob();
      const urlObject = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlObject;
      link.download = "image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlObject);
      toast.success("Image downloaded successfully!");
    } catch {
      toast.error("Failed to download the image");
    } finally {
      setDownload(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="min-w-[90%] min-h-screen flex px-10 flex-col items-center py-16 bg-gradient-to-r from-gray-100 to-gray-200">
      <p className="text-gray-700 text-xl font-semibold my-6 text-center">
        Discover and download high-quality images effortlessly!
      </p>

        <div className="w-full max-w-lg">
          <div className="relative">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Search images"
              value={input}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="absolute left-3 top-2.5">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1.5 bg-sky-500 text-white px-3 py-1 rounded-md hover:bg-sky-600 transition-colors"
            >
              Search
            </button>
            <div></div>
          </div>
        </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
        {images.map((image) => (
          <motion.div
            key={image.id}
            className="relative overflow-hidden group rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={image.urls.small}
              alt="random"
              className="w-full h-auto object-cover rounded-lg"
            />
            <button
              onClick={() => handleDownload(image.urls.full)}
              className="absolute bottom-2 right-2 flex items-center justify-center px-3 py-2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded transition-opacity opacity-0 group-hover:opacity-100"
            >
              {!download ? <Download size={20} /> : <Loader />}
            </button>
          </motion.div>
        ))}
      </div>

      {loading && <Loader />}
      <ToastContainer />
    </div>
  );
};

export default Main;
