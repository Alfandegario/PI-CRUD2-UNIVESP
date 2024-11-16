const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sNome = document.querySelector('#m-nome');
const sFuncao = document.querySelector('#m-email');
const sCpf = document.querySelector('#m-cpf');
const sTelefone = document.querySelector('#m-telefone');
const btnSalvar = document.querySelector('#btnSalvar');
const searchInput = document.querySelector('#searchInput');
const btnSearch = document.querySelector('#btnSearch');

let itens = [];
let id;

async function fetchItens() {
  const querySnapshot = await db.collection('clientes').get();
  itens = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  loadItens();
}

function loadItens(filteredItems = itens) {
  tbody.innerHTML = '';
  filteredItems.forEach((item, index) => {
    insertItem(item, index);
  });
}

function openModal(edit = false, index = 0) {
  modal.classList.add('active');

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active');
    }
  }

  if (edit) {
    sNome.value = itens[index].nome;
    sFuncao.value = itens[index].funcao;
    sCpf.value = itens[index].cpf;
    sTelefone.value = itens[index].telefone;
    id = index;
  } else {
    sNome.value = '';
    sFuncao.value = '';
    sCpf.value = '';
    sTelefone.value = '';
  }
}

function editItem(index) {
  openModal(true, index);
}

async function deleteItem(index) {
  await db.collection('clientes').doc(itens[index].id).delete();
  fetchItens();
}

function insertItem(item, index) {
  let tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.funcao}</td>
    <td>${item.cpf}</td>
    <td>${item.telefone}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit'></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}

btnSalvar.onclick = async e => {
  e.preventDefault();
  console.log("Botão Salvar clicado");

  if (sNome.value == '' || sFuncao.value == '' || sCpf.value == '' || sTelefone.value == '') {
    return;
  }

  const item = {
    nome: sNome.value,
    funcao: sFuncao.value,
    cpf: sCpf.value,
    telefone: sTelefone.value
  };

  if (id !== undefined) {
    await db.collection('clientes').doc(itens[id].id).update(item);
  } else {
    await db.collection('clientes').add(item);
  }

  modal.classList.remove('active');
  fetchItens();
  id = undefined;
}

btnSearch.onclick = () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredItems = itens.filter(item => item.nome.toLowerCase().includes(searchTerm));
  loadItens(filteredItems);
}

fetchItens();

