const formSubmitBtn = document.querySelector('.addBookForm input[type="submit"]');
const libraryContainer = document.querySelector('.library tbody');
const Form = document.querySelector('.addBookForm');
const titleInput = document.querySelector('.addBookForm__title input');
const authorInput = document.querySelector('.addBookForm__author input');
const listSelect = document.querySelector('.addBookForm__category select');
const allFormInputs = [titleInput, authorInput, listSelect, ...document.querySelectorAll('.addBookForm input[type="radio"]')];

allFormInputs.forEach((e) => {
    e.addEventListener('input', () => {
        if (document.querySelector('.addBookForm__info')) {
            document.querySelector('.addBookForm__info').remove();
        }
    })
})

formSubmitBtn.addEventListener('click', (e) => sendForm(e));

const checkBooksAtStart = () => {
    const books = JSON.parse(localStorage.getItem("books") || "[]");
    if (books.length < 1) {
        const bookInfo = document.createElement('p');
        bookInfo.className = "library__info";
        bookInfo.textContent = "Brak dodanych książek do przeczytania";
        libraryContainer.appendChild(bookInfo);
    }
    for (const el of books) {
        addNewBookToHTML(el);
    }
}

const sendForm = (e) => {
    e.preventDefault();
    const validate = validateForm();
    if (validate) {
        if (!document.querySelector('addBookForm__info')) {
            const formInfo = document.createElement('p');
            formInfo.className = "addBookForm__info";
            formInfo.textContent = validate;
            Form.appendChild(formInfo);
        }
        return;
    }
    const newBookObject = {
        title: titleInput.value,
        author: authorInput.value,
        priority: document.querySelector('input[name="priority"]:checked').value,
        category: listSelect.value,
    }
    const infoAboutNoBooks = document.querySelector('.library__info');
    if (infoAboutNoBooks) {
        libraryContainer.removeChild(document.querySelector('.library__info'));
    }
    addNewBookToHTML(newBookObject);
    const books = JSON.parse(localStorage.getItem("books") || "[]");
    books.push(newBookObject);
    localStorage.setItem('books', JSON.stringify(books));
    resetForm();
}


const addNewBookToHTML = (newBookObject) => {
    const {
        title,
        author,
        priority,
        category
    } = newBookObject;

    const newBookContainer = document.createElement('tr');
    const newBookTitle = document.createElement('td');
    newBookTitle.textContent = title;
    const newBookAuthor = document.createElement('td');
    newBookAuthor.textContent = author;
    const newBookPriority = document.createElement('td');
    newBookPriority.textContent = priority;
    const newBookCategory = document.createElement('td');
    newBookCategory.textContent = category;

    newBookContainer.appendChild(newBookTitle);
    newBookContainer.appendChild(newBookAuthor);
    newBookContainer.appendChild(newBookPriority);
    newBookContainer.appendChild(newBookCategory);

    libraryContainer.appendChild(newBookContainer);
}

const validateForm = () => {
    if (titleInput.value.length < 1) {
        return 'Pole tytuł musi zawierać co najmniej 1 znak';
    }
    if (authorInput.value.length < 3) {
        return 'Pole author książki musi zawierać co najmniej 3 znaki';
    }
    const inputRadioCheckedElement = document.querySelector('input[name="priority"]:checked');
    if (inputRadioCheckedElement === null) {
        return 'Uzupełnij pole priorytet przeczytania';
    }
    if (!listSelect.value) {
        return 'Uzupełnij pole kategoria';
    }
    return false;
}

const resetForm = () => {
    titleInput.value = "";
    authorInput.value = "";
    document.querySelector('input[name="priority"]:checked').checked = false;
    listSelect.value = "";
}

checkBooksAtStart();