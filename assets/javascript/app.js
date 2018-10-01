$(document).ready(() => {

    // Initialize Firebase
    const config = {
        apiKey: "AIzaSyBWFUDqULLIR42qbj3F3uxUOQiB-pBq-gw",
        authDomain: "train-times-e6184.firebaseapp.com",
        databaseURL: "https://train-times-e6184.firebaseio.com",
        projectId: "train-times-e6184",
        storageBucket: "",
        messagingSenderId: "881047901070"
    };
    firebase.initializeApp(config);

    // setIntervalsetInterval(page_refresh, 30000)

    const database = firebase.database();
    const currentTime = moment();

    const startTime = () => {
        const today = new Date();
        const hh = today.getHours();
        const m = today.getMinutes();
        const s = today.getSeconds();
        m = checkTime(m);
        s = checkTime(s);
        $('#time').text(hh + ":" + m + ":" + s);
        const t = setTimeout(startTime, 500);
    }
    const checkTime = (i) => {
        if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
        return i;
    }

    // $('#time').append(moment().format("hh:mm"));

    database.ref().on("child_added", (childSnapshot) => {
        const name = childSnapshot.val().name;
        const destination = childSnapshot.val().destination;
        const departure = childSnapshot.val().departure;
        const frequency = childSnapshot.val().frequency;
        const minutes = childSnapshot.val().min;
        const nextTrain = childSnapshot.val().nextTrain
        const tr = $("<tr>");
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


    $("#submitBtn").on("click", () => {
        event.preventDefault();
        const name = $("#trainName").val().trim();
        const destination = $("#trainDestination").val().trim();
        const departure = $("#trainDeparture").val().trim();
        const frequency = $("#trainFrequency").val().trim();



        const trainTime = moment(departure, "hh:mm").subtract("1, years");
        const difference = currentTime.diff(moment(trainTime), "minutes");
        const remainder = difference % frequency;
        const timeUntilNext = frequency - remainder;
        const nextTrain = moment().add(timeUntilNext, "minutes").format("hh:mm a");

        const newTrain = {
            name: name,
            destination: destination,
            departure: departure,
            frequency: frequency,
            min: timeUntilNext,
            nextTrain: nextTrain

        }

        database.ref().push(newTrain);


        database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", (childSnapshot) => {
            const trainName1 = childSnapshot.val().name;
            const destination1 = childSnapshot.val().destination;
            const departure1 = childSnapshot.val().departure;
            const frequency1 = childSnapshot.val().frequency;
            const minutes1 = childSnapshot.val().minutes;
            const nextTrain1 = childSnapshot.val().nextTrain

            const tr = $("<tr>");
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