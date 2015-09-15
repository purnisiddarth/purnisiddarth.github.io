// Uber API Constants
var uberClientId = "Mu5JacocLapQDpQiU_dlxKQ4RNq8tkmH"
	, uberServerToken = "Xd2FI4hCCCvGdh1U8VMRq3mKdIfQrdGiopXCBMa7"
    , uberClientSecret = "RkPo-Oxb-KDst3OKl99CrEuR-u2W0FUJlZV9dZ-D"
    , redirect_uri = "https://purnisiddarth.github.io"
    , accessToken
    , timer;

// Create variables to store latitude and longitude
var startLatitude = 37.720180
, startLongitude = -122.067335
, endLatitude = 37.797986
, endLongitude = -122.406301;

// OAuth callback
// Use the authorization code from the callback and call login token endpoint to get access token
// Use the access token and call /products
$(document).ready(function () {
    var authCode = getParameterByName('code');
    
    var http = new XMLHttpRequest();
    var url = "https://login.uber.com/oauth/token";
    var params = "client_secret=" + encodeURIComponent(uberClientSecret);
    params += "&client_id=" + encodeURIComponent(uberClientId);
    params += "&grant_type=" + encodeURIComponent("authorization_code");
    //localhost
    //params += "&redirect_uri=" + encodeURIComponent("http://localhost:8080");

    //Publicly accessble url
    params += "&redirect_uri=" + encodeURIComponent(redirect_uri);
    params += "&code=" + encodeURIComponent(getParameterByName('code'));

    http.open("POST", url, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.setRequestHeader("Accept", "application/json");
    http.setRequestBody
    
    http.onreadystatechange = function (e) {//Call a function when the state changes.
        console.log(http, e);
        if (http.readyState == 4 && http.status == 200) {
            //Use JSON parse and get accesstoken from the result
            var obj = JSON.parse(http.responseText);
            console.log(obj);
            accessToken = obj.access_token;
            if (typeof accessToken != typeof undefined)
            {
                //Get products using the accesstoken
                getProducts(accessToken);
            }
            else {
                console.log("Error: Access token is not defined.");
            }

        }
        else {
            console.log("Error getting access token.");
        }
    };
    http.send(params);
    
});

//Extract code from the querystring
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Call uber to get list of products and display the first product's name in the button
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
                //Get the first product and display product name in the button
                var firstProduct = data[0];
                $("#time").html("Ride: " + firstProduct.display_name);
                $('input[type=hidden]').val(firstProduct.product_id);
            }
            else {
                console.log("Error: data is not defined");
            }
            
        },
        error: function (error) {
            //Log error
            console.log("ERROR: ", error);
        }
    });

}

// Click of uber button makes a ride request to the sandbox with the product_id
$("a").click(function (event) {

    var product_id = $('input[type=hidden]').val();
    
    $.ajax({
        type: "POST",
        url: "https://sandbox-api.uber.com/v1/requests",
            headers: {
                Authorization: "Bearer " + accessToken
            },
        contentType: "application/json",
        data: JSON.stringify({ product_id: product_id, start_latitude: startLatitude, start_longitude: startLongitude, end_latitude: endLatitude, end_longitude: endLongitude }),
        dataType: "text",
        success: function (response) {
            console.log(JSON.stringify(response));

            //Parse ride request response and update button with status
            var obj = JSON.parse(response);
            var requestStatus = obj.status;
            var request_id = obj.request_id;

            $("#time").html("STATUS: " + requestStatus);

            // Use a timer to poll for status update for the ride request
            if (typeof timer === typeof undefined) {
                timer = setInterval(function () {
                    getStatusUpdate(request_id);
                }, 30000);
            }
            else {
                console.log("Error: Timer is not defined")
            }
        },
        error: function (error) {
            // Log any error.
            console.log("ERROR:", error);
        }
    });
});

// Poll sandbox for status of request
function getStatusUpdate(request_id) {
    $.ajax({
        url: "https://sandbox-api.uber.com/v1/requests/" + request_id,
        headers: {
            Authorization: "Bearer " + accessToken
        },
        contentType: "application/json",
        data: { "status": "accepted" },
        success: function(result) {
            console.log(JSON.stringify(result));
            var obj = JSON.parse(result);
            var requestStatus = obj.status;

            if (typeof requestStatus != typeof undefined) {
                $("#time").html("STATUS: " + requestStatus);
            }
            else {
                console.log("Error: requestStatus is not defined");
            }
        },
        error: function (error) {
            console.log("ERROR: " + error);
        }
    });
}