//Data itt elérhető
function done(data) {
    const MOV = JSON.parse(data.responseText); //ha constal használom nem fogom tudni változtatni!
    sortByTitles(MOV);
    setCatNames(MOV);
    createView(MOV);
    let SB = document.querySelector('#searchButtonByTitle')
    SB.addEventListener('click', function () {
        searchByTitle(MOV); //ez CSAK LET EL működik, var al 48 at kapna mindig (binding)!!!

    })
    let SB2 = document.querySelector('#searchButtonByDirector')
    SB2.addEventListener('click', function () {
        searchByDirector(MOV); //ez CSAK LET EL működik, var al 48 at kapna mindig (binding)!!!
    })
    let SB3 = document.querySelector('#searchButtonByStar')
    SB3.addEventListener('click', function () {
        searchByStar(MOV); //ez CSAK LET EL működik, var al 48 at kapna mindig (binding)!!!
    })


    moviesLength(MOV);
}

//Ajax 
function xhr(method, url, done) {
    let xmlHTTP = new XMLHttpRequest();
    xmlHTTP.onreadystatechange = function () {
        if (xmlHTTP.readyState == 4 && xmlHTTP.status == 200) {
            done(xmlHTTP);
        }
    }
    xmlHTTP.open(method, url);
    xmlHTTP.send();
}
//Ajax Meghívása
xhr('GET', '/json/movies.json', done);

//Rendezés
function sortByTitles(data) {
    data.movies.sort(function (a, b) {
        if (a.title < b.title) {
            return -1;
        }
        if (a.title > b.title) {
            return 1;
        } else {
            return 0;
        }
    });
    return data;
}

//Kategória nevek átalakítása
function setCatNames(data) {
    for (let i = 0; i < data.movies.length; i++) {
        for (let j = 0; j < data.movies[i].categories.length; j++) {
            data.movies[i].categories[j] = data.movies[i].categories[j].toLowerCase();
            data.movies[i].categories[j] = data.movies[i].categories[j].charAt(0).toUpperCase() + data.movies[i].categories[j].slice(1);
        }
    }
}

function nameToImgName(str) {
    const HUN_CHARS = {
        á: 'a',
        é: 'e',
        í: 'i',
        ó: 'o',
        ú: 'u',
        ö: 'o',
        ő: 'o',
        ü: 'u',
        ű: 'u'
    }

    str = str.toLowerCase()
        .replace(/[áéíóúöőüű]/g, c => HUN_CHARS[c])
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/[ -]+/g, '-');
    return str;
}

function runTroughElements(array) {
    let elementString = '';
    for (let i = 0; i < array.length; i++) {
        elementString += array[i] + ', '
    }
    return elementString.slice(0, -2);
}

// megjelenítés
function createView(data) {
    let bigDiv = document.querySelector('.bigDiv')
    bigDiv.innerHTML = '';

    for (let i = 0; i < data.movies.length; i++) {
        let div = document.createElement('div');
        div.className = 'movie';
        let img = document.createElement("img");
        img.src = '/img/covers/' + nameToImgName(data.movies[i].title) + '.jpg';
        img.alt = data.movies[i].title;
        img.addEventListener('click', function () {
            showStars(data, i);
        })
        let ul = document.createElement('ul');
        let litimeInMinutes = document.createElement('li');
        let lipremierYear = document.createElement('li');
        let licategories = document.createElement('li');
        let lidirectors = document.createElement('li');
        let titleF = document.createElement('h4');
        litimeInMinutes.textContent = 'Hossz: ' + data.movies[i].timeInMinutes + 'perc';
        lipremierYear.textContent = 'Premier: ' + data.movies[i].premierYear;
        licategories.textContent = 'Kategória: ' + runTroughElements(data.movies[i].categories);
        lidirectors.textContent = 'Rendező: ' + runTroughElements(data.movies[i].directors);
        titleF.textContent = 'Cím: ' + data.movies[i].title;
        ul.appendChild(litimeInMinutes)
        ul.appendChild(lipremierYear)
        ul.appendChild(licategories)
        ul.appendChild(lidirectors)
        div.appendChild(titleF)
        div.appendChild(img)
        div.appendChild(ul);

        bigDiv.appendChild(div);

    }
}

//SearchFuncs
function searchByTitle(data) {
    let searchBar = document.querySelector('#searchBar');
    let pickedOut = {
        movies: []
    };
    for (let i = 0; i < data.movies.length; i++) {
        if (searchBar.value.toLowerCase() == data.movies[i].title.toLowerCase()) {
            pickedOut.movies.push(data.movies[i]);
        }
    }
    createView(pickedOut)
}

//rendező alapján
function searchByDirector(data) {
    let searchBar = document.querySelector('#searchBar');
    let pickedOut = {
        movies: []
    };
    for (let i = 0; i < data.movies.length; i++) {
        for (let j = 0; j < data.movies[i].directors.length; j++) {
            if (searchBar.value.toLowerCase() == data.movies[i].directors[j].toLowerCase()) {
                pickedOut.movies.push(data.movies[i]);
            }
        }
    }
    createView(pickedOut)
}
//Star alapján
function searchByStar(data) {
    let searchBar = document.querySelector('#searchBar');
    let pickedOut = {
        movies: []
    };
    for (let i = 0; i < data.movies.length; i++) {
        for (let j = 0; j < data.movies[i].cast.length; j++) {
            if (searchBar.value.toLowerCase() == data.movies[i].cast[j].name.toLowerCase()) {
                pickedOut.movies.push(data.movies[i]);
            }
        }
    }
    createView(pickedOut)
}

//stats
function moviesLength(data) {
    let total = 0;
    for (let i = 0; i < data.movies.length; i++) {
        total += parseInt(data.movies[i].timeInMinutes);

    }

    document.querySelector('#totalLength').textContent = `Összes film hossza: ${total.toFixed(2)} perc`
    document.querySelector('#avgLength').textContent = `Átlagos hossz: ${(total / data.movies.length).toFixed(2)} perc`

}

//strarok megjelenítése
function showStars(data, i) {
    let castDiv = document.querySelector('.castDiv')
    castDiv.innerHTML =
        `<h3 class="info-title">${data.movies[i].title}</h3>`
    for (let j = 0; j < data.movies[i].cast.length; j++) {
        let div = document.createElement('div');
        let divData = document.createElement('div');
        div.className = 'actor';
        divData.className = 'actorData';
        let img = document.createElement("img");
        img.src = '/img/actors/' + nameToImgName(data.movies[i].cast[j].name) + '.jpg';
        img.alt = data.movies[i].cast[j].name;
        let ul = document.createElement('ul');
        let liName = document.createElement('li');
        liName.textContent = 'Név: ' + data.movies[i].cast[j].name;
        let liChar = document.createElement('li');
        liChar.textContent = 'Karakter: ' + data.movies[i].cast[j].characterName;
        let liBirthCountry = document.createElement('li');
        liBirthCountry.textContent = 'Ország: ' + data.movies[i].cast[j].birthCountry;
        let liBirthCity = document.createElement('li');
        liBirthCity.textContent = 'Város: ' + data.movies[i].cast[j].birthCity;
        let liBirthYear = document.createElement('li');
        liBirthYear.textContent = 'Szül. dátum: ' + data.movies[i].cast[j].birthYear;
        ul.appendChild(liName)
        ul.appendChild(liChar)
        ul.appendChild(liBirthCountry)
        ul.appendChild(liBirthCity)
        ul.appendChild(liBirthYear)

        div.appendChild(img);
        divData.appendChild(ul);
        castDiv.appendChild(div);
        castDiv.appendChild(divData);
    }





}