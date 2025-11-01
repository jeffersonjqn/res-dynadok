import { BaseEntity } from './base.entity';

// essa é a entidade de cliente
// o que um cliente precisa ter

export class Customer extends BaseEntity {
  nome: string;
  email: string;
  telefone: string;

  constructor(nome: string, email: string, telefone: string) {
    super();
    this.nome = nome;
    this.email = email;
    this.telefone = telefone;
  }
}
