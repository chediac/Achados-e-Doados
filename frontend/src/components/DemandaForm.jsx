import React from 'react';
import { Input } from './Input';

export function DemandaForm({ formData, onChange, onSubmit, saving, submitLabel = 'Salvar', onCancel }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Título *"
        name="titulo"
        value={formData.titulo}
        onChange={onChange}
        placeholder="Ex: Doação de roupas de inverno"
        required
      />

      <div>
        <label className="block text-sm font-medium mb-1">Descrição *</label>
        <textarea
          name="descricao"
          value={formData.descricao}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows="4"
          placeholder="Descreva a necessidade em detalhes"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Categoria *</label>
        <select
          name="categoria"
          value={formData.categoria}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="Alimentos">Alimentos</option>
          <option value="Roupas">Roupas</option>
          <option value="Móveis">Móveis</option>
          <option value="Brinquedos">Brinquedos</option>
          <option value="Materiais de Higiene">Materiais de Higiene</option>
          <option value="Materiais Escolares">Materiais Escolares</option>
          <option value="Eletrônicos">Eletrônicos</option>
          <option value="Outros">Outros</option>
        </select>
      </div>

      <Input
        label="Quantidade (descrição)"
        name="quantidadeDescricao"
        value={formData.quantidadeDescricao}
        onChange={onChange}
        placeholder="Ex: 50 kg de alimentos não perecíveis"
      />

      <div>
        <label className="block text-sm font-medium mb-1">Nível de Urgência *</label>
        <select
          name="nivelUrgencia"
          value={formData.nivelUrgencia}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="Baixa">Baixa</option>
          <option value="Média">Média</option>
          <option value="Alta">Alta</option>
        </select>
      </div>

      <Input
        label="Prazo Desejado"
        name="prazoDesejado"
        type="date"
        value={formData.prazoDesejado}
        onChange={onChange}
      />

      <Input
        label="Meta Numérica (opcional)"
        name="metaNumerica"
        type="number"
        value={formData.metaNumerica}
        onChange={onChange}
        placeholder="Ex: 100"
        min="0"
      />

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="ABERTA">Aberta</option>
          <option value="EM_PROGRESSO">Em Progresso</option>
          <option value="CONCLUIDA">Concluída</option>
          <option value="CANCELADA">Cancelada</option>
        </select>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={saving}
          className={`px-6 py-2 rounded-md text-white font-medium ${
            saving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {saving ? 'Salvando...' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default DemandaForm;
