import '../scss/styles.scss'
import * as bootstrap from 'bootstrap'

const tbody = document.querySelector('tbody')
const form = document.querySelector("form")
const name = document.querySelector("#name")
const image = document.querySelector("#url-image")
const URL_API = 'http://localhost:3000/categories/'
let id

index()

form.addEventListener('submit', async (event) => {
    event.preventDefault() // Evitamos que la página se recargue
    if (!id) { // Si id no está definido o no existe entonces crea el objeto
        await create(name.value, image.value)
    } else { // Si id sí está definido, lo pasamos a la función
        await update(id, name.value, image.value) // le pasamos el id obtenido y actualizamos
        id = undefined
    }

    await index()
    form.reset()
})

tbody.addEventListener('click', async function (event) {

    if (event.target.classList.contains("btn-danger")) {
        const id = event.target.getAttribute("data-id")
        await deleteItem(id) // le pasamos el id obtenido y eliminamos
        await index() // recargamos la lista

    } else if (event.target.classList.contains("btn-warning")) {
        id = event.target.getAttribute("data-id")
        const categorieFound = await find(id) // le pasamos el id obtenido, lo buscamos y lo guardamos 
        name.value = categorieFound.name
        image.value = categorieFound.image
    }
})

async function index() { // Trae todos
    const response = await fetch(URL_API) // Api
    const data = await response.json() // Convertimos los datos de JSON a JS

    tbody.innerHTML = ""
    data.forEach(element => {
        tbody.innerHTML += `
            <td>${element.id}</td>
            <td>${element.name}</td>
            <td>
                <img width="100px" src=${element.image} alt=${element.name}>
            </td>
            <td>${element.creationAt}</td>
            <td>${element.updatedAt}</td>
            <td>
                <button type="button" data-id=${element.id} class="btn btn-warning">Edit</button>
                <button type="button" data-id=${element.id} class="btn btn-danger">Delete</button>
            </td>
        `
    })
}

async function find(id) { // Encuentra uno específico
    const response = await fetch(URL_API + id) // Terminamos la ruta
    const data = await response.json() // Convertimos los datos de JSON a JS
    return data // retornamos el elemento que encontró con ese id
}

async function create(name, image) { // Crea una nueva categoría
    const newCategory = { name, image } // Nombre de las propiedades deben ser iguales a los de la API
    await fetch(URL_API, {
        method: "POST", // Método post para gregar información
        body: JSON.stringify(newCategory), // JSON.stringify lo pone en formato JSON.
        headers: {
            "Content-Type": "application/json"
        }
    })
}

async function update(id, name, image) { // Actualizamos una categoria
    await fetch(URL_API + id, {
        method: "PUT", // Método put para actualizar información
        body: JSON.stringify({ name, image }), // JSON.stringify lo pone en formato JSON.
        headers: {
            "Content-Type": "application/json"
        }
    })
}

async function deleteItem(id) { // Eliminamos una categoría

    await fetch(URL_API + id, {
        method: "DELETE" // Especificamos el método
    })

}