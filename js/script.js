const elList = selectElem('.films__card-wrapper');
const elForm = selectElem('.form');
const elInputSearch = selectElem('.films__input-search', elForm);
const elSelect = selectElem('.films__select', elForm);
const elFilter = selectElem('.films__filter', elForm);
const elTemplate = selectElem('#template').content;
const elSidebarList = selectElem('.sidebar__card-wrapper');
const elSidebar = selectElem('.sidebar');
const elHeaderBtn = selectElem('.header__bookmark');
const closeSidebar = selectElem('.closeSidebar');
const elCounter = selectElem('.counter');
const elModal = selectElem('.modal');
const closeModal = selectElem('.closeModal');
const elModalTitle = selectElem('.modal__title');
const elModalOverview = selectElem('.modal__overview');
const elModalDate = selectElem('.modal__date');
const elModalGenre = selectElem('.modal__genre');

// sidebar

elHeaderBtn.addEventListener('click', () =>{
    elSidebar.classList.add('active')
})
closeSidebar.addEventListener('click', () =>{
    elSidebar.classList.remove('active')
})

// rendering films

let result = [];

function renderMovies(filmsArr, element){
    element.innerHTML = null;
    
    filmsArr.forEach((film) =>{
        const cloneTemplate = elTemplate.cloneNode(true);
        
        selectElem('.films__img', cloneTemplate).src = film.poster;
        selectElem('.films__card-title', cloneTemplate).textContent = film.title;
        selectElem('.films__release-date', cloneTemplate).textContent = normalizeDate(film.release_date);
        selectElem('.films__release-date', cloneTemplate).datetime = normalizeDate(film.release_date);

        const MoreBtn = selectElem('.films__btn', cloneTemplate);
        MoreBtn.dataset.id = film.id;

        MoreBtn.addEventListener('click', (e) =>{
            elModal.classList.add('modal-active');
            const filmId = e.target.dataset.id;
            let result = filmsArr.find(film => film.id === filmId);

            elModalTitle.textContent = result.title;
            elModalOverview.textContent = result.overview;
            elModalDate.textContent = normalizeDate(result.release_date);
            
            elModalGenre.innerHTML = null;
            result.genres.forEach(genre => {
                const newLi = createDOM('li');
                newLi.textContent = genre;

                elModalGenre.appendChild(newLi);
            });
        });

        closeModal.addEventListener('click', () =>{
            elModal.classList.remove('modal-active');
        });
        
        const bookmarkBtn = selectElem('.bookmark', cloneTemplate);
        bookmarkBtn.dataset.id = film.id;
        
        bookmarkBtn.addEventListener('click', (e) =>{
            let itemId = e.target.dataset.id;
            
            let foundFilm = films.find((film) => film.id == itemId);
            let findIndex = films.findIndex((film) => film.id == itemId);
            
            if(e.target){
                if(!result.includes(foundFilm)){
                    result.push(foundFilm)
                }
            }else{
                result.splice(findIndex, 1)
            }
            
            function renderModalFilms(arr, element){
                element.innerHTML = null;
                
                elCounter.textContent = result.length;
                
                arr.forEach((film) =>{
                    const cloneTemplate = elTemplate.cloneNode(true);
                    
                    selectElem('.films__img', cloneTemplate).src = film.poster;
                    selectElem('.films__card-title', cloneTemplate).textContent = film.title;
                    selectElem('.films__release-date', cloneTemplate).textContent = normalizeDate(film.release_date);
                    selectElem('.films__release-date', cloneTemplate).datetime = normalizeDate(film.release_date);
                    
                    const bookmarkBtn = selectElem('.bookmark', cloneTemplate);
                    bookmarkBtn.dataset.id = film.id;

                    bookmarkBtn.addEventListener('click', (e) =>{
                        const dataId = e.target.dataset.id
                    
                        const findIndex = result.findIndex(film => film.id == dataId)
                        
                        result.splice(findIndex, 1)
                        
                        renderModalFilms(result, elSidebarList)
                    })
                    
                    element.appendChild(cloneTemplate)
                })
            }
            renderModalFilms(result, elSidebarList)
        })
        
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