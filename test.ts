import { POOL_PG } from "./lib/db";

async function testConnection() {
  try {
    const result = await POOL_PG.query("SELECT NOW() as time");

    console.log("🟢 CONEXIÓN EXITOSA");
    console.log(result.rows[0]);
  } catch (error) {
    console.error("🔴 ERROR DE CONEXIÓN");
    console.error(error);
  } finally {
    await POOL_PG.end();
  }
}

testConnection();