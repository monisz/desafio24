const socket = io();

//Mensajes
const dateNow = new Date();

const sendMessage = () => {
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const lastName = document.getElementById("lastName").value;
    const age = document.getElementById("age").value;
    const alias = document.getElementById("alias").value;
    const avatar = document.getElementById("avatar").value;
    const date = dateNow.toLocaleString();
    const text = document.getElementById("text").value;
    const message = { 
        author: {
            email, name, lastName, age, alias, avatar
            },
            date, 
            text};
    console.log(message)
    socket.emit("newMessage", message);
    return false;
};


const showMessage = (message) => {
    const { author, date, text } = message;
    return `
        <div style="display:flex">
        <p>
            <strong style="color:blue">${author.email}</strong> 
            <span style="color:brown"> [${date}] </span>
            <i style="color:green"> : ${text}</i>
            <i><img src="${author.avatar}" height="50rem"></i>
            </p>
        </div>
    `;
};

const addMessage = (messagesNorm) => {
    const desnormalizedMessages = normalizr.denormalize(messagesNorm.result, messagesSchema, messagesNorm.entities);
    const allMessages = desnormalizedMessages.messages.map(message => showMessage(message)).join(" ");
    document.getElementById("messages").innerHTML = allMessages;
    document.getElementById("text").value = '';
    //Compression
    const longNorm = JSON.stringify(messagesNorm).length;
    const longDesNorm = JSON.stringify(desnormalizedMessages).length;
    console.log("norm", longNorm)
    console.log("desnorm", longDesNorm)
    const percCompression = Math.round(longNorm*100/longDesNorm);
    console.log(percCompression)
    document.getElementById("percent").innerHTML = percCompression;
};

socket.on('messages', (messagesNorm) => {
    addMessage(messagesNorm);
});

//Schema normalizer
const authorSchema = new normalizr.schema.Entity('authors', {}, {idAttribute: 'email'});
const messageSchema = new normalizr.schema.Entity('message', { 
    author: authorSchema
});
const messagesSchema = new normalizr.schema.Entity('messages', {
    messages: [ messageSchema ]
});



//Productos
const sendProduct = () => {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const code = document.getElementById("code").value;
    const thumbnail = document.getElementById("thumbnail").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const timestamp  = Date.now();
    const product = { title, description, code, thumbnail, price, stock, timestamp };
    socket.emit("newProduct", product);
    return false;
};

const showProduct = (product) => {
    const { title, price, thumbnail } = product;
    return `
        <tr>
            <td>${title}</td>
            <td>${price}</td>
            <td><img src="${thumbnail}" height="50rem"></td>
        </tr>
    `;
};

const addProduct = (products) => {
    if (products.length == 0)
        document.getElementById("titles").innerHTML = `
            <h3 style="background-color:aquamarine; color:black">No se encontraron productos</h3><br>
        `;
    else {
        document.getElementById("titles").innerHTML = `
            <th>Nombre</th>
            <th>Precio</th>
            <th>Foto</th>
        `;
        const allProducts = products.map(product => showProduct(product)).join(" ");
        document.getElementById("listProducts").innerHTML = allProducts;
        document.getElementById("title").value = '';
        document.getElementById("price").value = '';
        document.getElementById("thumbnail").value = '';
    }      
};

socket.on('products', (allProducts) => {
    addProduct(allProducts);
});

//Login
/* const showUser = (userName) => { */
/*     console.log("está en showUser") */
/*     document.getElementById("userLog").innerHTML = ` */
/*         <h2 style="color:green">Bienvenido  */
/*          */
/*         </h2> */
/*     `; */
/* }; */
/*  */
/* socket.on('user', (userName) => {  */
/*     if(user) { */
/*         document.getElementById("userLog").innerHTML = ` */
/*         <div class="col-sm-10"> */
/*         <h2 style="color:green" id="l">Bienvenido ${userName}</h2> */
/*       </div> */
/*       <div class="col-auto"> */
/*         <button type="submit" class="btn btn-warning" id="logout">Desloguear</button> */
/*       </div> */
/*         `; */
/*         document.getElementById('logout').addEventListener('click',() => { */
/*             window.location.assign('logout'); */
/*         }) */
/*     } else { */
/*         window.location.assign('logout'); */
/*     } */
/* }); */

//Logout

/* const logout = (userName) => { */
/*     console.log("en logout", "userName", userName) */
/*     document.getElementById("logout").innerHTML = ` */
/*         <h2 style="color:blue">Hasta luego ${userName}</h2 >*/
/*     ` */
    /* setTimeout(() => { */
    /*     console.log("en settimeout") */
    /*    socket.emit() */
    /* }, 2000); */
/* } */

/* const logout = () => { */
/*     socket.emit("logout", ) */
/* } */

const logout = () => {
    console.log("estoy en logout fx")
    /* return false; */
}