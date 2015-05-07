/**
 * Created by david on 4/5/15.
 */
$(document).ready(function() {
    Userdata();
});

function Userdata() {
    var url = 'http://localhost:3000/users/David';

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





        $('<a href="#"  style="color: #00FF00"><strong> Name: </strong></a>' + listausers.name + '<br>').appendTo($('#name'));
        //$('<a href="#"  style="color: #00FF00"><strong> Email: </strong></a>' + listausers.email + '<br>').appendTo($('#emailofuser'));
        //$('<a href="#"  style="color: #00FF00"><strong> Description: </strong></a>' + listausers.description + '<br>').appendTo($('#descriptionofuser'));









    }).fail(function() {
        $('<div class="alert alert-danger"> <strong>Oh!</strong> Todo not found </div>').appendTo($("#myResults"));
    });

}
