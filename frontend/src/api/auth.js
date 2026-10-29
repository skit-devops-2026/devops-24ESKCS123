import { request } from './client.js'

function signup(details) {
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(details),
  })
}

function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

function getCurrentUser(token) {
  return request('/auth/me', { token })
}

export { getCurrentUser, login, signup }
