let claves = Object.keys(localStorage);
let compras = {
    detalleCompra: []
};


if (claves.length === 0) {
    const titulo_compras = document.querySelector(".titulo-compras");
    const p_aviso = document.createElement("p");
    p_aviso.classList.add("p-aviso");
    p_aviso.textContent = "No tienes productos en tu carrito. Al menos agrega uno para continuar con la compra.";
    p_aviso.style.fontSize = "20px";
    p_aviso.style.paddingTop = "40px";
    titulo_compras.appendChild(p_aviso);
    const boton_compra = document.querySelector(".boton-compra");
    boton_compra.style.display = "none";
    const monto_total = document.querySelector(".monto-total");
    monto_total.style.display = "none";
}

claves.forEach(clave => {
    const producto = JSON.parse(localStorage.getItem(clave));

    const detalleCompra = {
        producto: producto,
        cantidad: 1,
        precioTotal: producto.price
    }

    const div_compras = document.querySelector(".div-compras");

    const card_compra = document.createElement("div");
    card_compra.classList.add("card-compra")

    const card_compra_img = document.createElement("div");
    card_compra_img.classList.add("card-compra-img");
    const img = document.createElement("img");
    img.src = producto.image;
    img.width = "120";
    img.height = "140";
    img.alt = "Imagen del producto";
    card_compra_img.appendChild(img);
    card_compra.appendChild(card_compra_img);

    const card_compra_info = document.createElement("div");
    card_compra_info.classList.add("card-compra-info");
    const categoria = document.createElement("p");
    categoria.textContent = producto.category;
    const titulo = document.createElement("p");
    titulo.textContent = producto.title;
    card_compra_info.appendChild(categoria);
    card_compra_info.appendChild(titulo);
    card_compra.appendChild(card_compra_info);

    const card_compra_precio = document.createElement("div");
    card_compra_precio.classList.add("card-compra-precio");
    const precio = document.createElement("p");
    precio.textContent = `$${producto.price}`;
    card_compra_precio.appendChild(precio);
    card_compra.appendChild(card_compra_precio);

    const card_compra_actualizar = document.createElement("div");
    card_compra_actualizar.classList.add("card-compra-actualizar");
    const card_compra_contadorStock = document.createElement("div");
    card_compra_contadorStock.classList.add("card-compra-contadorStock");
    const card_compra_operaciones = document.createElement("div");
    card_compra_operaciones.classList.add("card-compra-operaciones");
    const boton_mas = document.createElement("button");
    boton_mas.textContent = "+";
    const boton_menos = document.createElement("button");
    boton_menos.textContent = "-";
    card_compra_operaciones.appendChild(boton_mas);
    card_compra_operaciones.appendChild(boton_menos);
    const p_contador = document.createElement("p");
    p_contador.classList.add("card-compra-contador");
    p_contador.textContent = "1";
    card_compra_contadorStock.appendChild(card_compra_operaciones);
    card_compra_contadorStock.appendChild(p_contador);
    card_compra_actualizar.appendChild(card_compra_contadorStock);
    const div_comun = document.createElement("div");
    const img_borrar = document.createElement("img");
    img_borrar.src = "../img/eliminar.webp";
    img_borrar.alt = "Borrar";
    img_borrar.classList.add("card-compra-borrar");
    div_comun.appendChild(img_borrar);
    card_compra_actualizar.appendChild(div_comun);

    card_compra.appendChild(card_compra_actualizar);

    div_compras.appendChild(card_compra)

    const monto_total_precio = document.querySelector(".monto-total-precio");
    monto_total_precio.textContent = (parseFloat(monto_total_precio.textContent) + producto.price).toFixed(2);

    boton_mas.addEventListener("click", () => {
        if (p_contador.textContent === "20") {
            return;
        }
        detalleCompra.cantidad++;
        monto_total_precio.textContent = (parseFloat(monto_total_precio.textContent) + producto.price).toFixed(2);
        p_contador.textContent = parseInt(p_contador.textContent) + 1;
        precio_float = parseFloat(precio.textContent.replace("$", ""));
        detalleCompra.precioTotal = (precio_float + producto.price).toFixed(2);
        precio.textContent = "$" + (precio_float + producto.price).toFixed(2);
    });

    boton_menos.addEventListener("click", () => {
        if (p_contador.textContent === "1") {
            return;
        }
        detalleCompra.cantidad--;
        monto_total_precio.textContent = (parseFloat(monto_total_precio.textContent) - producto.price).toFixed(2);
        p_contador.textContent = parseInt(p_contador.textContent) - 1;
        precio_float = parseFloat(precio.textContent.replace("$", ""));
        detalleCompra.precioTotal = (precio_float - producto.price).toFixed(2);
        precio.textContent = "$" + (precio_float - producto.price).toFixed(2);
    });

    img_borrar.addEventListener("click", () => {
        monto_total_precio.textContent = (parseFloat(monto_total_precio.textContent) - parseFloat(precio.textContent.replace("$", ""))).toFixed(2);
        localStorage.removeItem(clave);
        card_compra.remove();
        compras.detalleCompra = compras.detalleCompra.filter(detalle => detalle.producto.id !== producto.id);

        if (Object.keys(localStorage).length === 0) {
            const boton_compra = document.querySelector(".boton-compra")
            boton_compra.style.display = "none";
            const monto_total = document.querySelector(".monto-total");
            monto_total.style.display = "none";
        }
    });

    compras.detalleCompra.push(detalleCompra);
});


const boton_compra = document.querySelector(".boton-compra");
boton_compra.addEventListener("click", () => {
    compras.fecha = new Date();
    compras.montoTotal = document.querySelector(".monto-total-precio").textContent;
    console.log(compras);
    fetch("http://localhost:3000/compras", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(compras) })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al enviar la solicitud");
            }
            return response.json();
        })
        .then(data => {

            claves.forEach(clave => localStorage.removeItem(clave));

            alert("Compra realizada exitosamente.");

            window.location.href = "/index.html";
        })
        .catch(error => {
            console.error("Error: ", error);
        });
});