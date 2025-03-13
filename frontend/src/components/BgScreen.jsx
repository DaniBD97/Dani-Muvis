import { Info, Play } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MOVIE_CATEGORIES, ORIGINAL_IMG_BASE_URL, TV_CATEGORIES } from '../hook/constants'
import GetTrendingContent from '../hook/GetTrendingContent'
import { useContentStore } from '../store/content'
import Slider from './Slider'
import axios from 'axios'
import toast from 'react-hot-toast'

const BgScreen = () => {
    const { trendingContent } = GetTrendingContent();
    const { contentType } = useContentStore();
    const [imgLoading, setImgLoading] = useState(true);

    const handleAddToHistory = async () => {
        try {
            const historyItem = {
                id: trendingContent.id,
                image: trendingContent.poster_path,
                title: trendingContent.title || trendingContent.name,
                searchType: contentType
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

    if (!trendingContent)
        return (
            <div className='h-screen text-white relative'>
                <div className='absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer' />
            </div>
        );

    return (
        <>
            <div className='relative h-screen text-white'>
                {imgLoading && (
                    <div className='absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center shimmer -z-10' />
                )}

                <img
                    onLoad={() => {
                        setImgLoading(false);
                    }}
                    loading='lazy'
                    src={ORIGINAL_IMG_BASE_URL + trendingContent?.backdrop_path}
                    alt='hero img'
                    className='absolute top-0 left-0 w-full h-full object-cover -z-50'
                />

                <section
                    aria-hidden='true'
                    className='absolute top-0 left-0 w-full h-full bg-black/50 -z-50'
                />

                <article className='absolute top-0 left-0 w-full h-full flex flex-col justify-center
                    px-8 md:px-16 lg:px-32 '>
                    <section className='bg-gradient-to-b from-black via-transparent to-transparent absolute
                        w-full h-full top-0 left-0 -z-10'/>

                    <div className='max-w-2xl '>
                        <h1 className='mt-4 text-6xl font-extrabold text-balance '>
                            {trendingContent?.title || trendingContent?.name}
                        </h1>

                        <p className='mt-2 text-lg'>
                            {trendingContent?.release_date?.slice(0, 4) ||
                                trendingContent?.first_air_date?.slice(0, 4)
                            }{" "}
                            | {trendingContent?.adult ? "18+" : "PG-13"}
                            | Note: <span className=' rounded-full text-[20px '>{trendingContent?.vote_average?.toString().slice(0, 3)}</span>
                        </p>
                        <p className='mt-4 text-lg'>
                            {trendingContent?.overview}
                        </p>
                    </div>

                    <section className='flex mt-8'>
                        <Link
                            to={`/watch/${trendingContent?.id}`}
                            onClick={handleAddToHistory}
                            className='bg-white hover:bg-white/80 text-black font-bold py-2 px-4 rounded mr-4 flex
                                items-center'
                        >
                            <Play className='size-6 mr-2 fill-black' />
                            Play
                        </Link>

                        <Link
                            to={`/watch/${trendingContent?.id}`}
                            onClick={handleAddToHistory}
                            className='bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded flex items-center'
                        >
                            <Info className='size-6 mr-2' />
                            More Info
                        </Link>
                    </section>
                </article>
            </div>

            <div className='flex flex-col gap-10 bg-black py-10'>
                {contentType === "movie"
                    ? MOVIE_CATEGORIES.map((category) => <Slider key={category} category={category} />)
                    : TV_CATEGORIES.map((category) => <Slider key={category} category={category} />)}
            </div>
        </>
    )
}

export default BgScreen