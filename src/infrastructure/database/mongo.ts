import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/customer_db';
    await mongoose.connect(mongoUrl);
    console.log('MongoDB conectado com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar no MongoDB:', error);
    process.exit(1); // se nao conectar, a gente para a aplicacao
  }
};
