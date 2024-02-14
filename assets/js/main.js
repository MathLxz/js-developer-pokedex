const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const modalWrapper = document.querySelector('.modal-wrapper')
const modalContent = document.querySelector('.modal-content')
const btnClose = document.querySelector('.btn-close')

const maxRecords = 151
const limit = 10
let offset = 0;

function openModal(pokemon) {
    modalWrapper.style.display = 'block'

    modalContent.innerHTML = `
        <section class="pokemon-detail">
            <span class="name">${pokemon.name}</span>
            <span class="number">#${pokemon.id}</span>
            <div class="detail ${pokemon.types[0].type.name}">
                <ol class="types">
                    ${pokemon.types.map((pokemon) => `<li class="type ${pokemon.type.name}">${pokemon.type.name}</li>`).join('')}
                </ol>
                <img src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}"> <!-- Possível erro aqui -->
            </div>
            <p class="base-stats">Base Stats</p>
            <ol class="stats">
                ${pokemon.stats.map((pokemon) => `
                <li class="type"> ${pokemon.stat.name}:
                <span class="value">${pokemon.base_stat}</span>
            </li>`
    ).join('')}  
            </ol>
    </section>
    `
}

btnClose.addEventListener('click', () => {
    modalWrapper.style.display = 'none'
})


function convertPokemonToLi(pokemon) {
    return `
        <li data-idPokemon="${pokemon.number}" class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

pokemonList.addEventListener('click', (event) => {
    const clickedPokemonElement = event.target.closest('.pokemon')
    const idPokemon = clickedPokemonElement.dataset.idpokemon
    pokeApi.getPokemonById(idPokemon).then((pokemonStats = []) => {
        openModal(pokemonStats)
    })
})