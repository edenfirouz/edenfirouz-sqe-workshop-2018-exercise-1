import $ from 'jquery';
import {parseCode,createTable} from './code-analyzer';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let table=createTable(parsedCode);
        let x = document.getElementById('myTable');
        x.innerHTML = table;
        // $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});





