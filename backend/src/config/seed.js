const Doce = require('../models/Doce');

const docesIniciais = [
  {
    nome: 'Bolo de Cenoura com Cobertura de Brigadeiro',
    tipo: 'Bolo',
    preco: 16.50,
    fotoUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80'
  },
  {
    nome: 'Brigadeiro Tradicional Belga',
    tipo: 'Brigadeiro',
    preco: 4.50,
    fotoUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80'
  },
  {
    nome: 'Cupcake Red Velvet com Cream Cheese',
    tipo: 'Cupcake',
    preco: 11.90,
    fotoUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&auto=format&fit=crop&q=80'
  },
  {
    nome: 'Torta Holandesa Cremosa',
    tipo: 'Torta',
    preco: 18.00,
    fotoUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=80'
  }
];

async function seedDocesSeVazio() {
  try {
    const total = await Doce.countDocuments();
    if (total === 0) {
      await Doce.insertMany(docesIniciais);
      console.log('🧁 Banco de dados populado com 4 delícias iniciais para teste!');
    }
  } catch (err) {
    console.error('Aviso ao popular banco:', err.message);
  }
}

module.exports = { seedDocesSeVazio, docesIniciais };
