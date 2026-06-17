const express = require("express");
require('dotenv').config();
const path = require('path');
const util = require('util'); 

const app = express();

const {criarPalpite, encontrarPalpites, encontrarPalpite} = require("./database/db_palpites.js");
const participantes = require('../participantes.js');

app.use(express.json()); 
app.use(express.static(path.join(__dirname, '../frontend/dist')));

const { connectToDb } = require("./database/db");

app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

connectToDb()
  .then(() => {
    console.log("Servidor e banco de dados conectados com sucesso");
  })
  .catch((err) => console.error("Erro ao conectar ao banco de dados", err));


app.get('/api/jogos', async (req, res) => {
  try {
    const hoje = new Date();
    const inicioSemana = new Date(hoje);
    const diasDesdeQuinta = (hoje.getDay() - 4 + 7) % 7;
    inicioSemana.setDate(hoje.getDate() - diasDesdeQuinta);
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 7);
    const dateFrom = inicioSemana.toISOString().split('T')[0];
    const dateTo = fimSemana.toISOString().split('T')[0];
    const url = `https://api.football-data.org/v4/competitions/WC/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`;
    const response = await fetch(url, {
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_API_TOKEN
      }
    });
    if (!response.ok) {
      throw new Error(`Erro API: ${response.status}`);
    }
    const data = await response.json();
    const jogos = data.matches.map(match => ({
      id: match.id,
      data: match.utcDate,
      dataFormatada: new Date(match.utcDate).toLocaleString('pt-BR'),
      status: match.status,
      grupo: match.group,
      timeUm: {
        nome: match.homeTeam.name,
        sigla: match.homeTeam.tla,
        escudo: match.homeTeam.crest
      },
      timeDois: {
        nome: match.awayTeam.name,
        sigla: match.awayTeam.tla,
        escudo: match.awayTeam.crest
      },
      placar: {
        timeUm: match.score.fullTime.home,
        timeDois: match.score.fullTime.away
      },
      vencedor: match.score.winner
    }));
    res.json({
      competicao: data.competition.name,
      temporada: data.filters.season,
      quantidade: jogos.length,
      jogos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});

app.get('/api/palpites/:participanteId/:semana', async (req, res) => {
  const { participanteId, semana } = req.params;

  try {
    const palpite = await encontrarPalpite(
      Number(participanteId),
      semana
    );

    if (!palpite) {
      return res.status(404).json({
        existe: false
      });
    }

    return res.json({
      existe: true,
      palpite
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Erro ao buscar palpite'
    });
  }
});

app.get('/api/classificacao', async (req, res) => {
  try {
    const response = await fetch(
      'https://api.football-data.org/v4/competitions/WC/matches',
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_TOKEN
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Erro API: ${response.status}`);
    }

    const data = await response.json();

    const jogosFinalizados = data.matches.filter(
      jogo => jogo.status === 'FINISHED'
    );

    const mapaJogos = {};

    jogosFinalizados.forEach(jogo => {
      mapaJogos[jogo.id] = {
        mandante: jogo.score.fullTime.home,
        visitante: jogo.score.fullTime.away
      };
    });

    const palpitesSalvos = await encontrarPalpites();

    const ranking = {};

    palpitesSalvos.forEach(palpiteSemana => {
      const participanteId = palpiteSemana.participanteId;

      if (!ranking[participanteId]) {
        ranking[participanteId] = {
          id: participanteId,
          name:
            participantes.find(
              p => p.id === participanteId
            )?.nome || "Desconhecido",
          exact: 0,
          winners: 0,
          goals: 0,
          points: 0
        };
      }

      palpiteSemana.palpites.forEach(palpite => {
        const resultado = mapaJogos[palpite.jogoId];

        if (!resultado) return;

        const realA = resultado.mandante;
        const realB = resultado.visitante;

        const palpA = palpite.timeUm;
        const palpB = palpite.timeDois;

        const vencedorReal =
          realA > realB
            ? 'A'
            : realB > realA
              ? 'B'
              : 'E';

        const vencedorPalpite =
          palpA > palpB
            ? 'A'
            : palpB > palpA
              ? 'B'
              : 'E';

        if (
          palpA === realA &&
          palpB === realB
        ) {
          ranking[participanteId].exact += 1;
          ranking[participanteId].points += 5;
        } else {

          if (vencedorReal === vencedorPalpite) {
            ranking[participanteId].winners += 1;
            ranking[participanteId].points += 3;
          }

          if (palpA === realA) {
            ranking[participanteId].goals += 1;
            ranking[participanteId].points += 1;
          }

          if (palpB === realB) {
            ranking[participanteId].goals += 1;
            ranking[participanteId].points += 1;
          }
        }
      });
    });

    const classificacao = Object
      .values(ranking)
      .sort((a, b) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        }

        if (b.exact !== a.exact) {
          return b.exact - a.exact;
        }

        if (b.winners !== a.winners) {
          return b.winners - a.winners;
        }

        return b.goals - a.goals;
      });

    res.json(classificacao);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Erro ao gerar classificação'
    });
  }
});

app.post('/api/palpites', async (req, res) => {
  const {
    participanteId,
    semana,
    palpites
  } = req.body;

  try {
    const novoPalpite = await criarPalpite(
      participanteId,
      semana,
      palpites
    );

    res.status(201).json(novoPalpite);

  } catch (err) {

    if (err.message.includes("já enviou")) {
      return res.status(409).json({
        error: err.message
      });
    }

    console.error(err);

    res.status(500).json({
      error: 'Erro ao salvar palpites'
    });
  }
});

app.listen(8080, () => { 
  console.log("Servidor iniciado na porta 8080: http://localhost:8080"); 
});
