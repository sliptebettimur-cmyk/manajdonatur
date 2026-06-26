/**
 * YAYASAN AMAL NUSANTARA - DATABASE DRIVER & REST API CONTROLLER
 * File: Code.gs / apps-script.js
 * 
 * PETUNJUK DEPLOY:
 * 1. Di Google Sheets, buka Extensions > Apps Script.
 * 2. Paste seluruh kode di bawah ini.
 * 3. Ubah SPREADSHEET_ID dengan ID Google Spreadsheet Anda.
 * 4. Klik tombol Deploy (Kanan atas) > New Deployment.
 * 5. Pilih tipe "Web App".
 * 6. Execute As: "Me" (Email Anda).
 * 7. Who has access: "Anyone" (Siapa saja).
 * 8. Klik Deploy, setujui otorisasi akun Google.
 * 9. Salin URL Web App yang dihasilkan (akhiran /exec) dan paste ke pengaturan aplikasi.
 */

const SPREADSHEET_ID = "1E7BP_W6ci9ndcWLOpMNaa8roj9gaHkcUMDyFD8CZQPM";

// Main GET request entry point
function doGet(e) {
  return handleRequest(e, "GET");
}

// Main POST request entry point
function doPost(e) {
  return handleRequest(e, "POST");
}

// Main routing function
function handleRequest(e, method) {
  try {
    let params = e.parameter;
    let payload = null;
    let action = params.action;
    
    // Parsing JSON body if request is POST / PUT
    if (method === "POST" && e.postData && e.postData.contents) {
      try {
        const bodyObj = JSON.parse(e.postData.contents);
        action = bodyObj.action || action;
        payload = bodyObj.payload || bodyObj;
      } catch (err) {
        // Fallback standard form-urlencoded
        payload = e.parameter;
      }
    }
    
    if (!action) {
      let dbStatus = "UNKNOWN";
      let errorDetail = "";
      let helpMsg = "";
      
      if (SPREADSHEET_ID === "ID_SPREADSHEET_GOOGLE_YAYASAN_ANDA" || !SPREADSHEET_ID) {
        dbStatus = "BELUM_DIKONFIGURASI";
        errorDetail = "Konstanta SPREADSHEET_ID masih berisi nilai default.";
        helpMsg = "Silakan ganti SPREADSHEET_ID di baris ke-17 script ini dengan ID Google Spreadsheet Anda.";
      } else {
        try {
          const testSS = SpreadsheetApp.openById(SPREADSHEET_ID);
          autoSetupSheets(testSS);
          dbStatus = "CONNECTED (" + testSS.getName() + ")";
          helpMsg = "Koneksi ke Google Sheets berhasil! Apps Script siap digunakan.";
        } catch (err) {
          dbStatus = "ERROR_CONNECTING";
          errorDetail = err.toString();
          helpMsg = "Pastikan SPREADSHEET_ID benar dan Anda telah menyetujui izin otorisasi saat mendeploy.";
        }
      }

      return jsonResponse({
        success: true,
        message: "Yayasan Amal Nusantara REST API is Active & Online!",
        status: "ONLINE",
        database: dbStatus,
        error_detail: errorDetail,
        help_instruction: helpMsg,
        info: "To query or modify data, please specify an action parameter (e.g., ?action=getDonatur)."
      });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    autoSetupSheets(ss); // Auto create tabs if missing on first init

    let responseData = null;
    let message = "Request processed successfully";

    switch (action) {
      // --- USERS MODULE ---
      case "getUsers":
        responseData = readSheet(ss, "USERS");
        break;
      case "createUser":
        responseData = createRecord(ss, "USERS", payload);
        message = "User berhasil ditambahkan";
        break;
      case "updateUser":
        responseData = updateRecord(ss, "USERS", payload);
        message = "User berhasil diperbarui";
        break;
      case "deleteUser":
        const userId = params.id || (payload ? payload.id : "");
        deleteRecord(ss, "USERS", userId);
        message = "User berhasil dihapus";
        responseData = true;
        break;

      // --- DONATUR MODULE ---
      case "getDonatur":
        responseData = readSheet(ss, "DONATUR");
        break;
      case "createDonatur":
        // Generate Kode Donatur Otomatis
        const donaturs = readSheet(ss, "DONATUR");
        payload.kode_donatur = "DN-" + String(donaturs.length + 1).padStart(4, "0");
        responseData = createRecord(ss, "DONATUR", payload);
        message = "Donatur berhasil didaftarkan";
        break;
      case "updateDonatur":
        responseData = updateRecord(ss, "DONATUR", payload);
        message = "Donatur berhasil diperbarui";
        break;
      case "deleteDonatur":
        const donId = params.id || (payload ? payload.id : "");
        deleteRecord(ss, "DONATUR", donId);
        message = "Donatur berhasil dihapus";
        responseData = true;
        break;

      // --- EVENT MODULE ---
      case "getEvent":
        responseData = readSheet(ss, "EVENT");
        break;
      case "createEvent":
        const events = readSheet(ss, "EVENT");
        payload.kode_event = "EV-" + String(events.length + 1).padStart(4, "0");
        responseData = createRecord(ss, "EVENT", payload);
        message = "Event program berhasil ditambahkan";
        break;
      case "updateEvent":
        responseData = updateRecord(ss, "EVENT", payload);
        message = "Event program berhasil diperbarui";
        break;
      case "deleteEvent":
        const evId = params.id || (payload ? payload.id : "");
        deleteRecord(ss, "EVENT", evId);
        message = "Event berhasil dihapus";
        responseData = true;
        break;

      // --- TRANSAKSI MODULE ---
      case "getTransaksi":
        responseData = readSheet(ss, "TRANSAKSI");
        break;
      case "createTransaksi":
        const txs = readSheet(ss, "TRANSAKSI");
        const todayStr = getCompactDateStr();
        
        // Generate Nomor Transaksi Otomatis (e.g. TRX-20260626001)
        const countToday = txs.filter(function(t) { return t.tanggal && t.tanggal.toString().replace(/-/g, "") === todayStr; }).length;
        payload.nomor_transaksi = "TRX-" + todayStr + String(countToday + 1).padStart(3, "0");
        payload.tanggal = payload.tanggal || getISODateStr();
        payload.jam = payload.jam || getClockStr();
        payload.created_at = new Date().toISOString();
        
        responseData = createRecord(ss, "TRANSAKSI", payload);
        message = "Transaksi donasi berhasil dicatat";
        break;
      case "updateTransaksi":
        responseData = updateRecord(ss, "TRANSAKSI", payload);
        message = "Transaksi berhasil diperbarui";
        break;
      case "deleteTransaksi":
        const txId = params.id || (payload ? payload.id : "");
        deleteRecord(ss, "TRANSAKSI", txId);
        message = "Transaksi berhasil dihapus";
        responseData = true;
        break;

      // --- ANALYTICS / REPORTS ---
      case "getRekapHarian":
        responseData = getRekapHarianData(ss);
        break;
      case "getRekapBulanan":
        responseData = getRekapBulananData(ss);
        break;
      case "getRekapEvent":
        responseData = getRekapEventData(ss);
        break;
      case "getRekapDonatur":
        responseData = getRekapDonaturData(ss);
        break;

      default:
        throw new Error("Action '" + action + "' is not supported.");
    }

    return jsonResponse({ success: true, message, data: responseData });
  } catch (err) {
    return jsonResponse({ success: false, message: err.toString(), data: null });
  }
}

// Read database table sheets
function readSheet(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  const range = sheet.getDataRange();
  const values = range.getValues();
  if (values.length <= 1) return []; // Only header exists
  
  const headers = values[0];
  const list = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const item = {};
    for (let j = 0; j < headers.length; j++) {
      item[headers[j]] = row[j];
    }
    list.push(item);
  }
  return list;
}

// Create new record
function createRecord(ss, sheetName, payload) {
  const sheet = ss.getSheetByName(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Auto Incrementing ID (e.g. USR-005, DN-0005, EVT-021, TX-100)
  let prefix = "REC";
  if (sheetName === "USERS") prefix = "USR";
  if (sheetName === "DONATUR") prefix = "DON";
  if (sheetName === "EVENT") prefix = "EVT";
  if (sheetName === "TRANSAKSI") prefix = "TX";
  
  const idNum = sheet.getLastRow(); // Simple auto increment
  const newId = prefix + "-" + String(idNum).padStart(3, "0");
  payload.id = newId;

  const newRow = [];
  for (let i = 0; i < headers.length; i++) {
    const key = headers[i];
    newRow.push(payload[key] !== undefined ? payload[key] : "");
  }
  
  sheet.appendRow(newRow);
  return payload;
}

// Update existing record
function updateRecord(ss, sheetName, payload) {
  const sheet = ss.getSheetByName(sheetName);
  const range = sheet.getDataRange();
  const values = range.getValues();
  const headers = values[0];
  const idIndex = headers.indexOf("id");
  
  if (idIndex === -1) throw new Error("ID column not found");
  
  let rowIndex = -1;
  for (let i = 1; i < values.length; i++) {
    if (values[i][idIndex] === payload.id) {
      rowIndex = i + 1; // 1-indexed plus header row offset
      break;
    }
  }
  
  if (rowIndex === -1) throw new Error("Record with ID '" + payload.id + "' not found");

  for (let j = 0; j < headers.length; j++) {
    const key = headers[j];
    if (payload[key] !== undefined) {
      sheet.getRange(rowIndex, j + 1).setValue(payload[key]);
    }
  }
  return payload;
}

// Delete record from sheet
function deleteRecord(ss, sheetName, id) {
  const sheet = ss.getSheetByName(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf("id");
  
  let rowIndex = -1;
  for (let i = 1; i < values.length; i++) {
    if (values[i][idIndex] === id) {
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex !== -1) {
    sheet.deleteRow(rowIndex);
    return true;
  }
  throw new Error("Record to delete not found");
}

// Aggregation analytics logic for GAS reporting
function getRekapHarianData(ss) {
  const txs = readSheet(ss, "TRANSAKSI").filter(function(t) { return t.status === "Masuk"; });
  const rekap = {};
  
  txs.forEach(function(t) {
    const tgl = t.tanggal;
    if (!rekap[tgl]) {
      rekap[tgl] = { tanggal: tgl, jumlah_transaksi: 0, donaturSet: {}, total_donasi: 0 };
    }
    rekap[tgl].jumlah_transaksi += 1;
    rekap[tgl].donaturSet[t.donatur_id] = true;
    rekap[tgl].total_donasi += Number(t.nominal) || 0;
  });
  
  return Object.keys(rekap).map(function(k) {
    const item = rekap[k];
    return {
      tanggal: item.tanggal,
      jumlah_transaksi: item.jumlah_transaksi,
      jumlah_donatur: Object.keys(item.donaturSet).length,
      total_donasi: item.total_donasi
    };
  });
}

function getRekapBulananData(ss) {
  const txs = readSheet(ss, "TRANSAKSI").filter(function(t) { return t.status === "Masuk"; });
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const rekap = {};
  
  txs.forEach(function(t) {
    const parts = t.tanggal.split("-");
    if (parts.length === 3) {
      const yr = parseInt(parts[0], 10);
      const moIdx = parseInt(parts[1], 10) - 1;
      const key = yr + "-" + moIdx;
      
      if (!rekap[key]) {
        rekap[key] = { monthIdx: moIdx, year: yr, jumlah_transaksi: 0, donaturSet: {}, total_donasi: 0 };
      }
      rekap[key].jumlah_transaksi += 1;
      rekap[key].donaturSet[t.donatur_id] = true;
      rekap[key].total_donasi += Number(t.nominal) || 0;
    }
  });
  
  return Object.keys(rekap).map(function(k) {
    const item = rekap[k];
    return {
      bulan: monthNames[item.monthIdx],
      tahun: item.year,
      jumlah_transaksi: item.jumlah_transaksi,
      jumlah_donatur: Object.keys(item.donaturSet).length,
      total_donasi: item.total_donasi
    };
  });
}

function getRekapEventData(ss) {
  const evts = readSheet(ss, "EVENT");
  const txs = readSheet(ss, "TRANSAKSI").filter(function(t) { return t.status === "Masuk"; });
  
  return evts.map(function(e) {
    const total = txs
      .filter(function(t) { return t.event_id === e.id; })
      .reduce(function(sum, t) { return sum + (Number(t.nominal) || 0); }, 0);
      
    const pct = e.target_dana > 0 ? Math.round((total / e.target_dana) * 100) : 0;
    
    return {
      event: e.nama_event,
      target: Number(e.target_dana) || 0,
      total: total,
      persentase: pct
    };
  });
}

function getRekapDonaturData(ss) {
  const donaturs = readSheet(ss, "DONATUR");
  const txs = readSheet(ss, "TRANSAKSI").filter(function(t) { return t.status === "Masuk"; });
  
  return donaturs.map(function(d) {
    const dtxs = txs.filter(function(t) { return t.donatur_id === d.id; });
    const total = dtxs.reduce(function(sum, t) { return sum + (Number(t.nominal) || 0); }, 0);
    
    return {
      donatur: d.nama,
      jumlah_donasi: dtxs.length,
      frekuensi: dtxs.length,
      total: total
    };
  }).sort(function(a, b) { return b.total - a.total; });
}

// Utility formatting helpers
function getCompactDateStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dy = String(d.getDate()).padStart(2, "0");
  return y + m + dy;
}

function getISODateStr() {
  return new Date().toISOString().split("T")[0];
}

function getClockStr() {
  const d = new Date();
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Ensure columns and sheets exist automatically
function autoSetupSheets(ss) {
  const schemas = {
    "USERS": ["id", "nama", "email", "password", "role", "status", "created_at"],
    "DONATUR": ["id", "kode_donatur", "nama", "jenis_donatur", "alamat", "kota", "telepon", "email", "tanggal_bergabung", "status", "catatan"],
    "EVENT": ["id", "kode_event", "nama_event", "kategori", "target_dana", "tanggal_mulai", "tanggal_selesai", "status", "PIC"],
    "TRANSAKSI": ["id", "nomor_transaksi", "tanggal", "jam", "donatur_id", "event_id", "nominal", "metode", "bank", "referensi", "admin", "status", "catatan", "created_at"]
  };
  
  Object.keys(schemas).forEach(function(shName) {
    let sheet = ss.getSheetByName(shName);
    
    // If exact name not found, search case-insensitively
    if (!sheet) {
      const sheets = ss.getSheets();
      const lowerName = shName.toLowerCase();
      for (let i = 0; i < sheets.length; i++) {
        if (sheets[i].getName().toLowerCase() === lowerName) {
          sheet = sheets[i];
          // Correct the sheet name to match the expected uppercase layout
          sheet.setName(shName);
          break;
        }
      }
    }
    
    if (!sheet) {
      sheet = ss.insertSheet(shName);
    }
    
    // If sheet is completely empty, insert headers
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      sheet.appendRow(schemas[shName]);
    } else {
      // Ensure first row has the correct headers
      const firstRowValues = sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn())).getValues()[0];
      if (!firstRowValues[0] || firstRowValues[0] === "") {
        sheet.getRange(1, 1, 1, schemas[shName].length).setValues([schemas[shName]]);
      }
    }
    
    // Add default dummy user on USERS if it has no data rows (only header or empty)
    if (shName === "USERS" && sheet.getLastRow() <= 1) {
      sheet.appendRow(["USR-001", "Ahmad Subarjo", "superadmin@yayasan.org", "admin123", "Super Admin", "Aktif", new Date().toISOString()]);
    }
  });
}
