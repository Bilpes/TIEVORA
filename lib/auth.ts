"use client";
import { create } from "zustand";

export type Role = "CEO" | "Manager";
export type User = { id:string; name:string; role:Role; office?:string; country?:string };

const users: User[] = [
  { id:"u-ceo", name:"Elias Virtanen (CEO)", role:"CEO" },
  { id:"u-mgr-fi", name:"Sofia Lind — Finland Manager", role:"Manager", country:"Finland" },
  { id:"u-mgr-se", name:"Mikael Lindqvist — Sweden Manager", role:"Manager", country:"Sweden" },
  { id:"u-mgr-pl", name:"Katarzyna Nowak — Poland Manager", role:"Manager", country:"Poland" },
  { id:"u-mgr-in", name:"Aarav Mehta — India Manager", role:"Manager", country:"India" },
  { id:"u-mgr-ua", name:"Olena Petrenko — Ukraine Manager", role:"Manager", country:"Ukraine" },
];

export const useAuth = create<{ user: User; setUserId: (id:string)=>void; users: User[] }>((set)=> ({
  user: users[0],
  users,
  setUserId: (id)=> set({ user: users.find(u=>u.id===id) || users[0] }),
}));

export function canSeeOffice(user: User, officeCountry: string) {
  if (user.role==="CEO") return true;
  return user.country===officeCountry;
}
export function canSeeProject(user: User, office: string, offices: any[]) {
  if (user.role==="CEO") return true;
  const o = offices.find((x:any)=> x.city===office || x.city.includes(office));
  if (!o) return true;
  return o.country===user.country;
}
