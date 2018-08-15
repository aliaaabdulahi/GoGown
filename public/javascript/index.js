$("#hamburger").on("click", () => {
  $("#slide").slideToggle(100);
});

// we want the the value of our style variables to increase by one when the user answers the question with that style
//when the form is submitted the variable with the highest number value will be chosen as the style

window.addEventListener('load', (event) => {
  let eclectic = 0;
  let minimalist = 0;
  let maverick = 0;
  const form = document.getElementById("form");
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    // When the user clicks submit pull all the values of the inputs that are checked
    let radios = document.getElementsByClassName('radio')
    let values = []
    for(let i = 0; i < radios.length; i++){
      if(radios[i].checked){
        values.push(radios[i].value)
      }
    }
    for(let i = 0; i < values.length; i++){
      if(values[i] == "1" ){
        minimalist ++
      }else if( values[i] == "2"){
        maverick ++
      }else{
        eclectic++
      }
    }
    console.log(`eclectic: ${eclectic}`)
    console.log(`minimalist: ${minimalist}`)
    console.log(`maverick: ${maverick}`)

    if(eclectic > 2){
      document.getElementById('results').innerHTML = 'You are Eclectic! Check out Eclectic dresses <a href=/eclectic>here</a>'
      // load()

    }else if( minimalist > 2){
      document.getElementById('results').innerHTML = 'You are a Minimalist. Check out Minimalist dresses <a href=/minimalist>here</a>'
      // load()

    }else if(maverick > 2){
      document.getElementById('results').innerHTML = 'You are a Maverick. Check out Maverick dresses <a href=/maverick>here</a> '
      // load()

    }else if( maverick === 2 && minimalist === 2){
      document.getElementById('results').innerHTML = 'You are both Maverick and Minimalist.Check out Maverick dresses <a href=/maverick>here</a> and Minimalist dresses <a href=/minimalist>here</a>  '
      // load()

    }else if( maverick === 2 && eclectric === 2){
      document.getElementById('results').innerHTML = 'You are both Maverick and Eclectic. Check out Maverick dresses <a href=/maverick>here</a> and Eclectic dresses <a href=/eclectic>here'
      // load()

    }else if( minimalist === 2 && eclectic === 2){
      document.getElementById('results').innerHTML = 'You are both Minimalist and Eclectic. Check out Minimalist dresses <a href=/minimalist>here</a> and Eclectic dresses <a href=/eclectic>here'
      // load()

    }
  })
});

//API

$(document).ready(function () {
	var url = "http://content.guardianapis.com/search?show-elements=all&q=fashion&show-fields=thumbnail&api-key=5de47de4-547b-48f0-b774-a424dfef062b";
	$.ajax({
		url: url,
		dataType: "json",
		success: function( response ) {
			console.log( response);
			// response = response.slice(0,6)
			response.response.results.forEach(function (el){ // server response
			var titleName = el.webTitle;
			var newsLink = "<a target='_blank' href='" + el.webUrl + "' class='newsLinkName'>"+ titleName +"  </a> ";
			var newsImage = "<a target='_blank' href = '"+ el.webUrl +"'> <img src='"+ el.fields.thumbnail +"' class='newsImage' > </a>";
			$(".slide").append("<li>" + newsLink + newsImage  +"</li>");
		});
		},
		error: function (r) {
			console.log(r);

	}
});
});
