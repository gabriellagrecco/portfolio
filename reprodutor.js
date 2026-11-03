import { BLOCOS, CAMPOS, ROTEIROS } from './roteiros.js';

export function criarReprodutor(roteiro) {
  let i = -1;
  const ultimo = roteiro.passos.length - 1;
  return {
    get indice() { return i; },
    get atual() { return roteiro.passos[i] ?? null; },
    get visiveis() { return roteiro.passos.slice(0, i + 1); },
    get fim() { return i === ultimo; },
    avancar() { if (i < ultimo) i++; },
    voltar() { if (i > -1) i--; },
    reiniciar() { i = -1; },
  };
}

export function estadoCrm(passos) {
  const estado = {};
  for (const p of passos) for (const c of p.crm || []) estado[c.campo] = c.valor;
  return estado;
}

export function registro(passos) {
  return passos.flatMap((p) => p.ferramentas || []);
}

// Chaves "10" a "18" viram índices inteiros e o JS as lista antes de "01" a "09".
export function blocosOrdenados() {
  return Object.entries(BLOCOS).sort(([a], [b]) => a.localeCompare(b));
}

export function rotuloBloco(k, lang) {
  return `${k} ${BLOCOS[k][lang] ?? BLOCOS[k].pt}`;
}

// Lima marca o que a IA faz; terracota só na passagem para humano (bloco 13).
export function classeDoBloco(k, acesos) {
  if (!acesos.has(k)) return '';
  return k === '13' ? 'aceso-gente' : 'aceso';
}

const GRUPOS = ['comportamento', 'conhecimento', 'limites', 'roteamento'];
const NOME_GRUPO = {
  comportamento: { pt: 'Comportamento', en: 'Behavior' },
  conhecimento: { pt: 'Conhecimento', en: 'Knowledge' },
  limites: { pt: 'Limites e passagem', en: 'Limits and handoff' },
  roteamento: { pt: 'Roteamento e CRM', en: 'Routing and CRM' },
};
const UI = {
  tocar: { pt: 'Tocar', en: 'Play' }, pausar: { pt: 'Pausar', en: 'Pause' },
  voltar: { pt: 'Voltar', en: 'Back' }, avancar: { pt: 'Avançar', en: 'Next' }, reiniciar: { pt: 'Recomeçar', en: 'Restart' },
  conversa: { pt: 'Conversa', en: 'Conversation' }, dentro: { pt: 'Por dentro', en: 'Inside' },
  ferramentas: { pt: 'Ferramentas chamadas', en: 'Tool calls' }, crm: { pt: 'CRM', en: 'CRM' },
  vazio: { pt: 'Aperte Tocar para começar.', en: 'Press Play to start.' },
  aviso: { pt: 'Conversa simulada. Arquitetura real, lead e oferta fictícios.', en: 'Simulated conversation. Real architecture, fictional lead and offer.' },
  quem: { lead: { pt: 'Lead', en: 'Lead' }, agente: { pt: 'Agente', en: 'Agent' }, humano: { pt: 'Equipe', en: 'Team' } },
};
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function montar(raiz) {
  let roteiro = ROTEIROS[0];
  let rep = criarReprodutor(roteiro);
  let timer = null;
  const lang = () => document.documentElement.lang;
  const t = (o) => esc(o[lang()] ?? o.pt);

  function pausar() { clearInterval(timer); timer = null; }
  function tocar() {
    if (rep.fim) rep.reiniciar();
    rep.avancar(); desenhar();
    timer = setInterval(() => { rep.avancar(); if (rep.fim) pausar(); desenhar(); }, 1800);
  }

  // ponytail: redesenho completo a cada passo; leitor de tela pode reler a conversa inteira. Trocar por append se incomodar.
  function desenhar() {
    const el = document.activeElement;
    const ativo = raiz.contains(el) ? (el.dataset.acao || el.dataset.roteiro) : null;
    const acesos = new Set(rep.atual?.blocos || []);
    const crm = estadoCrm(rep.visiveis);
    raiz.innerHTML = `
      <div class="rp-abas" role="tablist">${ROTEIROS.map((r) => `<button type="button" role="tab" aria-selected="${r === roteiro}" data-roteiro="${r.id}">${t(r.titulo)}</button>`).join('')}</div>
      <div class="rp-paineis">
        <div class="rp-conversa"><p class="rotulo">${t(UI.conversa)}</p>
          ${rep.indice < 0 ? `<p class="rp-vazio">${t(UI.vazio)}</p>` : ''}
          <ol aria-live="polite">${rep.visiveis.map((p) => `<li class="rp-msg rp-${p.quem}"><span class="rp-quem">${t(UI.quem[p.quem])}</span>${t(p.texto)}
            <span class="rp-etq">${(p.blocos || []).map((b) => `<span>${esc(rotuloBloco(b, lang()))}</span>`).join('')}${(p.ferramentas || []).map((f) => `<code>${f.id}</code>`).join('')}</span></li>`).join('')}</ol>
          ${rep.fim ? `<p class="rp-desfecho">${t(roteiro.desfecho)}</p>` : ''}
        </div>
        <div class="rp-dentro"><p class="rotulo">${t(UI.dentro)}</p>
          ${GRUPOS.map((g) => `<div class="rp-grupo"><p>${t(NOME_GRUPO[g])}</p><ul>${blocosOrdenados().filter(([, b]) => b.grupo === g).map(([k, b]) => `<li class="${classeDoBloco(k, acesos)}"><b>${k}</b> ${t(b)}</li>`).join('')}</ul></div>`).join('')}
          <p class="rotulo">${t(UI.ferramentas)}</p>
          <ol class="rp-registro">${registro(rep.visiveis).map((f) => `<li><code>${f.id}()</code> <span>${t(f.retorno)}</span></li>`).join('')}</ol>
          <p class="rotulo">${t(UI.crm)}</p>
          <dl class="rp-crm">${Object.entries(CAMPOS).map(([k, c]) => `<dt>${t(c)}</dt><dd>${crm[k] ? t(crm[k]) : '·'}</dd>`).join('')}</dl>
        </div>
      </div>
      <div class="rp-controles">
        <button type="button" data-acao="voltar">${t(UI.voltar)}</button>
        <button type="button" data-acao="tocar">${timer ? t(UI.pausar) : t(UI.tocar)}</button>
        <button type="button" data-acao="avancar">${t(UI.avancar)}</button>
        <button type="button" data-acao="reiniciar">${t(UI.reiniciar)}</button>
      </div>
      <p class="rp-aviso">${t(UI.aviso)}</p>`;
    const ol = raiz.querySelector('.rp-conversa ol');
    if (ol) ol.scrollTop = ol.scrollHeight;
    if (ativo) raiz.querySelector(`[data-acao="${ativo}"],[data-roteiro="${ativo}"]`)?.focus();
  }

  raiz.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.roteiro) { pausar(); roteiro = ROTEIROS.find((r) => r.id === b.dataset.roteiro); rep = criarReprodutor(roteiro); }
    const a = b.dataset.acao;
    if (a === 'tocar') { timer ? pausar() : tocar(); }
    if (a === 'voltar') { pausar(); rep.voltar(); }
    if (a === 'avancar') { pausar(); rep.avancar(); }
    if (a === 'reiniciar') { pausar(); rep.reiniciar(); }
    desenhar();
  });
  raiz.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    pausar();
    e.key === 'ArrowRight' ? rep.avancar() : rep.voltar();
    desenhar();
  });
  document.addEventListener('idioma', desenhar);
  desenhar();
}
