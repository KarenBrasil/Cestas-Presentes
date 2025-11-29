import React, { useState } from 'react';
import { generateGiftMessage } from '../services/geminiService';

interface MessageGeneratorProps {
  onMessageSelect: (msg: string) => void;
  currentMessage: string;
}

const MessageGenerator: React.FC<MessageGeneratorProps> = ({ onMessageSelect, currentMessage }) => {
  const [recipient, setRecipient] = useState('');
  const [occasion, setOccasion] = useState('');
  const [tone, setTone] = useState('Romântico');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!recipient || !occasion) return;
    setLoading(true);
    const msg = await generateGiftMessage(recipient, occasion, tone, details);
    onMessageSelect(msg);
    setLoading(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mt-4">
      <h3 className="font-semibold text-rose-600 flex items-center gap-2 mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0 1 1 0 002 0zm-1 8a1 1 0 100-2 1 1 0 000 2zm.707-10.293a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 6.414V9a1 1 0 102 0V6.414l2.293 2.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" />
        </svg>
        Assistente de Cartão (IA)
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <input 
          type="text" 
          placeholder="Para quem? (ex: Maria)" 
          className="border p-2 rounded text-sm w-full"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="Ocasião? (ex: Aniversário)" 
          className="border p-2 rounded text-sm w-full"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <select 
          className="border p-2 rounded text-sm w-full"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option>Romântico</option>
          <option>Engraçado</option>
          <option>Formal</option>
          <option>Carinhoso</option>
        </select>
        <input 
          type="text" 
          placeholder="Detalhes (ex: ama vinho)" 
          className="border p-2 rounded text-sm w-full"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>

      <button 
        onClick={handleGenerate} 
        disabled={loading || !recipient || !occasion}
        className="w-full bg-indigo-100 text-indigo-700 py-2 rounded-md text-sm font-medium hover:bg-indigo-200 transition-colors disabled:opacity-50 flex justify-center items-center"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Criando mágica...
          </span>
        ) : "Gerar Mensagem com IA ✨"}
      </button>

      <textarea 
        className="w-full border p-2 rounded mt-3 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
        rows={3}
        placeholder="Sua mensagem aparecerá aqui ou você pode escrever a sua..."
        value={currentMessage}
        onChange={(e) => onMessageSelect(e.target.value)}
      />
    </div>
  );
};

export default MessageGenerator;
