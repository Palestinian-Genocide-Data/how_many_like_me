/** Line equation that generates a number given a starting date and a rate in seconds */
function f_x(start_date, rate_hz) {
	const now = new Date()
	return ((now - start_date) / 1000) * rate_hz;
}

/** Converts days to seconds */
function days_to_seconds (days) {
	return days * 3600 * 24;
}

/** Reads a file from the server as CSV */
async function read_as_csv(file_path) {
	try {
		const res = await fetch(file_path);

		if (res.ok) {
			const raw = await res.text();
			return Papa.parse(raw, {
				dynamicTyping: true
			});
		}

		console.error('Failed to load the CSV file.');
	} catch(e) {
		console.error('An unexpected error occured.');
		console.error(e);
	}
}