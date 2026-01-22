
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Transaction, Account, Debt, FixedExpense } from "../types";

const getAIClient = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey || apiKey.trim() === '') return null;
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (e) {
    console.error("Failed to initialize Gemini client:", e);
    return null;
  }
};

export const getFinancialInsights = async (
  transactions: Transaction[],
  accounts: Account[],
  debts: Debt[],
  fixedExpenses: FixedExpense[] = []
): Promise<string> => {
  const genAI = getAIClient();
  if (!genAI) {
    return "<div class='p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400'>✨ Configure a API Key do Gemini (VITE_API_KEY) no arquivo .env para obter insights financeiros.</div>";
  }

  const currentMonthStr = new Date().toISOString().slice(0, 7);

  // Projection calculation for AI
  const pendingFixed = fixedExpenses.filter(e => e.lastPaidMonth !== currentMonthStr);
  const totalCommitment = pendingFixed.reduce((sum, e) => sum + e.amount, 0) +
    debts.filter(d => d.status !== 'PAID').reduce((sum, d) => sum + (d.totalAmount / d.installmentsTotal), 0);

  const summaryData = {
    balance: accounts.reduce((sum, a) => sum + a.balance, 0),
    fixedExpensesCount: fixedExpenses.length,
    pendingCommitment: totalCommitment,
    debtsCount: debts.length,
    recentExpenses: transactions.filter(t => t.type === 'EXPENSE').slice(0, 10).map(t => ({ desc: t.description, amount: t.amount }))
  };

  const prompt = `
    Atue como um concierge financeiro estrategista.
    Dados Atuais: ${JSON.stringify(summaryData)}

    Instruções:
    1. Analise se o saldo atual cobre os compromissos pendentes (R$ ${totalCommitment.toFixed(2)}).
    2. Dê um feedback sobre a organização de gastos fixos vs variáveis.
    3. Responda em HTML estilizado com Tailwind (use <div>, <p>, <span>).
    4. Se o saldo for menor que os compromissos, dê um alerta crítico em vermelho.
    5. Idioma: Português do Brasil.
  `;

  const modelsToTry = ["gemini-2.0-flash-exp", "gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-pro"];

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text || "Sem insights no momento.";
    } catch (error: any) {
      const errorMessage = error.message || "";
      // Se não for um erro de "Modelo não encontrado (404)", interrompe o loop e mostra o erro real
      if (!errorMessage.includes("404") && !errorMessage.includes("not found")) {
        console.error(`Gemini Error (${modelName}):`, error);

        if (errorMessage.includes("403") || errorMessage.includes("PERMISSION_DENIED")) {
          return "<div class='p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg text-rose-600 dark:text-rose-400'>❌ <b>Acesso Negado (403)</b>: Sua chave de API pode estar incorreta ou o modelo não está disponível na sua região.</div>";
        }
        if (errorMessage.includes("401") || errorMessage.includes("UNAUTHENTICATED")) {
          return "<div class='p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg text-rose-600 dark:text-rose-400'>❌ <b>Não Autenticado (401)</b>: Verifique sua <code>VITE_API_KEY</code> no Vercel.</div>";
        }
        if (errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
          return "<div class='p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg text-rose-600 dark:text-rose-400'>❌ <b>Cota Excedida (429)</b>: Tente novamente em um minuto.</div>";
        }
        return `<div class='p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg text-rose-600 dark:text-rose-400'>❌ <b>Erro na API</b>: ${errorMessage.substring(0, 150)}...</div>`;
      }
      console.warn(`Modelo ${modelName} não encontrado (404), tentando próximo...`);
    }
  }

  return "<div class='p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg text-rose-600 dark:text-rose-400'>❌ <b>Erro 404</b>: Nenhum modelo Gemini disponível foi encontrado. Verifique se sua chave tem acesso aos modelos 1.5 Flash ou Pro no Google AI Studio.</div>";
};


export const suggestCategory = async (description: string): Promise<string> => {
  const genAI = getAIClient();
  if (!genAI) return "";

  const prompt = `Classifique: "${description}" em uma categoria (retorne APENAS o nome): Moradia, Alimentação, Transporte, Lazer, Compras, Salário, Investimentos, Saúde.`;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text?.trim() || "";
  } catch (e) { return ""; }
}
