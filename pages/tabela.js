import { useEffect, useState } from 'react';

const Transacoes = ({ transacoes }) => {
  return (
    <div>
      <h1>Transações</h1>
      <ul>
        {transacoes.map((transacao, index) => (
          <li key={index}>
            <p>ID: {transacao.idempotencyId}</p>
            <p>Amount: {transacao.amount}</p>
            <p>Type: {transacao.type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/transacoes');
  const transacoes = await res.json();

  return {
    props: {
      transacoes,
    },
  };
}

export default Transacoes;
