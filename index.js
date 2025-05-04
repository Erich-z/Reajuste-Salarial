const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const { idade, sexo, salario_base, anoContratacao, matricula } = req.query;

  if (!idade || !sexo || !salario_base || !anoContratacao || !matricula) {
    return res.send(erroHtml("Informe todos os parâmetros: idade, sexo, salario_base, anoContratacao e matricula."));
  }

  const idadeNum = parseInt(idade);
  const salario = parseFloat(salario_base);
  const ano = parseInt(anoContratacao);
  const matriculaNum = parseInt(matricula);
  const anoAtual = new Date().getFullYear();
  const tempoEmpresa = anoAtual - ano;
  const idadeNaContratacao = idadeNum - tempoEmpresa;

  if (isNaN(idadeNum)) return res.send(erroHtml("Idade inválida."));
  if (idadeNum < 18 || idadeNum > 99) return res.send(erroHtml("Idade deve estar entre 18 e 99 anos."));
  if (isNaN(salario) || salario <= 0) return res.send(erroHtml("Salário base inválido (deve ser maior que zero)."));
  if (isNaN(ano)) return res.send(erroHtml("Ano de contratação inválido."));
  if (ano < 1960) return res.send(erroHtml("Ano de contratação deve ser depois de 1960."));
  if (ano > anoAtual) return res.send(erroHtml("Ano de contratação não pode ser no futuro."));
  if (isNaN(matriculaNum) || matriculaNum <= 0) return res.send(erroHtml("Matrícula inválida."));
  if (sexo !== 'M' && sexo !== 'F') return res.send(erroHtml("Sexo inválido (deve ser 'M' ou 'F')."));
  if (idadeNum < tempoEmpresa) return res.send(erroHtml("Idade menor que tempo de empresa."));
  if (idadeNaContratacao <= 16) return res.send(erroHtml("Funcionário foi contratado com 16 anos ou menos."));

  // Cálculo do reajuste e adicional
  let reajuste = 0;
  let adicional = 0;

  if (idadeNum >= 18 && idadeNum <= 39) {
    reajuste = (sexo === 'M') ? 0.10 : 0.08;
    adicional = (tempoEmpresa <= 10) ? (sexo === 'M' ? 10 : 11) : (sexo === 'M' ? 17 : 16);
  } else if (idadeNum >= 40 && idadeNum <= 69) {
    reajuste = (sexo === 'M') ? 0.08 : 0.10;
    adicional = (tempoEmpresa <= 10) ? (sexo === 'M' ? 5 : 7) : (sexo === 'M' ? 15 : 14);
  } else if (idadeNum >= 70 && idadeNum <= 99) {
    reajuste = (sexo === 'M') ? 0.15 : 0.17;
    adicional = (tempoEmpresa <= 10) ? (sexo === 'M' ? 15 : 17) : (sexo === 'M' ? 13 : 12);
  }

  const novoSalario = salario + (salario * reajuste) + adicional;

  // Envia o resultado final com HTML
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>Resultado</title>
      <style>
        body {
          font-family: sans-serif;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
        }
        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
          padding: 2rem;
          max-width: 500px;
          width: 100%;
          text-align: center;
        }
        h1 { color: #10b981; margin-bottom: 1rem; }
        p { color: #374151; margin: 0.4rem 0; }
        .highlight { font-weight: bold; }
        .final-salario {
          font-size: 1.3rem;
          color: #16a34a;
          margin-top: 1rem;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>✅ Resultado do Cálculo</h1>
        <p><span class="highlight">Matrícula:</span> ${matricula}</p>
        <p><span class="highlight">Idade:</span> ${idadeNum} anos</p>
        <p><span class="highlight">Sexo:</span> ${sexo}</p>
        <p><span class="highlight">Salário Base:</span> R$ ${salario.toFixed(2)}</p>
        <p><span class="highlight">Ano de Contratação:</span> ${ano}</p>
        <p><span class="highlight">Tempo de Empresa:</span> ${tempoEmpresa} anos</p>
        <p><span class="highlight">Reajuste:</span> ${reajuste * 100}%</p>
        <p><span class="highlight">Adicional:</span> R$ ${adicional}</p>
        <div class="final-salario">
          <strong>Novo Salário: R$ ${novoSalario.toFixed(2)}</strong>
        </div>
      </div>
    </body>
    </html>
  `);
});

function erroHtml(msg) {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Erro</title>
      <style>
        body {
          font-family: sans-serif;
          background-color: #fef2f2;
          color: #991b1b;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
        .container {
          background-color: #fff;
          border: 2px solid #fca5a5;
          padding: 2rem;
          border-radius: 8px;
          max-width: 500px;
        }
        h1 {
          color: #dc2626;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚫 Erro:</h1>
        <p>${msg}</p>
      </div>
    </body>
    </html>
  `;
}

app.listen(port, () => {
  console.log(`Servidor rodando em: http://localhost:${port}`);
});


export default app;