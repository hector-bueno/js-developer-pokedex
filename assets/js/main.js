const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
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

// Card
const pokemonCard = document.getElementById('pokemonCard');
const closeCard = document.getElementById('closeCard');

pokemonList.addEventListener('click', (e) => {
    const item = e.target.closest('.pokemon');
    if (!item) return;

    if (item.classList.contains('active')) {
        item.classList.remove('active');
        pokemonCard.classList.add('hidden');
    } else {
        const ativo = pokemonList.querySelector('.pokemon.active');
        ativo?.classList.remove('active');
        item.classList.add('active');

        const name = item.querySelector('.name').innerText;
        const number = item.querySelector('.number').innerText;
        const type = item.querySelector('.types .type').innerText;
        const img = item.querySelector('img').src;

        const id = number.replace('#','');
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('cardName').innerText = name;
            document.getElementById('cardNumber').innerText = number;
            document.getElementById('cardType').innerText = type;
            document.getElementById('cardImg').src = img;
            document.getElementById('cardHeight').innerText = data.height / 10 + ' m';
            document.getElementById('cardWeight').innerText = data.weight / 10 + ' kg';
            pokemonCard.classList.remove('hidden');
        });
    }
});

closeCard.addEventListener('click', () => {
    pokemonCard.classList.add('hidden');
    const ativo = pokemonList.querySelector('.pokemon.active');
    ativo?.classList.remove('active');
});
