const crearCards = async () => {
    const productos = await obtenerProductos();
    const descuentos = await obtenerDescuentos();

    const cards = document.querySelector(".div-cards");
    cards.innerHTML = "";
    const contadorCarrito = document.querySelector(".contador-carrito");

    productos.forEach(async producto => {

        try {
            const traducciones = await traducir([producto.category, producto.title, producto.description]);
            producto.category = traducciones[0];
            producto.title = traducciones[1];
            producto.description = traducciones[2];
        } catch (error) {
            console.error(error);
        }

        const card = document.createElement("div");
        card.classList.add("card");

        const imagen_card = document.createElement("div");
        imagen_card.classList.add("imagen-card");
        const imagen = document.createElement("img");
        imagen.src = producto.image;
        imagen.width = "130";
        imagen.height = "180";
        imagen_card.appendChild(imagen);
        card.appendChild(imagen_card);

        const informacion = document.createElement("div");
        informacion.classList.add("informacion-card");

        const categoria = document.createElement("p");
        categoria.classList.add("categoria-card");
        categoria.textContent = producto.category;
        informacion.appendChild(categoria);

        const titulo = document.createElement("p");
        titulo.classList.add("titulo-card");
        titulo.textContent = producto.title;
        informacion.appendChild(titulo);

        const descripcion = document.createElement("p");
        descripcion.classList.add("descripcion-card");
        descripcion.textContent = producto.description.slice(0, 30) + "...";
        informacion.appendChild(descripcion);
        descripcion.addEventListener("mouseover", () => {
            descripcion.textContent = producto.description;
            descripcion.style.overflow = "hidden";
            descripcion.style.overflowY = "auto";
        });
        descripcion.addEventListener("mouseout", () => {
            descripcion.textContent = producto.description.slice(0, 30);
            descripcion.style.overflow = "visible";
        })

        const div_precios = document.createElement("div");
        div_precios.classList.add("div-precios");
        const precio = document.createElement("p");
        precio.classList.add("precio-card");

        const descuento = descuentos.find(descuento => descuento.id === producto.id);

        if (descuento) {
            precio.textContent = `$${(producto.price - producto.price * descuento.porcentaje / 100).toFixed(2)}`;
            const precioSinDescuento = document.createElement("p");
            precioSinDescuento.classList.add("precio-tachado");
            precioSinDescuento.textContent = `$${producto.price}`;
            div_precios.appendChild(precioSinDescuento)

            producto.price = parseFloat((producto.price - producto.price * descuento.porcentaje / 100).toFixed(2));

            const div_descuento = document.createElement("div");
            div_descuento.classList.add("banda-oferta");
            div_descuento.textContent = `-${descuento.porcentaje}%`;
            imagen_card.insertBefore(div_descuento, imagen_card.firstChild);
        } else {
            precio.textContent = `$${producto.price}`;
        }
        div_precios.appendChild(precio);
        informacion.appendChild(div_precios);

        card.appendChild(informacion);

        const btn_agregar = document.createElement("button");
        btn_agregar.classList.add("agregar-card");
        btn_agregar.textContent = "Agregar";
        card.appendChild(btn_agregar);
        btn_agregar.addEventListener("click", () => {
            if (localStorage.getItem(`producto${producto.id}`) == null) {
                contadorCarrito.textContent = parseInt(contadorCarrito.textContent)+1;
                localStorage.setItem(`producto${producto.id}`, JSON.stringify(producto));
            }
        });

        cards.appendChild(card);

    });
};

const obtenerProductos = () => {
    return fetch("/productos")
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error("Error al obtener los productos:", error));
}

/*const traducir = async (texto) => {
    const URL = `/traducir?texto=${texto}`;
    try {
        const response = await fetch(URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return "";
    }
}*/

const traducir = async (textos) => {
    const URL = `/traducir?texto1=${textos[0]}&texto2=${textos[1]}&texto3=${textos[2]}`;
    try {
        const response = await fetch(URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

const obtenerDescuentos = async () => {
    try {
        const response = await fetch("/descuentos");
        const data = await response.json();
        return data;
    } catch (error) {
        return console.error("Error al obtener los descuentos:", error);
    }
}

crearCards();

    document.querySelector(".contador-carrito").textContent = Object.keys(localStorage).length;
