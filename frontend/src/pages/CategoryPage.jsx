import React, { useState, useEffect, useCallback } from 'react'
import { FilterBar } from '../components/FilterBar'
import { useDebouncedCallback } from 'use-debounce';
const CategoryPage = () => {
    const [movies, setMovies] = useState([]);
    const [tvShows, setTvShows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentGenre, setCurrentGenre] = useState('');
    const fetchCategoryData = useCallback(async (genreName) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/movie/genre/${genreName}`);
            const data = await response.json();
            if (data.success) {
                setMovies(data.movies);
                setTvShows(data.tv);
            } else {
                setMovies([]);
                setTvShows([]);
            }
        } catch (error) {
            console.error("Error fetching category data:", error);
        } finally {
            setLoading(false);
        }
    }, []);
    console.log(movies);
    
    const debouncedFetchCategoryData = useDebouncedCallback(fetchCategoryData, 300);

    const handleFilterChange = (genreName) => {
        setCurrentGenre(genreName);
        debouncedFetchCategoryData(genreName);
    };
   

    return (
        <div>
            <FilterBar onFilterChange={handleFilterChange} />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <h3>Movies</h3>
                    <div className="movies">
                        {movies.length ? (
                            movies.map(movie => (
                                <div key={movie.id}>
                                    <h4>{movie.title}</h4>
                                </div>
                            ))
                        ) : (
                            <p>No movies found for this genre</p>
                        )}
                    </div>

                    <h3>TV Shows</h3>
                    <div className="tv-shows">
                        {tvShows.length ? (
                            tvShows.map(tv => (
                                <div key={tv.id}>
                                    <h4>{tv.name}</h4>
                                </div>
                            ))
                        ) : (
                            <p>No TV shows found for this genre</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
