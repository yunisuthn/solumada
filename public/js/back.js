
const button1 = document.getElementById('clickf');
const button2 = document.getElementById('readf');
const back = document.getElementById('back');

button1.addEventListener("click", downloadClick);
button2.addEventListener("click", downloadRead);
back.addEventListener("click", backpage);

function downloadRead(){
    window.location = "/downloadRead";
}
function downloadClick(){
    window.location = "/downloadClick";
}
function backpage(){
    window.location = "/";
}
