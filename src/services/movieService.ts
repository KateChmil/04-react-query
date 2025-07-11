import axios from 'axios';
import type { Movie } from "../types/movie.ts";

const myKey = import.meta.env.VITE_API_KEY;
interface MoviesResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}



export const fetchMovies = async (query: string, page = 1): Promise<MoviesResponse> => {
    const config = {
        params: { query, page },
        headers: {
            Authorization: `Bearer ${myKey}`
        },
    }
    const response = await axios.get<MoviesResponse>(
        'https://api.themoviedb.org/3/search/movie',
        config
    );

    return response.data;
}