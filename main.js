let beggining_of_time = 21 //days ago
let beggining_of_session = new Date()

let population_data 
let palestine_data
let precomputed_palestine_statistics = {}

let hookup_data = {
	country: 'United States',
	city: 'New York'
}
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

		result[el[1]?.toLowerCase()] ??= {}
		result[el[1]?.toLowerCase()][el[0]?.toLowerCase()] = {
			population: el[2]
		}
	}

	return result
}

/** Retrieves the CSV data to calculate Palestinian statistics on. */
async function getPalestineData() {
	let palestine_data = {
		og_population: 2375259,
		children_percentage: {
			overall: 0.395,
			female: 0.181,
			male: 0.2141
		},
		infant_percentage: {
			overall: 0.0912,
			female: 0.0479,
			male: 0.0433
		}
	}

	palestine_data.deaths = (await read_as_csv('./data/d_palestine.csv')).data.slice(5)

	return palestine_data
}

/** Cache to lighten the load. */
async function precomputePalestineStatistics() {
	// General
	hookup_data.death_percentage = palestine_data.deaths.length / palestine_data.og_population

	// You should know that...

	hookup_data.same_gender_death_count = count(palestine_data.deaths, (e) => e[2] == {man: 'Male', woman: 'Feminine'}[hookup_data.gender])
	hookup_data.same_age_death_count = count(palestine_data.deaths, (e) => e[4] == hookup_data.age)
	hookup_data.overall_death_count = count(palestine_data.deaths, (e) =>
		true
		&& e[2] == {man: 'Male', woman: 'Feminine'}[hookup_data.gender]
		&& e[4] == hookup_data.age
	)

	// Expressed in time that means...

	hookup_data.similar_death_count_per_day = Math.floor(hookup_data.overall_death_count / beggining_of_time)
	hookup_data.hours_between_similar_deaths = 24 / hookup_data.similar_death_count_per_day

	// In your country
	let your_country_data = population_data[hookup_data['country'].toLowerCase()]
	let your_city_data = your_country_data?.[hookup_data['city'].toLowerCase()]

	console.log(your_city_data)

	if (your_country_data) {
		let country_population = Object.values(your_country_data).reduce((acc, city) => acc + city.population, 0)
		hookup_data.deaths_in_your_country = Math.ceil(country_population * hookup_data.death_percentage)
		hookup_data.child_deaths_in_your_country = Math.ceil(hookup_data.deaths_in_your_country * palestine_data.children_percentage.overall)
		hookup_data.infant_deaths_in_your_country = Math.ceil(hookup_data.deaths_in_your_country * palestine_data.infant_percentage.overall)
	}

	// In your city
	if (your_city_data) {
		console.log(hookup_data['city'])
		hookup_data.deaths_in_your_city = Math.ceil(your_city_data.population * hookup_data.death_percentage)
		hookup_data.child_deaths_in_your_city = Math.ceil(hookup_data.deaths_in_your_city * palestine_data.children_percentage.overall)
		hookup_data.infant_deaths_in_your_city = Math.ceil(hookup_data.deaths_in_your_city * palestine_data.infant_percentage.overall)
	
		hookup_data.deaths_in_your_city_per_day = Math.ceil(hookup_data.deaths_in_your_city / beggining_of_time)
		hookup_data.child_deaths_in_your_city_per_day = Math.ceil(hookup_data.child_deaths_in_your_city / beggining_of_time)
		hookup_data.infant_deaths_in_your_city_per_day = Math.ceil(hookup_data.infant_deaths_in_your_city / beggining_of_time)
	}
}

/** Updates all the data based on the inputs and the statistical data. */
async function update() {
	for (const [k, el] of Object.entries(profile_input_elements)) {
		hookup_data[k] = el.value
	}

	hookup_data.gender_pl = {woman: 'women', man: 'men'}[hookup_data.gender]
	
	clearData(hookups)

	await precomputePalestineStatistics()

	fillData(hookups, hookup_data)
}

/** Clear HTML elements with '...'s. */
function clearData(hookups) {
	for (const key of Object.keys(hookups)) {
		hookups[key].forEach((el) => el.innerHTML = "⟳")
	}
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

			if (typeof content == 'number') {
				el.innerHTML = content.toLocaleString()
				return
			}

			el.innerHTML = content.toString()
		})
	}
}
