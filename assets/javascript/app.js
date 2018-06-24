$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBWFUDqULLIR42qbj3F3uxUOQiB-pBq-gw",
        authDomain: "train-times-e6184.firebaseapp.com",
        databaseURL: "https://train-times-e6184.firebaseio.com",
        projectId: "train-times-e6184",
        storageBucket: "",
        messagingSenderId: "881047901070"
    };
    firebase.initializeApp(config);

    // setIntervalsetInterval(page_refresh, 30000)

    var database = firebase.database();
    var currentTime = moment();

    function startTime() {
        var today = new Date();
        var hh = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        m = checkTime(m);
        s = checkTime(s);
        $('#time').text(hh + ":" + m + ":" + s);
        var t = setTimeout(startTime, 500);
    }
    function checkTime(i) {
        if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
        return i;
    }

    // $('#time').append(moment().format("hh:mm"));

    database.ref().on("child_added", function (childSnapshot) {
        var name = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var departure = childSnapshot.val().departure;
        var frequency = childSnapshot.val().frequency;
        var minutes = childSnapshot.val().min;
        var nextTrain = childSnapshot.val().nextTrain
        var tr = $("<tr>");
        tr.append([
            $("<td>").text(name),
            $("<td>").text(destination),
            $("<td>").text(departure),
            $("<td>").text(frequency),
            $("<td>").text(minutes),
            $("<td>").text(nextTrain),
            $("<td>")
        ]);
        $("#trainTable").prepend(tr);
    });


    $("#submitBtn").on("click", function () {
        event.preventDefault();
        var name = $("#trainName").val().trim();
        var destination = $("#trainDestination").val().trim();
        var departure = $("#trainDeparture").val().trim();
        var frequency = $("#trainFrequency").val().trim();



        var trainTime = moment(departure, "hh:mm").subtract("1, years");
        var difference = currentTime.diff(moment(trainTime), "minutes");
        var remainder = difference % frequency;
        var timeUntilNext = frequency - remainder;
        var nextTrain = moment().add(timeUntilNext, "minutes").format("hh:mm a");

        var newTrain = {
            name: name,
            destination: destination,
            departure: departure,
            frequency: frequency,
            min: timeUntilNext,
            nextTrain: nextTrain

        }

        database.ref().push(newTrain);


        database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (childSnapshot) {
            var trainName1 = childSnapshot.val().name;
            var destination1 = childSnapshot.val().destination;
            var departure1 = childSnapshot.val().departure;
            var frequency1 = childSnapshot.val().frequency;
            var minutes1 = childSnapshot.val().minutes;
            var nextTrain1 = childSnapshot.val().nextTrain

            var tr = $("<tr>");
            tr.append([
                $("<td>").text(trainName1),
                $("<td>").text(destination1),
                $("<td>").text(departure1),
                $("<td>").text(frequency1),
                $("<td>").text(minutes1),
                $("<td>").text(nextTrain1),
                $("<td>")
            ]);
            console.log(newTrain)
            $("#trainTable").prepend(tr);

        })



        // setIntervalsetInterval(page_refresh, 30000)
    })

    startTime();
})