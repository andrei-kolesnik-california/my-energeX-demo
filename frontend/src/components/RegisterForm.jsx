import React, { useState } from "react";
import Alert from "./Alert";

export default function Signup({ onSuccess, onRegister }) {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const submit = async () => {
    try {
      setError("");
      setOk("");
      const data = await onRegister?.({
        username,
        full_name: fullName,
        email,
        password,
      });
      setOk("Account created");
      onSuccess?.(data);
    } catch (e) {
      setError(e?.message || "Signup failed");
    }
  };

  return (
    <div className="row" autoComplete="off">
      <input className="input" placeholder="Username" autoComplete="off"
             onFocus={(e)=>e.target.select()} value={username} onChange={(e)=>setUsername(e.target.value)} />
      <input className="input" placeholder="Full name" autoComplete="off"
             onFocus={(e)=>e.target.select()} value={fullName} onChange={(e)=>setFullName(e.target.value)} />
      <input className="input" placeholder="Email (e.g., you@example.com)" autoComplete="off"
             onFocus={(e)=>e.target.select()} value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input className="input" type="password" placeholder="Create password" autoComplete="new-password"
             onFocus={(e)=>e.target.select()} value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button className="btn" onClick={submit}>Sign up</button>
      {error && <Alert type="error">{error}</Alert>}
      {ok && <Alert type="success">{ok}</Alert>}
    </div>
  );
}


// import React, { useState } from "react";
// import Alert from "./Alert"; 

// export default function Signup({ onSuccess }) {
//   const [username, setUsername] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [ok, setOk] = useState("");

//   const submit = async () => {
//     try {
//       setError("");
//       setOk("");
//       const res = await fetch("/api/register", {  
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({
//           username,
//           full_name: fullName,
//           email,
//           password,
//         }),
//       });
//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) throw new Error(data?.detail || data?.error || res.statusText);
//       setOk("Account created");
//       onSuccess?.(data);
//     } catch (e) {
//       setError(e.message || "Signup failed");
//     }
//   };

//   return (
//     <div className="row" autoComplete="off">
//       <input className="input" placeholder="Username" autoComplete="off"
//              onFocus={(e)=>e.target.select()} value={username} onChange={(e)=>setUsername(e.target.value)} />
//       <input className="input" placeholder="Full name" autoComplete="off"
//              onFocus={(e)=>e.target.select()} value={fullName} onChange={(e)=>setFullName(e.target.value)} />
//       <input className="input" placeholder="Email (e.g., you@example.com)" autoComplete="off"
//              onFocus={(e)=>e.target.select()} value={email} onChange={(e)=>setEmail(e.target.value)} />
//       <input className="input" type="password" placeholder="Create password" autoComplete="new-password"
//              onFocus={(e)=>e.target.select()} value={password} onChange={(e)=>setPassword(e.target.value)} />
//       <button className="btn" onClick={submit}>Sign up</button>
//       {error && <Alert type="error">{error}</Alert>}
//       {ok && <Alert type="success">{ok}</Alert>}
//     </div>
//   );
// }
