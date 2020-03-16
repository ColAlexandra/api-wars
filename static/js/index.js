window.load = function (source) {
    apiRequest(source);


    function turnPage(e) {
        e.stopPropagation();
        let next_source = e.target.dataset['source'];
        fetch(next_source)
            .then((response) => response.json())
            .then((data) => {
                fillTable(data)
            });
    }


    function apiRequest(source) {
        let pageTurner = document.getElementById('page-turner');
        pageTurner.addEventListener('click', turnPage);
        document.getElementById('loading-table').classList.remove('hidden');
        fetch(source)
            .then((response) => response.json())
            .then((data) => {
                document.getElementById('loading-table').classList.add('hidden');
                fillTable(data);
            });
    }


    function disabledButtons(data) {
        if (data['next'] === null) {
            document.getElementById('next-page').parentElement.classList.add('disabled');
        } else {
            document.getElementById('next-page').parentElement.classList.remove('disabled');
            document.getElementById('next-page').setAttribute('data-source', data['next']);
        }
        if (data['previous'] === null) {
            document.getElementById('previous-page').parentElement.classList.add('disabled');
        }
        else {
            document.getElementById('previous-page').parentElement.classList.remove('disabled');
            document.getElementById('previous-page').setAttribute('data-source', data['previous']);
        }
    }


    function fillTable(data) {
        let table_content = data['results'];
        let table = document.getElementById('tbody');
        disabledButtons(data);
        table.innerText = '';
        if (table_content) {
            let i = 0;
            for (i; i < table_content.length; i++) {
                let row = table.insertRow(i);
                let name_cell = row.insertCell(0);
                name_cell.innerText = table_content[i]['name'];
                let diameter_cell = row.insertCell(1);
                diameter_cell.innerText = table_content[i]['diameter'] + ' km';
                diameter_cell.setAttribute('class', 'number');
                group_numbers();
                let climate_cell = row.insertCell(2);
                climate_cell.innerText = table_content[i]['climate'];
                let terrain_cell = row.insertCell(3);
                terrain_cell.innerText = table_content[i]['terrain'];
                let surfacewater_cell = row.insertCell(4);
                if (table_content[i]['surface_water'] !== 'unknown') {
                    surfacewater_cell.innerText = table_content[i]['surface_water'] + '%';
                } else {
                    surfacewater_cell.innerText = 'unknown'
                }
                let population_cell = row.insertCell(5);
                if (table_content[i]['population'] !== 'unknown') {
                    population_cell.innerText = table_content[i]['population'] + ' people';
                    population_cell.setAttribute('class', 'number');
                    group_numbers();
                } else {
                    population_cell.innerText = 'unknown';
                }
                let residents_cell = row.insertCell(6);
                if (table_content[i]['residents'].length === 0) {
                    residents_cell.innerText = 'No known residents';
                } else {
                    let resident_sources = table_content[i]['residents'];
                    let button_value = table_content[i]['residents'].length.toString();
                    let button_text = ' resident(s)';
                    let buttonId = 'resButton_' + i;
                    residents_cell.innerHTML = '<input type="button" class="btn btn-light residents-button" data-target="#myModal" value=\"' + button_value + button_text + '\">';
                    residents_cell.setAttribute('id', buttonId);
                    residents_cell.setAttribute('data-source', resident_sources);
                    residents_cell.setAttribute('data-planet', table_content[i]['name']);
                    let residentsButton = document.getElementById(buttonId);
                    residentsButton.addEventListener('click', createModal);
                }
                let vote_cell = row.insertCell(7);
                vote_cell.innerHTML = '<input type="button" class="btn btn-light vote-button" value="Vote">';
                if (document.getElementById('session-user')) {
                    $('.vote-button').show()
                } else {
                    $('.vote-button').hide()
                }
            }
        }
    }


    function createModal(e) {
        let modal_sources = e.target.parentElement.dataset['source'];
        let modal_title = e.target.parentElement.dataset['planet'];
        document.getElementById('loading-modal').classList.remove('hidden');
        $('#myModal').modal('show');
        fillModal(modal_title, modal_sources);
    }


    function fillModal(modal_title, modal_sources) {
        let modal_table = document.getElementById('modal-table');
        let title = document.getElementById('modal-title');
        modal_table.innerHTML = '';
        title.innerText = '';
        let i = 0;
        let sources = modal_sources.split(',');
        for (i; i < sources.length; i++) {
            let current_source = sources[i];
            let row = modal_table.insertRow(i);

            fetch(current_source)  // set the path; the method is GET by default, but can be modified with a second parameter
                .then((response) => response.json())  // parse JSON format into JS object
                .then((data) => {
                    document.getElementById('loading-modal').classList.add('hidden');
                    title.innerText = 'Residents of ' + modal_title;
                    let name_cell = row.insertCell(0);
                    name_cell.innerText = data['name'];
                    let height_cell = row.insertCell(1);
                    height_cell.innerText = data['height'];
                    let weight_cell = row.insertCell(2);
                    weight_cell.innerText = data['weight'];
                    let mass_cell = row.insertCell(3);
                    mass_cell.innerText = data['mass'];
                    let skincolor_cell = row.insertCell(4);
                    skincolor_cell.innerText = data['skin_color'];
                    let eyecolor_cell = row.insertCell(5);
                    eyecolor_cell.innerText = data['eye_color'];
                    let birthyear_cell = row.insertCell(6);
                    birthyear_cell.innerText = data['birth_year'];
                    let gender_cell = row.insertCell(7);
                    if (data['gender'] === 'female') {
                        gender_cell.innerHTML = '<i class="fa fa-venus"></i>';
                    } else {
                        gender_cell.innerHTML = '<i class="fa fa-mars"></i>'
                    }
                });

        }

    }

    function group_numbers() {
        function numberWithCommas(number) {
            let parts = number.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }

        $(document).ready(function () {
            $(".number").each(function () {
                let num = $(this).text();
                let commaNum = numberWithCommas(num);
                $(this).text(commaNum);
            });
        });
    }


}
;

window.load('https://swapi.co/api/planets/');