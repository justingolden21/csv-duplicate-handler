// import { getFormattedDate } from './util.js';

let data = []; // data stored in application, 2d array
let fileCount = 0; // number of files that have been uploaded
let fileName = '';

function clearData() { // todo: implement
	data = [];
	fileCount = 0;
	fileName = '';

	$('#duplicate-identifier-select').html('');
	$('#settings-div').hide();
	$('#display-table').hide(500, ()=> $('#display-table').html('') );

	$('#info-message').html('Upload a file to get started...');
	$('#error-message').html('');
	$('#success-message').html('');

	$('#spreadsheet-file-input').val(null); // so we can upload the same file
}

function updateTableDisplay() {
	let headHTML = '<th>' + data[0].join('</th><th>') + '</th>';
	let tmpHTML = `<tr class="thead-dark"> ${headHTML} </tr>`;

	// first row is headings
	for(let idx = 1; idx < data.length; idx++) {
		tmpHTML += '<tr><td>' + data[idx].join('</td><td>') + '</td></tr>';
	}

	$('#display-table').hide().html(tmpHTML).show(500);

	console.log(`${data.length} rows, ${data[0].length} cols`);
	$('#info-message').html(`${data.length} rows, ${data[0].length} cols`);
}

// note: more than several thousand rows and it doesn't work
// https://stackoverflow.com/a/14966131/4907950
function downloadCSV() {
	// data is 2d array to be converted into csv
	let csvContent = 'data:text/csv;charset=utf-8,' 
		+ data.map(e => e.join(',') ).join('\n');
	let encodedUri = encodeURI(csvContent);

	let link = document.createElement('a');
	link.setAttribute('href', encodedUri);
	link.setAttribute('download', fileName.replace('.csv', `_${getFormattedDate()}.csv`) );
	document.body.appendChild(link); // for firefox
	link.click();
}

function readCSV(evt) {
	let f = evt.target.files[0];
	if(f) {
		$('#info-message').html('');
		$('#error-message').html('');
		$('#success-message').html('');
		
		let r = new FileReader();
		r.onload = (e)=> {
			let contents = e.target.result;

			console.log(`file: ${f.name}\n type: ${f.type}\n size: ${f.size}\n contents: ${contents.length>1000?'(first 1000 chars)':''} \n${contents.substring(0,1000)}`);
			$('#success-message').html(`Successfully imported <b>${f.name}</b>`); // todo: toast or modal
			fileName = f.name;

			let lines = contents.split('\n');
			let duplicateBehavior = $('#duplicate-behavior-select').val(); // 'new', 'current', or 'both'

			// i=0, load header into data
			for(let i=0; i<lines.length; i++) {
				let lineData = lines[i].split(',');

				// lineData==[''] doesn't work
				if(lineData.length==1 && lineData[0].trim()=='') continue; // skip blank lines

				// first file
				if(fileCount==0) { // first file
					data.push(lineData);
				} else { // file exists
					if(i==0) continue; // skip header // note: i++ doesn't work, keeps going with same lineData

					let duplicateCol = $('#duplicate-identifier-select').val(); // name of column to find dupliactes by
					let duplicateCheckIdx = data[0].indexOf(duplicateCol); // idx of duplicate col in data header
					let duplicateLocation = checkDuplicate(lineData, duplicateCheckIdx);
					let isDuplicate = duplicateLocation!=-1;

					if(isDuplicate && duplicateBehavior!='both') {
						if(duplicateBehavior=='new') {
							data[duplicateLocation] = lineData; // replace old with new
						} // else duplicateBehavior == 'current' and we just keep the keep the onload
					} else { // no duplicate or import both anyway
						data.push(lineData);
					}
				}
			}

			if(fileCount==0) {
				$('#duplicate-identifier-select').html('<option>' + data[0].join('</option><option>') + '</option>');
				$('#settings-div').show();
			}

			fileCount++;
			updateTableDisplay();
		}
		r.readAsText(f);
	} else {
		console.log('failed to load file');
		$('#error-message').html('Failed to load file'); // todo: toast or modal
		$('#success-message').html('');
	}
}

// return idx of duplicate if dupliacte else false
function checkDuplicate(lineData, duplicateCheckIdx) {
	// skip header
	for(let i=1; i<data.length; i++) {
		// check each entry to see if the item at the duplicateCheckIdx is 
		if(data[i][duplicateCheckIdx] == lineData[duplicateCheckIdx]) return i;
	}
	return -1;
}

// export { downloadCSV, readCSV, clearData };