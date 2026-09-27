"use client";

import { useState } from "react";

type View = "login" | "signup" | "plans" | "dashboard" | "leads" | "properties" | "propertyDetail";

const nav: { id: View; label: string; icon: string }[] = [
  { id: "dashboard", label: "მთავარი", icon: "⌂" },
  { id: "leads", label: "ლიდები", icon: "◎" },
  { id: "properties", label: "ობიექტები", icon: "◇" },
];

const leads = [
  ["ნინო ბერიძე", "3 ოთახი · 80–110 მ²", "120,000 ₾", "ვაკე", "ახალი", "დღეს, 14:30"],
  ["გიორგი მაისურაძე", "2 საძინებელი · 65–90 მ²", "95,000 ₾", "საბურთალო", "აქტიური", "4 ობიექტი"],
  ["ანა კაპანაძე", "სახლი · 180+ მ²", "280,000 ₾", "წყნეთი", "ყურადღება", "განახლება"],
  ["მარიამ გელაშვილი", "3 საძინებელი · 100–140 მ²", "185,000 ₾", "ლისი", "ახალი", "91% match"],
];

const properties = [
  ["ჭავჭავაძის გამზირი 48", "#AG-10428 · ვაკე", "118,000 ₾", "108 მ²", "აქტიური", "5 წთ"],
  ["აბაშიძის ქუჩა 21", "#AG-10412 · ვაკე", "112,500 ₾", "96 მ²", "კონფლიქტი", "18 წთ"],
  ["ფალიაშვილის ქუჩა 9", "#AG-10397 · ვაკე", "124,000 ₾", "84 მ²", "აქტიური", "1 სთ"],
  ["წერეთლის გამზირი 72", "#AG-10281 · დიდუბე", "76,000 ₾", "61 მ²", "მოძველებული", "3 დღე"],
];

function Field({ label, placeholder, password = false }: { label: string; placeholder: string; password?: boolean }) {
  return <label className="field"><span>{label}</span><span className="input">{password ? "••••••••" : placeholder}{password && <b>ჩვენება</b>}</span></label>;
}

function Auth({ signup, onNavigate }: { signup?: boolean; onNavigate: (v: View) => void }) {
  return <main className="auth-shell">
    <section className="auth-brand"><div className="brand">Agento</div><h1>უძრავი ქონების გადაწყვეტილებები, უფრო სწრაფად.</h1><p>ლიდები, ობიექტები და შესაბამისობები ერთ სანდო სამუშაო სივრცეში.</p><div className="brand-stat"><b>18</b><span>ახალი დამთხვევა დღეს</span></div></section>
    <section className="auth-panel"><button className="language">ქართული⌄</button><div className="auth-card"><div className="mini-logo">Agento</div><h2>{signup ? "შექმენით ანგარიში" : "კეთილი იყოს თქვენი დაბრუნება"}</h2><p>{signup ? "დაიწყეთ 14-დღიანი უფასო პერიოდით" : "შედით თქვენს სამუშაო სივრცეში"}</p>{signup && <Field label="სახელი და გვარი" placeholder="ელენე რამიშვილი" />}<Field label="ელფოსტა" placeholder="name@company.ge"/><Field label="პაროლი" placeholder="" password/><div className="auth-options"><label><input type="checkbox"/> დამახსოვრება</label><a>დაგავიწყდათ პაროლი?</a></div><button className="primary" onClick={() => onNavigate(signup ? "plans" : "dashboard")}>{signup ? "ანგარიშის შექმნა" : "შესვლა"}</button><div className="divider">ან</div><button className="secondary">G&nbsp;&nbsp; Google-ით გაგრძელება</button><p className="switch">{signup ? "უკვე გაქვთ ანგარიში?" : "ჯერ არ გაქვთ ანგარიში?"} <button onClick={() => onNavigate(signup ? "login" : "signup")}>{signup ? "შესვლა" : "რეგისტრაცია"}</button></p></div></section>
  </main>;
}

function Plans({ onNavigate }: { onNavigate: (v: View) => void }) {
  return <main className="plans"><header><div className="brand">Agento</div><span>ნაბიჯი 2 / 2</span></header><div className="plans-intro"><span className="eyebrow">14 დღე უფასოდ</span><h1>აირჩიეთ თქვენი სამუშაო ფორმატი</h1><p>შეცვალეთ ან გააუქმეთ ნებისმიერ დროს. თანხა საცდელი პერიოდის დასრულებამდე არ ჩამოგეჭრებათ.</p><div className="billing"><button className="active">თვიური</button><button>წლიური · −20%</button></div></div><section className="plan-grid">{[
    ["Solo","49","ინდივიდუალური აგენტისთვის",["1 მომხმარებელი","100 აქტიური ლიდი","ძირითადი matching"]],
    ["Pro","99","მზარდი გუნდისთვის",["3 მომხმარებელი","შეუზღუდავი ლიდები","მრავალწყაროიანი ობიექტები"]],
    ["Agency","249","სააგენტოებისთვის",["10 მომხმარებელი","როლები და მართვა","პრიორიტეტული მხარდაჭერა"]]
  ].map(([name,price,desc,items],i)=><article className={`plan ${i===1?"featured":""}`} key={name as string}>{i===1&&<span className="recommended">რეკომენდებული</span>}<h2>{name as string}</h2><p>{desc as string}</p><div className="price"><b>₾{price as string}</b><span>/ თვე</span></div><ul>{(items as string[]).map(x=><li key={x}>✓ {x}</li>)}</ul><button className={i===1?"primary":"secondary"} onClick={()=>onNavigate("dashboard")}>არჩევა</button></article>)}</section><p className="secure">🔒 უსაფრთხო გადახდა · ფასები დღგ-ს ჩათვლით · ინვოისი ელფოსტაზე</p></main>;
}

function Shell({ view, setView, children }: { view: View; setView: (v: View) => void; children: React.ReactNode }) {
  return <div className="app-shell"><aside><div className="brand">Agento</div><nav>{nav.map(n=><button key={n.id} className={view===n.id||view==="propertyDetail"&&n.id==="properties"?"active":""} onClick={()=>setView(n.id)}><span>{n.icon}</span>{n.label}{n.id==="leads"&&<em>24</em>}</button>)}<button><span>◫</span>რეკომენდაციები</button></nav><div className="profile"><span>ერ</span><div><b>ელენე</b><small>Administrator</small></div></div></aside><div className="mobile-top"><button>☰</button><div className="brand">Agento</div><span>ერ</span></div><section className="workspace">{children}</section><nav className="bottom-nav">{nav.map(n=><button key={n.id} className={view===n.id||view==="propertyDetail"&&n.id==="properties"?"active":""} onClick={()=>setView(n.id)}><span>{n.icon}</span>{n.label}</button>)}</nav></div>;
}

function Dashboard() { return <><header className="page-head"><div><h1>დილა მშვიდობისა, ელენე</h1><p>7 მოქმედება გელოდებათ დღეს</p></div><button className="primary">+ ახალი ლიდი</button></header><div className="metric-grid">{[["აქტიური ლიდები","24","+4 ამ კვირაში"],["ახალი დამთხვევები","18","6 მაღალი შესაბამისობა"],["დღეს გასაკეთებელი","7","3 ზარი · 2 შეხვედრა"],["აქტიური ობიექტები","326","12 განახლდა"]].map(x=><article className="metric" key={x[0]}><span>{x[0]}</span><b>{x[1]}</b><small>{x[2]}</small></article>)}</div><div className="dashboard-grid"><article className="panel"><h2>დღის პრიორიტეტები</h2>{["14:30 · ნინო ბერიძესთან დარეკვა","16:00 · ობიექტის ნახვა","მარიამის მოთხოვნის დაზუსტება","ანა კაპანაძის მონაცემების განახლება"].map((x,i)=><div className="task" key={x}><button>○</button><div><b>{x}</b><small>{i===0?"ახალი 91% დამთხვევა":"შეხსენება"}</small></div></div>)}</article><aside className="signals"><article><b>ობიექტების წყაროები</b><span>MyHome აქტიურია · 5 წთ წინ</span></article><article><b>გაერთიანებული ჩანაწერები</b><span>28 ობიექტი რამდენიმე წყაროდან</span></article><article className="warning"><b>ყურადღება</b><span>3 ობიექტს აქვს ფასის სხვაობა</span></article></aside></div></>; }

function LeadsPage() { return <><header className="page-head"><div><h1>ლიდები</h1><p>მართეთ მოთხოვნები და შემდეგი მოქმედებები</p></div><button className="primary">+ ახალი ლიდი</button></header><div className="filters"><button>⌕ ძიება</button><button>სტატუსი⌄</button><button>უბანი⌄</button><button>ბიუჯეტი⌄</button><button>↕ განახლება</button></div><section className="data-list">{leads.map((r,i)=><article className="data-row" key={r[0]}><div><b>{r[0]}</b><small>{r[1]}</small></div><div><b>{r[2]}</b><small>{r[3]}</small></div><span className={`status s${i}`}>{r[4]}</span><div className="next"><small>შემდეგი ნაბიჯი</small><b>{r[5]}</b></div><button className="more">•••</button></article>)}</section></>; }

function PropertiesPage({ open }: { open: () => void }) {
  return <>
    <header className="page-head properties-head"><div><h1>ობიექტები</h1><p>326 გაერთიანებული ჩანაწერი · განახლდა 5 წუთის წინ</p></div><button className="primary">+ ობიექტის დამატება</button></header>
    <section className="property-metrics">
      {[['აქტიური','298','good'],['რამდენიმე წყარო','47','purple'],['ფასის სხვაობა','12','warn'],['მოძველებული','9','bad']].map(x=><article key={x[0]}><span>{x[0]}</span><b className={x[2]}>{x[1]}</b></article>)}
    </section>
    <div className="filters property-filters"><button>⌕ მისამართი / მდებარეობა</button><button>ფასი⌄</button><button>₾/მ²⌄</button><button>ფართობი⌄</button><button>ოთახები⌄</button><button>უბანი⌄</button><button>ქალაქი⌄</button><button>ურბანი⌄</button><button>სტატუსი⌄</button><button>↕ უახლესი</button></div>
    <div className="dataset-note">ერთი ობიექტი ნაჩვენებია ერთხელ — აქტიური წყაროები გაერთიანებულია კანონიკურ ჩანაწერში.</div>
    <section className="property-table" aria-label="ობიექტების სია">
      <div className="property-table-head"><span>მისამართი / რაიონი</span><span>ფასი</span><span>ფართობი</span><span>ოთახები</span><span>₾/მ²</span><span>წყაროები</span><span>განახლება</span></div>
      {properties.map((r,i)=><button className="property-row" key={r[0]} onClick={open}>
        <span className="property-address"><b>{r[0]}</b><small>{r[1]}</small>{i===1&&<em>ფასის სხვაობა</em>}</span>
        <strong>{r[2]}</strong><span>{r[3]}</span><span>{i%2?"3":"2"}</span><span>{i===0?"1,093":"1,172"} ₾</span>
        <span className="row-sources"><i>M</i>{i===1&&<i className="alt">S2</i>}<small>{i===1?"2 წყარო":"1 წყარო"}</small></span>
        <time>{r[5]} წინ</time>
      </button>)}
    </section>
    <div className="pagination"><span>1–25 / 326</span><button>‹</button><b>1</b><button>2</button><button>3</button><span>…</span><button>14</button><button>›</button></div>
  </>;
}

function PropertyDetail({ back }: { back: () => void }) { return <><button className="back" onClick={back}>← ობიექტებზე დაბრუნება</button><header className="detail-head"><div><span className="eyebrow">კანონიკური ობიექტი · #AG-10412</span><h1>აბაშიძის ქუჩა 21</h1><p>ვაკე, თბილისი · განახლდა 18 წუთის წინ</p></div><strong>112,500 ₾</strong></header><div className="gallery"><div className="hero-image">მთავარი ფოტო</div><div>ფოტო 2</div><div>ფოტო 3</div></div><div className="detail-grid"><section className="detail-main"><article className="summary-card"><h2>ობიექტის მონაცემები</h2><div className="summary-facts"><span><b>96 მ²</b>ფართობი</span><span><b>3</b>ოთახი</span><span><b>1,172 ₾</b>ფასი / მ²</span><span><b>6 / 9</b>სართული</span></div></article><article className="discrepancy"><div><b>ფასი განსხვავდება წყაროებს შორის</b><p>Agento აჩვენებს ბოლოს განახლებულ მნიშვნელობას. შეადარეთ წყაროები გადაწყვეტილებამდე.</p></div><button>წყაროების შედარება</button></article></section><aside className="source-panel"><h2>აქტიური წყაროები</h2><div className="source-record"><span className="source-badge">M</span><div><b>MyHome</b><small>112,500 ₾ · 18 წთ წინ</small></div><button>ორიგინალი ↗</button></div><div className="source-record"><span className="source-badge second">S2</span><div><b>Source 2</b><small>118,000 ₾ · 1 სთ წინ</small></div><button>ორიგინალი ↗</button></div><p>წყაროს სპეციფიკური მონაცემები ცალკეა ნაჩვენები ერთიანი ობიექტის შეჯამებისგან.</p></aside></div></>; }

export default function Home() {
  const [view,setView]=useState<View>("properties");
  if(view==="login") return <Auth onNavigate={setView}/>;
  if(view==="signup") return <Auth signup onNavigate={setView}/>;
  if(view==="plans") return <Plans onNavigate={setView}/>;
  return <Shell view={view} setView={setView}>{view==="dashboard"?<Dashboard/>:view==="leads"?<LeadsPage/>:view==="propertyDetail"?<PropertyDetail back={()=>setView("properties")}/>:<PropertiesPage open={()=>setView("propertyDetail")}/>}</Shell>;
}
