/**
 * Doceria Delícias & Magia - Frontend Script
 * Consumo de API REST, Manipulação do DOM e Gestão de Estado
 */

// Configuração da URL da API (flexível para execução local, Vercel ou Live Server)
// Detecta se está rodando fora do servidor Express (file:// ou Live Server em porta diferente)
const isServidoLocalmente = window.location.port === '3000' || window.location.port === '3001';
const isAcessoExterno = window.location.protocol === 'file:' || 
  (window.location.hostname === 'localhost' && !isServidoLocalmente) ||
  (window.location.hostname === '127.0.0.1' && !isServidoLocalmente);

const API_URL = isAcessoExterno
  ? 'http://localhost:3000/api/doces'
  : '/api/doces';

// Estado da Aplicação
const state = {
  doces: [],
  filtroTipo: 'todos',
  termoBusca: '',
  doceParaExcluir: null,
  isEditando: false
};

// Elementos do DOM
const dom = {
  grid: document.getElementById('docesGrid'),
  loading: document.getElementById('loadingState'),
  emptyState: document.getElementById('emptyState'),
  totalBadge: document.getElementById('totalDocesCount'),
  searchInput: document.getElementById('searchInput'),
  btnClearSearch: document.getElementById('btnClearSearch'),
  filterPills: document.querySelectorAll('.pill'),
  btnNovoDoce: document.getElementById('btnNovoDoce'),
  btnEmptyNovoDoce: document.getElementById('btnEmptyNovoDoce'),
  
  // Modal de Formulário
  modal: document.getElementById('doceModal'),
  modalTitle: document.getElementById('modalTitle'),
  form: document.getElementById('doceForm'),
  btnFecharModal: document.getElementById('btnFecharModal'),
  btnCancelarModal: document.getElementById('btnCancelarModal'),
  btnSalvarDoce: document.getElementById('btnSalvarDoce'),
  
  // Campos do Formulário
  inputId: document.getElementById('doceId'),
  inputNome: document.getElementById('doceNome'),
  inputTipo: document.getElementById('doceTipo'),
  inputPreco: document.getElementById('docePreco'),
  inputFotoUrl: document.getElementById('doceFotoUrl'),
  imagePreview: document.getElementById('imagePreview'),
  previewPlaceholder: document.getElementById('previewPlaceholder'),
  
  // Erros de Validação
  erroNome: document.getElementById('erroNome'),
  erroTipo: document.getElementById('erroTipo'),
  erroPreco: document.getElementById('erroPreco'),
  erroFotoUrl: document.getElementById('erroFotoUrl'),
  
  // Modal de Exclusão
  deleteModal: document.getElementById('confirmDeleteModal'),
  deleteDoceNome: document.getElementById('deleteDoceNome'),
  btnFecharConfirmDelete: document.getElementById('btnFecharConfirmDelete'),
  btnCancelarDelete: document.getElementById('btnCancelarDelete'),
  btnConfirmarDelete: document.getElementById('btnConfirmarDelete'),
  
  // Toast
  toastContainer: document.getElementById('toastContainer')
};

// Imagem fallback padrão para confeitos caso o link quebre
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60';

// ==========================================================================
// Utilitários
// ==========================================================================

/**
 * Formata um valor numérico para o padrão de moeda Real Brasileiro (BRL)
 */
function formatarPreco(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(valor) || 0);
}

/**
 * Exibe notificação temporária do tipo toast
 */
function mostrarToast(mensagem, tipo = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;
  
  const icon = tipo === 'success' ? '✅' : '⚠️';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${escapeHtml(mensagem)}</span>
  `;
  
  dom.toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * Sanitiza texto para prevenir XSS no innerHTML
 */
function escapeHtml(texto) {
  if (texto === null || texto === undefined) return '';
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Retorna a classe CSS do badge com base no tipo do doce
 */
function getBadgeClass(tipo) {
  const normalizado = String(tipo).toLowerCase();
  if (normalizado.includes('bolo')) return 'badge-bolo';
  if (normalizado.includes('torta')) return 'badge-torta';
  if (normalizado.includes('brigadeiro')) return 'badge-brigadeiro';
  if (normalizado.includes('cupcake')) return 'badge-cupcake';
  return 'badge-docinho';
}

// ==========================================================================
// Chamadas à API (Fetch API)
// ==========================================================================

/**
 * Carrega a lista completa de doces do backend
 */
async function carregarDoces() {
  dom.loading.style.display = 'block';
  dom.emptyState.style.display = 'none';
  dom.grid.innerHTML = '';

  try {
    const resposta = await fetch(API_URL);
    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status}: Falha ao buscar lista de doces.`);
    }

    const dados = await resposta.json();
    state.doces = Array.isArray(dados) ? dados : [];
    renderizarDoces();
  } catch (error) {
    console.error('Erro na requisição GET /api/doces:', error);
    mostrarToast('Não foi possível conectar à API. Verifique se o servidor backend está rodando.', 'error');
    dom.emptyState.style.display = 'block';
    document.getElementById('emptyStateTitle').textContent = 'Erro ao carregar cardápio';
    document.getElementById('emptyStateDesc').textContent = 'Verifique se o backend está em execução na porta 3000 ou tente novamente mais tarde.';
  } finally {
    dom.loading.style.display = 'none';
  }
}

/**
 * Envia novo doce ou atualização para o backend
 */
async function salvarDoce(event) {
  event.preventDefault();

  if (!validarFormulario()) {
    return;
  }

  const payload = {
    nome: dom.inputNome.value.trim(),
    tipo: dom.inputTipo.value.trim(),
    preco: parseFloat(dom.inputPreco.value),
    fotoUrl: dom.inputFotoUrl.value.trim()
  };

  const id = dom.inputId.value;
  const isEdicao = Boolean(id);

  setBotaoCarregando(dom.btnSalvarDoce, true, isEdicao ? 'Salvando...' : 'Cadastrando...');

  try {
    const url = isEdicao ? `${API_URL}/${id}` : API_URL;
    const metodo = isEdicao ? 'PUT' : 'POST';

    const resposta = await fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || 'Falha ao salvar doce.');
    }

    mostrarToast(isEdicao ? 'Doce atualizado com sucesso!' : 'Doce cadastrado com sucesso!', 'success');
    fecharModalForm();
    await carregarDoces();
  } catch (error) {
    console.error('Erro ao salvar doce:', error);
    mostrarToast(error.message || 'Erro inesperado ao salvar doce.', 'error');
  } finally {
    setBotaoCarregando(dom.btnSalvarDoce, false, isEdicao ? 'Salvar Alterações' : 'Salvar Doce');
  }
}

/**
 * Remove um doce pelo seu ID
 */
async function confirmarRemocao() {
  if (!state.doceParaExcluir) return;

  const { id } = state.doceParaExcluir;
  setBotaoCarregando(dom.btnConfirmarDelete, true, 'Excluindo...');

  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || 'Falha ao excluir doce.');
    }

    mostrarToast('Doce removido com sucesso!', 'success');
    fecharModalDelete();
    await carregarDoces();
  } catch (error) {
    console.error('Erro ao excluir doce:', error);
    mostrarToast(error.message || 'Erro inesperado ao excluir doce.', 'error');
  } finally {
    setBotaoCarregando(dom.btnConfirmarDelete, false, 'Excluir');
  }
}

// ==========================================================================
// Renderização e Filtros
// ==========================================================================

/**
 * Renderiza os cards de doce com base nos filtros ativos
 */
function renderizarDoces() {
  dom.totalBadge.textContent = state.doces.length;

  const docesFiltrados = state.doces.filter(doce => {
    // Filtro por Tipo
    const tiposConhecidos = ['Bolo', 'Torta', 'Brigadeiro', 'Cupcake', 'Docinho', 'Sobremesa'];
    const matchTipo = (state.filtroTipo === 'todos') ||
      (state.filtroTipo === 'Outros' && !tiposConhecidos.includes(doce.tipo)) ||
      (doce.tipo === state.filtroTipo);

    // Filtro por Nome (Busca)
    const matchBusca = !state.termoBusca ||
      doce.nome.toLowerCase().includes(state.termoBusca.toLowerCase());

    return matchTipo && matchBusca;
  });

  dom.grid.innerHTML = '';

  if (docesFiltrados.length === 0) {
    dom.emptyState.style.display = 'block';
    if (state.doces.length === 0) {
      document.getElementById('emptyStateTitle').textContent = 'Nenhum doce cadastrado ainda';
      document.getElementById('emptyStateDesc').textContent = 'Clique no botão abaixo para adicionar a primeira delícia ao cardápio!';
      dom.btnEmptyNovoDoce.style.display = 'inline-flex';
    } else {
      document.getElementById('emptyStateTitle').textContent = 'Nenhuma delícia encontrada';
      document.getElementById('emptyStateDesc').textContent = 'Tente ajustar os filtros ou o termo de busca.';
      dom.btnEmptyNovoDoce.style.display = 'none';
    }
    return;
  }

  dom.emptyState.style.display = 'none';

  docesFiltrados.forEach(doce => {
    const card = document.createElement('article');
    card.className = 'doce-card';
    card.setAttribute('data-id', doce._id);

    const badgeClass = getBadgeClass(doce.tipo);

    card.innerHTML = `
      <div class="card-image-wrapper">
        <img 
          src="${escapeHtml(doce.fotoUrl)}" 
          alt="${escapeHtml(doce.nome)}" 
          class="card-image"
          loading="lazy"
          onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';"
        >
        <span class="card-badge ${badgeClass}">${escapeHtml(doce.tipo)}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${escapeHtml(doce.nome)}</h3>
        <p class="card-price">${formatarPreco(doce.preco)}</p>
        <div class="card-actions">
          <button class="btn btn-outline btn-sm btn-editar" data-id="${doce._id}">
            ✏️ Editar
          </button>
          <button class="btn btn-outline btn-sm btn-excluir text-danger" data-id="${doce._id}">
            🗑️ Excluir
          </button>
        </div>
      </div>
    `;

    // Eventos dos botões de ação do card
    const btnEditar = card.querySelector('.btn-editar');
    const btnExcluir = card.querySelector('.btn-excluir');

    btnEditar.addEventListener('click', () => abrirModalEdicao(doce));
    btnExcluir.addEventListener('click', () => abrirModalDelete(doce));

    dom.grid.appendChild(card);
  });
}

// ==========================================================================
// Gestão de Modais e Formulários
// ==========================================================================

function abrirModalCadastro() {
  state.isEditando = false;
  limparErros();
  dom.form.reset();
  dom.inputId.value = '';
  dom.modalTitle.textContent = 'Cadastrar Novo Doce';
  dom.btnSalvarDoce.querySelector('.btn-text').textContent = 'Salvar Doce';
  atualizarPreviewImagem('');
  abrirModal(dom.modal);
}

function abrirModalEdicao(doce) {
  state.isEditando = true;
  limparErros();
  dom.inputId.value = doce._id;
  dom.inputNome.value = doce.nome;
  dom.inputTipo.value = doce.tipo;
  dom.inputPreco.value = doce.preco;
  dom.inputFotoUrl.value = doce.fotoUrl;
  
  dom.modalTitle.textContent = 'Editar Doce';
  dom.btnSalvarDoce.querySelector('.btn-text').textContent = 'Salvar Alterações';
  atualizarPreviewImagem(doce.fotoUrl);
  abrirModal(dom.modal);
}

function fecharModalForm() {
  fecharModal(dom.modal);
  dom.form.reset();
  limparErros();
}

function abrirModalDelete(doce) {
  state.doceParaExcluir = doce;
  dom.deleteDoceNome.textContent = `"${doce.nome}"`;
  abrirModal(dom.deleteModal);
}

function fecharModalDelete() {
  fecharModal(dom.deleteModal);
  state.doceParaExcluir = null;
}

function abrirModal(modalElement) {
  modalElement.classList.add('show');
  modalElement.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function fecharModal(modalElement) {
  modalElement.classList.remove('show');
  modalElement.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function atualizarPreviewImagem(url) {
  if (url && url.startsWith('http')) {
    dom.imagePreview.src = url;
    dom.imagePreview.style.display = 'block';
    dom.previewPlaceholder.style.display = 'none';

    dom.imagePreview.onerror = () => {
      dom.imagePreview.style.display = 'none';
      dom.previewPlaceholder.style.display = 'block';
      dom.previewPlaceholder.textContent = 'URL de imagem inválida ou inacessível';
    };
  } else {
    dom.imagePreview.src = '';
    dom.imagePreview.style.display = 'none';
    dom.previewPlaceholder.style.display = 'block';
    dom.previewPlaceholder.textContent = 'Insira uma URL válida para visualizar';
  }
}

// ==========================================================================
// Validação do Formulário
// ==========================================================================

function validarFormulario() {
  limparErros();
  let valido = true;

  const nome = dom.inputNome.value.trim();
  const tipo = dom.inputTipo.value.trim();
  const preco = parseFloat(dom.inputPreco.value);
  const fotoUrl = dom.inputFotoUrl.value.trim();

  if (!nome || nome.length < 2) {
    exibirErroCampo(dom.inputNome, dom.erroNome, 'O nome deve ter no mínimo 2 caracteres.');
    valido = false;
  }

  if (!tipo) {
    exibirErroCampo(dom.inputTipo, dom.erroTipo, 'Selecione uma categoria/tipo para o doce.');
    valido = false;
  }

  if (isNaN(preco) || preco < 0) {
    exibirErroCampo(dom.inputPreco, dom.erroPreco, 'Informe um preço válido e positivo.');
    valido = false;
  }

  if (!fotoUrl || !fotoUrl.startsWith('http')) {
    exibirErroCampo(dom.inputFotoUrl, dom.erroFotoUrl, 'Informe uma URL completa (ex: https://...).');
    valido = false;
  }

  return valido;
}

function exibirErroCampo(input, erroElemento, mensagem) {
  input.classList.add('is-invalid');
  erroElemento.textContent = mensagem;
}

function limparErros() {
  [dom.inputNome, dom.inputTipo, dom.inputPreco, dom.inputFotoUrl].forEach(input => {
    input.classList.remove('is-invalid');
  });
  [dom.erroNome, dom.erroTipo, dom.erroPreco, dom.erroFotoUrl].forEach(elem => {
    elem.textContent = '';
  });
}

function setBotaoCarregando(botao, carregando, texto) {
  const spinner = botao.querySelector('.btn-spinner');
  const textElem = botao.querySelector('.btn-text');

  if (spinner) spinner.style.display = carregando ? 'inline-block' : 'none';
  if (textElem) textElem.textContent = texto;
  botao.disabled = carregando;
}

// ==========================================================================
// Event Listeners
// ==========================================================================

// Abertura de Modais
dom.btnNovoDoce.addEventListener('click', abrirModalCadastro);
dom.btnEmptyNovoDoce.addEventListener('click', abrirModalCadastro);

// Fechamento de Modais
dom.btnFecharModal.addEventListener('click', fecharModalForm);
dom.btnCancelarModal.addEventListener('click', fecharModalForm);
dom.btnFecharConfirmDelete.addEventListener('click', fecharModalDelete);
dom.btnCancelarDelete.addEventListener('click', fecharModalDelete);

// Fechar ao clicar fora do modal
[dom.modal, dom.deleteModal].forEach(modalElement => {
  modalElement.addEventListener('click', (e) => {
    if (e.target === modalElement) {
      if (modalElement === dom.modal) fecharModalForm();
      else fecharModalDelete();
    }
  });
});

// Tecla Escape fecha modais
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (dom.modal.classList.contains('show')) fecharModalForm();
    if (dom.deleteModal.classList.contains('show')) fecharModalDelete();
  }
});

// Submissão do Formulário
dom.form.addEventListener('submit', salvarDoce);

// Confirmação de Exclusão
dom.btnConfirmarDelete.addEventListener('click', confirmarRemocao);

// Atualização de Prévia de Imagem em tempo real
dom.inputFotoUrl.addEventListener('input', (e) => {
  atualizarPreviewImagem(e.target.value.trim());
});

// Filtro de Busca
dom.searchInput.addEventListener('input', (e) => {
  state.termoBusca = e.target.value.trim();
  dom.btnClearSearch.style.display = state.termoBusca ? 'block' : 'none';
  renderizarDoces();
});

dom.btnClearSearch.addEventListener('click', () => {
  dom.searchInput.value = '';
  state.termoBusca = '';
  dom.btnClearSearch.style.display = 'none';
  renderizarDoces();
});

// Filtro por Categoria (Pills)
dom.filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    dom.filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    state.filtroTipo = pill.getAttribute('data-type');
    renderizarDoces();
  });
});

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  carregarDoces();
});
