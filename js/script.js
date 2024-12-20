let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const carritoContainer = document.getElementById("carrito-container");
const totalCarrito = document.getElementById("total-carrito");
const carritoIcono = document.getElementById("carrito-icono");
const carritoContenido = document.getElementById("carrito-contenido");
const carritoCantidad = document.getElementById("contador-carrito");

function mostrarCarrito() {
    carritoContainer.innerHTML = "";
    let total = 0;

    carrito.forEach((producto, index) => {
        total += producto.precio * producto.cantidad;

        const item = document.createElement("div");
        item.classList.add("carrito-item");
        item.innerHTML = `
            <p>${producto.nombre} - $${producto.precio} x ${producto.cantidad}</p>
            <button class="btn-eliminar" data-index="${index}">Eliminar</button>
        `;
        carritoContainer.appendChild(item);
    });

    totalCarrito.textContent = total.toFixed(2);
    carritoCantidad.textContent = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            eliminarProductoDelCarrito(e.target.dataset.index);
        });
    });
}

function agregarAlCarrito(producto) {
    const existe = carrito.find(p => p.id === producto.id);
    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    guardarCarrito();
    mostrarCarrito();
}

function eliminarProductoDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    mostrarCarrito();
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

document.getElementById("btn-comprar").addEventListener("click", () => {
    alert("¡Gracias por tu compra!");
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
});

document.getElementById("btn-vaciar").addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
});

carritoIcono.addEventListener("click", () => {
    carritoContenido.classList.toggle("visible");
});

fetch("https://api.sampleapis.com/coffee/hot")
    .then(response => response.json())
    .then(data => {
        const productosContainer = document.querySelector(".productos-container");
        data.forEach((producto, index) => {
            const card = document.createElement("div");
            card.classList.add("producto-card");
            card.innerHTML = `
                <img src="${producto.image}" alt="${producto.title}">
                <h3>${producto.title}</h3>
                <p class="precio">$${(index + 5).toFixed(2)}</p>
                <button class="btn-agregar" data-id="${index}" data-nombre="${producto.title}" data-precio="${(index + 5).toFixed(2)}">
                    Agregar al carrito
                </button>
            `;
            productosContainer.appendChild(card);
        });

        document.querySelectorAll(".btn-agregar").forEach(boton => {
            boton.addEventListener("click", (e) => {
                const id = parseInt(e.target.dataset.id);
                const nombre = e.target.dataset.nombre;
                const precio = parseFloat(e.target.dataset.precio);
                agregarAlCarrito({ id, nombre, precio });
            });
        });
    })
    .catch(error => console.error("Error al cargar productos:", error));

document.addEventListener("DOMContentLoaded", mostrarCarrito);

