import playList from './playList.js';

//Переменные
let state = {
    language: 'en',
    photoSource: 'github',
    blocks: ['time', 'date','greeting', 'quote', 'audio', 'weather'],
    tags: ''
};

const language = {
    en: {
        dateLocale: 'en-US',
        greetings: ['Good night', 'Good morning', 'Good afternoon', 'Good evening'],
        nameholder: '[Enter name]',
        weather: {
            city: 'Minsk',
            options: ['Wind speed:', 'm/s', 'Humidity:', 'Oops!']
        },
        imgsource: ['Image source:', 'Enter a tag'],
        hideElement: 'Hide/Show elements:',
        elements: ['Time', 'Date', 'Greeting', 'Quote', 'Player', 'Weather'],
        lang: ['Choose language:', 'English', 'Russian'],
        todoplaceholder: 'Add case'
    },
    ru: {
        dateLocale: 'ru-RU',
        greetings: ['Доброй ночи', 'Доброе утро', 'Добрый день', 'Добрый вечер'],
        nameholder: '[Введите имя]',
        weather: {
            city: 'Минск',
            options: ['Скорость ветра:', 'м/с', 'Влажность:', 'Ошибка!']
        },
        imgsource: ['Источник изображения:', 'Введие тэг'],
        hideElement: 'Скрыть/Показать элементы:',
        elements: ['Время', 'Дата', 'Приветствие', 'Цитата', 'Плеер', 'Погода'],
        lang: ['Выберите язык:', 'Английский', 'Русский'],
        todoplaceholder: 'Добавьте дело'
    }
};

const body = document.querySelector('body');
const time = document.querySelector('.time');
const date = document.querySelector('.date');

const greeting = document.querySelector('.greeting');
const contGreeting = document.querySelector('.greeting-container')
const userName = document.querySelector('.name');

const slidePrev = document.querySelector('.slide-prev');
const slideNext = document.querySelector('.slide-next');
const options = {weekday: "long", month: 'long', day: 'numeric'};

const weather = document.querySelector('.weather');
const error = document.querySelector('.weather-error');
const city = document.querySelector('.city');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');

const contQuote = document.querySelector('.quote-container');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const newquote = document.querySelector('.change-quote');

const player = document.querySelector('.player')
const btnPlay = document.querySelector('.play');
const btnPrev = document.querySelector('.play-prev');
const btnNext = document.querySelector('.play-next');
const playListContainer = document.querySelector('.play-list');
const trackName = document.querySelector('.track-name');
const trackCurrentTime = document.querySelector('.current');
const trackLength = document.querySelector('.length');
const timeline = document.querySelector('.timeline');
const progress = document.querySelector('.progress');
const volume = document.querySelector('.volume-level');
const mute = document.querySelector('.mute-btn');
const audio = new Audio();
let isPlay = false;

const settingTitle = document.querySelectorAll('.setting-title');
const btnSetting = document.querySelector('.setting-btn');
const contSetting = document.querySelector('.setting-container');
const imageSource = document.querySelectorAll('.radio-btns input');
const imageTag = document.querySelector('.background-tag');
const blocks = document.querySelectorAll('.check-boxes input');
const blocksSpan = document.querySelectorAll('.check-boxes span');
const btnLang = document.querySelectorAll('.lang-btn');

const btnTodolist = document.querySelector('.todo-btn')
const contTodolist = document.querySelector('.todolist-container');
const itemsTodolist = document.querySelector('.todolist-items');
const inputTodolist = document.querySelector('.todolist-input');
let todolist = [];

const timesofDay = ['night', 'morning', 'afternoon', 'evening'];
let timeOfDay = timesofDay[Math.floor(new Date().getHours() / 6)];
let rndNum = getRndNum(1, 20);
let playNum = 0;
const elements = [time, date, contGreeting, contQuote, player, weather];
let tags = timeOfDay;
let rndQuote = getRndNum(0, 100);

//Применение локали
function setLanguage() {
    showDate();
    if (city.value === 'Minsk' || city.value === 'Минск') {city.value = language[state.language].weather.city};
    getWeather();
    userName.placeholder = language[state.language].nameholder;
    settingTitle[0].textContent = language[state.language].imgsource[0];
    imageTag.placeholder = language[state.language].imgsource[1];
    settingTitle[1].textContent = language[state.language].hideElement;
    blocksSpan.forEach((el, i) => el.textContent = language[state.language].elements[i]);
    settingTitle[2].textContent = language[state.language].lang[0];
    btnLang.forEach((el, i) => {
        el.textContent = language[state.language].lang[i + 1]
        if (el.id === state.language) el.classList.add('btn-active');
    });
    inputTodolist.placeholder = language[state.language].todoplaceholder;
    getQuotes();
};

//Загрузка параметров
function onLoad() {
    getLocalStorage();
    state.blocks.forEach((el, i) => checkElements(el, i));
    imageSource.forEach(el => {
        if (el.value === state.photoSource) {
            el.checked = true;
            selectSource(el);
        };
    });
    setLanguage();
};

//Дата и время
function showDate() {
    let currentDate = new Date();
    time.textContent = currentDate.toLocaleTimeString('en-US', { hour12: false });
    date.textContent = currentDate.toLocaleDateString(language[state.language].dateLocale, options).replace(/\S/, a => a.toUpperCase());
    showGreeting();
    setTimeout(showDate, 1000);
};

//Приветствие
function getTimeOfDay() {
    let hour = new Date().getHours();
    return language[state.language].greetings[Math.floor(hour / 6)];
};

function showGreeting() {
    const timeOfDay = getTimeOfDay();
    greeting.textContent = timeOfDay;
};

//Запись и  чтение настроек
function setLocalStorage() {
    localStorage.setItem('name', userName.value);
    if (city.value !== 'Minsk' && city.value !== 'Минск') {localStorage.setItem('city', city.value)};
    localStorage.setItem('setting', JSON.stringify(state));
    const itemTodolist = document.querySelectorAll('.todolist-item');
    todolist = [];
    itemTodolist.forEach(el => todolist.push([el.textContent, el.className]))
    localStorage.setItem('dotolist', JSON.stringify(todolist));
};

function getLocalStorage() {
    if (localStorage.getItem('name')) {
        userName.value = localStorage.getItem('name');
    };
    if (localStorage.getItem('setting')) {
        state = JSON.parse(localStorage.getItem('setting'));
    };
    imageTag.value = state.tags;
    tags = !state.tags ? timeOfDay : state.tags;
    city.value = localStorage.getItem('city') ? localStorage.getItem('city') : language[state.language].weather.city;
    if (localStorage.getItem('dotolist')) {
        todolist = JSON.parse(localStorage.getItem('dotolist'));
        loadTodoList(todolist);
    };
};

//Слайдер
function getRndNum(min, max) {
    return parseInt(Math.random() * (max - min + 1) + min)
};

function setBg() {
    if (state.photoSource === 'github') {
        getLinkGithub()
    } else if (state.photoSource === 'unsplash') {
        getLinkUnsplash()
    } else {
        getLinkFlick()
    };
};

function getSlideNext() {
    ++rndNum <= 20 ? rndNum : rndNum = 1;
    setBg();
};

function getSlidePrev() {
    --rndNum >= 1 ? rndNum : rndNum = 20;
    setBg();
};

function getLinkGithub() {
    let bgNum = String(rndNum).padStart(2, '0');
    const image = new Image();
    image.src = `./assets/img/${timeOfDay}/${bgNum}.jpg`;
    image.onload = () => {
        body.style.backgroundImage = `url('./assets/img/${timeOfDay}/${bgNum}.jpg')`;
    };
};

async function getLinkUnsplash() {
    const image = new Image();
    const url = `https://api.unsplash.com/photos/random?query=${tags}&client_id=UBlrvUH8OlWrPt2yL89t5rDDtI5fulvrZ22O8nNnhP4`;
    const res = await fetch(url);
    const data = await res.json();
    image.addEventListener('load', changeBackground);
    image.src = data.urls.regular
    function changeBackground() {
        body.style.backgroundImage = `url(${image.src})`;
    };
};

async function getLinkFlick() {
    const image = new Image();
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=d3fc049ef3b8d6a444e74ed390b95f62&tags=${tags}&extras=url_l&format=json&nojsoncallback=1`;
    const res = await fetch(url);
    const data = await res.json();
    image.addEventListener('load', changeBackground);
    let rndPic = getRndNum(0, data.photos.photo.length)
    image.src = data.photos.photo[rndPic].url_l;
    function changeBackground() {
        body.style.backgroundImage = `url(${image.src})`;
    };
};

//Погода
function resetWeather() {
    weatherIcon.className = 'weather-icon owf';
    temperature.textContent = '';
    weatherDescription.textContent = '';
    wind.textContent = '';
    humidity.textContent = '';
    error.textContent = '';
};

async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${state.language}&appid=beb726a62bf9b6e10c71bbe24859800a&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    resetWeather();
    if (data.name) {
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.floor(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        wind.textContent = `${language[state.language].weather.options[0]} ${Math.floor(data.wind.speed)} ${language[state.language].weather.options[1]}`;
        humidity.textContent = `${language[state.language].weather.options[2]} ${data.main.humidity}%`;
    } else error.textContent = `${language[state.language].weather.options[3]} ${data.message}`;
};

//Цитаты
async function getQuotes() {
    const quotes = 'data/quotes.json';
    const res = await fetch(quotes);
    const data = await res.json();
    quote.textContent = `"${data[rndQuote][state.language].text}"`;
    author.textContent = data[rndQuote][state.language].author;
};

//Аудиоплеер
playList.forEach(el => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = el.title;
    playListContainer.append(li);
});

const playItem = document.querySelectorAll('.play-item');

function playAudio() {
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    trackName.textContent = playList[playNum].title;
    trackLength.textContent = playList[playNum].duration;
    setCurrentTime()
    if (!isPlay) {
        audio.play();
        isPlay = true;
        btnPlay.classList.add('pause');
    } else {
        audio.pause();
        isPlay = false;
        btnPlay.classList.remove('pause');
    };
    playItem.forEach( el => el.classList.remove('item-active'));
    playItem[playNum].classList.add('item-active');
};

function playNext() {
    ++playNum <= playList.length - 1 ? playNum : playNum = 0;
    isPlay = false;
    playAudio();
};

function playPrev() {
    --playNum >= 0 ? playNum : playNum = playList.length - 1;
    isPlay = false;
    playAudio();
};

function setCurrentTime() {
    if (isPlay) {
    trackCurrentTime.textContent = convertTime(audio.currentTime);
    progress.style.width = `${audio.currentTime / audio.duration * 100}` + '%'
    };
    setTimeout(setCurrentTime, 500);
    return false;
};

function muteVolume() {
    if (audio.muted) {
       mute.classList.toggle('mute-active');
        audio.muted = false;
    } else {
        mute.classList.toggle('mute-active');
        audio.muted = true;
    };
};

function convertTime(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;
    if (hours === 0) return `${String(minutes).padStart(2, 0)}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${String(minutes).padStart(2, 0)}:${String(seconds % 60).padStart(2, 0)}`;
};

//Настройки
function showSetting() {
    contSetting.classList.toggle('show-setting');
};

function checkElements(el, i) {
    if (el) {
        elements[i].classList.remove('hide')
        blocks[i].checked = true;
    } else {
        elements[i].classList.add('hide');
        blocks[i].checked = false;
    };
};

function selectSource(el) {
    let source = this ? this.value : el.value;
    state.photoSource = source;
    if (source !== 'github') {
        imageTag.classList.add('show-input');
        imageTag.disabled = false;
    } else {
        imageTag.classList.remove('show-input');
        imageTag.disabled = true;
    };
    setBg();
};

function changeLang() {
    btnLang.forEach(el => el.classList.remove('btn-active'));
    this.classList.add('btn-active');
    state.language = this.id === 'en' ? 'en' : 'ru';
    setLanguage();
};

//Список дел
function showTodolist() {
    contTodolist.classList.toggle('show-todolist');
};
function addTodolist() {
    let li = document.createElement('li');
    li.className = 'todolist-item';
    li.innerHTML = `${inputTodolist.value}<span></span>`;
    itemsTodolist.append(li);
    inputTodolist.value = '';
};

function loadTodoList(todolist) {
    todolist.forEach(el => {
        let li = document.createElement('li');
        li.className = el[1];
        li.innerHTML = `${el[0]}<span></span>`;
        itemsTodolist.append(li);
    });
};

//Вызовы функций
window.addEventListener('load', onLoad);
window.addEventListener('beforeunload', setLocalStorage);

city.addEventListener('change', getWeather);

slidePrev.addEventListener('click', getSlidePrev);
slideNext.addEventListener('click', getSlideNext);

newquote.addEventListener('click', () => {
    rndQuote = getRndNum(0, 100);
    getQuotes();
});

btnPlay.addEventListener('click', playAudio);
btnNext.addEventListener('click', playNext);
audio.addEventListener('ended', playNext);
btnPrev.addEventListener('click', playPrev);
timeline.addEventListener('click', e => {
    if (isPlay) {
        const timelineWidth = window.getComputedStyle(timeline).width;
        const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
        audio.currentTime = timeToSeek;
    }}, false);
volume.addEventListener('input', () => audio.volume = volume.value);
mute.addEventListener('click', muteVolume);
playItem.forEach((el, i) => el.addEventListener('click', () => {
    if (playNum === i && isPlay === true) {
        audio.pause();
        isPlay = false;
        el.classList.remove('item-active');
    } else {
        playNum = i;
        isPlay = false;
        playAudio();
    };
}));

btnSetting.addEventListener('click', showSetting);
imageSource.forEach((el) => el.addEventListener('change', selectSource));
blocks.forEach((el, i) => el.addEventListener('change', () => {
    state.blocks[i] = el.checked ? el.id : 0
    checkElements(el.checked, i);
}));
imageTag.addEventListener('change', () => {
    state.tags = imageTag.value;
    tags = imageTag.value;
    setBg();
});
btnLang.forEach(el => el.addEventListener('click', changeLang));

btnTodolist.addEventListener('click', showTodolist);
itemsTodolist.addEventListener('click', (el) => {
    if (el.target.textContent) {
        el.target.classList.toggle('todolist-activ')
    } else el.target.parentNode.remove();
});
inputTodolist.addEventListener('change', addTodolist, false);

showDate();
getQuotes();

console.log(`Часы и календарь +15
 - время выводится в 24-часовом формате, например: 21:01:00 +5
 - время обновляется каждую секунду - часы идут. Когда меняется одна из цифр, остальные при этом не меняют своё положение на странице (время не дёргается) +5
 - выводится день недели, число, месяц, например: "Воскресенье, 16 мая" / "Sunday, May 16" / "Нядзеля, 16 траўня" +5
Язык и формат вывода даты определяется языком приложения.
 - при изменении дня недели, даты, месяца эти данные меняются в приложении (в ходе кросс-чека этот пункт не проверяется)

 Приветствие +10
 - текст приветствия меняется в зависимости от времени суток (утро, день, вечер, ночь) +5
  с 6:00 до 11:59 - Good morning / Доброе утро / Добрай раніцы
  с 12:00 до 17:59 - Good afternoon / Добрый день / Добры дзень
  с 18:00 до 23:59 - Good evening / Добрый вечер / Добры вечар
  с 00:00 до 5:59 - Good night / Доброй/Спокойной ночи / Дабранач
 - при изменении времени суток, если в это время приложение открыто, меняется текст приветствия (в ходе кросс-чека этот пункт не проверяется)
 - пользователь может ввести своё имя. При перезагрузке страницы приложения имя пользователя сохраняется, данные о нём хранятся в local storage +5

Смена фонового изображения +20
При загрузке или перезагрузке приложения фоновое изображение выбирается из расположенной на GitHub коллекции изображений.
Репозиторий с изображениями необходимо форкнуть, и использовать изображения форкнутого репозитория, а не школьного.
Сами изображения желательно оптимизировать, например, конвертировать в формат WebP с целью уменьшения веса и увеличения скорости загрузки.
Также можно использовать свою собственную коллекцию изображений.
Скачать картинки на компьютер и использовать локальные файлы нельзя.
 - ссылка на фоновое изображение формируется с учётом времени суток и случайного номера изображения (от 01 до 20) +5
  Пример ссылки на фоновое изображение: https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/evening/18.jpg, здесь
  evening - время суток, другие значения afternoon, morning, night
  18 - рандомный (случайный) номер изображения, от 01 до 20.
 - изображения можно перелистывать кликами по стрелкам, расположенным по бокам экрана.
 - изображения перелистываются последовательно - после 18 изображения идёт 19 (клик по правой стрелке), перед 18 изображением идёт 17 (клик по левой стрелке) +5
 - изображения перелистываются по кругу: после двадцатого изображения идёт первое (клик по правой стрелке), перед 1 изображением идёт 20 (клик по левой стрелке) +5
 - при смене слайдов важно обеспечить плавную смену фоновых изображений. Не должно быть состояний, когда пользователь видит частично загрузившееся изображение или страницу без фонового изображения. Плавную смену фоновых изображений не проверяем: 1) при загрузке и перезагрузке страницы 2) при открытой консоли браузера 3) при слишком частых кликах по стрелкам для смены изображения +5

Виджет погоды +15
 - город по умолчанию - Минск, пока пользователь не ввёл другой город
 - при перезагрузке страницы приложения указанный пользователем город сохраняется, данные о нём хранятся в local storage +5
 - для указанного пользователем населённого пункта выводятся данные о погоде, если их возвращает API
 - данные о погоде включают в себя: иконку погоды, описание погоды, температуру в °C, скорость ветра в м/с, относительную влажность воздуха в %. Числовые параметры погоды округляются до целых чисел +5
 - выводится уведомление об ошибке при вводе некорректных значений, для которых API не возвращает погоду (пустая строка или бессмысленный набор символов) +5

Виджет цитата дня +10
 - при загрузке страницы приложения отображается рандомная цитата и её автор +5
  В качестве источника цитаты можно использовать как API, так и созданный вами или найденный в интернете JSON-файл с цитатами и их авторами. API с цитатами не отличаются надёжностью и долговечностью, используемый в качестве источника цитат собственный JSON-файл гарантирует работоспособность вашего приложения. Запросы к JSON также осуществляются асинхронно, таким образом необходимые знания о работе с асинхронными запросами вы получите
 - при перезагрузке страницы цитата обновляется (заменяется на другую). Есть кнопка, при клике по которой цитата обновляется (заменяется на другую) +5

Аудиоплеер +15
 - при клике по кнопке Play/Pause проигрывается первый трек из блока play-list, иконка кнопки меняется на Pause +3
 - при клике по кнопке Play/Pause во время проигрывания трека, останавливается проигрывание трека, иконка кнопки меняется на Play +3
 - треки можно пролистывать кнопками Play-next и Play-prev
 - треки пролистываются по кругу - после последнего идёт первый (клик по кнопке Play-next), перед первым - последний (клик по кнопке Play-prev) +3
 - трек, который в данный момент проигрывается, в блоке Play-list выделяется стилем +3
 - после окончания проигрывания первого трека, автоматически запускается проигрывание следующего. Треки проигрываются по кругу: после последнего снова проигрывается первый. +3
  Для удобства проверки треки возьмите небольшой продолжительности. Обрезать треки можно здесь: https://mp3cut.net/ru/
 - плейлист генерируется средствами JavaScript (в ходе кросс-чека этот пункт не проверяется)

Продвинутый аудиоплеер (реализуется без использования библиотек) +20
 - примерные внешний вид и функциональность плеера https://howlerplayer.github.io/
 - добавлен прогресс-бар в котором отображается прогресс проигрывания +3
 - при перемещении ползунка прогресс-бара меняется текущее время воспроизведения трека +3
 - над прогресс-баром отображается название трека +3
 - отображается текущее и общее время воспроизведения трека +3
 - есть кнопка звука при клике по которой можно включить/отключить звук +2
 - добавлен регулятор громкости, при перемещении ползунка регулятора громкости меняется громкость проигрывания звука +3
 - можно запустить и остановить проигрывания трека кликом по кнопке Play/Pause рядом с ним в плейлисте +3

Перевод приложения на два языка (en/ru или en/be) +15
Для перевода приложения может использоваться библиотека, например, i18n или аналогичная.
 - переводится язык и меняется формат отображения даты +3
 - переводится приветствие и placeholder +3
 - переводится прогноз погоды в т.ч описание погоды (OpenWeatherMap API предоставляет такую возможность) и город по умолчанию +3
 - переводится цитата дня (используйте подходящий для этой цели API, возвращающий цитаты на нужном языке или создайте с этой целью JSON-файл с цитатами на двух языках) +3
 - переводятся настройки приложения. При переключении языка приложения в настройках, язык настроек тоже меняется +3
 - не переводятся данные, которые вводит пользователь: имя, город, тег для получения фонового изображения от API

Получение фонового изображения от API +10 Пункт считается выполненным, если фоновые изображения, полученные от API, отвечают требованиям к фоновым изображениям, указанным в пункте 3: их можно перелистывать кликами по стрелкам, обеспечивается плавная смена фоновых изображений, ссылка на фоновое изображение формируется с учётом времени суток, если пользователь не указал другие теги для их получения. Не проверяем и не реализуем последовательное перелистывание изображений и перелистывание изображений по кругу.
 - в качестве источника изображений может использоваться Unsplash API +5
 - в качестве источника изображений может использоваться Flickr API +5

Настройки приложения +20
 - в настройках приложения можно указать язык приложения (en/ru или en/be) +3
 - в настройках приложения можно указать источник получения фото для фонового изображения: коллекция изображений GitHub, Unsplash API, Flickr API +3
 - если источником получения фото указан API, в настройках приложения можно указать тег/теги, для которых API будет присылает фото +3
  Например, nature - фото про природу
 - в настройках приложения можно скрыть/отобразить любой из блоков, которые находятся на странице: время, дата, приветствие, цитата дня, прогноз погоды, аудиоплеер, список дел/список ссылок/ваш собственный дополнительный функционал +3
 - скрытие и отображение блоков происходит плавно, не влияя на другие элементы, которые находятся на странице, или плавно смещая их +3
 - настройки приложения сохраняются при перезагрузке страницы +5
 
 ToDo List - список дел (как в оригинальном приложении) +10
 
 ИТОГО 150 БАЛЛОВ`);