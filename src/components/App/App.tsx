import css from './App.module.css'
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';


import { fetchMovies } from "../../services/movieService";
import type { Movie } from '../../types/movie';

import SearchBar from '../SearchBar/SearchBar';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';


import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';

interface MoviesResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export default function App() {

 
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery<MoviesResponse>({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== '',
    placeholderData: keepPreviousData,
  });

  
  const totalPages = data?.total_pages ?? 0;


  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };


 const handleCloseModal = () => {
    setSelectedMovie(null);
  };



  const handleSearch = async (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);}


useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [isSuccess, data]);


   return (
      <div className={css.app}>
       <SearchBar onSubmit={handleSearch} />
       <Toaster position="top-right" />
    

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && data.results.length > 0 && !isError && (
        <>
          <MovieGrid movies={data.results} onSelect={handleSelect} />
          
          {isSuccess && totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
     
  );
}