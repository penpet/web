import { uniqueNamesGenerator, Config, animals } from 'unique-names-generator'

const config: Config = {
	dictionaries: [['Anonymous'], animals],
	separator: ' ',
	style: 'capital'
}

const getRandomName = () => uniqueNamesGenerator(config)

export default getRandomName
