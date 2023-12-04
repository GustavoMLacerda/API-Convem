import { useEffect, useState } from "react"

const Transacoes = () => {
	const [transacoes, setTransacoes] = useState([])

	useEffect(() => {
		const fetchTransacoes = async () => {
			const res = await fetch("http://localhost:3000/api/transactions")
			const data = await res.json()
			setTransacoes(
				data.map((item) => ({
					idempotencyId: item.idempotencyId.S,
					amount: parseFloat(item.amount.N).toFixed(2),
					type: item.type.S
				}))
			)
		}

		fetchTransacoes()
		// Defina um intervalo para atualizar as transações periodicamente
		const interval = setInterval(fetchTransacoes, 1000) // atualiza a cada 5 segundos

		// Limpar o intervalo quando o componente for desmontado
		return () => clearInterval(interval)
	}, [])

	return (
		<div>
			<h1 style={{ textAlign: "center" }}>Transações</h1>
			<ul style={{ listStyle: "none", padding: 0 }}>
				{transacoes.map((transacao, index) => (
					<li
						key={index}
						style={{
							border: "1px solid #ccc",
							padding: "10px",
							marginBottom: "10px",
							backgroundColor: "#f5f5f5"
						}}>
						<p>
							<strong>ID:</strong> {transacao.idempotencyId}
						</p>
						<p>
							<strong>Amount:</strong> {transacao.amount}
						</p>
						<p>
							<strong>Type:</strong> {transacao.type}
						</p>
					</li>
				))}
			</ul>
		</div>
	)
}

export default Transacoes