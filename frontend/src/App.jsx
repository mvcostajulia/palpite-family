"use client"

import { useState, useEffect } from "react"

/* ----------------------------- Data ----------------------------- */


let matches = [];
const participantes = require('../../participantes');
/* ------------------------------- Icons (SVG) ----------------------------- */

function TrophyIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

function UserIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function SaveIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
      <path d="M7 3v4a1 1 0 0 0 1 1h7" />
    </svg>
  )
}

function LockIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function UnlockIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  )
}

function CrownIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
      <path d="M5 21h14" />
    </svg>
  )
}

function MedalIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
      <path d="M11 12 5.12 2.2" />
      <path d="m13 12 5.88-9.8" />
      <path d="M8 7h8" />
      <circle cx="12" cy="17" r="5" />
      <path d="M12 18v-2h-.5" />
    </svg>
  )
}

/* ------------------------------ Subcomponents ---------------------------- */

function FlagPlaceholder({ colors, size = 48 }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block shrink-0 rounded-full shadow-sm ring-2 ring-border"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[0]} 50%, ${colors[1]} 50%, ${colors[1]} 100%)`,
      }}
    />
  )
}

function MatchCard({
    match,
    scoreA,
    scoreB,
    onChangeA,
    onChangeB,
    disabled,
    pontos, 
    semanaDefinida
  }){
  const locked = match.status !== "TIMED" || !semanaDefinida;
  const scoreBoxClass =
   "flex size-12 items-center justify-center rounded-md bg-zinc-900 text-white text-2xl font-bold tabular-nums shadow-sm border border-zinc-700"
  const inputClass =
    "size-12 rounded-md border border-zinc-600 bg-zinc-900 text-white px-0 text-center text-xl font-bold tabular-nums outline-none focus:border-blue-500"

  return (
    <div
      className={`overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800 shadow-sm transition-colors ${
        locked ? "border-dashed bg-muted/40" : "border-border"
      }`}
    >
      <div
        className={`flex flex-row items-center justify-between gap-2 border-b px-5 py-3 ${
          match.status === "TIMED"
            ? "border-zinc-700 bg-gradient-to-r from-zinc-500 to-zinc-600"
            : "border-zinc-700"
        }`}
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-muted-foreground">
            {match.grupo}
          </span>
          <span className="text-xs text-white">
            {match.dataFormatada}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {match.status === "FINISHED" && pontos !== undefined && (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                pontos >= 5
                  ? "bg-green-900/30 text-green-400"
                  : pontos >= 3
                    ? "bg-blue-900/30 text-blue-400"
                    : pontos > 0
                      ? "bg-yellow-900/30 text-yellow-400"
                      : "bg-red-900/30 text-red-400"
              }`}
            >
              +{pontos} pts
            </span>
          )}

          {locked ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              <LockIcon className="size-3" />
              {match.status !== "TIMED" ? "Jogo encerrado - Bloqueado" : "Aguardando definição"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              <UnlockIcon className="size-3" />
              Aberto para palpites
            </span>
          )}
        </div>
      </div>

      <div className="px-5 pb-5 pt-5">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <img
              src={match.escudoTimeUm}
              alt={match.timeUm}
              className="h-12 w-12 rounded-full object-contain"
            />
            <span className="text-sm font-semibold leading-tight text-balance">{match.timeUm}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {locked ? (
               <span className={scoreBoxClass}>
                {scoreA !== "" && scoreA !== undefined ? scoreA : "-"}
              </span>
            ) : (
              <input
                type="number"
                min={0}
                inputMode="numeric"
                aria-label={`Placar de ${match.timeUm}`}
                value={scoreA}
                onChange={(e) => onChangeA(e.target.value)}
                disabled={disabled}
                className={inputClass}
              />
            )}
            <span className="text-lg font-bold text-center text-muted-foreground">X</span>
            {locked ? (
              <span className={scoreBoxClass}>
                {scoreB !== "" && scoreB !== undefined ? scoreB : "-"}
              </span>
            ) : (
              <input
                type="number"
                min={0}
                inputMode="numeric"
                aria-label={`Placar de ${match.timeDois}`}
                value={scoreB}
                onChange={(e) => onChangeB(e.target.value)}
                disabled={disabled}
                className={inputClass}
              />
            )}
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <img
              src={match.escudoTimeDois}
              alt={match.timeDois}
              className="h-12 w-12 rounded-full object-contain"
            />
            <span className="text-sm font-semibold leading-tight text-balance">{match.timeDois}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function PalpitesView() {
  const [matches, setMatches] = useState([]);
  const [scores, setScores] = useState({});
  const [saved, setSaved] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [participanteId, setParticipanteId] = useState("");
  const [palpiteExistente, setPalpiteExistente] = useState(false);
  const [palpitesSalvos, setPalpitesSalvos] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const [blocoSelecionado, setBlocoSelecionado] = useState(null);
  const [possuiAnterior, setPossuiAnterior] = useState(false);
  const [possuiProximo, setPossuiProximo] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const mostrarMensagem = (tipo, texto) => {
    setMensagem({
      tipo,
      texto
    });

    setTimeout(() => {
      setMensagem(null);
    }, 5000);
  };

  const handleSave = async () => {
    setSalvando(true);
    try {
      const semana = matches[0]?.data;

      const palpites = Object.entries(scores).map(
        ([jogoId, placar]) => ({
          jogoId: Number(jogoId),
          timeUm: Number(placar.a),
          timeDois: Number(placar.b)
        })
      );

      if (!participanteId) {
        mostrarMensagem(
          "erro",
          "Selecione seu nome."
        );
        return;
      }

      const jogosAbertos = matches.filter(
        match => match.status === "TIMED"
      );

      const todosPreenchidos = jogosAbertos.every(match => {
        const palpite = scores[match.id];

        return (
          palpite &&
          palpite.a !== "" &&
          palpite.a !== undefined &&
          palpite.b !== "" &&
          palpite.b !== undefined
        );
      });

      if (!todosPreenchidos) {
        mostrarMensagem(
          "erro",
          "Preencha todos os palpites antes de salvar."
        );
        return;
      }

      const response = await fetch('/api/palpites',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            participanteId,
            semana,
            palpites
          })
        }
      );

      if (response.status === 409) {
        const data = await response.json();

        mostrarMensagem(
          "erro",
          data.error
        );

        return;
      }

      if (!response.ok) {
        throw new Error("Erro ao salvar");
      }
      setSaved(true);

      mostrarMensagem(
        "sucesso",
        "Palpites salvos com sucesso!"
      );

    } catch (error) {
      console.error(error);
      mostrarMensagem(
        "erro",
        "Erro ao salvar palpites."
      )
    } finally {
      setSalvando(false);  // ← adiciona
    }
  };

  const setScore = (id, side, value) => {
    setScores((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [side]: value,
      },
    }));
  };

  useEffect(() => {
    carregarJogos(blocoSelecionado);
  }, [blocoSelecionado]);

  useEffect(() => {
    if (participanteId && matches.length) {
      verificarPalpite(participanteId);
    }
  }, [matches]);

  async function verificarPalpite(id) {
    try {
      if (!matches.length) return;

      const semana = matches[0].data;

      const response = await fetch(
        `/api/palpites/${id}/${semana}`
      );

      if (response.status === 404) {
        setPalpiteExistente(false);
        setPalpitesSalvos([]);
        return;
      }

      const data = await response.json();

      const palpites = data?.palpite?.palpites ?? [];

      setPalpiteExistente(true);
      setPalpitesSalvos(palpites);

    } catch (error) {
      console.error(error);
      setPalpiteExistente(false);
      setPalpitesSalvos([]);
    }
  }

  async function carregarJogos(bloco = null) {
    setCarregando(true);
    try {
      const response = await fetch(
        bloco === null
          ? '/api/jogos'
          : `/api/jogos?bloco=${bloco}`
      );

      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }

      const data = await response.json();
      if (blocoSelecionado === null) {
        setBlocoSelecionado(data.blocoSelecionado);
      }

      setPossuiAnterior(data.possuiAnterior);
      setPossuiProximo(data.possuiProximo);

      const jogos = data.jogos.map(jogo => ({
        id: jogo.id,
        grupo: jogo.grupo ? jogo.grupo.replace("_", " ").replace("GROUP", "Grupo") : "Eliminatórias",
        timeUm: jogo.timeUm.nome ?? "A definir",
        escudoTimeUm: jogo.timeUm.escudo ?? "/blackout.jpg",
        timeDois: jogo.timeDois.nome ?? "A definir",
        escudoTimeDois: jogo.timeDois.escudo ?? "/blackout.jpg",
        status: jogo.status,
        placar: {
          timeUm: jogo.placar.timeUm,
          timeDois: jogo.placar.timeDois
        },
        vencedor:
          jogo.vencedor === "HOME_TEAM"
            ? "timeUm"
            : jogo.vencedor === "AWAY_TEAM"
              ? "timeDois"
              : null,
        data: jogo.data,
        dataFormatada: jogo.dataFormatada
      }));

      setMatches(jogos);
      setCarregando(false);
    } catch (error) {
      console.error("Erro ao carregar jogos:", error);
    }
  }
  const semanaDefinida = matches.every(
    m => m.timeUm !== "A definir" && m.timeDois !== "A definir"
  );
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-4 shadow-sm sm:p-5">
        <label htmlFor="nickname" className="mb-2 flex items-center gap-2 text-base font-semibold">
          <UserIcon className="size-4 text-primary" />
          Participante
        </label>

        <select
          id="nickname"
          value={participanteId}
          onChange={(e) => {
            const id = Number(e.target.value);
            setParticipanteId(id);
            verificarPalpite(id);
          }}
          className="h-11 w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 text-base text-white outline-none focus:border-blue-500"
        >
          <option value="">Selecione seu nome</option>

          {participantes.map((participante) => (
            <option
              key={participante.id}
              value={participante.id}
            >
              {participante.nome}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            disabled={!possuiAnterior}
            onClick={() => {
              setPalpiteExistente(false);
              setPalpitesSalvos([]);
              setBlocoSelecionado(prev => prev - 1);
            }}
            className="rounded-md border border-zinc-600 px-3 py-2 disabled:opacity-40"
          >
            ← Anterior
          </button>

          <h2 className="text-lg font-bold text-center">
            {matches.length > 0 &&
              `${matches[0].data.split('-').reverse().join('/')} a ${
                matches[matches.length - 1].data.split('-').reverse().join('/')
              }`}
          </h2>

          <button
            type="button"
            disabled={!possuiProximo}
            onClick={() => {
              setPalpiteExistente(false);
              setPalpitesSalvos([]);
              setBlocoSelecionado(prev => prev + 1);
            }}
            className="rounded-md border border-zinc-600 px-3 py-2 disabled:opacity-40"
          >
            Próximo →
          </button>
        </div>
        {carregando ? (
          <div className="text-center text-zinc-400 py-10">Carregando jogos...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {matches.map((match) => {
            const palpiteSalvo = palpitesSalvos.find(
            p => Number(p.jogoId) === Number(match.id)
          );

          let pontos;
          if (match.status === "FINISHED" && palpiteSalvo) {
            const realA = match.placar.timeUm;
            const realB = match.placar.timeDois;
            const palpA = palpiteSalvo.timeUm;
            const palpB = palpiteSalvo.timeDois;

            if (palpA === realA && palpB === realB) {
              pontos = 5;
            } else {
              pontos = 0;
              const vencedorReal = realA > realB ? "A" : realB > realA ? "B" : "E";
              const vencedorPalpite = palpA > palpB ? "A" : palpB > palpA ? "B" : "E";
              if (vencedorReal === vencedorPalpite) pontos += 3;
              if (palpA === realA) pontos += 1;
              if (palpB === realB) pontos += 1;
            }
          }

            return (
              <MatchCard
                key={match.id}
                match={match}
                scoreA={
                  palpiteExistente
                    ? palpiteSalvo?.timeUm ?? ""
                    : scores[match.id]?.a ?? ""
                }
                scoreB={
                  palpiteExistente
                    ? palpiteSalvo?.timeDois ?? ""
                    : scores[match.id]?.b ?? ""
                }
                pontos={pontos}
                semanaDefinida={semanaDefinida}
                onChangeA={(v) => setScore(match.id, "a", v)}
                onChangeB={(v) => setScore(match.id, "b", v)}
                disabled={palpiteExistente || !semanaDefinida}
              />
            );
          })}
        </div>
        )}
      </div>

      <div className="sticky bottom-4 z-10 flex flex-col items-center gap-2">
        {mensagem && (
          <div
            className={`w-full rounded-lg border px-4 py-3 text-sm font-medium sm:w-auto ${
              mensagem.tipo === "erro"
                ? "border-red-700 bg-red-900/70 text-white"
                : "border-green-700 bg-green-900/70 text-white"
            }`}
          >
            {mensagem.texto}
          </div>
        )}
        {!palpiteExistente && (
          <button
            type="button"
            onClick={handleSave}
            disabled={salvando}
            className="
              inline-flex w-full items-center justify-center gap-2
              rounded-md bg-primary px-6 py-3
              text-base font-semibold text-primary-foreground
              shadow-lg transition-all duration-200
              hover:bg-white hover:text-black hover:border-white
              disabled:opacity-50 disabled:cursor-not-allowed
              sm:w-auto sm:px-12
            "
          >
            <SaveIcon className="size-5" />
            {salvando ? "Salvando..." : "Salvar Palpites"}
          </button>
        )}
      </div>
    </div>
  )
}


const podium = [
  { Icon: CrownIcon, classes: "bg-amber-100 text-amber-700 ring-amber-300" },
  { Icon: TrophyIcon, classes: "bg-slate-100 text-slate-600 ring-slate-300" },
  { Icon: MedalIcon, classes: "bg-orange-100 text-orange-700 ring-orange-300" },
]

function ClassificacaoView() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    carregarClassificacao();
  }, []);

  async function carregarClassificacao() {
    try {
      const response = await fetch(
        '/api/classificacao'
      );

      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }

      const data = await response.json();

      setLeaderboard(data);

    } catch (error) {
      console.error("Erro ao carregar classificação:", error);
    }
  }

  const ranked = [...leaderboard].sort(
    (a, b) => b.points - a.points
  );

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800 shadow-sm">
      <div className="border-b border-zinc-700 p-4 sm:p-5">
        <h2 className="text-lg font-bold text-center">Classificação Geral</h2>
        <p className="text-sm text-zinc-400">
          Ranking do bolão da família
        </p>
      </div>

      <div className="border-b border-zinc-700 bg-zinc-900/50 p-4">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-300">
          Sistema de Pontuação
        </h3>

        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-md bg-zinc-800 px-3 py-2">
            <span>Placar exato</span>
            <span className="font-bold text-green-400">
              +5 pts
            </span>
          </div>

          <div className="flex items-center justify-between rounded-md bg-zinc-800 px-3 py-2">
            <span>Vencedor correto</span>
            <span className="font-bold text-blue-400">
              +3 pts
            </span>
          </div>

          <div className="flex items-center justify-between rounded-md bg-zinc-800 px-3 py-2">
            <span>Gols do time 1</span>
            <span className="font-bold text-yellow-400">
              +1 pt
            </span>
          </div>

          <div className="flex items-center justify-between rounded-md bg-zinc-800 px-3 py-2">
            <span>Gols do time 2</span>
            <span className="font-bold text-yellow-400">
              +1 pt
            </span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
      <table className="w-full caption-bottom text-sm">
        <thead>
          <tr className="border-b border-zinc-700">
            <th className="h-12 w-16 px-2 text-center align-middle font-medium text-zinc-400">
              Posição
            </th>

            <th className="h-12 px-4 text-left align-middle font-medium text-zinc-400">
              Nome
            </th>

            <th className="h-12 px-2 text-center align-middle font-medium text-zinc-400">
              Placares Exatos
            </th>

            <th className="h-12 px-2 text-center align-middle font-medium text-zinc-400">
              Vencedores
            </th>

            <th className="table-cell h-12 px-2 text-center align-middle font-medium text-zinc-400 sm:table-cell">
              Gols Acertados
            </th>

            <th className="h-12 px-4 text-right align-middle font-medium text-zinc-400">
              Pontos
            </th>
          </tr>
        </thead>

        <tbody>
          {ranked.map((entry, i) => {
            const place = podium[i];

            return (
              <tr
                key={entry.id}
                className={`border-b border-zinc-700 last:border-0 ${
                  place ? "bg-zinc-700/20" : ""
                }`}
              >
                <td className="px-2 py-3 text-center align-middle">
                  {place ? (
                    <span
                      className={`inline-flex size-8 items-center justify-center rounded-full text-sm font-bold ring-2 ${place.classes}`}
                    >
                      <place.Icon className="size-4" />
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-zinc-400">
                      {i + 1}º
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 align-middle font-semibold">
                  {entry.name}
                </td>

                <td className="px-2 py-3 text-center align-middle tabular-nums">
                  {entry.exact}
                </td>

                <td className="px-2 py-3 text-center align-middle tabular-nums">
                  {entry.winners}
                </td>

                <td className="table-cell px-2 py-3 text-center align-middle tabular-nums sm:table-cell">
                  {entry.goals}
                </td>

                <td className="px-4 py-3 text-right align-middle">
                  <span className="font-bold tabular-nums text-primary">
                    {entry.points}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}

/* --------------------------------- Page ---------------------------------- */

export default function Page() {
  const [tab, setTab] = useState("palpites")

  const tabClass = (active) =>
  `flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    active
      ? "bg-zinc-700 text-white shadow-sm"
      : "text-zinc-400 hover:text-white"
  }`

  return (
    <main className="min-h-screen min-h-[100dvh] bg-zinc-900 text-zinc-100">
      <header className="border-b border-zinc-700 bg-zinc-800">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <TrophyIcon className="size-5" />
          </span>
          <div>
            <h1 className="text-lg font-bold text-center leading-tight">Bolão da Copa</h1>
            <p className="text-sm text-muted-foreground">Palpites em família</p>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6">
        <div className="flex w-full gap-1 rounded-lg bg-muted p-1" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "palpites"} onClick={() => setTab("palpites")} className={tabClass(tab === "palpites")}>
            Palpites
          </button>
          <button type="button" role="tab" aria-selected={tab === "classificacao"} onClick={() => setTab("classificacao")} className={tabClass(tab === "classificacao")}>
            Classificação
          </button>
        </div>

        {tab === "palpites" ? <PalpitesView /> : <ClassificacaoView />}
      </div>
    </main>
  )
}
