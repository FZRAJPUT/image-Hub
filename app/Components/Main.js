"use client";
import { Download, Search, Heart } from "lucide-react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Loader from "./Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Down from "./Down";

const Main = () => {
  const [input, setInput] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [download, setDownload] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const observer = useRef(null);

  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

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

      setImages((prev) => (newPage === 1 ? result : [...prev, ...result]));
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
    setImages([]);
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

  const toggleFavorite = (image) => {
    setFavorites((prev) => {
      if (prev.some((fav) => fav.id === image.id)) {
        return prev.filter((fav) => fav.id !== image.id);
      } else {
        return [...prev, image];
      }
    });
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const lastImageRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !loading) {
            fetchImages(page + 1);
          }
        },
        { threshold: 1.0 }
      );
      if (node) observer.current.observe(node);
    },
    [loading, page]
  );

  return (
    <div className="min-w-full min-h-screen flex px-4 md:px-10 flex-col items-center bg-gradient-to-r from-gray-100 to-gray-200">
      <p className="text-gray-700 text-[15px] md:text-2xl font-semibold my-6 text-center px-4">
        Discover and download high-quality images effortlessly!
      </p>

      <div className="w-full max-w-2xl px-4 mb-10">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder="Search images"
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
        </div>
      </div>

      <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-4 w-full max-w-7xl">
        {images.map((image, index) => (
          <div
            key={image.id}
            ref={index === images.length - 1 ? lastImageRef : null}
            className="relative mb-4 overflow-hidden group rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <img
              src={image.urls.small}
              alt={image.alt_description || "Image"}
              className="w-full h-auto object-cover rounded-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105"
            />
            <div className="absolute bottom-2 right-2 flex space-x-2">
              <button onClick={() => handleDownload(image.urls.full)} className="absolute bottom-2 right-2 flex items-center justify-center px-3 py-2 bg-[#8080806f] hover:bg-[#8f8f8fb0] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {!download ? <Download size={20} /> : <Down />}
              </button>
              <button onClick={() => toggleFavorite(image)} className="absolute bottom-2 right-16 flex items-center justify-center px-3 py-2 bg-[#8080806f] hover:bg-[#8f8f8fb0] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                <Heart size={20} fill={favorites.some((fav) => fav.id === image.id) ? "white" : "none"} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {loading && <Loader />}
      <ToastContainer />
    </div>
  );
};

export default Main;
