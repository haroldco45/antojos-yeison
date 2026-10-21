/**
 * Antojos de Yeison — registro de pedidos en Google Sheets
 * Vibras Positivas HM
 *
 * Pegar este código en Extensiones → Apps Script de la hoja de Yeison
 * y publicarlo como "Aplicación web" (ver README del repositorio).
 */

// Clave para ver y manejar el registro desde la app. Cámbiala.
const CLAVE = "1234";

const ZONA = "America/Bogota";
const HOJA = "Pedidos";
const COLUMNAS = ["N°", "Código", "Fecha", "Hora", "Cliente", "Celular", "Entrega", "Dirección",
  "Pago", "Productos", "Adiciones", "Notas", "Total", "Estado", "Datos"];
const ESTADOS = ["Nuevo", "Preparando", "Entregado", "Cancelado"];

function hoja_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(HOJA);
  if (!sh) {
    sh = ss.insertSheet(HOJA);
    sh.appendRow(COLUMNAS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, COLUMNAS.length).setFontWeight("bold").setBackground("#d7263d").setFontColor("#ffffff");
    sh.hideColumns(COLUMNAS.length); // la columna "Datos" es para la app
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

const txt_ = (v, max) => String(v == null ? "" : v).slice(0, max || 200);

// Recibe pedidos nuevos y cambios de estado
function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: "DATOS" }); }

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = hoja_();

    if (d.action === "estado") {
      if (String(d.pin) !== CLAVE) return json_({ ok: false, error: "PIN" });
      if (ESTADOS.indexOf(d.st) < 0) return json_({ ok: false, error: "ESTADO" });
      const codigos = sh.getRange(2, 2, Math.max(sh.getLastRow() - 1, 1), 1).getValues();
      for (let i = 0; i < codigos.length; i++) {
        if (codigos[i][0] === d.codigo) {
          sh.getRange(i + 2, 14).setValue(d.st);
          return json_({ ok: true });
        }
      }
      return json_({ ok: false, error: "NO_EXISTE" });
    }

    // Pedido nuevo (lo hace el cliente, no necesita clave)
    const items = (Array.isArray(d.items) ? d.items : []).slice(0, 30).map(i => ({
      n: txt_(i.n, 60), q: Math.max(0, Math.min(99, parseInt(i.q, 10) || 0)), p: Number(i.p) || 0
    })).filter(i => i.q > 0);
    if (!items.length) return json_({ ok: false, error: "VACIO" });
    const ext = (Array.isArray(d.ext) ? d.ext : []).slice(0, 15).map(x => txt_(x, 40));
    const ahora = new Date();
    const n = sh.getLastRow(); // consecutivo
    const p = {
      codigo: txt_(d.codigo, 20), fecha: ahora.toISOString(), cli: txt_(d.cli, 60), tel: txt_(d.tel, 25),
      ent: d.ent === "Recoge" ? "Recoge" : "Domicilio", dir: txt_(d.dir, 150), pago: txt_(d.pago, 20),
      items: items, ext: ext, nota: txt_(d.nota, 300), tot: Number(d.tot) || 0
    };
    sh.appendRow([
      n, p.codigo,
      Utilities.formatDate(ahora, ZONA, "yyyy-MM-dd"), Utilities.formatDate(ahora, ZONA, "hh:mm a"),
      p.cli, "'" + p.tel, p.ent, p.dir, p.pago,
      items.map(i => i.q + " × " + i.n).join("\n"), ext.join(", "), p.nota, p.tot, "Nuevo",
      JSON.stringify(p)
    ]);
    return json_({ ok: true, n: n, codigo: p.codigo });
  } finally {
    lock.releaseLock();
  }
}

// Devuelve el registro (solo con la clave)
function doGet(e) {
  const q = (e && e.parameter) || {};
  if (q.action !== "list") return json_({ ok: true, app: "Antojos de Yeison" });
  if (String(q.pin) !== CLAVE) return json_({ ok: false, error: "PIN" });
  const sh = hoja_();
  const filas = sh.getLastRow() - 1;
  if (filas < 1) return json_({ ok: true, pedidos: [] });
  const desde = Math.max(2, sh.getLastRow() - 299); // últimos 300
  const datos = sh.getRange(desde, 1, sh.getLastRow() - desde + 1, COLUMNAS.length).getValues();
  const pedidos = datos.map(r => {
    let p = {};
    try { p = JSON.parse(r[14]); } catch (err) {}
    p.codigo = r[1]; p.st = r[13] || "Nuevo";
    return p;
  }).reverse();
  return json_({ ok: true, pedidos: pedidos });
}
