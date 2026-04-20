import Groq from "groq-sdk";
import { getVehicleByPlate } from "./plate.service.js";
import { executeSearch } from "./search.service.js";
import { lookupChassi, generateDesmancheCatalog } from "./chassi.service.js";
import { db } from "../config/firebase.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Definição das tools (formato OpenAI/Groq) ────────────────────────────────

const TOOLS = [
  {
    type: "function",
    function: {
      name: "buscar_veiculo_por_placa",
      description:
        "Busca dados técnicos do veículo pela placa (marca, modelo, ano, motor, combustível). " +
        "Use SEMPRE que o usuário informar uma placa antes de buscar qualquer peça.",
      parameters: {
        type: "object",
        properties: {
          placa: {
            type: "string",
            description: "Placa do veículo. Exemplos: ABC1234, BRA2E19",
          },
        },
        required: ["placa"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "buscar_pecas_por_veiculo",
      description:
        "Busca todas as peças disponíveis no catálogo OEM para um veículo específico. " +
        "Use após identificar o veículo pela placa. Retorna peças com OEM, preço e disponibilidade.",
      parameters: {
        type: "object",
        properties: {
          brand: { type: "string", description: "Marca do veículo. Ex: volkswagen" },
          model: { type: "string", description: "Modelo do veículo. Ex: gol" },
          engineDisplacement: { type: "string", description: "Motor do veículo. Ex: 1.0 flex" },
          fuelType: { type: "string", description: "Combustível. Ex: flex" },
          nomePeca: {
            type: "string",
            description: "Nome da peça que o usuário quer buscar. Opcional.",
          },
        },
        required: ["brand", "model", "engineDisplacement", "fuelType"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "validar_oem_para_anuncio",
      description:
        "Valida se um código OEM existe no catálogo masterParts e se é compatível com o veículo informado. " +
        "Use quando o vendedor quiser publicar uma peça e informar o código OEM.",
      parameters: {
        type: "object",
        properties: {
          oemNumber: { type: "string", description: "Código OEM da peça. Ex: 45022-SNA-A00" },
          brand: { type: "string", description: "Marca do veículo. Ex: honda" },
          model: { type: "string", description: "Modelo do veículo. Ex: civic" },
          year: { type: "string", description: "Ano do veículo. Ex: 2018" },
        },
        required: ["oemNumber"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "consultar_chassi",
      description:
        "Consulta dados técnicos de um veículo pelo número do chassi (VIN de 17 caracteres) " +
        "e retorna o catálogo de peças disponíveis para desmanche.",
      parameters: {
        type: "object",
        properties: {
          chassi: {
            type: "string",
            description: "Número do chassi (VIN) com 17 caracteres. Ex: 9BWZZZ377VT004251",
          },
        },
        required: ["chassi"],
      },
    },
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

Formas de identificar o veículo (aceite qualquer uma):
1. O usuário informa a placa → use buscar_veiculo_por_placa imediatamente.
2. O usuário informa marca/modelo/ano/motor/combustível diretamente → use esses dados sem pedir placa.
3. O usuário não informou nenhum dado → pergunte: "Você tem a placa do veículo? Se não tiver, pode informar marca, modelo, ano, motor e combustível."

Coleta manual (somente se o usuário não tiver placa e não forneceu os dados):
- Pergunte UM campo por vez nesta ordem:
    1. Marca (Ex: Volkswagen, Fiat, Chevrolet)
    2. Modelo (Ex: Gol, Argo, Onix)
    3. Ano (Ex: 2020)
    4. Motor (Ex: 1.0, 1.4, 2.0 Turbo)
    5. Combustível (Flex, Gasolina, Diesel, Elétrico)

Regras obrigatórias:
- NUNCA exija a placa se o usuário já forneceu os dados do veículo manualmente.
- NUNCA exija a placa se o usuário disse que não tem ou não quer usar.
- Após ter marca, modelo, motor e combustível — de qualquer forma — use buscar_pecas_por_veiculo. Nunca pule essa etapa.
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
- Se o OEM não existir no catálogo, informe que a peça precisa ser cadastrada pela administração.
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
        subcolecoes:
          catalogo?.subcollections?.map((sub) => ({
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

/**
 * @param {string} message - Mensagem atual do usuário
 * @param {string} profile - buyer | seller | dismantler
 * @param {Array}  history - Histórico anterior: [{ role: "user"|"assistant", content: string }]
 */
export async function runAgent({ message, profile, history = [] }) {
  // Reconstrói o histórico de conversa para dar contexto ao modelo
  const historyMessages = history
    .slice(-20) // máximo de 20 mensagens para não explodir o contexto
    .map((m) => ({ role: m.role, content: m.content }));

  const messages = [
    { role: "system", content: getSystemPrompt(profile) },
    ...historyMessages,
    { role: "user", content: message },
  ];

  // Guard contra loop infinito — máximo de 10 ciclos de tool call
  let iterations = 0;
  const MAX_ITERATIONS = 10;

  // Loop agentic — continua até o modelo parar de chamar tools
  while (iterations < MAX_ITERATIONS) {
    iterations++;
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      tools: TOOLS,
      tool_choice: "auto",
      max_tokens: 1024,
    });

    const choice = response.choices[0];
    const assistantMessage = choice.message;

    // Adiciona a resposta do assistente ao histórico
    messages.push(assistantMessage);

    // Se não há tool calls, retorna o texto final
    if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
      return assistantMessage.content ?? "Não consegui processar sua solicitação. Tente novamente.";
    }

    // Executa cada tool call
    for (const toolCall of assistantMessage.tool_calls) {
      let resultado;
      try {
        const params = JSON.parse(toolCall.function.arguments);
        resultado = await executarTool(toolCall.function.name, params);
      } catch (err) {
        resultado = { erro: `Falha ao executar ${toolCall.function.name}: ${err.message}` };
      }

      // Adiciona o resultado da tool ao histórico
      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(resultado),
      });
    }

    // Continua o loop para o modelo processar os resultados
  }

  // Fallback caso estoure o limite de iterações
  return "Desculpe, não consegui processar sua solicitação. Por favor, tente novamente.";
}
