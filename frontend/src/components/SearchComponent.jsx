import React, { useState } from 'react';
import axios from 'axios';
import { SMALL_IMG_BASE_URL } from '../hook/constants';

const SearchComponent = ({ addHistorial }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;
        try {
            const res = await axios.get(`/api/search?query=${searchTerm}`);
            setSearchResults(res.data.results); // Asume que la API devuelve los resultados de búsqueda.
        } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchResults([]);
        }
    };

    const handleSelectMovie = async (movie) => {
        try {
            // Guarda en el historial al hacer clic
            await axios.post(`/api/search/historial`, { ...movie });
            addHistorial(movie); // Actualiza el historial en el componente padre
        } catch (error) {
            console.error("Error adding to history:", error);
        }
    };

    return (
        <div className='search-container'>
            <input
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search for a movie...'
                className='search-input'
            />
            <button onClick={handleSearch} className='search-button'>Search</button>
            <div className='search-results'>
                {searchResults.map((movie) => (
                    <div
                        key={movie.id}
                        className='search-result-item'
                        onClick={() => handleSelectMovie(movie)}
                    >
                        <img
                            src={SMALL_IMG_BASE_URL + movie.image}
                            alt={movie.title}
                            className='result-image'
                        />
                        <span>{movie.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchComponent;
