import React from "react";
import { useState, useEffect, useCallback } from "react";
import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [load, setLoad] = useState(false);

  const fetchHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // const response = await fetch("https://swapi.dev/api/films/");
      const response = await fetch(
        "https://movie-e641d-default-rtdb.firebaseio.com/movies.json"
      );
      // if (response.status === 404) {
      //   throw new Error("Something went wrong!.");
      // }
      if (!response.ok) {
        throw new Error("Something went wrong!.");
      }
      const data = await response.json();
      console.log(data);
      const loadedData = [];

      for (const key in data) {
        loadedData.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      // const transformData = data.results.map((movieData) => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseDate: movieData.release_date,
      //   };
      // });
      setMovies(loadedData);
    } catch (error) {
      setError(error.message);
    }

    // fetch("https://swapi.dev/api/films/")
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((data) => {
    //     const transformData = data.results.map((movieData) => {
    //       return {
    //         id: movieData.episode_id,
    //         title: movieData.title,
    //         openingText: movieData.opening_crawl,
    //         releaseDate: movieData.release_date,
    //       };
    //     });
    //     setMovies(transformData);
    //   });

    setIsLoading(false);
  }, []);

  const addMovieHandler = useCallback(async (movie) => {
    const response = await fetch(
      "https://movie-e641d-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-type": "application/json",
          "my-header": "my-first-app",
        },
      }
    );
    const data = await response.json();
    console.log(data);
    setLoad(true);
  }, []);

  useEffect(() => {
    fetchHandler();
  }, [fetchHandler, load]);

  // const dummyMovies = [
  //   {
  //     id: 1,
  //     title: "Some Dummy Movie",
  //     openingText: "This is the opening text of the movie",
  //     releaseDate: "2021-05-18",
  //   },
  //   {
  //     id: 2,
  //     title: "Some Dummy Movie 2",
  //     openingText: "This is the second opening text of the movie",
  //     releaseDate: "2021-05-19",
  //   },
  // ];
  let content = <h3>No movies found!.</h3>;
  if (error) {
    content = <h3>{error}</h3>;
  }
  if (isLoading) {
    content = <h3>Loading...</h3>;
  }
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  return (
    <React.Fragment>
      <section>
        {!load && <AddMovie onAddMovie={addMovieHandler} />}
        {load && <AddMovie onAddMovie={addMovieHandler} />}
        {/* <AddMovie onAddMovie={addMovieHandler} /> */}
      </section>
      <section>
        <button onClick={fetchHandler}>Fetch Movies</button>
      </section>
      <section>
        {/* {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {isLoading && <h3>Loading....</h3>}
        {!isLoading && movies.length === 0 && !error && (
          <h3>No movies found!..</h3>
        )}
        {!isLoading && error && <h3>{error}</h3>} */}
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
