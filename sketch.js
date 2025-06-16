let agricultor;
let colheita;
let cidade;
let sitio;
let estado = "coletar";
let mensagem = "";
let tempoInicio;
let tempoFinal;
let dinheiro = 0;

// Obstáculos
let pedras = [];
let arvores = [];

// Animais móveis
let animais = [];

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);

  // Posições iniciais
  agricultor = createVector(100, 200);
  sitio = createVector(100, 200);
  colheita = createVector(400, 200);
  cidade = createVector(550, 50);

  // Cronômetro
  tempoInicio = millis();

  // Criar pedras (obstáculos)
  for (let i = 0; i < 5; i++) {
    let pos = createVector(random(150, 500), random(100, 350));
    pedras.push(pos);
  }

  // Criar árvores (obstáculos estáticos)
  for (let i = 0; i < 4; i++) {
    let pos = createVector(random(150, 500), random(100, 350));
    arvores.push(pos);
  }

  // Criar animais móveis
  animais.push({ pos: createVector(0, 150), emoji: '🐄', velocidade: 1.5 });
  animais.push({ pos: createVector(600, 220), emoji: '🐓', velocidade: -2 });
  animais.push({ pos: createVector(0, 280), emoji: '🐖', velocidade: 1 });
}

function draw() {
  background(180, 230, 180);

  // Desenhar trilha
  fill(200, 180, 100);
  rect(0, 180, width, 40);

  // Desenhar sítio e cidade (para referência no cenário)
  textSize(40);
  text('🏡', sitio.x, sitio.y);
  if (estado !== "coletar") {
    text('🏙️', cidade.x, cidade.y);
  }

  // Desenhar colheita se necessário
  if (estado === "coletar") {
    text('🌾', colheita.x, colheita.y);
  }

  // Desenhar pedras (apenas emoji, sem fundo)
  textSize(30);
  for (let p of pedras) {
    text('🌲', p.x, p.y);
  }

  // Desenhar árvores (apenas emoji, sem fundo)
  textSize(35);
  for (let a of arvores) {
    text('🌳', a.x, a.y);
  }

  // Atualizar e desenhar animais
  for (let animal of animais) {
    animal.pos.x += animal.velocidade;
    if (animal.pos.x > width + 30) animal.pos.x = -30;
    if (animal.pos.x < -30) animal.pos.x = width + 30;

    textSize(30);
    text(animal.emoji, animal.pos.x, animal.pos.y);
  }

  // Desenhar agricultor
  textSize(40);
  text('🚜', agricultor.x, agricultor.y);

  // Movimento do agricultor com colisão
  let anterior = agricultor.copy();
  if (keyIsDown(LEFT_ARROW)) agricultor.x -= 5;
  if (keyIsDown(RIGHT_ARROW)) agricultor.x += 5;
  if (keyIsDown(UP_ARROW)) agricultor.y -= 5;
  if (keyIsDown(DOWN_ARROW)) agricultor.y += 5;

  // Colisão com pedras
  for (let p of pedras) {
    if (dist(agricultor.x, agricultor.y, p.x, p.y) < 30) {
      agricultor = anterior;
    }
  }

  // Colisão com árvores
  for (let a of arvores) {
    if (dist(agricultor.x, agricultor.y, a.x, a.y) < 40) {
      agricultor = anterior;
    }
  }

  // Colisão com animais
  for (let animal of animais) {
    if (dist(agricultor.x, agricultor.y, animal.pos.x, animal.pos.y) < 30) {
      agricultor = anterior;
    }
  }

  // Lógica do jogo
  if (estado === "coletar" && dist(agricultor.x, agricultor.y, colheita.x, colheita.y) < 40) {
    estado = "levar";
    mensagem = "Agora precisamos levar para a cidade!";
    dinheiro += 50;
  }

  if (estado === "levar" && dist(agricultor.x, agricultor.y, cidade.x, cidade.y) < 40) {
    estado = "voltar";
    mensagem = "Agora volte para o sítio com o dinheiro!";
    tempoFinal = millis();
    dinheiro += 100;
  }

  if (estado === "voltar" && dist(agricultor.x, agricultor.y, sitio.x, sitio.y) < 40) {
    estado = "finalizado";
    mensagem = "Parabéns! Você voltou para o sítio com o dinheiro da venda! 🏆";
  }

  // --- Painel superior com retângulos separados ---

  noStroke();
  textAlign(LEFT, CENTER);
  textSize(18);

  // Retângulo Dinheiro
  let dinheiroTexto = `Dinheiro: R$ ${dinheiro}`;
  let dinheiroWidth = textWidth(dinheiroTexto) + 30;
  fill(255, 255, 220, 230);
  stroke(180, 180, 140);
  strokeWeight(2);
  rect(15, 10, dinheiroWidth, 35, 10);

  noStroke();
  fill(0);
  text(dinheiroTexto, 30, 28);

  // Retângulo Tempo
  let tempoDecorrido = (millis() - tempoInicio) / 1000;
  if (estado === "finalizado") {
    tempoDecorrido = (tempoFinal - tempoInicio) / 1000;
  }
  let tempoTexto = `Tempo: ${tempoDecorrido.toFixed(1)}s`;
  let tempoWidth = textWidth(tempoTexto) + 30;
  fill(255, 255, 220, 230);
  stroke(180, 180, 140);
  strokeWeight(2);
  rect(15 + dinheiroWidth + 15, 10, tempoWidth, 35, 10);

  noStroke();
  fill(0);
  text(tempoTexto, 30 + dinheiroWidth + 15, 28);

  // Caixa da mensagem principal (centralizada)
  fill(255, 255, 180, 230);
  stroke(150, 150, 100);
  strokeWeight(2);
  let boxWidth = 550;
  let boxHeight = 50;
  let boxX = width / 2 - boxWidth / 2;
  let boxY = 80;
  rect(boxX, boxY, boxWidth, boxHeight, 12);

  fill(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  text(mensagem, width / 2, boxY + boxHeight / 2);
}
