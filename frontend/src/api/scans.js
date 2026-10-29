import { request } from './client.js'

function createScan(token, scan) {
  return request('/scans', {
    method: 'POST',
    token,
    body: JSON.stringify(scan),
  })
}

function getScans(token) {
  return request('/scans', { token })
}

function updateScan(token, id, updates) {
  return request(`/scans/${id}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(updates),
  })
}

function deleteScan(token, id) {
  return request(`/scans/${id}`, {
    method: 'DELETE',
    token,
  })
}

export { createScan, deleteScan, getScans, updateScan }
