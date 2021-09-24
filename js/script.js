const elList = selectElem('.films__card-wrapper');
const elForm = selectElem('.form');
const elInputSearch = selectElem('.films__input-search', elForm);
const elSelect = selectElem('.films__select', elForm);
const elFilter = selectElem('.films__filter', elForm);
const elTemplate = selectElem('#template').content;

// rendering films

function renderMovies(filmsArr, element){
    element.innerHTML = null;

    filmsArr.forEach((film) =>{
        const cloneTemplate = elTemplate.cloneNode(true);

        selectElem('.films__img', cloneTemplate).src = film.poster;
        selectElem('.films__card-title', cloneTemplate).textContent = film.title;
        selectElem('.films__release-date', cloneTemplate).textContent = normalizeDate(film.release_date);
        selectElem('.films__release-date', cloneTemplate).datetime = normalizeDate(film.release_date);
        
        element.appendChild(cloneTemplate);
    })
}

renderMovies(films, elList);

// rendering genres

function renderGenres(filmArr, element){
    let result = [];

    filmArr.forEach((film) =>{
        film.genres.forEach((genre) =>{
            if(!result.includes(genre)){
                result.push(genre)
            }
        })
    })
    result.forEach((genre) =>{
        let newOption = createDOM('option');
        newOption.textContent = genre;
        newOption.value = genre;

        element.appendChild(newOption);
    })
}

renderGenres(films, elSelect);

elForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    const inputValue = elInputSearch.value.trim();
    const selectValue = elSelect.value.trim();
    const filterValue = elFilter.value.trim();

    const regex = new RegExp(inputValue, 'gi');
    
    const filteredFilms = films.filter((film) => film.title.match(regex));

    let foundFilms = [];

    if(selectValue === 'All'){
        foundFilms = filteredFilms
    }else{
        foundFilms = filteredFilms.filter((film) => film.genres.includes(selectValue));
    }
    
    // filtering: a_z, z_a;

   if(filterValue === 'a_z'){
        foundFilms.sort((a, b) =>{
            if(a.title > b.title){
                return 1
            }else if(a.title < b.title){
                return -1
            }else{
                return 0
            }
        })
    }else if(filterValue === 'z_a'){
        foundFilms.sort((a, b) =>{
            if(a.title > b.title){
                return -1
            }else if(a.title < b.title){
                return 1
            }else{
                return 0
            }
        })
    }else if(filterValue === 'old_new'){
        foundFilms.sort((a, b) =>{
            if(a.release_date > b.release_date){
                return 1
            }else if(a.release_date < b.release_date){
                return -1
            }else{
                return 0
            }
        })
    }else if(filterValue === 'new_old'){
        foundFilms.sort((a, b) =>{
            if(a.release_date > b.release_date){
                return -1
            }else if(a.release_date < b.release_date){
                return 1
            }else{
                return 0
            }
        })
    }

    elInputSearch.value = null;

    renderMovies(foundFilms, elList);
});