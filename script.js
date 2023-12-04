const apiUrl = "http://localhost:3000/api/transactions"

// Função para gerar dados aleatórios
const generateRandomData = () => {
	const randomNumber = Math.floor(Math.random() * 1000)
	const idempotencyId = `id_${randomNumber}`
	const amount = Math.random() * 1000 // Valor aleatório para a quantia
	const type = Math.random() > 0.5 ? "credit" : "debit" // Aleatoriamente escolhe 'credit' ou 'debit'

	return {
		idempotencyId,
		amount,
		type
	}
}
const totalRequests = 100

const makePostRequest = async () => {
	try {
		const postData = generateRandomData()

		const response = await fetch(apiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(postData)
		})

		if (!response.ok) {
			throw new Error(
				`Erro na requisição: ${response.status} - ${response.statusText}`
			)
		}

		const responseData = await response.json()
		console.log("Resposta da requisição:", responseData)
	} catch (error) {
		console.error(error.message)
	}
}

const makeMultipleRequests = async () => {
	for (let i = 0; i < totalRequests; i++) {
		console.log(`Enviando requisição ${i + 1} de ${totalRequests}`)
		await makePostRequest()
	}
}

makeMultipleRequests()