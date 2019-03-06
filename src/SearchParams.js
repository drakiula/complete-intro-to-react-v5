import React, { useState, useEffect } from "react";
import pf, { ANIMALS } from "petfinder-client";
import { connect } from "react-redux";
import useDropdown from "./useDropdown";
import Results from "./Results";
import changeLocation from "./actionCreator/changeLocation";
import changeTheme from "./actionCreator/changeTheme";

const petfinder = pf({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET
});

const SearchParams = ({ theme, location, setTheme, updateLocation }) => {
  const [breeds, updateBreeds] = useState([]);
  const [pets, setPets] = useState([]);
  const [animal, AnimalDropdown] = useDropdown("Animal", "dog", ANIMALS);
  const [breed, BreedDropdown, updateBreed] = useDropdown("Breed", "", breeds);

  async function requestPets() {
    const res = await petfinder.pet.find({
      location,
      breed,
      animal,
      output: "full"
    });

    setPets(
      Array.isArray(res.petfinder.pets.pet)
        ? res.petfinder.pets.pet
        : [res.petfinder.pets.pet]
    );
  }

  useEffect(() => {
    updateBreeds([]);
    updateBreed("");

    petfinder.breed.list({ animal }).then(data => {
      updateBreeds(
        Array.isArray(data.petfinder.breeds.breed)
          ? data.petfinder.breeds.breed
          : [data.petfinder.breeds.breed]
      );
    }, console.error);
  }, [animal]);

  return (
    <div className="search-params">
      <form
        onSubmit={e => {
          e.preventDefault();
          requestPets();
        }}
      >
        <label htmlFor="location">
          Location
          <input
            id="location"
            value={location}
            placeholder="Location"
            onChange={e => updateLocation(e.target.value)}
          />
        </label>
        <AnimalDropdown />
        <BreedDropdown />
        <label htmlFor="location">
          Theme
          <select
            value={theme}
            onChange={e => setTheme(e.target.value)}
            onBlur={e => setTheme(e.target.value)}
          >
            <option value="peru">Peru</option>
            <option value="darkblue">Dark Blue</option>
            <option value="chartreuse">Chartreuse</option>
            <option value="mediumorchid">Medium Orchid</option>
          </select>
        </label>
        <button style={{ backgroundColor: theme }}>Submit</button>
      </form>
      <Results pets={pets} />
    </div>
  );
};

const mapStateToProps = ({ theme, location }) => ({
  theme,
  location
});

const mapDispatchToProps = dispatch => ({
  setLocation(location) {
    dispatch(changeLocation(location));
  },
  setTheme(theme) {
    dispatch(changeTheme(theme));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchParams);
