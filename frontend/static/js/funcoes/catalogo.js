// o catalogo de funcoes vem uma vez so e fica guardado: as vagas so dizem o
// nome da funcao, e e por ele que a tela descobre a classe
let catalogoGuardado = null;

function catalogo() {
    if (!catalogoGuardado) {
        catalogoGuardado = pedir("/skills").then((skills) => skills || []);
    }

    return catalogoGuardado;
}

async function categoriaDaFuncao(nome) {
    const skills = await catalogo();
    const achada = skills.find((skill) => skill.nome === nome);

    return achada ? achada.categoria : null;
}


// as rotas de membro e de avaliacao nao trazem as funcoes da pessoa; a lista
// publica de profissionais traz. Ela vem uma vez so e da a classe (a cor do
// bonequinho) de qualquer pessoa pelo apelido
let jogadoresGuardados = null;

function jogadores() {
    if (!jogadoresGuardados) {
        // guarda a promessa e nao o resultado entao se duas partes da tela pedirem ao mesmo tempo so vai um pedido pra api
        // o map deixa achar a pessoa pelo apelido na hora sem ficar procurando na lista
        jogadoresGuardados = pedir("/busca/profissionais").then(function (pessoas) {
            return new Map((pessoas || []).map((pessoa) => [pessoa.handle, pessoa]));
        });
    }

    return jogadoresGuardados;
}

// junta as funcoes na pessoa que veio sem elas
async function comFuncoes(pessoa) {
    const conhecida = (await jogadores()).get(pessoa.handle);

    // os tres pontinhos copiam a pessoa e so trocam as skills sem mexer no objeto original
    return conhecida ? { ...pessoa, skills: conhecida.skills } : pessoa;
}
