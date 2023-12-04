import {
	DynamoDBClient,
	ScanCommand,
	PutItemCommand
} from "@aws-sdk/client-dynamodb"
import AWS from "aws-sdk"

// Configure o AWS SDK
AWS.config.update({
	region: process.env.AWS_REGION,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const sqs = new AWS.SQS()
const QUEUE_URL =
	"https://sqs.us-east-1.amazonaws.com/408959651419/fila-teste.fifo"

const dynamoDBClient = new DynamoDBClient({ region: "us-east-1" })

async function handleGetRequest(req, res) {
	const scanParams = {
		TableName: "Transactions"
	}

	try {
		const { Items } = await dynamoDBClient.send(new ScanCommand(scanParams))
		console.log("Items retrieved from DynamoDB:", Items)
		res.status(200).json(Items)
	} catch (error) {
		console.error("Error fetching transactions:", error)
		res.status(500).json({ error: "Error fetching transactions" })
	}
}

 async function handlePostRequest(req, res) {
 	const { idempotencyId, amount, type } = req.body

 	 //Valide os dados da requisição
 	if (!idempotencyId || !amount || !type) {
 		return res.status(400).json({
 			error: "Todos os campos são obrigatórios: idempotencyId, amount, type"
 		})
 	}

 	const transaction = {
 		idempotencyId,
 		amount,
 		type,
 		timestamp: new Date().toISOString()
 	}

 	 //Monta os parâmetros para enviar para a fila SQS
 	const params = {
 		MessageBody: JSON.stringify(transaction),
 		QueueUrl: QUEUE_URL,
 		MessageGroupId: "TransactionGroup",
 		MessageDeduplicationId: idempotencyId
 	}

 	try {
 		 //Envia a transação para a fila SQS
 		await sqs.sendMessage(params).promise()
 		console.log("Transação enviada para a fila SQS:", transaction)
 		res.status(201).json({
 			message: "Transação enviada com sucesso",
 			transaction
 		})
 	} catch (err) {
 		console.error("Erro ao enviar para a fila:", err)
 		res.status(500).json({ error: "Erro ao enviar transação" })
 	}
 }


export default function handler(req, res) {
	if (req.method === "GET") {
		return handleGetRequest(req, res)
	} else if (req.method === "POST") {
		return handlePostRequest(req, res)
	} else {
		// Se não for GET ou POST, retorna 405 Method Not Allowed
		res.setHeader("Allow", ["GET", "POST"])
		res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}