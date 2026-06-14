let sigPads = {};

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
    initSignature('req');
    loadData();
    setTodayDate(); 
    document.addEventListener('input', saveData);
});

// Run immediately as well just in case
setTodayDate();

function setTodayDate() {
    const today = new Date();
    const dateStr = today.toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit' });
    
    const dateEl = document.getElementById('current-date-display');
    const sigDateEl = document.getElementById('current-date-signature');
    
    console.log("Attempting to set date:", dateStr, "Element found:", !!dateEl, !!sigDateEl);

    if (dateEl) dateEl.innerText = dateStr;
    if (sigDateEl) sigDateEl.innerText = dateStr;
}

function initSignature(id) {
    const canvas = document.getElementById(`canvas-${id}`);
    if (!canvas) return; // Safety check
    const ctx = canvas.getContext('2d');
    let drawing = false;

    // Fit canvas to parent
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = '#000';

    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
        const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const start = (e) => { drawing = true; const pos = getPos(e); ctx.beginPath(); ctx.moveTo(pos.x, pos.y); if(e.touches) e.preventDefault(); };
    const move = (e) => { if (!drawing) return; const pos = getPos(e); ctx.lineTo(pos.x, pos.y); ctx.stroke(); if(e.touches) e.preventDefault(); };
    const stop = () => { if (drawing) { drawing = false; syncSignatureToImage(id); saveData(); } };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);
    canvas.addEventListener('touchstart', start);
    canvas.addEventListener('touchmove', move);
    canvas.addEventListener('touchend', stop);

    sigPads[id] = { canvas, ctx };
}

function clearSig(id) {
    if (sigPads[id]) {
        sigPads[id].ctx.clearRect(0, 0, sigPads[id].canvas.width, sigPads[id].canvas.height);
        syncSignatureToImage(id);
        saveData();
    }
}

function syncSignatureToImage(id) {
    if (sigPads[id]) {
        const dataURL = sigPads[id].canvas.toDataURL();
        document.getElementById(`img-${id}`).src = dataURL;
    }
}

function addRow(no = '', desc = 'ระบุรายการงาน...', qty = '1', unit = 'งาน') {
    const body = document.getElementById('itemsBody');
    const row = body.insertRow();
    row.innerHTML = `
        <td class="col-no" contenteditable="true">${no || body.rows.length}</td>
        <td class="col-desc" contenteditable="true">${desc}</td>
        <td class="col-qty" contenteditable="true">${qty}</td>
        <td class="col-unit" contenteditable="true">${unit}</td>
        <td class="no-print" style="text-align: center;"><button class="control-btn" onclick="this.closest('tr').remove(); saveData();"><i class="fas fa-times"></i></button></td>
    `;
    saveData();
}

function saveData() {
    const data = { fields: {}, items: [], sigs: {} };
    document.querySelectorAll('.editable-field').forEach(el => { if (el.dataset.id) data.fields[el.dataset.id] = el.innerText; });
    document.querySelectorAll('#itemsBody tr').forEach(row => {
        data.items.push([row.cells[0].innerText, row.cells[1].innerText, row.cells[2].innerText, row.cells[3].innerText]);
    });
    for (let id in sigPads) if (sigPads[id].canvas) data.sigs[id] = sigPads[id].canvas.toDataURL();
    localStorage.setItem('ufix_rfq_v5_data', JSON.stringify(data));
}

function loadData() {
    const saved = localStorage.getItem('ufix_rfq_v5_data');
    const body = document.getElementById('itemsBody');
    body.innerHTML = '';
    if (saved) {
        const data = JSON.parse(saved);
        document.querySelectorAll('.editable-field').forEach(el => { if (el.dataset.id && data.fields[el.dataset.id]) el.innerText = data.fields[el.dataset.id]; });
        data.items.forEach(item => addRow(item[0], item[1], item[2], item[3]));
        for (let id in data.sigs) {
            const img = new Image();
            img.onload = () => { if(sigPads[id]) { sigPads[id].ctx.drawImage(img, 0, 0); syncSignatureToImage(id); } };
            img.src = data.sigs[id];
        }
    } else {
        addRow('1', 'ระบุบริการของคุณที่นี่...', '1', 'งาน');
    }
}

function clearLocalData() {
    if (confirm('ยืนยันล้างข้อมูลทั้งหมด?')) {
        localStorage.removeItem('ufix_rfq_v5_data');
        // Clear all editable fields
        document.querySelectorAll('.editable-field').forEach(el => el.innerText = '');
        // Reset date
        setTodayDate();
        // Clear table
        const body = document.getElementById('itemsBody');
        body.innerHTML = '';
        addRow('1', 'ระบุบริการของคุณที่นี่...', '1', 'งาน');
        // Clear signatures
        for (let id in sigPads) {
            sigPads[id].ctx.clearRect(0, 0, sigPads[id].canvas.width, sigPads[id].canvas.height);
            syncSignatureToImage(id);
        }
        showToast("ล้างข้อมูลเรียบร้อยแล้ว");
    }
}

function generatePrintLayout() {
    const container = document.getElementById('print-layout');
    container.innerHTML = '';
    for (let id in sigPads) syncSignatureToImage(id);

    const items = [];
    document.querySelectorAll('#itemsBody tr').forEach(row => {
        items.push({ no: row.cells[0].innerText, desc: row.cells[1].innerText, qty: row.cells[2].innerText, unit: row.cells[3].innerText });
    });

    // Calculate items per page based on content
    const chunks = [];
    const firstPageMax = 15; // Fewer items on first page due to header/info
    const subsequentPageMax = 25;

    chunks.push(items.slice(0, firstPageMax));
    for (let i = firstPageMax; i < items.length; i += subsequentPageMax) {
        chunks.push(items.slice(i, i + subsequentPageMax));
    }

    const totalPages = chunks.length;
    const headerHtml = document.querySelector('header').outerHTML;
    const infoGridHtml = document.querySelector('.info-grid').outerHTML;
    const notesHtml = document.querySelector('.notes-section').outerHTML;
    const signatureHtml = document.querySelector('.signature-grid').outerHTML;

    chunks.forEach((chunk, index) => {
        if (chunk.length === 0 && index > 0) return;
        
        const pageDiv = document.createElement('div');
        pageDiv.className = 'print-page';
        
        let html = headerHtml;
        if (index === 0) html += infoGridHtml;

        html += `
            <table class="items-table">
                <thead>
                    <tr>
                        <th class="col-no">ลำดับ</th>
                        <th class="col-desc">รายละเอียดรายการงาน (Description)</th>
                        <th class="col-qty">จำนวน</th>
                        <th class="col-unit">หน่วย</th>
                    </tr>
                </thead>
                <tbody>
                    ${chunk.map(item => `
                        <tr>
                            <td class="col-no">${item.no}</td>
                            <td class="col-desc">${item.desc}</td>
                            <td class="col-qty">${item.qty}</td>
                            <td class="col-unit">${item.unit}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        if (index === totalPages - 1) {
            html += notesHtml + signatureHtml;
        }

        html += `<div class="page-number">หน้า ${index + 1} / ${totalPages}</div>`;
        pageDiv.innerHTML = html;
        container.appendChild(pageDiv);
    });
}

function preparePrint() {
    generatePrintLayout();
    window.print();
}

function downloadPDF() {
    generatePrintLayout();
    const element = document.getElementById('print-layout');
    const requesterName = document.querySelector('[data-id="r-name"]').innerText.trim() || "RFQ";
    const opt = {
        margin: 0,
        filename: `RFQ_${requesterName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

function sendRFQ() {
    if (isSubmitting) return;

    const contact = document.querySelector('[data-id="r-contact"]').innerText.trim();
    const addr = document.querySelector('[data-id="r-addr"]').innerText.trim();
    const tel = document.querySelector('[data-id="r-tel"]').innerText.trim();
    const email = document.querySelector('[data-id="r-email"]').innerText.trim();
    const desc = document.getElementById('itemsBody').innerText.trim();

    // ตรวจสอบข้อมูลบังคับที่จำเป็น
    if (!contact || !addr || !tel || !email || desc === "ระบุบริการของคุณที่นี่...") {
        alert("กรุณาตรวจสอบข้อมูลให้ครบถ้วน: ชื่อ, ที่อยู่, เบอร์โทร, อีเมล และรายละเอียดงาน");
        return;
    }


    // Generate unique document number
    const docNo = "RFQ" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + Math.floor(Math.random() * 1000);
    
    // Check duplicate
    if (localStorage.getItem("rfq_submitted_" + docNo)) {
        alert("เอกสารนี้ถูกส่งแล้ว ไม่สามารถส่งซ้ำได้");
        return;
    }

    isSubmitting = true;
    const btn = document.getElementById('submitRFQBtn');
    const originalBtnHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังส่งข้อมูล...';
    showToast("กำลังส่งข้อมูล...");

    const emailBody = buildRFQEmail(docNo);
    const formData = new FormData();
    formData.append("_subject", "RFQ ใหม่ - " + docNo);
    formData.append("_template", "table"); // Revert to table
    formData.append("message", emailBody);

    // Timeout mechanism (5 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    fetch("https://formsubmit.co/ajax/ufixdecor.service21@gmail.com", {
        method: "POST",
        body: formData,
        signal: controller.signal
    })
    .then(res => {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error('Network response not ok');
        return res.json();
    })
    .then(data => {
        localStorage.setItem("rfq_submitted_" + docNo, "true");
        showSuccessModal(docNo);
        showToast("ส่งข้อมูลสำเร็จ!");
    })
    .catch(err => {
        clearTimeout(timeoutId);
        console.error("RFQ Submit Error:", err);
        showErrorModal();
        showToast("เกิดข้อผิดพลาด: " + (err.name === 'AbortError' ? 'หมดเวลาเชื่อมต่อ' : 'ไม่สามารถส่งข้อมูลได้'));
    })
    .finally(() => {
        isSubmitting = false;
        btn.disabled = false;
        btn.innerHTML = originalBtnHtml;
    });
}

function buildRFQEmail(docNo) {
    let items = "";
    document.querySelectorAll('#itemsBody tr').forEach((row, i) => {
        items += `${i+1}. ${row.cells[1].innerText} - ${row.cells[2].innerText} ${row.cells[3].innerText}\n`;
    });

    const getName = (id) => {
        const el = document.querySelector(`[data-id="${id}"]`);
        if (!el) return "ไม่ได้ระบุ";
        return el.value || el.innerText;
    };

    return `
================================
RFQ / PURCHASE REQUISITION
================================
เลขที่เอกสาร : ${docNo}
วันที่ : ${document.getElementById('current-date-display').innerText}

ข้อมูลลูกค้า
ผู้ติดต่อ (ชื่อจริง) : ${getName('r-contact')}
ที่อยู่ : ${getName('r-addr')}
เบอร์โทร : ${getName('r-tel')}
อีเมล : ${getName('r-email')}

รายละเอียดรายการ
${items}

# หมายเหตุ : รายการข้างต้นเป็นรายการขอเสนอราคาเพื่อพิจารณาอนุมัติจัดซื้อ

# ลายเซ็นผู้ขอราคา:
${getName('text-sig')}
( ${getName('name-req')} )
`;
}

function showSuccessModal(docNo) {
    const modal = document.getElementById('rfqModal');
    document.getElementById('modalIcon').innerHTML = '<i class="fas fa-check-circle" style="color:#2ecc71;"></i>';
    document.getElementById('modalTitle').innerText = "ส่งใบขอราคาเรียบร้อย";
    document.getElementById('modalBody').innerHTML = `ระบบได้ส่งข้อมูลไปยังฝ่ายขายแล้ว<br><br><strong>เลขที่เอกสาร:</strong><br>${docNo}`;
    
    const closeBtn = modal.querySelector('.btn-dark');
    closeBtn.onclick = () => {
        modal.style.display = 'none';
        window.close(); // Close the tab/window
    };
    modal.style.display = 'flex';
}

function showErrorModal() {
    const modal = document.getElementById('rfqModal');
    document.getElementById('modalIcon').innerHTML = '<i class="fas fa-times-circle" style="color:#e74c3c;"></i>';
    document.getElementById('modalTitle').innerText = "ส่งข้อมูลไม่สำเร็จ";
    document.getElementById('modalBody').innerText = "กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตแล้วลองใหม่อีกครั้ง";
    modal.style.display = 'flex';
}

function showToast(msg) {
    const toast = document.getElementById('rfqToast');
    toast.innerText = msg;
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 3000);
}

let isSubmitting = false;
