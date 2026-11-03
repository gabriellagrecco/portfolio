// Roteiros do agente comercial. Arquitetura real (blocos, ferramentas e campos do agente real),
// conteúdo fictício: escola, produtos, leads e preços são inventados.

export const ESCOLA = 'Instituto Travessia';

export const BLOCOS = {
  '01': { grupo: 'comportamento', pt: 'Identidade', en: 'Identity' },
  '02': { grupo: 'comportamento', pt: 'Regras absolutas', en: 'Hard rules' },
  '03': { grupo: 'comportamento', pt: 'Objetivos e caminhos', en: 'Goals and paths' },
  '04': { grupo: 'comportamento', pt: 'Tom', en: 'Tone' },
  '05': { grupo: 'roteamento', pt: 'Usar CRM, formulário e histórico', en: 'Use CRM, form and history' },
  '06': { grupo: 'comportamento', pt: 'Condução da conversa', en: 'Conversation flow' },
  '07': { grupo: 'comportamento', pt: 'Trava antes da conversa', en: 'Gate before the call' },
  '08': { grupo: 'conhecimento', pt: 'Produto: mentoria', en: 'Product: mentorship' },
  '09': { grupo: 'conhecimento', pt: 'Produto: programa intensivo', en: 'Product: intensive program' },
  '10': { grupo: 'conhecimento', pt: 'Preço do programa', en: 'Program pricing' },
  '11': { grupo: 'conhecimento', pt: 'Objeções', en: 'Objections' },
  '12': { grupo: 'conhecimento', pt: 'Materiais e fechamento', en: 'Materials and closing' },
  '13': { grupo: 'limites', pt: 'Transferência para humano', en: 'Human handoff' },
  '14': { grupo: 'roteamento', pt: 'Entrada na conversa', en: 'Conversation entry' },
  '15': { grupo: 'roteamento', pt: 'Leitura de perfil e roteamento', en: 'Profile reading and routing' },
  '16': { grupo: 'limites', pt: 'Escopo: fora do comercial', en: 'Scope: outside sales' },
  '17': { grupo: 'limites', pt: 'Exemplos: fora do comercial', en: 'Examples: outside sales' },
  '18': { grupo: 'roteamento', pt: 'Movimentação por etapa', en: 'Stage moves' },
};

export const FERRAMENTAS = {
  contact_history: { pt: 'Lê o histórico do contato', en: 'Reads contact history' },
  send_whatsapp: { pt: 'Envia mensagem no WhatsApp', en: 'Sends a WhatsApp message' },
  send_template: { pt: 'Envia mensagem pronta', en: 'Sends a saved message' },
  assign_human: { pt: 'Passa para atendente humano', en: 'Assigns a human agent' },
  set_chat_status: { pt: 'Muda o status do chat', en: 'Sets chat status' },
  move_deal: { pt: 'Move o negócio de etapa', en: 'Moves the deal stage' },
  set_deal_status: { pt: 'Marca ganho ou perdido', en: 'Marks won or lost' },
  update_crm_fields: { pt: 'Atualiza campos do CRM', en: 'Updates CRM fields' },
};

export const CAMPOS = {
  caminho: { pt: 'Caminho', en: 'Path' },
  etapa: { pt: 'Etapa', en: 'Stage' },
  status: { pt: 'Status', en: 'Status' },
  motivo: { pt: 'Motivo de perda', en: 'Loss reason' },
  atendente: { pt: 'Atendente', en: 'Assignee' },
};

const semHistorico = { id: 'contact_history', retorno: { pt: 'sem conversa anterior', en: 'no previous conversation' } };

export const ROTEIROS = [
  {
    id: 'venda',
    titulo: { pt: 'Venda com objeção', en: 'Sale with an objection' },
    desfecho: { pt: 'Link enviado: o lead finaliza a compra sozinho, sem passar para ninguém.', en: 'Link sent: the lead completes the purchase on their own, with no handoff.' },
    passos: [
      { quem: 'lead', texto: { pt: 'Oi! Quanto custa o Programa Intensivo?', en: 'Hi! How much is the Intensive Program?' } },
      {
        quem: 'agente',
        texto: {
          pt: `Oi, Marina! Sou a assistente com IA do ${ESCOLA}. Te passo, sim. Antes, me conta: o que mais pesa no seu negócio hoje?`,
          en: `Hi Marina! I'm the AI assistant at ${ESCOLA}. Sure, I'll share it. First, tell me: what weighs on your business the most right now?`,
        },
        blocos: ['14', '05', '10', '06'],
        ferramentas: [semHistorico],
      },
      { quem: 'lead', texto: { pt: 'A equipe. São oito pessoas e tudo ainda passa por mim.', en: 'The team. There are eight of us and everything still goes through me.' } },
      {
        quem: 'agente',
        texto: { pt: 'E quando tudo passa por você, o que fica para trás?', en: 'And when everything goes through you, what gets left behind?' },
        blocos: ['06'],
      },
      { quem: 'lead', texto: { pt: 'O comercial. Eu deveria estar vendendo e fico apagando incêndio.', en: "Sales. I should be selling and I'm putting out fires instead." } },
      {
        quem: 'agente',
        texto: {
          pt: 'Pelo que você contou, o Programa Intensivo conversa bastante com esse momento: são 8 semanas para montar a rotina da equipe e delegar sem você precisar estar em tudo. Te mandei um vídeo rápido de como funciona na prática.',
          en: "From what you've told me, the Intensive Program fits this moment well: 8 weeks to build your team's routine and delegate without you having to be everywhere. I've sent you a short video of how it works in practice.",
        },
        blocos: ['15', '09', '12'],
        ferramentas: [
          { id: 'update_crm_fields', retorno: { pt: 'caminho gravado', en: 'path saved' } },
          { id: 'send_template', retorno: { pt: 'vídeo da experiência enviado', en: 'experience video sent' } },
        ],
        crm: [{ campo: 'caminho', valor: { pt: 'programa intensivo', en: 'intensive program' } }],
      },
      { quem: 'lead', texto: { pt: 'Vi o vídeo, gostei. E o valor?', en: 'Watched it, I liked it. And the price?' } },
      {
        quem: 'agente',
        texto: { pt: 'O investimento é de R$ 4.800, em até 12 vezes no cartão.', en: 'The investment is R$4,800, in up to 12 card installments.' },
        blocos: ['10'],
      },
      { quem: 'lead', texto: { pt: 'Achei salgado para agora.', en: 'That feels steep right now.' } },
      {
        quem: 'agente',
        texto: { pt: 'O que pesou mais: o valor em si ou o momento do caixa?', en: 'What weighed more: the amount itself or cash flow right now?' },
        blocos: ['11', '06'],
      },
      { quem: 'lead', texto: { pt: 'O momento. Este mês está apertado.', en: 'The timing. This month is tight.' } },
      {
        quem: 'agente',
        texto: {
          pt: 'No parcelado, fica em R$ 400 por mês. E o ponto do programa é você voltar a ter tempo para o comercial, que é o que traz caixa.',
          en: "In installments it comes to R$400 a month. And the point of the program is getting your time back for sales, which is what brings cash in.",
        },
        blocos: ['11'],
      },
      { quem: 'lead', texto: { pt: 'Faz sentido. Me manda o link?', en: 'Fair point. Can you send me the link?' } },
      {
        quem: 'agente',
        texto: {
          pt: 'Claro! Aqui está o link oficial para garantir a sua vaga. Quando finalizar, me avisa por aqui para seguirmos com os próximos passos.',
          en: "Sure! Here's the official link to secure your spot. Once you're done, let me know here so we can take the next steps.",
        },
        blocos: ['12', '18'],
        ferramentas: [
          { id: 'send_whatsapp', retorno: { pt: 'link de pagamento enviado', en: 'payment link sent' } },
          { id: 'move_deal', retorno: { pt: 'etapa alterada', en: 'stage updated' } },
        ],
        crm: [{ campo: 'etapa', valor: { pt: 'aguardando pagamento', en: 'awaiting payment' } }],
      },
    ],
  },
  {
    id: 'mentoria',
    titulo: { pt: 'Qualifica e passa', en: 'Qualify and hand over' },
    desfecho: { pt: 'Lead qualificado; a equipe assume para marcar a conversa.', en: 'Qualified lead; the team takes over to book the call.' },
    passos: [
      { quem: 'lead', texto: { pt: 'Oi, voltei. Falamos há umas semanas sobre a mentoria.', en: "Hi, I'm back. We talked a few weeks ago about the mentorship." } },
      {
        quem: 'agente',
        texto: { pt: 'Oi, Rafael! Que bom ter você de volta. Como andou a abertura da segunda unidade?', en: 'Hi Rafael! Good to have you back. How did opening the second location go?' },
        blocos: ['14', '05'],
        ferramentas: [{ id: 'contact_history', retorno: { pt: 'conversa de 3 semanas atrás: abrindo a segunda unidade', en: 'conversation from 3 weeks ago: opening a second location' } }],
      },
      { quem: 'lead', texto: { pt: 'Abri. Agora são duas equipes e eu não consigo acompanhar nenhuma direito.', en: "I opened it. Now there are two teams and I can't keep up with either." } },
      {
        quem: 'agente',
        texto: { pt: 'Quando você não está numa das unidades, o que acontece por lá?', en: "When you're not at one of the locations, what happens there?" },
        blocos: ['06'],
      },
      { quem: 'lead', texto: { pt: 'Cai o padrão de atendimento, e o faturamento da semana sente.', en: 'Service quality drops, and that week’s revenue feels it.' } },
      {
        quem: 'agente',
        texto: { pt: 'E resolver isso é prioridade para os próximos meses ou fica para mais adiante?', en: 'And is solving this a priority for the coming months, or something for later?' },
        blocos: ['06', '15', '08'],
        ferramentas: [{ id: 'update_crm_fields', retorno: { pt: 'caminho gravado', en: 'path saved' } }],
        crm: [{ campo: 'caminho', valor: { pt: 'mentoria', en: 'mentorship' } }],
      },
      { quem: 'lead', texto: { pt: 'É prioridade. Quero abrir a terceira no ano que vem. Quanto custa a mentoria?', en: 'It is. I want to open a third one next year. How much is the mentorship?' } },
      {
        quem: 'agente',
        texto: {
          pt: 'Claro, você precisa saber se cabe no planejamento. A mentoria tem formatos diferentes, e o certo depende do seu cenário. Pelo que você me contou, vale a gente aprofundar isso numa conversa. Topa?',
          en: 'Of course, you need to know if it fits your plans. The mentorship comes in different formats, and the right one depends on your situation. From what you’ve told me, it’s worth going deeper in a conversation. Shall we?',
        },
        blocos: ['08', '02', '07', '03'],
      },
      { quem: 'lead', texto: { pt: 'Topo.', en: "Let's do it." } },
      {
        quem: 'agente',
        texto: { pt: 'Fica melhor de manhã ou à tarde?', en: 'Does morning or afternoon work better?' },
        blocos: ['06'],
      },
      { quem: 'lead', texto: { pt: 'De manhã.', en: 'Morning.' } },
      {
        quem: 'agente',
        texto: { pt: 'Perfeito. Vou ver duas opções de horário e já te passo.', en: "Perfect. I'll check two time options and get back to you." },
        blocos: ['18', '13'],
        ferramentas: [
          { id: 'move_deal', retorno: { pt: 'etapa alterada', en: 'stage updated' } },
          { id: 'assign_human', retorno: { pt: 'atendente definido, sem aviso ao lead', en: 'assignee set, silently' } },
        ],
        crm: [
          { campo: 'etapa', valor: { pt: 'aguardando agendamento', en: 'awaiting booking' } },
          { campo: 'atendente', valor: { pt: 'equipe comercial', en: 'sales team' } },
        ],
      },
      { quem: 'humano', texto: { pt: 'Tenho amanhã às 10h ou quinta às 9h. Qual fica melhor?', en: 'I have tomorrow at 10am or Thursday at 9am. Which works better?' } },
    ],
  },
  {
    id: 'para',
    titulo: { pt: 'Para na hora certa', en: 'Stops at the right time' },
    desfecho: { pt: 'Conversa segue com atendimento humano.', en: 'The conversation continues with a person.' },
    passos: [
      {
        quem: 'lead',
        texto: {
          pt: 'Preciso falar com alguém agora. Tive um problema sério com a minha inscrição e estou muito chateada.',
          en: "I need to talk to someone now. I had a serious problem with my enrollment and I'm really upset.",
        },
      },
      {
        quem: 'agente',
        texto: { pt: 'Sinto muito, Ana. A equipe já vai seguir com você por aqui.', en: "I'm sorry, Ana. The team will continue with you here right away." },
        blocos: ['14', '05', '16', '17', '13'],
        ferramentas: [
          { id: 'contact_history', retorno: { pt: 'cliente ativa, inscrita no programa', en: 'active client, enrolled in the program' } },
          { id: 'assign_human', retorno: { pt: 'atendente definido', en: 'assignee set' } },
          { id: 'set_chat_status', retorno: { pt: 'chat em espera para a equipe', en: 'chat on hold for the team' } },
        ],
        crm: [
          { campo: 'atendente', valor: { pt: 'equipe de atendimento', en: 'support team' } },
          { campo: 'status', valor: { pt: 'chat em espera', en: 'chat on hold' } },
        ],
      },
      {
        quem: 'humano',
        texto: { pt: 'Oi, Ana, aqui é a Carla, do atendimento. Já estou com o seu cadastro aberto. Me conta o que aconteceu?', en: 'Hi Ana, this is Carla from support. I have your account open. Can you tell me what happened?' },
      },
      { quem: 'lead', texto: { pt: 'Obrigada, Carla. Vou te explicar.', en: 'Thanks, Carla. Let me explain.' } },
    ],
  },
  {
    id: 'nao',
    titulo: { pt: 'Diz não com respeito', en: 'A respectful no' },
    desfecho: { pt: 'Negócio encerrado com motivo registrado; o lead vai para nutrição.', en: 'Deal closed with a loss reason; the lead moves to nurturing.' },
    passos: [
      { quem: 'lead', texto: { pt: 'Oi! Como funciona a mentoria de vocês?', en: 'Hi! How does your mentorship work?' } },
      {
        quem: 'agente',
        texto: {
          pt: `Oi, Pedro! Sou a assistente com IA do ${ESCOLA}. Te explico, sim. Antes, me conta: como está o seu negócio hoje?`,
          en: `Hi Pedro! I'm the AI assistant at ${ESCOLA}. Happy to explain. First, tell me: how is your business doing today?`,
        },
        blocos: ['14', '05', '01'],
        ferramentas: [semHistorico],
      },
      { quem: 'lead', texto: { pt: 'Ainda não abri. Estou juntando dinheiro para começar no ano que vem.', en: "I haven't opened it yet. I'm saving up to start next year." } },
      {
        quem: 'agente',
        texto: {
          pt: 'Que bom que você está se preparando antes de abrir. Os nossos programas são para quem já está com o negócio rodando, então hoje eles ainda não seriam o melhor passo para você.',
          en: "Good that you're preparing before opening. Our programs are for people whose business is already running, so right now they wouldn't be the best next step for you.",
        },
        blocos: ['06', '15', '02'],
      },
      { quem: 'lead', texto: { pt: 'Entendi.', en: 'Got it.' } },
      {
        quem: 'agente',
        texto: {
          pt: 'Te mandei nosso conteúdo gratuito sobre os primeiros passos de gestão. Quando o negócio abrir, me chama aqui que a gente conversa.',
          en: "I've sent you our free content on first steps in management. When your business opens, message me here and we'll talk.",
        },
        blocos: ['03', '04'],
        ferramentas: [
          { id: 'send_template', retorno: { pt: 'conteúdo gratuito enviado', en: 'free content sent' } },
          { id: 'set_deal_status', retorno: { pt: 'negócio marcado como perdido', en: 'deal marked as lost' } },
        ],
        crm: [
          { campo: 'status', valor: { pt: 'negócio perdido', en: 'deal lost' } },
          { campo: 'motivo', valor: { pt: 'não é o momento', en: 'not the right time' } },
        ],
      },
    ],
  },
];
