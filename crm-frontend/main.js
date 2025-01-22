const autocompleteList = [];

window.addEventListener('load', async () => {
    document.getElementById('preloader').classList.add('preloader-hide');
})

// ||| Общие функции и константы



const arrowUp = ' ' + '<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M3.49691e-07 4L0.705 4.705L3.5 1.915L3.5 8L4.5 8L4.5 1.915L7.29 4.71L8 4L4 -3.49691e-07L3.49691e-07 4Z" fill="#9873FF" />' +
    '</svg>';

const arrowDown = ' ' + '<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M8 4L7.295 3.295L4.5 6.085L4.5 0L3.5 0L3.5 6.085L0.71 3.29L0 4L4 8L8 4Z" fill="#9873FF"/>' +
    '</svg>';

async function makeAutoCompleteList() {
    autocompleteList.length = 0;
    if (document.querySelectorAll('.fullname')) {
        
        let namesList = document.querySelectorAll('.fullname');
        let idList = document.querySelectorAll('.id-text');
        let counter = 0;
        for (fullname of namesList) {
            let searchItem = {
                fullname: '',
                id: ''
            }
            searchItem.fullname = fullname.textContent;
            searchItem.id = idList[counter].textContent;
            autocompleteList.push(searchItem);
            counter++;
            
        }
        autocompleteList.sort();
    }
}

async function tidyString(str) {
    if (str === '') {
        return
    }
    str = (str.toString()).toLowerCase();
    newfirst = str[0].toUpperCase();
    let newstr = str.replace(str[0], newfirst);
    return newstr;
}

async function getDateString(date) {
    let dateYear = date.getFullYear().toString();
    let dateMonth = date.getMonth() + 1;
    if (dateMonth < 10) {
        dateMonth = '0' + dateMonth.toString();
    } else {
        dateMonth = dateMonth.toString();
    }
    let dateDay = date.getDate();
    if (dateDay < 10) {
        dateDay = '0' + dateDay.toString();
    } else {
        dateDay = dateDay.toString();
    }

    let dateString = dateDay + '.' + dateMonth + '.' + dateYear;
    return dateString;
}

async function getTimeString(date) {
    let dateHour = date.getHours();
    if (dateHour < 10) {
        dateHour = '0' + dateHour.toString();
    } else {
        dateHour = dateHour.toString();
    }
    let dateMinute = date.getMinutes();
    if (dateMinute < 10) {
        dateMinute = '0' + dateMinute.toString();
    } else {
        dateMinute = dateMinute.toString();
    }

    let timeString = dateHour + ':' + dateMinute

    return timeString
}

async function refreshList(array) {
    document.getElementById('clients-table').innerHTML = '';
    await renderClientsTable(array);
}


// |||  модальные окна

// открытие и закрытие
document.getElementById("add-client-btn").addEventListener('click', function () {
    document.getElementById("nc").classList.add('open');
})

document.getElementById("nc-close").addEventListener('click', function () {
    document.getElementById("nc").classList.remove('open');
})

document.getElementById("dc-close").addEventListener('click', function () {
    document.getElementById("dc").classList.remove('open');
})

document.getElementById("rc-close").addEventListener('click', function () {
    document.getElementById("rc").classList.remove('open');
    document.getElementById('rc-contacts-container').innerHTML = '';
    document.getElementById('rc-id').innerHTML = 'ID: ';
    window.location.hash = '';
})

document.getElementById("nc-cancel").addEventListener('click', function () {
    document.getElementById("nc").classList.remove('open');
})

document.getElementById("dc-cancel").addEventListener('click', function () {
    document.getElementById("dc").classList.remove('open');
})

document.getElementById("rc-cancel").addEventListener('click', function () {
    document.getElementById("rc").classList.remove('open');
    document.getElementById('rc-contacts-container').innerHTML = '';
    document.getElementById('rc-id').innerHTML = 'ID: ';
    window.location.hash = '';
})

window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        document.getElementById("nc").classList.remove('open');
        document.getElementById("dc").classList.remove('open');
        document.getElementById("rc").classList.remove('open');
        document.getElementById('rc-contacts-container').innerHTML = '';
        document.getElementById('rc-id').innerHTML = 'ID: ';
        window.location.hash = '';
    }
})

document.querySelector("#nc .nc-box").addEventListener('click', event => {
    event._isClickWithinModal = true;
});

document.getElementById("nc").addEventListener('click', event => {
    if (event._isClickWithinModal) return;
    event.currentTarget.classList.remove('open');
})

document.querySelector("#dc .dc-box").addEventListener('click', event => {
    event._isClickWithinModal = true;
});

document.getElementById("dc").addEventListener('click', event => {
    if (event._isClickWithinModal) return;
    event.currentTarget.classList.remove('open');
})

document.querySelector("#rc .rc-box").addEventListener('click', event => {
    event._isClickWithinModal = true;
});

document.getElementById("rc").addEventListener('click', event => {
    if (event._isClickWithinModal) return;
    event.currentTarget.classList.remove('open');
    document.getElementById('rc-contacts-container').innerHTML = '';
    document.getElementById('rc-id').innerHTML = 'ID: ';
})

// создание инпута контакта

function createContactInput() {
    let newContact = document.createElement('label');
    newContact.classList.add('new-contact');

    let contactType = document.createElement('select');
    contactType.classList.add('nc-contact-type');
    let optionPhone = document.createElement('option');
    optionPhone.textContent = 'Телефон';
    optionPhone.setAttribute('value', 'phone');
    let optionEmail = document.createElement('option');
    optionEmail.textContent = 'Email';
    optionEmail.setAttribute('value', 'email');
    let optionFacebook = document.createElement('option');
    optionFacebook.textContent = 'Facebook';
    optionFacebook.setAttribute('value', 'facebook');
    let optionVK = document.createElement('option');
    optionVK.textContent = 'VK';
    optionVK.setAttribute('value', 'vk');
    let optionOther = document.createElement('option');
    optionOther.textContent = 'Другое';
    optionOther.setAttribute('value', 'other');

    contactType.append(
        optionPhone,
        optionEmail,
        optionFacebook,
        optionVK,
        optionOther
    );

    let contactInput = document.createElement('input');
    contactInput.classList.add('nc-contact-value')
    contactInput.setAttribute('placeholder', 'Введите данные контакта');

    let removeContactButton = document.createElement('button');
    removeContactButton.classList.add('btn-reset');

    removeContactButton.addEventListener('click', function () {
        newContact.remove();
        if (document.getElementById('nc-contacts-container').childElementCount <= 9) {
            document.querySelector('.nc-add-contact').removeAttribute('disabled', '');
        }
        if (document.getElementById('rc-contacts-container').childElementCount <= 9) {
            document.querySelector('.rc-add-contact').removeAttribute('disabled', '');
        }
    })

    newContact.append(
        contactType,
        contactInput,
        removeContactButton
    )

    return newContact;
}

// добавление инпута контакта

document.getElementById('nc-add-contact').addEventListener('click', function () {
    let newInput = createContactInput();
    document.getElementById('nc-contacts-container').append(newInput);
    if (document.getElementById('nc-contacts-container').childElementCount > 9) {
        document.querySelector('.nc-add-contact').setAttribute('disabled', '')
    }
})

document.getElementById('rc-add-contact').addEventListener('click', function () {
    let newInput = createContactInput();
    document.getElementById('rc-contacts-container').append(newInput);
    if (document.getElementById('rc-contacts-container').childElementCount > 9) {
        document.querySelector('.rc-add-contact').setAttribute('disabled', '')
    }
})

// отправка формы нового клиента

let addClientForm = document.querySelector('.nc-form');

addClientForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    document.getElementById('preloader').classList.remove('preloader-hide');

    let newClient = {
        surname: '',
        name: '',
        secondname: '',
        contacts: []
    }

    newClient.surname = addClientForm.querySelector('.nc-surname').value.trim();
    newClient.name = addClientForm.querySelector('.nc-name').value.trim();
    newClient.secondname = addClientForm.querySelector('.nc-secondname').value.trim();

    newClient.surname = await tidyString(newClient.surname);
    newClient.name = await tidyString(newClient.name);
    newClient.secondname = await tidyString(newClient.secondname);

    let contactsList = document.getElementById('nc-contacts-container').children;

    let counter = contactsList.length;

    for (i = 0; i < counter; ++i) {
        let anotherContact = {
            type: '',
            value: ''
        };

        let selectType = contactsList[i].querySelector('.nc-contact-type');
        anotherContact.type = selectType.options[selectType.selectedIndex].value;
        anotherContact.value = contactsList[i].querySelector('.nc-contact-value').value.trim();
        newClient.contacts.push(anotherContact);
    }

    // валидация

    let isValid = true;

    if (!addClientForm.querySelector('.nc-surname').value.trim() || !addClientForm.querySelector('.nc-name').value.trim()) {
        isValid = false;
    }

    for (i = 0; i < counter; ++i) {
        if (!contactsList[i].querySelector('.nc-contact-value').value.trim()) {
            isValid = false;
        }
    }

    let noServerResponse = {};

    if (isValid) {
        const response = await fetch('http://localhost:3000/api/clients', {
            method: 'POST',
            body: JSON.stringify({
                name: newClient.name,
                surname: newClient.surname,
                lastName: newClient.secondname,
                contacts: newClient.contacts,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (response.status === 422) {
            errorMessage.textContent = 'Ошибка 422: обязательные поля не заполнены или заполнены неверно!';
            document.querySelector('.nc-finalbtns').prepend(errorMessage);
        } else if (response.status === 404) {
            errorMessage.textContent = 'Ошибка 404: клиент не найден.';
            document.querySelector('.nc-finalbtns').prepend(errorMessage);
        } else if (response.status / 500 >= 1) {
            errorMessage.textContent = 'Ошибка сервера. Обратитесь к администратору!';
            document.querySelector('.nc-finalbtns').prepend(errorMessage);
        } else if (response.status > 299) {
            errorMessage.textContent = 'Ошибка: что-то пошло не так.';
            document.querySelector('.nc-finalbtns').prepend(errorMessage);
        } else {
            const forListResponse = await fetch('http://localhost:3000/api/clients');
            const clientsList = await forListResponse.json();
            await refreshList(clientsList);
            makeAutoCompleteList();
            document.getElementById('nc-cancel').click();
            addClientForm.querySelector('.nc-surname').value = '';
            addClientForm.querySelector('.nc-name').value = '';
            addClientForm.querySelector('.nc-secondname').value = '';
            document.getElementById('nc-contacts-container').innerHTML = '';
        }
    }
    else {
        noServerResponse = { status: 422 };
    }

    // ошибки
    let errorMessage = document.createElement('span');
    errorMessage.classList.add('error-msg');
    if (document.querySelector('.error-msg')) {
        document.querySelector('.error-msg').remove();
    }

    if (noServerResponse.status === 422) {
        errorMessage.textContent = 'Ошибка: обязательные поля не заполнены или заполнены неверно!';
        document.querySelector('.nc-finalbtns').prepend(errorMessage);
        if (!addClientForm.querySelector('.nc-surname').value.trim()) {
            addClientForm.querySelector('.nc-surname').classList.add('need-input');
        }
        if (!addClientForm.querySelector('.nc-name').value.trim()) {
            addClientForm.querySelector('.nc-name').classList.add('need-input');
        }
        for (i = 0; i < counter; ++i) {

            if (!contactsList[i].querySelector('.nc-contact-value').value.trim()) {
                contactsList[i].querySelector('.nc-contact-value').classList.add('need-contact');
            }
        }
    }
    document.getElementById('preloader').classList.add('preloader-hide');
})


// отправка отредактированного клиента

let redactClientForm = document.querySelector('.rc-form');

redactClientForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    document.getElementById('preloader').classList.remove('preloader-hide');
    let redactedClient = {
        surname: '',
        name: '',
        secondname: '',
        contacts: []
    }

    redactedClient.surname = redactClientForm.querySelector('.rc-surname').value.trim();
    redactedClient.name = redactClientForm.querySelector('.rc-name').value.trim();
    redactedClient.secondname = redactClientForm.querySelector('.rc-secondname').value.trim();

    redactedClient.surname = await tidyString(redactedClient.surname);
    redactedClient.name = await tidyString(redactedClient.name);
    redactedClient.secondname = await tidyString(redactedClient.secondname);

    let contactsList = document.getElementById('rc-contacts-container').children;
    let counter = contactsList.length;

    for (i = 0; i < counter; ++i) {
        let anotherContact = {
            type: '',
            value: ''
        };

        let selectType = contactsList[i].querySelector('.nc-contact-type');
        anotherContact.type = selectType.options[selectType.selectedIndex].value;
        anotherContact.value = contactsList[i].querySelector('.nc-contact-value').value.trim();
        redactedClient.contacts.push(anotherContact);
    }

    let idRedact = document.getElementById('id').textContent;

    // валидация 
    let isValid = true;

    if (!redactClientForm.querySelector('.rc-surname').value.trim() || !redactClientForm.querySelector('.rc-name').value.trim()) {
        isValid = false;
    }

    for (i = 0; i < counter; ++i) {
        if (!contactsList[i].querySelector('.nc-contact-value').value.trim()) {
            isValid = false;
        }
    }

    let noServerResponse = {};


    if (isValid) {
        const response = await fetch(`http://localhost:3000/api/clients/${idRedact}`, {
            method: 'PATCH',
            body: JSON.stringify({
                name: redactedClient.name,
                surname: redactedClient.surname,
                lastName: redactedClient.secondname,
                contacts: redactedClient.contacts,
            }),
            headers: {
                'Content-Type': 'application/json'
            }

        })
        if (response.status === 422) {
            errorMessage.textContent = 'Ошибка 422: обязательные поля не заполнены или заполнены неверно!';
            document.querySelector('.rc-finalbtns').prepend(errorMessage);
        }
        else if (response.status === 404) {
            errorMessage.textContent = 'Ошибка 404: клиент не найден.';
            document.querySelector('.rc-finalbtns').prepend(errorMessage);
        } else if (response.status / 500 >= 1) {
            errorMessage.textContent = 'Ошибка сервера. Обратитесь к администратору!';
            document.querySelector('.rc-finalbtns').prepend(errorMessage);
        } else if (response.status > 299) {
            errorMessage.textContent = 'Ошибка: что-то пошло не так.';
            document.querySelector('.rc-finalbtns').prepend(errorMessage);
        } else {
            
            const forListResponse = await fetch('http://localhost:3000/api/clients');
            const clientsList = await forListResponse.json();
            await refreshList(clientsList);
            
            document.getElementById('rc-cancel').click();
            makeAutoCompleteList();
        }
    } else {
        noServerResponse = { status: 422 };
    }

    // ошибки
    let errorMessage = document.createElement('span');
    errorMessage.classList.add('error-msg');
    if (document.querySelector('.error-msg')) {
        document.querySelector('.error-msg').remove();
    }
    if (noServerResponse === 422) {
        errorMessage.textContent = 'Ошибка: обязательные поля не заполнены или заполнены неверно!';
        document.querySelector('.rc-finalbtns').prepend(errorMessage);
        if (!redactClientForm.querySelector('.rc-surname').value.trim()) {
            redactClientForm.querySelector('.rc-surname').classList.add('need-input');
        }
        if (!redactClientForm.querySelector('.rc-name').value.trim()) {
            redactClientForm.querySelector('.rc-name').classList.add('need-input');
        }
        for (i = 0; i < counter; ++i) {

            if (!contactsList[i].querySelector('.nc-contact-value').value.trim()) {
                contactsList[i].querySelector('.nc-contact-value').classList.add('need-contact');
            }
        }
    }

    document.getElementById('preloader').classList.add('preloader-hide');
})

// ||| Отрисовка таблицы

// get client item

async function getClientItem(clientObj) {
    let id = clientObj.id;

    let surname = await tidyString(clientObj.surname);
    let name = await tidyString(clientObj.name);
    let secondname = await tidyString(clientObj.lastName);

    let fullname = ''
    if (secondname == undefined) {
        fullname = surname + ' ' + name;
    } else {
        fullname = surname + ' ' + name + ' ' + secondname;
    }



    let created = new Date(clientObj.createdAt);
    let createdDate = await getDateString(created);
    let createdTime = await getTimeString(created);

    let updated = new Date(clientObj.updatedAt);
    let updatedDate = await getDateString(updated);
    let updatedTime = await getTimeString(updated);

    let contacts = clientObj.contacts;

    return [id, fullname, createdDate, createdTime, updatedDate, updatedTime, contacts]
}


// render table 

async function renderClientsTable(clientsList) {
    for (i = 0; i < clientsList.length; ++i) {
        let clientItem = await getClientItem(clientsList[i]);

        let clientRow = document.createElement('tr');
        // id
        let clientId = document.createElement('td');
        let clientIdContainer = document.createElement('div');
        let clientIdP = document.createElement('p');
        clientIdP.classList.add('greytext', 'id-text', 'noselect');
        clientIdP.textContent = Math.floor(clientItem[0]);
        clientIdContainer.append(clientIdP);
        clientId.append(clientIdContainer);
        // full name
        let clientFullname = document.createElement('td');
        let clientFullnameContainer = document.createElement('div');
        let clientFullnameP = document.createElement('p');
        clientFullnameP.classList.add('blacktext', 'noselect', 'fullname');
        clientFullnameP.textContent = clientItem[1];
        clientFullnameContainer.append(clientFullnameP);
        clientFullname.append(clientFullnameContainer);
        // created at
        let clientCreated = document.createElement('td');
        let clientCreatedContainer = document.createElement('div');
        let clientCreatedDate = document.createElement('p');
        clientCreatedDate.classList.add('blacktext', 'noselect');
        clientCreatedDate.textContent = clientItem[2];
        let clientCreatedTime = document.createElement('p');
        clientCreatedTime.classList.add('greytext', 'noselect');
        clientCreatedTime.textContent = clientItem[3];
        clientCreatedContainer.append(clientCreatedDate, clientCreatedTime);
        clientCreated.append(clientCreatedContainer);
        // updated at
        let clientUpdated = document.createElement('td');
        let clientUpdatedContainer = document.createElement('div');
        let clientUpdatedDate = document.createElement('p');
        clientUpdatedDate.classList.add('blacktext', 'noselect');
        clientUpdatedDate.textContent = clientItem[4];
        let clientUpdatedTime = document.createElement('p');
        clientUpdatedTime.classList.add('greytext', 'noselect');
        clientUpdatedTime.textContent = clientItem[5];
        clientUpdatedContainer.append(clientUpdatedDate, clientUpdatedTime);
        clientUpdated.append(clientUpdatedContainer);
        // contacts
        let clientContacts = document.createElement('td');
        let clientContactsList = clientItem[6];
        if (clientContactsList[0] === undefined) {
            clientContacts.textContent = 'Нет контактов';
            clientContacts.classList.add('noselect');
        } else {
            let contactsContainer = document.createElement('div');
            contactsContainer.classList.add('contacts-container');
            for (j = 0; j < clientContactsList.length; ++j) {
                let contactContainer = document.createElement('div');
                contactContainer.classList.add('contact-container');
                let contactType = document.createElement('span');
                contactType.classList.add('contact-type');
                let contactValue = document.createElement('span');
                // svg
                let svgCode = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">';
                if (clientContactsList[j].type === 'phone') {
                    contactType.innerHTML = 'Телефон:&nbsp;';
                    svgCode = svgCode
                        + '<g opacity="0.7">'
                        + '<circle cx="8" cy="8" r="8" fill="#9873FF" />'
                        + '<path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white" />'
                        + '</g>'
                        + '</svg>';
                } else if (clientContactsList[j].type === 'email') {
                    contactType.innerHTML = 'Email:&nbsp;';
                    svgCode = svgCode
                        + '<g opacity="0.7">'
                        + '<path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/>'
                        + '</g>'
                        + '</svg>'
                } else if (clientContactsList[j].type === 'facebook') {
                    contactType.innerHTML = 'Facebook:&nbsp;';
                    svgCode = svgCode
                        + '<g opacity="0.7">'
                        + '<path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>'
                        + '</g>'
                        + '</svg>'
                } else if (clientContactsList[j].type === 'vk') {
                    contactType.innerHTML = 'VK:&nbsp;';
                    svgCode = svgCode
                        + '<g opacity="0.7">'
                        + '<path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF" />'
                        + '</g>'
                        + '</svg>'
                }
                else {
                    contactType.innerHTML = 'Другое:&nbsp;';
                    svgCode = svgCode
                        + '<g opacity="0.7">'
                        + '<path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF" />'
                        + '</g>'
                        + '</svg>'
                };
                contactContainer.innerHTML = svgCode;
                let contactWindow = document.createElement('div');
                contactWindow.classList.add('contact-window');
                contactWindow.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">'
                    + '<path d = "M8.17717 13.2761L0.303447 0.795407L15.8942 0.795405L8.17717 13.2761Z" fill = "#333333" />'
                    + '</svg >';
                let contactWindowWrapper = document.createElement('div');
                contactWindowWrapper.classList.add('contact-window-wrapper');
                contactValue.textContent = clientContactsList[j].value;
                contactWindowWrapper.append(contactType, contactValue);
                contactWindow.append(contactWindowWrapper);
                contactContainer.append(contactWindow);

                contactsContainer.append(contactContainer);
            }
            clientContacts.append(contactsContainer);
        }

        // buttons
        let clientButtons = document.createElement('td');
        let changeButton = document.createElement('button');
        changeButton.textContent = 'Изменить';
        changeButton.classList.add('btn-reset', 'change-button', 'noselect');
        changeButton.setAttribute('id', clientItem[0]);
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.classList.add('btn-reset', 'delete-button', 'noselect');
        clientButtons.append(changeButton, deleteButton);

        // append 
        clientRow.append(
            clientId,
            clientFullname,
            clientCreated,
            clientUpdated,
            clientContacts,
            clientButtons
        );


        // event listeners for buttons

        deleteButton.addEventListener('click', async () => {
            document.getElementById("dc").classList.add('open');
            document.getElementById('dc-delete').addEventListener('click', function () {
                clientRow.remove();
                fetch(`http://localhost:3000/api/clients/${clientItem[0]}`, {
                    method: 'DELETE',
                })
                makeAutoCompleteList();
                document.getElementById('dc-close').click();
            })

        })



        changeButton.addEventListener('click', async function openRedactModal() {
            document.querySelector('.rc-add-contact').removeAttribute('disabled');
            document.getElementById('preloader').classList.remove('preloader-hide');
            const response = await fetch(`http://localhost:3000/api/clients/${clientItem[0]}`);
            const clientOnServer = await response.json();
            document.getElementById("rc").classList.add('open');
            if (!document.getElementById('id')) {
                let clientRealId = document.createElement('span');
                clientRealId.innerHTML = clientOnServer.id;
                window.location.hash = clientOnServer.id;
                clientRealId.setAttribute('id', 'id');
                document.getElementById("rc-id").append(clientRealId);
            }
            document.querySelector(".rc-surname").value = clientOnServer.surname;
            document.querySelector(".rc-name").value = clientOnServer.name;
            document.querySelector(".rc-secondname").value = clientOnServer.lastName;
            let contactsToChange = await clientOnServer.contacts;
            if ((contactsToChange.length > 0) || (document.getElementById('rc-contacts-container').childElementCount === 0)) {
                for (i = 0; i < contactsToChange.length; ++i) {
                    let newInput = createContactInput();
                    document.getElementById('rc-contacts-container').append(newInput);
                    if (contactsToChange[i].type == 'phone') {
                        newInput.querySelector('.nc-contact-type').selectedIndex = 0;
                    } else if (contactsToChange[i].type == 'email') {
                        newInput.querySelector('.nc-contact-type').selectedIndex = 1;
                    } else if (contactsToChange[i].type == 'facebook') {
                        newInput.querySelector('.nc-contact-type').selectedIndex = 2;
                    } else if (contactsToChange[i].type == 'vk') {
                        newInput.querySelector('.nc-contact-type').selectedIndex = 3;
                    } else {
                        newInput.querySelector('.nc-contact-type').selectedIndex = 4;
                    }
                    newInput.querySelector('.nc-contact-value').value = contactsToChange[i].value;
                }
                if (document.getElementById('rc-contacts-container').childElementCount > 9) {
                    document.querySelector('.rc-add-contact').setAttribute('disabled', '')
                }
            }
            document.getElementById('preloader').classList.add('preloader-hide');
        })
        // append to DOM
        document.getElementById('clients-table').append(clientRow);

    }
}


// DOM content loaded

document.addEventListener('DOMContentLoaded', async function () {
    const response = await fetch('http://localhost:3000/api/clients');
    const clientsList = await response.json();
    await renderClientsTable(clientsList);
    sortOnClick('id', document.getElementById('client-id'), false);

    let targetId = window.location.hash.substring(1);
    if (!(targetId === '')) {
        let buttonToClick = document.getElementById(targetId);
        buttonToClick.click();
    }

    document.getElementById('search').setAttribute('disabled', '');
    makeAutoCompleteList();
    document.getElementById('search').removeAttribute('disabled', '');
})

// ||| Сортировка и поиск

// функция сортировки по клику

const sortArray = (arr, prop, dir = false) => arr.sort((a, b) => (!dir ? a[prop] < b[prop] : a[prop] > b[prop]) ? -1 : 0);

async function sortOnClick(property, element, direction) {
    const response = await fetch('http://localhost:3000/api/clients');
    const clientsList = await response.json();

    let point = document.createElement('span');
    if (document.querySelector('.arrow') == null) {
        point.innerHTML = arrowDown;
        point.classList.add('arrow');
        element.append(point);
        sortArray(clientsList, property, direction);
    } else if (document.querySelector('.arrow').classList.contains('arrow-up')) {
        document.querySelector('.arrow').remove();
        point.innerHTML = arrowDown;
        point.classList.add('arrow');
        element.append(point);
        sortArray(clientsList, property, direction);
    } else {
        document.querySelector('.arrow').remove();
        point.innerHTML = arrowUp;
        point.classList.add('arrow', 'arrow-up');
        element.append(point);
        sortArray(clientsList, property, !direction);
    }
    refreshList(clientsList);
}

// слушаем события по кликам на верхние колонки

document.getElementById('client-id').addEventListener('click', function () {
    sortOnClick('id', this, false)
})

document.getElementById('client-fio').addEventListener('click', function () {
    sortOnClick('surname', this, false)
})

document.getElementById('client-created').addEventListener('click', function () {
    sortOnClick('createdAt', this, false)
})

document.getElementById('client-updated').addEventListener('click', function () {
    sortOnClick('updatedAt', this, false)
})


// функция поиска 

function searchArray(arr, value) {
    let result = [],
        copy = [...arr];
    for (const item of copy) {
        for (prop in item) {
            if (prop === 'updatedAt' || prop == 'createdAt') {
                continue
            }
            if (String(item[prop]).toLowerCase().includes(value.toLowerCase()) == true) {
                result.push(item);
                break
            }
        }
    }
    return result
}

async function createAutocomplete(arr, value) {
    await value, arr;
    if (value === '') {
        document.getElementById('autocomplete-list').innerHTML = '';
    } else {
        document.getElementById('autocomplete-list').innerHTML = '';
        newArr = []
        arr = await arr;
        let newCounter = 0;
        for (element of arr) {
            if (element.fullname.toLowerCase().includes(value.toLowerCase())) {

                let newAutocompleteItem = document.createElement('li');
                newAutocompleteItem.classList.add('autocomplete-item');
                if (newCounter === 0) { newAutocompleteItem.classList.add('autocomplete-item-hover') }

                let newAutocompleteItemFullname = document.createElement('span');
                newAutocompleteItemFullname.classList.add('autocomplete-fullname');
                newAutocompleteItemFullname.textContent = element.fullname;

                let newAutocompleteItemId = document.createElement('span');
                newAutocompleteItemId.classList.add('autocomplete-id');
                newAutocompleteItemId.textContent = 'ID: ' + element.id;

                let newCounterSpan = document.createElement('span');
                newCounterSpan.classList.add('counter');
                newCounterSpan.innerHTML = newCounter;

                newAutocompleteItem.append(newAutocompleteItemFullname, newAutocompleteItemId, newCounterSpan);
                document.getElementById('autocomplete-list').append(newAutocompleteItem);


                const idToClick = element.id;
                newAutocompleteItem.addEventListener('click', () => {
                    if (document.querySelector('.tr-litup')) {
                        document.querySelector('.tr-litup').classList.remove('tr-litup');
                    }
                    document.getElementById('autocomplete-list').innerHTML = '';
                    document.getElementById('search').value = '';
                    document.getElementById(idToClick).click();
                    document.getElementById(idToClick).parentElement.parentElement.classList.add('tr-litup');
                })
                newAutocompleteItem.addEventListener('mouseenter', () => {
                    if (document.querySelector('.autocomplete-item-hover')) {
                        document.querySelector('.autocomplete-item-hover').classList.remove('autocomplete-item-hover');
                    }
                    newAutocompleteItem.classList.add('autocomplete-item-hover');
                    current = newAutocompleteItem.querySelector('.counter').innerHTML;
                })
                newCounter++;
            }
        }
    }

}

// search event listener
let timeout = null;

document.getElementById('search').addEventListener('input', async function () {
    createAutocomplete(autocompleteList, this.value.trim());
    if (document.getElementById('search-toggle').checked) {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            document.getElementById('preloader').classList.remove('preloader-hide');
            const response = await fetch('http://localhost:3000/api/clients');
            const clientsList = await response.json();
            createAutocomplete(autocompleteList, this.value.trim());
            let newList = searchArray(clientsList, this.value.trim());
            refreshList(newList);

            document.getElementById('preloader').classList.add('preloader-hide');
        }, 500);
        // предложенные в ТЗ 300 мс работают плохо, нужно обязательно уметь быстро
        // печатать, чтобы не срабатывал event listener. 500 мс работает лучше,
        // особенно для автодополнения 
    }

})


let current = 0;

document.getElementById('search').addEventListener('keydown', async (e) => {
    let listOfVariants = document.querySelectorAll('.autocomplete-item');
    let numberOfVariants = listOfVariants.length;
    if (e.key === "ArrowDown") {
        current++;
        if (current > numberOfVariants - 1) {
            current = 0;
        }
        if (document.querySelector('.autocomplete-item-hover')) {
            document.querySelector('.autocomplete-item-hover').classList.remove('autocomplete-item-hover');
        }
        listOfVariants[current].classList.add('autocomplete-item-hover');
    }
    if (e.key === "ArrowUp") {
        current--;
        if (current < 0) {
            current = numberOfVariants - 1;
        }
        if (document.querySelector('.autocomplete-item-hover')) {
            document.querySelector('.autocomplete-item-hover').classList.remove('autocomplete-item-hover');
        }
        listOfVariants[current].classList.add('autocomplete-item-hover');
    }
    if (e.key === "Enter") {
        document.querySelector('.autocomplete-item-hover').click();
    }
})




window.addEventListener('hashchange', () => {
    document.getElementById('rc-contacts-container').innerHTML = '';
    document.getElementById('rc-id').innerHTML = 'ID: ';
    let targetId = window.location.hash.substring(1);
    if (!(targetId === '')) {
        let buttonToClick = document.getElementById(targetId);
        buttonToClick.click();
    }
})

