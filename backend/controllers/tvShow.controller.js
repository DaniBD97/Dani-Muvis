import { fetchMovies } from "../services/movies.service.js"


export async function getTrendingShow(req, res) {
    try {
        const data = await fetchMovies("https://api.themoviedb.org/3/trending/tv/day?language=en-US");
        const randomTv = data.results[Math.floor(Math.random() * data.results?.length)];

        res.json({ success: true, content: randomTv });



    } catch (error) {

        res.status(500).json({ success: false, message: "Internal Server Error" });

    }



}

//889737

export async function getTrailerShow(req, res) {
    const { id } = req.params;
    try {

        const data = await fetchMovies(`https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`);


        res.json({ success: true, trailer: data.results });



    } catch (error) {
        if (error.message.includes("404")) {
            return res.status(404).send(null)
        }

        res.status(500).json({ success: false, message: "Internal Server Error" });

    }



}

export async function getDetailShow(req, res) {
    const { id } = req.params;
    try {

        const data = await fetchMovies(`https://api.themoviedb.org/3/tv/${id}?language=en-US`);


        res.status(200).json({ success: true, content: data });



    } catch (error) {
        if (error.message.includes("404")) {
            return res.status(404).send(null)
        }

        res.status(500).json({ success: false, message: "Internal Server Error" });

    }



}

export async function getSimilarShow(req, res) {
    const { id } = req.params;
    try {

        const data = await fetchMovies(`https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`);


        res.status(200).json({ success: true, content: data });



    } catch (error) {
        if (error.message.includes("404")) {
            return res.status(404).send(null)
        }

        res.status(500).json({ success: false, message: "Internal Server Error" });

    }



}


export async function getCategoryShow(req, res) {
    const { category } = req.params;

    try {
        const data = await fetchMovies(`https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`);
        res.status(200).json({ success: true, content: data.results });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }


}

export async function getCategoryShowList(req, res) {
    const { genreName } = req.params;

    try {
        // Obtener la lista de géneros
        const genresData = await fetchMovies('https://api.themoviedb.org/3/genre/tv/list?language=en-US');

        // Buscar el ID del género solicitado
        const genre = genresData.genres.find((g) => g.name.toLowerCase() === genreName.toLowerCase());
        if (!genre) {
            return res.status(404).json({ success: false, message: `Genre "${genreName}" not found` });
        }

        // Obtener películas del género
        const showData = await fetchMovies(`https://api.themoviedb.org/3/discover/tv?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genre.id}`);

        // Responder con las películas del género
        res.status(200).json({ success: true, genre: genre.name, show: showData.results });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}

//https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=genreid