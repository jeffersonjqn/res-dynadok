// entidade base pra todo mundo ter id e data de criacao/update

export abstract class BaseEntity {
  id?: string; // o id é gerado pelo banco, entao é opcional
  createdAt?: Date;
  updatedAt?: Date;
}
