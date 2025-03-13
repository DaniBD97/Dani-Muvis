import { Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { SMALL_IMG_BASE_URL } from '../hook/constants';
import { formatDate } from '../hook/FormatDate';
import axios from 'axios';
import GetTrendingContent from '../hook/GetTrendingContent';
import { Link } from 'react-router-dom';

const FavoritePage = () => {

    const [favorite, setFavorite] = useState([]);
    const { trendingContent } = GetTrendingContent();

    useEffect(() => {
        const getFavoriteList = async () => {
            try {
                const res = await axios.get(`/api/search/favoriteList`);


                setFavorite(res.data.content);

            } catch (error) {
                setFavorite([]);
            }
        };
        getFavoriteList();
    }, []);





    const handleDelete = async (item) => {
        try {
            await axios.delete(`/api/search/favorites/${item.id}`);
            setFavorite(favorite.filter((element) => element.id !== item.id));
        } catch (error) {
            toast.error("Failed to delete search item");
        }
    };


    return (
        <div className='bg-black text-white min-h-screen'>


            <div className='max-w-6xl mx-auto px-4 py-8'>
                <h1 className='text-3xl font-bold mb-8'>Favorite List</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4'>
                    {favorite?.map((item) => (
                        <Link to={`/watch/${trendingContent?.id}`}>
                            <div key={item.id} className='bg-gray-800 p-4 rounded flex flex-col items-start'>
                                <img
                                    src={SMALL_IMG_BASE_URL + item.image}
                                    alt='History image'
                                    className='  object-cover '
                                />
                                <div className='flex flex-col'>
                                    <span className='text-white text-2xl mt-1'>{item.title}</span>
                                    <span className='text-gray-400 text-sm'>{formatDate(item.createdAt)}</span>
                                </div>
                                <section className='flex justify-between w-full items-center'>
                                    <Trash
                                        className='size-6 mt-3 rounded-full ml-4 cursor-pointer bg-black hover:fill-red-600 hover:text-red-600'
                                        onClick={() => handleDelete(item)}
                                    />

                                    <span
                                        className={`py-1 px-3 min-w-20 text-center rounded-full text-sm  ml-auto ${item.favoriteType === "movie"
                                            ? "bg-red-600"
                                            : item.favoriteType === "tv"
                                                ? "bg-blue-600"
                                                : "bg-green-600"
                                            }`}
                                    >
                                        {item.favoriteType[0].toUpperCase() + item.favoriteType.slice(1)}
                                    </span>

                                </section>


                            </div>
                        </Link>

                    ))}
                </div>
            </div>
        </div>
    )
}

export default FavoritePage