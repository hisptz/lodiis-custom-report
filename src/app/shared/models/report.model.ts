export interface Report {
  id: string,
  name: string,
  program: string,
  dxConfig: DxConfig[]
}

interface DxConfig {
  programStage: string,
  name: string,
  id: string
}
