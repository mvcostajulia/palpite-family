const { connectToDb, closeConnection, getDb, ObjectId } = require('./db');

const encontrarPalpite = async (
  participanteId,
  semana
) => {
  try {
    await connectToDb();

    const db = getDb();

    return await db
      .collection("palpites")
      .findOne({
        participanteId,
        semana
      });

  } finally {
    await closeConnection();
  }
};

const encontrarPalpites = async () => {
  try {
    await connectToDb();

    const db = getDb();

    return await db
      .collection("palpites")
      .find({})
      .toArray();

  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await closeConnection();
  }
};

const criarPalpite = async (participanteId, semana, palpites) => {
  try {
    await connectToDb();

    const db = getDb();
    const collection_palpites = db.collection("palpites");

    const palpiteExistente = await collection_palpites.findOne({
      participanteId,
      semana
    });

    if (palpiteExistente) {
      throw new Error("Você já enviou seus palpites para esta semana.");
    }

    return await collection_palpites.insertOne({
      participanteId,
      semana,
      palpites,
      dataEnvio: new Date()
    });

  } catch (err) {
    console.error("Erro ao inserir palpite:", err.message);
    throw err;
  } finally {
    await closeConnection();
  }
};

module.exports = {
  criarPalpite,
  encontrarPalpites,
  encontrarPalpite
};
