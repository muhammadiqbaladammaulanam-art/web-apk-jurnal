// Jalankan pemuatan baris riwayat setiap kali halaman dibuka agar data permanen tidak hilang
document.addEventListener('DOMContentLoaded', tampilkanDataBeranda);

function tampilkanDataBeranda() {
    const tabel = document.getElementById('tabelBeranda');
    if (!tabel) return;
    tabel.innerHTML = '';

    // Mengambil data rekaman jurnal absensi dari localStorage
    let daftarJurnal = JSON.parse(localStorage.getItem('daftarJurnal')) || [];

    daftarJurnal.forEach(function(jurnal) {
        const baris = document.createElement('tr');
        baris.innerHTML = `
            <td>${jurnal.hari}</td>
            <td>${jurnal.tanggal}</td>
            <td>${jurnal.bulan}</td>
            <td>${jurnal.tahun}</td>
            <td>
                <!-- Saat diklik lihat, otomatis dilempar ke halaman baru absen-masuk.html -->
                <button class="btn-lihat" onclick="bukaDetailJurnal(${jurnal.id})">Lihat</button>
                <button class="btn-hapus" onclick="hapusJurnal(${jurnal.id})">Hapus</button>
            </td>
        `;
        tabel.appendChild(baris);
    });
}

// Mengalihkan halaman ke file baru absen-masuk.html dengan membawa parameter ID data
function bukaDetailJurnal(id) {
    localStorage.setItem('jurnalTerpilih', id);
    window.location.href = "absen-masuk.html";
}

// Fitur hapus permanen jurnal absensi yang sudah dibuat di halaman absen masuk
function hapusJurnal(id) {
    if (confirm("Apakah kamu yakin ingin menghapus seluruh rekaman data jurnal absensi ini?")) {
        let daftarJurnal = JSON.parse(localStorage.getItem('daftarJurnal')) || [];
        daftarJurnal = daftarJurnal.filter(jurnal => jurnal.id !== id);
        localStorage.setItem('daftarJurnal', JSON.stringify(daftarJurnal));
        tampilkanDataBeranda();
    }
}
