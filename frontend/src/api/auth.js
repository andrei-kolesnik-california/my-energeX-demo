const BASE_URL = import.meta?.env?.VITE_API_BASE || "http://localhost:8000";
async function postJSON(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),credentials:"include"});
  if(!res.ok) throw new Error(res.statusText);
  return res.json();
}
export async function signup({ username, password, full_name }) {return postJSON("/api/auth/signup/",{username,password,full_name});}
export async function login({ username, password }) {return postJSON("/api/auth/login/",{username,password});}
