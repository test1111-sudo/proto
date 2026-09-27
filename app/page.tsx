"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type View = "login" | "signup" | "plans" | "dashboard" | "leads" | "leadDetail" | "buyerGroups" | "recommendations" | "properties" | "propertyDetail";

const nav: { id: View; label: string; icon: string }[] = [
  { id: "dashboard", label: "მთავარი", icon: "⌂" },
  { id: "leads", label: "ლიდები", icon: "◎" },
  { id: "buyerGroups", label: "მყიდველთა ჯგუფები", icon: "◉" },
  { id: "properties", label: "ობიექტები", icon: "◇" },
  { id: "recommendations", label: "რეკომენდაციები", icon: "◫" },
];

const leads = [
  ["ნინო ბერიძე", "3 ოთახი · 80–110 მ²", "120,000 ₾", "ვაკე", "ახალი", "დღეს, 14:30"],
  ["გიორგი მაისურაძე", "2 საძინებელი · 65–90 მ²", "95,000 ₾", "საბურთალო", "აქტიური", "4 ობიექტი"],
  ["ანა კაპანაძე", "სახლი · 180+ მ²", "280,000 ₾", "წყნეთი", "ყურადღება", "განახლება"],
  ["მარიამ გელაშვილი", "3 საძინებელი · 100–140 მ²", "185,000 ₾", "ლისი", "ახალი", "91% match"],
];

type Property = { address: string; id: string; district: string; city: string; price: number; area: number; rooms: number; status: string; sources: number; updated: string; conflict?: boolean };
type BuyerGroup = { name: string; leads: number; area: string; budget: string; matches: number };

const initialBuyerGroups: BuyerGroup[] = [
  { name: "ვაკე · 3 ოთახი", leads: 12, area: "80–120 მ²", budget: "90K–160K ₾", matches: 8 },
  { name: "საბურთალო · ოჯახები", leads: 18, area: "100–160 მ²", budget: "120K–220K ₾", matches: 11 },
  { name: "საინვესტიციო", leads: 9, area: "40–80 მ²", budget: "60K–110K ₾", matches: 14 },
  { name: "კერძო სახლები", leads: 7, area: "180+ მ²", budget: "180K–350K ₾", matches: 17 },
];

const propertySeeds = [
  ["ჭავჭავაძის გამზირი 48", "ვაკე", 118000, 108, 2], ["აბაშიძის ქუჩა 21", "ვაკე", 112500, 96, 3],
  ["ფალიაშვილის ქუჩა 9", "ვაკე", 124000, 84, 2], ["წერეთლის გამზირი 72", "დიდუბე", 76000, 61, 3],
  ["ვაჟა-ფშაველას გამზირი 23", "საბურთალო", 142000, 116, 4], ["ყაზბეგის გამზირი 12", "საბურთალო", 98000, 78, 2],
  ["კოსტავას ქუჩა 68", "ვერა", 156000, 104, 3], ["მარჯანიშვილის ქუჩა 16", "ჩუღურეთი", 89000, 70, 2],
  ["წყნეთის გზატკეცილი 9", "ბაგები", 240000, 164, 5], ["ტაბიძის ქუჩა 4", "სოლოლაკი", 176000, 112, 3],
  ["გორგასლის ქუჩა 38", "ორთაჭალა", 101000, 86, 3], ["მოსაშვილის ქუჩა 7", "ვაკე", 132000, 91, 3],
] as const;

const initialProperties: Property[] = Array.from({ length: 26 }, (_, i) => {
  const seed = propertySeeds[i % propertySeeds.length];
  return { address: seed[0], district: seed[1], city: "თბილისი", price: seed[2] + Math.floor(i / 12) * 3500, area: seed[3], rooms: seed[4], id: `#AG-${10428 - i}`, status: i % 9 === 0 ? "მოძველებული" : "აქტიური", sources: i % 4 === 1 ? 2 : 1, updated: i < 3 ? `${5 + i * 7} წთ` : `${i} სთ`, conflict: i % 7 === 1 };
});

const english: Record<string,string> = {
  "მთავარი":"Dashboard","ლიდები":"Leads","მყიდველთა ჯგუფები":"Buyer groups","ობიექტები":"Properties","რეკომენდაციები":"Recommendations","კანონიკური კატალოგი":"Canonical catalog","ახალი ჩანაწერი":"New record","ლიდის დამატება":"Add lead","ობიექტის დამატება":"Add property","ჯგუფის დამატება":"Add buyer group","გაუქმება":"Cancel","დახურვა":"Close","სახელი და გვარი":"Full name","ტელეფონი":"Phone","ელფოსტა":"Email","სასურველი უბანი":"Preferred district","ბიუჯეტი":"Budget","ოთახები":"Rooms","ფართობი":"Area","მისამართი":"Address","ქალაქი":"City","უბანი":"District","ფასი (₾)":"Price (₾)","ფართობი (მ²)":"Area (m²)","სტატუსი":"Status","შენიშვნა":"Note","დამატებითი ინფორმაცია":"Additional information","აქტიური":"Active","მოძველებული":"Stale","შეჩერებული":"Paused","გაყიდული":"Sold","ყველა":"All","დალაგება":"Sort","უახლესი":"Newest","გასუფთავება":"Clear","ფასი მინ.":"Min price","ფასი მაქს.":"Max price","ფასი: ზრდადი":"Price: low to high","ფასი: კლებადი":"Price: high to low","მისამართი ან ID":"Address or ID","რამდენიმე წყარო":"Multiple sources","ფასის სხვაობა":"Price discrepancy","განახლება":"Updated","წყაროები":"Sources","ობიექტის მონაცემები":"Property data","აქტიური წყაროები":"Active sources","წყაროების შედარება":"Compare sources","ორიგინალი ↗":"Original ↗","ლიდებზე დაბრუნება":"Back to leads","ობიექტებზე დაბრუნება":"Back to properties","მოთხოვნა":"Requirements","აქტივობა":"Activity","საუკეთესო შესაბამისობები":"Best matches","ახალი შესაბამისობა":"New matches","გასაგზავნად მზად":"Ready to send","ლიდი":"Lead","ობიექტი":"Property","ნახვა":"View","გაგზავნა":"Send","ახალი ჯგუფი":"New group","რეკომენდაციების ნახვა →":"View recommendations →","მართეთ მოთხოვნები და შემდეგი მოქმედებები":"Manage requirements and next actions","მსგავსი მოთხოვნების გაერთიანებული სეგმენტები":"Segments of similar buyer requirements","ლიდებისა და ობიექტების საუკეთესო შესაბამისობები":"Best matches between leads and properties","ფილტრების გასუფთავება":"Clear filters","ობიექტები ვერ მოიძებნა":"No properties found","შეცვალეთ ან გაასუფთავეთ ფილტრები.":"Change or clear the filters.","ქართული":"English","ინგლისური":"Georgian"
};

Object.assign(english, {
  "ჯგუფის სახელი": "Group name", "მინ. ფართობი (მ²)": "Min area (m²)", "მაქს. ფართობი (მ²)": "Max area (m²)",
  "მინ. ბიუჯეტი (₾)": "Min budget (₾)", "მაქს. ბიუჯეტი (₾)": "Max budget (₾)",
  "დააფიქსირეთ მოთხოვნა და საკონტაქტო ინფორმაცია.": "Capture the requirements and contact details.",
  "დაამატეთ ობიექტის ძირითადი კანონიკური მონაცემები.": "Add the property's core canonical data.",
  "შექმენით მსგავსი მოთხოვნების მქონე მყიდველთა სეგმენტი.": "Create a segment of buyers with similar requirements.",
  "დილა მშვიდობისა, ელენე": "Good morning, Elene", "ახალი ლიდი": "New lead", "ობიექტის დამატება": "Add property",
  "ძიება": "Search", "შემდეგი ნაბიჯი": "Next step", "ახალი": "New", "ახლახან": "Just now"
});

function translatePage(enabled:boolean){document.documentElement.lang=enabled?"en":"ka";document.querySelectorAll("[data-ka]").forEach(el=>{const h=el as HTMLElement;h.textContent=enabled?h.dataset.en||h.dataset.ka||"":h.dataset.ka||""});const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){const raw=n.textContent||"";const trimmed=raw.trim();if(!trimmed)continue;if(enabled){const translated=english[trimmed];if(translated){(n.parentElement as HTMLElement)?.setAttribute("data-ka-text",trimmed);n.textContent=raw.replace(trimmed,translated)}}else{const original=(n.parentElement as HTMLElement)?.getAttribute("data-ka-text");if(original)n.textContent=raw.replace(trimmed,original)}}document.querySelectorAll("input,textarea").forEach(el=>{const input=el as HTMLInputElement;const key=input.dataset.kaPlaceholder||(input.placeholder&&Object.prototype.hasOwnProperty.call(english,input.placeholder)?input.placeholder:"");if(key){input.dataset.kaPlaceholder=key;input.placeholder=enabled?(english[key]||key):key}})}

function Field({ label, placeholder, password = false }: { label: string; placeholder: string; password?: boolean }) {
  return <label className="field"><span>{label}</span><span className="input">{password ? "••••••••" : placeholder}{password && <b>ჩვენება</b>}</span></label>;
}

function CreateModal({ kind, close, save }: { kind: "lead" | "property" | "group"; close: () => void; save: (data: FormData) => void }) {
  const isLead = kind === "lead";
  const isGroup = kind === "group";
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); save(new FormData(event.currentTarget)); }
  return <div className="modal-backdrop" role="presentation" onMouseDown={close}>
    <section className="create-modal" role="dialog" aria-modal="true" aria-labelledby="create-title" onMouseDown={e=>e.stopPropagation()}>
      <header><div><span className="eyebrow">ახალი ჩანაწერი</span><h2 id="create-title">{isLead ? "ლიდის დამატება" : isGroup ? "ჯგუფის დამატება" : "ობიექტის დამატება"}</h2><p>{isLead ? "დააფიქსირეთ მოთხოვნა და საკონტაქტო ინფორმაცია." : isGroup ? "შექმენით მსგავსი მოთხოვნების მქონე მყიდველთა სეგმენტი." : "დაამატეთ ობიექტის ძირითადი კანონიკური მონაცემები."}</p></div><button type="button" className="modal-close" onClick={close} aria-label="დახურვა">×</button></header>
      <form onSubmit={submit}>
        {isLead ? <>
          <label><span>სახელი და გვარი</span><input name="name" required placeholder="მაგ. ნინო ბერიძე" /></label>
          <div className="form-grid"><label><span>ტელეფონი</span><input name="phone" required placeholder="+995 5XX XX XX XX" /></label><label><span>ელფოსტა</span><input name="email" type="email" placeholder="name@email.com" /></label></div>
          <div className="form-grid"><label><span>სასურველი უბანი</span><select name="district"><option>ვაკე</option><option>საბურთალო</option><option>ვერა</option><option>დიდუბე</option></select></label><label><span>ბიუჯეტი</span><input name="budget" required type="number" placeholder="120000" /></label></div>
          <div className="form-grid"><label><span>ოთახები</span><select name="rooms"><option>2</option><option>3</option><option>4+</option></select></label><label><span>ფართობი</span><input name="area" placeholder="80–110 მ²" /></label></div>
        </> : isGroup ? <>
          <label><span>ჯგუფის სახელი</span><input name="name" required placeholder="მაგ. ვაკე · 3 ოთახი" /></label>
          <div className="form-grid"><label><span>უბანი</span><select name="district"><option>ვაკე</option><option>საბურთალო</option><option>ვერა</option><option>დიდუბე</option></select></label><label><span>ოთახები</span><select name="rooms"><option>2</option><option>3</option><option>4+</option></select></label></div>
          <div className="form-grid"><label><span>მინ. ფართობი (მ²)</span><input name="minArea" required type="number" placeholder="80" /></label><label><span>მაქს. ფართობი (მ²)</span><input name="maxArea" required type="number" placeholder="120" /></label></div>
          <div className="form-grid"><label><span>მინ. ბიუჯეტი (₾)</span><input name="minBudget" required type="number" placeholder="90000" /></label><label><span>მაქს. ბიუჯეტი (₾)</span><input name="maxBudget" required type="number" placeholder="160000" /></label></div>
        </> : <>
          <label><span>მისამართი</span><input name="address" required placeholder="მაგ. ჭავჭავაძის გამზირი 48" /></label>
          <div className="form-grid"><label><span>ქალაქი</span><select name="city"><option>თბილისი</option><option>ბათუმი</option><option>ქუთაისი</option></select></label><label><span>უბანი</span><select name="district"><option>ვაკე</option><option>საბურთალო</option><option>ვერა</option><option>დიდუბე</option></select></label></div>
          <div className="form-grid"><label><span>ფასი (₾)</span><input name="price" required type="number" placeholder="118000" /></label><label><span>ფართობი (მ²)</span><input name="area" required type="number" placeholder="108" /></label></div>
          <div className="form-grid"><label><span>ოთახები</span><input name="rooms" required type="number" min="1" placeholder="3" /></label><label><span>სტატუსი</span><select name="status"><option>აქტიური</option><option>შეჩერებული</option><option>გაყიდული</option></select></label></div>
        </>}
        <label><span>შენიშვნა</span><textarea name="note" rows={3} placeholder="დამატებითი ინფორმაცია" /></label>
        <footer><button type="button" className="secondary" onClick={close}>გაუქმება</button><button className="primary" type="submit">{isLead ? "ლიდის დამატება" : isGroup ? "ჯგუფის დამატება" : "ობიექტის დამატება"}</button></footer>
      </form>
    </section>
  </div>;
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

function Shell({ view, setView, children, englishMode, toggleLanguage }: { view: View; setView: (v: View) => void; children: React.ReactNode; englishMode: boolean; toggleLanguage: () => void }) {
  const active=(id:View)=>view===id||(view==="propertyDetail"&&id==="properties")||(view==="leadDetail"&&id==="leads");
  return <div className="app-shell"><aside><div className="brand">Agento</div><nav>{nav.map(n=><button key={n.id} className={active(n.id)?"active":""} onClick={()=>setView(n.id)}><span>{n.icon}</span>{n.label}{n.id==="leads"&&<em>24</em>}</button>)}</nav><button className="language-toggle" onClick={toggleLanguage} aria-label="Change language">{englishMode ? "KA" : "EN"}</button><div className="profile"><span>ერ</span><div><b>ელენე</b><small>Administrator</small></div></div></aside><div className="mobile-top"><button>☰</button><div className="brand">Agento</div><button className="mobile-language" onClick={toggleLanguage}>{englishMode ? "KA" : "EN"}</button></div><section className="workspace">{children}</section><nav className="bottom-nav">{nav.filter(n=>n.id!=="buyerGroups").map(n=><button key={n.id} className={active(n.id)?"active":""} onClick={()=>setView(n.id)}><span>{n.icon}</span>{n.label}</button>)}</nav></div>;
}

function Dashboard({ addLead }: { addLead: () => void }) { return <><header className="page-head"><div><h1>დილა მშვიდობისა, ელენე</h1><p>7 მოქმედება გელოდებათ დღეს</p></div><button className="primary" onClick={addLead}>+ ახალი ლიდი</button></header><div className="metric-grid">{[["აქტიური ლიდები","24","+4 ამ კვირაში"],["ახალი დამთხვევები","18","6 მაღალი შესაბამისობა"],["დღეს გასაკეთებელი","7","3 ზარი · 2 შეხვედრა"],["აქტიური ობიექტები","326","12 განახლდა"]].map(x=><article className="metric" key={x[0]}><span>{x[0]}</span><b>{x[1]}</b><small>{x[2]}</small></article>)}</div><div className="dashboard-grid"><article className="panel"><h2>დღის პრიორიტეტები</h2>{["14:30 · ნინო ბერიძესთან დარეკვა","16:00 · ობიექტის ნახვა","მარიამის მოთხოვნის დაზუსტება","ანა კაპანაძის მონაცემების განახლება"].map((x,i)=><div className="task" key={x}><button>○</button><div><b>{x}</b><small>{i===0?"ახალი 91% დამთხვევა":"შეხსენება"}</small></div></div>)}</article><aside className="signals"><article><b>ობიექტების წყაროები</b><span>MyHome აქტიურია · 5 წთ წინ</span></article><article><b>გაერთიანებული ჩანაწერები</b><span>28 ობიექტი რამდენიმე წყაროდან</span></article><article className="warning"><b>ყურადღება</b><span>3 ობიექტს აქვს ფასის სხვაობა</span></article></aside></div></>; }

function LeadsPage({ addLead, items, open }: { addLead: () => void; items: string[][]; open: () => void }) { return <><header className="page-head"><div><h1>ლიდები</h1><p>მართეთ მოთხოვნები და შემდეგი მოქმედებები</p></div><button className="primary" onClick={addLead}>+ ახალი ლიდი</button></header><div className="filters"><button>⌕ ძიება</button><button>სტატუსი⌄</button><button>უბანი⌄</button><button>ბიუჯეტი⌄</button><button>↕ განახლება</button></div><section className="data-list">{items.map((r,i)=><article className="data-row clickable-row" key={`${r[0]}-${i}`} onClick={open}><div><b>{r[0]}</b><small>{r[1]}</small></div><div><b>{r[2]}</b><small>{r[3]}</small></div><span className={`status s${i%3}`}>{r[4]}</span><div className="next"><small>შემდეგი ნაბიჯი</small><b>{r[5]}</b></div><button className="more" onClick={e=>e.stopPropagation()}>•••</button></article>)}</section></>; }

function PropertiesPage({ open, addProperty, items }: { open: () => void; addProperty: () => void; items: Property[] }) {
  const [query,setQuery]=useState(""); const [district,setDistrict]=useState("ყველა"); const [status,setStatus]=useState("ყველა"); const [rooms,setRooms]=useState("ყველა"); const [minPrice,setMinPrice]=useState(""); const [maxPrice,setMaxPrice]=useState(""); const [sort,setSort]=useState("newest"); const [page,setPage]=useState(1);
  const filtered=useMemo(()=>items.filter(x=>(!query||`${x.address} ${x.id}`.toLowerCase().includes(query.toLowerCase()))&&(district==="ყველა"||x.district===district)&&(status==="ყველა"||x.status===status)&&(rooms==="ყველა"||x.rooms===Number(rooms))&&(!minPrice||x.price>=Number(minPrice))&&(!maxPrice||x.price<=Number(maxPrice))).sort((a,b)=>sort==="priceAsc"?a.price-b.price:sort==="priceDesc"?b.price-a.price:sort==="area"?b.area-a.area:Number(b.id.slice(4))-Number(a.id.slice(4))),[items,query,district,status,rooms,minPrice,maxPrice,sort]);
  const pageCount=Math.max(1,Math.ceil(filtered.length/10)); const current=Math.min(page,pageCount); const visible=filtered.slice((current-1)*10,current*10); const reset=()=>{setQuery("");setDistrict("ყველა");setStatus("ყველა");setRooms("ყველა");setMinPrice("");setMaxPrice("");setSort("newest");setPage(1)};
  return <>
    <header className="page-head properties-head"><div><h1>ობიექტები</h1><p>{items.length} გაერთიანებული ჩანაწერი · განახლდა 5 წუთის წინ</p></div><button className="primary" onClick={addProperty}>+ ობიექტის დამატება</button></header>
    <section className="property-metrics">
      {[['აქტიური','298','good'],['რამდენიმე წყარო','47','purple'],['ფასის სხვაობა','12','warn'],['მოძველებული','9','bad']].map(x=><article key={x[0]}><span>{x[0]}</span><b className={x[2]}>{x[1]}</b></article>)}
    </section>
    <div className="property-filter-panel">
      <label className="filter-search"><span>⌕</span><input aria-label="მისამართით ან ID-ით ძიება" value={query} onChange={e=>{setQuery(e.target.value);setPage(1)}} placeholder="მისამართი ან ID" /></label>
      <label><span>ფასი მინ.</span><input type="number" value={minPrice} onChange={e=>{setMinPrice(e.target.value);setPage(1)}} placeholder="0 ₾" /></label><label><span>ფასი მაქს.</span><input type="number" value={maxPrice} onChange={e=>{setMaxPrice(e.target.value);setPage(1)}} placeholder="ნებისმიერი" /></label>
      <label><span>ოთახები</span><select value={rooms} onChange={e=>{setRooms(e.target.value);setPage(1)}}><option>ყველა</option><option>2</option><option>3</option><option>4</option><option>5</option></select></label>
      <label><span>უბანი</span><select value={district} onChange={e=>{setDistrict(e.target.value);setPage(1)}}><option>ყველა</option>{[...new Set(items.map(x=>x.district))].map(x=><option key={x}>{x}</option>)}</select></label>
      <label><span>სტატუსი</span><select value={status} onChange={e=>{setStatus(e.target.value);setPage(1)}}><option>ყველა</option><option>აქტიური</option><option>მოძველებული</option><option>შეჩერებული</option><option>გაყიდული</option></select></label>
      <label><span>დალაგება</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">უახლესი</option><option value="priceAsc">ფასი: ზრდადი</option><option value="priceDesc">ფასი: კლებადი</option><option value="area">ფართობი</option></select></label><button className="clear-filters" onClick={reset}>გასუფთავება</button>
    </div>
    <div className="dataset-note">ერთი ობიექტი ნაჩვენებია ერთხელ — აქტიური წყაროები გაერთიანებულია კანონიკურ ჩანაწერში.</div>
    <section className="property-table" aria-label="ობიექტების სია">
      <div className="property-table-head"><span>მისამართი / რაიონი</span><span>ფასი</span><span>ფართობი</span><span>ოთახები</span><span>₾/მ²</span><span>წყაროები</span><span>განახლება</span></div>
      {visible.map((r,i)=><button className="property-row" key={r.id} onClick={open}>
        <span className="property-address"><b>{r.address}</b><small>{r.id} · {r.district}</small>{r.conflict&&<em>ფასის სხვაობა</em>}</span>
        <strong>{r.price.toLocaleString("en-US")} ₾</strong><span>{r.area} მ²</span><span>{r.rooms}</span><span>{Math.round(r.price/r.area).toLocaleString("en-US")} ₾</span>
        <span className="row-sources"><i>M</i>{r.sources>1&&<i className="alt">S2</i>}<small>{r.sources} წყარო</small></span>
        <time>{r.updated} წინ</time>
      </button>)}
      {!visible.length&&<div className="empty-results"><b>ობიექტები ვერ მოიძებნა</b><span>შეცვალეთ ან გაასუფთავეთ ფილტრები.</span><button onClick={reset}>ფილტრების გასუფთავება</button></div>}
    </section>
    <div className="pagination"><span>{filtered.length?`${(current-1)*10+1}–${Math.min(current*10,filtered.length)}`:"0"} / {filtered.length}</span><button disabled={current===1} onClick={()=>setPage(current-1)}>‹</button>{Array.from({length:pageCount},(_,i)=>i+1).map(n=><button key={n} className={n===current?"current":""} onClick={()=>setPage(n)}>{n}</button>)}<button disabled={current===pageCount} onClick={()=>setPage(current+1)}>›</button></div>
  </>;
}

function BuyerGroups({ items, addGroup, openRecommendations }: { items: BuyerGroup[]; addGroup: () => void; openRecommendations: () => void }) { return <><header className="page-head"><div><h1>მყიდველთა ჯგუფები</h1><p>მსგავსი მოთხოვნების გაერთიანებული სეგმენტები</p></div><button className="primary" onClick={addGroup}>+ ახალი ჯგუფი</button></header><section className="group-grid">{items.map((g,i)=><article className="group-card" key={`${g.name}-${i}`}><div className="group-icon">{i+1}</div><span className="status">აქტიური</span><h2>{g.name}</h2><p>{g.area} · {g.budget}</p><div><b>{g.leads} ლიდი</b><span>{g.matches} ახალი შესაბამისობა</span></div><button onClick={openRecommendations}>რეკომენდაციების ნახვა →</button></article>)}</section></> }

function Recommendations({ openProperty }: { openProperty: () => void }) { const matches=[["ნინო ბერიძე","ჭავჭავაძის გამზირი 48","94%","118,000 ₾"],["მარიამ გელაშვილი","ფალიაშვილის ქუჩა 9","91%","124,000 ₾"],["გიორგი მაისურაძე","ყაზბეგის გამზირი 12","88%","98,000 ₾"],["ანა კაპანაძე","წყნეთის გზატკეცილი 9","86%","240,000 ₾"]];return <><header className="page-head"><div><h1>რეკომენდაციები</h1><p>ლიდებისა და ობიექტების საუკეთესო შესაბამისობები</p></div><button className="secondary">↻ განახლება</button></header><div className="recommendation-summary"><article><b>18</b><span>ახალი შესაბამისობა</span></article><article><b>6</b><span>90%+ შესაბამისობა</span></article><article><b>4</b><span>გასაგზავნად მზად</span></article></div><section className="match-list">{matches.map((m,i)=><article key={m[0]}><div className="match-score">{m[2]}</div><div><span>ლიდი</span><b>{m[0]}</b><small>{i%2?"3 ოთახი · ვაკე":"2–3 ოთახი · თბილისი"}</small></div><div className="match-arrow">→</div><div><span>ობიექტი</span><b>{m[1]}</b><small>{m[3]} · განახლებულია დღეს</small></div><div className="match-actions"><button className="secondary" onClick={openProperty}>ნახვა</button><button className="primary">გაგზავნა</button></div></article>)}</section></> }

function LeadDetail({ back, openProperty }: { back: () => void; openProperty: () => void }) { return <><button className="back" onClick={back}>← ლიდებზე დაბრუნება</button><header className="detail-head"><div><span className="eyebrow">აქტიური ლიდი · #LD-0241</span><h1>ნინო ბერიძე</h1><p>+995 599 12 34 56 · nino@example.com</p></div><button className="primary">+ მოქმედების დამატება</button></header><section className="lead-detail-grid"><div className="detail-main"><article className="summary-card"><h2>მოთხოვნა</h2><div className="summary-facts"><span><b>120,000 ₾</b>მაქს. ბიუჯეტი</span><span><b>3</b>ოთახი</span><span><b>80–110 მ²</b>ფართობი</span><span><b>ვაკე</b>უბანი</span></div></article><article className="panel compact"><h2>აქტივობა</h2>{["დღეს, 14:30 · დასარეკია","გუშინ · გაეგზავნა 3 ობიექტი","12 სექტემბერი · მოთხოვნა განახლდა"].map(x=><div className="timeline-item" key={x}><i></i><span>{x}</span></div>)}</article></div><aside className="lead-matches"><div><h2>საუკეთესო შესაბამისობები</h2><span>3 ობიექტი</span></div>{[["94%","ჭავჭავაძის გამზირი 48","118,000 ₾"],["91%","ფალიაშვილის ქუჩა 9","124,000 ₾"],["88%","ყაზბეგის გამზირი 12","98,000 ₾"]].map(x=><button key={x[1]} onClick={openProperty}><strong>{x[0]}</strong><span><b>{x[1]}</b><small>{x[2]}</small></span><em>→</em></button>)}</aside></section></> }

function PropertyDetail({ back }: { back: () => void }) { return <><button className="back" onClick={back}>← ობიექტებზე დაბრუნება</button><header className="detail-head"><div><span className="eyebrow">კანონიკური ობიექტი · #AG-10412</span><h1>აბაშიძის ქუჩა 21</h1><p>ვაკე, თბილისი · განახლდა 18 წუთის წინ</p></div><strong>112,500 ₾</strong></header><div className="gallery"><div className="hero-image">მთავარი ფოტო</div><div>ფოტო 2</div><div>ფოტო 3</div></div><div className="detail-grid"><section className="detail-main"><article className="summary-card"><h2>ობიექტის მონაცემები</h2><div className="summary-facts"><span><b>96 მ²</b>ფართობი</span><span><b>3</b>ოთახი</span><span><b>1,172 ₾</b>ფასი / მ²</span><span><b>6 / 9</b>სართული</span></div></article><article className="discrepancy"><div><b>ფასი განსხვავდება წყაროებს შორის</b><p>Agento აჩვენებს ბოლოს განახლებულ მნიშვნელობას. შეადარეთ წყაროები გადაწყვეტილებამდე.</p></div><button>წყაროების შედარება</button></article></section><aside className="source-panel"><h2>აქტიური წყაროები</h2><div className="source-record"><span className="source-badge">M</span><div><b>MyHome</b><small>112,500 ₾ · 18 წთ წინ</small></div><button>ორიგინალი ↗</button></div><div className="source-record"><span className="source-badge second">S2</span><div><b>Source 2</b><small>118,000 ₾ · 1 სთ წინ</small></div><button>ორიგინალი ↗</button></div><p>წყაროს სპეციფიკური მონაცემები ცალკეა ნაჩვენები ერთიანი ობიექტის შეჯამებისგან.</p></aside></div></>; }

export default function Home() {
  const [view,setView]=useState<View>("properties");
  const [modal,setModal]=useState<"lead"|"property"|"group"|null>(null); const [leadItems,setLeadItems]=useState(leads); const [propertyItems,setPropertyItems]=useState(initialProperties); const [groupItems,setGroupItems]=useState(initialBuyerGroups); const [toast,setToast]=useState(""); const [englishMode,setEnglishMode]=useState(false);
  useEffect(()=>{translatePage(englishMode)},[englishMode,view,modal,leadItems,propertyItems,groupItems]);
  function save(data:FormData){if(modal==="lead"){setLeadItems(x=>[[String(data.get("name")),`${data.get("rooms")} ოთახი · ${data.get("area")||"ფართობი არ არის მითითებული"}`,`${Number(data.get("budget")).toLocaleString("en-US")} ₾`,String(data.get("district")),"ახალი","ახლახან"],...x]);setView("leads");setToast("ლიდი წარმატებით დაემატა")}else if(modal==="property"){setPropertyItems(x=>[{address:String(data.get("address")),id:`#AG-${10500+x.length}`,district:String(data.get("district")),city:String(data.get("city")),price:Number(data.get("price")),area:Number(data.get("area")),rooms:Number(data.get("rooms")),status:String(data.get("status")),sources:1,updated:"ახლახან"},...x]);setView("properties");setToast("ობიექტი წარმატებით დაემატა")}else if(modal==="group"){setGroupItems(x=>[{name:String(data.get("name")),leads:0,area:`${data.get("minArea")}–${data.get("maxArea")} მ²`,budget:`${Number(data.get("minBudget"))/1000}K–${Number(data.get("maxBudget"))/1000}K ₾`,matches:0},...x]);setView("buyerGroups");setToast("ჯგუფი წარმატებით დაემატა")}setModal(null);setTimeout(()=>setToast(""),2600)}
  if(view==="login") return <Auth onNavigate={setView}/>;
  if(view==="signup") return <Auth signup onNavigate={setView}/>;
  if(view==="plans") return <Plans onNavigate={setView}/>;
  return <>{<Shell view={view} setView={setView} englishMode={englishMode} toggleLanguage={()=>setEnglishMode(x=>!x)}>{view==="dashboard"?<Dashboard addLead={()=>setModal("lead")}/>:view==="leads"?<LeadsPage items={leadItems} addLead={()=>setModal("lead")} open={()=>setView("leadDetail")}/>:view==="leadDetail"?<LeadDetail back={()=>setView("leads")} openProperty={()=>setView("propertyDetail")}/>:view==="buyerGroups"?<BuyerGroups items={groupItems} addGroup={()=>setModal("group")} openRecommendations={()=>setView("recommendations")}/>:view==="recommendations"?<Recommendations openProperty={()=>setView("propertyDetail")}/>:view==="propertyDetail"?<PropertyDetail back={()=>setView("properties")}/>:<PropertiesPage items={propertyItems} addProperty={()=>setModal("property")} open={()=>setView("propertyDetail")}/>}</Shell>}{modal&&<CreateModal kind={modal} close={()=>setModal(null)} save={save}/>} {toast&&<div className="toast" role="status">✓ {toast}</div>}</>;
}
