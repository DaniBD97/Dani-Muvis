import React, { useState } from 'react';
import { useContentStore } from '../store/content';
import { Search } from "lucide-react";
import { ORIGINAL_IMG_BASE_URL } from '../hook/constants';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SearchPage = () => {
    const [active, setActive] = useState("movie");
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const { setContentType } = useContentStore();

    const handleTab = (tab) => {
        setActive(tab);
        tab === "movie" ? setContentType("movie") : setContentType(tab);
        setResults([]);
        setSearchTerm("");
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            toast.error("Please enter a search term");
            return;
        }

        try {
            const res = await axios.get(`/api/search/${active}/${searchTerm}`);
            if (res.data.success) {
                setResults(res.data.content);
                toast.success("Search completed successfully");
            }
        } catch (error) {
            if (error.response?.status === 404) {
                toast.error("Nothing found, make sure you are searching under the right category");
            } else {
                toast.error("An error occurred, please try again later");
            }
            setResults([]);
        }
    };

    const handleAddToHistory = async (item) => {
        try {
            const historyItem = {
                id: item.id,
                image: active === "actors" ? item.profile_path : item.poster_path,
                title: active === "actors" ? item.name : (item.title || item.name),
                searchType: active
            };

            const response = await axios.post('/api/search/history', historyItem);
            
            if (response.data.success) {
                toast.success("Added to history!");
            }
        } catch (error) {
            console.error('Error adding to history:', error);
            toast.error("Failed to add to history");
        }
    };

    return (
        <section className='bg-black min-h-screen text-white'>
            <article className='container mx-auto px-4 py-8'>
                {/* Tabs */}
                <div className='flex justify-center gap-3 mb-4'>
                    {["movie", "tv", "actors"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => handleTab(tab)}
                            className={`py-2 px-4 rounded ${active === tab ? "bg-red-600" : "bg-gray-800"}
                                hover:bg-red-700`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Search Form */}
                <form
                    onSubmit={handleSearch}
                    className='flex gap-2 items-stretch mb-8 max-w-2xl mx-auto'
                >
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={"Search a " + active}
                        className='w-full p-2 rounded bg-gray-800 text-white'
                    />
                    <button className='bg-red-600 hover:bg-red-700 text-white p-2 rounded'>
                        <Search className='size-6' />
                    </button>
                </form>

                {/* Search Results */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {results.map((result) => {
                        if (!result.poster_path && !result.profile_path) return null;

                        return (
                            <div
                                key={result.id}
                                className='bg-gray-800 p-4 rounded'
                            >
                                {active === "actors" ? (
                                    <div 
                                        className='flex flex-col items-center cursor-pointer'
                                        onClick={() => handleAddToHistory(result)}
                                    >
                                        <img
                                            src={ORIGINAL_IMG_BASE_URL + result.profile_path}
                                            alt={result.name}
                                            className='max-h-96 rounded mx-auto'
                                        />
                                        <h2 className='mt-2 text-xl font-bold'>{result.name}</h2>
                                    </div>
                                ) : (
                                    <Link
                                        to={"/watch/" + result.id}
                                        onClick={() => {
                                            setContentType(active);
                                            handleAddToHistory(result);
                                        }}
                                    >
                                        <img
                                            src={ORIGINAL_IMG_BASE_URL + result.poster_path}
                                            alt={result.title || result.name}
                                            className='w-full h-auto rounded'
                                        />
                                        <h2 className='mt-2 text-xl font-bold'>
                                            {result.title || result.name}
                                        </h2>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            </article>
        </section>
    );
};

export default SearchPage;