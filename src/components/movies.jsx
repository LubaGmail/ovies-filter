import React, { Component } from 'react';
import { getMovies } from '../services/fakeMovieService';
import { getGenres } from '../services/fakeGenreService';
import Like from './common/like';
import Pagination from './common/pagination';
import { paginate } from '../utils/paginate';
import ListGroup from './common/listGroup';

class Movies extends Component {
    state = {  
        movies: [],
        genres: [],
        pageSize: 4,
        currentPage: 1,
        selectedGenre: null
    }

    componentDidMount() {
        const genres = [{_id: '0', name: 'All Movies'}, ...getGenres()];
        this.setState({
            movies: getMovies(),
            genres
        });
    }

    render() { 
        const {length: count} = this.state.movies;
        const {movies: allMovies, currentPage, pageSize, selectedGenre} = this.state;
        
        const filteredMovies = selectedGenre && selectedGenre._id !== '0'
                            ? allMovies.filter(m => m.genre._id === selectedGenre._id)
                            : allMovies;

        const movies = paginate(filteredMovies, currentPage, pageSize);

        if (count === 0) return <h3>No movies</h3>
    
        return (
            <div className='row'>
                <div className='col-3'>
                    <ListGroup items={this.state.genres}
                        onItemSelect={this.handleGenreSelect}
                        selectedItem={this.state.selectedGenre}
                    />
                </div>
                <div className='col'>
                    <h3>
                    Movies {filteredMovies.length}
                    </h3>

                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Genre</th>
                            <th>Stock</th>
                            <th>Rate</th>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>

                        <tbody >
                        {movies.map(movie => (
                            <tr  key={movie._id}>
                                <td>{ movie.title }</td>
                                <td>{ movie.genre.name }</td>
                                <td>{ movie.numberInStock }</td>
                                <td>{ movie.dailyRentalRate }</td>
                                <td>
                                    <Like toggleLike={() => this.handleLike(movie)}
                                        liked={movie.liked}                                
                                    />
                                </td>
                                <td>
                                    <button onClick={(movie) => this.handleDelete(movie)}
                                        style={{cursor: 'pointer'}}
                                        className='btn btn-danger btn-small'>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    
                        </tbody>
                    </table>

                    <Pagination 
                        itemsCount={filteredMovies.length}
                        pageSize={pageSize}
                        onPageChange={this.handlePageChange}
                        currentPage={currentPage}
                    />
                </div>          
            </div>
        );
    }

    handleGenreSelect = (genre) => {
        this.setState({selectedGenre: genre, currentPage: 1});
    }

    handlePageChange = (page) => {
        this.setState({currentPage: page});
    }

    handleLike = (movie) => {
        // make shallow copy
        const movies = [...this.state.movies];
        const index = movies.indexOf(movie);
        // clone the object at index 
        movies[index] = {...movies[index]};
        // toggle the prop liked
        movies[index].liked = !movies[index].liked;
        this.setState({movies})
     }

    handleDelete = (movie) => {
        const movies = this.state.movies.filter(m => m._id !== movie._id);
        this.setState({movies});
    }
}

export default Movies;  
