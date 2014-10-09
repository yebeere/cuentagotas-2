/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var humedad;
var temperatura;
var viento;
var presion;
var lluvia;
var fecha;
var hora;
var dia;
var mes;
var anio;
var ho;
var mi;
var mediaEva;


function llamar(url) {
    var xmlhttp = new XMLHttpRequest();
    //url = 'wap.htm';
    console.log(url);

    xmlhttp.open('GET', url, false);
    xmlhttp.setRequestHeader('Cache-Control', 'no-cache');
    xmlhttp.setRequestHeader('Pragma', 'no-cache');
    xmlhttp.send();
    //alert('envio'+xmlhttp.responseText);
    //document.getElementById("contenido").innerHTML = xmlhttp.responseText
    contenido = xmlhttp.responseText;

    return contenido;
}


function parser(contenido) {
    ini = contenido.indexOf("T:");
    temperatura = contenido.slice(ini + 7, ini + 30);
    ini = temperatura.indexOf('</font>');
    temperatura = parseFloat(temperatura.slice(0, ini - 3));
    //alert ('Temperatura:'+temperatura);

    ini = contenido.indexOf("H:");
    humedad = contenido.slice(ini + 7, ini + 30);
    ini = humedad.indexOf('</font>');
    humedad = parseFloat(humedad.slice(0, ini - 2));
    //alert ('Humedad:'+humedad);

    ini = contenido.indexOf("V:");
    viento = contenido.slice(ini + 11, ini + 30);
    ini = viento.indexOf('</font>');
    viento = parseFloat(viento.slice(0, ini - 5));
    //alert ('Viento:'+viento);

    ini = contenido.indexOf("Lluvia:");
    lluvia = contenido.slice(ini + 12, ini + 30);
    ini = lluvia.indexOf('</font>');
    lluvia = parseFloat(lluvia.slice(0, ini - 3));
    //alert ('Lluvia:'+lluvia);
    //forzar por humedad
    //humedad=90;
}


function buscardatosHistoricos(ema) {
    //http://anterior.inta.gov.ar/altovalle/met/downld02.txt
    //parseHistorico(llamar('http://anterior.inta.gov.ar/altovalle/met/downld02.txt'));
    parserHistorico(llamar(ema));
    if (comparaFecha(dia,mes,anio,ho,mi)){
        // la EMA esta dentro de las 4 hs
        emaFS=false;
    } else {
        window.plugins.toast.showLongCenter("La Estación Meteorológica Automática esta Fuera de Servicio");
        emaFS=true;
    }
    

    return true;
}

function comparaFecha(dd,mm,aa,hh,min){
    var fechaActual = new Date(); 
    var diferencia=new Date();
    aa=aa+2000;
    mm=mm-1;
    var fechaFin = new Date(aa,mm,dd,hh,min);
   // var fechaFin = mm + "/" + dd + "/" + aa;
    var diferencia= fechaActual.getTime() - fechaFin.getTime();
    var difHoras = Math.floor(diferencia / (1000 * 60 * 60 )); 
    var texto="FA:"+fechaActual+'\nFF:'+fechaFin+'\nDif:'+difHoras;
   // alert (texto);
    if(difHoras<4){ 
                  //alert("paso >3");
                  return true;                 
         } else {  //window.plugins.toast.showLongCenter("La Estación Meteorológica Automática esta Fuera de Servicio");
                 return false;}
      }


function mediaEvapo24hs(filas,nroFilas){
  //  alert("NroFila:"+nroFilas);
   if (nroFilas>144){
       var media=0;
       var inicio=nroFilas-144+1;
       //alert ("Inicio="+inicio);
       for (var j=inicio;j<(nroFilas+1);j++){
           ultima=parserHistoricolinea(filas, j);
           //if (j==inicio){alert("Inicio:"+ultima[0]+"  "+ultima[1])}
           //if (j==nroFilas){alert("Final:"+ultima[0]+"  "+ultima[1])}
           media=parseFloat(media+parseFloat(ultima[6]));
           
         //  alert("i:"+j+" Ult="+ultima[6]+"\n media:"+media);
       }
       
       media=media/144;
       //alert("j:"+cant+"  media:"+media);
       return media;
   } 
}


function parserHistoricolinea(filas, numero) { //Rotorna la linea parseada en un arreglo
    ultimaconblancos = filas[numero].split(' ');
    //console.log(ultimaconblancos);
    //console.log(ultimaconblancos.length);
    ultima = new Array();
    for (i = 0; i < ultimaconblancos.length; i++) {
        //console.log(ultimaconblancos[i]);
        if (ultimaconblancos[i] !=='') {
            ultima.push(ultimaconblancos[i]);
        }
    }
    //console.log(ultima);
    return ultima;
}

function parserHistorico(contenido) {
    filas = contenido.split('\n');
    //console.log(filas);
    //console.log(filas.length);
    
   // alert("long:"+filas.length);
    if(filas.length<25){
        return true;
    }
    numerofila = filas.length - 2;
    ultima = parserHistoricolinea(filas, numerofila);
    mediaEva=mediaEvapo24hs(filas,numerofila);
    fecha=ultima[0];
    if (fecha.length===7){ 
                dia=parseInt(fecha.substr(0, 1),10);
                mes=parseInt(fecha.substr(2, 2),10);
                anio=parseInt(fecha.substr(5, 2),10);
       } else {
                dia=parseInt(fecha.substr(0, 2),10);
                mes=parseInt(fecha.substr(3, 2),10);
                anio=parseInt(fecha.substr(6, 2),10);
       } 
   // alert("d="+dia+" m="+mes+" ano="+anio);
    hora=ultima[1];
    ho=parseInt(hora.substr(0, 2),10);
    mi=parseInt(hora.substr(3, 2),10);
    temperatura = parseFloat(ultima[2]);
    humedad = parseFloat(ultima[5]);
    viento = parseFloat(ultima[10]);
    presion = parseFloat(ultima[16]);
    lluvia = parseFloat(ultima[17])*100;
    for (j = 1; j < 18; j++) {
        ultima = parserHistoricolinea(filas, numerofila - j);
        //console.log(ultima[17]);
        lluvia += parseFloat(ultima[17])*100;
    }

    lluvia = lluvia/100;
}


