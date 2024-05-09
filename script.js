const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sApresentacao = document.querySelector('#m-apresentacao')
const sViaadm = document.querySelector('#m-viaadm')
const btnSalvar = document.querySelector('#btnSalvar')
const searchInput = document.querySelector('#searchInput')

let itens
let id

function openModal(edit = false, index = 0) {
  modal.classList.add('active')

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  if (edit) {
    sNome.value = itens[index].nome
    sApresentacao.value = itens[index].apresentacao
    sViaadm.value = itens[index].viaadm
    id = index
  } else {
    sNome.value = ''
    sApresentacao.value = ''
    sViaadm.value = ''
  }
}

function editItem(index) {
  openModal(true, index)
}

function deleteItem(index) {
  itens.splice(index, 1)
  setItensBD()
  loadItens(searchInput.value)
}

function insertItem(item, index) {
  let tr = document.createElement('tr')

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.apresentacao}</td>
    <td>${item.viaadm}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `
  tbody.appendChild(tr)
}

btnSalvar.onclick = e => {
  if (sNome.value == '' || sApresentacao.value == '' || sViaadm.value == '') {
    return
  }

  e.preventDefault();

  if (id !== undefined) {
    itens[id].nome = sNome.value
    itens[id].apresentacao = sApresentacao.value
    itens[id].viaadm = sViaadm.value
  } else {
    itens.push({'nome': sNome.value, 'apresentacao': sApresentacao.value, 'viaadm': sViaadm.value})
  }

  setItensBD()

  modal.classList.remove('active')
  loadItens(searchInput.value)
  id = undefined
}

function loadItens(searchText = '') {
  itens = getItensBD().filter(item => {
    const lowerCaseSearchText = searchText.toLowerCase()
    return item.nome.toLowerCase().includes(lowerCaseSearchText) ||
           item.apresentacao.toLowerCase().includes(lowerCaseSearchText) ||
           item.viaadm.toLowerCase().includes(lowerCaseSearchText)
  })

  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })
}

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))

searchInput.addEventListener('input', () => {
  loadItens(searchInput.value)
})

loadItens()
