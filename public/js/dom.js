
(function () {

    const selectedFileName = document.querySelector('.selectedFileName');
    const fileNameField = document.querySelector('.fileNameField > p');
    const inputFile = document.querySelector('#uploadFile');
    const redactButton = document.querySelector('#redactFile');
    const buttonSelect = document.querySelector('.select-button');
    const parametreBtn = document.querySelector('#parametreFile');
    const modalbnttraitement = document.querySelector('#modalTraitement');
    const check = document.querySelector('#checkAll');
    const dissmiss = document.querySelector('#dissmiss');
    //

    $('input[id="blankCheckbox"]').on('click', item => {
        let me = item.target.checked
        let active = true

        if (check.checked == true && me == false) {
            check.checked=false
        }

        var checkbox = document.querySelectorAll('input[id="blankCheckbox"]');
        //check if there is yet checkbox uncheck
        for (let c of checkbox) {
            if (c.checked == false) {
                active = false
            }
        }

        //if not check the check btn all
        if (active==true) {
            check.checked = true
        }
    });


    
    // var con = mysql.createConnection({
    //     host: 'localhost',
    //     user: 'root',
    //     password: '',
    //     database : "solumada"
    // })

    // con.connect(function (err) {
    //     if (err) throw err;

    //     let sql = "SELECT * FROM street";
    //     con.query(sql, (err, result) => {
    //         if (err) throw err;
    //         result.forEach(async r => {
    //             if (r.rue.length !== 0)
    //             {
    //                 let adresse =
    //                 {
    //                     name: "Adresse",
    //                     pattern: String(r.rue)
    //                 }
    //                 return adresse;
    //             }
    //         });
    //     });
        
    //      sql = "SELECT ville FROM town";
    //     con.query(sql, (err, result) => {
    //         if (err) throw err;
    //         result.forEach(async element => {
    //             if (element.ville.length !== 0) {
    //                 let ville =
    //                 {
    //                     name: "Ville",
    //                     pattern: String(element.ville)
    //                 }
    //                 return ville;
    //             }
    //         });
    //     });

    //     sql = "SELECT noms FROM name";
    //     con.query(sql, (err, result) => {
    //         if (err) throw err;
    //         result.forEach(async element => {
    //             if (element.noms.length !== 0) {
    //                 let nom =
    //                 {
    //                     name: "Noms",
    //                     pattern: String(element.noms)
    //                 }
    //                 return nom;
    //             }
    //         });
    //     });
    //     con.end();
    // })
    
    const element = [
        {
            name: 'Email',
            pattern: '[a-zA-Z0-9._%+-]+[a-zA-Z0-9._%+-]+@[A-z]+[a-zA-Z0-9._%+-]+[a-zA-Z]'
        },
        {
            name: 'Numéro téléphone',
            pattern: '[+]3{1}2{1}+[ ]{0,1}+[.]{0,1}+[-]{0,1}+\\d{1}+[ ]{0,1}+[.]{0,1}+[-]{0,1}+\\d{3}+[ ]{0,1}+[-]{0,1}+[.]{0,1}+\\d{2}+[ ]{0,1}+[.]{0,1}+[-]{0,1}+\\d{2}+\\d{0,1}'
        },
        {
            name: 'Numéro permis',
            pattern: '/[1-9]{2}[ .]{0,1}(?:1[0-2]|0[0-9]{1})[ .]{0,1}[0-9]{2}[ .]{0,1}[0-9]{2}[ .]{0,1}[0-9]{4}/g'
        },
        {
            name: 'Employeur identification',
            pattern: '\\b(?:[1-9]{1}[0-9]{11})\\b'
        },
        {
            name: 'Identification nationale',
            pattern: '[0-9]{2}[.](?:1[0-2]|0[0-9]{1})[.](?:3[0-1]|0[1-9]{1}|2[0-9]{1})-[0-9]{3}[.][0-9]{2}'
        },
        {
            name: 'Numéro bancaire',
            pattern: '[A-Z]{2}[0-9]{2} ?\\d{4} ?\\d{4} ?\\d{4} ?(\\w{8})?'
        },
        {
            name: 'Numéro TVA',
            pattern: '[A-Z]{2}[ ]{0,1}[0-9]{4}[^A-Za-z0-9_]{0,1}[0-9]{3}[^A-Za-z0-9_]{0,1}[0-9]{3}'
        },
        // {
        //     name: 'Swift / BIC',
        //     pattern :''
        // },
        // {
        //     name: 'Genre',
        //     pattern :''
        // },
        // {
        //     name: 'Ethinicité',
        //     pattern :''
        // },
        // {
        //     name: "Nom d'utilisateur",
        //     pattern :''
        // },
        {
            name: 'Numéro passport',
            pattern: '\\b(?:[A-Z]{2}[0-9]{6})\\b'
        },
        // {
        //     name: 'Situation familiale',
        //     pattern :''
        // },
        // {
        //     name: "Numéro d'allocation",
        //     pattern :''
        // },
        {
            name: 'Identification véhicule',
            pattern: '\\b(?:[1-8]{1}[-][A-Y]{1}[A-Z]{2}[-][0-9]{3})\\b'
        },
        {
            name: 'VIN',
            pattern: '\\b(?:(?:[0-9]|[A-H]|[J-N]|[P]|[R-Z]){8}(?:[0-9]|[X]){1}(?:[1-9]|[A-H]|[J-N]|[P]|[R-T]|[V-Y]){1}(?:[0-9]|[A-H]|[J-N]|[P]|[R-Z]){1}[0-9]{6})\\b'
        },
        {
            name: 'Nom',
            pattern :''
        },
        {
            name: 'Ville',
            pattern :''
        },
        {
            name: 'Adresse',
            pattern :''
        }
        // {
        //     name: 'Nom de dépendance',
        //     pattern :''
        // }
    ]

    buttonSelect.addEventListener('click', function (e) {
        inputFile.click();
        e.preventDefault();
    });
    check.addEventListener("click", function () {
        let active = check.checked
        let checkboxes = document.querySelectorAll('input[id="blankCheckbox"]');
        for (let checkbox of checkboxes) {
            checkbox.checked = active;
        }
    })

    modalbnttraitement.addEventListener('click', function () {
        var checkbox = document.querySelectorAll('input[id="blankCheckbox"]:checked')
        //var x = document.forme.inputes
        const renvoie = []
        if (checkbox.length > 0) {
            for (let i = 0; i < checkbox.length; i++) {
                let index = checkbox[i].value
                renvoie.push(element[index])
                // if (index == "5") {
                //     renvoie.push(iban2)
                // } else if (index == "1") {
                //     renvoie.push(numero)
                // }
            }
            reinitialiserObject(element, renvoie)
            redactButton.click()
        } else {
            redactButton.click()
        }
        dissmiss.click()
        //alert(element)
    })

    function reinitialiserObject(objecte,newObject) {
        for (let i = objecte.length; i > 0; i--) {
            objecte.pop();
        }
        for (let index = 0; index < newObject.length; index++) {
            objecte.push(newObject[index])
        }
    }

    var active_button = false;
    activeButtons(active_button);
    // event listener
    inputFile.addEventListener('change', function () {
        let countPDF = 0;
        active_button = false;
        Array.from(inputFile.files).forEach(function (file) {
            countPDF += (file.type === 'application/pdf') ? 1 : 0;
        });
        if (countPDF > 1500) alert(`Le nombre de fichiers doit être inférieur à ou égal 1500.`);
        else if (countPDF == 0) alert(`Il n'y a aucun fichier pdf dans ce dossier`);
        else {
            selectedFileName.textContent = `${countPDF} fichiers.`;
            localStorage.setItem('selected_file_number', JSON.stringify(countPDF));
            active_button = true;
        }
        activeButtons(active_button);
    });

    // traitement event listener
    redactButton.addEventListener('click', function () {
        calldata(element)
        active_button = !active_button;
        activeButtons(active_button);
        document.querySelector('.charging').style.display = 'block';
    });

    function calldata(params) {
        const data = JSON.stringify(params)
        var xmlh = new XMLHttpRequest()
        xmlh.open('POST', '/parametre');
        xmlh.setRequestHeader('Content-Type', 'application/json');
        console.log("data dom == ", data);
        xmlh.send(data)
    }

    parametreBtn.addEventListener("click", function (event) {
        event.preventDefault()
    });

    function activeButtons(boolean) {
        redactButton.style.display = !boolean ? 'none' : 'inline';
        fileNameField.style.display = !boolean ? 'none' : 'inline';
        parametreBtn.style.display = !boolean ? 'none' : 'inline';
    }
    // modalbnttraitement.addEventListener("click", data);
    // function data(params) { 
    // }
})();