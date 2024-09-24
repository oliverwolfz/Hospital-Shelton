let filaSenhas = {
  emergencia: [],
  preferencial: [],
  normal: []
};

let ultimasSenhasChamadas = [];
let senhaAtual = null;

// Carregar dados do localStorage
window.onload = function() {
  if (localStorage.getItem('filaSenhas')) {
    filaSenhas = JSON.parse(localStorage.getItem('filaSenhas'));
  }

  if (localStorage.getItem('ultimasSenhasChamadas')) {
    ultimasSenhasChamadas = JSON.parse(localStorage.getItem('ultimasSenhasChamadas'));
    renderizarUltimasSenhas();
  }

  if (localStorage.getItem('senhaAtual')) {
    senhaAtual = JSON.parse(localStorage.getItem('senhaAtual'));
    document.getElementById('senha-atual-display').textContent = `${senhaAtual.senha} - ${senhaAtual.nome} - ${senhaAtual.horaChamada}`;
  }

  renderizarSenhasNaFila();
};

// Gerar senha
function gerarSenha(tipo) {
  const nomePaciente = document.getElementById('nome-paciente').value;

  if (nomePaciente.trim() === "") {
    alert("Por favor, insira o nome do paciente.");
    return;
  }

  const novoNumero = (filaSenhas[tipo].length + 1).toString().padStart(3, '0');
  const novaSenha = `${tipo.charAt(0).toUpperCase()}${novoNumero}`;

  const senhaComNome = { senha: novaSenha, nome: nomePaciente };

  filaSenhas[tipo].push(senhaComNome);
  salvarNoLocalStorage();

  renderizarSenhasNaFila();
  document.getElementById('nome-paciente').value = ''; // Limpar o campo após gerar senha
}

// Função para retornar o horário formatado
function getclock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
  console.log(getclock());
}

// Chamar próxima senha
function chamarProximaSenha() {
  let horaChamada = getclock(); // Captura o horário

  if (filaSenhas.emergencia.length > 0) {
    senhaAtual = filaSenhas.emergencia.shift();
  } else if (filaSenhas.preferencial.length > 0) {
    senhaAtual = filaSenhas.preferencial.shift();
  } else if (filaSenhas.normal.length > 0) {
    senhaAtual = filaSenhas.normal.shift();
  } else {
    senhaAtual = { senha: 'Nenhuma senha na fila', nome: '' };
  }

  senhaAtual.horaChamada = horaChamada; // Adiciona o horário da chamada à senha

  console.log("Senha chamada: ", senhaAtual);

  document.getElementById('senha-atual-display').textContent = `${senhaAtual.senha} - ${senhaAtual.nome} - ${senhaAtual.horaChamada}`;
  ultimasSenhasChamadas.unshift(senhaAtual);
  if (ultimasSenhasChamadas.length > 5) {
    ultimasSenhasChamadas.pop();
  }

  salvarNoLocalStorage();
  renderizarUltimasSenhas();
  renderizarSenhasNaFila();
  console.log("Dados do localStorage:", localStorage.getItem('filaSenhas'));
}

// Renderizar senhas na fila
function renderizarSenhasNaFila() {
  const listaFila = document.getElementById('senhas-na-fila');
  listaFila.innerHTML = '';

  Object.keys(filaSenhas).forEach(tipo => {
    filaSenhas[tipo].forEach(senha => {
      const li = document.createElement('li');
      li.textContent = `${senha.senha} - ${senha.nome}`;
      listaFila.appendChild(li);
    });
  });
}

// Renderizar últimas senhas chamadas
function renderizarUltimasSenhas() {
  const listaUltimasSenhas = document.getElementById('ultimas-senhas');
  listaUltimasSenhas.innerHTML = '';

  ultimasSenhasChamadas.forEach(senha => {
    const li = document.createElement('li');
    li.textContent = `${senha.senha} - ${senha.nome} - ${senha.horaChamada}`;
    listaUltimasSenhas.appendChild(li);
  });
}

// Limpar histórico de senhas
function limpar() {
  if (confirm("Tem certeza que deseja limpar o histórico?")) {
    filaSenhas = {
      emergencia: [],
      preferencial: [],
      normal: []
    };
    ultimasSenhasChamadas = [];
    senhaAtual = null;

    localStorage.removeItem('filaSenhas');
    localStorage.removeItem('ultimasSenhasChamadas');
    localStorage.removeItem('senhaAtual');

    document.getElementById('senha-atual-display').textContent = 'Nenhuma senha chamada';
    renderizarSenhasNaFila();
    renderizarUltimasSenhas();
  }
}

// Salvar dados no localStorage
function salvarNoLocalStorage() {
  localStorage.setItem('filaSenhas', JSON.stringify(filaSenhas));
  localStorage.setItem('ultimasSenhasChamadas', JSON.stringify(ultimasSenhasChamadas));
  localStorage.setItem('senhaAtual', JSON.stringify(senhaAtual));
}

// Relógio
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  document.getElementById('seconds').textContent = seconds;
}

// Atualiza o relógio a cada segundo
setInterval(updateClock, 1000);

// Atualiza o relógio imediatamente ao carregar a página
updateClock();
