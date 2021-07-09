var apiKey = '&appid=4c355b8b572a6c802a8a9809e5784ed8';
var cityName = $('#searchWord').val();
var date = new Date();
var units = '&units=imperial';


$('#searchWord').keypress(function(event) {

    if(event.keyCode ===13) {
        event.preventDefault();
        $('#searchBtn').click();
    }
});

$('#searchBtn').on('click', function() {
    
})