import mongoose, { Schema, Document } from 'mongoose';

// esse é o schema do mongoose
// ele que vai dizer como os dados vao ser guardados no mongo

export interface CustomerDocument extends Document {
  nome: string;
  email: string;
  telefone: string;
}

const CustomerSchema: Schema = new Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefone: { type: String, required: true },
  },
  { timestamps: true } // o mongoose ja coloca createdAt e updatedAt pra gente
);

export const CustomerModel = mongoose.model<CustomerDocument>('Customer', CustomerSchema);
