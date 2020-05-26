// import { downloadCSV, readCSV, clearData } from './data.js';

$( ()=> {

	$('#settings-div').hide();
	$('#info-message').html('Upload a file to get started...');

	$('[data-toggle="popover"]').popover({trigger:'hover', placement:'bottom'});

	$('#download-spreadsheet-btn').click(downloadCSV);

	$('#spreadsheet-file-input').change(readCSV);

	$('#upload-spreadsheet-btn').click( ()=> { // on upload
		$('#spreadsheet-file-input').click(); // call readCSV
	});

	$('#clear-btn').click(clearData);

});