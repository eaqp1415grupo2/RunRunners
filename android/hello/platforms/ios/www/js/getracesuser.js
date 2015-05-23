/**
 * Created by david on 22/05/2015.
 */
$("#pendientes").click(function () {

    getRacePending();
});
$("#hechas").click(function () {

    getRaceDone();
});
$("#start").click(function () {
    window.location.href = "StartRace.html"
});
function change(){window.location.href = "StartRace.html"}
function getRaceDone() {
    //var name = $("#name").val();
    var url = "https://localhost:3030/race/" ;
    $.ajax({
        url: url,
        type: 'GET',
        crossDomain: true,
        dataType: 'json',
        success: function (data) {
            for (i = 0; i < data.length; i++) {
                $('<h2>' + data[i].Name + '</h2>')
                    .appendTo($('#list'));
                $('<strong> Level: </strong> ' + data[i].Level + '<br>').appendTo(
                    $('#list'));
                $('<strong> Date: </strong> ' + data[i].Date + '<br>').appendTo(
                    $('#list'));
                $('<strong> Distance: </strong> ' + data[i].Distance + '<br>').appendTo(
                    $('#list'));
                $('<strong> Type: </strong> ' + data[i].Type + '<br>').appendTo(
                    $('#list'));

                $('<br> <br>').appendTo($('#list'));
                $('<paper-button onclick="change()" class="colored" raised="true" role="button">Actualizar Carrera</paper-button>').appendTo($('#list'));
            }
        },
        error: function () {
            window.alert("FAIL");
        }

    });
}


function getRacePending() {
    //var name = $("#name").val();
    var url = "https://localhost:3030/race/" ;
    $.ajax({
        url: url,
        type: 'GET',
        crossDomain: true,
        dataType: 'json',
        success: function (data) {
            for (i = 0; i < data.length; i++) {
                $('<h2>' + data[i].Name + '</h2>')
                    .appendTo($('#list'));
                $('<strong> Level: </strong> ' + data[i].Level + '<br>').appendTo(
                    $('#list'));
                $('<strong> Date: </strong> ' + data[i].Date + '<br>').appendTo(
                    $('#list'));
                $('<strong> Distance: </strong> ' + data[i].Distance + '<br>').appendTo(
                    $('#list'));
                $('<strong> Type: </strong> ' + data[i].Type + '<br>').appendTo(
                    $('#list'));

                $('<br> <br>').appendTo($('#list'));
                $('<paper-button id="start" class="colored" raised="true" role="button">Actualizar Carrera</paper-button>').appendTo($('#list'));
                //$('<paper-button id=' + data[i]._id + ' class="coloredDelete" raised="true" role="button" onclick="deleteRace(id)">DETAIL</paper-button> <hr>').appendTo($('#list'));
            }
        },
        error: function () {
            window.alert("FAIL");
        }

    });
}
