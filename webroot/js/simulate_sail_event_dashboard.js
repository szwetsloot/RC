function Dashboard(){
	this.crew = null;
	this.crewmembers = null;
}

Dashboard.prototype.showCrewInfo = function(){
	// select team
	// update dom
	// repeat function every 500 ms
}

Dashboard.prototype.showBouyInfo = function(){
	
}


var athlete = 0;

rotateAthletes()

function rotateAthletes() {
    $athletes_list = $('#boat-info .team-members ul li');

    $athletes_list.eq(athlete).show().delay(2800).fadeOut();

    athlete = (athlete < ($athletes_list.length - 1)) ? athlete += 1 : 0;

    setTimeout('rotateAthletes()', 3000);

}

//initialize your variables outside the function 
var count = 0;
var clearTime;
var seconds = 0, minutes = 0, hours = 0;
var clearState;
var secs, mins, gethours;

function startWatch() {

    if (minutes > end_animation)
        run = 0;

    //check if seconds is equal to 60 and add a +1 to minutes, and set seconds to 0 	
    if (seconds === 60) {
        seconds = 0;
        minutes += 1;
    }
    // you use the javascript tenary operator to format how the minutes should look and add
    // 0 to minutes if less than 10 
    mins = (minutes < 10) ? ('0' + minutes + ':') : (minutes + ':');

    // check if minutes is equal to 60 and add  a +1 to hours set minutes to 0 
    if (minutes === 60) {
        minutes = 0;
        hours = hours + 1;
    }

    /* you use the javascript tenary operator to format how the hours should look and add 0 to hours if less than 10 */
    gethours = (hours < 10) ? ('0' + hours + ':') : (hours + ':');
    //secs = ( seconds < 10 ) ? ( '0' + seconds ) : ( seconds ); 
    secs = seconds;

    // display the stopwatch 
    var x = $('#race-time .counter').text(gethours + mins + secs);
    $('#bouy-counter .counter').text('+' + mins + secs);

    // call the seconds counter after displaying the stop watch and increment seconds by +1 to keep it counting
    seconds++;

    // call the setTimeout( ) to keep the stop watch alive! 
    clearTime = setTimeout("startWatch()", 1000);
}

startWatch();