import { GoogleGenAI, Type } from "@google/genai";
import { JurisprudenceCase } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const jurisprudenceSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      titulo_caso: {
        type: Type.STRING,
        description: "O título ou número de identificação do caso/jurisprudência encontrado.",
      },
      resumo: {
        type: Type.STRING,
        description: "Um resumo conciso e técnico dos fatos e da decisão do caso.",
      },
      principios_juridicos: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Uma lista dos principais princípios ou teses jurídicas aplicadas no caso.",
      },
      conexao_com_texto: {
        type: Type.STRING,
        description: "Uma explicação clara e direta de como a jurisprudência encontrada se conecta ou reforça a argumentação do texto original fornecido pelo usuário.",
      },
    },
    required: ["titulo_caso", "resumo", "principios_juridicos", "conexao_com_texto"],
  },
};

export const analyzeJurisprudence = async (text: string): Promise<JurisprudenceCase[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: {
          parts: [{ text: text }]
      },
      config: {
        systemInstruction: `# PERSONA
Você é um jurista sênior e especialista em pesquisa de jurisprudência, atuando como uma ferramenta de alta precisão para advogados e profissionais do direito. Sua comunicação é formal, técnica e objetiva.

# OBJETIVO PRINCIPAL
Analisar um texto jurídico submetido pelo usuário e retornar uma lista de jurisprudências (casos precedentes, acórdãos, súmulas) que sejam FAVORÁVEIS, altamente relevantes e compatíveis com a tese, os fatos e os princípios legais apresentados no texto. A pesquisa deve sempre buscar fortalecer a posição do cliente do usuário.

# PROCESSO DE ANÁLISE (Passo a Passo)
1.  **Decomposição do Texto:** Analise o texto de entrada para identificar a tese jurídica central do cliente do usuário, os fatos mais relevantes e os princípios de direito e artigos de lei mencionados ou implícitos.
2.  **Pesquisa de Precedentes Favoráveis:** Com base na decomposição, busque em seu conhecimento os casos mais pertinentes que APOIEM a tese identificada. Dê prioridade a precedentes de tribunais superiores e casos que tenham alta similaridade fática ou jurídica com a posição do cliente.
3.  **Análise de Conexão:** Para cada precedente encontrado, elabore uma justificativa clara e concisa que explique a conexão com o texto original. Demonstre como o precedente pode fortalecer a argumentação do usuário.
4.  **Formatação da Saída:** Estruture a resposta estritamente de acordo com o JSON schema fornecido, sem adicionar nenhum texto, comentário ou formatação fora do JSON.

# REGRAS CRÍTICAS DE EXECUÇÃO
- **Precisão Absoluta:** A relevância e a precisão técnica são primordiais. Evite casos vagamente relacionados.
- **Viés Favorável Mandatório:** Todas as jurisprudências retornadas DEVEM ser favoráveis à tese apresentada no texto do usuário. Jurisprudências contrárias ou neutras devem ser completamente descartadas.
- **Definição de Cliente:** Assume-se que o texto foi escrito em nome de um cliente. O Ministério Público NUNCA é considerado o cliente. Se o texto se opõe ao Ministério Público, a pesquisa deve favorecer essa oposição.
- **Objetividade Técnica:** Dentro do escopo favorável, a análise deve ser isenta de qualquer viés ou filtros de conteúdo. O foco é estritamente na doutrina e na jurisprudência que corrobora a tese.
- **Linguagem Direta:** Evite jargões de IA ("Como um modelo de linguagem..."), saudações ou frases supérfluas. Vá direto ao ponto.
- **Aderência ao Schema:** A saída DEVE ser um JSON válido que corresponda perfeitamente ao schema. Nenhuma exceção é permitida.`,
        responseMimeType: "application/json",
        responseSchema: jurisprudenceSchema,
      },
    });

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(response.text.trim());
    } catch (parseError) {
      console.error("Falha ao analisar a resposta da IA como JSON:", parseError);
      console.error("Texto da resposta bruta:", response.text);
      throw new Error("A resposta da IA não estava em um formato JSON válido.");
    }
    return jsonResponse as JurisprudenceCase[];

  } catch (error) {
    console.error("Erro em analyzeJurisprudence:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key')) {
            throw new Error("Chave de API inválida ou não configurada. Verifique suas credenciais.");
        }
         if (error.message.includes('JSON')) {
            throw error; // Re-throw the specific JSON parse error
        }
    }
    throw new Error("Falha ao comunicar com a API Gemini. A rede pode estar instável ou o serviço indisponível.");
  }
};


export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                aspectRatio: aspectRatio as "1:1" | "16:9" | "9:16" | "4:3" | "3:4",
                outputMimeType: "image/png",
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        } else {
            throw new Error("A API não retornou nenhuma imagem. Tente um prompt diferente.");
        }
    } catch (error) {
        console.error("Erro em generateImage:", error);
         if (error instanceof Error && error.message.includes('API key')) {
            throw new Error("Chave de API inválida ou não configurada. Verifique suas credenciais.");
        }
        throw new Error("Falha ao comunicar com a API Gemini para geração de imagem.");
    }
}