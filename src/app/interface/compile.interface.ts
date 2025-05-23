export interface CompileRequest {
  code: string;
}

export interface response<TEntity> {
  success: boolean;
  message: string;
  data: TEntity;
}
