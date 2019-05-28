import {getTime, checkResultsCount, delay} from './_helpers/helpers.js';
import {api_url} from '../config/config.json'

window.addEventListener('DOMContentLoaded', () => {
    const $searchInput = document.querySelector('input[name="search-input"]');
    $searchInput.addEventListener('keyup', delay(() => {
        if($searchInput.value !== ''){
            getBeer($searchInput.value);
        }
    }, 300));

    const $deleteAll = document.querySelector('#delete-all');
    $deleteAll.addEventListener('click', deleteAll);
    
});

window.addEventListener('click', (e) => {
    if((e.target.getAttribute('class') === 'a_beer') && (e.target.getAttribute('data-saved') === 'false')) {
        e.target.setAttribute('data-saved', 'true')
        saveABeer(e.target)
        
        if(checkResultsCount() === 0){
            document.querySelector('.results-wrap').style.display = 'none';
        }
    }
})

const getBeer = (query) => {
    const url = `${api_url}/beers?beer_name=${query}&per_page=10`;

    fetch(url)
    .then(res => res.json())
    .then(beers => populateResults(beers))
    .catch(err => {
        console.log(err);
        const $results = document.querySelector('.results');
        $results.innerHTML = 'No results :('
    })
}

const populateResults = (beers) => {
    const $results = document.querySelector('.results');
    const $resultsWrap = document.querySelector('.results-wrap');
    $results.innerHTML = '';

    if (beers.length == 0){
        $results.innerHTML = 'No results :('
    } else if(beers !== ''){
        for(let beer of beers){
            let $newli = document.createElement('li');
            $newli.setAttribute('class', 'a_beer')
            $newli.setAttribute('data-saved', false)
            let innerText = document.createTextNode(beer.name);
            $newli.appendChild(innerText);
            $results.appendChild($newli);
            $resultsWrap.style.display = 'initial';
        }
    } else {
        $resultsWrap.style.display = 'none';
        $results.innerHTML = '';
    
    }
}

const saveABeer = ($savedBeer) => {
    const $savedBeersMain = document.querySelector('.saved-beers-main');
    const $savedBeerWrap = document.createElement('div');
    $savedBeerWrap.setAttribute('class', 'saved-beer-wrap')

    const $hr = document.createElement('hr')
    const time = getTime();
    const $time = document.createElement('time')
    $time.innerHTML= time;
    const $delete = document.createElement('span');
    $delete.setAttribute('data', 'delete-a-beer')
    $delete.innerHTML = '&#10005;'

    $savedBeerWrap.appendChild($savedBeer);
    $savedBeerWrap.appendChild($time);
    $savedBeerWrap.appendChild($delete);
    $savedBeerWrap.appendChild($hr);
    $savedBeersMain.appendChild($savedBeerWrap);

    $delete.addEventListener('click', deleteABeer);
}

const deleteABeer = (e) => {
    e.currentTarget.parentNode.remove()
}

const deleteAll = () => {
    if(document.querySelector('.saved-beers-main').children[0] === undefined){
        alert('Nothing to delete :)')
    } else {
        const confirmed = confirm('Are you sure you want to delete your saved beers?');

        if(confirmed) {
            document.querySelector('.saved-beers-main').innerHTML = '';
        }
    }
} 

