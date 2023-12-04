const express = require("express")
const bodyParser = require("body-parser")

const app = express()
const PORT = 3000

app.use(bodyParser.json())

let transactions = []

app.post("/api/transactions", async (req, res) => {
	const { idempotencyId, amount, type } = req.body

	if (!idempotencyId || !amount || !type) {
		return res.status(400).json({
			error: "Todos os campos são obrigatórios: idempotencyId, amount, type"
		})
	}
	console.log("Criado com sucesso")
	const transaction = {
		idempotencyId,
		amount,
		type,
		timestamp: new Date().toISOString()
	}

	transactions.push(transaction)
	require("dotenv").config()

	const AWS = require("aws-sdk")

	const credentials = {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		region: process.env.AWS_REGION
	}

	AWS.config.update(credentials)

	const sqs = new AWS.SQS()

	const queueUrl =
		"https://sqs.us-east-1.amazonaws.com/408959651419/fila-teste.fifo"

	const params = {
		MessageBody: JSON.stringify(req.body),
		MessageGroupId: "TransactionGroup",
		QueueUrl: queueUrl,
		MessageDeduplicationId: req.body.idempotencyId
	}

	try {
		const data = await sqs.sendMessage(params).promise()
		console.log("Mensagem enviada para a fila:", data.MessageId)
		res.status(201).json({ message: "Transação enviada", transaction })
	} catch (err) {
		console.error("Erro ao enviar para a fila:", err)
		res.status(500).json({ error: "Erro ao enviar transação" })
	}
})
app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`)
})