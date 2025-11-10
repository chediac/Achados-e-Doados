import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

// Corrigir ícones do Leaflet (bug conhecido no bundler)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export function MapaInstituicoes() {
  const [instituicoes, setInstituicoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInstituicoes();
  }, []);

  const fetchInstituicoes = async () => {
    try {
      const res = await fetch('/api/instituicoes');
      if (res.ok) {
        const data = await res.json();
        // Filtrar apenas instituições com coordenadas válidas
        const instituicoesComLocalizacao = data.filter(
          inst => inst.latitude && inst.longitude
        );
        setInstituicoes(instituicoesComLocalizacao);
      } else {
        setError('Erro ao carregar instituições');
      }
    } catch (err) {
      setError('Erro de rede: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Centro do Brasil como posição inicial
  const centerBrasil = [-15.7942, -47.8822];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold">📍 Mapa de Instituições</h1>
            <p className="mt-2 text-blue-100">
              Encontre instituições próximas a você no mapa
            </p>
          </div>
        </div>

        {/* Map Container */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {loading && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Carregando mapa...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {instituicoes.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600">
                    Nenhuma instituição com localização cadastrada ainda.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                    <p className="text-gray-700">
                      <span className="font-semibold">{instituicoes.length}</span> instituição(ões) 
                      encontrada(s) com localização
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <MapContainer
                      center={centerBrasil}
                      zoom={4}
                      style={{ height: '600px', width: '100%' }}
                      className="z-0"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      
                      {instituicoes.map((inst) => (
                        <Marker
                          key={inst.id}
                          position={[inst.latitude, inst.longitude]}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-bold text-lg text-blue-600">
                                {inst.nome}
                              </h3>
                              {inst.endereco && (
                                <p className="text-sm text-gray-600 mt-1">
                                  📍 {inst.endereco}
                                  {inst.numero && `, ${inst.numero}`}
                                </p>
                              )}
                              {inst.cidade && inst.estado && (
                                <p className="text-sm text-gray-600">
                                  {inst.cidade} - {inst.estado}
                                </p>
                              )}
                              {inst.telefone && (
                                <p className="text-sm text-gray-600 mt-1">
                                  📞 {inst.telefone}
                                </p>
                              )}
                              <Link
                                to={`/?instituicao=${inst.id}`}
                                className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Ver Demandas
                              </Link>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MapaInstituicoes;
