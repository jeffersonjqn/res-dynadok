// interface pro nosso servico de cache seguindo a ideia do clean architecture de depender de abstracoes
// a doc do node redis destaca desacoplar o client pra controlar conexao e reconexao entao padronizei
// os metodos "obter", "salvar" e "remover"

export interface CacheService {
  obter <T> (key: string): Promise <T | null>;
  salvar (key: string, value: any, ttl: number): Promise<void>;
  remover (key: string): Promise<void>;
}
