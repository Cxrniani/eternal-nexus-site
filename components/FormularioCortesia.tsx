import React, { useState } from 'react';

const FormularioCortesia = () => {
  const [formData, setFormData] = useState({
    event_id: 'etternal-nexus', // Valor fixo para o ID do evento
    name: '',
    email: '',
    cpf: '',
    user_id: '',
    quantity: 1,
    price: 0.00,
    lot: 'Cortesia',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tickets, setTickets] = useState<{ code: string }[]>([]);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const fetchUserIdByEmail = async (email: string) => {
    try {
      const response = await fetch('http://127.0.0.1:3000/get_user_id_by_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar ID do usuário');
      }

      const data = await response.json();
      return data.user_id; // Retorna o user_id
    } catch (err) {
      throw new Error('Erro ao buscar ID do usuário');
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTickets([]);

    try {
      // Busca o user_id com base no email
      const user_id = await fetchUserIdByEmail(formData.email);

      // Atualiza o formData com o user_id obtido
      const updatedFormData = { ...formData, user_id };

      // Envia os dados para gerar os ingressos
      const response = await fetch('http://127.0.0.1:3000/generate_ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao gerar ingressos');
      }

      const data = await response.json();
      setTickets(data.tickets);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro desconhecido');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Gerar Ingressos de Cortesia</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">ID do Evento</label>
          <input
            type="text"
            name="event_id"
            value={formData.event_id}
            readOnly
            className="w-full p-2 border text-zinc-500 border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Nome e Sobrenome</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">CPF</label>
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Quantidade</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            min="1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Preço</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            step="0.01"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Lote</label>
          <input
            type="text"
            name="lot"
            value={formData.lot}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Gerando...' : 'Gerar Ingressos'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {tickets.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Ingressos Gerados</h2>
          <ul className="bg-white p-6 rounded-lg shadow-md">
            {tickets.map((ticket, index) => (
              <li key={index} className="mb-2">
                <strong>Código:</strong> {ticket.code}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FormularioCortesia;