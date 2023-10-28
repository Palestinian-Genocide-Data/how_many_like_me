let beggining_of_time = new Date()
let population_data 
let datasource
const profile_input_elements = {}
const hookups = {}

/** Main function */
async function main() {
	population_data = await populationDataByCity(datasource)
	datasource = await generateDataSource()

	// Retrieve the elements from the profile section.
	const p_els = document.querySelectorAll(".profile-datum")
	for (el of p_els) {
		profile_input_elements[el.getAttribute('datum')] = el
	}

	// Retrive the hookups from the rest of the page.
	const hk_els = document.querySelectorAll(".hk")
	for (el of hk_els) {
		const dt = el.getAttribute('datum')
		hookups[dt] ??= []
		hookups[dt].push(el)
	}
}

async function generateDataSource() {
	let result = {}

	result.gender = "man"
	result.country = "United States"
	result.city = "New York"
	result.age = 14
	result.alike_death_count = 30

	return result
}

/** Organizes the population data by country and city */
async function populationDataByCity() {
	let population_data = await read_as_csv('./data/d_population.csv')

	const result = {}

	for (i in population_data.data) {
		let el = population_data.data[i]

		result[el[1]] ??= {}
		result[el[1]][el[0]] = {
			populatiopn: el[2]
		}
	}

	return result
}

function update() {
	for (const [k, el] of Object.entries(profile_input_elements)) {
		datasource[k] = el.value
	}

	console.log(profile_input_elements)

	datasource.gender_pl = {woman: 'women', man: 'men'}[datasource.gender]
	
	datasource.overall_death_count = 124
	datasource.same_gender_death_count = 20
	datasource.same_age_death_count = 4

	console.log(datasource)

	fillData(hookups, datasource)
}

/** Fills the HTML elements with the data from the source. */
function fillData(hookups, source) {
	for (const key of Object.keys(hookups)) {
		let content = source[key]

		if (!content) {
			console.error(`Missing data for ${key}.`)
			continue;
		}

		hookups[key].forEach((el) => {
			if (typeof content == 'string') {
				el.innerHTML = content
				return
			}

			if (typeof content == 'function') {
				el.innerHTML = content().toString
				//setInterval(content, 1, el)
				return
			}

			el.innerHTML = content.toString()
		})
	}
}
