// Stopwatch
function Stopwatch(obj, name){
		this.obj = obj;
		this.name = name;
		this.count = 0;
		this.clearTime = null;
		this.clearState = null;
		this.seconds = 0;
		this.minutes = 0;
		this.hours = 0;
		this.secs = null;
		this.mins = null; 
		this.gethours = null;
		this.time = null;		
		this.start();
}

// Stopwatch
Stopwatch.prototype.start = function(){	
	$(this.obj).show();

    //check if seconds is equal to 60 and add a +1 to minutes, and set seconds to 0 	
    if (this.seconds === 60) {
    	this.seconds = 0;
    	this.minutes += 1;
    }
    
    // you use the javascript tenary operator to format how the minutes should look and add
    // 0 to minutes if less than 10 
    this.mins = (this.minutes < 10) ? ('0' + this.minutes + ':') : (this.minutes + ':');

    // check if minutes is equal to 60 and add  a +1 to hours set minutes to 0 
    if (this.minutes === 60) {
    	this.minutes = 0;
    	this.hours = this.hours + 1;
    }

    /* you use the javascript tenary operator to format how the hours should look and add 0 to hours if less than 10 */
    this.gethours = (this.hours < 10) ? ('0' + this.hours + ':') : (this.hours + ':');
    //secs = ( seconds < 10 ) ? ( '0' + seconds ) : ( seconds ); 
    this.secs = this.seconds;

    this.time = this.mins + this.secs;
    
    // display the stopwatch 
    $(this.obj).find('.counter').text(this.time);
    $(this.obj).find('.label').text(this.name);
        
    // call the seconds counter after displaying the stop watch and increment seconds by +1 to keep it counting
    this.seconds++;
    var self = this;
    
    // call the setTimeout( ) to keep the stop watch alive! 
    this.clearTime = setTimeout(function(){self.start();}, 1000);
}

Stopwatch.prototype.stop = function(){
	clearTimeout(this.clearTime);
}
