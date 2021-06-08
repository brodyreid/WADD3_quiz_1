const BASE_URL = `http://localhost:3000/api/v1`

const Pet = {
    index(){
        return fetch(`${BASE_URL}/pets`)
        .then(res => {
            console.log(res)
            return res.json()
        })
    },

    create(params){
        return fetch(`${BASE_URL}/pets`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        }).then((res) => res.json())
    },

    show(id){
        return fetch(`${BASE_URL}/pets/${id}`)
        .then(res => res.json())
    },

    update(id, params){
        return fetch(`${BASE_URL}/pets/${id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        }).then(res => res.json())
    }
}

// Authentication
const Session = {
    create(params){
        return fetch(`${BASE_URL}/session`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        }).then(res => res.json())
    }
}

Session.create({
    email: 'hagrid@hogwarts.edu',
    password: 'supersecret'
}).then(console.log);

// Index Pets
function loadPets(){
    Pet.index()
        .then(pets => {
            const petsContainer = document.querySelector('ul.pet-list')
            petsContainer.innerHTML = pets.map(p => {
                return `
                <li>
                <a class="pet-link" data-id="${p.id}" href="">
                ${p.id} - ${p.name} | Available: ${p.is_available}
                </li>
                `
            }).join('');
        })
}

loadPets()

// Add a New Pet
const newPetForm = document.querySelector('#new-pet-form')
newPetForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget
    const formData = new FormData(form)
    const newPetParams = {
        name: formData.get('name'),
        pet_type: formData.get('pet_type'),
        image_url: formData.get('image_url'),
        is_available: formData.get('is_available'),
        description: formData.get('description'),
    }
    
    Pet.create(newPetParams)
    .then(data => {
            renderPetShow(data.id)
        // if(data.errors){
        //     const newPetForm = document.querySelector('#new-pet-form')
        //     newPetForm.querySelectorAll('p.error-message').forEach(node => {
        //         node.remove()
        //     })
        //     for (const key in data.errors){
        //         const errorMessages = data.errors(key).join(', ')
        //         const errorMessageNode = document.createElement('p')
        //         errorMessageNode.classList.add('error-message')
        //         errorMessageNode.innerText = errorMessages
        //         const input = newPetForm.querySelector(`#${key}`)
        //         input.parentNode.insertBefore(errorMessageNode, input)
        //     }
        // } else {
        //     renderPetShow(data.id)
        // }
    })
})

// Display Pet
const petsContainer = document.querySelector('ul.pet-list')
petsContainer.addEventListener('click', (event) => {
    event.preventDefault()
    const petElement = event.target
    if(petElement.matches('a.pet-link')){
        const petId = event.target.dataset.id
        renderPetShow(petId)
    }
})

function renderPetShow(id){
    const showPage = document.querySelector('.page#pet-show')
    Pet.show(id)
    .then(pet => {
        const petHTML = `
        <div class="card">
        <img src="${pet.image_url}" class="img-fluid img-thumbnail" alt="pet picture">
        <h3>${pet.name}</h3>
        <p>Animal Type: ${pet.pet_type}</p>
        <p>Description: ${pet.description}</p>
        <small>Available: ${pet.is_available}</small><br>
        <a data-target="pet-edit" data-id="${pet.id}" href="">Edit</a>
        </div>
        `
        showPage.innerHTML = petHTML
        navigateTo('pet-show')
    })
}

// Edit pet
document.querySelector('#pet-show').addEventListener('click', (event) => {
    event.preventDefault()
    const editPetId = event.target.dataset.id
    if (editPetId){
        populateForm(editPetId)
        navigateTo('pet-edit')
    }
})

function populateForm(id){
    Pet.show(id).then(petData => {
        document.querySelector('#edit-pet-form [name=name]').value=petData.name
        document.querySelector('#edit-pet-form [name=pet_type]').value=petData.pet_type
        document.querySelector('#edit-pet-form [name=image_url]').value=petData.image_url
        document.querySelector('#edit-pet-form [name=is_available]').value=petData.is_available
        document.querySelector('#edit-pet-form [name=description]').value=petData.description
        document.querySelector('#edit-pet-form [name=id]').value=petData.id
    })
}

const editPetForm = document.querySelector('#edit-pet-form')
editPetForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const editFormData = new FormData(event.currentTarget)
    const updatedPetParams = {
        name: editFormData.get('name'),
        pet_type: editFormData.get('pet_type'),
        image_url: editFormData.get('image_url'),
        is_available: editFormData.get('is_available'),
        description: editFormData.get('description')
    }
    console.log(updatedPetParams)
    Pet.update(editFormData.get('id'), updatedPetParams)
    .then(pet => {
        editPetForm.reset()
        renderPetShow(pet.id)
    })
})

// Navigation
function navigateTo(id){
    document.querySelectorAll('.page').forEach(node => {
        node.classList.remove('active')
    })
    document.querySelector(`.page#${id}`).classList.add('active')
}

// Navbar
const addNavbar = document.querySelector('nav.navbar')
addNavbar.addEventListener('click', (event) => {
    event.preventDefault()
    const node = event.target
    const page = node.dataset.target
    if (page){
        navigateTo(page)
    }
})
