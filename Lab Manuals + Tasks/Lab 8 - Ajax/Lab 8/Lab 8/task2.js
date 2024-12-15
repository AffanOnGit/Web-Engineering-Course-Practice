document.getElementById('searchButton').addEventListener('click', fetchPokemon);


async function fetchPokemon() {
    const pokemonName = document.getElementById('pokemonInput').value.trim().toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;


    document.getElementById('loading').style.display = 'block';
    document.getElementById('pokemonCard').style.display = 'none';
    document.getElementById('error').style.display = 'none';


    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Pokémon not found');
        }
        const pokemonData = await response.json();


        document.getElementById('pokemonName').innerText = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
        document.getElementById('pokemonImage').src = pokemonData.sprites.front_default;
        document.getElementById('pokemonType').innerHTML = pokemonData.types
            .map(typeInfo => `<span class="pokemon-type">${typeInfo.type.name}</span>`)
            .join(' ');


        document.getElementById('pokemonHeight').innerText = `${pokemonData.height / 10} m`;
        document.getElementById('pokemonWeight').innerText = `${pokemonData.weight / 10} kg`;


       
        document.querySelector('.hp').style.width = `${pokemonData.stats[0].base_stat}%`;
        document.querySelector('.attack').style.width = `${pokemonData.stats[1].base_stat}%`;
        document.querySelector('.defense').style.width = `${pokemonData.stats[2].base_stat}%`;


        document.getElementById('loading').style.display = 'none';
        document.getElementById('pokemonCard').style.display = 'block';
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').innerText = error.message;
        document.getElementById('error').style.display = 'block';
    }
}
