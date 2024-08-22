var el;                                                    

function countCharacters(e) {                                    
  var textEntered, countRemaining, counter;          
  textEntered = document.getElementById("m").value;  
  counter = textEntered.length + "/4000";
  countRemaining = document.getElementById("charactersRemaining"); 
  countRemaining.textContent = counter;       
}
el = document.getElementById("m");                   
el.addEventListener("keyup", countCharacters, false);