const PASS = "123";

// Sahifalar o'rtasida o'tish
function navigateTo(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) {
        target.classList.add('active');
    }
    
    // Hisobot bo'limiga kirganda ma'lumotlarni yangilash
    if (id === 'report-screen') {
        renderReport();
    }
    updateWallet();
}

// Balansni hisoblash (NaN xatosini oldini olib)
function updateWallet() {
    let hist = JSON.parse(localStorage.getItem('data') || '[]');
    let n = 0; // Naqd
    let p = 0; // Plastik/Klik
    
    hist.forEach(i => {
        let a = parseFloat(i.amount) || 0;
        
        // Chiqim bo'lsa ayirish
        if (i.type === 'Chiqim') {
            a = -a;
        }
        
        // To'lov turini tekshirish
        if (i.payment === 'Naqd') {
            n += a;
        } else {
            p += a;
        }
    });
    
    const total = n + p;
    
    // Elementlarni yangilash (Xatolik bo'lmasligi uchun tekshiruv bilan)
    if(document.getElementById('balance-total')) {
        document.getElementById('balance-total').innerText = total.toLocaleString() + ' so\'m';
        document.getElementById('b-naqd').innerText = 'Naqd: ' + n.toLocaleString();
        document.getElementById('b-plastik').innerText = 'Karta/Klik: ' + p.toLocaleString();
    }
}

// Operatsiyani saqlash
function saveData() {
    let sum = document.getElementById('summa').value;
    if (!sum) return alert("Summani kiriting!");
    
    let h = JSON.parse(localStorage.getItem('data') || '[]');
    h.unshift({
        type: document.getElementById('type').value,
        amount: sum,
        payment: document.getElementById('payment').value,
        note: document.getElementById('note').value,
        date: new Date().toLocaleDateString()
    });
    
    localStorage.setItem('data', JSON.stringify(h));
    document.getElementById('summa').value = '';
    navigateTo('home-screen');
}

// Hisobotni ekranga chiqarish
function renderReport() {
    let h = JSON.parse(localStorage.getItem('data') || '[]');
    let resultDiv = document.getElementById('result');
    if (!resultDiv) return;
    
    resultDiv.innerHTML = h.map(i => `
        <div style="background:#2d3436; padding:10px; margin:5px 0; border-radius:5px; border-left: 5px solid ${i.type === 'Kirim' ? '#00ff9d' : '#ff7675'}">
            <b>${i.type}: ${parseFloat(i.amount).toLocaleString()}</b> <br>
            <small>${i.payment} | ${i.date}</small>
        </div>
    `).join('');
}

// Yordamchi funksiyalar
function showReport() { navigateTo('report-screen'); }
function goBack() { navigateTo('home-screen'); }

function checkPassword() {
    if (document.getElementById('password').value === PASS) {
        navigateTo('home-screen');
    } else {
        alert("Noto'g'ri parol!");
    }
}

function clearData() {
    if (confirm("Barcha ma'lumotlarni o'chirmoqchimisiz?")) {
        localStorage.removeItem('data');
        renderReport();
        updateWallet();
    }
}