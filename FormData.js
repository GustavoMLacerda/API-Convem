import { useState } from 'react';

export default function FormData() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode enviar os dados para o backend ou fazer qualquer operação necessária
    console.log('Nome:', name);
    console.log('Email:', email);
    // Você pode limpar os campos após enviar os dados se necessário
    setName('');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nameInput">Nome:</label>
        <input
          type="text"
          id="nameInput"
          value={name}
          onChange={handleNameChange}
        />
      </div>
      <div>
        <label htmlFor="emailInput">E-mail:</label>
        <input
          type="email"
          id="emailInput"
          value={email}
          onChange={handleEmailChange}
        />
      </div>
      <button type="submit">Enviar</button>
    </form>
  );
}
import FormData from '../components/FormData';

export default function FormPage() {
  return (
    <div>
      <h1>Preencha o formulário:</h1>
      <FormData />
    </div>
  );
}
