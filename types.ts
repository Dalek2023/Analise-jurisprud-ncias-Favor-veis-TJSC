
export interface JurisprudenceCase {
  titulo_caso: string;
  resumo: string;
  principios_juridicos: string[];
  conexao_com_texto: string;
}

export interface AspectRatioOption {
  value: "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
  label: string;
}
