export enum Status {
  ATIVO = 'ATIVO',
  BLOQUEADO = 'BLOQUEADO'
}

export type EmployeeData = {
  datacad: string,
  cargo: string,
  cpf: string,
  nome: string,
  ufnasc: string,
  salario: number,
  status: Status
}
