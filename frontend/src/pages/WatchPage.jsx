import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useContentStore } from '../store/content';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ReactPlayer from "react-player"
import { ORIGINAL_IMG_BASE_URL, SMALL_IMG_BASE_URL } from '../hook/constants';
import Skeleton from '../components/Skeleton';
import toast from 'react-hot-toast'
function formatReleaseDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
const WatchPage = () => {
    const { id } = useParams();
    const [trailers, setTrailers] = useState([]);
    const [currentTrailerId, setCurrentTrailerId] = useState(0);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState({});
    const [similarContent, setSimilarContent] = useState([]);
    const { contentType } = useContentStore();

    const sliderRef = useRef(null);

    useEffect(() => {
        const getTrailers = async () => {
            try {
                const res = await axios.get(`/api/${contentType}/${id}/trailer`);
                console.log("respuests", res);

                setTrailers(res.data.trailers);
            } catch (error) {
                if (error.message.includes("404")) {
                    setTrailers([]);
                }
            }
        };

        getTrailers();
    }, [contentType, id]);

    useEffect(() => {
        const getSimilarContent = async () => {
            try {
                const res = await axios.get(`/api/${contentType}/${id}/similar`);
                setSimilarContent(res.data.similar.results);
                console.log("hola gola", res.data.similar);

            } catch (error) {
                if (error.message.includes("404")) {
                    setSimilarContent([]);
                }
            }
        };

        getSimilarContent();
    }, [contentType, id]);

    useEffect(() => {
        const getMovieDetail = async () => {
            try {
                const res = await axios.get(`/api/${contentType}/${id}/details`);
                setContent(res.data.content);
            } catch (error) {
                if (error.message.includes("404")) {
                    setContent(null);
                }
            } finally {
                setLoading(false);
            }
        };

        getMovieDetail();
    }, [contentType, id]);

    const handleFavorite = async () => {
        try {
            const favoriteItem = {
                id: content.id,
                image: content.poster_path,
                title: content.title || content.name,
                favoriteType: contentType
            };

            const response = await axios.post('/api/search/favorite', favoriteItem);
            
            if (response.data.success) {
                toast.success("Added to Favorite!");
            }
        } catch (error) {
            console.error('Error adding to history:', error);
            toast.error("Failed to add to history");
        }
    }

    const handleNext = () => {
        if (currentTrailerId < trailers.length - 1) {
            setCurrentTrailerId(currentTrailerId + 1)
        }
    }

    const handlePrev = () => {
        if (currentTrailerId > 0) {
            setCurrentTrailerId(currentTrailerId - 1)
        }

    }

    const scrollLeft = () => {
        if (sliderRef.current) sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: "smooth" });
    };
    const scrollRight = () => {
        if (sliderRef.current) sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: "smooth" });
    };



    console.log("trailers", trailers);
    console.log("similar Content", similarContent);
    console.log("Details", content);

    if (loading)
        return (
            <div className='min-h-screen bg-black p-10'>
                <Skeleton />
            </div>
        );

    return (
        <div className='bg-black min-h-screen text-white'>
            <div className='mx-auto container px-4 py-8 h-full'>
                {
                    trailers.length > 0 && (
                        <section className='flex mb-4  justify-between items-center'>

                            <button
                                disabled={currentTrailerId === 0}
                                className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4
                            rounded ${currentTrailerId === 0 ? 'cursor-not-allowed opacity-50' : " "}`}>
                                <ChevronLeft size={24}
                                    onClick={handlePrev}
                                />
                            </button>

                            <button
                                disabled={currentTrailerId === trailers.length - 1}
                                className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4
                            rounded ${currentTrailerId === trailers.length - 1 ? 'cursor-not-allowed opacity-50' : " "}`}>
                                <ChevronRight size={24}
                                    onClick={handleNext}
                                />
                            </button>
                        </section>
                    )
                }

                <article className='aspect-vide mb-8 p-2 sm:px-10 md:px-32'>
                    {
                        trailers.length > 0 && (
                            <ReactPlayer
                                loading={"lazy"}
                                width={"100%"}
                                height={"70vh"}
                                className="mx-auto overflow-hidden rounded-lg"
                                url={`https://www.youtube.com/watch?v=${trailers[currentTrailerId].key}`}
                            >

                            </ReactPlayer>
                        )
                    }
                    {
                        trailers?.length === 0 && (
                            <h1 className='text-xl text-center mt-5'>
                                No Trailers available for {" "}
                                <span className='font-bold text-red-600'>{content?.title || content?.name}</span>
                            </h1>
                        )
                    }

                </article>
                <section className='flex flex-col md:flex-row items-center justify-between gap-20
                max-w-6xl mx-auto'>

                    <article className='mb-4 md:mb-0 -mt-28'>
                        <button
                        onClick={handleFavorite}
                        
                        className='bg-red-700 p-2 mb-10 rounded-md hover:bg-red-600 '>
                            Add To Favorite
                        </button>
                        <h1 className='text-5xl font-bold text-balance'>
                            {content?.title || content?.name}

                        </h1>

                        <p className='mt-2 text-lg'>
                            {formatReleaseDate(content?.release_date || content?.first_air_date)} |{" "}
                            {content?.adult ? (
                                <span className='text-red-600'>18+</span>
                            ) : (
                                <span className='text-green-600'>PG-13</span>
                            )}{" "}
                        </p>
                        <p className='mt-4 text-lg'>{content?.overview}</p>

                    </article>
                    <img
                        src={ORIGINAL_IMG_BASE_URL + content?.poster_path}
                        alt='Poster image'
                        className='max-h-[600px] rounded-md'
                    />

                </section>
                {similarContent?.length > 0 && (
                    <div className='mt-12 max-w-7xl mx-auto relative'>
                        <h3 className='text-3xl font-bold mb-4'>Similar Movies/Tv Show</h3>

                        <div className='flex overflow-x-scroll scrollbar-hide gap-4 pb-4 group' ref={sliderRef}>
                            {similarContent?.map((content) => {
                                if (content.poster_path === null) return null;
                                return (
                                    <Link key={content.id} to={`/watch/${content.id}`} className='w-52 flex-none'>
                                        <img
                                            src={SMALL_IMG_BASE_URL + content.poster_path}
                                            alt='Poster path'
                                            className='w-full h-auto rounded-md'
                                        />
                                        <h4 className='mt-2 text-lg font-semibold'>{content.title || content.name}</h4>
                                    </Link>
                                );
                            })}

                            <ChevronRight
                                className='absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8
										opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer
										 bg-red-600 text-white rounded-full'
                                onClick={scrollRight}
                            />
                            <ChevronLeft
                                className='absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 opacity-0 
								group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 
								text-white rounded-full'
                                onClick={scrollLeft}
                            />
                        </div>
                    </div>
                )}

            </div>

        </div>
    )
}

export default WatchPage