/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

    function isOffline() {
                     //  alert ('Su dispositivo móvil esta fuera de línea');
                       document.getElementById('net').className = 'estado no'; //pone la cruz roja de sin red
                       //carga los datos de evaporacion media segun tabla
                       hayRed=false;
                       
                   }
    function isOnline() {
        //    alert ('Su dispositivo móvil esta en línea');
            document.getElementById('net').className = 'estado ok'; //pone el tilde verde
            //parametriza los valores del GPS
            var options = {maximumAge: 3000, timeout: 10000, enableHighAccuracy:true};
            hayRed=true;
            //Accede a la geolocalizacion por GPS o Red
            navigator.geolocation.getCurrentPosition(onSuccessGPS, onErrorGPS, options);
           // buscardatosHistoricos();
        }
        
    function resultado(){
        document.getElementById('resul').innerHTML = document.getElementById('esta').selectedIndex;
    } 


     function seleccion(){
               // obtiene los datos seleccionados
                var e = document.getElementById("select-choice-a");
                var emaSeleccionada = e.options[e.selectedIndex].value;
                
                var tipoCultivo=getRadioValue('frutal');
                
                var tipoRiego=getRadioValue('tipoRiego');
                
                var epoca = document.getElementById("epoca").options[document.getElementById("epoca").selectedIndex].value;
                
                var PC=document.getElementById("cobertura").value;
                
                if (emaSeleccionada==='Estaciones Meteorológicas') {emaSeleccionada=0;}
                
                //imprime los valores elegidos
                
                //document.getElementById('estacionAuto').innerHTML = ema[emaSeleccionada][0];
                document.getElementById('tipoFrutal').innerHTML = culti[tipoCultivo];
                document.getElementById('estadoCultivo').innerHTML =  epoc[epoca];
                document.getElementById('porcentajeCob').innerHTML =kr[PC] ; 
                document.getElementById('tipoRiego').innerHTML = triego[tipoRiego];
                // adquiere los datos de la EMA seleccionada
                // 
                if (hayRed && !emaFS){ // si hay red busca losdatos en los archivos de las EMA
                             document.getElementById('estacionAuto').innerHTML = ema[emaSeleccionada][0];
                             buscardatosHistoricos(ema[emaSeleccionada][4]);     //obtiene los ultimos datos y mediaEva
                             ;
                    } else{
                               document.getElementById('estacionAuto').innerHTML = "No hay red - Se utilizan valores típicos";
                               //si no hay red calcular los datos de EPAN con las tablas
                                window.plugins.toast.showLongTop("Se utilizan valores estándar - Cambie de Estación Meteorológica") ;
                               var fechaActual = new Date();
                               var mes=fechaActual.getMonth();
                               mediaEva=epan[mes]*0.7;// 0.7 coeficiente del tanque Kp
                      }
                
                
            }
          function verDatosEMA(){
                var e = document.getElementById("select-choice-a");
                var emaSeleccionada = e.options[e.selectedIndex].value;
                if (emaSeleccionada==='Estaciones Meteorológicas') {emaSeleccionada=0;}
                buscardatosHistoricos(ema[emaSeleccionada][4]);
                publicarDatosEMA(emaSeleccionada);
          }  
          
          function publicarDatosEMA(emaSeleccionada){
                if (hayRed && !emaFS) {
                 document.getElementById('ema').innerHTML = ema[emaSeleccionada][0];
                 document.getElementById('date').innerHTML = fecha;
                 document.getElementById('hour').innerHTML = hora;
                 document.getElementById('temperatura').innerHTML = temperatura+" ºC";
                 document.getElementById('humedad').innerHTML = humedad+" %"; 
                 document.getElementById('presion').innerHTML = presion+" hPa";
                 document.getElementById('viento').innerHTML = viento+" km/h";
                 document.getElementById('lluvia').innerHTML = lluvia+" mm";
                 document.getElementById('evaporacion').innerHTML = mediaEva;
                } else {
                     document.getElementById('ema').innerHTML = ema[emaSeleccionada][0];
                     document.getElementById('date').innerHTML = "&nbsp";
                     document.getElementById('hour').innerHTML = "&nbsp";
                     document.getElementById('temperatura').innerHTML = "s/dato";
                     document.getElementById('humedad').innerHTML = "s/dato"; 
                     document.getElementById('presion').innerHTML ="s/dato";
                     document.getElementById('viento').innerHTML = "s/dato";
                     document.getElementById('lluvia').innerHTML = "s/dato";
                     document.getElementById('evaporacion').innerHTML = "s/dato";
                } 
                 //document.getElementById('resultados').style.display = 'block';
               //  document.getElementById('resultados').innerHTML = 'Hora: '+hora+'<br>Temp.: ' + temperatura +
               //      'ºC <br/>Humed: ' + humedad + '%<br/>Viento: ' + viento + 'km/h<br/> Lluvia: ' + lluvia + 'mm<br/>Media Evap:'+mediaEva;
             return true;  
         }

          
          
            function getRadioValue(groupName) {
                var _result;
                try {
                    var o_radio_group = document.getElementsByName(groupName);
                    for (var a = 0; a < o_radio_group.length; a++) {
                        if (o_radio_group[a].checked) {
                            _result = o_radio_group[a].value;
                            break;
                        }
                    }
                } catch (e) { }
                return _result;
            }

