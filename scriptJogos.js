const jogosDefault = [];  /*esta array serve para armazenar os jogos, no inicio comecei por ter aqui alguns jogos para experimentar e tal
mas dps começei a por todos pelo formulário que criei, para experimentar ver os bugs e tudo o mais*/

/*----------------------(())--------------------*/

function criarCardJogo(jogo){
    return `
    <div class="card-jogo"data-genero="${jogo.genero}" data-plataforma="${jogo.plataforma.join(',')}">
      <img src="${jogo.imagem}" alt="${jogo.nome}">
      <h3>${jogo.nome}</h3>
      <p>${jogo.descricao}</p>
      <span>${jogo.genero.join(", ")} | ${jogo.plataforma.join(", ")} | ${jogo.ano}</span>
      <span>⭐ ${jogo.rating}</span>
      <button onclick="editarJogo(${jogo.id})">Editar</button>
    </div>
  `;
}/*esta funcao transforma o que for criado em html*/
function renderizarJogos(lista){
    const container = document.getElementById("games-container");
    container.innerHTML = lista.map(j => criarCardJogo(j)).join("");
}/*esta funcao tal como o nome explicita ela renderiza o ecrã*/


function carregarJogos(){
    const guardados = localStorage.getItem("jogos");
    return guardados ? JSON.parse(guardados) : jogosDefault;
}/*esta funcao vai verificar se o jogo esta guardado e guarda-o caso o ? = false*/


function guardarJogo(lista){
    localStorage.setItem("jogos", JSON.stringify(lista));
}

let jogos = carregarJogos();
renderizarJogos(jogos);
document.getElementById("search").addEventListener("input", function(){
    const texto = this.value.toLowerCase();
    const filtrados = jogos.filter( j => j.nome.toLowerCase().includes(texto));
    renderizarJogos(filtrados);
});/*input se pesquisar*/

function adicionarJogo(nome, imagem, genero, plataforma, ano, descricao, rating){
    const novoJogo = {
        id: Date.now(), /*id unico baseado no TEMPO*/
        nome,
        imagem,
        genero: genero.split(",").map(p => p.trim()), /*caso multigenero*/
        plataforma: plataforma.split(",").map(p => p.trim()), /*caso multiplataforma*/
        ano: parseInt(ano),
        descricao,
        rating: parseFloat(rating),
    };
    jogos.push(novoJogo);
    guardarJogo(jogos); /*guarda no local storgae lá em cima na outra func*/
    renderizarJogos(jogos); /*atualiza o ecrã*/
}


let filtroGenero = null;
let filtroPlataforma = null;
let jogoAEditar = null;


function aplicarFiltros(){
    let resultado = jogos;
    if (filtroGenero){
        resultado = resultado.filter(j => j.genero.includes(filtroGenero));
    }
    if (filtroPlataforma){
        resultado = resultado.filter(j => j.plataforma.includes(filtroPlataforma));
    }
    renderizarJogos(resultado);
}/*esta function usa o input para filtrar os jogos*/

/*----------------------(())--------------------*//*isto estava aqui a causar uns problemas com os filtros, tive de reescrever a function...
// tem tbm a haver com o bug descrito mais em cima^*/

document.querySelectorAll("#filters [data-genero]").forEach(btn => {
    btn.addEventListener("click", function(){
        filtroGenero = filtroGenero === this.dataset.genero ? null : this.dataset.genero;
        document.querySelectorAll("#filters [data-genero]").forEach(b => b.classList.remove("ativo"));
        if (filtroGenero) this.classList.add("ativo");
        aplicarFiltros();
    })
})/*aplica filtro genero*/
document.querySelectorAll("#filters-plataforma [data-plataforma]").forEach(btn => {
    btn.addEventListener("click", function(){
        filtroPlataforma = filtroPlataforma === this.dataset.plataforma ? null : this.dataset.plataforma;
         document.querySelectorAll("#filters-plataforma [data-plataforma]").forEach(b => b.classList.remove("ativo"));
        if (filtroPlataforma) this.classList.add("ativo");
        aplicarFiltros();
    })
})/*aplica filtro plataforma*/

/*----------------------(())--------------------*//*mais um bug encontrado quando estou a procura de um jogo, caso esteja num tipod e platafroma que
tenha o jogo e passar para o genero que tenho o mesmo eles mostram o jogo mas caso vá para um gen que n o tenha e dep para o tipo que ele tem
fica void, ou seja, vazio, como se n existisse, isso tbm +e um problema com os filtros*/

// Os 3 mais recentes
const recentes = [...jogos].sort((a, b) => b.ano - a.ano).slice(0, 3);
// Top 5 por rating
const top10 = [...jogos].sort((a, b) => b.rating - a.rating).slice(0, 5);

/*----------------------(())--------------------*/

function submeterJogo() {
  const nome = document.getElementById("input-nome").value;
  const ficheiroImagem = document.getElementById("input-imagem").files[0];
  const genero = Array.from(document.getElementById("input-genero").selectedOptions).map(o => o.value).join(", ");
  const plataforma = document.getElementById("input-plataforma").value;
  const ano = document.getElementById("input-ano").value;
  const descricao = document.getElementById("input-descricao").value;
  const rating = document.getElementById("input-rating").value;

  if (rating < 0 || rating > 10) {
    alert("O rating tem de ser entre 0 e 10!");
    return;
  }

  if (jogoAEditar) {
    const index = jogos.findIndex(j => j.id === jogoAEditar);
    jogos[index].nome = nome;
    jogos[index].genero = genero.split(",").map(p => p.trim());
    jogos[index].plataforma = plataforma.split(",").map(p => p.trim());
    jogos[index].ano = parseInt(ano);
    jogos[index].descricao = descricao;
    jogos[index].rating = parseFloat(rating);

    if (ficheiroImagem) {
        const reader = new FileReader();
        reader.onload = function(e) {
            jogos[index].imagem = e.target.result;
            guardarJogo(jogos);
            renderizarJogos(jogos);
        };
        reader.readAsDataURL(ficheiroImagem);
    } else {
        guardarJogo(jogos);
        renderizarJogos(jogos);
    }

    jogoAEditar = null;
    document.getElementById("adicionar-jogos").classList.add("hidden");
    document.getElementById("btn-adicionar-toggle").textContent = "➕ Adicionar Jogo";
    return;
  }   

  if (!nome || !genero || !plataforma || !ano) {
    alert("Preenche pelo menos o nome, género, plataforma e ano!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const imagem = e.target.result;
    adicionarJogo(nome, imagem, genero, plataforma, ano, descricao, rating);

    document.getElementById("input-nome").value = "";
    document.getElementById("input-imagem").value = "";
    document.getElementById("input-plataforma").value = "";
    document.getElementById("input-ano").value = "";
    document.getElementById("input-descricao").value = "";
    document.getElementById("input-rating").value = "";
  };
  reader.readAsDataURL(ficheiroImagem);
}/*esta func vai usar o botton do html que esta no jogos.html*/



document.getElementById("btn-adicionar-toggle").addEventListener("click", function(){
    document.getElementById("adicionar-jogos").classList.toggle("hidden");
    this.textContent = this.textContent === "➕ Adicionar Jogo" ? "✖ Fechar" : "➕ Adicionar Jogo";
});


/*sem querer enganei me a escrever os atributos do jogo, sinceramente, ent tive de criar uma opc para os editar*/


function editarJogo(id) {
    const jogo = jogos.find(j => j.id === id);
    jogoAEditar = id;

    document.getElementById("input-nome").value = jogo.nome;
    const selectGenero = document.getElementById("input-genero");
    Array.from(selectGenero.options).forEach(option => {
        option.selected = jogo.genero.includes(option.value);
        });
    document.getElementById("input-plataforma").value = jogo.plataforma.join(",");  /*para dar select de mais que um genero tenho de usar o ctrl enquando escolho todos*/
    document.getElementById("input-ano").value = jogo.ano;
    document.getElementById("input-descricao").value = jogo.descricao;
    document.getElementById("input-rating").value = jogo.rating;

    document.getElementById("adicionar-jogos").classList.remove("hidden");
    document.getElementById("btn-adicionar-toggle").textContent = "✖ Fechar";
}