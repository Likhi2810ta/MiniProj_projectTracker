const SERVER = import.meta.env.VITE_API_URL ?? '';

export const TRACKER  = `${SERVER}/api/tracker`;
export const CHATBOT  = `${SERVER}/chatbot`;

export function getToken() {
  return localStorage.getItem('auth_token');
}

export function setToken(t) {
  localStorage.setItem('auth_token', t);
}

export function clearToken() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_role');
}

export function authHeaders(json = true) {
  const h = { Authorization: `Bearer ${getToken()}` };
  if (json) h['Content-Type'] = 'application/json';
  return h;
}

async function request(url, options = {}) {
  const res = await fetch(url, options);
  if (res.status === 204) return null;
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    const text = await res.text();
    if (!res.ok) throw new Error(text.replace(/<[^>]+>/g, '').slice(0, 300).trim() || `HTTP ${res.status}`);
    return text;
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || JSON.stringify(data));
  return data;
}

// ── Me / Auth ─────────────────────────────────────────────────────────────────
export const getMe = () =>
  request(TRACKER + '/me', { headers: authHeaders() });

// ── Batches ──────────────────────────────────────────────────────────────────
export const getBatches = () =>
  request(TRACKER + '/batches', { headers: authHeaders() });

export const createBatch = (batch_name, year) =>
  request(TRACKER + '/batches', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ batch_name, year: year ? parseInt(year) : null }),
  });

// ── Semesters ────────────────────────────────────────────────────────────────
export const getSemesters = (batchId) =>
  request(`${TRACKER}/batches/${batchId}/semesters`, { headers: authHeaders() });

export const createSemester = (batchId, sem_number) =>
  request(`${TRACKER}/batches/${batchId}/semesters`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ sem_number }),
  });

// ── Courses ──────────────────────────────────────────────────────────────────
export const getCourses = (semId) =>
  request(`${TRACKER}/semesters/${semId}/courses`, { headers: authHeaders() });

export const createCourse = (semId, course_name, course_code) =>
  request(`${TRACKER}/semesters/${semId}/courses`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ course_name, ...(course_code ? { course_code } : {}) }),
  });

// ── Projects ─────────────────────────────────────────────────────────────────
export const getProjects = (courseId) =>
  request(`${TRACKER}/courses/${courseId}/projects`, { headers: authHeaders() });

export const getProject = (projectId) =>
  request(`${TRACKER}/projects/${projectId}`, { headers: authHeaders() });

export const createProject = (courseId, payload) =>
  request(`${TRACKER}/courses/${courseId}/projects`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

export const updateProject = (projectId, payload) =>
  request(`${TRACKER}/projects/${projectId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

export const deleteProject = (projectId) =>
  request(`${TRACKER}/projects/${projectId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

// ── Students ─────────────────────────────────────────────────────────────────
export const updateStudent = (studentId, payload) =>
  request(`${TRACKER}/students/${studentId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

export const deleteStudent = (studentId) =>
  request(`${TRACKER}/students/${studentId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

// ── Upload ───────────────────────────────────────────────────────────────────
export async function uploadExcel(projectId, file) {
  const form = new FormData();
  form.append('file', file);
  return request(`${TRACKER}/projects/${projectId}/upload-excel`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: form,
  });
}

export const templateUrl = () => `${TRACKER}/download-template`;

// ── README ───────────────────────────────────────────────────────────────────
export const getReadme = (projectId) =>
  request(`${TRACKER}/projects/${projectId}/readme`, { headers: authHeaders() });

// ── Chatbot ──────────────────────────────────────────────────────────────────
export const chatFilter = (query) =>
  request(`${CHATBOT}/filter`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ query }),
  });

export const chatExplain = (projectId) =>
  request(`${CHATBOT}/explain/${projectId}`, {
    method: 'POST',
    headers: authHeaders(),
  });

export const chatSuggest = (projectId) =>
  request(`${CHATBOT}/suggest/${projectId}`, {
    method: 'POST',
    headers: authHeaders(),
  });

// ── Admin ─────────────────────────────────────────────────────────────────────
export const getAdminUsers = () =>
  request(`${TRACKER}/admin/users`, { headers: authHeaders() });

export const getAdminPending = () =>
  request(`${TRACKER}/admin/pending`, { headers: authHeaders() });

export const approveUser = (userId) =>
  request(`${TRACKER}/admin/approve/${userId}`, {
    method: 'POST',
    headers: authHeaders(),
  });

export const rejectUser = (userId) =>
  request(`${TRACKER}/admin/reject/${userId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

export const getAdminCourses = () =>
  request(`${TRACKER}/admin/courses`, { headers: authHeaders() });

export const getAdminCoordinators = () =>
  request(`${TRACKER}/admin/coordinators`, { headers: authHeaders() });

export const assignCoordinator = (user_id, course_id) =>
  request(`${TRACKER}/admin/assign-coordinator`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ user_id, course_id }),
  });

export const removeCoordinator = (course_id, user_id) =>
  request(`${TRACKER}/admin/coordinators/${course_id}/${user_id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
