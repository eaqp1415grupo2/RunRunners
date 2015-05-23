

$("#postRaceBtn").click(function () {
    if($('#name').val() == ""){
        window.alert("Debes proporcionar un nombre");
    }else if ($('#level').val()== "" ){
        window.alert("Debes proporcionar un Nivel: Begginer, Initiated, Professional");
    }
    else if ($('#distance').val()== "" || isNaN($('#distance').val())){
        window.alert("Debes proporcionar una distancia y que sea un numero");
    }
    else if ($('#date').val()== ""){
        window.alert("Debes proporcionar una Fecha");
    }else if ($('#type').val()== ""){
        window.alert("Debes proporcionar una modalidad de Carrera");
    }else{
    postRace();}
});

// Post Race
function postRace() {

        var name = $("#name").val();
        var level = $("#level").val();
        var distance = $("#distance").val();
        var date = $("#date").val();
        var type = $("#type").val();

        var race = new Object();
        race.Name = name;
        race.Level = level;
        race.Distance = distance;
        race.Date = date;
        race.Type = type;

        var data = JSON.stringify(race);
        console.log(data);
        $.ajax({
            url: "http://localhost:5000/race",
            type: 'POST',
            crossDomain: true,
            dataType: 'json',
            contentType: 'application/json',
            data: data,
            success: function (data) {
                window.alert("Carrera creada");
            },
            error: function () {
                window.alert("FAIL: No se han cargado las Carreras");
            }
        });

}