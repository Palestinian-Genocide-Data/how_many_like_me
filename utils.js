/** Line equation that generates a number given a starting date and a rate in seconds */
function f_x(start_date, rate_hz) {
	const now = new Date()
	return ((now - start_date) / 1000) * rate_hz
}

/** Converts days to seconds */
function days_to_seconds (days) {
	return days * 3600 * 24
}