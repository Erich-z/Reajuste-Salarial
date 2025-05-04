
const express = require('express');


const app = express();


const port = 3000;


app.get('/', (req, res) => {
 
  const { idade, sexo, salario_base, anoContratacao, matricula } = req.query;


  if (!idade || !sexo || !salario_base || !anoContratacao || !matricula) {
    return res.send("Informe todos os parâmetros: idade, sexo, salario_base, anoContratacao e matricula.");
  }

 
  const idadeNum = parseInt(idade);
  const salario = parseFloat(salario_base);
  const ano = parseInt(anoContratacao);
  const anoAtual = new Date().getFullYear();
  const tempoEmpresa = anoAtual - ano;


  if (idadeNum < 18 || idadeNum > 99) {
    return res.send("Idade inválida (deve estar entre 18 e 99 anos).");
  }

  if (salario <= 0) {
    return res.send("Salário base inválido (deve ser maior que zero).");
  }

  if (ano > anoAtual) {
    return res.send("Ano de contratação não pode ser no futuro.");
  }

  if (sexo !== 'M' && sexo !== 'F') {
    return res.send("Sexo inválido (deve ser 'M' para masculino ou 'F' para feminino).");
  }


  let reajuste = 0;
  let adicional = 0;

  if (idadeNum >= 18 && idadeNum <= 39) {
    reajuste = (sexo === 'M') ? 0.10 : 0.08;
    adicional = (tempoEmpresa <= 10)
      ? (sexo === 'M' ? 10 : 11)
      : (sexo === 'M' ? 17 : 16);
  
  } else if (idadeNum >= 40 && idadeNum <= 69) {
    reajuste = (sexo === 'M') ? 0.08 : 0.10;
    adicional = (tempoEmpresa <= 10)
      ? (sexo === 'M' ? 5 : 7)
      : (sexo === 'M' ? 15 : 14);
  
  } else if (idadeNum >= 70 && idadeNum <= 99) {
    reajuste = (sexo === 'M') ? 0.15 : 0.17;
    adicional = (tempoEmpresa <= 10)
      ? (sexo === 'M' ? 15 : 17)
      : (sexo === 'M' ? 13 : 12);
  }
  


  const novoSalario = salario + (salario * reajuste) + adicional;


  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Resultado do Cálculo</title>
      <style>
        * {
          box-sizing: border-box;
        }
  
        body {
          margin: 0;
          padding: 0;
          background: #f3f4f6;
          font-family: 'Segoe UI', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
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
  
        .card h1 {
          color: #10b981;
          margin-bottom: 1rem;
        }
  
        .card p {
          font-size: 1rem;
          margin: 0.4rem 0;
          color: #374151;
        }
  
        .highlight {
          font-weight: bold;
        }
  
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


app.listen(port, () => {
  console.log(`Servidor rodando em: http://localhost:${port}`);
});

//http://localhost:3000/?idade=30&sexo=F&salario_base=2000&anoContratacao=2015&matricula=12345
