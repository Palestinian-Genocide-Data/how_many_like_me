let datasource = {}
let beggining_of_time = new Date()

/** Main function */
function main() {
	const elements = document.querySelectorAll(".hk")
	const hookups = {}

	for (el of elements) {
		const dt = el.getAttribute('datum')
		hookups[dt] ??= []
		hookups[dt].push(el)
	}

	console.log(hookups)

	datasource = generateDataSource()

	fillData(hookups, datasource)
}

/** Fills the HTML elements with the data from the source. */
function fillData(hookups, source) {
	for (const key of Object.keys(hookups)) {
		let content = source[key]

		hookups[key].map((el) => {
			if (typeof content == 'string') {
				el.innerHTML = content
			}

			if (typeof content == 'function') {
				setInterval(content, 1, el)
			}
		})
	}
}

/** Pulls the data from the CSV files */
function generateDataSource(target) {
	return {
		name: "Man",
		age: "30",
		country: "Indonesia",
		city: "Jakarta",

		alike_death_count: (el) => el.innerHTML = f_x(beggining_of_time, 1).toFixed(0),
	}
}

