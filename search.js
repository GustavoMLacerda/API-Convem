const AWS = require('aws-sdk');
const express = require('express');
const app = express();

// Configurar as credenciais da AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Criar um objeto DynamoDB DocumentClient
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Definir rota para buscar todos os registros da tabela
app.get('/buscarRegistros', async (req, res) => {
  const params = {
    TableName: 'DynamoDB_Tabela'
    // Outros parâmetros podem ser adicionados, dependendo da necessidade
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    res.json(data.Items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Iniciar o servidor na porta desejada
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
