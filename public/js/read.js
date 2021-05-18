(function() {
    let file_total = localStorage.getItem('selected_file_number');
    const loadContainer = document.querySelector('.load-container');
    const Interval = setInterval(() => {
        var xmlhttp;
        if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        } else { // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                let file_redacted = parseInt(xmlhttp.responseText);
                if (file_redacted >= file_total){
                    setTimeout(() => {
                        clearInterval(Interval);
                        loadContainer.innerHTML = `
                        <div class='finished'>
                            <p>Traitement terminé.</p>
                        </div>`;
                        setTimeout(() => { returnToIndex(); }, 5000);
                    }, 1000);
                }
                let progress = Math.round((file_redacted / file_total) * 100);
                loadContainer.innerHTML = `
                <div class="progress" style="background: rgba(22, 16, 41, 0.221);">
                    <div class="progress-bar" style="width:${progress}%; background:rgb(30, 138, 210);" id="progressBar"></div>
                </div>`;
                document.querySelector('#fileRedacted').textContent = file_redacted + ((file_redacted < 2) ? ' fichier traité' : ' fichiers traités');
                document.querySelector('#fileNumber').textContent = ' sur ' + file_total + ((file_total < 2) ? ' fichier' : ' fichiers');
            }
        }
        xmlhttp.open("GET", "progress.txt", true);
        xmlhttp.send();
    }, 1000);
})();
const returnToIndex = function() {
    return window.location = 'http://localhost:8080/';
}