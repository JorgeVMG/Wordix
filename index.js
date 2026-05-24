function crearLocal() {
    const palabrasDivinar = {
        "4": ["casa","mesa","gato","luna","pato"],
        "5": ["perro","nubes","playa","raton","fruta"],
        "6": ["camino","puerta","escoba","bosque","correr"],
        "7": ["ventana","pelotas","caballo","montaña","escuela"]
    };
    localStorage.setItem("palabrasDivinar", JSON.stringify(palabrasDivinar));
    const palabras = [];
    localStorage.setItem("palabrasGuardadas", JSON.stringify(palabras));
    const palabraAlateria = "";
    localStorage.setItem("palabraAlatoria", palabraAlateria);
}
window.addEventListener("load", function () {
    crearLocal();
});
function inicio() {
    const cantLetras = document.querySelector('input[name="cantLetras"]:checked');
    const inicio = document.getElementById("inicio");
    if (cantLetras) {
        inicio.style.display = "none";
        agregarCuadros(cantLetras.value);
        const arrayPalabras = JSON.parse(localStorage.getItem("palabrasDivinar"));
        const indiceAlateorio = Math.floor(Math.random()* arrayPalabras[cantLetras.value].length)
        const palabraAlateria = arrayPalabras[cantLetras.value][indiceAlateorio];
        localStorage.setItem("palabraAlatoria", palabraAlateria);
    } else {
        alert("nada");
    }
}
function agregarCuadros(cantLetras) {
    let cuadro = document.getElementById("cuadros");
    for (let i = 0; i < 5; i++) {
        cuadro.innerHTML += "<div id='fila" + (i + 1) + "' class='fila'>" + cuadroLetra(cantLetras) + "</div>"
    }
}

function cuadroLetra(cantLetras) {
    let fila = "";
    for (let i = 0; i < cantLetras; i++) {
        fila += "<div id='cuadro" + (i + 1) + "' class='cuadroLetra'>-</div>"
    }
    return fila;
}
//-------------------------------------------------------------------------------
function jugar() {
    const input = document.getElementById("palabra_ingresada");
    const cantLetras = document.querySelector('input[name="cantLetras"]:checked').value;
    const palabra = input.value;
    if (palabra.length !== Number(cantLetras)) {
        input.style.border = "1px solid red";
    } else {
        reyenarPalabra();
    }
}
function arregloCuadro() {
    const arregloPalabras = JSON.parse(localStorage.getItem("palabrasGuardadas"));
    const fila = document.getElementById("fila" + (arregloPalabras.length + 1));
    return fila;
}
function reyenarPalabra() {
    const input = document.getElementById("palabra_ingresada");
    const palabra = input.value;
    input.value = "";
    const ingresarResultado = document.getElementById("respuesta");
    const fila = arregloCuadro();
    const respuestaJuego = compararPalabra(palabra);
    guardarLocal(palabra);
    for (let i = 0; i < palabra.length; i++) {
        let cuadro = fila.querySelector("#cuadro" + (i + 1));
        cuadro.innerHTML = palabra[i];
        if(respuestaJuego[0].respuesta){
            cuadro.style.background = "rgb(90, 219, 90)";
        }else{
            cuadro.style.background = respuestaJuego[1].respuestaLetras[i].color;
        }
    }
    if(respuestaJuego[0].respuesta){
        respuesta(true, palabra);
        terminarJuego();
        return;
    }
    const siguienteFila = arregloCuadro();
    if(siguienteFila === null){
        respuesta(false,localStorage.getItem("palabraAlatoria"));
        terminarJuego();
    }
}
function terminarJuego(){
    const input = document.getElementById("palabra_ingresada");
    const boton = document.getElementById("jugar");
    input.disabled = true;
    boton.disabled = true;
}
function guardarLocal(palabra) {
    let arregloPalabra = JSON.parse(localStorage.getItem("palabrasGuardadas")) || [];
    arregloPalabra.push(palabra);
    localStorage.setItem("palabrasGuardadas", JSON.stringify(arregloPalabra));
}
function compararPalabra(palabra){
    const palabraAAdivinar = localStorage.getItem("palabraAlatoria");
    let retorno = [{respuesta:true}]
    if(palabraAAdivinar !== palabra){
        retorno = [{respuesta:false},{respuestaLetras:letrasCorrectas(palabraAAdivinar,palabra)}];
    }
    return retorno;
}
function letrasCorrectas(palabraA,palabraB) {
    let letras = [];
    let palabraNueva = palabraA;
    for(let i = 0; i<palabraA.length;i++){
        if(palabraA[i]===palabraB[i]){
            letras.push({numletra:i,color:"green"});
            palabraNueva = eliminarLetra(palabraNueva,i);
        }
    }
    for(let j = 0; j<palabraB.length;j++){
        const posicion = buscarLetra(palabraB[j],palabraNueva)
        if(posicion === null){
            letras.push({numletra:j,color:"gray"});
        }else{
            letras.push({numletra:j,color:"yellow"});
            palabraNueva = eliminarLetra(palabraNueva,posicion);
        }
    }
    letras = arreglarArregloLetras(letras);
    letras.sort((a, b) => a.numletra - b.numletra);
    return letras;
}// g a t o / A A A A
function buscarLetra(letra,palabra){
    let posicion = null;
    for(let i = 0;i<palabra.length;i++){
        if(letra === palabra[i]){
            posicion = i;
            break;
        }
    }
    return posicion;
}
function eliminarLetra(palabra,posicion){
    const letras = palabra.split("");
    letras[posicion] = "-";
    const nuevaPalabra = letras.join("");
    return nuevaPalabra;
}
function arreglarArregloLetras(letras){
    const resultado = [];
    for(let i = 0; i < letras.length; i++){
        const existe = resultado.some(item => item.numletra === letras[i].numletra);
        if(!existe){
            resultado.push(letras[i]);
        }
    }
    return resultado;
}
function respuesta(resultado,palabra){
    const cuadro = document.getElementById("finJuego");
    cuadro.style.display = "block";
    const ingresarResultado =document.getElementById("respuesta");
    let finJuego ="<h1 class='ganador'>¡¡Felicidades Ganaste!!</h1><h3>Has adivinado la palabra : "+ palabra +"</h3>"+
        "<button onclick='reiniciarJuego()'>Reiniciar</button>";
    if(!resultado){
        finJuego ="<h1 class='perdedor'>Perdiste</h1><h3>No has adivinado la palabra : "+ palabra +"</h3>"+
            "<button onclick='reiniciarJuego()'>Reiniciar</button>"
    }
    ingresarResultado.innerHTML = finJuego;
}
function reiniciarJuego(){
    location.reload();
}
//----------------------------------------------------------------------------
