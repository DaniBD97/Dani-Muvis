import { User } from "../models/user.model.js"; 
import { fetchMovies } from "../services/movies.service.js";


export async function searchActor(req, res) {
	const { query } = req.params;
	try {
		const response = await fetchMovies(
			`https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
		);

		if (response.results.length === 0) {
			return res.status(404).send(null);
		}

		await User.findByIdAndUpdate(req.user._id, {
			$push: {
				searchHistory: {
					id: response.results[0].id,
					image: response.results[0].profile_path,
					title: response.results[0].name,
					searchType: "person",
					createdAt: new Date(),
				},
			},
		});

		res.status(200).json({ success: true, content: response.results });
	} catch (error) {
		console.log("Error in searchPerson controller: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function searchMovie(req, res) {
	const { query } = req.params;

	try {
		const response = await fetchMovies(
			`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
		);

		if (response.results.length === 0) {
			return res.status(404).send(null);
		}

		await User.findByIdAndUpdate(req.user._id, {
			$push: {
				searchHistory: {
					id: response.results[0].id,
					image: response.results[0].poster_path,
					title: response.results[0].title,
					searchType: "movie",
					createdAt: new Date(),
				},
			},
		});
		res.status(200).json({ success: true, content: response.results });
	} catch (error) {
		console.log("Error in searchMovie controller: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function searchTvshow(req, res) {
	const { query } = req.params;

	try {
		const response = await fetchMovies(
			`https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
		);

		if (response.results.length === 0) {
			return res.status(404).send(null);
		}

		await User.findByIdAndUpdate(req.user._id, {
			$push: {
				searchHistory: {
					id: response.results[0].id,
					image: response.results[0].poster_path,
					title: response.results[0].name,
					searchType: "tv",
					createdAt: new Date(),
				},
			},
		});
		res.json({ success: true, content: response.results });
	} catch (error) {
		console.log("Error in searchTv controller: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getHistorial(req, res) {
	try {
		res.status(200).json({ success: true, content: req.user.searchHistory });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getFavoriteList(req, res) {
	try {
		res.status(200).json({ success: true, content: req.user.favorite });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function removeFromHistorial(req, res) {
	let { id } = req.params;

	id = parseInt(id);

	try {
		await User.findByIdAndUpdate(req.user._id, {
			$pull: {
				searchHistory: { id: id },
			},
		});

		res.status(200).json({ success: true, message: "Item removed from search history" });
	} catch (error) {
		console.log("Error in removeItemFromSearchHistory controller: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function removeFromFavorite(req, res) {
	let { id } = req.params;

	id = parseInt(id);

	try {
		await User.findByIdAndUpdate(req.user._id, {
			$pull: {
				favorite: { id: id },
			},
		});

		res.status(200).json({ success: true, message: "Item removed from search history" });
	} catch (error) {
		console.log("Error in removeFavorite controller: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

// En tu archivo de controladores
export async function addToSearchHistory(req, res) {
    const { id, image, title, searchType } = req.body;

    try {
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                searchHistory: {
                    id,
                    image,
                    title,
                    searchType,
                    createdAt: new Date(),
                },
            },
        });

        res.status(200).json({ success: true, message: "Added to search history" });
    } catch (error) {
        console.log("Error in addToSearchHistory controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


export async function addToFavorite(req, res) {
    const { id, image, title, favoriteType } = req.body;

    try {
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                favorite: {
                    id,
                    image,
                    title,
                    favoriteType,
                    createdAt: new Date(),
                },
            },
        });

        res.status(200).json({ success: true, message: "Added to search history" });
    } catch (error) {
        console.log("Error in addToFavorite controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}