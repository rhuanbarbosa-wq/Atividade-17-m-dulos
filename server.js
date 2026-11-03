import express from "express";

const app = express();
app.use(express.json());

// ==========================================
// MÓDULO 1: Criando Promises e Simulando Latência
// ==========================================

// Exemplo do Professor: Função simulada
function buscarPerfilSimulado(usuario, simularFalha = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (simularFalha) {
        reject(new Error("Banco de dados indisponível no momento."));
      } else {
        resolve({
          usuario: usuario,
          status: "Ativo",
          laboratorio: "Lab 04"
        });
      }
    }, 1000);
  });
}

function saudacaoAssincrona(nome) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Olá, ${nome}! Bem-vindo ao Mensageiro Local.`);
    }, 2000);
  });
}


function obterMensagemPorId(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) {
        return reject(new Error("ID inválido: deve ser maior que zero"));
      }
      resolve({ id: id, texto: "Mensagem do laboratório" });
    }, 1000);
  });
}


// Exemplo do Professor (.then / .catch)
app.get("/perfil-then", (req, res) => {
  buscarPerfilSimulado("Carlos", false)
    .then((dados) => {
      res.json(dados);
    })
    .catch((erro) => {
      console.error("Erro capturado no catch:", erro.message);
      res.status(500).json({ erro: "Não foi possível carregar o perfil." });
    });
});


app.get("/saudacao-then", (req, res) => {
  saudacaoAssincrona("Seu Nome")
    .then((mensagem) => {
      res.send(mensagem);
    });
});

app.get("/mensagem-invalida-then", (req, res) => {
  obterMensagemPorId(-5)
    .then((msg) => {
      res.json(msg);
    })
    .catch((erro) => {
      res.status(500).json({ erro: erro.message });
    });
});


app.get("/perfil-async", async (req, res) => {
  try {
    const dados = await buscarPerfilSimulado("Mariana");
    res.json(dados);
  } catch (erro) {
    console.error("Erro capturado no bloco catch:", erro.message);
    res.status(500).json({ erro: "Falha interna no servidor ao buscar perfil." });
  }
});

app.get("/saudacao-async", async (req, res) => {
  try {
    const mensagem = await saudacaoAssincrona("Aluno do Futuro");
    res.send(mensagem);
  } catch (erro) {
    res.status(500).json({ erro: "Falha na saudação" });
  }
});

app.get("/mensagem-erro-async", async (req, res) => {
  try {
    const msg = await obterMensagemPorId(-10);
    res.json(msg);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});