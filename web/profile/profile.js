/**
 * Created by david on 4/5/15.
 */
$(document).ready(function() {
    Userdata();
});

function Userdata() {
    var url = 'http://localhost:3000/user/David';

    console.log(url);

    $('#searchtab').text('');

    $.ajax({
        url : url,
        type : 'GET',
        crossDomain : true,
        dataType : 'json'
    }).done(function(data, status, jqxhr) {

        var listausers = data;
        console.log(listausers);

        console.log(listausers.Name);
        $('<a href="#"  style="color: #00FF00"><strong> Username: </strong></a>' + listausers.Username + '<br>' ).appendTo($('#name'));
        $('<a href="#"  style="color: #00FF00"><strong> Name: </strong></a>' + listausers.Name + '<br>').appendTo($('#nameuser'));
        $('<a href="#"  style="color: #00FF00"><strong> Email: </strong></a>' + listausers.Email + '<br>').appendTo($('#email'));
        $('<a href="#"  style="color: #00FF00"><strong> Level: </strong></a>' + listausers.Level + '<br>').appendTo($('#level'));













    }).fail(function() {
        $('<div class="alert alert-danger"> <strong>Oh!</strong> Todo not found </div>').appendTo($("#myResults"));
    });

}
