$(document).ready(function () {
    $(".pop-up").hide();
    $(".btnReintentar").click(function () {
        $(".pop-up").hide();
        reiniciar();
        iniciarTablero();
        iniciarMatriz();
    });
    iniciarTablero();
    iniciarMatriz();
    cambiarDificultad();
    volumen();
});

var color;
var matrizDatos;
var matrizEstados;
var cantFilas;
var cantColum;
var cantMinas;
var casillasFaltantes;
var vol = true;
var juego = true;

function volumen() {
    $("#vol").click(function () {
        if (vol) {
            $("#vol").attr("src", "../img/volumen-desactivado.png");
            vol = false;
        } else {
            $("#vol").attr("src", "../img/volumen-activo.png");
            vol = true;
        }
    });
}

var banderas = 0;
var tiempo = true;
function detalles() {
    $(".fila:even p:even").css("background-color", "#a2d149");
    $(".fila:even p:odd").css("background-color", "#aad751");
    $(".fila:odd p:odd").css("background-color", "#a2d149");
    $(".fila:odd p:even").css("background-color", "#aad751");

    $("p").hover(function () {
        color = $(this).css("background-color");
        $(this).click(function () {
            if (tiempo && juego) {
                tiempo = false;
                moverCronometro();
            }
            if (matrizEstados[posicionFila($(this).attr("id"))][posicionColum($(this).attr("id"))] == 0) {
                validar(posicionFila($(this).attr("id")), posicionColum($(this).attr("id")));
                color = $(this).css("background-color");
            }
            $(this).css("background-color", "#E1CBB4");
        });

        $(this).mousedown(function (e) {
            if (e.which == 3) {
                if (tiempo && juego) {
                    tiempo = false;
                    moverCronometro();
                }
                if (matrizEstados[posicionFila($(this).attr("id"))][posicionColum($(this).attr("id"))] == 0) {
                    if (banderas < cantMinas) {
                        matrizEstados[posicionFila($(this).attr("id"))][posicionColum($(this).attr("id"))] = 2;
                        $("#" + posicionFila($(this).attr("id")) + "-" + posicionColum($(this).attr("id"))).append('<i class="fas fa-flag bandera" id="bandera"></i>');
                        banderas++;
                        $("#banderasPorColocar").text(eval(cantMinas - banderas));
                    }
                } else if (matrizEstados[posicionFila($(this).attr("id"))][posicionColum($(this).attr("id"))] == 2) {
                    matrizEstados[posicionFila($(this).attr("id"))][posicionColum($(this).attr("id"))] = 0;
                    $("#" + posicionFila($(this).attr("id")) + "-" + posicionColum($(this).attr("id"))).empty();
                    banderas--;
                    $("#banderasPorColocar").text(eval(cantMinas - banderas));
                }
                console.log(banderas);
                console.log("estado: " + matrizEstados[posicionFila($(this).attr("id"))][posicionColum($(this).attr("id"))]);
            }
        });


        if (matrizEstados[posicionFila($(this).attr("id"))][posicionColum($(this).attr("id"))] == 1) {
            $(this).css("background-color", "#E1CBB4");
        } else {
            $(this).css("background-color", "#bee17d");
        }
    },
        function () {
            $(this).css("background-color", color);
        });
}

function iniciarTablero() {
    cantFilas = $(":root").css("--cantFilas");
    cantColum = $(":root").css("--cantColum");
    cantMinas = $(":root").css("--cantMinas");
    casillasFaltantes = eval(cantColum * cantFilas - cantMinas);

    for (let i = 0; i < cantFilas; i++) {
        $(".tablero").append("<div class = 'fila' id = '" + i + "'></div>");
        for (let j = 0; j < cantColum; j++) {
            $("#" + i).append("<p id = '" + i + "-" + j + "'></p>");
        }
    }

    detalles();
}

function iniciarMatriz() {
    matrizEstados = new Array();
    matrizDatos = new Array();
    for (let i = 0; i < cantFilas; i++) {
        matrizEstados[i] = new Array();
        matrizDatos[i] = new Array();
        for (let j = 0; j < cantColum; j++) {
            matrizEstados[i][j] = 0;
            matrizDatos[i][j] = 0;
        }
    }
    colocarMinas();
}

function colocarMinas() {
    let i = 0;
    let colum;
    let fila;

    do {
        fila = Math.floor(Math.random() * (cantFilas));
        colum = Math.floor(Math.random() * (cantColum));

        if (matrizDatos[fila][colum] == 0) {
            matrizDatos[fila][colum] = "X";
            i++;
        }
    } while (i < cantMinas)

    for (i = 0; i < cantFilas; i++) {
        for (let j = 0; j < cantColum; j++) {
            if (matrizDatos[i][j] == "X") {
                for (let k = -1; k <= 1; k++) {
                    for (let l = -1; l <= 1; l++) {
                        if (k == 0 && l == 0) {
                            continue;
                        }
                        let f = eval(parseInt(i) + parseInt(k));
                        let c = eval(parseInt(j) + parseInt(l));
                        if (f < 0 || c < 0 || f > cantFilas - 1 || c > cantColum - 1) {
                            continue;
                        }

                        if (matrizDatos[f][c] != "X") {
                            matrizDatos[f][c]++;
                        }
                    }
                }
            }
        }
    }
}

function posicionColum(id) {
    for (let i = id.length; i > 0; i--) {
        if (id.substring(i - 1, i) == "-") {
            return id.substring(i, id.length);
        }
    }
}

function posicionFila(id) {
    for (let i = 0, j = id.length - 1; i < j; i++) {
        if (id.substring(i, i + 1) == "-") {
            return id.substring(0, i);
        }
    }
}

function validar(posFila, posColum) {
    if (matrizEstados[posFila][posColum] == 0) {
        if (matrizDatos[posFila][posColum] == 0) {
            ceros(posFila, posColum);
        } else {
            if (matrizDatos[posFila][posColum] == "X") {
                juegoPerdido();
            } else {
                mostrar(posFila, posColum);
            }
        }
    }
}

function mostrar(posFila, posColum, color = 0) {
    if (color == 0) {
        if ((posFila % 2 == 0 && posColum % 2 == 0) || (posFila % 2 != 0 && posColum % 2 != 0)) {
            $("#" + posFila + "-" + posColum).fadeOut(100).css("background-color", "#D7B899").fadeIn(100);
        } else {
            $("#" + posFila + "-" + posColum).fadeOut(100).css("background-color", "#E4C29F").fadeIn(100);
        }
    } else {
        if (matrizDatos[posFila][posColum] == "X") {
            $("#" + posFila + "-" + posColum).fadeOut(100).css("background-color", color).fadeIn(100);
        }
    }

    if (matrizDatos[posFila][posColum] != 0) {
        if (matrizDatos[posFila][posColum] == "X") {
            $("#" + posFila + "-" + posColum).append('<div class="mina"><i class="fas fa-bomb"></i></div>');
        } else {
            if (color == 0) {
                switch (matrizDatos[posFila][posColum]) {
                    case 1:
                        $("#" + posFila + "-" + posColum).css("color","#1976d2");
                        break
                    case 2:
                        $("#" + posFila + "-" + posColum).css("color","#388e3c");
                        break;
                    case 3:
                        $("#" + posFila + "-" + posColum).css("color","#d32f2f");
                        break;
                    case 4:
                        $("#" + posFila + "-" + posColum).css("color","#8632a1");
                        break;
                    case 5:
                        $("#" + posFila + "-" + posColum).css("color","#f5830e");
                        break;
                    case 6:
                        $("#" + posFila + "-" + posColum).css("color","#48e6f4");
                        break;
                    case 7:
                        $("#" + posFila + "-" + posColum).css("color","#e7b913");
                        break;
                    case 8:
                        $("#" + posFila + "-" + posColum).css("color","#dd5b9f");
                        break;
                }
                $("#" + posFila + "-" + posColum).css("font-weight","bold");
                $("#" + posFila + "-" + posColum).text(matrizDatos[posFila][posColum]);
            }
        }
    }
    matrizEstados[posFila][posColum] = 1;
    casillasFaltantes--;
    if (casillasFaltantes < 1) {
        if (!juego) {
            juegoPerdido
        } else {
            juegoGanado();
        }
    }
}

function ceros(i, j) {
    for (let k = -1; k <= 1; k++) {
        for (let l = -1; l <= 1; l++) {
            if (k == 0 && l == 0) {
                continue;
            }
            let f = eval(parseInt(i) + parseInt(k));
            let c = eval(parseInt(j) + parseInt(l));
            if (f < 0 || c < 0 || f > cantFilas - 1 || c > cantColum - 1) {
                continue;
            }
            if (matrizEstados[f][c] == 2) {
                matrizEstados[f][c] = 0;
                $("#" + f + "-" + c).empty();
            }
            if (matrizEstados[f][c] == 0) {
                mostrar(f, c);
                if (matrizDatos[f][c] == 0) {
                    ceros(f, c);
                }
            }
        }
    }
}

function juegoPerdido() {
    $(".contenedor").css("background-color", "red");
    tiempo = true;
    juego = false;
    $(".pop-up").show();
    $("#time").text("---");
    for (let i = 0; i < cantFilas; i++) {
        for (let j = 0; j < cantColum; j++) {
            mostrar(i, j, "#ff0000");
        }
    }
}

let record = 1000;
function juegoGanado() {
    let flag = false;
    tiempo = true;
    juego = false;
    $(".pop-up").show();
    $("#time").text(str_segundo);
    if (eval(str_segundo) < record) {
        record = str_segundo;
        $("#record").text(record);
    }
}

function cambiarDificultad() {
    $("#selectDificultad").change(function () {
        let dificultad = $('select[id=selectDificultad]').val();
        if (dificultad == 'facil') {
            $(":root").css("--anchoContenedor", '450px');
            $(":root").css("--altoContenedor", '430px');
            $(":root").css("--anchoCasilla", '45px');
            $(":root").css("--altoCasilla", '45px');
            $(":root").css("--cantFilas", 8);
            $(":root").css("--cantColum", 10);
            $(":root").css("--cantMinas", 10);
            $(":root").css("--tamText", "30px");
            $("#banderasPorColocar").text("10");
        } else if (dificultad == 'medio') {
            $(":root").css("--anchoContenedor", '540px');
            $(":root").css("--altoContenedor", '490px');
            $(":root").css("--anchoCasilla", '30px');
            $(":root").css("--altoCasilla", '30px');
            $(":root").css("--cantFilas", 14);
            $(":root").css("--cantColum", 18);
            $(":root").css("--cantMinas", 40);
            $(":root").css("--tamText", "22px");
            $("#banderasPorColocar").text("40");
        } else if (dificultad == 'dificil') {
            $(":root").css("--anchoContenedor", '672px');
            $(":root").css("--altoContenedor", '630px');
            $(":root").css("--anchoCasilla", '28px');
            $(":root").css("--altoCasilla", '28px');
            $(":root").css("--cantFilas", 20);
            $(":root").css("--cantColum", 24);
            $(":root").css("--cantMinas", 99);
            $(":root").css("--tamText", "20px");
            $("#banderasPorColocar").text("99");
        }
        reiniciar();
        iniciarTablero();
        iniciarMatriz();
    });
}

function reiniciar() {
    matrizDatos = undefined;
    matrizEstados = undefined;
    $(".contenedor").css("background-color", "#eeeeee");
    $(".tablero").empty();
    str_segundo = new String("000");
    segundo = 0;
    $("#cronometro").text(str_segundo);
    tiempo = true;
    juego = true;
    banderas = 0;
}

var str_segundo = new String("000");
var segundo = 0;
function moverCronometro() {
    str_segundo = "00" + segundo;
    console.log(tiempo);
    if (str_segundo.length == 4) {
        str_segundo = str_segundo.substring(1, 4);
    }
    if (str_segundo.length == 5) {
        str_segundo = str_segundo.substring(2, 5);
    }
    segundo++
    if (juego) {
        $("#cronometro").text(str_segundo);
    }
    if (segundo < 1000 && !tiempo) {
        setTimeout("moverCronometro()", 1000);
    }
}