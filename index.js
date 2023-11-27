const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let transactions = [];

app.post('/transactions', (req, res) => {
  const { idempotencyId, amount, type } = req.body;

  if (!idempotencyId || !amount || !type) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios: idempotencyId, amount, type' });
  }
console.log('Criado com sucesso')
  const transaction = {
    idempotencyId,
    amount,
    type,
    timestamp: new Date().toISOString()
  };

  transactions.push(transaction);
require('dotenv').config(); 

const AWS = require('aws-sdk');

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};

AWS.config.update(credentials);

const sqs = new AWS.SQS();

const queueUrl = 'https://sqs.us-east-1.amazonaws.com/408959651419/fila-teste.fifo';

const params = {
  MessageBody: JSON.stringify (transaction),
  MessageGroupId: 'GrupoIndex',
  QueueUrl: queueUrl,
  MessageDeduplicationId: transaction.idempotencyId,
};

sqs.sendMessage(params, (err, data) => {
  if (err) {
    console.log('Erro ao enviar a mensagem para a fila:', err);
  } else {
    console.log('Mensagem enviada com sucesso para a fila:', data.MessageId);
  }
});

  return res.status(201).json({ message: 'Transação criada com sucesso', transaction });
});
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
