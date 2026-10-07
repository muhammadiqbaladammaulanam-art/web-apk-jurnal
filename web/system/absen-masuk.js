let listSiswaTerinput = [];
let idJurnalTerpilih = localStorage.getItem('jurnalTerpilih');

document.addEventListener('DOMContentLoaded', function() {
    // Mengecek apakah halaman ini dibuka karena tombol "Lihat" di Beranda diklik
    if (idJurnalTerpilih) {
        memuatDataUntukDiedit();
    }

    // Aksi Tombol: Tambah Siswa ke Tabel Sementara
    document.getElementById('btnTambahSiswa').addEventListener('click', function() {
        const noAbsen = document.getElementById('noAbsen').value;
        const namaSiswa = document.getElementById('namaSiswa').value;
        const statusKeterangan = document.getElementById('statusKeterangan').value;

        if (!noAbsen || !namaSiswa) {
            alert("Nomor absen dan nama siswa wajib diisi!");
            return;
        }

        const sudahAda = listSiswaTerinput.some(siswa => siswa.no === noAbsen);
        if (sudahAda) {
            alert("Nomor absen tersebut sudah terdaftar di daftar hari ini!");
            return;
        }

        listSiswaTerinput.push({
            no: noAbsen,
            nama: namaSiswa,
            status: statusKeterangan
        });

        listSiswaTerinput.sort((a, b) => parseInt(a.no) - parseInt(b.no));
        tampilkanListSiswa();
        
        document.getElementById('noAbsen').value = '';
        document.getElementById('namaSiswa').value = '';
        document.getElementById('statusKeterangan').value = 'Belum Diketahui';
    });

    // Aksi Form Submit: Simpan Seluruh Jurnal Absensi
    document.getElementById('formJurnalAbsensi').addEventListener('submit', function(event) {
        event.preventDefault();

        const hari = document.getElementById('hari').value;
        const tanggal = document.getElementById('tanggal').value;
        const bulan = document.getElementById('bulan').value;
        const tahun = document.getElementById('tahun').value;

        let daftarJurnal = JSON.parse(localStorage.getItem('daftarJurnal')) || [];

        if (idJurnalTerpilih) {
            // MODE EDIT DATA ULANG
            daftarJurnal = daftarJurnal.map(function(jurnal) {
                if (jurnal.id === parseInt(idJurnalTerpilih)) {
                    return {
                        id: jurnal.id,
                        hari: hari,
                        tanggal: tanggal,
                        bulan: bulan,
                        tahun: tahun,
                        siswa: listSiswaTerinput
                    };
                }
                return jurnal;
            });
            localStorage.removeItem('jurnalTerpilih');
        } else {
            // MODE BUAT BARU
            const jurnalBaru = {
                id: Date.now(),
                hari: hari,
                tanggal: tanggal,
                bulan: bulan,
                tahun: tahun,
                siswa: listSiswaTerinput
            };
            daftarJurnal.push(jurnalBaru);
        }

        localStorage.setItem('daftarJurnal', JSON.stringify(daftarJurnal));
        alert("Seluruh data jurnal absensi berhasil disimpan!");
        window.location.href = "index.html";
    });
});

function tampilkanListSiswa() {
    const tbody = document.getElementById('listSiswaSementara');
    tbody.innerHTML = '';

    listSiswaTerinput.forEach(function(siswa, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${siswa.no}</td>
            <td>${siswa.nama}</td>
            <td>
                <select class="select-tabel" onchange="ubahStatusSiswaDiTabel(${index}, this.value)">
                    <option value="Belum Diketahui" ${siswa.status === 'Belum Diketahui' ? 'selected' : ''}>Belum Diketahui</option>
                    <option value="Hadir" ${siswa.status === 'Hadir' ? 'selected' : ''}>Hadir</option>
                    <option value="Alpha" ${siswa.status === 'Alpha' ? 'selected' : ''}>Alpha</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.ubahStatusSiswaDiTabel = function(index, statusBaru) {
    if (listSiswaTerinput[index]) {
        listSiswaTerinput[index].status = statusBaru;
    }
};

function memuatDataUntukDiedit() {
    document.getElementById('judulForm').textContent = "Lihat & Edit Jurnal Absensi";
    
    let daftarJurnal = JSON.parse(localStorage.getItem('daftarJurnal')) || [];
    const jurnalDitemukan = daftarJurnal.find(jurnal => jurnal.id === parseInt(idJurnalTerpilih));

    if (jurnalDitemukan) {
        document.getElementById('hari').value = jurnalDitemukan.hari;
        document.getElementById('tanggal').value = jurnalDitemukan.tanggal;
        document.getElementById('bulan').value = jurnalDitemukan.bulan;
        document.getElementById('tahun').value = jurnalDitemukan.tahun;

        listSiswaTerinput = jurnalDitemukan.siswa || [];
        tampilkanListSiswa();
    }
}
