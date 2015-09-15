// Uber API Constants
var uberClientId = "Mu5JacocLapQDpQiU_dlxKQ4RNq8tkmH"
	, uberServerToken = "vpBESioeTMjcumSkyXhKr6L9rn36qP0pp8z2g9w8"
    , uberClientSecret = "RkPo-Oxb-KDst3OKl99CrEuR-u2W0FUJlZV9dZ-D"
, accessToken;

// Create variables to store latitude and longitude
var startLatitude = 37.720180
, startLongitude = -122.067335
, endLatitude = 37.797986
, endLongitude = -122.406301;

$(document).ready(function () {
    var authCode = getParameterByName('code');
    
    var http = new XMLHttpRequest();
    var url = "https://login.uber.com/oauth/token";
    var params = "client_secret=" + encodeURIComponent(uberClientSecret);
    params += "&client_id=" + encodeURIComponent(uberClientId);
    params += "&grant_type=" + encodeURIComponent("authorization_code");
    params += "&redirect_uri=" + encodeURIComponent("http://localhost:8080");
    params += "&code=" + encodeURIComponent(getParameterByName('code'));

    http.open("POST", url, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.setRequestHeader("Accept", "application/json");
    http.setRequestBody
    
    http.onreadystatechange = function (e) {//Call a function when the state changes.
        console.log(http, e);
        if (http.readyState == 4 && http.status == 200) {
            
            var obj = JSON.parse(http.responseText);
            console.log(obj);
            accessToken = obj.access_token;
            getProducts(accessToken);

        }
    };
    http.send(params);
    
});

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getProducts(accessToken) {
    $.ajax({
        url: "https://api.uber.com/v1/products?latitude=" + startLatitude + "&longitude=" + startLongitude,
        headers: {
            Authorization: "Bearer " + accessToken
        },
        
        success: function (result) {
            console.log(JSON.stringify(result));

            // 'results' is an object with a key containing an Array
            var data = result["products"];
            if (typeof data != typeof undefined) {
                var firstProduct = data[0];
                $("#time").html("Ride: " + firstProduct.display_name);
                $('input[type=hidden]').val(firstProduct.product_id);
                }
            
        },
        error: function (error) {
            //Log error
            console.log("ERROR: ", error);
        }
    });

}

$("a").click(function (event) {
    var current_value = $('input[type=hidden]').val();
    
    $.ajax({
        type: "POST",
        url: "https://sandbox-api.uber.com/v1/requests",
            headers: {
                Authorization: "Bearer " + accessToken
            },
        contentType: "application/json",
        data: JSON.stringify({ product_id: current_value, start_latitude: startLatitude, start_longitude: startLongitude, end_latitude: endLatitude, end_longitude: endLongitude }),
        dataType: "text",
        success: function (response) {
            console.log(JSON.stringify(response));
            var obj = JSON.parse(response);
            var requestStatus = obj.status;
            $("#time").html("STATUS: " + requestStatus);
        },
        error: function (error) {
            // Log any error.
            console.log("ERROR:", error);
        }
    });
});

