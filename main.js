let livros = [];

function perguntaNome() {
    let nome = window.prompt("Qual o seu nome?");
    let elementoNome = document.querySelector("#elemento_nome");
    elementoNome.innerHTML = nome;
}

function adicionarLivro(event) {
    // Previnindo comportamento padrão da página
    event.preventDefault();

    // Puxando informações de entrada do formulário
    let tituloLivro = document.querySelector("#nome_livro").value;
    let autorLivro = document.querySelector("#autores_livro").value;
    let capaLivro = document.querySelector("#imagem_livro").value;
    let paginasLidas = document.querySelector("#paginas_lidas").value;
    let totalPaginas = document.querySelector("#total_paginas").value;

    let lido = livroFoiLido(paginasLidas, totalPaginas);

    let livroCompleto = {
        titulo : tituloLivro, 
        autor: autorLivro,
        capa: capaLivro,
        paginasLidas: paginasLidas,
        totalPaginas: totalPaginas,
        lido: lido
    }

    livros.push(livroCompleto);
    
    // Cálculos de páginas
    let paginasFaltantes = calculoPaginasFaltantes(livros);
    let percentualPaginas = calculoPercentualLeitura(livros);
    let totalPaginasLidasLivros = atualizaPaginasLidas(livros);
    
    imprimirNaTela(totalPaginasLidasLivros, paginasFaltantes, percentualPaginas);
    imprimirLivroNaTela(livroCompleto);
}

function calculoPaginasFaltantes(livros){
    let totalPaginasLidasLivros = 0;
    let totalPaginasLivros = 0;

    for (let i = 0; i < livros.length; i++) {
        totalPaginasLidasLivros += Number(livros[i].paginasLidas);
        totalPaginasLivros += Number(livros[i].totalPaginas);
    }

    let paginasFaltantes = totalPaginasLivros - totalPaginasLidasLivros
    return paginasFaltantes;
}

function calculoPercentualLeitura(livros){
    let totalPaginas = 0;
    let paginasLidas = 0;
    for(let i=0; i<livros.length;i++){
        totalPaginas += Number(livros[i].totalPaginas);
        paginasLidas += Number(livros[i].paginasLidas);
    }
    let percentualPaginas = paginasLidas * 100 / totalPaginas;
    return percentualPaginas;
}

function imprimirNaTela(paginasLidas, paginasFaltantes, percentualPaginas) {
    // Parágrafo de páginas lidas
    let elementoPaginasLidas = document.querySelector("#elemento_paginas_lidas");
    elementoPaginasLidas.innerHTML = paginasLidas;
    // Parágrafo de páginas faltantes
    let elementoPaginasFaltantes = document.querySelector("#elemento_paginas_faltantes");
    elementoPaginasFaltantes.innerHTML = paginasFaltantes;
    // Parágrafo de porcentagem de páginas para meta
    let elementoPorcentagemPaginas = document.querySelector("#elemento_porcentagem_paginas");
    elementoPorcentagemPaginas.innerHTML = percentualPaginas.toFixed(2) + "%";
}

function imprimirLivroNaTela(livroCompleto) {

    if (livroCompleto.lido == true) {
        let elementoArticle = criarElementoLivroLido(livroCompleto);
        let elementoListaLido = document.querySelector("#lista_livros_lidos");
        elementoListaLido.appendChild(elementoArticle);
    } else {
        let elementoArticle = criarElementoLivroLendo(livroCompleto);
        let elementoListaLendo = document.querySelector("#lista_livros_nao_lidos");
        elementoListaLendo.appendChild(elementoArticle);
    }
    
}

function criarElementoLivroLendo(livroCompleto) {
    let elementoArticle = document.createElement("article");
    elementoArticle.className = "livro";
    let elementoImagem = document.createElement("img");
    elementoImagem.src = livroCompleto.capa;
    elementoArticle.appendChild(elementoImagem);

    let elementoTituloLivro = document.createElement("h1");
    elementoTituloLivro.innerText = livroCompleto.titulo;
    elementoArticle.appendChild(elementoTituloLivro);

    let elementoAutorLivro = document.createElement("p");
    elementoAutorLivro.innerText = livroCompleto.autor;
    elementoArticle.appendChild(elementoAutorLivro);

    let elementoProgressoLeitura = document.createElement("input");
    elementoProgressoLeitura.type = "range";
    elementoProgressoLeitura.min = 0;
    elementoProgressoLeitura.value = livroCompleto.paginasLidas;
    elementoProgressoLeitura.max = livroCompleto.totalPaginas;
    elementoArticle.appendChild(elementoProgressoLeitura);

    let elementoBotaoDelete = document.createElement("button");
    elementoBotaoDelete.innerText = "X Deletar o livro";
    elementoArticle.appendChild(elementoBotaoDelete);
    elementoBotaoDelete.className = "botao-simples-texto";

    deletarLivro(elementoBotaoDelete, elementoArticle, livroCompleto);
    marcarLivroLido(elementoProgressoLeitura, livroCompleto, elementoArticle);
    return elementoArticle;
}

function criarElementoLivroLido(livroCompleto) {
    let elementoArticle = document.createElement("article");
    elementoArticle.className = "livro lido";
    let elementoImagem = document.createElement("img");
    elementoImagem.src = livroCompleto.capa;
    elementoArticle.appendChild(elementoImagem);

    let elementoTituloLivro = document.createElement("h1");
    elementoTituloLivro.innerText = livroCompleto.titulo;
    elementoArticle.appendChild(elementoTituloLivro);

    let elementoBotaoDelete = document.createElement("button");
    elementoBotaoDelete.innerText = "X Deletar o livro";
    elementoArticle.appendChild(elementoBotaoDelete);
    elementoBotaoDelete.className = "botao-simples-texto";

    deletarLivro(elementoBotaoDelete, elementoArticle, livroCompleto);
    return elementoArticle;
}

function livroFoiLido(paginasLidas, totalPaginas) {
    if (paginasLidas == totalPaginas) {
        return true;
    }
    else {
        return false;
    }
}

function deletarLivro(elementoBotaoDelete, elementoArticle, livroCompleto) {
    elementoBotaoDelete.addEventListener("click", function(){
        elementoArticle.remove();
        let indice = livros.indexOf(livroCompleto);
        livros.splice(indice, 1);
        
        atualizaResumo(livroCompleto);
    })
}

function marcarLivroLido(elementoProgressoLeitura, livroCompleto, elementoArticle) {
    elementoProgressoLeitura.addEventListener("change", function(){
        let paginaAtual = elementoProgressoLeitura.value;
        livroCompleto.paginasLidas = paginaAtual;
        console.log(livroCompleto.paginasLidas);

        if (livroFoiLido(paginaAtual, livroCompleto.totalPaginas)){
            livroCompleto.lido = true;
            elementoArticle.remove();
            imprimirLivroNaTela(livroCompleto);
        }

        atualizaResumo(livroCompleto);
    })
}

function atualizaResumo(livroCompleto){
    let paginasFaltantesAtualizada = calculoPaginasFaltantes(livros);
    let percentualPaginasAtualizado = calculoPercentualLeitura(livros);

    imprimirNaTela(livroCompleto.paginasLidas, paginasFaltantesAtualizada, percentualPaginasAtualizado);
}

function atualizaPaginasLidas(){
    let totalPaginasLidasLivros = 0;

    for (let i = 0; i < livros.length; i++) {
        totalPaginasLidasLivros += Number(livros[i].paginasLidas);
    }
    return totalPaginasLidasLivros;
}