function displayProfile(profiles) {
     member = profiles.values[0];
    $('#profile-frame').show();
    $('#user-profile').html("<p id=\"" + member.id + "\">Hello " +  member.firstName + " " + member.lastName + " !</p>");
    
}
function displayResults (profiles) {
	
	var members = profiles.values;
	$("#results-frame").show();
	members.forEach(function(member){
		$("#profile-image").attr('src',member.pictureUrl);
		console.log(member);
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