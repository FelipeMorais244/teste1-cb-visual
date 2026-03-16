const aprForm = document.getElementById('aprForm');
const aprTableBody = document.getElementById('aprTableBody');
const searchInput = document.getElementById('searchInput');

const columnKeys = [
    'aprLozane', 'aprGeovaneImp', 'progHeitor', 'aprGeovaneReenv', 
    'aprAssinada', 'aprFelipeRec', 'aprLozaneDrive'
];

let records = JSON.parse(localStorage.getItem('aprRecords')) || [];

function renderTable() {
    const filter = searchInput.value.toLowerCase();
    aprTableBody.innerHTML = '';

    // Filtra os registros conforme o Posto ou Equipe
    const filteredRecords = records.filter(rec => 
        rec.posto.toLowerCase().includes(filter) || 
        rec.equipe.toLowerCase().includes(filter)
    );

    if (filteredRecords.length === 0) {
        aprTableBody.innerHTML = `<tr><td colspan="10" class="no-results">Nenhum resultado encontrado.</td></tr>`;
        return;
    }

    filteredRecords.forEach((rec) => {
        // Encontra o índice real no array original para garantir que a exclusão e edição funcionem
        const originalIndex = records.indexOf(rec);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${rec.equipe}</strong></td>
            <td><strong>${rec.posto}</strong></td>
            ${columnKeys.map(key => `
                <td>
                    <input type="date" class="date-input" 
                        value="${rec[key] || ''}" 
                        onchange="updateDate(${originalIndex}, '${key}', this.value)">
                </td>
            `).join('')}
            <td>
                <button class="btn-delete" onclick="deleteRecord(${originalIndex})">Excluir</button>
            </td>
        `;
        aprTableBody.appendChild(tr);
    });
}

aprForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newRec = {
        equipe: document.getElementById('equipe').value,
        posto: document.getElementById('posto').value
    };
    columnKeys.forEach(key => newRec[key] = '');
    
    records.push(newRec);
    saveAndRefresh();
    aprForm.reset();
});

function updateDate(index, key, value) {
    records[index][key] = value;
    saveData();
}

function deleteRecord(index) {
    // Mensagem de confirmação personalizada
    const equipeNome = records[index].equipe;
    const postoNome = records[index].posto;
    
    const confirmar = confirm(`⚠️ ATENÇÃO:\n\nVocê tem certeza que deseja excluir o registro da Equipe "${equipeNome}" - Posto "${postoNome}"?\n\nEsta ação não pode ser desfeita.`);

    if (confirmar) {
        records.splice(index, 1);
        saveAndRefresh();
    }
}

function saveData() {
    localStorage.setItem('aprRecords', JSON.stringify(records));
}

function saveAndRefresh() {
    saveData();
    renderTable();
}

// Inicia a tabela ao carregar
renderTable();