const mongoose = require('mongoose');

const doceSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome do doce é obrigatório.'],
      trim: true,
      minlength: [2, 'O nome deve ter no mínimo 2 caracteres.']
    },
    tipo: {
      type: String,
      required: [true, 'O tipo do doce é obrigatório.'],
      trim: true
    },
    preco: {
      type: Number,
      required: [true, 'O preço do doce é obrigatório.'],
      min: [0, 'O preço não pode ser negativo.']
    },
    fotoUrl: {
      type: String,
      required: [true, 'A URL da foto do doce é obrigatória.'],
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.models.Doce || mongoose.model('Doce', doceSchema);
