const cols = document.querySelectorAll('.col');

// Функция: смена цветов по нажатию кнопки на клавиатуре
document.addEventListener('keydown', (event) => {
    event.preventDefault();
    // console.log(event.code); // вывод кнопок
    if (event.code.toLowerCase() === 'space') {
        setRandomColors();
    }
})
document.addEventListener('click', (event) => {
    const type = event.target.dataset.type;
    if (type === 'lock') {
        // console.log(event.target)
        // Если event.taget.tagName (строковое значение названия тега) равен i,
        // то значение event.taget,
        // если это была кнопка, то необходимо получить первого ребенка у этой кнопки, то есть i
        const node = event.target.tagName.toLowerCase() === 'i'
        ? event.target
        : event.target.children[0];

        node.classList.toggle('fa-lock-open');
        node.classList.toggle('fa-lock');
    } else if (type === 'copy') {
        copyToClickboard(event.target.textContent);
    }
})

// Функция: копирование значения цвета по клику на текст
function copyToClickboard(text) {
    return navigator.clipboard.writeText(text);
}

// function gerenateRandomColor() {
//     // RGB
//     // #ff0000
//     // #00ff00
//     // #0000ff
//     const hexCodes = '0123456789ABCDEF';
//     let color = '';
//     for (let i = 0; i < 6; i++) {
//         color += hexCodes[Math.floor(Math.random() * hexCodes.length)];
//     }
//     return '#' + color;
// }
// Вместо функции gerenateRandomColor можно использовать библиотеку Chroma JS

// Функция: вывод значения цвета в h2 и присвоение цвета background
// По умолчанию параметр isInitial равен Undefined
function setRandomColors(isInitial) {
    const colors = isInitial ? getColorsFromHash() : [];

    cols.forEach((col, index) => {
        // Если у селоктора i класс fa-lock, то переменная сохраняется 
        const isLocked = col.querySelector('i').classList.contains('fa-lock');
        const text = col.querySelector('h2');
        const button = col.querySelector('button i');
        
        // Если переменная "заблокированная", то цвет не меняется
        if (isLocked) {
            colors.push(text.textContent);
            return
        }
        
        const color = isInitial 
            ? colors[index] 
                ? colors[index] 
                : chroma.random()
            : chroma.random();

        if (!isInitial) {
            colors.push(color);
        }
        text.textContent = color;
        col.style.background = color;

        setTextColor(text, color);
        setTextColor(button, color);
    })

    updateColorsHash(colors);
}

// Функция: если люминейс больше чем 0.5, то цвет текста чёрный, иначе белый
function setTextColor(text, color) {
    const luminance = chroma(color).luminance();
    text.style.color = luminance > 0.5 ? 'black' : 'white';
}

// сохранение цвета
function updateColorsHash(colors = []) {
    // добавление в массив с "-" с удалением решетки
    document.location.hash = colors
        .map((col) => {
            return col.toString().substring(1)
        }).join('-');
}
// проверка хэша
function getColorsFromHash() {
    if (document.location.hash.length > 1) {
        return document.location.hash
            .substring(1)
            .split('-')
            .map(color => '#' + color);
    }
    return [];
}

setRandomColors(true);