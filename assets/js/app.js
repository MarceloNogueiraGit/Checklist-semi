/* ══════════════════════════════════════════════════════
   ITENS DO CHECKLIST
   (lado:true = ao marcar NOK, pergunta Esquerdo/Direito/Ambos)
   ══════════════════════════════════════════════════════ */
const ITENS_SR = [
  { n: 1,  nome: 'Faixas reflexivas',                        lado: true  },
  { n: 2,  nome: 'Presilhas de fechamento',                  lado: true  },
  { n: 3,  nome: 'Portas e fechaduras',                      lado: false },
  { n: 4,  nome: 'Parachoque',                                lado: false },
  { n: 5,  nome: 'Paralamas',                                 lado: false },
  { n: 6,  nome: 'Vazamento de ar',                           lado: false },
  { n: 7,  nome: 'Sinalização laterais',                      lado: true  },
  { n: 8,  nome: 'Lanternas traseiras',                       lado: true  },
  { n: 9,  nome: 'Lonas do sider (laterais e teto)',          lado: true  },
  { n: 10, nome: 'Bando/bandanas',                            lado: true  },
  { n: 11, nome: 'Cabo de aço',                                lado: false },
  { n: 12, nome: 'Cones',                                     lado: false },
  { n: 13, nome: 'Extintor',                                  lado: false },
  { n: 14, nome: 'Cintas, catracas, cantoneiras e réguas',    lado: false },
  { n: 15, nome: 'Protetor lateral / mata cachorro',          lado: true  },
  { n: 16, nome: 'Caixa de ferramentas',                      lado: false },
  { n: 17, nome: 'Tampa da caixa de ferramentas',             lado: false },
  { n: 18, nome: 'Pés hidráulicos',                            lado: false },
  { n: 19, nome: 'Pneus 1º eixo',                              lado: true  },
  { n: 20, nome: 'Pneus 2º eixo',                              lado: true  },
  { n: 21, nome: 'Pneus 3º eixo',                              lado: true  },
];
const LADO_NOME = { E: 'ESQ', D: 'DIR', A: 'AMBOS' };

function gv(id) { return (document.getElementById(id)?.value || '').trim(); }

/* ══════════════════════════════════════════════════════
   CRIAÇÃO / REMOÇÃO DE BLOCOS
   ══════════════════════════════════════════════════════ */
let blocoContador = 0;

function itensHTML() {
  return ITENS_SR.map(it => `
    <div class="item-sr" data-n="${it.n}" data-lado-flag="${it.lado ? 1 : 0}" data-status="" data-lado="">
      <span class="item-sr-nome">${it.nome}</span>
      <span class="item-sr-lado" style="display:none"></span>
      <div class="item-sr-botoes">
        <button type="button" class="btn-status ok">OK</button>
        <button type="button" class="btn-status nok">NOK</button>
      </div>
    </div>`).join('');
}

function criarBlocoHTML(numero) {
  blocoContador++;
  const id = `bloco_${blocoContador}`;
  return `
    <div class="bloco-sr" id="${id}" data-tipo="vanderleia">
      <div class="bloco-sr-topo">
        <span class="bloco-sr-titulo">SEMI-REBOQUE Nº ${numero}</span>
        <button type="button" class="bloco-sr-remover" title="Remover este bloco">×</button>
      </div>
      <div class="bloco-sr-config">
        <div class="tipo-radio-grupo">
          <button type="button" class="tipo-radio-btn vanderleia ativo" data-tipo="vanderleia">Vanderleia</button>
          <button type="button" class="tipo-radio-btn rodotrem" data-tipo="rodotrem">Rodotrem</button>
        </div>
        <div class="placas-wrap">
          <div class="placa-campo sr1">
            <span>Placa</span>
            <input type="text" class="placa-input" maxlength="8" placeholder="AAA-1234">
          </div>
          <div class="placa-campo sr2" style="display:none">
            <span>Placa SR2</span>
            <input type="text" class="placa-input" maxlength="8" placeholder="AAA-1234">
          </div>
        </div>
      </div>
      <div class="itens-lista">${itensHTML()}</div>
    </div>`;
}

function adicionarBloco() {
  const container = document.getElementById('blocos-container');
  const numero = document.querySelectorAll('.bloco-sr').length + 1;
  container.insertAdjacentHTML('beforeend', criarBlocoHTML(numero));
  atualizarBotoesRemover();
}

function removerBloco(bloco) {
  const total = document.querySelectorAll('.bloco-sr').length;
  if (total <= 1) return; // mantém sempre pelo menos 1 bloco
  bloco.remove();
  renumerarBlocos();
  atualizarBotoesRemover();
}

function renumerarBlocos() {
  document.querySelectorAll('.bloco-sr').forEach((b, i) => {
    b.querySelector('.bloco-sr-titulo').textContent = `SEMI-REBOQUE Nº ${i + 1}`;
  });
}

function atualizarBotoesRemover() {
  const blocos = document.querySelectorAll('.bloco-sr');
  blocos.forEach(b => {
    b.querySelector('.bloco-sr-remover').style.display = blocos.length > 1 ? '' : 'none';
  });
}

/* ══════════════════════════════════════════════════════
   TIPO (VANDERLEIA / RODOTREM)
   ══════════════════════════════════════════════════════ */
function setTipo(bloco, tipo) {
  bloco.dataset.tipo = tipo;
  bloco.querySelector('.tipo-radio-btn.vanderleia').classList.toggle('ativo', tipo === 'vanderleia');
  bloco.querySelector('.tipo-radio-btn.rodotrem').classList.toggle('ativo', tipo === 'rodotrem');
  const campo2 = bloco.querySelector('.placa-campo.sr2');
  const label1 = bloco.querySelector('.placa-campo.sr1 span');
  if (tipo === 'rodotrem') {
    campo2.style.display = '';
    label1.textContent = 'Placa SR1';
  } else {
    campo2.style.display = 'none';
    label1.textContent = 'Placa';
  }
}

/* ══════════════════════════════════════════════════════
   MARCAR OK / NOK  (+ popup de lado quando necessário)
   ══════════════════════════════════════════════════════ */
function aplicarStatus(item, status, lado) {
  item.dataset.status = status;
  item.dataset.lado = lado || '';
  item.querySelector('.btn-status.ok').classList.toggle('ativo', status === 'OK');
  item.querySelector('.btn-status.nok').classList.toggle('ativo', status === 'NOK');
  const ladoSpan = item.querySelector('.item-sr-lado');
  if (status === 'NOK' && lado) {
    ladoSpan.textContent = LADO_NOME[lado] || '';
    ladoSpan.style.display = 'inline-block';
  } else {
    ladoSpan.style.display = 'none';
    ladoSpan.textContent = '';
  }
}

function marcarStatus(item, status) {
  if (status === 'OK') {
    aplicarStatus(item, 'OK', '');
    return;
  }
  const precisaLado = item.dataset.ladoFlag === '1';
  if (precisaLado) {
    const nome = item.querySelector('.item-sr-nome').textContent;
    pedirLado(nome, (lado) => {
      if (lado) aplicarStatus(item, 'NOK', lado);
      else aplicarStatus(item, '', '');
    });
  } else {
    aplicarStatus(item, 'NOK', '');
  }
}

/* ══════════════════════════════════════════════════════
   POPUP LADO
   ══════════════════════════════════════════════════════ */
let _cbLado = null;

function pedirLado(nomeItem, cb) {
  _cbLado = cb;
  document.getElementById('popup-lado-desc').textContent = nomeItem;
  document.getElementById('popup-lado').classList.add('aberto');
}
function resolverLado(op) {
  document.getElementById('popup-lado').classList.remove('aberto');
  if (_cbLado) { const cb = _cbLado; _cbLado = null; cb(op); }
}
function cancelarLado() {
  document.getElementById('popup-lado').classList.remove('aberto');
  if (_cbLado) { const cb = _cbLado; _cbLado = null; cb(null); }
}

/* ══════════════════════════════════════════════════════
   EVENTOS (delegados no container, funciona pra blocos novos)
   ══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const dataEl = document.getElementById('data');
  if (dataEl && !dataEl.value) dataEl.value = new Date().toISOString().split('T')[0];

  adicionarBloco(); // primeiro bloco já vem pronto

  const container = document.getElementById('blocos-container');

  container.addEventListener('click', (e) => {
    const btnTipo = e.target.closest('.tipo-radio-btn');
    if (btnTipo) { setTipo(btnTipo.closest('.bloco-sr'), btnTipo.dataset.tipo); return; }

    const btnRemover = e.target.closest('.bloco-sr-remover');
    if (btnRemover) { removerBloco(btnRemover.closest('.bloco-sr')); return; }

    const btnStatus = e.target.closest('.btn-status');
    if (btnStatus) {
      const item = btnStatus.closest('.item-sr');
      const status = btnStatus.classList.contains('ok') ? 'OK' : 'NOK';
      marcarStatus(item, status);
      return;
    }
  });

  container.addEventListener('input', (e) => {
    if (e.target.classList.contains('placa-input')) {
      const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
      e.target.value = raw.length > 3 ? raw.slice(0, 3) + '-' + raw.slice(3) : raw;
    }
  });
});

/* ══════════════════════════════════════════════════════
   COLETA DE DADOS
   ══════════════════════════════════════════════════════ */
function coletarBlocos() {
  const blocos = [];
  document.querySelectorAll('.bloco-sr').forEach((b, idx) => {
    const placa1 = b.querySelector('.placa-campo.sr1 input').value.trim();
    const placa2 = b.querySelector('.placa-campo.sr2 input').value.trim();
    const itens = [];
    b.querySelectorAll('.item-sr').forEach(it => {
      itens.push({
        n: parseInt(it.dataset.n, 10),
        status: it.dataset.status || '',
        lado: it.dataset.lado || ''
      });
    });
    blocos.push({ numero: idx + 1, tipo: b.dataset.tipo, placa1, placa2, itens });
  });
  return blocos;
}

/* ══════════════════════════════════════════════════════
   PDF — layout compacto (mín. 4 checklists por página A4)
   ══════════════════════════════════════════════════════ */
function truncarTexto(doc, texto, larguraMax) {
  if (doc.getTextWidth(texto) <= larguraMax) return texto;
  let t = texto;
  while (t.length > 1 && doc.getTextWidth(t + '…') > larguraMax) t = t.slice(0, -1);
  return t + '…';
}

function desenharBloco(doc, bloco, x0, w, y0, AZUL) {
  const hHeader = 6.5;
  const hRow = 4;
  const nRows = 7;
  const hItens = nRows * hRow;
  const hTotal = hHeader + hItens;
  const colW = w / 3;

  doc.setDrawColor(170); doc.setLineWidth(.25);
  doc.rect(x0, y0, w, hTotal);

  doc.setFillColor(...AZUL); doc.rect(x0, y0, w, hHeader, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7.3); doc.setTextColor(255, 255, 255);
  let linha = `SEMI-REBOQUE Nº ${bloco.numero}   TIPO: ${bloco.tipo === 'rodotrem' ? 'RODOTREM' : 'VANDERLEIA'}`;
  if (bloco.tipo === 'rodotrem') {
    linha += `   PLACA SR1: ${bloco.placa1 || '-'}   PLACA SR2: ${bloco.placa2 || '-'}`;
  } else {
    linha += `   PLACA: ${bloco.placa1 || '-'}`;
  }
  doc.text(linha, x0 + 2.5, y0 + hHeader / 2 + 1.4);

  for (let c = 0; c < 3; c++) {
    for (let r = 0; r < nRows; r++) {
      const idx = c * nRows + r; // preenchimento coluna a coluna (0..20)
      const item = ITENS_SR[idx];
      const dado = bloco.itens.find(i => i.n === item.n) || { status: '', lado: '' };
      const cx = x0 + c * colW;
      const cy = y0 + hHeader + r * hRow;

      doc.setDrawColor(228); doc.setLineWidth(.15);
      if (r > 0) doc.line(cx, cy, cx + colW, cy);
      if (c > 0) doc.line(cx, y0 + hHeader, cx, y0 + hTotal);

      doc.setFont('helvetica', 'normal'); doc.setFontSize(5.6); doc.setTextColor(15, 15, 15);
      const nome = truncarTexto(doc, item.nome, colW - 24);
      doc.text(nome, cx + 1.3, cy + hRow / 2 + 1.1);

      const okM  = dado.status === 'OK';
      const nokM = dado.status === 'NOK';
      let marcador = `(${okM ? 'X' : ' '})OK (${nokM ? 'X' : ' '})NOK`;
      if (nokM && dado.lado) marcador += '-' + dado.lado;
      doc.setFontSize(5.6);
      doc.text(marcador, cx + colW - 1.3, cy + hRow / 2 + 1.1, { align: 'right' });
    }
  }
  return hTotal;
}

function gerarPDF() {
  const blocos = coletarBlocos();
  if (!blocos.length) { alert('Adicione ao menos um semi-reboque antes de gerar o PDF.'); return; }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const W = 210, ML = 10, cW = 190;
  const AZUL = [26, 26, 46];
  const TOPO = 18, LIMITE_Y = 283, GAP = 4;
  let y = TOPO;

  function cabecalhoPagina() {
    doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, 14, 'F');
    doc.setDrawColor(200); doc.setLineWidth(.3); doc.line(0, 14, W, 14);
    doc.setFontSize(10.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(20, 20, 20);
    doc.text('CHECK LIST - CONDICOES DO SEMI-REBOQUE', ML, 9.5);
    try {
      const lg = document.getElementById('logo-pdf');
      if (lg && lg.complete) doc.addImage(lg, 'PNG', W - ML - 24, 0.5, 24, 13);
    } catch (_) {}
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(80, 80, 80);
    const dataVal = gv('data') ? gv('data').split('-').reverse().join('/') : '—';
    doc.text('Data: ' + dataVal, ML, 13.2);
    y = TOPO;
  }

  cabecalhoPagina();

  blocos.forEach((bloco) => {
    const hEstimado = 6.5 + 7 * 4;
    if (y + hEstimado > LIMITE_Y) {
      doc.addPage();
      cabecalhoPagina();
    }
    const h = desenharBloco(doc, bloco, ML, cW, y, AZUL);
    y += h + GAP;
  });

  const totalPag = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPag; p++) {
    doc.setPage(p);
    doc.setDrawColor(210); doc.setLineWidth(.2); doc.line(ML, 291, ML + cW, 291);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); doc.setTextColor(130, 130, 130);
    doc.text('JCE Transportes · Check List de Condicoes do Semi-Reboque', ML, 295);
    doc.text(`Pagina ${p} de ${totalPag}`, ML + cW, 295, { align: 'right' });
  }

  const dataArq = (gv('data') || 'sdata').replace(/-/g, '');
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) win.addEventListener('load', () => { win.focus(); win.print(); });
  doc.save(`CheckList_SemiReboque_${dataArq}.pdf`);
}
