const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
let carrito = {};

const accessKey = "NoFklq3XB7WFrWjxObPywCWEE6ieFlC_BkdsUEP-pLo";
const objects = ["food", "fruits"];
const apiUrl = `https://api.unsplash.com/photos/random?query=${objects.join(',')}&count=6&client_id=${accessKey}`;

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        pintarCarrito();
    }
});

cards.addEventListener('click', e => {
    addCarrito(e);
});

items.addEventListener('click', e => {
    btnAccion(e);
});

const fetchData = async () => {
    try {
        const resProductos = await fetch('api.json');
        if (!resProductos.ok) throw new Error(`Error en la solicitud: ${resProductos.statusText}`);
        const dataProductos = await resProductos.json();

        const imageUrls = await fetchApi();
        pintarCards(dataProductos, imageUrls);
    } catch (error) {
        console.log(error);
    }
};

const fetchApi = async () => {
    try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`Error en la solicitud: ${res.statusText}`);
        const data = await res.json();
        return data.map(item => item.urls.small);
    } catch (error) {
        console.error("No se pudo obtener la foto", error);
    }
};

const pintarCards = (data, imageUrls) => {
    data.forEach((producto, index) => {
        const card = templateCard.cloneNode(true);
        card.querySelector('h5').textContent = producto.title;
        card.querySelector('p').textContent = `${producto.precio.toFixed(2)}`; // Formatear el precio
        card.querySelector('.btn-dark').dataset.id = producto.id;
        card.querySelector('img').src = imageUrls[index];
        fragment.appendChild(card);
    });
    cards.appendChild(fragment);
};

const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement);
    }
    e.stopPropagation();
};

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    };
    if (carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }

    carrito[producto.id] = {...producto};
    pintarCarrito();
};

const pintarCarrito = () => {
    items.innerHTML = '';
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id;
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title;
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id;
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id;
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);

    pintarFooter();

    localStorage.setItem('carrito', JSON.stringify(carrito));
};

const pintarFooter = () => {
    footer.innerHTML = '';
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
            <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `;
        return;
    }
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0);
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0);
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    templateFooter.querySelector('span').textContent = nPrecio;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const btnVaciar = document.getElementById('vaciar-carrito');
    btnVaciar.addEventListener('click', () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
          });
        swalWithBootstrapButtons.fire({
            title: "¡Estas seguro?",
            text: "No podrás revertir esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí",
            cancelButtonText: "No",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                swalWithBootstrapButtons.fire({
                    title: "Listo",
                    text: "Tu carrito ha sido vaciado",
                    icon: "success"
                });
                carrito = {};
                pintarCarrito();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire({
                    title: "Listo",
                    text: "Tu carrito no ha sido vaciado",
                    icon: "error"
                });
            }
        });
    });
};

const btnAccion = e => {
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++;
        carrito[e.target.dataset.id] = {...producto};
        pintarCarrito();
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--;
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id];
        }
        pintarCarrito();
    }

    e.stopPropagation();
};
