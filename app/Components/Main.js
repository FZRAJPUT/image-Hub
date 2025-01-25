"use client";
import { Download } from "lucide-react";
import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Main = () => {
  const [input, setInput] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [download, setDownload] = useState(false);

  const API_KEY = "BxzsLkkcx-jlK6zfPM_mA2baONy2k1NY9rTdvhkFghs";

  const fetchRandomImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?client_id=${API_KEY}&count=12`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch random images");
      }
      const data = await response.json();
      setImages(data);
    } catch (err) {
      toast.error("Failed to fetch random images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const searchImages = async (newPage = 1) => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?page=${newPage}&query=${input}&client_id=${API_KEY}&per_page=12`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const data = await response.json();
      const result = data.results;

      if (result.length === 0) {
        toast.info(`No images found for "${input}"`);
        return;
      }

      if (newPage > 1) {
        setImages((prevImages) => [...prevImages, ...result]);
      } else {
        setImages(result);
      }

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
    setPage(1);
    searchImages(1);
  };

  const handleSeeMore = () => {
    if (input.trim() === "") {
      toast.warning("Please enter an image name to see more results");
      return;
    }
    searchImages(page + 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDownload = async (url) => {
    setDownload(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to download image");
      }
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
    } catch (error) {
      toast.error("Failed to download the image");
    } finally {
      setDownload(false);
    }
  };

  useEffect(() => {
    fetchRandomImages(); // Fetch random images on initial load
  }, []);

  return (
    <div className="min-w-[90%] min-h-[100vh] flex flex-col items-center">
      <h1 className="head text-[4vw] font-[600] text-sky-500">image-Hub</h1>
      <p className="pera text-[1vw] text-gray-600 mb-7 text-center">
        Find and download high-quality images with ease. Just enter a keyword
        and explore!
      </p>
      <div className="search flex flex-col items-center mb-6">
        <div className="flex gap-3 mb-2 w-full">
          <input
            className="rounded py-2 px-4 w-full bg-[#ffffff] shadow-md"
            type="text"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            value={input}
            placeholder="Search all images"
          />
          <button
            onClick={handleSearch}
            className="bg-sky-500 hover:bg-sky-600 py-2 px-4 rounded text-white shadow-md"
          >
            Search
          </button>
        </div>
      </div>

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative mb-4 break-inside-avoid rounded overflow-hidden group"
          >
            {/* Image */}
            <img
              src={image.urls.small}
              alt="random"
              className="w-full h-auto object-cover"
            />
            {/* Download Button */}
            <button
              onClick={() => handleDownload(image.urls.full)}
              className="absolute bottom-2 right-2 flex items-center justify-center px-3 py-2 bg-[#8080806f] hover:bg-[#8f8f8fb0] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {!download ? <Download size={20} /> : <Loader />}
            </button>
          </div>
        ))}
      </div>

      {loading && <p className="mt-4 text-black">Loading...</p>}

      {images.length > 0 && !loading && (
        <button
          onClick={handleSeeMore}
          className="mt-3 mb-2 bg-sky-500 hover:bg-sky-600 py-2 px-4 rounded text-white shadow-md"
        >
          See More
        </button>
      )}

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default Main;
