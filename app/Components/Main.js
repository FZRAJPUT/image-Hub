"use client"
import React, { useState } from 'react'

const Main = () => {
    const [input, setInput] = useState('');
    const [images, setImages] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [emptyInputError, setEmptyInputError] = useState('');
    const [noMoreImages, setNoMoreImages] = useState(false);

    const data_handling = async (newPage = 1) => {
        setLoading(true);
        setError(null);

        const API_KEY = "BxzsLkkcx-jlK6zfPM_mA2baONy2k1NY9rTdvhkFghs";

        try {
            const response = await fetch(`https://api.unsplash.com/search/photos?page=${newPage}&query=${input}&client_id=${API_KEY}&per_page=12`);
            const data = await response.json();
            const result = data.results;

            if (result.length === 0) {
                setNoMoreImages(true);
                return;
            }

            if (newPage > 1) {
                setImages(prevImages => [...prevImages, ...result]);
            } else {
                setImages(result);
            }

            setPage(newPage);
            setNoMoreImages(false);
        } catch (err) {
            setError("Failed to fetch images. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = () => {
        if (input.trim() === '') {
            setEmptyInputError('Please enter an image name.');
            return;
        }
        setEmptyInputError('');
        setPage(1);
        setNoMoreImages(false);
        data_handling(1);
    };

    const handleSeeMore = () => {
        if (input.trim() === '') {
            setEmptyInputError('Please enter an image name.');
            return;
        }
        data_handling(page + 1);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleDownload = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const urlObject = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = urlObject;
            link.download = 'image.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(urlObject); // Clean up
        } catch (error) {
            console.error('Failed to download image', error);
        }
    }

    return (
        <div className='min-w-[90%] min-h-[100vh] flex flex-col items-center'>
            <h1 className='head text-[4vw] font-[600] text-sky-500'>image-Hub</h1>
            <p className='pera text-[1vw] text-gray-600 mb-7 text-center'>Find and download high-quality images with ease. Just enter a keyword and explore!</p>
            <div className='seach flex flex-col items-center mb-6'>
                <div className='flex gap-3 mb-2 w-full'>
                    <input
                        className='rounded py-2 px-4 w-full bg-[#ffffff] shadow-md'
                        type='text'
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        value={input}
                        placeholder='Search all images'
                    />
                    <button onClick={handleSearch} className='bg-sky-500 hover:bg-sky-600 py-2 px-4 rounded text-white shadow-md'>
                        Search
                    </button>
                </div>
                {emptyInputError && <p className="text-red-500">{emptyInputError}</p>}
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-[90%]'>
                {images.map((emage) => {
                    let src = emage.urls.small;
                    return (
                        <div key={emage.id} className='relative bg-white p-2 rounded shadow-lg group'>
                            <img src={src} alt='image' className='w-full h-auto rounded' />
                            <button
                                onClick={() => handleDownload(emage.urls.full)}
                                className='absolute inset-0 bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 flex justify-center items-center rounded transition-opacity duration-300'>
                                Download
                            </button>
                        </div>
                    );
                })}
            </div>

            {loading && <p className="mt-4">Loading...</p>}

            {noMoreImages && !loading && <p className="mt-4 text-gray-500">No more images available.</p>}

            {images.length > 0 && !loading && !noMoreImages && (
                <button onClick={handleSeeMore} className='mt-6 mb-2 bg-sky-500 hover:bg-sky-600 py-2 px-4 rounded text-white shadow-md'>
                    See More
                </button>
            )}
        </div>
    )
}

export default Main;
