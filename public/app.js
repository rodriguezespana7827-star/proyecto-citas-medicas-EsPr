const API_URL = '/api/citas';
const form = document.querySelector('#appointmentForm');
const idInput = document.querySelector('#appointmentId');
const formTitle = document.querySelector('#formTitle');
const submitButton = document.querySelector('#submitButton');
const cancelEditButton = document.querySelector('#cancelEdit');
const formMessage = document.querySelector('#formMessage');
const listMessage = document.querySelector('#listMessage');
const appointmentsList = document.querySelector('#appointmentsList');
const searchInput = document.querySelector('#searchInput');
const statusFilter = document.querySelector('#statusFilter');
const confirmDialog = document.querySelector('#confirmDialog');
const confirmDeleteButton = document.querySelector('#confirmDelete');
let appointments = [];
let deleteId = null;

const statusLabels = { pendiente: 'Pendiente', confirmada: 'Confirmada', cancelada: 'Cancelada' };
const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const formatDate = value => {
  if (!value) return 'Fecha sin definir';
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat('es-EC', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
};
const formatTime = value => String(value || '').slice(0, 5);

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers }
  });
  const data = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || 'No se pudo completar la solicitud.');
  return data;
}

async function loadAppointments() {
  listMessage.textContent = 'Cargando citas...';
  try {
    appointments = await apiRequest(API_URL);
    renderAppointments();
    updateStats();
  } catch (error) {
    listMessage.textContent = `No se pudieron cargar las citas. ${error.message} Comprueba que el servidor y MySQL estén funcionando.`;
    appointmentsList.innerHTML = '';
  }
}

function updateStats() {
  document.querySelector('#totalCount').textContent = appointments.length;
  document.querySelector('#pendingCount').textContent = appointments.filter(item => item.estado === 'pendiente').length;
  document.querySelector('#confirmedCount').textContent = appointments.filter(item => item.estado === 'confirmada').length;
}

function renderAppointments() {
  const term = searchInput.value.trim().toLocaleLowerCase('es');
  const selectedStatus = statusFilter.value;
  const filtered = appointments.filter(item => {
    const matchesTerm = `${item.paciente} ${item.medico} ${item.motivo}`.toLocaleLowerCase('es').includes(term);
    return matchesTerm && (selectedStatus === 'todas' || item.estado === selectedStatus);
  });
  listMessage.textContent = filtered.length ? `${filtered.length} ${filtered.length === 1 ? 'cita encontrada' : 'citas encontradas'}` : '';
  if (!filtered.length) {
    appointmentsList.innerHTML = `<div class="empty-state"><span>♡</span><strong>${appointments.length ? 'No hay coincidencias' : 'Tu agenda está lista'}</strong><p>${appointments.length ? 'Prueba otra búsqueda o cambia el filtro.' : 'Registra una cita usando el formulario.'}</p></div>`;
    return;
  }
  appointmentsList.innerHTML = filtered.map(item => `
    <article class="appointment-card">
      <div class="appointment-main">
        <div class="appointment-top"><h3>${escapeHTML(item.paciente)}</h3><span class="status status-${escapeHTML(item.estado)}">${escapeHTML(statusLabels[item.estado] || item.estado)}</span></div>
        <p class="doctor-name">${escapeHTML(item.medico)}</p>
        <div class="appointment-meta"><span>▦ ${escapeHTML(formatDate(item.fecha))}</span><span>◷ ${escapeHTML(formatTime(item.hora))}</span></div>
        <p class="appointment-reason">${escapeHTML(item.motivo)}</p>
      </div>
      <div class="card-actions">
        <button class="icon-button" type="button" data-action="edit" data-id="${Number(item.id)}" aria-label="Editar cita de ${escapeHTML(item.paciente)}" title="Editar">✎</button>
        <button class="icon-button delete" type="button" data-action="delete" data-id="${Number(item.id)}" aria-label="Eliminar cita de ${escapeHTML(item.paciente)}" title="Eliminar">×</button>
      </div>
    </article>`).join('');
}

function resetForm() {
  form.reset();
  idInput.value = '';
  formTitle.textContent = 'Agendar una cita';
  submitButton.innerHTML = 'Guardar cita <span>↗</span>';
  cancelEditButton.classList.add('hidden');
  formMessage.textContent = '';
  formMessage.classList.remove('error');
}

function showFormMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.classList.toggle('error', isError);
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const id = idInput.value;
  const payload = {
    paciente: form.paciente.value.trim(),
    medico: form.medico.value.trim(),
    fecha: form.fecha.value,
    hora: form.hora.value,
    motivo: form.motivo.value.trim(),
    estado: form.estado.value
  };
  submitButton.disabled = true;
  submitButton.textContent = 'Guardando...';
  try {
    await apiRequest(id ? `${API_URL}/${id}` : API_URL, { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) });
    resetForm();
    showFormMessage(id ? 'La cita se actualizó correctamente.' : 'La cita se registró correctamente.');
    await loadAppointments();
  } catch (error) {
    showFormMessage(error.message, true);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = idInput.value ? 'Actualizar cita <span>↗</span>' : 'Guardar cita <span>↗</span>';
  }
});

appointmentsList.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const item = appointments.find(appointment => Number(appointment.id) === Number(button.dataset.id));
  if (!item) return;
  if (button.dataset.action === 'edit') {
    idInput.value = item.id;
    form.paciente.value = item.paciente;
    form.medico.value = item.medico;
    form.fecha.value = String(item.fecha).slice(0, 10);
    form.hora.value = formatTime(item.hora);
    form.motivo.value = item.motivo;
    form.estado.value = item.estado;
    formTitle.textContent = 'Editar una cita';
    submitButton.innerHTML = 'Actualizar cita <span>↗</span>';
    cancelEditButton.classList.remove('hidden');
    showFormMessage('Modifica los datos y guarda los cambios.');
    document.querySelector('.form-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    deleteId = item.id;
    if (typeof confirmDialog.showModal === 'function') confirmDialog.showModal();
    else if (window.confirm('¿Eliminar esta cita?')) deleteAppointment();
  }
});

async function deleteAppointment() {
  if (deleteId === null) return;
  try {
    await apiRequest(`${API_URL}/${deleteId}`, { method: 'DELETE' });
    if (String(idInput.value) === String(deleteId)) resetForm();
    deleteId = null;
    if (confirmDialog.open) confirmDialog.close();
    await loadAppointments();
  } catch (error) {
    if (confirmDialog.open) confirmDialog.close();
    listMessage.textContent = error.message;
  }
}

confirmDeleteButton.addEventListener('click', event => {
  event.preventDefault();
  deleteAppointment();
});
cancelEditButton.addEventListener('click', resetForm);
searchInput.addEventListener('input', renderAppointments);
statusFilter.addEventListener('change', renderAppointments);
document.querySelector('#refreshButton').addEventListener('click', loadAppointments);
loadAppointments();
