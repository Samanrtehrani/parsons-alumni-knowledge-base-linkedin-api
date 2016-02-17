var INPUT_COLUMN_HEADERS = ["STUDENT_NUMBER","LINKEDIN_PROFILE_URL"];
var OUTPUT_COLUMN_HEADERS = ["StudentId","Email","LinkedinId","FirstName","LastName","LocationCountryCode","LocationName",
							"Industry","Positions","Educations"];

var SentToDBMainCounter = 0;
var ReceivedFromDBMainCounter = 0;
var SReceivedFromDBMainCounter = 0;
var FReceivedFromDBMainCounter = 0;

function displayProfile(profiles) {
     member = profiles.values[0];
    // console.log(member);
    $('#profile-frame').show();
    $('#user-profile').html("<p id=\"" + member.id + "\">Hello " +  member.firstName + " " + member.lastName + " !</p>");
    
}
function displayProfilesErrors(error){
	//console.log("**************************");
	//console.log(error);
	//console.log("**************************");
}
function displayResults (profiles) {
	//console.log("############################");
	//console.log(profiles);
	//console.log("############################");	
	var members = profiles.values;
	$("#results-frame").show();

	members.forEach(function(member){
		SentToDBMainCounter ++ ;
		$.ajax({
            type: "POST",
            dataType: "json",
            url: "http://wpdeve.parsons.edu/linkedin/api/add-alumni-information.php",
            data: {data:[member]},
            success: function(data){
            	ReceivedFromDBMainCounter++;
           // 	console.log(data);
            	if( data.code == 3){
            		FReceivedFromDBMainCounter++;
            	}else{
            		SReceivedFromDBMainCounter++;
            	}
            	var content = buildDOM(member,data);
                $("#results-frame").append(content);
              //  console.log(SentToDBMainCounter + "*"+ReceivedFromDBMainCounter + "*"+ SReceivedFromDBMainCounter +"*"+FReceivedFromDBMainCounter);
            },
            error: function(e){
            	
				console.log("Error: ");
                console.log(e);
            }
    	});

	});
	
}



function getSingleProfileWithURL(url){
	IN.API.Profile("url="+url).fields("id","first-name", "last-name", "industry", "positions","location","picture-url").result(displayResults).error(displayProfilesErrors);;
}
function onLinkedInAuth(){
	$('#login-frame').hide();
	IN.API.Profile("me").result(displayProfile);

	$('#input-frame').show();

	$('#single-profile-submit').on("click",function(){getSingleProfileWithURL($("#single-profile-input").val());});
	

}
function onLinkedInLoad() {
    IN.Event.on(IN, "auth", onLinkedInAuth);

}
function displayProfilesErrors(error) {

  console.log(error);
}


function buildDOM(member,data){
	var status = ( data.code == 3 ? 'red' : 'green');
	var stringDOM = '<div class="row" ><div class="large-12 columns callout " style="background-color:'+status+';"><div class="large-3 columns" style="text-align: center;"><img id="profile-image" src="'+member.pictureUrl+'"></div><div class="large-9 columns callout "><div class="row"><div class="large-3 columns"><label>First Name</label></div><div class="large-9 columns"><div id="profileFirstName" class="panel">'+member.firstName+'</div></div></div><div class="row"><div class="large-3 columns"><label>Last Name</label></div><div class="large-9 columns"><div class="profileLastName" class="panel">'+member.lastName+'</div></div></div><div class="row"><div class="large-3 columns"><label>Email</label></div><div class="large-9 columns"><div class="emailAddress" class="panel">'+member.emailAddress+'</div></div></div><div class="row"><div class="large-3 columns"><label>Location</label></div><div class="large-9 columns callout"><div class="row"><div class="large-3 columns"><label>Name</label></div><div class="large-9 columns"><div class="position" class="panel">'+member.location.name+'</div></div></div><div class="row"><div class="large-3 columns"><label>Country</label></div><div class="large-9 columns"><div class="position" class="panel">'+member.location.country.code+'</div></div></div></div></div><div class="row"><div class="large-3 columns"><label>Industry</label></div><div class="large-9 columns"><div class="profileName" class="panel">'+member.industry+'</div></div></div><div class="row"><div class="large-3 columns"><label>Position</label></div><div class="large-9 columns callout"><div class="row"><div class="large-3 columns"><label>Company</label></div><div class="large-9 columns"><div class="position" class="panel">'+member.positions.values[0].company.name+'</div>		</div></div><div class="row"><div class="large-3 columns"><label>Title</label></div><div class="large-9 columns"><div class="position" class="panel">'+member.positions.values[0].title+'</div>		</div></div><div class="row"><div class="large-3 columns"><label>isCurrent</label></div><div class="large-9 columns"><div class="position" class="panel">'+member.positions.values[0].isCurrent+'</div>		</div></div></div></div><div class="row"><div class="large-3 columns"><label>Education</label></div><div class="large-9 columns"><div class="education" class="panel">'+member.eduction+'	</div></div></div><div class="row"><div class="large-3 columns"><label>Phone Number</label></div><div class="large-9 columns"><div id="profileName" class="panel"></div></div></div><div class="row"><div class="large-3 columns"><label>Address</label></div><div class="large-9 columns"><div id="profileName" class="panel"></div></div></div><div class="row"><div class="large-3 columns"><label>Twitter Account</label></div><div class="large-9 columns"><div id="profileName" class="panel"></div></div></div><div class="row"><div class="large-3 columns"><label>ID</label></div><div class="large-9 columns"><div class="profileID" class="panel">'+member.id+'	</div></div></div></div></div></div>';
	return stringDOM;
}

function randomInt(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function submitBatch () {
	
	var config = buildConfig();
	
	if (!$('#batchFileItem')[0].files.length)
	{
		alert("Please choose at least one file to parse.");
		return enableButton();
	}
		
	$('#batchFileItem').parse({
		config: config,
		before: function(file, inputElem)
		{
			start = now();
			console.log("Parsing file...", file);
		},
		error: function(err, file)
		{
			console.log("ERROR:", err, file);
		},
		complete: function()
		{
			end = now();
			printStats("Done with all files");
		}
	});
}
function enableButton()
{
	$('#submitBatch').prop('disabled', false);
}

function buildConfig()
{
	return {
		delimiter: $('#delimiter').val(),
		header: $('#header').prop('checked'),
		dynamicTyping: $('#dynamicTyping').prop('checked'),
		skipEmptyLines: $('#skipEmptyLines').prop('checked'),
		preview: parseInt($('#preview').val() || 0),
		step: $('#stream').prop('checked') ? stepFn : undefined,
		encoding: $('#encoding').val(),
		worker: $('#worker').prop('checked'),
		comments: $('#comments').val(),
		complete: completeFn,
		download: false
	};
}
function completeFn(results)
{

	if (results && results.errors)
	{
		if (results.errors)
		{
			errorCount = results.errors.length;
			firstError = results.errors[0];
		}
		if (results.data && results.data.length > 0)
			rowCount = results.data.length;
	}

	printStats("Parse complete");
	console.log("    Results:", results);
	extractURLs(results.data);

	setTimeout(enableButton, 100);
}
function printStats(msg)
{
	if (msg)
		console.log(msg);
	
}
function now()
{
	return typeof window.performance !== 'undefined'
			? window.performance.now()
			: 0;
}

function extractURLs(rows){
	var headersRow = rows[0];
	var linksColumn = -1;
	for( var i = 0; i < headersRow.length ; i++ ){
		if( INPUT_COLUMN_HEADERS[1] == headersRow[i] ){
			linksColumn = i;
			break;
		}
	}
	if( linksColumn == -1){
		console.log( "Uploaded file doesn't follow the template! Please make sure the headers stay the same and on the first row!");
		return;
	}

	var students = rows.slice(1);
	var wrongURLCounter =0;
	var emptyCounter = 0;
	var urls = {'entries':[]};
	for( var i=0 ; i< students.length ; i++){

		var currentStd = students[i][linksColumn];
		if( currentStd != "" &&  currentStd != " "){
			
			if(currentStd.indexOf("https://www.linkedin.com/in/") != -1 ){

				var url = currentStd.substring(0,currentStd.indexOf("?"));
				
				urls.entries.push(url);
				
			}else{
				wrongURLCounter++;
			}
			
		}else{
			emptyCounter++;
		}
	}

/*console.log("Total Number of Rows: "+students.length);
console.log("Empty Rows: "+emptyCounter);
console.log("Rows With Wrong URL: "+wrongURLCounter);
console.log("Valid URLs: "+ urls.entries.length);
console.log( urls);
*/
SentToDBMainCounter = 0;
ReceivedFromDBMainCounter = 0;
SReceivedFromDBMainCounter = 0;
FReceivedFromDBMainCounter = 0;
urls.entries.forEach(function(entry){
	getSingleProfileWithURL(entry);
});


}

