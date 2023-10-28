let beggining_of_time = new Date()
let datasource = {
	gender: "man",
	gender_pl: "men" 
}

let population_data 

/** Main function */
async function main() {
	population_data = await populationDataByCity(datasource)

	const elements = document.querySelectorAll(".hk")
	const hookups = {}

	for (el of elements) {
		const dt = el.getAttribute('datum')
		hookups[dt] ??= []
		hookups[dt].push(el)
	}


	//fillData(hookups, datasource)
}

async function populationDataByCity() {
	let population_data = await read_as_csv('./data/d_population.csv')

	const result = {}

	for (i in population_data.data) {
		let el = population_data.data[i]

		result[el[2]] ??= []
		result[el[2]][el[1]] ??= []
		result[el[2]][el[1]].push(el.slice(0))
		console.log(el)
	}

	return result
}

/** Fills the HTML elements with the data from the source. */
function fillData(hookups, source) {
	for (const key of Object.keys(hookups)) {
		let content = source[key]

		hookups[key].forEach((el) => {
			if (typeof content == 'string') {
				el.innerHTML = content
				return
			}

			if (typeof content == 'function') {
				setInterval(content, 1, el)
				return
			}

			el.innerHTML = content.toString()
		})
	}
}
