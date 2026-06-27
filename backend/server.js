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
    const blocos = [
      { dateFrom: '2026-06-11', dateTo: '2026-06-18' },
      { dateFrom: '2026-06-19', dateTo: '2026-06-27' },
      { dateFrom: '2026-06-28', dateTo: '2026-06-28' },
      { dateFrom: '2026-06-29', dateTo: '2026-07-03' },
      { dateFrom: '2026-07-04', dateTo: '2026-07-07' },
      { dateFrom: '2026-07-09', dateTo: '2026-07-11' },
      { dateFrom: '2026-07-14', dateTo: '2026-07-15' },
      { dateFrom: '2026-07-18', dateTo: '2026-07-18' },
      { dateFrom: '2026-07-19', dateTo: '2026-07-19' },
    ];

    const TESTE_BLOCO = null;

    const hoje = TESTE_BLOCO !== null
      ? new Date(blocos[TESTE_BLOCO].dateFrom + 'T00:00:00')
      : new Date();
    hoje.setHours(0, 0, 0, 0);

    const indiceEncontrado = blocos.findIndex(b => {
      const from = new Date(b.dateFrom + 'T00:00:00');
      const to = new Date(b.dateTo + 'T00:00:00');
      return hoje >= from && hoje <= to;
    });

    const indiceBlocoAtual =
      indiceEncontrado === -1
        ? blocos.length - 1
        : indiceEncontrado;

    const ultimoDiaBlocoAtual =
      hoje.toISOString().split('T')[0] ===
      blocos[indiceBlocoAtual].dateTo;

    const limiteNavegacao =
      ultimoDiaBlocoAtual
        ? Math.min(indiceBlocoAtual + 1, blocos.length - 1)
        : indiceBlocoAtual;

    const blocoSolicitado = Number(req.query.bloco);

    const indiceSelecionado =
      Number.isInteger(blocoSolicitado)
        ? blocoSolicitado
        : indiceBlocoAtual;

    if (
      indiceSelecionado < 0 ||
      indiceSelecionado > limiteNavegacao
    ) {
      return res.status(400).json({
        error: 'Bloco inválido'
      });
    }

    const { dateFrom, dateTo } = blocos[indiceSelecionado];

    const dateToApi = indiceSelecionado >= 3
      ? new Date(new Date(dateTo + 'T00:00:00').getTime() + 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0]
      : dateTo;

    const url = `https://api.football-data.org/v4/competitions/WC/matches?dateFrom=${dateFrom}&dateTo=${dateToApi}`;

    const response = await fetch(url, {
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_API_TOKEN
      }
    });

    if (!response.ok) {
      throw new Error(`Erro API: ${response.status}`);
    }

    const apiData = await response.json();

    const inicioUtc = new Date(dateFrom + 'T03:00:00Z');

    const limiteUtc = new Date(dateTo);
    limiteUtc.setUTCDate(limiteUtc.getUTCDate() + 1);
    limiteUtc.setUTCHours(3, 0, 0, 0);

    const jogos = apiData.matches
      .filter(match => {
        if (indiceSelecionado < 3) return true;
        const utcDate = new Date(match.utcDate);
        return utcDate >= inicioUtc && utcDate <= limiteUtc;
      })
      .map(match => {
        let dataJogo;

        if (match.id === 537330) {
          dataJogo = '2026-06-19';
        } else if (indiceSelecionado <= 1) {
          dataJogo = match.utcDate.split('T')[0];
        } else {
          dataJogo = new Date(match.utcDate).toLocaleDateString('en-CA', {
            timeZone: 'America/Sao_Paulo'
          });
        }

        return {
          id: match.id,
          data: dataJogo,
          dataFormatada: new Date(match.utcDate).toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo'
          }),
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
        };
      });

    res.json({
      competicao: apiData.competition.name,
      temporada: apiData.filters.season,
      quantidade: jogos.length,
      blocoAtual: indiceBlocoAtual,
      blocoSelecionado: indiceSelecionado,
      possuiAnterior: indiceSelecionado > 0,
      possuiProximo: indiceSelecionado < limiteNavegacao,
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
