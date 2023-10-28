let beggining_of_time = new Date()

let population_data 
let palestine_data

let profile_data = {}
const profile_input_elements = {}

/** The elements in the page that will have their values changed. */
const hookups = {}

/** Main function */
async function main() {
	population_data = await getPopulationDataByCity()
	palestine_data = await getPalestineData()

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

	update()
}

/** Organizes the population data by country and city */
async function getPopulationDataByCity() {
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

async function getPalestineData() {
	let palestine_data = (await read_as_csv('./data/d_palestine.csv')).data.slice(5)

	return palestine_data
}

/** Updates all the data based on the inputs and the statistical data. */
function update() {
	for (const [k, el] of Object.entries(profile_input_elements)) {
		profile_data[k] = el.value
	}

	profile_data.gender_pl = {woman: 'women', man: 'men'}[profile_data.gender]
	
	profile_data.overall_death_count = 124
	profile_data.same_gender_death_count = 20
	profile_data.same_age_death_count = 4

	fillData(hookups, profile_data)
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
