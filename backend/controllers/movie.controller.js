import { fetchMovies } from "../services/movies.service.js"


export async function getTrendingMovies(req, res) {
    try {
        const data = await fetchMovies("https://api.themoviedb.org/3/trending/movie/day?language=en-US");
        const randomMovie = data.results[Math.floor(Math.random() * data.results?.length)];

        res.json({ success: true, content: randomMovie });



    } catch (error) {

        res.status(500).json({ success: false, message: "Internal Server Error" });

    }



}

//889737

export async function getTrailerMovie(req, res) {
    const { id } = req.params;
    try {

        const data = await fetchMovies(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`);


        res.json({ success: true, trailers: data.results });



    } catch (error) {
        if (error.message.includes("404")) {
            return res.status(404).send(null)
        }

        res.status(500).json({ success: false, message: "Internal Server Error" });

    }



}

export async function getDetailsMovie(req, res) {
    const { id } = req.params;
    try {

        const data = await fetchMovies(`https://api.themoviedb.org/3/movie/${id}?language=en-US`);


        res.status(200).json({ success: true, content: data });



    } catch (error) {
        if (error.message.includes("404")) {
            return res.status(404).send(null)
        }

        res.status(500).json({ success: false, message: "Internal Server Error" });

    }



}

export async function getSimilarMovie(req, res) {
    const { id } = req.params;
    try {

        const data = await fetchMovies(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`);


        res.status(200).json({ success: true, similar: data });



    } catch (error) {
        if (error.message.includes("404")) {
            return res.status(404).send(null)
        }

        res.status(500).json({ success: false, message: "Internal Server Error" });

    }



}
export async function getGenre(req, res) {
    try {
        // Realizar ambas peticiones en paralelo
        const [movieGenres, tvGenres] = await Promise.all([
            fetchMovies('https://api.themoviedb.org/3/genre/movie/list?language=en'),
            fetchMovies('https://api.themoviedb.org/3/genre/tv/list?language=en')
        ]);

        // Validar que las respuestas tengan el formato esperado
        if (!movieGenres?.genres || !tvGenres?.genres) {
            throw new Error('Invalid response format from the API');
        }

        // Combinar las listas de géneros y eliminar duplicados por id
        const combinedGenres = [
            ...movieGenres.genres,
            ...tvGenres.genres
        ];
        const uniqueGenres = Array.from(
            new Map(combinedGenres.map(genre => [genre.id, genre])).values()
        );

        // Ordenar alfabéticamente por nombre
        const sortedGenres = uniqueGenres.sort((a, b) => 
            a.name.localeCompare(b.name, 'en')
        );

        // Responder con los géneros procesados
        res.status(200).json({
            success: true,
            genres: sortedGenres
        });
    } catch (error) {
        // Loggear el error para debugging y responder con un error genérico
        console.error('Error fetching genres:', error.message || error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}



export async function getCategoryMovie(req, res) {
    const { category } = req.params;

	try {
		const data = await fetchMovies(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`);
		res.status(200).json({ success: true, content: data.results });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}


}

export async function getCategoryList(req, res) {
    const { genreName } = req.params;

    try {
        // Obtener listas de géneros para películas y series
        const [movieGenresData, tvGenresData] = await Promise.all([
            fetchMovies('https://api.themoviedb.org/3/genre/movie/list?language=en-US'),
            fetchMovies('https://api.themoviedb.org/3/genre/tv/list?language=en-US'),
        ]);

        // Buscar el ID del género solicitado en ambas listas
        const movieGenre = movieGenresData.genres.find((g) => g.name.toLowerCase() === genreName.toLowerCase());
        const tvGenre = tvGenresData.genres.find((g) => g.name.toLowerCase() === genreName.toLowerCase());

        if (!movieGenre && !tvGenre) {
            return res.status(404).json({ 
                success: false, 
                message: `Genre "${genreName}" not found in either movies or TV shows.` 
            });
        }

        // Obtener películas y series correspondientes al género
        const [moviesData, tvData] = await Promise.all([
            movieGenre ? fetchMovies(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${movieGenre.id}`) : { results: [] },
            tvGenre ? fetchMovies(`https://api.themoviedb.org/3/discover/tv?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${tvGenre.id}`) : { results: [] },
        ]);

        // Responder con los datos de películas y series
        res.status(200).json({ 
            success: true, 
            genre: genreName, 
            movies: moviesData.results, 
            tv: tvData.results 
        });
       
        
    } catch (error) {
        console.error(`Error fetching data for genre "${genreName}":`, error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


//https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=genreid