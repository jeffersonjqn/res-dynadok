// repositorio base com os metodos que todo mundo vai usar
// T é um generico pra gente poder usar com qualquer entidade

export interface BaseRepository<T> {
  criar(item: T): Promise<T>;
  atualizar(id: string, item: Partial<T>): Promise<T | null>;
  remover(id: string): Promise<boolean>;
  buscarPorId(id: string): Promise<T | null>;
  buscarTodos(): Promise<T[]>;
}
