import { GoogleGenerativeAI } from "@google/generative-ai";
import { getVehicleByPlate } from "./plate.service.js";
import { executeSearch } from "./search.service.js";
import { lookupChassi, generateDesmancheCatalog } from "./chassi.service.js";
import { db } from "../config/firebase.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Definição das tools (formato Gemini) ─────────────────────────────────────

const TOOLS = [
  {
    functionDeclarations: [
      {
        name: "buscar_veiculo_por_placa",
        description:
          "Busca dados técnicos do veículo pela placa (marca, modelo, ano, motor, combustível). " +
          "Use SEMPRE que o usuário informar uma placa antes de buscar qualquer peça.",
        parameters: {
          type: "OBJECT",
          properties: {
            placa: {
              type: "STRING",
              description: "Placa do veículo. Exemplos: ABC1234, BRA2E19",
            },
          },
          required: ["placa"],
        },
      },
      {
        name: "buscar_pecas_por_veiculo",
        description:
          "Busca todas as peças disponíveis no catálogo OEM para um veículo específico. " +
          "Use após identificar o veículo pela placa. Retorna peças com OEM, preço e disponibilidade.",
        parameters: {
          type: "OBJECT",
          properties: {
            brand: { type: "STRING", description: "Marca do veículo. Ex: volkswagen" },
            model: { type: "STRING", description: "Modelo do veículo. Ex: gol" },
            engineDisplacement: { type: "STRING", description: "Motor do veículo. Ex: 1.0 flex" },
            fuelType: { type: "STRING", description: "Combustível. Ex: flex" },
            nomePeca: {
              type: "STRING",
              description: "Nome da peça que o usuário quer buscar. Opcional.",
            },
          },
          required: ["brand", "model", "engineDisplacement", "fuelType"],
        },
      },
      {
        name: "validar_oem_para_anuncio",
        description:
          "Valida se um código OEM existe no catálogo masterParts e se é compatível com o veículo informado. " +
          "Use quando o vendedor quiser publicar uma peça e informar o código OEM.",
        parameters: {
          type: "OBJECT",
          properties: {
            oemNumber: { type: "STRING", description: "Código OEM da peça. Ex: 45022-SNA-A00" },
            brand: { type: "STRING", description: "Marca do veículo. Ex: honda" },
            model: { type: "STRING", description: "Modelo do veículo. Ex: civic" },
            year: { type: "STRING", description: "Ano do veículo. Ex: 2018" },
          },
          required: ["oemNumber"],
        },
      },
      {
        name: "consultar_chassi",
        description:
          "Consulta dados técnicos de um veículo pelo número do chassi (VIN de 17 caracteres) " +
          "e retorna o catálogo de peças disponíveis para desmanche.",
        parameters: {
          type: "OBJECT",
          properties: {
            chassi: {
              type: "STRING",
              description: "Número do chassi (VIN) com 17 caracteres. Ex: 9BWZZZ377VT004251",
            },
          },
          required: ["chassi"],
        },
      },
    ],
  },
];

// ─── System prompts por perfil ────────────────────────────────────────────────

function getSystemPrompt(profile) {
  const base = `Você é o assistente da AutoStore, uma plataforma de marketplace de autopeças.
Responda SEMPRE em português brasileiro, de forma clara, objetiva e amigável.
Nunca invente dados — use APENAS informações retornadas pelas ferramentas disponíveis.
Se uma ferramenta não retornar resultado, informe o usuário de forma clara e sugira alternativas.`;

  const profiles = {
    buyer: `${base}

PERFIL: Comprador
Sua missão é garantir que o comprador encontre a peça 100% correta para o veículo dele.

Regras obrigatórias:
- SEMPRE solicite a placa do veículo antes de sugerir qualquer peça.
- Tente buscar o veículo pela placa usando a ferramenta buscar_veiculo_por_placa.
- Se a busca pela placa falhar ou retornar erro, NÃO desista. Informe ao usuário que não foi possível
  identificar o veículo pela placa e colete os dados manualmente, perguntando UM campo por vez nesta ordem:
    1. "Qual a **marca** do seu veículo? (Ex: Volkswagen, Fiat, Chevrolet)"
    2. "Qual o **modelo**? (Ex: Gol, Argo, Onix)"
    3. "Qual o **ano**? (Ex: 2020)"
    4. "Qual o **motor**? (Ex: 1.0, 1.4, 2.0 Turbo)"
    5. "Qual o **combustível**? (Flex, Gasolina, Diesel, Elétrico)"
- Após coletar marca, modelo, ano, motor e combustível — seja pela placa ou manualmente —
  use a ferramenta buscar_pecas_por_veiculo para buscar as peças. Nunca pule essa etapa.
- NUNCA confirme compatibilidade sem usar a ferramenta buscar_pecas_por_veiculo.
- Ao apresentar peças, mostre: nome, código OEM, preço e condição (novo/usado).
- Se encontrar a peça, confirme: "Esta peça é 100% compatível com seu veículo conforme o catálogo OEM."
- Se não encontrar, diga claramente que não há estoque disponível para esse veículo no momento.`,

    seller: `${base}

PERFIL: Vendedor
Sua missão é ajudar o vendedor a publicar anúncios corretos, com OEM validado pelo catálogo.

Regras obrigatórias:
- SEMPRE valide o código OEM antes de confirmar que a peça pode ser anunciada.
- Use validar_oem_para_anuncio para checar se o OEM existe no masterParts.
- Se o OEM for válido, confirme e oriente o vendedor a seguir para o formulário de publicação.
- Se o OEM não existir no catálogo, informe que a peça precisa ser cadastrada pela administração antes de ser anunciada.
- Nunca aprove um anúncio sem validação.`,

    dismantler: `${base}

PERFIL: Vendedor de Desmanche
Sua missão é guiar o processo de cadastro de veículos inteiros para desmanche pelo número do chassi.

Regras obrigatórias:
- SEMPRE solicite o número do chassi (VIN de 17 caracteres) para iniciar o processo.
- Use consultar_chassi para identificar o veículo e gerar o catálogo de peças.
- Após retornar o catálogo, oriente o vendedor sobre as subcoleções disponíveis para publicar.
- Explique que cada subcoleção agrupa um conjunto de peças (ex: Motor e Câmbio, Suspensão, etc).
- Se o chassi for inválido, informe e peça para conferir o número.`,
  };

  return profiles[profile] || profiles.buyer;
}

// ─── Executores das tools ─────────────────────────────────────────────────────

async function executarTool(nome, params) {
  switch (nome) {
    case "buscar_veiculo_por_placa": {
      return await getVehicleByPlate(params.placa);
    }

    case "buscar_pecas_por_veiculo": {
      const resultado = await executeSearch({
        brand: params.brand,
        model: params.model,
        engineDisplacement: params.engineDisplacement,
        fuelType: params.fuelType,
        limit: 10,
        orderBy: "createdAt",
        orderDirection: "desc",
      });

      if (params.nomePeca && resultado.data?.length) {
        const termo = params.nomePeca.toLowerCase();
        const filtrado = resultado.data.filter(
          (item) =>
            item.part?.name?.toLowerCase().includes(termo) ||
            item.part?.category?.toLowerCase().includes(termo) ||
            item.part?.description?.toLowerCase().includes(termo)
        );
        return {
          total: filtrado.length,
          pecas: filtrado.map((item) => ({
            nome: item.part?.name,
            oem: item.part?.oemNumber,
            categoria: item.part?.category,
            preco: item.price,
            condicao: item.condition,
            garantiaMeses: item.warrantyMonths,
            estoque: item.stock,
          })),
        };
      }

      return {
        total: resultado.data?.length || 0,
        pecas: (resultado.data || []).map((item) => ({
          nome: item.part?.name,
          oem: item.part?.oemNumber,
          categoria: item.part?.category,
          preco: item.price,
          condicao: item.condition,
          garantiaMeses: item.warrantyMonths,
          estoque: item.stock,
        })),
        temMais: resultado.pagination?.hasMore,
      };
    }

    case "validar_oem_para_anuncio": {
      const masterSnap = await db
        .collection("masterParts")
        .where("oemNumber", "==", params.oemNumber)
        .limit(1)
        .get();

      if (masterSnap.empty) {
        return {
          valido: false,
          motivo: "OEM não encontrado no catálogo. Solicite o cadastro à administração.",
        };
      }

      const masterPart = { id: masterSnap.docs[0].id, ...masterSnap.docs[0].data() };

      if (params.brand && params.model) {
        const compatSnap = await db
          .collection("compatibilities")
          .where("masterPartId", "==", masterPart.id)
          .where("active", "==", true)
          .get();

        const compativel = compatSnap.docs.some((doc) => {
          const d = doc.data();
          return (
            d.brandSlug?.toLowerCase().includes(params.brand.toLowerCase()) &&
            d.modelSlug?.toLowerCase().includes(params.model.toLowerCase())
          );
        });

        return {
          valido: true,
          compativel,
          peca: { nome: masterPart.name, oem: masterPart.oemNumber, descricao: masterPart.description },
          motivo: compativel
            ? "OEM válido e compatível com o veículo informado."
            : "OEM existe no catálogo, mas não há compatibilidade cadastrada para este veículo específico.",
        };
      }

      return {
        valido: true,
        peca: { nome: masterPart.name, oem: masterPart.oemNumber, descricao: masterPart.description },
        motivo: "OEM encontrado no catálogo.",
      };
    }

    case "consultar_chassi": {
      const veiculo = await lookupChassi(params.chassi);
      const catalogo = await generateDesmancheCatalog(params.chassi, veiculo);
      return {
        veiculo,
        subcolecoes: catalogo?.subcollections?.map((sub) => ({
          id: sub.id,
          label: sub.label,
          icone: sub.icon,
          totalPecas: sub.parts?.length || 0,
        })) || [],
      };
    }

    default:
      return { erro: `Tool desconhecida: ${nome}` };
  }
}

// ─── Agente principal ─────────────────────────────────────────────────────────

export async function runAgent({ message, profile }) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: getSystemPrompt(profile),
    tools: TOOLS,
  });

  const chat = model.startChat({ history: [] });

  let currentMessage = message;

  // Loop agentic — continua até o modelo parar de chamar tools
  while (true) {
    const result = await chat.sendMessage(currentMessage);
    const response = result.response;
    const candidate = response.candidates?.[0];

    if (!candidate) {
      return "Não consegui processar sua solicitação. Tente novamente.";
    }

    const parts = candidate.content?.parts || [];
    const toolCalls = parts.filter((p) => p.functionCall);

    // Sem tools — retorna o texto final
    if (toolCalls.length === 0) {
      const textPart = parts.find((p) => p.text);
      return textPart?.text ?? "Não consegui processar sua solicitação. Tente novamente.";
    }

    // Executa todas as tools e monta as respostas
    const toolResponses = [];

    for (const part of toolCalls) {
      const { name, args } = part.functionCall;
      let resultado;

      try {
        resultado = await executarTool(name, args);
      } catch (err) {
        resultado = { erro: `Falha ao executar ${name}: ${err.message}` };
      }

      toolResponses.push({
        functionResponse: {
          name,
          response: resultado,
        },
      });
    }

    // Alimenta os resultados de volta para o modelo continuar
    currentMessage = toolResponses;
  }
}
