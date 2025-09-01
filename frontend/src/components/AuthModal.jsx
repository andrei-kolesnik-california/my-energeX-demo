import React, { useEffect, useRef, useState } from "react";
import { signup, login } from "../api/auth";

export default function AuthModal({ open, onClose, mode = "signup" }) {
  const dialogRef = useRef(null);
  const [tab, setTab] = useState(mode);
  const [signupData, setSignupData] = useState({ username: "", password: "", full_name: "" });
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  useEffect(() => setTab(mode), [mode]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open) {
      dlg.showModal();
      dlg.addEventListener("cancel", e => e.preventDefault());
      return () => dlg.removeEventListener("cancel", e => e.preventDefault());
    } else if (dlg.open) dlg.close();
  }, [open]);

  const onBackdropClick = (e) => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const rect = dlg.getBoundingClientRect();
    const inside = rect.top <= e.clientY && e.clientY <= rect.bottom &&
                   rect.left <= e.clientX && e.clientX <= rect.right;
    if (!inside) { e.preventDefault(); e.stopPropagation(); }
  };

  return (
    <dialog ref={dialogRef} onClick={onBackdropClick}>
      <button onClick={() => onClose?.()}>×</button>
      {tab === "signup" ? (
        <form onSubmit={(e)=>{e.preventDefault();signup(signupData);}}>
          <input placeholder="Username" value={signupData.username} onChange={e=>setSignupData({...signupData,username:e.target.value})}/>
          <input placeholder="Full name" value={signupData.full_name} onChange={e=>setSignupData({...signupData,full_name:e.target.value})}/>
          <input type="password" placeholder="Password" value={signupData.password} onChange={e=>setSignupData({...signupData,password:e.target.value})}/>
          <button type="submit">Create account</button>
        </form>
      ):(
        <form onSubmit={(e)=>{e.preventDefault();login(loginData);}}>
          <input placeholder="Username" value={loginData.username} onChange={e=>setLoginData({...loginData,username:e.target.value})}/>
          <input type="password" placeholder="Password" value={loginData.password} onChange={e=>setLoginData({...loginData,password:e.target.value})}/>
          <button type="submit">Sign in</button>
        </form>
      )}
    </dialog>
  );
}