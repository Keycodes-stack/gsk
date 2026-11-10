/* glass on/off: classic look = the original design without the glass layer.
   Saved in localStorage, sessionStorage and window.name so it survives reloads even where storage is blocked. */
(function(){
 const get=()=>{let v='';const m=/(?:^|;)rd-skin=(\w+)/.exec(window.name||'');if(m)v=m[1];if(!v)try{v=sessionStorage.getItem('rd-skin')||''}catch(e){}if(!v)try{v=localStorage.getItem('rd-skin')||''}catch(e){}return v};
 const set=v=>{try{localStorage.setItem('rd-skin',v)}catch(e){}try{sessionStorage.setItem('rd-skin',v)}catch(e){}try{window.name=(window.name||'').replace(/(?:^|;)rd-skin=\w+/g,'')+';rd-skin='+v}catch(e){}};
 const apply=c=>{const g=document.getElementById('gsk-glass');if(c){document.documentElement.dataset.skin='classic';if(g)g.disabled=true}else{delete document.documentElement.dataset.skin;if(g)g.disabled=false}};
 apply(get()==='classic');
 document.addEventListener('click',e=>{const b=e.target.closest('button[data-skin]');if(!b)return;e.preventDefault();e.stopPropagation();
  const toClassic=document.documentElement.dataset.skin!=='classic';set(toClassic?'classic':'glass');apply(toClassic);
  if(window.__renderAll)window.__renderAll();
  const d=document.getElementById('drawer');if(d&&d.classList.contains('on')&&window.__W&&window.__V){const t=window.__D.byId(window.__V.S.openId);if(t){d.innerHTML=window.__W.drawerHTML(t)}}
 },true);
 // keep it applied if anything re-enables the glass sheet
 setInterval(()=>{const c=document.documentElement.dataset.skin==='classic',g=document.getElementById('gsk-glass');if(g&&g.disabled!==c)g.disabled=c},500);
})();

/* ===== original approved design scripts ===== */
(function(){
'use strict';
/* ===== helpers ===== */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const IC={home:'M3 11l9-8 9 8M5 10v10h14V10',search:'M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.5-4.5',list:'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',board:'M4 4h5v16H4zM10 4h5v10h-5zM16 4h5v13h-5z',roadmap:'M3 5h10v3H3zM8 11h13v3H8zM5 17h9v3H5z',radar:'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7a5 5 0 100 10 5 5 0 000-10zM12 12l6-6',db:'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',clip:'M6 3h12v18l-6-4-6 4z',chart:'M4 20V10M10 20V4M16 20v-8M22 20H2',plus:'M12 5v14M5 12h14',x:'M6 6l12 12M18 6L6 18',check:'M5 12l5 5 9-10',flag:'M5 21V4M5 4h11l-2 4 2 4H5',bell:'M6 16V11a6 6 0 1112 0v5l2 2H4zM10 21h4',chev:'M9 6l6 6-6 6',down:'M6 9l6 6 6-6',spark:'M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z',send:'M5 12h14M13 6l6 6-6 6',clipb:'M20 11l-8.5 8.5a5 5 0 01-7-7L13 4a3.5 3.5 0 015 5l-8.5 8.5a2 2 0 01-3-3L14 7',link:'M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1',file:'M6 3h8l5 5v13H6zM14 3v5h5',shield:'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',more:'M5 12h.01M12 12h.01M19 12h.01',sun:'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19',ext:'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',copy:'M9 9h11v11H9zM5 15V4h11',upload:'M12 16V4M7 9l5-5 5 5M4 20h16',users:'M9 11a3 3 0 100-6 3 3 0 000 6zM3 20a6 6 0 0112 0M17 11a3 3 0 100-6M21 20a6 6 0 00-4-5.6',clock:'M12 4a8 8 0 100 16 8 8 0 000-16zM12 8v4l3 2',layers:'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',menu:'M4 7h16M4 12h16M4 17h16',up:'M6 15l6-6 6 6',edit:'M4 20h4l11-11-4-4L4 16zM13 7l4 4'};
const ic=(n,s)=>`<svg class="ic" viewBox="0 0 24 24"${s?` style="width:${s}px;height:${s}px"`:''}><path d="${IC[n]||''}"/></svg>`;
const hash=s=>{let h=7;for(const c of String(s))h=(h*31+c.charCodeAt(0))>>>0;return h};
const P={amina:{n:'Jeff Carter',i:'JC',c:'#5546E0',r:'Lead researcher'},sara:{n:'Sara Malik',i:'SM',c:'#0A8CA6',r:'Researcher'},james:{n:'James Lee',i:'JL',c:'#C0701A',r:'Researcher'},mei:{n:'Mei Chen',i:'MC',c:'#B03A75',r:'Researcher'},tomas:{n:'Tomás Rivera',i:'TR',c:'#2A8E57',r:'Dept. reviewer (Finance)'},priya:{n:'Dr. Priya Nair',i:'PN',c:'#14152B',r:'VP, R&D'}};
const av=(id,lg)=>`<span class="av${lg?' lg':''}" style="--c:${P[id].c}" data-tip="${esc(P[id].n)} · ${esc(P[id].r)}">${P[id].i}</span>`;
const SECT={Materials:'var(--s-mat)',Thermal:'var(--s-the)','Supply chain':'var(--s-sup)',Compliance:'var(--s-com)',Sustainability:'var(--s-sus)',Energy:'var(--s-ene)'};
const SECTS=Object.keys(SECT);
const STAGES=['Discovery','Validation','Business case','Decided'];
const sk=s=>s.split(' ')[0];

/* ===== sources ===== */
const SRC={
1:{t:'Garnet-type LLZO composites with polymer interlayers: interfacial resistance below 40 Ω·cm²',ty:'Journal',v:'Journal of Power Sources',y:2025,rel:97,ok:1,p:'…interfacial area-specific resistance fell from 214 to 36 Ω·cm² «after introducing a 2 µm PEO-LiTFSI interlayer», with stable cycling over 500 h at 0.5 mA·cm⁻².'},
2:{t:'US 12,300,418 B2 · Gradient garnet–polymer composite electrolyte architecture',ty:'Patent',v:'Corvane Energy, Inc.',y:2025,rel:94,ok:1,p:'A composite electrolyte comprising a garnet-type ceramic phase «having a graded volume fraction from 85% at the cathode face to 40% at the anode face», and a polymer interlayer…'},
3:{t:'Thermal runaway propagation in 21700 pack modules under immersion cooling',ty:'Journal',v:'Applied Thermal Engineering',y:2024,rel:96,ok:1,p:'«Dielectric fluid immersion delayed cell-to-cell propagation to 142 s versus 38 s for cold-plate cooling», at a 12% lower pack-level energy density.'},
4:{t:'Immersion cooling adoption doubles across EV pack programmes',ty:'Web',v:'Energy Storage Weekly',y:2026,rel:82,ok:1,p:'OEM programmes specifying single-phase immersion «rose from 11 to 23 in twelve months». One supplier claims a threefold gain in heat flux for two-phase plates.'},
5:{t:'MIL-STD-810H, Method 501.7: High temperature',ty:'Standard',v:'US Department of Defense',y:2019,rel:88,ok:1,p:'Test items shall be exposed to «induced conditions up to 71 °C for seven 24-hour cycles» unless the life-cycle profile specifies otherwise.'},
6:{t:'Techno-economic analysis of sodium-ion cells at 20 GWh scale',ty:'Journal',v:'Joule',y:2025,rel:95,ok:1,p:'«Cell cost of $48 per kWh at 20 GWh is achievable if hard-carbon precursor cost remains below $2.1 per kg», with cathode cost contributing 31% of the total.'},
7:{t:'Hard-carbon precursor supply outlook 2026–2030',ty:'Industry report',v:'Meridian Minerals Outlook',y:2026,rel:90,ok:1,p:'«Three producers account for 71% of qualified hard-carbon capacity.» Quoted lead times have shortened to under 10 weeks for contract volumes.'},
8:{t:'Thermal lab report TL-2291: prototype cold plate characterisation',ty:'Internal',v:'Halden Materials',y:2026,rel:93,ok:1,p:'Prototype plate «achieved 0.082 K/W at 8 L/min», 9% below the Gate 2 target of 0.090 K/W.'},
9:{t:'Expert interview notes: Dr. K. Okafor, thermal systems',ty:'Note',v:'Halden Materials',y:2026,rel:79,ok:1,p:'In practice «qualified hard carbon is still quoted at 14 to 16 weeks» by most suppliers, and yield on 100 cm² LLZO sheets «has not exceeded 67% in our trials».'},
10:{t:'Phase-change composites for battery thermal interfaces: a review',ty:'Journal',v:'Renewable & Sustainable Energy Reviews',y:2024,rel:86,ok:1,p:'Paraffin–graphite composites reached 4.8 W/m·K, but «leakage above 85 °C remains unresolved in six of nine studies».'},
11:{t:'WO 2025/118432 A1 · Two-phase microchannel cold plate',ty:'Patent',v:'Thermaris GmbH',y:2025,rel:84,ok:1,p:'A cold plate with microchannels of 90 µm width, «providing up to 1.8 times the heat flux of a single-phase reference plate» at equal pressure drop.'},
12:{t:'UN Manual of Tests and Criteria, Section 38.3',ty:'Standard',v:'United Nations',y:2023,rel:90,ok:1,p:'Cells and batteries «shall be subjected to tests T.1 to T.8» before transport, including thermal test and impact.'}
};
const TYI={Journal:'file',Patent:'shield',Web:'link',Standard:'layers',Internal:'db','Industry report':'chart',Note:'edit'};

/* ===== answers (hero research) ===== */
const ANS={
cooling:{title:'Immersion vs cold-plate cooling for 21700 modules',acc:92,
 html:`Single-phase immersion cooling is now the leading option for high-density 21700 pack modules, but it gives up about 12% of pack-level energy density in return for much slower thermal-runaway propagation. {v|In module-level tests, dielectric immersion delayed cell-to-cell propagation to 142 s versus 38 s for a cold-plate baseline|c1}[3]. Adoption is accelerating: {v|OEM programmes specifying single-phase immersion rose from 11 to 23 in twelve months|c2}[4].<br><br>Our own data points the same way for conventional plates. {v|The prototype cold plate reached 0.082 K/W at 8 L/min|c3}[8], which is 9% under the Gate 2 target. Two-phase microchannel designs look promising[11], and {d|one supplier claims a threefold improvement in heat flux|c4}[4][11], although the supplier's own filing supports 1.8×. Finally, {u|about a third of programmes are expected to move to two-phase cooling by 2028|c5}, a figure that appears in one trade brief with no primary source.`,
 cl:{c1:{g:'v',s:[3],n:'Confirmed by the peer-reviewed module test. Both models retrieved the same passage.'},c2:{g:'v',s:[4],n:'Trade press figure, dated 2026. Corroborated by a second web source retrieved by Perplexity Sonar.'},c3:{g:'v',s:[8],n:'Internal lab report TL-2291, signed off by the thermal lab lead.'},c4:{g:'d',s:[4,11],n:'Two sources disagree. The supplier press claim says 3×, the supplier\'s own patent filing supports 1.8×.'},c5:{g:'u',s:[4],n:'No primary source. The only mention is a forecast in one trade brief.'}},
 panel:[{m:'Perplexity Sonar',r:'Live web research and citations',v:'Agrees · immersion preferred',vc:'ok',cf:91,pts:['Retrieved four independent sources on propagation delay','Adoption data is recent (2026) and from trade press','Flags the 3× heat-flux claim as supplier-sourced'],ci:[3,4,11]},{m:'Gemini',r:'Reasoning and synthesis',v:'Agrees, with a cost caveat',vc:'warn',cf:88,pts:['The 12% energy-density penalty is the binding constraint','Cold plates stay cheaper below 4 kWh modules','Recommends a hybrid approach for the mixed fleet'],ci:[3,8,11]}],
 dis:'Perplexity ranks immersion first on safety evidence alone. Gemini weighs the 12% energy-density penalty and recommends keeping cold plates for modules under 4 kWh. Both agree the 3× heat-flux claim needs a primary source before it enters the business case.',
 next:'Advance to Business case with a hybrid recommendation, and request the supplier test report for the 3× claim.',
 fups:['Compare cost per module across the three options','Which suppliers qualify dielectric fluids?','Cite the standards for thermal propagation tests'],
 apps:['EV battery packs (21700)','Stationary storage cabinets','Data-centre UPS racks','Marine propulsion modules'],
 ch:{t1:'Propagation delay (s)',l1:['Cold plate','Hybrid','Immersion'],v1:[38,96,142],t2:'OEM programmes using immersion',l2:["Q4 '25","Q1 '26","Q2 '26","Q3 '26"],v2:[11,14,18,23]},
 lens:{rd:{h:'Immersion wins on safety margin, cold plates win on density',b:['Propagation delay rises from 38 s to 142 s [3]','Prototype plate at 0.082 K/W gives headroom against the 0.090 target [8]','Fluid compatibility with cell vents still needs a 500 h soak test'],c:['Cost per module ($)',['Cold plate','Hybrid','Immersion'],[410,470,560]]},fin:{h:'Immersion adds about $150 per module, offset by lower warranty exposure',b:['Cold plate $410, hybrid $470, immersion $560 per module','Warranty reserve falls 22% in the immersion case','Payback of 2.6 years above 4 kWh module size'],c:['Total cost of ownership ($/module, 5 yr)',['Cold plate','Hybrid','Immersion'],[980,905,940]]},mkt:{h:'Safety messaging resonates with fleet and aviation buyers',b:['Programmes citing immersion doubled in a year [4]','Competitors lead on energy density, not safety','Hybrid positioning keeps both stories open'],c:['Segment fit score',['Fleet','Aviation','Marine','Consumer'],[86,81,67,38]]},leg:{h:'Dielectric fluid needs REACH registration for EU sales',b:['Fluid supplier holds registration for 3 of 4 candidates','Transport classification unchanged under UN 38.3 [12]','No blocking patents found on single-phase immersion'],c:['Risk by area (0–10)',['Fluids','Patents','Transport','Disposal'],[5,2,3,4]]}},
 cm:[['sara','Added the supplier filing, so the 3× claim now shows as disputed. Can someone chase the test report?','2h'],['priya','Hybrid recommendation is what I need for the Gate 2 review. @Sara please confirm the sub-4 kWh cost split.','1h']]},
electrolyte:{title:'Garnet LLZO composite electrolyte with polymer interlayer',acc:89,
 html:`Garnet-type LLZO composites with a polymer interlayer are technically credible, and the main open question is freedom to operate. {v|Introducing a 2 µm PEO-LiTFSI interlayer reduced interfacial resistance from 214 to 36 Ω·cm²|c1}[1]. {v|Corvane Energy holds a coordinated fence of five filings covering composition, gradient architecture, electrode integration and manufacturing|c2}[2], so a single design-around is unlikely to be enough.<br><br>Manufacturability is the weaker link. {d|Pilot-scale yield for sheets above 100 cm² is reported at 82%|c3}[1][2], although two independent groups measured 61–67%[9]. Separately, {u|a third of programmes have already moved to sulfide hybrids|c4}, a statement found in one industry brief with no confirming primary source.`,
 cl:{c1:{g:'v',s:[1],n:'Peer-reviewed result with raw data in the supplement. Retrieved by both models.'},c2:{g:'v',s:[2],n:'Four of five filings verified against the patent register. The fifth is a pending application.'},c3:{g:'d',s:[1,9],n:'Two sources disagree. The 82% figure is a best-run result; internal expert notes put sustained yield at 61–67%.'},c4:{g:'u',s:[9],n:'Single industry brief. No primary source or dataset behind the figure.'}},
 panel:[{m:'Perplexity Sonar',r:'Live web research and citations',v:'Agrees · FTO risk high',vc:'ok',cf:90,pts:['Confirms the interlayer result across two journals','Maps the five-filing fence to composition and process claims','Quotes 82% yield from the headline paper'],ci:[1,2]},{m:'Gemini',r:'Reasoning and synthesis',v:'Disagrees on yield',vc:'warn',cf:84,pts:['Treats 82% as a best run, not a planning number','Uses 61–67% from expert notes for the cost model','Recommends licensing talks before Gate 3'],ci:[1,2,9]}],
 dis:'The models split on manufacturing yield. Perplexity repeats the 82% from the headline paper, while Gemini plans on 61–67% from the expert interview. The yield assumption moves unit cost by about $9 per kWh, so a human should choose which one the business case uses.',
 next:'Send the yield question to Dr. Okafor, then advance to Business case using the 61–67% planning range.',
 fups:['Which Corvane claims are most exposed to design-around?','Compare sulfide hybrids on cost and yield','List licensing options for the gradient architecture'],
 apps:['eVTOL and aviation packs','Defence portable power','Marine propulsion modules','Long-horizon grid storage'],
 ch:{t1:'Interfacial resistance (Ω·cm²)',l1:['Baseline','0.5 µm','1 µm','2 µm','4 µm'],v1:[214,120,71,36,41],t2:'Reported yield by group (%)',l2:['Group A','Group B','Group C','Lab trial','Pilot'],v2:[82,67,61,64,66]},
 lens:{rd:{h:'Feasible in 18–24 months if the 2 µm interlayer holds at scale',b:['Interfacial resistance 214 → 36 Ω·cm² [1]','Yield on sheets above 100 cm² is the gating risk [9]','Dependencies: dry-room capacity and LLZO powder qualification'],c:['Interfacial resistance (Ω·cm²)',['Baseline','0.5 µm','1 µm','2 µm','4 µm'],[214,120,71,36,41]]},fin:{h:'Unit cost $61 per kWh at pilot scale, $38 at 5 GWh',b:['Ceramic powder is 44% of the bill of materials','Yield loss adds $9 per kWh at 65% yield','Payback of 3.4 years against the sulfide baseline'],c:['Cost curve ($/kWh)',['Pilot','1 GWh','5 GWh','Target'],[61,49,38,40]]},mkt:{h:'Premium segments first: aviation and defence',b:['Buyers in safety-critical packs pay about 18% more','Competitor claims centre on energy density, not safety','The window narrows as sulfide hybrids mature'],c:['Segment fit score',['Aviation','Defence','Marine','Consumer'],[88,82,64,31]]},leg:{h:'High freedom-to-operate exposure on composition claims',b:['Corvane Energy five-filing fence [2]','Design-around on gradient architecture is only partly effective','Recommend licensing talks before Gate 3'],c:['Risk by claim family (0–10)',['Composition','Architecture','Integration','Process'],[9,7,5,3]]}},
 cm:[['amina','Yield is the open point. I used 61–67% from the Okafor interview. @James can you pull the trial raw data?','3h'],['james','Raw data attached. Best sustained run was 67%.','1h']]},
sodium:{title:'Sodium-ion supply chain and cost at 20 GWh',acc:90,
 html:`Sodium-ion cells can reach roughly $48 per kWh at 20 GWh, but the result depends on hard-carbon precursor staying cheap[6]. {v|Cell cost of $48 per kWh at 20 GWh holds only while precursor cost stays below $2.1 per kg|c1}[6]. Supply is concentrated: {v|three producers hold 71% of qualified hard-carbon capacity|c2}[7].<br><br>Delivery risk is where sources diverge. {d|Lead times for qualified hard carbon have fallen below ten weeks|c3}[7][9], yet our expert interview puts typical quotes at 14–16 weeks. {u|Two new plants in Southeast Asia will double capacity by Q3 2027|c4}, which is mentioned in a single press release.`,
 cl:{c1:{g:'v',s:[6],n:'Peer-reviewed techno-economic model with disclosed assumptions.'},c2:{g:'v',s:[7],n:'Industry report with named producers and capacity table.'},c3:{g:'d',s:[7,9],n:'Two sources disagree. The industry report quotes contract volumes, the expert quotes spot orders.'},c4:{g:'u',s:[7],n:'Single press release, no filing or permit found.'}},
 panel:[{m:'Perplexity Sonar',r:'Live web research and citations',v:'Agrees · cost case holds',vc:'ok',cf:93,pts:['Cost model confirmed against the published analysis','Supply concentration cross-checked with two reports','Quotes lead times for contract volumes'],ci:[6,7]},{m:'Gemini',r:'Reasoning and synthesis',v:'Flags supply concentration',vc:'warn',cf:87,pts:['Single-source risk outweighs the cost advantage','Uses the 14–16 week lead time for spot orders','Suggests dual-sourcing before committing volume'],ci:[6,7,9]}],
 dis:'Both models accept the $48 per kWh model. They differ on lead time: Perplexity uses the under-ten-week contract figure, Gemini uses the 14–16 weeks from the expert interview. Both agree dual sourcing is needed.',
 next:'Approve the business case with a dual-sourcing condition and a lead-time sensitivity range of 10–16 weeks.',
 fups:['Model cost at 5, 10 and 20 GWh','Which producers could be second source?','Show lead-time sensitivity on launch date'],
 apps:['Stationary storage','Two-wheeler and micro-mobility','Backup power for telecom','Low-cost urban EV'],
 ch:{t1:'Cell cost by scale ($/kWh)',l1:['1 GWh','5 GWh','10 GWh','20 GWh'],v1:[83,64,54,48],t2:'Hard-carbon capacity share (%)',l2:['Producer A','Producer B','Producer C','Others'],v2:[34,22,15,29]},
 lens:{rd:{h:'Cell design is mature, precursor qualification is the open item',b:['Cathode contributes 31% of cell cost [6]','Hard-carbon qualification takes two cycles','Cycle life target of 4,000 cycles met in lab cells'],c:['Cost by component ($/kWh)',['Cathode','Anode','Electrolyte','Other'],[15,11,7,15]]},fin:{h:'$48 per kWh at 20 GWh, margin positive from year three',b:['Break-even at precursor cost of $2.1 per kg [6]','Gross margin of 19% at target scale','Capex of $62M per GWh in the base case'],c:['Gross margin by year (%)',['Y1','Y2','Y3','Y4'],[-6,4,12,19]]},mkt:{h:'Best fit is stationary storage and low-cost urban mobility',b:['Cost beats LFP below $52 per kWh','Cold-weather performance is a differentiator','Three buyers signalled interest in volume contracts'],c:['Segment fit score',['Stationary','Telecom','Two-wheeler','Urban EV'],[91,78,74,62]]},leg:{h:'Low IP risk, moderate trade-compliance exposure',b:['No blocking patents on the base chemistry','Export controls on two precursors need review','Origin rules affect EU incentive eligibility'],c:['Risk by area (0–10)',['IP','Export','Origin','Transport'],[2,6,5,3]]}},
 cm:[['tomas','Margin model is signed off. Supply concentration is my only open concern.','5h'],['priya','Approving once dual sourcing is written into the conditions. @Tomás please add it.','30m']]}
};
/* ===== tasks ===== */
const T=[
{id:'t101',code:'R-101',title:'Garnet LLZO composite electrolyte with polymer interlayer',sector:'Materials',stage:'Validation',owner:'amina',prog:68,pri:'High',due:'Dec 12',acc:89,rag:'a',status:'review',s:0,e:3.2,deps:[],src:[1,2,9,10,5],ans:'electrolyte'},
{id:'t102',code:'R-102',title:'Immersion vs cold-plate cooling for 21700 modules',sector:'Thermal',stage:'Validation',owner:'sara',prog:54,pri:'High',due:'Dec 19',acc:92,rag:'g',status:'running',s:.3,e:3.6,deps:[],src:[3,4,8,11,5,9],ans:'cooling'},
{id:'t103',code:'R-103',title:'Phase-change thermal interface materials',sector:'Materials',stage:'Discovery',owner:'james',prog:22,pri:'Medium',due:'Jan 16',acc:81,rag:'g',status:'running',s:.8,e:4.2,deps:[],src:[10,9,8]},
{id:'t104',code:'R-104',title:'Sodium-ion supply chain and cost at 20 GWh',sector:'Supply chain',stage:'Business case',owner:'tomas',prog:86,pri:'High',due:'Nov 28',acc:90,rag:'g',status:'vp',s:0,e:2.4,deps:[],src:[6,7,9,8],ans:'sodium'},
{id:'t105',code:'R-105',title:'Graphene-enhanced heat spreaders',sector:'Thermal',stage:'Discovery',owner:'mei',prog:15,pri:'Low',due:'Feb 6',acc:78,rag:'a',status:'running',s:1.5,e:5,deps:[],src:[10,8,3]},
{id:'t106',code:'R-106',title:'UN 38.3 and MIL-STD-810H compliance pathway',sector:'Compliance',stage:'Business case',owner:'amina',prog:78,pri:'Medium',due:'Dec 5',acc:94,rag:'g',status:'review',s:1,e:3.4,deps:['t101'],src:[12,5,3]},
{id:'t107',code:'R-107',title:'Bio-based polyamide casing for pack enclosures',sector:'Sustainability',stage:'Decided',owner:'sara',prog:100,pri:'Medium',due:'Done',acc:96,rag:'g',status:'done',s:0,e:2,deps:[],src:[4,7]},
{id:'t108',code:'R-108',title:'Two-phase microchannel cold plates',sector:'Thermal',stage:'Discovery',owner:'james',prog:31,pri:'Medium',due:'Jan 30',acc:83,rag:'r',status:'blocked',s:1.2,e:4.8,deps:['t102'],src:[11,4,8],blk:'Waiting on supplier test report for the 3× heat-flux claim'},
{id:'t109',code:'R-109',title:'Silicon-anode binder patent landscape',sector:'Compliance',stage:'Validation',owner:'mei',prog:47,pri:'Medium',due:'Dec 22',acc:87,rag:'a',status:'review',s:.5,e:3.8,deps:[],src:[2,1,9]},
{id:'t110',code:'R-110',title:'Solar-thermal storage salts',sector:'Energy',stage:'Decided',owner:'tomas',prog:100,pri:'Low',due:'Done',acc:72,rag:'g',status:'parked',s:0,e:1.5,deps:[],src:[6,10]}
];
T.forEach(t=>{t.clips=[];t.cm=null;});
const STATUS={running:['Agents running','accent run'],review:['Ready for review','warn'],vp:['Awaiting VP approval','gold'],blocked:['Blocked','bad'],done:['Advanced','ok'],parked:['Parked','']};
const byId=id=>T.find(t=>t.id===id);

/* ===== radar signals ===== */
const RAD=[
{id:'r1',t:'Single-phase immersion goes mainstream',s:'Thermal',ring:0,pos:.3,sd:.4,cf:92,tr:'up',task:'t102',n:6},
{id:'r2',t:'Garnet LLZO polymer interlayers',s:'Materials',ring:1,pos:.5,sd:.2,cf:84,tr:'up',task:'t101',n:5},
{id:'r3',t:'Hard-carbon supply concentration',s:'Supply chain',ring:1,pos:.35,sd:.7,cf:90,tr:'flat',task:'t104',n:4},
{id:'r4',t:'Sodium-ion at 20 GWh scale',s:'Supply chain',ring:0,pos:.7,sd:.5,cf:88,tr:'up',task:'t104',n:7},
{id:'r5',t:'Sulfide hybrid electrolytes',s:'Materials',ring:2,pos:.25,sd:.3,cf:52,tr:'up',n:3},
{id:'r6',t:'Two-phase microchannel plates',s:'Thermal',ring:2,pos:.65,sd:.8,cf:61,tr:'up',task:'t108',n:4},
{id:'r7',t:'EU Battery Regulation passport',s:'Compliance',ring:0,pos:.5,sd:.3,cf:95,tr:'flat',n:5},
{id:'r8',t:'UN 38.3 revision cycle',s:'Compliance',ring:1,pos:.2,sd:.6,cf:78,tr:'flat',task:'t106',n:3},
{id:'r9',t:'Bio-based polyamide casings',s:'Sustainability',ring:0,pos:.3,sd:.6,cf:93,tr:'up',task:'t107',n:4},
{id:'r10',t:'Recycled cathode content mandates',s:'Sustainability',ring:2,pos:.7,sd:.2,cf:66,tr:'up',n:3},
{id:'r11',t:'Solid-state pack thermal limits',s:'Energy',ring:2,pos:.45,sd:.7,cf:58,tr:'up',n:2},
{id:'r12',t:'Grid-scale iron-air storage',s:'Energy',ring:3,pos:.6,sd:.4,cf:40,tr:'flat',n:2},
{id:'r13',t:'Phase-change TIM leakage',s:'Materials',ring:2,pos:.82,sd:.5,cf:63,tr:'flat',task:'t103',n:3},
{id:'r14',t:'Graphene spreader cost curve',s:'Thermal',ring:3,pos:.3,sd:.3,cf:47,tr:'down',task:'t105',n:2},
{id:'r15',t:'Silicon-anode binder fencing',s:'Compliance',ring:1,pos:.78,sd:.7,cf:81,tr:'up',task:'t109',n:4},
{id:'r16',t:'Molten-salt storage economics',s:'Energy',ring:3,pos:.85,sd:.8,cf:35,tr:'down',task:'t110',n:2}
];
const RELS=[['r2','r5'],['r1','r6'],['r3','r4'],['r14','r1'],['r13','r2'],['r7','r8'],['r15','r2'],['r10','r9']];
const RINGS=['Act now','Pilot','Monitor','Watch'];

/* ===== sources library ===== */
const LIB=[
{id:'l1',n:'US 12,300,418 B2 — Gradient garnet–polymer electrolyte',ty:'Patent',st:'Indexed',ad:'2d',src:2},
{id:'l2',n:'Thermal interface review.pdf',ty:'PDF · 24 pp',st:'Indexed',ad:'2d',src:10},
{id:'l3',n:'energystorageweekly.com/immersion-adoption',ty:'Web',st:'Indexed',ad:'3d',src:4},
{id:'l4',n:'Expert interview — Dr. Okafor',ty:'Note',st:'Indexed',ad:'4d',src:9},
{id:'l5',n:'Joule · Sodium-ion techno-economics 2025',ty:'Journal',st:'Indexed',ad:'5d',src:6},
{id:'l6',n:'MIL-STD-810H excerpt',ty:'Standard',st:'Indexed',ad:'1w',src:5},
{id:'l7',n:'Thermal lab report TL-2291',ty:'Internal',st:'Indexed',ad:'1w',src:8},
{id:'l8',n:'Hard-carbon outlook 2026–2030',ty:'Industry report',st:'Indexed',ad:'1w',src:7}
];
const CONN=[['Google Scholar','Journals and preprints',1],['IEEE Xplore','Standards and conference papers',1],['Patent databases','USPTO, EPO, WIPO',1],['Web and news','Live search with citations',1],['Upload library','PDF, DOCX, PPTX, CSV, TXT',1],['Company drive','Shared reports and notes',0]];
window.__D={$,$$,esc,IC,ic,hash,P,av,SECT,SECTS,STAGES,sk,SRC,TYI,ANS,T,STATUS,byId,RAD,RELS,RINGS,LIB,CONN};
})();
(function(){
'use strict';
const {$,$$,esc,ic,hash,P,av,SECT,SECTS,STAGES,sk,SRC,TYI,ANS,T,STATUS,byId,RAD,RELS,RINGS,LIB,CONN}=window.__D;
(function(){const POOL={Materials:[['Solid-state','Silicon-carbon','Lithium-metal','Graphene','Nickel-rich','LFP','Sulfide','Halide','Polymer','Ceramic'],['anode coatings','cathode binders','separator films','electrolyte additives','interface layers','dopant strategies','coating processes','slurry formulations']],Thermal:[['Immersion','Two-phase','Phase-change','Microchannel','Heat-pipe','Graphite','Aerogel','Dielectric','Liquid-metal','Vapour-chamber'],['cooling loops','thermal pads','cold plates','propagation barriers','heat spreaders','interface compounds','pack enclosures','sensor arrays']],'Supply chain':[['Hard-carbon','Lithium','Cobalt-free','Manganese','Graphite','Precursor','Recycled','Regional','Dual-source','Bio-based'],['sourcing risk','price volatility','qualification lead time','capacity outlook','logistics routes','supplier concentration','inventory buffers','traceability']],Compliance:[['UN 38.3','MIL-STD-810H','EU Battery Regulation','UL 9540A','IEC 62619','REACH','Export control','Transport','Aviation','Marine'],['update','test protocol','labelling rules','certification path','audit findings','passport requirement','safety dossier','revision cycle']],Sustainability:[['Recycled','Closed-loop','Low-carbon','Water-free','Bio-based','Second-life','Solvent-free','Renewable','Circular','Carbon-neutral'],['cathode content','electrode processing','supply audit','lifecycle assessment','packaging','recovery yield','energy footprint','material passport']],Energy:[['Grid-scale','Iron-air','Sodium-ion','Molten-salt','Flow battery','Long-duration','Microgrid','Peak-shaving','Behind-the-meter','Utility'],['storage economics','dispatch models','cost curves','siting studies','tariff impact','degradation data','pilot results','capacity markets']]};
 const names=new Set(RAD.map(r=>r.t));let k=0;
 Object.keys(POOL).forEach(sec=>{const[A,B]=POOL[sec];for(let i=0;i<34;i++){const idx=(i*37+3)%(A.length*B.length),t=A[idx%A.length]+' '+B[Math.floor(idx/A.length)];if(names.has(t))continue;names.add(t);const h=hash(sec+i);RAD.push({id:'g'+(++k),t,s:sec,ring:h%100<18?0:h%100<50?1:h%100<80?2:3,pos:.5,sd:((h>>3)%100)/100,cf:55+h%41,tr:h%7<2?'up':h%7<5?'flat':'down',task:null,n:2+h%13})}});
})();

const S={route:'home',role:'researcher',f:{q:'',sector:'All',owner:'All'},sort:{c:'prog',d:-1},shut:{},swim:'none',zoom:'q',crit:false,rad:{sel:null,sector:'All',rel:false,ring:'All',tr:'All',q:'',vb:[0,0,1200,1200],full:false},tab:'summary',lens:'rd',openId:null,cg:{},unread:true,srcSel:{Scholar:1,IEEE:1,Patents:1,Web:1,Uploads:1,Drive:0},model:'panel',attached:false,wiz:null,thId:3,
 threads:[{id:'th1',title:'Immersion vs cold-plate cooling for 21700 modules',key:'cooling',q:'Compare immersion and cold-plate cooling for 21700 pack modules',t:'Today'},{id:'th2',title:'Freedom to operate: LLZO with polymer interlayer',key:'electrolyte',q:'What is the freedom-to-operate risk for LLZO with a polymer interlayer?',t:'Yesterday'},{id:'th3',title:'Sodium-ion cost at 20 GWh',key:'sodium',q:'What does sodium-ion cost at 20 GWh and what are the supply risks?',t:'Mon'}],
 comments:{},verdict:{},extra:{},cf:'APA',clips:[{id:'k1',text:'Single-phase immersion cooling has moved from pilot to mainstream in less than two years.',title:'Immersion cooling adoption doubles across EV pack programmes',site:'Energy Storage Weekly',url:'https://www.energystorageweekly.com/immersion-cooling-adoption-2026',author:'R. Haldane',date:'4 November 2026',task:'t102',taskTitle:'Immersion vs cold-plate cooling for 21700 modules',tags:['market'],when:'Today'},{id:'k2',text:'Hard carbon for sodium-ion cells remains concentrated, with three producers holding 71% of qualified capacity.',title:'Immersion cooling adoption doubles across EV pack programmes',site:'Energy Storage Weekly',url:'https://www.energystorageweekly.com/immersion-cooling-adoption-2026',author:'R. Haldane',date:'4 November 2026',task:'t104',taskTitle:'Sodium-ion supply chain and cost at 20 GWh',tags:['supply'],when:'Today'},{id:'k3',text:'Dielectric fluid delayed cell-to-cell thermal runaway propagation to 142 seconds.',title:'Immersion cooling adoption doubles across EV pack programmes',site:'Energy Storage Weekly',url:'https://www.energystorageweekly.com/immersion-cooling-adoption-2026',author:'R. Haldane',date:'4 November 2026',task:'t102',taskTitle:'Immersion vs cold-plate cooling for 21700 modules',tags:['safety'],when:'Yesterday'}]};
window.GSKLOGO='data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%2064%2064%27%3E%3Cdefs%3E%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%27%20stop-color%3D%27%23F7941D%27/%3E%3Cstop%20offset%3D%271%27%20stop-color%3D%27%23E2531A%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width%3D%2764%27%20height%3D%2764%27%20rx%3D%2716%27%20fill%3D%27url%28%23g%29%27/%3E%3Cpath%20d%3D%27M32%2013c1.7%209.8%209.2%2017.3%2019%2019-9.8%201.7-17.3%209.2-19%2019-1.7-9.8-9.2-17.3-19-19%209.8-1.7%2017.3-9.2%2019-19z%27%20fill%3D%27%23fff%27/%3E%3C/svg%3E';window.glow=(sz)=>`<span class="gl" style="--s:${sz||56}px"><i></i><i></i><img src="${window.GSKLOGO}" alt=""></span>`;
window.lg=n=>{const x=SRC[n],v=x.v;const i=v.split(/[\s,.&]+/).filter(w=>/^[A-Z]/.test(w)).slice(0,2).map(w=>w[0]).join('')||v[0];const c=['#0A7C93','#A9500E','#5B49BD','#1F7A4A','#A3306B','#2F5FC4'][hash(v)%6];return `<span class="n lg" style="background:linear-gradient(135deg,${c},color-mix(in srgb,${c} 68%,#000));color:#fff;font-weight:800;box-shadow:0 1px 3px rgba(0,0,0,.18)" data-tip="${esc(v)}">${i}</span>`};
const GL={v:'Verified against sources',d:'Disputed: sources disagree',u:'Unverified: no primary source yet'};
const GN={v:'Verified',d:'Disputed',u:'Unverified'};

/* ===== answers ===== */
const APPS={Materials:['Aviation and eVTOL packs','Defence portable power','Marine modules','Grid storage'],Thermal:['EV battery packs','Stationary cabinets','Data-centre UPS','Power electronics'],'Supply chain':['Stationary storage','Telecom backup','Two-wheelers','Urban EV'],Compliance:['Export to EU and US','Aviation certification','Fleet procurement','Insurance underwriting'],Sustainability:['Pack enclosures','Consumer electronics','Fleet vehicles','Recycling streams'],Energy:['Utility storage','Industrial heat','Microgrids','Remote sites']};
function getAns(t){
 if(t.ans)return ANS[t.ans];
 if(t._a)return t._a;
 const s=t.src,a=s[0],b=s[1]||s[0],z=s[s.length-1],h=hash(t.id),acc=t.acc;
 const types={};s.forEach(n=>types[SRC[n].ty]=(types[SRC[n].ty]||0)+1);
 const tl=Object.keys(types);
 t._a={title:t.title,acc,
 html:`Across ${s.length} indexed sources, the evidence on ${esc(t.title.toLowerCase())} points in one direction. {v|The core technical findings are consistent across independent sources|c1}[${a}][${b}]. {v|Internal data supports the direction of the external evidence|c2}[${z}].<br><br>Two points need a human decision. {d|Reported performance figures differ between the headline source and follow-up measurements|c3}[${a}][${b}], and {u|one commercial projection in the trade brief has no primary source|c4}.`,
 cl:{c1:{g:'v',s:[a,b],n:'Both models retrieved matching passages from independent sources.'},c2:{g:'v',s:[z],n:'Internal report, signed off by the lab lead.'},c3:{g:'d',s:[a,b],n:'Two sources report different figures. The headline number is a best-run result.'},c4:{g:'u',s:[b],n:'Single trade brief. No primary dataset or filing behind the projection.'}},
 panel:[{m:'Perplexity Sonar',r:'Live web research and citations',v:'Agrees with direction',vc:'ok',cf:acc+1,pts:['Retrieved matching passages from '+Math.min(s.length,4)+' sources','Evidence is recent and attributable','Flags the unsourced projection'],ci:s.slice(0,3)},{m:'Gemini',r:'Reasoning and synthesis',v:'Agrees, with a caveat',vc:'warn',cf:acc-4,pts:['Treats the headline figure as a best case','Plans on the more conservative follow-up range','Recommends a short validation run'],ci:s.slice(0,3)}],
 dis:'Both models agree on direction. They differ on which performance figure to plan on: Perplexity quotes the headline result, Gemini uses the conservative follow-up range. A reviewer should choose before the business case is compiled.',
 next:'Confirm the planning range with the owner, then submit for review.',
 fups:['Summarise the main risks','Compare against the closest alternative','List the sources I should read first'],
 apps:APPS[t.sector],
 ch:{t1:'Evidence by source type',l1:tl.map(x=>x.length>9?x.slice(0,8)+'.':x),v1:tl.map(x=>types[x]),t2:'Accuracy trend (%)',l2:['W1','W2','W3','W4','W5'],v2:[acc-14,acc-9,acc-5,acc-2,acc]},
 lens:{rd:{h:'Technically credible, with one open validation item',b:['Core findings are consistent across sources ['+a+']','Internal data supports the direction ['+z+']','A short validation run closes the remaining gap'],c:['Technical readiness (TRL)',['Now','Gate 2','Gate 3','Pilot'],[4,5,6,7]]},fin:{h:'Positive economics at target scale',b:['Unit cost falls 28% between pilot and target scale','Payback of '+(2+h%3)+'.'+(h%9)+' years in the base case','Sensitivity is highest on input cost'],c:['Cost curve (index)',['Pilot','Year 1','Year 2','Target'],[100,84,76,72]]},mkt:{h:'Clear fit with two priority segments',b:['Buyers value reliability over headline performance','Competitors compete on price, not evidence','Early pilots can be run with existing accounts'],c:['Segment fit score',APPS[t.sector].map(x=>x.split(' ')[0]),[84,78,66,41]]},leg:{h:'Manageable legal exposure',b:['No blocking patents identified in the landscape','Standards pathway is defined ['+(s.includes(12)?12:5)+']','Export classification to be confirmed'],c:['Risk by area (0–10)',['IP','Standards','Export','Contract'],[3,4,5,2]]}},
 cm:[[t.owner,'Draft summary is ready. Flagged the disputed figure for review.','2h']]};
 return t._a;
}
const flagged=t=>{const a=getAns(t);return Object.keys(a.cl).filter(c=>(S.cg[akey(t)+':'+c]||a.cl[c].g)!=='v').length};
const akey=t=>t.ans||t.id;
const ansByKey=k=>ANS[k]||getAns(byId(k));
const claimMeta=k=>{const[ak,c]=k.split(':');const a=ansByKey(ak);return{a,c,m:a.cl[c],g:S.cg[k]||a.cl[c].g}};
function rich(html,key){
 return html.replace(/\{([vdu])\|([^|]+)\|([^}]+)\}/g,(m,g,tx,c)=>{const gg=S.cg[key+':'+c]||g;return `<mark class="cl cl-${gg}" data-act="claim" data-k="${key}:${c}" tabindex="0" data-tip="${GL[gg]}. Click for sources.">${tx}</mark>`})
 .replace(/\[(\d+)\]/g,(m,n)=>SRC[n]?`<button class="cite" data-act="cite" data-n="${n}" data-tip="${esc(SRC[n].t)} · ${SRC[n].ty}, ${SRC[n].y}">${n}</button>`:m);
}
const citesIn=html=>[...new Set((html.match(/\[(\d+)\]/g)||[]).map(x=>+x.slice(1,-1)))];

/* ===== charts ===== */
function bar(labels,vals,o={}){const w=o.w||380,h=o.h||172,pl=32,pb=26,pt=20,n=vals.length,mx=Math.max(...vals,1)*1.15,bw=(w-pl-8)/n;const y=v=>pt+(h-pt-pb)*(1-Math.max(v,0)/mx);
 let g='';for(let i=0;i<=3;i++){const yy=pt+(h-pt-pb)*i/3;g+=`<line class="g" x1="${pl}" x2="${w-4}" y1="${yy}" y2="${yy}"/><text class="t" x="${pl-6}" y="${yy+3}" text-anchor="end">${Math.round(mx*(1-i/3))}</text>`}
 const hi=o.hi!=null?o.hi:vals.indexOf(Math.max(...vals));
 const bs=vals.map((v,i)=>{const x=pl+i*bw+bw*.18,ww=bw*.64,yy=y(v);return `<rect class="${i===hi?'hi':'b'}" x="${x}" y="${yy}" width="${ww}" height="${Math.max(0,y(0)-yy)}" rx="4"><title>${esc(labels[i])}: ${v}</title></rect><text class="v" x="${x+ww/2}" y="${yy-5}" text-anchor="middle">${v}</text><text class="t" x="${x+ww/2}" y="${h-8}" text-anchor="middle">${esc(labels[i])}</text>`}).join('');
 return `<svg class="chart" viewBox="0 0 ${w} ${h}" width="100%" role="img">${g}${bs}</svg>`}
function line(labels,vals,o={}){const w=o.w||380,h=o.h||172,pl=32,pr=16,pt=18,pb=26;const mx=Math.max(...vals),mn=Math.min(...vals),rg=(mx-mn)||1,lo=mn-rg*.25,hi=mx+rg*.25;
 const x=i=>pl+(w-pl-pr)*i/(vals.length-1),y=v=>pt+(h-pt-pb)*(1-(v-lo)/(hi-lo));
 const pts=vals.map((v,i)=>x(i)+','+y(v));const d='M'+pts.join('L');
 let g='';for(let i=0;i<=3;i++){const yy=pt+(h-pt-pb)*i/3;g+=`<line class="g" x1="${pl}" x2="${w-pr}" y1="${yy}" y2="${yy}"/><text class="t" x="${pl-6}" y="${yy+3}" text-anchor="end">${Math.round(hi-(hi-lo)*i/3)}</text>`}
 const xl=labels.map((l,i)=>`<text class="t" x="${x(i)}" y="${h-8}" text-anchor="middle">${esc(l)}</text>`).join('');
 const lx=x(vals.length-1),ly=y(vals[vals.length-1]);
 return `<svg class="chart" viewBox="0 0 ${w} ${h}" width="100%" role="img">${g}<path class="ar" d="${d}L${lx},${h-pb}L${x(0)},${h-pb}Z"/><path class="ln" d="${d}"/>${vals.map((v,i)=>`<circle cx="${x(i)}" cy="${y(v)}" r="${i===vals.length-1?5:3}" fill="${i===vals.length-1?'var(--accent)':'var(--surface)'}" stroke="var(--accent)" stroke-width="2"><title>${esc(labels[i])}: ${v}</title></circle>`).join('')}<text class="v" x="${lx}" y="${ly-10}" text-anchor="middle">${vals[vals.length-1]}</text>${xl}</svg>`}
const ring=(p,s=34,w=4)=>{const r=(s-w)/2,c=2*Math.PI*r,col=p>=90?'var(--ok)':p>=80?'var(--accent)':'#E0A020';return `<span class="ring" style="width:${s}px;height:${s}px" data-tip="Accuracy ${p}%: share of claims verified across both models"><svg width="${s}" height="${s}" style="transform:rotate(-90deg)"><circle cx="${s/2}" cy="${s/2}" r="${r}" fill="none" stroke="var(--line)" stroke-width="${w}"/><circle cx="${s/2}" cy="${s/2}" r="${r}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${c*p/100} ${c}"/></svg><b>${p}</b></span>`};
const stagePill=t=>`<span class="stage st-${sk(t.stage)}">${t.stage}${t.stage==='Decided'?(t.status==='parked'?' · Parked':' · Advanced'):''}</span>`;
const statusPill=t=>{const [l,c]=STATUS[t.status];return `<span class="pill ${c}" data-tip="${t.blk?esc(t.blk):l}"><i></i>${l}</span>`};
const ragDot=t=>`<span class="rag ${t.rag}" data-tip="${{g:'On track',a:'Needs attention',r:'At risk'}[t.rag]}"></span>`;
const sector=s=>`<span class="faint" style="white-space:nowrap">${s}</span>`;
const prog=t=>`<div style="display:flex;align-items:center;gap:8px"><div class="bar" style="width:84px"><i data-pgb="${t.id}" style="width:${t.prog}%"></i></div><span class="tnum" data-pg="${t.id}" style="font-weight:600;min-width:32px">${Math.round(t.prog)}%</span></div>`;
const filt=()=>T.filter(t=>(S.f.sector==='All'||t.sector===S.f.sector)&&(S.f.owner==='All'||t.owner===S.f.owner)&&(!S.f.q||(t.title+t.code+t.sector+P[t.owner].n).toLowerCase().includes(S.f.q.toLowerCase())));

/* ===== shell ===== */
const NAVI=[['home','home','Ask'],['list','list','Portfolio'],['board','board','Pipeline board'],['roadmap','roadmap','Roadmap'],['radar','radar','Radar'],['sources','db','Sources'],['clipper','clip','Web clipper']];
function navHTML(){
 const r=S.route.startsWith('thread-')?'home':S.route;
 const it=(k,i,l,ct)=>`<button class="ni${r===k?' on':''}" data-act="nav" data-r="${k}">${ic(i)}<span>${l}</span>${ct?`<span class="ct">${ct}</span>`:''}</button>`;
 const act=T.filter(t=>t.stage!=='Decided').length;
 return `<div class="brand"><img class="gsk" src="${window.GSKLOGO}" alt="" width="34" height="34"><div><b>Halden</b><small>R&amp;D intelligence</small></div></div>
 ${S.role==='vp'?it('executive','chart','Executive overview'):''}
 ${NAVI.map(([k,i,l])=>it(k,i,l,k==='list'?act:'')).join('')}
 <div class="eyebrow nav-h" style="display:flex;align-items:center">Recent<button class="iconbtn" style="margin-left:auto;width:24px;height:24px" data-act="newThread" data-tip="New thread">${ic('plus',14)}</button></div>
 ${S.threads.map(t=>`<button class="ni rcn${S.route==='thread-'+t.id?' on':''}" data-act="openThread" data-id="${t.id}" title="${esc(t.title)}"><span>${esc(t.title)}</span></button>`).join('')}
 <div class="nav-foot">${av(S.role==='vp'?'priya':'amina',1)}<div style="line-height:1.25"><b style="font-size:13px">${S.role==='vp'?'Dr. Priya Nair':'Jeff Carter'}</b><div class="faint" style="font-size:12px">${S.role==='vp'?'VP, R&D':'Lead researcher'}</div></div></div>`}
const TITLES={home:'Ask',list:'Portfolio',board:'Pipeline board',roadmap:'Roadmap',radar:'Radar',sources:'Sources',clipper:'Web clipper',executive:'Executive overview'};
function topHTML(){
 const title=S.route.startsWith('thread-')?'Research thread':TITLES[S.route];
 return `<button class="iconbtn burger" data-act="toggleNav" aria-label="Menu">${ic('menu')}</button>
 <div class="crumbs">${title}</div>
 <button class="cmdk" data-act="cmdk">${ic('search')}<span>Search tasks, sources, claims</span><kbd>⌘K</kbd></button>
 <div class="grow"></div><span class="chip-demo" data-tip="All figures, sources and people in this workspace are example data for the demo">Demo data</span>
 <div class="seg" data-tip="Switch between researcher and VP views"><button class="${S.role==='researcher'?'on':''}" data-act="role" data-r="researcher">Researcher</button><button class="${S.role==='vp'?'on':''}" data-act="role" data-r="vp">VP R&amp;D</button></div>
 <button class="iconbtn" data-act="clipPop" data-tip="Clipper: save the current page to a research task">${ic('clip')}</button>
 <button class="iconbtn" data-skin="1" aria-pressed="${document.documentElement.dataset.skin==='classic'?'false':'true'}" data-tip="${document.documentElement.dataset.skin==='classic'?'Glass look is off. Click to turn it on':'Glass look is on. Click for the classic look'}">${ic('layers')}</button><button class="iconbtn" data-act="theme" data-tip="Toggle light and dark">${ic('sun')}</button>
 <button class="iconbtn" data-act="notif" data-tip="Notifications">${ic('bell')}${S.unread?'<i class="dot"></i>':''}</button>`}

/* ===== home ===== */
const SUG=[['Compare immersion and cold-plate cooling for 21700 pack modules','Cooling trade-offs, with the propagation test data'],['What is the freedom-to-operate risk for LLZO with a polymer interlayer?','Patent fence, claims and yield evidence'],['What does sodium-ion cost at 20 GWh and what are the supply risks?','Cost curve and hard-carbon concentration'],['Summarise what changed in the portfolio this week','Signals, flagged claims and blockers']];
function homeHTML(){
 const mods={open:'Perplexity + Llama (open-weight)',panel:'Panel · 2 models',pplx:'Perplexity only',gemini:'Gemini only'};
 const ns=Object.values(S.srcSel).filter(Boolean).length;
 const fl=T.reduce((a,t)=>a+flagged(t),0);
 return `<div class="home"><div class="home-in">
 <div class="eyebrow">Halden · R&amp;D workspace</div>
 <h1 class="greet">What are you <i>researching</i>, Jeff?</h1>
 <div class="composer"><textarea id="q" rows="2" placeholder="Ask across 128 indexed sources: patents, journals, standards, internal reports"></textarea>
  ${S.attached?`<div class="chips" style="margin:2px 0 4px"><span class="pill accent">${ic('file',13)} TL-2291-thermal-report.pdf <button data-act="detach" aria-label="Remove" style="margin-left:2px">${ic('x',12)}</button></span></div>`:''}
  <div class="crow"><button class="cbtn" data-act="attach">${ic('clipb',14)} Attach</button><button class="cbtn" data-act="srcsel">${ic('db',14)} Sources · ${ns} of 6</button><button class="cbtn gold" data-act="modelsel">${ic('layers',14)} ${mods[S.model]}</button><button class="send" data-act="send" aria-label="Ask">${ic('send',18)}</button></div></div>

 <div class="hg">
  <div class="card hl"><h5>Continue</h5>${S.threads.slice(0,4).map(t=>`<button class="hi" data-act="openThread" data-id="${t.id}">${ic('spark',15)}<div class="grow"><b style="font-weight:600;font-size:13.5px">${esc(t.title)}</b><div class="faint" style="font-size:12px">${t.t} · ${ANS[t.key]?ANS[t.key].acc:90}% accuracy</div></div>${ic('chev',14)}</button>`).join('')}</div>
  <div class="card hl"><h5>In flight · ${T.filter(t=>t.stage!=='Decided').length} tasks</h5>${T.filter(t=>t.stage!=='Decided').slice(0,4).map(t=>`<button class="hi" data-act="openTask" data-id="${t.id}">${ring(t.acc,30,3)}<div class="grow"><b style="font-weight:600;font-size:13.5px;display:block;line-height:1.3">${esc(t.title)}</b><div class="faint" style="font-size:12px">${stagePill(t).replace('class="stage','class="stage" style="padding:0;background:none;display:inline" data-x="').replace(/>/,'>')} · ${STATUS[t.status][0]}</div></div></button>`).join('')}
   <div style="padding:6px 10px 8px;display:flex;gap:8px;align-items:center"><span class="pill gold">${fl} claims flagged</span><button class="btn sm ghost" data-act="nav" data-r="list">Open portfolio ${ic('chev',13)}</button></div></div>
 </div></div></div>`}

/* ===== thread ===== */
function extras(key,t){
 const a=ansByKey(key);
 return `<div class="fade stack" style="gap:14px">
 <div class="legend"><span><i class="sd" style="background:var(--ok)"></i>Verified</span><span><i class="sd" style="background:#E0A020"></i>Disputed</span><span><i class="sd" style="background:var(--bad)"></i>Unverified</span><span>Click any highlight or citation for the evidence</span></div>
 ${panelHTML(a,key)}
 <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pri sm" data-act="saveAns" data-k="${key}">${ic('plus',14)} Add to research task</button><button class="btn sm" data-act="copyAns" data-k="${key}">${ic('copy',14)} Copy with citations</button><button class="btn sm" data-act="flagAns" data-k="${key}">${ic('flag',14)} Flag for review</button></div>
 <div><div class="eyebrow" style="margin-bottom:8px">Suggested follow-ups</div><div class="fup">${a.fups.map((f,i)=>`<button class="fchip" data-act="followup" data-k="${key}" data-i="${i}">${esc(f)}</button>`).join('')}</div></div></div>`}
function panelHTML(a,key){
 const fl=Object.keys(a.cl).filter(c=>(S.cg[key+':'+c]||a.cl[c].g)!=='v').length;
 return `<div class="stack" style="gap:12px"><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><b style="font-size:15px">Model panel</b><span class="gold-tag">2 models checked the same question</span><span class="grow"></span><span class="mini muted">Consensus<span style="width:90px;display:inline-block" class="bar"><i style="width:${Math.round((a.panel[0].cf+a.panel[1].cf)/2)}%;background:var(--gold)"></i></span><b>${Math.round((a.panel[0].cf+a.panel[1].cf)/2)}%</b></span></div>
 <div class="panel2">${a.panel.map((p,pi)=>`<div class="card mcard" data-act="mexp" data-i="${pi}" style="cursor:pointer"><h4><span class="logo" style="width:22px;height:22px;font-size:11px;border-radius:6px;${p.m.startsWith('Perp')?'background:#0A8CA6':'background:#B4570F'}">${p.m[0]}</span>${p.m}<span class="pill ${p.vc}" style="margin-left:auto">${p.v}</span></h4><div class="faint" style="font-size:12px;margin-top:-6px">${p.r} · confidence ${p.cf}%</div><ul>${p.pts.map((x,i)=>`<li class="${i===2&&p.vc==='warn'?'fl':''}">${x}</li>`).join('')}</ul><div style="display:flex;gap:4px;align-items:center"><span class="faint" style="font-size:12px;margin-right:4px">Cites</span>${p.ci.map(n=>`<button class="cite" data-act="cite" data-n="${n}" data-tip="${esc(SRC[n].t)}">${n}</button>`).join('')}</div><button class="btn sm" data-act="mexp" data-i="${pi}" style="margin-top:10px;width:100%">${ic('ext',14)} Expand full research</button></div>`).join('')}</div>
 <div class="disagree"><div class="eyebrow">Where they disagree · ${fl} claim${fl===1?'':'s'} flagged</div><p style="margin:6px 0 0">${a.dis}</p></div></div>`}
function railHTML(key){
 const a=ansByKey(key),cs=citesIn(a.html);
 return `<div><div class="eyebrow" style="margin-bottom:8px">Answer accuracy</div><div style="display:flex;gap:12px;align-items:center">${ring(a.acc,56,6)}<div><b style="font-size:15px">${a.acc}% verified</b><div class="faint" style="font-size:12.5px">${Object.values(a.cl).filter(c=>c.g==='v').length} of ${Object.keys(a.cl).length} claims verified by both models</div></div></div></div>
 <div><div class="eyebrow" style="margin-bottom:8px">Sources in this answer · ${cs.length}</div><div class="stack" style="gap:8px">${cs.map(n=>`<button class="rsrc" data-act="cite" data-n="${n}">${lg(n)}<span><b>${esc(SRC[n].t)}</b><small>${SRC[n].ty} · ${esc(SRC[n].v)} · ${SRC[n].y}</small></span></button>`).join('')}</div></div>`}
function threadHTML(th){
 const a=ansByKey(th.key),fresh=!!th.fresh;
 return `<div class="thread"><div class="tmain"><div class="tscroll" id="tscroll"><div class="tcol">
  <div class="umsg">${esc(th.q)}</div>
  <div class="amsg"><div class="ahead"><img class="gsk" src="${window.GSKLOGO}" alt="" style="width:24px;height:24px;border-radius:6px"><b>Halden</b><span class="pill accent">Grounded · ${citesIn(a.html).length} sources</span><span class="pill gold">2 models</span><span class="pill ${a.acc>=90?'ok':'warn'}" data-tip="Share of claims verified across both models">Accuracy ${a.acc}%</span></div>
  ${th.pre?`<div class="muted" style="font-size:14px">${th.pre}</div>`:''}
  <div class="abody${fresh?' cursor':''}" id="abody">${fresh?'':rich(a.html,th.key)}</div>
  <div id="aextra">${fresh?'':extras(th.key)}</div></div></div></div>
  <div class="composer dock"><textarea id="q2" rows="1" placeholder="Ask a follow-up, or paste a draft paragraph to fact-check"></textarea><div class="crow"><button class="cbtn" data-act="attach">${ic('clipb',14)} Attach</button><button class="cbtn gold" data-act="modelsel">${ic('layers',14)} Panel · 2 models</button><button class="send" data-act="send2" aria-label="Ask">${ic('send',18)}</button></div></div></div>
  <aside class="rail" id="rail">${railHTML(th.key)}</aside></div>`}

/* ===== portfolio shell ===== */
function kpiHTML(){
 const act=T.filter(t=>t.stage!=='Decided'),vp=T.filter(t=>t.status==='vp'||(t.status==='review'&&t.stage==='Business case')).length,run=T.filter(t=>t.status==='running').length,fl=T.reduce((a,t)=>a+flagged(t),0),avg=Math.round(T.reduce((a,t)=>a+t.acc,0)/T.length);
 const k=(l,v,s,tip)=>`<div class="card kpi" data-tip="${tip}"><span class="eyebrow">${l}</span><b>${v}</b><small>${s}</small></div>`;
 return `<div class="kpis">${k('Active research',act.length,run+' with agents running','Tasks not yet decided')}${k('Awaiting review',T.filter(t=>t.status==='review'||t.status==='vp').length,vp+' for VP sign-off','Tasks finished by agents and waiting for a human')}${k('Avg accuracy',avg+'%','Across all verified claims','Share of claims verified across both models')}${k('Citations verified','94%','1,204 of 1,281 checked','Each citation is checked against the source passage')}${k('Claims flagged',fl,'Disputed or unverified','Claims where sources disagree or no primary source exists')}</div>`}
function pvHTML(v){
 return `<div class="page"><div class="ph"><div><h1>Research portfolio</h1><p>Every task in flight, with owner, evidence quality and decision status.</p></div><div class="grow"></div><button class="btn" data-act="exportAll">${ic('file',15)} Portfolio export</button><button class="btn pri" data-act="wizard">${ic('plus',15)} New research</button></div>
 ${kpiHTML()}
 <div class="tabs">${[['list','list','List'],['board','board','Board'],['roadmap','roadmap','Roadmap'],['radar','radar','Radar']].map(([k,i,l])=>`<button class="tab${v===k?' on':''}" data-act="nav" data-r="${k}">${ic(i,15)}${l}</button>`).join('')}</div>
 ${v==='radar'?'':`<div class="toolbar"><div style="position:relative;flex:1;min-width:200px;max-width:320px"><input class="in" id="fq" placeholder="Filter by title, owner, sector" value="${esc(S.f.q)}"></div>
  <div class="chips">${['All',...SECTS].map(s=>`<button class="fchip${S.f.sector===s?' on':''}" data-act="fsec" data-s="${s}">${s}</button>`).join('')}</div>
  <select class="in" id="fown" style="width:auto"><option value="All">All owners</option>${['amina','sara','james','mei','tomas'].map(o=>`<option value="${o}"${S.f.owner===o?' selected':''}>${P[o].n}</option>`).join('')}</select></div>`}
 <div id="pv-body">${pvBody(v)}</div></div>`}
function pvBody(v){return v==='list'?listHTML():v==='board'?boardHTML():v==='roadmap'?roadmapHTML():radarHTML()}

function listHTML(){
 const tasks=filt(),c=S.sort.c,d=S.sort.d;
 const key={title:t=>t.title,status:t=>STATUS[t.status][0],owner:t=>P[t.owner].n,prog:t=>t.prog,acc:t=>t.acc,flags:t=>flagged(t),due:t=>t.due,rag:t=>t.rag}[c];
 const th=(k,l)=>`<th><button data-act="sort" data-c="${k}">${l}${S.sort.c===k?ic(S.sort.d>0?'up':'down',12):''}</button></th>`;
 let body='';
 STAGES.forEach(st=>{const g=tasks.filter(t=>t.stage===st).sort((a,b)=>{const x=key(a),y=key(b);return (x>y?1:x<y?-1:0)*d});if(!g.length)return;
  const avg=Math.round(g.reduce((a,t)=>a+t.prog,0)/g.length),sh=S.shut[st];
  body+=`<tr class="grp" data-act="grp" data-s="${st}"><td colspan="8"><div class="gh${sh?' shut':''}">${ic('down',15)}<span class="stage st-${sk(st)}">${st}</span><span class="faint">${g.length} task${g.length>1?'s':''} · avg progress ${avg}%</span></div></td></tr>`;
  if(!sh)body+=g.map(t=>`<tr class="row" data-act="openTask" data-id="${t.id}"><td class="ti"><b>${esc(t.title)}</b>${sector(t.sector)}</td><td>${statusPill(t)}</td><td><div style="display:flex;gap:8px;align-items:center">${av(t.owner)}<span style="white-space:nowrap">${P[t.owner].n}</span></div></td><td>${prog(t)}</td><td>${ring(t.acc,32,3.5)}</td><td>${flagged(t)?`<span class="pill gold" data-tip="${flagged(t)} claims are disputed or unverified">${ic('flag',12)} ${flagged(t)}</span>`:'<span class="pill ok">Clear</span>'}</td><td class="tnum" style="white-space:nowrap">${t.due}</td><td>${ragDot(t)}</td></tr>`).join('')});
 if(!body)body=`<tr><td colspan="8" style="padding:36px;text-align:center" class="muted">No tasks match these filters. <button class="btn sm" data-act="clearF">Clear filters</button></td></tr>`;
 return `<div class="tw"><table class="t"><thead><tr>${th('title','Research')}${th('status','Status')}${th('owner','Owner')}${th('prog','Progress')}${th('acc','Accuracy')}${th('flags','Flags')}${th('due','Due')}${th('rag','Risk')}</tr></thead><tbody>${body}</tbody></table></div>`}

function cardHTML(t){
 const fl=flagged(t);
 return `<div class="tcard" draggable="true" data-id="${t.id}" data-act="openTask"><div class="meta">${sector(t.sector)}<span class="grow"></span>${ragDot(t)}<button class="iconbtn" style="width:24px;height:24px" data-act="moveMenu" data-id="${t.id}" aria-label="Move task">${ic('more',15)}</button></div><h4>${esc(t.title)}</h4>${t.blk?`<div class="pill bad" style="height:auto;padding:4px 9px;white-space:normal">${esc(t.blk)}</div>`:''}<div style="display:flex;align-items:center;gap:8px">${prog(t)}<span class="grow"></span>${fl?`<span class="pill gold">${ic('flag',11)} ${fl}</span>`:''}</div><div class="meta">${statusPill(t)}<span class="grow"></span>${ring(t.acc,28,3)}${av(t.owner)}</div></div>`}
function boardCols(tasks,head){
 return `<div class="board">${STAGES.map(st=>{const g=tasks.filter(t=>t.stage===st),avg=g.length?Math.round(g.reduce((a,t)=>a+t.acc,0)/g.length):0,run=g.filter(t=>t.status==='running').length;
 return `<div class="bcol" data-stage="${st}">${head?`<div class="bh"><span class="stage st-${sk(st)}">${st}</span><b class="faint">${g.length}</b><span class="agg">${g.length?`avg accuracy ${avg}%<br>${run} running`:''}</span></div>`:''}${g.map(cardHTML).join('')||'<div class="faint" style="padding:18px;text-align:center;font-size:12.5px">Drop a task here to move it to '+st+'</div>'}</div>`}).join('')}</div>`}
function boardHTML(){
 const tasks=filt();
 const sw=`<div class="toolbar"><span class="muted">Swimlanes</span><div class="seg">${[['none','None'],['sector','Sector'],['owner','Owner']].map(([k,l])=>`<button class="${S.swim===k?'on':''}" data-act="swim" data-s="${k}">${l}</button>`).join('')}</div><span class="faint" style="font-size:12.5px">Drag cards between columns. Tasks with agents still running stay in place until the run completes.</span></div>`;
 let b;
 if(S.swim==='none')b=boardCols(tasks,true);
 else{const lanes=S.swim==='sector'?SECTS:['amina','sara','james','mei','tomas'];b=lanes.map((l,i)=>{const g=tasks.filter(t=>(S.swim==='sector'?t.sector:t.owner)===l);if(!g.length)return'';return `<div class="lane">${S.swim==='sector'?`<span class="sd" style="background:${SECT[l]}"></span>${l}`:`${av(l)}${P[l].n}`}<span class="faint">${g.length}</span></div>${boardCols(g,i===0||false)}`}).join('')}
 return sw+`<div class="boardwrap">${b}</div>`}

function roadmapHTML(){
 const tasks=filt(),M=['Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'],crit=['t101','t106','t102','t108'];
 const w=S.zoom==='q'?1200:1700;
 return `<div class="toolbar"><div class="seg">${[['q','Quarter view'],['m','Month view']].map(([k,l])=>`<button class="${S.zoom===k?'on':''}" data-act="zoom" data-z="${k}">${l}</button>`).join('')}</div><button class="fchip${S.crit?' on':''}" data-act="crit">${S.crit?'Critical path on':'Show critical path'}</button><span class="faint" style="font-size:12.5px">Arrows show dependencies. Click a bar to open the task.</span></div>
 <div class="rm" id="rm"><div class="rm-in" id="rmin" style="min-width:${w}px"><div class="rm-h"><div>Research task</div>${M.map(m=>`<div>${m} ${m==='Nov'||m==='Dec'?"'26":"'27"}</div>`).join('')}</div>
 ${tasks.map(t=>`<div class="rm-row"><div class="rm-lab" data-act="openTask" data-id="${t.id}">${ragDot(t)}<span title="${esc(t.title)}">${esc(t.title)}</span></div><div class="rm-track"><div class="rm-bar s-${sk(t.stage)}${S.crit&&!crit.includes(t.id)?' dim':''}" id="bar-${t.id}" data-act="openTask" data-id="${t.id}" style="left:${t.s/8*100}%;width:${(t.e-t.s)/8*100}%" data-tip="${esc(t.title)} · ${t.stage} · ${Math.round(t.prog)}% · due ${t.due}"><i style="width:${t.prog}%"></i><span style="position:relative">${esc(P[t.owner].n.split(' ')[0])} · ${Math.round(t.prog)}%</span></div></div></div>`).join('')}
 <div class="rm-today" style="left:calc(260px + (100% - 260px) * .025)"></div><svg class="deps" id="deps"></svg></div></div>`}

let RL=[];const CX=600,CY=600,R=330,B0=R+6,B1=R+26,LBL=R+46;
const TRC={up:'var(--ok)',flat:'#E0A020',down:'var(--bad)'},TRN={up:'Rising',flat:'Steady',down:'Cooling'};
const pt=(a,rad)=>[CX+rad*Math.cos(a),CY-rad*Math.sin(a)];
const arcP=(a0,a1,rad)=>{const p=pt(a0,rad),q=pt(a1,rad);return `M${p[0]},${p[1]}A${rad},${rad} 0 ${(a0-a1)>Math.PI?1:0} 1 ${q[0]},${q[1]}`};
function radVis(){const f=S.rad;return RAD.filter(r=>(f.sector==='All'||r.s===f.sector)&&(f.ring==='All'||r.ring===+f.ring)&&(f.tr==='All'||r.tr===f.tr)&&(!f.q||r.t.toLowerCase().includes(f.q.toLowerCase())))}
function radarSVG(){
 const vis=radVis(),secs=SECTS.filter(s=>vis.some(r=>r.s===s)),total=vis.length;
 if(!total)return `<div style="padding:60px;text-align:center" class="muted"><b>No signals match these filters.</b><div style="margin-top:10px"><button class="btn sm" data-act="rclear">Clear filters</button></div></div>`;
 let a=Math.PI/2;const items=[],bands=[],step=2*Math.PI/total;RL=items;const fs=Math.max(3.2,Math.min(11.5,step*LBL*.8)),big=total>60;
 secs.forEach(s=>{const g=vis.filter(r=>r.s===s).sort((x,y)=>x.id.localeCompare(y.id,undefined,{numeric:true})),a0=a;g.forEach(r=>{items.push({r,a:a-step/2});a-=step});bands.push({s,a0,a1:a})});
 const sel=S.rad.sel;
 const zones=[3,2,1,0].map(i=>{const rad=R*(i+1)/4;return `<circle cx="${CX}" cy="${CY}" r="${rad}" fill="var(--surface2)" opacity="${i%2?.55:.9}" stroke="var(--line2)" stroke-width="1"/>`}).join('');
 const rl=RINGS.map((l,i)=>`<text class="rlab" x="${CX}" y="${CY-R*(i+.5)/4+3}" text-anchor="middle" style="font-size:9.5px;paint-order:stroke;stroke:var(--surface);stroke-width:4px">${l}</text>`).join('');
 const arcR=(a0,a1,rad)=>{const p=pt(a0,rad),q=pt(a1,rad);return `M${p[0]},${p[1]}A${rad},${rad} 0 ${(a0-a1)>Math.PI?1:0} 0 ${q[0]},${q[1]}`};
 const bd=bands.map(b=>{const m=(B0+B1)/2,pad=.004,id='bp'+SECTS.indexOf(b.s),bot=Math.sin((b.a0+b.a1)/2)<0;return `<defs><path id="${id}" d="${bot?arcR(b.a1+pad,b.a0-pad,m):arcP(b.a0-pad,b.a1+pad,m)}"/></defs><path d="${arcP(b.a0-pad,b.a1+pad,m)}" stroke="${SECT[b.s]}" stroke-width="${B1-B0}" fill="none" style="cursor:pointer" data-act="rsec" data-s="${b.s}" data-tip="${b.s}: ${vis.filter(r=>r.s===b.s).length} signals. Click to zoom in"/>${(b.a0-b.a1)*m>b.s.length*9+30?`<text style="font:700 9.5px var(--font);letter-spacing:.1em;fill:#fff;text-transform:uppercase;pointer-events:none" dominant-baseline="central"><textPath dominant-baseline="central" href="#${id}" startOffset="50%" text-anchor="middle">${b.s}</textPath></text>`:''}`}).join('');
 const spokes=items.map(({r,a})=>{const rad=R*(r.ring+.14+.72*Math.min(r.sd,1))/4,p=pt(a,rad),q=pt(a,R);return `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${SECT[r.s]}" stroke-width="1" stroke-dasharray="2 3" opacity="${sel&&sel!==r.id?.15:big?.3:.6}"/>`}).join('');
 const rels=S.rad.rel?RELS.map(([x,y])=>{const A=items.find(i=>i.r.id===x),B=items.find(i=>i.r.id===y);if(!A||!B)return'';const rd=r=>R*(r.ring+.14+.72*Math.min(r.sd,1))/4,p=pt(A.a,rd(A.r)),q=pt(B.a,rd(B.r));return `<path d="M${p[0]},${p[1]}Q${CX},${CY} ${q[0]},${q[1]}" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="5 4" opacity=".7"/>`}).join(''):'';
 const dots=items.map(({r,a})=>{const rad=R*(r.ring+.14+.72*Math.min(r.sd,1))/4,p=pt(a,rad),d=big?3+r.cf/100*4:5+r.cf/100*7,on=r.id===sel,dim=sel&&!on;
  return `<g class="rdot" data-act="rsel" data-id="${r.id}" opacity="${dim?.45:1}" data-tip="<b>${esc(r.t)}</b><br>${RINGS[r.ring]} · ${TRN[r.tr]}<br>Confidence ${r.cf}% · ${r.n} sources">${r.tr==='up'&&!big?`<circle cx="${p[0]}" cy="${p[1]}" r="${d+2}" fill="${TRC.up}" opacity=".25"><animate attributeName="r" values="${d+1};${d+9};${d+1}" dur="2.8s" repeatCount="indefinite"/><animate attributeName="opacity" values=".35;0;.35" dur="2.8s" repeatCount="indefinite"/></circle>`:''}${on?`<circle cx="${p[0]}" cy="${p[1]}" r="${d+6}" fill="none" stroke="var(--fg)" stroke-width="2"/>`:''}<circle cx="${p[0]}" cy="${p[1]}" r="${d}" fill="${TRC[r.tr]}" stroke="var(--surface)" stroke-width="${big?1:2}"/>${r.task?`<circle cx="${p[0]+d*.8}" cy="${p[1]-d*.8}" r="3.5" fill="var(--accent)" stroke="var(--surface)" stroke-width="1.2"/>`:''}</g>`}).join('');
 const wpx=(document.getElementById('radsvg')||{}).clientWidth||775,k=wpx/S.rad.vb[2],fsv=Math.min(11.5,9/k),gap=fsv*1.3/LBL;
 const pr=x=>x.r.id===sel?0:x.r.task?1:/^r/.test(x.r.id)?2:3,shown=[];
 [...items].sort((x,y)=>pr(x)-pr(y)||x.a-y.a).forEach(x=>{if(!shown.some(y=>Math.abs(y.a-x.a)<gap))shown.push(x)});
 const labs=shown.map(({r,a})=>{const p=pt(a,LBL),dg=a*180/Math.PI,left=Math.cos(a)<0,on=r.id===sel,t=r.t.length>30?r.t.slice(0,28)+'…':r.t;
  return `<text x="${p[0]}" y="${p[1]}" transform="rotate(${left?180-dg:-dg} ${p[0]} ${p[1]})" text-anchor="${left?'end':'start'}" dominant-baseline="middle" data-act="rsel" data-id="${r.id}" style="font:${on?700:500} ${fsv}px var(--font);fill:${on?'var(--fg)':'var(--fg2)'};cursor:pointer" data-tip="${esc(r.t)}">${esc(t)}</text>`}).join(''); return `<svg id="rsvg" viewBox="${S.rad.vb.join(' ')}" width="100%" style="display:block;touch-action:none;cursor:grab;aspect-ratio:1;max-width:min(100%,84vh);margin:0 auto" role="img" aria-label="Technology radar">${zones}<line x1="${CX-R}" x2="${CX+R}" y1="${CY}" y2="${CY}" stroke="var(--line2)" opacity=".6"/><line y1="${CY-R}" y2="${CY+R}" x1="${CX}" x2="${CX}" stroke="var(--line2)" opacity=".6"/>${spokes}${rels}${bd}${dots}${rl}${labs}</svg>`}
function radarSide(){
 const sel=RAD.find(r=>r.id===S.rad.sel);
 const chips=(k,opts)=>`<div class="chips">${opts.map(([v,l,c])=>`<button class="fchip${String(S.rad[k])===String(v)?' on':''}" data-act="rf" data-k="${k}" data-v="${v}">${c?`<span class="sd" style="background:${c}"></span>`:''}${l}</button>`).join('')}</div>`;
 const filt=`<div class="stack" style="gap:12px"><div style="display:flex;align-items:center"><b style="font-size:15px">Filters</b><span class="grow"></span><button class="btn sm ghost" data-act="rclear">Reset</button></div>
 <div><div class="eyebrow" style="margin-bottom:6px">Sector</div>${chips('sector',[['All','All'],...SECTS.map(s=>[s,s,SECT[s]])])}</div>
 <div><div class="eyebrow" style="margin-bottom:6px">Readiness</div>${chips('ring',[['All','All'],...RINGS.map((l,i)=>[i,l])])}</div>
 <div><div class="eyebrow" style="margin-bottom:6px">Trend</div>${chips('tr',[['All','All'],['up','Rising','var(--ok)'],['flat','Steady','#E0A020'],['down','Cooling','var(--bad)']])}</div></div>`;
 const det=sel?`<div class="stack" style="gap:12px;border-top:1px solid var(--line);padding-top:14px"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="pill" style="background:${SECT[sel.s]};color:#fff">${sel.s}</span><span class="pill ${sel.ring<2?'ok':'warn'}">${RINGS[sel.ring]}</span><span class="pill" style="color:${TRC[sel.tr]}">${TRN[sel.tr]}</span></div><h3 style="margin:0;font-size:17px;line-height:1.3">${esc(sel.t)}</h3><div style="display:flex;gap:12px;align-items:center">${ring(sel.cf,52,6)}<div><b>${sel.cf}% confidence</b><div class="faint">${sel.n} sources · ${sel.tr==='up'?'new evidence this week':'no change this week'}</div></div></div>
 <div class="eyebrow">Evidence</div>${[0,1,2].map(i=>{const n=((hash(sel.id)+i*3)%12)+1;return `<button class="rsrc" data-act="cite" data-n="${n}">${lg(n)}<span><b>${esc(SRC[n].t)}</b><small>${SRC[n].ty} · ${SRC[n].y}</small></span></button>`}).join('')}
 <div style="display:flex;gap:8px;flex-wrap:wrap">${sel.task?`<button class="btn pri sm" data-act="openTask" data-id="${sel.task}">Open ${byId(sel.task).code}</button>`:`<button class="btn pri sm" data-act="promote" data-id="${sel.id}">${ic('plus',14)} Promote to research task</button>`}<button class="btn sm" data-act="linkSig" data-id="${sel.id}">${ic('link',14)} Link to task</button><button class="btn sm ghost" data-act="rsel" data-id="">Close</button></div></div>`
 :`<div class="muted" style="border-top:1px solid var(--line);padding-top:14px;font-size:13px">Closer to the centre means closer to action. Dot size is confidence. The orange mark shows a signal already in a research task. Select a signal for its evidence.</div>`;
 return filt+det}
function radarHTML(){
 const n=radVis().length;
 return `<div id="radwrap" class="${S.rad.full?'rfull':''}"><div class="toolbar"><div style="position:relative;flex:1;min-width:200px;max-width:300px"><input class="in" id="rq" placeholder="Search ${RAD.length} signals" value="${esc(S.rad.q||'')}"></div><span class="faint" id="rcount">${n} element${n===1?'':'s'}</span><button class="fchip${S.rad.rel?' on':''}" data-act="rrel">${S.rad.rel?'Relations on':'Show relations'}</button><span class="grow"></span><span class="legend"><span><i class="sd" style="background:var(--ok)"></i>Rising</span><span><i class="sd" style="background:#E0A020"></i>Steady</span><span><i class="sd" style="background:var(--bad)"></i>Cooling</span></span></div>
 <div class="radar-g"><div class="card radar-box" style="padding:8px 4px 0"><div class="rzc"><button class="iconbtn" data-act="rzin" data-tip="Zoom in">${ic('plus',16)}</button><button class="iconbtn" data-act="rzout" data-tip="Zoom out"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/></svg></button><button class="iconbtn" data-act="rzreset" data-tip="Reset view">${ic('radar',16)}</button><button class="iconbtn" data-act="rfull" data-tip="${S.rad.full?'Exit full screen':'Expand'}">${ic('ext',16)}</button></div><div id="radsvg">${radarSVG()}</div></div><div class="card sec" id="radside" style="align-self:start;max-height:calc(100vh - 160px);overflow:auto">${radarSide()}</div></div></div>`}
const radPos=id=>{const it=RL.find(x=>x.r.id===id);if(!it)return null;const rd=R*(it.r.ring+.14+.72*Math.min(it.r.sd,1))/4;return pt(it.a,rd)};

/* ===== sources ===== */
function sourcesHTML(){
 const q=(S.sq||'').toLowerCase(),rows=[...(S.extra.lib||[]),...LIB].filter(r=>!q||(r.n+r.ty).toLowerCase().includes(q));
 return `<div class="page"><div class="ph"><div><h1>Sources</h1><p>Bring knowledge in. Everything is parsed, indexed and ready to cite. Company systems stay out of scope for the pilot.</p></div><div class="grow"></div><button class="btn" data-act="syncTasks">${ic('copy',15)} Copy tasks for extension</button><button class="btn" data-act="clipsImport">${ic('upload',15)} Import clips</button><button class="btn pri" data-act="upload">${ic('upload',15)} Upload</button></div>
 <div class="grid2" style="grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);margin-bottom:16px"><div class="drop" id="drop" data-act="upload">${ic('upload',26)}<div style="margin-top:8px"><b>Drop files or click to upload</b></div><div class="faint" style="font-size:12.5px">PDF · DOCX · PPTX · CSV · TXT · 25+ types</div></div>
 <div><div class="eyebrow" style="margin-bottom:8px">Connected data</div><div class="grid2" style="grid-template-columns:1fr 1fr;gap:10px">${CONN.map((c,i)=>{const on=S.extra.conn?S.extra.conn[i]:c[2];return `<div class="card conn"><div class="cico">${ic(['db','file','shield','link','upload','layers'][i])}</div><div class="grow"><b>${c[0]}</b><div class="faint" style="font-size:12px">${c[1]}</div></div>${on===2?'<span class="pill accent run"><i></i>Connecting</span>':on?`<button class="pill ok" data-act="conn" data-i="${i}" data-tip="Click to disconnect">${ic('check',12)} Connected</button>`:`<button class="btn sm" data-act="conn" data-i="${i}">Connect</button>`}</div>`}).join('')}</div></div></div>
 <div class="card" style="margin-bottom:16px"><div style="display:flex;gap:10px;align-items:center;padding:14px 16px"><b style="font-size:15px">Clips from the extension</b><span class="pill gold">${S.clips.length}</span><span class="faint">Everything cited from the web, with its task and citation</span></div><div class="tw" style="border:0;border-radius:0;box-shadow:none"><table class="t" style="min-width:640px"><thead><tr><th>Clip</th><th>Task</th><th>Source</th><th>Added</th></tr></thead><tbody>${S.clips.map(c=>`<tr class="row" data-act="clipInfo" data-id="${c.id}"><td class="ti"><b>${esc((c.text||c.title).slice(0,90))}</b><span>${(c.tags||[]).map(x=>'#'+esc(x)).join(' ')}</span></td><td>${esc((c.taskTitle||'').slice(0,40))}</td><td>${esc(c.site||'')}</td><td class="faint">${esc(c.when||'')}</td></tr>`).join('')}</tbody></table></div></div>
 <div class="card"><div style="display:flex;gap:10px;align-items:center;padding:14px 16px;flex-wrap:wrap"><b style="font-size:15px">All sources</b><span class="faint">${rows.length} shown · 128 indexed</span><span class="grow"></span><input class="in" id="sq" placeholder="Search and filter" value="${esc(S.sq||'')}" style="max-width:240px"></div>
 <div class="tw" style="border:0;border-radius:0;box-shadow:none"><table class="t" style="min-width:640px"><thead><tr><th>Name</th><th>Type</th><th>Status</th><th>Added</th></tr></thead><tbody id="srows">${rows.map(r=>`<tr class="row" data-act="${r.src?'cite':'srcInfo'}" data-n="${r.src||''}" data-id="${r.id}"><td><b>${esc(r.n)}</b></td><td>${r.ty}</td><td>${r.st==='Indexing'?'<span class="pill accent run"><i></i>Indexing</span>':'<span class="pill ok">Indexed</span>'}</td><td class="faint">${r.ad}</td></tr>`).join('')}</tbody></table></div></div></div>`}

/* ===== clipper demo ===== */
function clipperHTML(){
 return `<div class="page" style="max-width:1000px"><div class="ph"><div><h1>Web clipper</h1><p>Select any text to cite it and add it to a research task. The same panel ships as the Halden Clipper Chrome extension, which works on any website.</p></div></div>
 <div class="hint" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><span style="flex:1;min-width:240px">${ic('spark',18)} This page is scanned automatically. You can also select a sentence, or triple-click it, to check one statement.</span><button class="btn sm" data-act="scanPage">${ic('spark',13)} Scan page again</button></div>
 <div class="browser"><div class="bchrome"><span><i></i><i></i><i></i></span><div class="burl">https://www.energystorageweekly.com/immersion-cooling-adoption-2026</div></div>
 <div class="article"><div class="kick">Battery thermal management</div><h1>Immersion cooling adoption doubles across EV pack programmes</h1><p class="faint" style="color:#777">By R. Haldane · 4 November 2026 · 6 min read</p>
 <p>Single-phase immersion cooling has moved from pilot to mainstream in less than two years. OEM programmes specifying single-phase immersion rose from 11 to 23 in twelve months, according to supplier disclosures reviewed by Energy Storage Weekly.</p>
 <p>The case for immersion rests on safety. In module-level tests of 21700 cells, dielectric fluid delayed cell-to-cell thermal runaway propagation to 142 seconds, compared with 38 seconds for a conventional cold plate. Pack designers pay for that margin with roughly 12% lower pack-level energy density.</p>
 <p>Two-phase microchannel plates are the next contender. One supplier says its design delivers a threefold improvement in heat flux, though patent filings from the same company describe gains closer to 1.8 times a single-phase reference. About a third of programmes are expected to move to two-phase cooling by 2028, analysts said.</p>
 <p>On the supply side, hard carbon for sodium-ion cells remains concentrated, with three producers holding 71% of qualified capacity. Sodium-ion cells could reach $48 per kWh at 20 GWh if precursor costs stay below $2.1 per kg.</p></div></div></div>`}

window.__V={S,GL,GN,getAns,flagged,akey,ansByKey,claimMeta,rich,citesIn,bar,line,ring,stagePill,statusPill,ragDot,sector,prog,filt,navHTML,topHTML,homeHTML,threadHTML,extras,panelHTML,railHTML,pvHTML,pvBody,listHTML,boardHTML,roadmapHTML,radarHTML,radarSVG,radarSide,radVis,radPos,sourcesHTML,clipperHTML,cardHTML,SUG,APPS};
})();
(function(){
'use strict';
const D=window.__D,V=window.__V;
const {$,$$,esc,ic,hash,P,av,SECTS,SECT,STAGES,sk,SRC,ANS,T,STATUS,byId,RAD,LIB,CONN}=D;
const {S,GL,GN,getAns,flagged,akey,ansByKey,rich,citesIn,bar,line,ring,stagePill,statusPill,ragDot,sector}=V;
const hl=p=>esc(p).replace(/«([^»]*)»/g,'<span class="hl-p">$1</span>');
const hlr=p=>p.replace(/«([^»]*)»/g,'<span class="hl-p">$1</span>');
const claimsOf=key=>{const o={};ansByKey(key).html.replace(/\{([vdu])\|([^|]+)\|([^}]+)\}/g,(m,g,tx,c)=>{o[c]=tx;return m});return o};
const gradeOf=(key,c)=>S.cg[key+':'+c]||ansByKey(key).cl[c].g;
const gp=g=>`<span class="pill ${{v:'ok',d:'warn',u:'bad'}[g]}">${GN[g]}</span>`;
const mention=s=>esc(s).replace(/@(\w+)/g,'<b style="color:var(--accent)">@$1</b>');
const AG=['Plan the question','Search scholarly and patent sources','Extract and cite passages','Cross-check with a second model','Draft summary and flag claims'];
const TABS=[['summary','Summary'],['models','Models'],['evidence','Evidence'],['claims','Claims'],['lenses','Lenses'],['discuss','Discussion'],['case','Final Research Case']];
const grid=(n,min)=>`display:grid;grid-template-columns:repeat(auto-fit,minmax(${min||150}px,1fr));gap:12px`;
const foundSrc=t=>{const ids=[...new Set([...t.src,...((S.extra.added||{})[t.id]||[])])];return t.status==='running'?ids.slice(0,Math.max(1,Math.ceil(ids.length*t.prog/100))):ids};
const srcBtn=n=>`<button class="rsrc" data-act="cite" data-n="${n}">${lg(n)}<span><b>${esc(SRC[n].t)}</b><small>${SRC[n].ty} · ${esc(SRC[n].v)} · ${SRC[n].y}</small></span></button>`;

function stepsHTML(t){const i=STAGES.indexOf(t.stage);return `<div class="steps">${STAGES.map((s,j)=>`<div class="stp ${j<i?'done':j===i?'cur':''}"><i>${j<i?'✓':j+1}</i>${s}</div>`).join('')}</div>`}
function primary(t){
 if(t.status==='running')return `<button class="btn" data-act="notifyMe" data-id="${t.id}">${ic('bell',14)} Notify me when done</button>`;
 if(t.status==='review')return `<button class="btn pri" data-act="submitVP" data-id="${t.id}">Submit for VP approval</button>`;
 if(t.status==='vp')return S.role==='vp'?`<button class="btn ok" data-act="approve" data-id="${t.id}">${ic('check',14)} Approve</button><button class="btn" data-act="changes" data-id="${t.id}">Request changes</button>`:`<button class="btn" data-act="nudge" data-id="${t.id}">${ic('bell',14)} Nudge reviewer</button>`;
 if(t.status==='blocked')return `<button class="btn pri" data-act="unblock" data-id="${t.id}">Resolve blocker</button>`;
 return `<button class="btn" data-act="reopen" data-id="${t.id}">Reopen task</button>`}
function drawerHTML(t){
 return `<div class="dh"><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">${sector(t.sector)}${stagePill(t)}${statusPill(t)}<span class="grow"></span><button class="iconbtn" data-act="exportCase" data-id="${t.id}" data-tip="Export business case">${ic('file',17)}</button><button class="iconbtn" data-act="moveMenu" data-id="${t.id}" data-tip="Move to stage">${ic('more',17)}</button><button class="iconbtn" data-act="closeAll" aria-label="Close">${ic('x',18)}</button></div>
 <h2>${esc(t.title)}</h2>
 <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-bottom:12px"><span style="display:flex;gap:8px;align-items:center">${av(t.owner)}<span class="muted">${P[t.owner].n}</span></span>${ring(t.acc,34,4)}<span class="muted">Due ${t.due}</span><span style="display:flex;gap:8px;align-items:center"><span class="bar" style="width:100px"><i data-pgb="${t.id}" style="width:${t.prog}%"></i></span><b class="tnum" data-pg="${t.id}">${Math.round(t.prog)}%</b></span><span class="grow"></span>${primary(t)}</div>
 ${stepsHTML(t)}
 <div class="tabs" style="margin-top:6px;border:0">${TABS.map(([k,l])=>`<button class="tab${S.tab===k?' on':''}" data-act="dtab" data-t="${k}">${l}${k==='claims'&&flagged(t)&&t.status!=='running'?`<span class="pill gold" style="margin-left:6px;height:18px;padding:0 6px">${flagged(t)}</span>`:''}</button>`).join('')}</div></div>
 <div class="db" id="dbody">${drawerBody(t)}</div>`}
function drawerBody(t){
 const run=t.status==='running';
 if(S.tab==='summary')return run?runHTML(t):sumTab(t);
 if(S.tab==='evidence')return evTab(t);
 if(S.tab==='discuss')return window.__disc(t);
 if(run)return lockHTML(t);
 return {models:()=>V.panelHTML(getAns(t),akey(t)),claims:()=>claimTab(t),lenses:()=>window.__lens(t),case:()=>caseTab(t)}[S.tab]()}
function runHTML(t){const cur=Math.min(4,Math.floor(t.prog/20));
 return `<div class="stack" style="gap:16px"><div class="card sec stack"><div style="display:flex;align-items:center;gap:14px">${window.glow(48)}<span class="pill accent run"><i></i>Agents running</span><b>${Math.round(t.prog)}% complete</b><span class="faint">about ${Math.max(1,Math.round((100-t.prog)/9))} min remaining</span></div>
 ${AG.map((s,i)=>`<div style="display:flex;gap:10px;align-items:center"><span style="width:20px;display:grid;place-items:center">${i<cur?`<span style="color:var(--ok)">${ic('check',16)}</span>`:i===cur?'<span class="pill accent run" style="padding:0;height:auto;background:none"><i></i></span>':'<span class="faint">○</span>'}</span><span class="${i>cur?'faint':''}" style="${i===cur?'font-weight:600':''}">${s}</span></div>`).join('')}</div>
 <div class="hint">${ic('shield',18)} Results Unlock When The Run Finishes</div>
 <div><div class="eyebrow" style="margin-bottom:8px">Found so far · ${foundSrc(t).length} sources</div><div class="stack" style="gap:8px">${foundSrc(t).map(srcBtn).join('')}</div></div></div>`}
function lockHTML(t){return `<div class="card sec" style="display:flex;gap:14px;align-items:center;padding:16px 18px">${ic('shield',22)}<div class="grow"><b style="font-size:15px">Available When Agents Finish</b><div class="muted">${Math.round(t.prog)}% Complete</div></div><button class="btn sm" data-act="dtab" data-t="evidence">See Evidence So Far</button></div>`}
function sumTab(t){
 const a=getAns(t),k=akey(t),cl=Object.keys(a.cl),vv=cl.filter(c=>gradeOf(k,c)==='v').length,cs=citesIn(a.html);
 const tile=(l,v,s)=>`<div class="tile"><div class="eyebrow">${l}</div><div style="font-size:24px;font-weight:700;letter-spacing:-.02em;margin-top:2px">${v}</div><div class="faint" style="font-size:12px">${s}</div></div>`;
 return `<div class="stack" style="gap:18px">
 ${t.blk?`<div class="pill bad" style="height:auto;padding:10px 14px;white-space:normal;border-radius:12px">${ic('flag',14)} ${esc(t.blk)}</div>`:''}
 <div style="${grid(3,140)}">${tile('Accuracy',a.acc+'%','cross-model verified')}${tile('Claims verified',vv+' of '+cl.length,'both models agree')}${tile('Sources',cs.length,'cited in summary')}${tile('Flags',cl.length-vv,'need a human decision')}</div>
 <div class="card sec"><div class="eyebrow" style="margin-bottom:8px">Research summary</div><div class="abody">${rich(a.html,k)}</div></div>
 <div class="grid2" style="grid-template-columns:1fr 1fr"><div class="card sec"><div class="ct-t eyebrow" style="margin-bottom:6px">${a.ch.t1}</div>${bar(a.ch.l1,a.ch.v1)}</div><div class="card sec"><div class="eyebrow" style="margin-bottom:6px">${a.ch.t2}</div>${line(a.ch.l2,a.ch.v2)}</div></div>
 <div class="card sec"><div class="eyebrow" style="margin-bottom:10px">Possible usage</div><div class="chips">${a.apps.map(x=>`<button class="fchip" data-act="usage" data-u="${esc(x)}" data-tip="Add as a candidate application">${esc(x)}</button>`).join('')}</div></div>
 <div class="card sec" style="border-color:var(--gold)"><div class="eyebrow">Recommended next step</div><p style="margin:6px 0 12px">${a.next}</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pri sm" data-act="advance" data-id="${t.id}">Advance stage</button><button class="btn sm" data-act="dtab" data-t="models">Compare the two models</button><button class="btn sm" data-act="dtab" data-t="claims">Review flagged claims</button></div></div></div>`}
function evTab(t){
 const ids=foundSrc(t);
 return `<div class="stack" style="gap:12px"><div class="muted">${ids.length} source${ids.length>1?'s':''} behind this task${t.status==='running'?' so far':''}. Passages are the exact text the models relied on.</div>${ids.map(n=>{const s=SRC[n];return `<div class="card sec stack" style="gap:10px"><div style="display:flex;gap:10px;align-items:flex-start">${lg(n)}<div class="grow"><b style="line-height:1.35">${esc(s.t)}</b><div class="faint" style="font-size:12.5px">${s.ty} · ${esc(s.v)} · ${s.y}</div></div><div style="text-align:right;min-width:80px"><div class="faint" style="font-size:11.5px">Relevance</div><b>${s.rel}%</b></div></div><div class="quote">${hl(s.p)}</div><div style="display:flex;gap:8px"><button class="btn sm" data-act="cite" data-n="${n}">Open detail</button><button class="btn sm ghost" data-act="copyCite" data-n="${n}">${ic('copy',13)} Copy citation</button></div></div>`}).join('')}</div>`}
function claimTab(t){
 const k=akey(t),a=getAns(t),cs=claimsOf(k);
 return `<div class="stack" style="gap:12px"><div class="muted">Every claim carries a grade from the two-model check. Change a grade after your own review and the accuracy score updates.</div>${Object.keys(cs).map(c=>{const g=gradeOf(k,c),m=a.cl[c];return `<div class="card sec stack" style="gap:8px"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${gp(g)}<span class="faint">${m.s.length} source${m.s.length>1?'s':''}</span><span class="grow"></span>${m.s.map(n=>`<button class="cite" data-act="cite" data-n="${n}" data-tip="${esc(SRC[n].t)}">${n}</button>`).join('')}</div><div style="font-size:14.5px;line-height:1.5">“${cs[c]}”</div><div class="muted" style="font-size:13px">${esc(m.n)}</div><div style="display:flex;gap:6px;flex-wrap:wrap">${['v','d','u'].map(x=>`<button class="fchip${g===x?' on':''}" data-act="setGrade" data-k="${k}:${c}" data-g="${x}">${GN[x]}</button>`).join('')}<button class="btn sm ghost" data-act="claim" data-k="${k}:${c}">Open evidence ${ic('chev',12)}</button></div></div>`}).join('')}</div>`}
const LN=[['rd','R&D'],['fin','Finance'],['mkt','Marketing'],['leg','Legal']];
function lensTab(t){
 const a=getAns(t),L=a.lens[S.lens],c=L.c;
 return `<div class="stack" style="gap:14px"><div class="lensbar"><span class="muted">Department lens</span>${LN.map(([k,l])=>`<button class="fchip${S.lens===k?' on':''}" data-act="lens" data-l="${k}">${l}</button>`).join('')}${S.lens==='fin'||S.lens==='leg'?'<span class="gold-tag">Illustrative for the pilot</span>':''}</div>
 <div class="card sec stack" style="gap:12px"><h3 style="margin:0;font:400 24px/1.2 var(--serif)">${esc(L.h)}</h3><ul class="plain">${L.b.map(x=>`<li>${rich(esc(x).replace(/&#39;/g,"'"),akey(t))}</li>`).join('')}</ul></div>
 <div class="card sec"><div class="eyebrow" style="margin-bottom:6px">${c[0]}</div>${bar(c[1],c[2])}</div></div>`}
function comments(t){return [...(getAns(t).cm||[]),...(S.comments[t.id]||[])]}
function discTab(t){
 return `<div class="stack" style="gap:14px">${comments(t).map(c=>`<div class="cmt${c[0]==='amina'&&S.role==='researcher'?' mine':''}">${av(c[0],1)}<div class="bub"><b>${P[c[0]].n}</b> <span class="faint">${c[2]}</span><div style="margin-top:2px">${mention(c[1])}</div></div></div>`).join('')}
 <div style="display:flex;gap:8px;align-items:flex-end"><textarea class="in" id="cmtIn" rows="2" placeholder="Add a comment. Use @name to ask someone to look."></textarea><button class="btn pri" data-act="post" data-id="${t.id}">Post</button></div></div>`}
function bizDoc(t){
 const a=getAns(t),fin=a.lens.fin,leg=a.lens.leg,cs=[...new Set([...citesIn(a.html),...t.src])];
 return `<div class="docp"><div class="eyebrow">Final Research Case · ${t.code} · Halden R&D</div><h1>${esc(t.title)}</h1><div class="faint">Prepared for Halden R&D by ${P[t.owner].n} · ${t.due} · Evidence accuracy ${a.acc}%</div>
 <div><h4>Executive summary</h4><p>${esc(a.lens.rd.h)}. ${esc(fin.h)}. ${esc(a.next)}</p></div>
 <div><h4>Evidence base</h4><div class="abody">${rich(a.html,akey(t))}</div></div>
 <div style="${grid(2,240)}"><div><h4>${fin.c[0]}</h4>${bar(fin.c[1],fin.c[2])}</div><div><h4>${a.ch.t2}</h4>${line(a.ch.l2,a.ch.v2)}</div></div>
 <div><h4>Risks and open items</h4><ul class="plain">${leg.b.map(x=>`<li>${rich(esc(x),akey(t))}</li>`).join('')}${Object.keys(a.cl).filter(c=>gradeOf(akey(t),c)!=='v').map(c=>`<li>${GN[gradeOf(akey(t),c)]} claim: ${esc(claimsOf(akey(t))[c])}</li>`).join('')}</ul></div>
 <div><h4>References</h4><ol style="margin:0;padding-left:20px;font-size:13px;line-height:1.6">${cs.map(n=>`<li value="${n}">${esc(SRC[n].t)}. ${esc(SRC[n].v)}, ${SRC[n].y}.</li>`).join('')}</ol></div></div>`}
function caseTab(t){
 return `<div class="stack" style="gap:14px"><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><button class="btn pri" data-act="exportCase" data-id="${t.id}">${ic('file',15)} Export business case</button><button class="btn" data-act="copyCase" data-id="${t.id}">${ic('copy',15)} Copy summary</button></div>${window.__case(t)}</div>`}

/* ===== executive ===== */
function execHTML(){
 const ap=T.filter(t=>t.status==='vp'),bn=T.filter(t=>t.status==='blocked'||t.rag==='r'),act=T.filter(t=>t.stage!=='Decided');
 const own=['amina','sara','james','mei','tomas'];
 const k=(l,v,s)=>`<div class="card kpi"><span class="eyebrow">${l}</span><b>${v}</b><small>${s}</small></div>`;
 return `<div class="page"><div class="ph"><div><h1>Executive overview</h1><p>What needs your decision, where work is stuck, and how the research engine is performing.</p></div></div>
 <div class="kpis">${k('Pending approvals',ap.length,'waiting for you')}${k('Median cycle time','23 days','down from 31 last quarter')}${k('Bottlenecks',bn.length,'blocked or at risk')}${k('Decisions this quarter',9,'6 advanced, 3 parked')}${k('Avg accuracy',Math.round(T.reduce((a,t)=>a+t.acc,0)/T.length)+'%','across active research')}</div>
 <div class="grid2" style="margin-bottom:16px"><div class="card vpq"><div style="display:flex;align-items:center;gap:10px"><b style="font-size:16px">Approval queue</b><span class="pill gold">${ap.length}</span></div>
  ${ap.length?ap.map(t=>`<div class="card sec" style="box-shadow:none"><div style="display:flex;gap:10px;align-items:flex-start"><div class="grow"><b>${esc(t.title)}</b><div class="faint" style="font-size:12.5px">${t.code} · ${P[t.owner].n} · ${t.stage}</div></div>${ring(t.acc,38,4)}</div><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"><button class="btn sm" data-act="openTask" data-id="${t.id}">Review summary</button><button class="btn sm ok" data-act="approve" data-id="${t.id}">${ic('check',13)} Approve</button><button class="btn sm" data-act="changes" data-id="${t.id}">Request changes</button>${flagged(t)?`<span class="pill gold">${flagged(t)} flagged</span>`:''}</div></div>`).join(''):`<div class="card sec" style="box-shadow:none;text-align:center"><b>Queue is clear</b><div class="muted">New submissions will appear here. Next expected: R-106 once Jeff submits.</div><button class="btn sm" style="margin-top:10px" data-act="nav" data-r="list">See tasks in review</button></div>`}</div>
 <div class="card vpq"><b style="font-size:16px">Bottlenecks</b>${bn.map(t=>`<button class="hi" data-act="openTask" data-id="${t.id}" style="align-items:flex-start">${ragDot(t)}<div class="grow"><b style="font-size:13.5px">${esc(t.title)}</b><div class="muted" style="font-size:12.5px">${esc(t.blk||'At risk against due date '+t.due)}</div></div><span class="faint tnum">${3+hash(t.id)%9}d</span></button>`).join('')||'<div class="muted">No blockers right now.</div>'}<div class="eyebrow" style="margin-top:6px">Days waiting by stage</div>${bar(STAGES.slice(0,3).concat(['Review']),[9,14,21,6],{h:150})}</div></div>
 <div class="grid3" style="margin-bottom:16px"><div class="card sec"><div class="eyebrow" style="margin-bottom:6px">Throughput (decisions per month)</div>${line(['Jun','Jul','Aug','Sep','Oct','Nov'],[2,3,3,5,4,6],{h:160})}</div><div class="card sec"><div class="eyebrow" style="margin-bottom:6px">Workload (active tasks)</div>${bar(own.map(o=>P[o].n.split(' ')[0]),own.map(o=>act.filter(t=>t.owner===o).length),{h:160})}</div><div class="card sec"><div class="eyebrow" style="margin-bottom:6px">Accuracy by sector</div>${bar(SECTS.map(s=>s.slice(0,5)),SECTS.map(s=>{const g=T.filter(t=>t.sector===s);return g.length?Math.round(g.reduce((a,t)=>a+t.acc,0)/g.length):88}),{h:160})}</div></div>
 <div class="grid2"><div class="card sec stack"><b style="font-size:16px">Feedback loop</b><div class="muted">Reviewer decisions feed back into retrieval and prompts, so each cycle starts better than the last.</div>${[['Reviewers rejected 4 unsourced market figures','Retrieval now requires a primary source for any figure'],['Disputed claims resolved in 2.1 days on average','Disagreements route to the owner automatically'],['Finance asked for sensitivity ranges','Business case template now includes a range']].map(x=>`<div class="tile"><b style="font-size:13.5px">${x[0]}</b><div class="muted" style="font-size:12.5px">${ic('chev',11)} ${x[1]}</div></div>`).join('')}</div>
 <div class="card sec stack"><b style="font-size:16px">Team</b><div class="hier"><div style="display:flex;gap:10px;align-items:center;padding:6px 0">${av('priya',1)}<div><b>Dr. Priya Nair</b><div class="faint" style="font-size:12px">VP, R&amp;D</div></div></div>${[['amina','Lead researcher',['sara','james','mei']],['tomas','Dept. reviewer (Finance)',[]]].map(([o,r,ch])=>`<div style="margin-left:22px;border-left:2px solid var(--line);padding-left:14px"><div style="display:flex;gap:10px;align-items:center;padding:6px 0">${av(o,1)}<div><b>${P[o].n}</b><div class="faint" style="font-size:12px">${r} · ${act.filter(t=>t.owner===o).length} active</div></div></div>${ch.map(c=>`<div style="margin-left:22px;border-left:2px solid var(--line);padding-left:14px;display:flex;gap:10px;align-items:center;padding-top:4px;padding-bottom:4px">${av(c)}<div><b style="font-size:13.5px">${P[c].n}</b><span class="faint" style="font-size:12px"> · ${act.filter(t=>t.owner===c).length} active</span></div></div>`).join('')}</div>`).join('')}</div></div></div></div>`}

/* ===== modal pieces ===== */
const mwrap=(title,body,foot,wide)=>`<div class="mbox${wide?' wide':''}"><div class="sh"><b style="font-size:16px">${title}</b><span class="grow"></span><button class="iconbtn" data-act="closeModal" aria-label="Close">${ic('x',18)}</button></div><div style="padding:18px 20px;overflow:auto;flex:1">${body}</div>${foot?`<div style="padding:12px 20px;border-top:1px solid var(--line);display:flex;gap:8px;justify-content:flex-end;align-items:center">${foot}</div>`:''}</div>`;
const WS=['Question','Scope','Sources','Models','Launch'];
function wizHTML(){
 const w=S.wiz,d=w.d,st=w.step;
 const steps=`<div class="wiz-steps">${WS.map((s,i)=>`<div style="flex:1"><div style="height:4px;border-radius:4px;background:${i<=st?'var(--accent)':'var(--line2)'}"></div><div class="faint" style="font-size:11.5px;margin-top:4px;${i===st?'color:var(--fg);font-weight:600':''}">${i+1}. ${s}</div></div>`).join('')}</div>`;
 const opt=(act,k,v,t,s,on)=>`<button class="opt${on?' on':''}" data-act="${act}" data-k="${k}" data-v="${esc(v)}"><span class="cb">${on?ic('check',12):''}</span><span><b>${t}</b><div class="faint" style="font-size:12.5px">${s}</div></span></button>`;
 let b='';
const MIC='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3zM6 11a6 6 0 0012 0M12 17v4"/></svg>';
 if(st===0)b=`<div class="stack"><div class="field"><label style="display:flex;align-items:center;gap:8px">What do you want to find out?<span class="grow"></span><button class="btn sm${S.rec?' rec':''}" id="mic" data-act="mic">${MIC}<span>${S.rec?'Stop':'Record'}</span></button><button class="btn sm" id="tidy" data-act="tidy">${ic('spark',14)} Tidy up</button></label><textarea class="in" id="wq" rows="5" placeholder="Type it, or hit Record and talk it through. Rough notes are fine.">${esc(d.q)}</textarea><div class="faint" style="font-size:12px;margin-top:4px">Speak freely. Tidy up turns rough notes into a clear research question.</div></div><div class="field"><label>Working title</label><input class="in" id="wt" value="${esc(d.title)}" placeholder="Short name for the portfolio"></div></div>`;
 if(st===1)b=`<div class="stack"><div class="field"><label>Research area</label><div class="chips">${SECTS.map(s=>`<button class="fchip${d.sector===s?' on':''}" data-act="wset" data-k="sector" data-v="${s}">${s}</button>`).join('')}</div></div><div class="field"><label>Priority</label><div class="seg">${['Low','Medium','High'].map(s=>`<button class="${d.pri===s?'on':''}" data-act="wset" data-k="pri" data-v="${s}">${s}</button>`).join('')}</div></div></div>`;
 if(st===2){const SN={Scholar:['Scholarly journals','Google Scholar, arXiv, publisher feeds','Paste a paper, DOI or journal link'],Patents:['Patent filings','USPTO, EPO, WIPO','Paste a patent number or link'],IEEE:['Standards and conference papers','IEEE Xplore, UL, ISO','Paste a standard or paper link'],Web:['Live web and news','Cited, dated and attributable','Paste a page or site to include'],Uploads:['Your upload library','Reports and notes already indexed','Paste a document link or attach a file']};
  const o=d.open&&d.src.includes(d.open)?d.open:null,items=o?(d.res[o]||[]):[];
  b=`<div class="stack" style="gap:8px">${Object.keys(SN).map(k=>opt('wsrc','src',k,SN[k][0],SN[k][1],d.src.includes(k))).join('')}${o?`<div class="wpanel card sec stack" style="gap:10px;box-shadow:none;border-color:var(--accent)"><div style="display:flex;align-items:center"><b>Add to ${SN[o][0]}</b><span class="grow"></span><button class="iconbtn" style="width:26px;height:26px" data-act="wclose" aria-label="Collapse">${ic('down',15)}</button></div><div style="display:flex;gap:8px"><input class="in" id="wlink" placeholder="${SN[o][2]}"><button class="btn pri" data-act="wadd">Add</button></div><div><button class="btn sm" data-act="wfile">${ic('upload',14)} Attach a file</button></div>${items.length?`<div class="stack" style="gap:6px">${items.map((x,i)=>`<div class="tile" style="display:flex;gap:8px;align-items:center;padding:8px 10px">${ic(x.f?'file':'link',14)}<span class="grow" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px">${esc(x.v)}</span><button class="iconbtn" style="width:24px;height:24px" data-act="wdel" data-i="${i}" aria-label="Remove">${ic('x',13)}</button></div>`).join('')}</div>`:''}</div>`:''}</div>`}
 if(st===3)b=`<div class="stack" style="gap:8px">${[['panel','Perplexity Sonar + Gemini','Recommended. Two models, every claim cross-checked'],['pplx','Perplexity Sonar only','Single-model web-grounded mode']].map(([k,t,s])=>opt('wset','model',k,t,s,d.model===k)).join('')}<div class="faint" style="font-size:12px">US-acceptable models only.</div></div>`;
 if(st===4)b=`<div class="stack"><div class="card sec stack" style="box-shadow:none"><b style="font-size:16px">${esc(d.title||d.q||'New research task')}</b><div class="muted">${esc(d.q||'')}</div><div class="chips"><span class="pill accent">${d.sector}</span><span class="pill gold">${d.pri} priority</span><span class="pill">${d.src.length} source group${d.src.length===1?'':'s'}</span><span class="pill">${{panel:'Sonar + Gemini',pplx:'Sonar'}[d.model]}</span></div></div><div class="faint" style="font-size:13px">It starts in Discovery and is ready for review in a few minutes.</div></div>`;
 return mwrap('New research task',steps+b,`${st>0?'<button class="btn" data-act="wback">Back</button>':'<button class="btn ghost" data-act="closeModal">Cancel</button>'}${st<4?'<button class="btn pri" data-act="wnext">Continue</button>':'<button class="btn pri" data-act="wlaunch">Launch research</button>'}`)}
function exportHTML(t){return mwrap('Export business case',`<div class="hint" style="margin-bottom:12px">${ic('file',16)} Preview of the PDF. Citations, charts and flagged claims are included.</div>${bizDoc(t)}`,`<button class="btn" data-act="closeModal">Close</button><button class="btn pri" data-act="doExport" data-id="${t.id}">${ic('upload',14)} Generate PDF</button>`,true)}
function cmdkHTML(q){
 q=(q||'').toLowerCase();
 const ts=T.filter(t=>!q||(t.title+t.code+t.sector).toLowerCase().includes(q)).slice(0,5);
 const ss=Object.keys(SRC).filter(n=>!q||(SRC[n].t+SRC[n].v).toLowerCase().includes(q)).slice(0,4);
 const rs=RAD.filter(r=>q&&r.t.toLowerCase().includes(q)).slice(0,3);
 const it=(act,attrs,icn,t,s)=>`<button class="pi" data-act="${act}" ${attrs}>${ic(icn,16)}<span><b>${t}</b><div class="faint" style="font-size:12px">${s}</div></span></button>`;
 return `<div class="mbox" style="margin-bottom:auto;margin-top:8vh"><div style="padding:14px 16px;border-bottom:1px solid var(--line);display:flex;gap:10px;align-items:center">${ic('search',18)}<input id="ckin" class="in" style="border:0;box-shadow:none;background:none;flex:1;font-size:16px" placeholder="Search tasks, sources and signals, or ask a question" value="${esc(q)}" autocomplete="off"></div>
 <div style="overflow:auto;padding:8px" class="pop-list">${q?`<div class="pop" style="position:static;box-shadow:none;border:0;max-width:none;animation:none;padding:0">${it('askFrom',`data-q="${esc(q)}"`,'spark','Ask Halden: “'+esc(q)+'”','Answer from all indexed sources, with citations')}</div>`:''}
 <div class="pop" style="position:static;box-shadow:none;border:0;max-width:none;animation:none;padding:0"><h5>Tasks</h5>${ts.map(t=>it('openTask',`data-id="${t.id}"`,'list',esc(t.title),t.code+' · '+STATUS[t.status][0])).join('')||'<div class="faint" style="padding:8px 10px">No matching tasks, try asking instead.</div>'}<h5>Sources</h5>${ss.map(n=>it('cite',`data-n="${n}"`,'file',esc(SRC[n].t),SRC[n].ty+' · '+SRC[n].y)).join('')}${rs.length?`<h5>Radar signals</h5>${rs.map(r=>it('rjump',`data-id="${r.id}"`,'radar',esc(r.t),RAD&&D.RINGS[r.ring])).join('')}`:''}</div></div></div>`}
const NOTIFS=[['t102','Agents finished the cooling comparison','R-102 is ready for review','12 min'],['t101','Sara flagged a claim','Yield figure in R-101 is disputed','2 h'],['t108','Blocker added','Supplier test report is outstanding','Yesterday'],['t106','Tomás signed off the margin model','R-106 can go to the VP','Yesterday']];
window.__W={drawerHTML,drawerBody,execHTML,wizHTML,exportHTML,cmdkHTML,mwrap,claimsOf,gradeOf,gp,hl,hlr,srcBtn,NOTIFS,comments,AG,mention};
})();
(function(){
'use strict';
const D=window.__D,V=window.__V,W=window.__W;
const {$,$$,esc,ic,hash,P,SRC,T,byId,RAD}=D;
const {S,GN,getAns,akey,citesIn,bar,line}=V;
const {claimsOf,gradeOf,comments}=W;
const plain=h=>h.replace(/\{([vdu])\|([^|]+)\|[^}]+\}/g,'<span class="g-$1">$2</span>').replace(/\[(\d+)\]/g,'<sup class="rf">[$1]</sup>');
const rf=s=>esc(s).replace(/\[(\d+)\]/g,'<sup class="rf">[$1]</sup>');
const gpill=g=>`<span class="gp g-${g}">${GN[g]}</span>`;
const trunc=(s,n)=>s.length>n?s.slice(0,n-1)+'…':s;
const kp=(l,v,s)=>`<div class="kp"><b>${v}</b><span>${l}</span><i>${s}</i></div>`;
let CUR=null;
const FT=(t,sec)=>`<div class="ft"><span>Halden R&amp;D · ${esc(trunc(t.title,56))}</span><span>${sec}</span><span class="pn"></span></div>`;
const SL=(t,sec,k,h,body)=>`<section class="sl"><div class="bar4"></div><div class="hd"><div class="kk">${k}</div><h2>${h}</h2></div><div class="sb">${body}</div>${FT(t,sec)}</section>`;
const tbl=(head,rows,cls)=>`<table class="st ${cls||''}"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
function srcList(t,a){const base=[...new Set([...citesIn(a.html),...t.src])];Object.keys(SRC).map(Number).sort((x,y)=>hash(t.id+x)-hash(t.id+y)).forEach(n=>{if(base.length<8&&!base.includes(n))base.push(n)});return base.slice(0,8)}
function nums(p){const out=[],seen={};p.replace(/(\d[\d.,]*)\s?(%|µm|Ω·cm²|K\/W|kWh|GWh|mA·cm⁻²|nm|L\/min|W\/mK|×|h|s)?/g,(m,v,u,off)=>{const val=(v+(u||'')).replace(/[.,]$/,'');if((v.length<2&&!u)||seen[val])return m;seen[val]=1;out.push([val,p.slice(Math.max(0,off-38),off).replace(/[«»]/g,'').trim().split(/\s+/).slice(-4).join(' ')||'Reported value']);return m});return out.slice(0,6)}
function srcSlide(t,n,i,tot){
 const s=SRC[n],a=getAns(t),k=akey(t),cs=claimsOf(k),sup=Object.keys(a.cl).filter(c=>a.cl[c].s.includes(n)),h=hash(t.id+n),nm=nums(s.p);
 const used=T.filter(x=>x.src.includes(n)).length;
 return SL(t,'Evidence','Evidence '+(i+1)+' of '+tot,esc(trunc(s.t,86)),`<div class="c2">
 <div class="stk">${tbl(['Field','Detail'],[['Source type',s.ty],['Publisher',esc(s.v)],['Year',s.y],['Relevance',s.rel+'%  <span class="rbar"><i style="width:'+s.rel+'%"></i></span>'],['Citation check',s.ok?'<span class="g-v">Verified against full text</span>':'<span class="g-d">Needs manual check</span>'],['Used in',used+' research task'+(used===1?'':'s')]])}
 <div class="qt">${esc(s.p).replace(/«([^»]*)»/g,'<mark>$1</mark>')}</div>
 ${tbl(['Extracted value','Context'],nm.length?nm.map(x=>[`<b>${esc(x[0])}</b>`,esc(x[1])]):[['<b>n/a</b>','Qualitative evidence']],'tight')}</div>
 <div class="stk"><div class="bx"><div class="bt">Claims this source supports</div>${sup.length?sup.map(c=>`<div class="li2">${gpill(gradeOf(k,c))} ${rf(cs[c])}</div>`).join(''):'<div class="li2">Background context for the research question. Not tied to a single claim.</div>'}</div>
 <div class="bx"><div class="bt">Model readings</div><div class="li2"><b>Perplexity Sonar</b> retrieved this passage at rank ${1+h%3} with ${88+h%10}% text match.</div><div class="li2"><b>Gemini</b> cross-checked the wording against the full text. Agreement ${86+(h>>2)%12}%.</div></div>
 <div class="bx"><div class="bt">Reviewer note</div><div class="li2 ph">Click to add a note on how this source should be weighted.</div></div>
 <div class="bx"><div class="bt">Citation</div><div class="li2 cit">${esc(s.t)}. ${esc(s.v)}, ${s.y}.</div></div></div></div>`)}
function genDeck(t){
 const a=getAns(t),k=akey(t),cs=claimsOf(k),ckeys=Object.keys(a.cl),L=a.lens,ids=srcList(t,a),own=P[t.owner].n;
 const gs=ckeys.map(c=>gradeOf(k,c)),vv=gs.filter(g=>g==='v').length,sec=[];
 const sl=[];const add=(sc,h)=>{sl.push(h);if(sc&&!sec.find(x=>x[0]===sc))sec.push([sc,sl.length+1])};
 // 1 title
 sl.push(`<section class="sl cover"><div class="cv-in"><div class="kk">Final Research Case</div><h1>${esc(t.title)}</h1><p>Prepared for Halden R&amp;D · ${esc(own)} · ${t.due}</p><div class="cv-ft"><span>Evidence accuracy ${a.acc}%</span><span>${ids.length} sources · ${ckeys.length} claims checked</span><span>Draft for review</span></div></div></section>`);
 sl.push('@@CONTENTS@@');
 add('Summary',SL(t,'Summary','Executive summary',esc(L.rd.h),`<div class="c2"><div class="stk"><div class="abd">${plain(a.html)}</div><div class="co">Recommendation: ${esc(a.next)}</div></div><div class="stk"><div class="kps">${kp('Accuracy',a.acc+'%','cross-model verified')}${kp('Claims verified',vv+' of '+ckeys.length,'both models agree')}${kp('Sources',ids.length,'scholarly, patent, internal')}${kp('Open flags',ckeys.length-vv,'need a decision')}</div><div class="bx"><div class="bt">Headline by department</div>${[['rd','R&amp;D'],['fin','Finance'],['mkt','Marketing'],['leg','Legal']].map(([x,l])=>`<div class="li2"><b>${l}:</b> ${esc(L[x].h)}</div>`).join('')}</div></div></div>`));
 add('Scope',SL(t,'Scope','Research question and scope','What we set out to establish',`<div class="c2"><div class="stk"><div class="bx"><div class="bt">Question</div><div class="li2">${esc(t.title)}. Establish technical feasibility, evidence quality, cost and risk, and a recommended next gate.</div></div><div class="bx"><div class="bt">In scope</div><ul><li>${esc(t.sector)} evidence from journals, patents, standards and internal reports</li><li>Cross-model verification of every factual claim</li><li>Department views for R&amp;D, Finance, Marketing and Legal</li></ul></div><div class="bx"><div class="bt">Out of scope</div><ul><li>Production-scale process design</li><li>Supplier contract negotiation</li></ul></div></div><div class="stk">${tbl(['Field','Detail'],[['Task owner',esc(own)],['Stage',t.stage],['Priority',t.pri],['Due',t.due],['Progress',Math.round(t.prog)+'%'],['Accuracy',a.acc+'%'],['Models','Perplexity Sonar, Gemini']])}<div class="bx"><div class="bt">Success criteria</div><ul><li>All headline claims verified or flagged</li><li>Decision-ready recommendation for the next gate</li></ul></div></div></div>`));
 add('Method',SL(t,'Method','Method','Two models, one evidence base',`<div class="c2"><div class="stk"><div class="steps4">${['Plan','Search','Extract','Cross-check','Draft'].map((x,i)=>`<div><b>${i+1}</b><span>${x}</span></div>`).join('')}</div><div class="bx"><div class="bt">How claims are graded</div><div class="li2">${gpill('v')} Both models retrieve matching text from at least one primary source.</div><div class="li2">${gpill('d')} Sources disagree on the figure or the interpretation.</div><div class="li2">${gpill('u')} No primary source found. Needs a human decision.</div></div></div><div class="stk">${tbl(['Source group','Used','Examples'],[['Scholarly journals',ids.filter(n=>SRC[n].ty==='Journal').length,'Journal articles, preprints'],['Patent filings',ids.filter(n=>SRC[n].ty==='Patent').length,'USPTO, EPO, WIPO'],['Standards',ids.filter(n=>SRC[n].ty==='Standard').length,'UN, IEC, MIL-STD'],['Internal reports',ids.filter(n=>/Internal|Interview|Report/.test(SRC[n].ty)).length,'Lab reports, notes'],['Web and news',ids.filter(n=>SRC[n].ty==='Web').length,'Dated and attributed']])}<div class="bx"><div class="bt">Models</div><div class="li2"><b>Perplexity Sonar:</b> live research and citations.</div><div class="li2"><b>Gemini:</b> reasoning and synthesis.</div></div></div></div>`));
 add('Findings',SL(t,'Findings','Key findings','What the evidence says',`<div class="c2"><div class="stk">${L.rd.b.map((b,i)=>`<div class="fnd"><b>${i+1}</b><div>${rf(b)}</div></div>`).join('')}${ckeys.map((c,i)=>`<div class="fnd s"><b>${gpill(gs[i])}</b><div>${esc(cs[c])}</div></div>`).join('')}</div><div class="stk"><div class="bx"><div class="bt">${esc(L.rd.c[0])}</div>${bar(L.rd.c[1],L.rd.c[2],{h:190})}</div></div></div>`));
 add('Evidence',SL(t,'Evidence','Evidence overview','Where the evidence comes from',`<div class="kps k4">${kp('Sources',ids.length,'all cited')}${kp('Avg relevance',Math.round(ids.reduce((x,n)=>x+SRC[n].rel,0)/ids.length)+'%','across sources')}${kp('Citations verified',ids.filter(n=>SRC[n].ok).length+' of '+ids.length,'checked in full text')}${kp('Newest',Math.max(...ids.map(n=>SRC[n].y)),'publication year')}</div><div class="c2"><div class="bx">${bar(a.ch.l1,a.ch.v1,{h:170})}<div class="cap">${a.ch.t1}</div></div><div class="bx">${line(a.ch.l2,a.ch.v2,{h:170})}<div class="cap">${a.ch.t2}</div></div></div>`));
 ids.forEach((n,i)=>add(i===0?'Source evidence':null,srcSlide(t,n,i,ids.length)));
 add('Evidence matrix',SL(t,'Evidence','Evidence matrix','All sources side by side',tbl(['#','Source','Type','Publisher','Year','Relevance','Check','Supports'],ids.map(n=>[n,esc(trunc(SRC[n].t,52)),SRC[n].ty,esc(trunc(SRC[n].v,24)),SRC[n].y,SRC[n].rel+'%',SRC[n].ok?'<span class="g-v">Verified</span>':'<span class="g-d">Check</span>',ckeys.filter(c=>a.cl[c].s.includes(n)).map(c=>c.toUpperCase()).join(', ')||'Context']))));
 add('Claims',SL(t,'Claims','Claims register','Every claim, graded',tbl(['Claim','Grade','Sources','Reviewer note'],ckeys.map((c,i)=>[esc(cs[c]),gpill(gs[i]),a.cl[c].s.map(n=>'['+n+']').join(' '),esc(a.cl[c].n)]))+`<div class="co" style="margin-top:12px">${vv} of ${ckeys.length} claims verified. ${ckeys.length-vv} need a human decision before sign-off.</div>`));
 add('Review log',SL(t,'Claims','Review log','Discussion and decisions so far',tbl(['When','Who','Comment'],comments(t).map(c=>[c[2],esc(P[c[0]].n),esc(c[1])]).concat([['Pending','Dr. Priya Nair','Awaiting business case review'],['Pending','Tomás Rivera','Finance check on cost assumptions']]))));
 add('Models',SL(t,'Models','Model panel','Where the two models agree and differ',`<div class="c2">${a.panel.map(p=>`<div class="bx"><div class="bt">${p.m}</div><div class="li2"><b>${p.v}</b> · confidence ${p.cf}%</div><ul>${p.pts.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><div class="li2">Cites ${p.ci.map(n=>'['+n+']').join(' ')}</div></div>`).join('')}</div><div class="co">${esc(a.dis)}</div>`));
 add('Charts',SL(t,'Data','Data','Supporting charts',`<div class="c2"><div class="bx">${bar(a.ch.l1,a.ch.v1,{h:210})}<div class="cap">${a.ch.t1}</div></div><div class="bx">${line(a.ch.l2,a.ch.v2,{h:210})}<div class="cap">${a.ch.t2}</div></div></div>`));
 add('Applications',SL(t,'Applications','Possible usage','Where this could be applied',`<div class="c2 g4">${a.apps.map((x,i)=>{const h=hash(x+t.id);return `<div class="bx"><div class="bt">${esc(x)}</div><div class="fit"><i style="width:${62+h%34}%"></i></div><div class="li2">Fit score <b>${62+h%34}</b>. ${['Earliest route to a pilot.','Needs a validation run first.','Strong pull from existing accounts.','Longer qualification cycle.'][i%4]}</div></div>`}).join('')}</div>`));
 [['rd','R&amp;D'],['fin','Finance'],['mkt','Marketing'],['leg','Legal']].forEach(([x,l])=>add(x==='rd'?'Department views':null,SL(t,'Department views',l+' view',esc(L[x].h),`<div class="c2"><div class="stk"><ul class="big">${L[x].b.map(b=>`<li>${rf(b)}</li>`).join('')}</ul>${x==='fin'||x==='leg'?'<div class="note">Illustrative figures for the pilot demonstration.</div>':''}</div><div class="bx">${bar(L[x].c[1],L[x].c[2],{h:200})}<div class="cap">${esc(L[x].c[0])}</div></div></div>`)));
 const h0=hash(t.id);
 add('Financials',SL(t,'Financials','Financial outlook','Cost curve and scenarios',`<div class="c2"><div class="bx">${line(['Pilot','Year 1','Year 2','Target'],[100,84,76,72],{h:190})}<div class="cap">Unit cost index</div></div><div class="stk">${tbl(['Scenario','Unit cost index','Payback','5-year NPV'],[['Low',78,(3+h0%2)+'.'+(h0%9)+' yrs','$'+(4+h0%5)+'.2M'],['Base',72,(2+h0%2)+'.'+(h0%9)+' yrs','$'+(9+h0%6)+'.4M'],['High',68,(1+h0%2)+'.'+(h0%9)+' yrs','$'+(14+h0%7)+'.1M']])}<div class="note">Illustrative. Finance to confirm assumptions before sign-off.</div></div></div>`));
 add('Risks',SL(t,'Risks','Risk register','What could go wrong',tbl(['Risk','Likelihood','Impact','Owner','Mitigation'],ckeys.filter((c,i)=>gs[i]!=='v').map(c=>[esc(cs[c]),'Medium','High',esc(own),'Validate with a primary dataset']).concat(L.leg.b.map((b,i)=>[rf(b),['Low','Medium','Low'][i%3],['Medium','Low','High'][i%3],'Legal',['Monitor','Confirm classification','Review annually'][i%3]]),[['Supplier delay','Medium','Medium','Procurement','Dual-source qualification']]))));
 add('Timeline',SL(t,'Plan','Timeline','Path to the next gate',`<div class="gantt">${[['Validation run',0,30],['Pilot build',20,60],['Gate 3 review',55,70],['Scale decision',70,100]].map(r=>`<div class="gr"><span>${r[0]}</span><div class="gt"><i style="left:${r[1]}%;width:${r[2]-r[1]}%"></i></div></div>`).join('')}<div class="gm"><span>Month 1</span><span>Month 3</span><span>Month 5</span><span>Month 6</span></div></div>${tbl(['Milestone','Owner','Date','Dependency'],[['Validation results',esc(own),'Dec 12','Test report'],['Pilot readiness','R&amp;D lead','Feb 6','Supplier samples'],['Gate 3 decision','Dr. Priya Nair','Mar 20','Business case approval']])}`));
 add('Decision',SL(t,'Decision','Recommendation and next steps','Decision requested',`<div class="c2"><div class="stk"><div class="co">${esc(a.next)}</div><div class="bx"><div class="bt">Next steps</div><ul><li>Resolve ${ckeys.length-vv} open claim${ckeys.length-vv===1?'':'s'} with the owner</li><li>Confirm planning range with Finance</li><li>Submit for VP approval</li></ul></div></div><div class="stk"><div class="bx"><div class="bt">Approvals</div>${[['priya','VP, R&amp;D'],['tomas','Finance reviewer']].map(([p,r])=>`<div class="li2"><b>${esc(P[p].n)}</b> · ${r} · <span class="g-d">Pending</span></div>`).join('')}</div><div class="bx"><div class="bt">Budget requested</div><div class="li2"><b>$${180+h0%90}k</b> for the validation and pilot phase.</div></div></div></div>`));
 add('References',SL(t,'Appendix','References','Sources cited',`<ol class="refs">${ids.map(n=>`<li value="${n}">${esc(SRC[n].t)}. ${esc(SRC[n].v)}, ${SRC[n].y}. ${SRC[n].ty}.</li>`).join('')}</ol>`));
 const ci=sl.indexOf('@@CONTENTS@@');
 sl[ci]=SL(t,'Contents','Contents','What is in this document',`<div class="toc">${sec.map(x=>`<div><span>${x[0]}</span><i></i><b>${x[1]}</b></div>`).join('')}</div>`);
 return sl}

/* ---------- editor ---------- */
let menu=null;
const toast=m=>{const e=document.createElement('div');e.className='toast ok';e.innerHTML=ic('check',16)+'<span>'+m+'</span>';$('#toasts').appendChild(e);setTimeout(()=>e.remove(),2600)};
const num=(h,i)=>h.replace('<span class="pn"></span>','<span class="pn">'+(i+1)+'</span>');
const clean=h=>h.replace(/ contenteditable="true"/g,'').replace(/<span class="pn">\d*<\/span>/g,'<span class="pn"></span>');
function shell(){return `<div class="dk" id="deck"><div class="dk-top"><b class="dk-t">${esc(CUR.t.title)}</b><span class="faint" id="dkc"></span><span class="grow"></span>
 <button class="btn sm" data-dk="menuAdd">${ic('plus',14)} New slide</button><button class="btn sm" data-dk="menuSrc">${ic('file',14)} Add evidence slide</button><button class="btn sm" data-dk="dup">${ic('copy',14)} Duplicate</button><button class="btn sm" data-dk="del">Delete</button><button class="btn sm" data-dk="up">Move up</button><button class="btn sm" data-dk="down">Move down</button><button class="btn pri sm" data-dk="pdf">Generate PDF</button><button class="iconbtn" data-dk="close" aria-label="Close">${ic('x',18)}</button></div>
 <div class="dk-tb"><button data-dk="fmt" data-c="bold"><b>B</b></button><button data-dk="fmt" data-c="italic"><i>I</i></button><button data-dk="fmt" data-c="underline"><u>U</u></button><button data-dk="fmt" data-c="insertUnorderedList">• List</button><span class="vr"></span><span class="faint">Insert</span><button data-dk="ins" data-b="text">Text</button><button data-dk="ins" data-b="bullets">Bullets</button><button data-dk="ins" data-b="table">Table</button><button data-dk="ins" data-b="chart">Chart</button><button data-dk="ins" data-b="callout">Callout</button><span class="grow"></span><span class="faint">Click any text on the slide to edit it</span></div>
 <div class="dk-main"><div class="dk-rail" id="dkrail"></div><div class="cvw" id="cvw"><div class="cvp" id="cvp"><div id="cvs"></div></div></div></div>
 <div class="dk-bot"><button class="btn sm" data-dk="prev">Previous</button><span id="dkn"></span><button class="btn sm" data-dk="next">Next</button></div></div>`}
function rail(){const r=$('#dkrail');if(!r)return;const w=r.clientWidth-24,sc=w/960;r.innerHTML=CUR.sl.map((s,i)=>`<div class="th${i===CUR.i?' on':''}" data-dk="sel" data-i="${i}" draggable="true" style="height:${540*sc}px"><div class="thi" style="transform:scale(${sc})">${num(s.html,i)}</div><span class="num">${i+1}</span></div>`).join('')}
function canvas(){const c=$('#cvs'),w=$('#cvw');if(!c)return;const sc=Math.max(.3,Math.min((w.clientWidth-48)/960,(w.clientHeight-48)/540));$('#cvp').style.cssText=`width:${960*sc}px;height:${540*sc}px`;c.style.transform=`scale(${sc})`;c.innerHTML=num(CUR.sl[CUR.i].html,CUR.i);$$('#cvs .hd,#cvs .sb').forEach(e=>e.contentEditable='true');$('#dkn').textContent='Slide '+(CUR.i+1)+' of '+CUR.sl.length;$('#dkc').textContent=CUR.sl.length+' pages'}
function all(){rail();canvas();const on=$('#dkrail .th.on');on&&on.scrollIntoView({block:'nearest'})}
function open(id){const t=byId(id);S.decks=S.decks||{};if(!S.decks[id])S.decks[id]=genDeck(t).map(html=>({html}));CUR={t,sl:S.decks[id],i:0};$('#deck')&&$('#deck').remove();document.body.insertAdjacentHTML('beforeend',shell());all()}
function close(){const d=$('#deck');if(!d)return false;d.remove();closeMenu();CUR=null;return true}
function closeMenu(){if(menu){menu.remove();menu=null}}
function showMenu(btn,html){closeMenu();const m=document.createElement('div');m.className='pop';m.style.zIndex=95;m.innerHTML=html;document.body.appendChild(m);const r=btn.getBoundingClientRect();m.style.left=Math.min(r.left,innerWidth-m.offsetWidth-10)+'px';m.style.top=r.bottom+6+'px';menu=m}
const blank=(h,body)=>SL(CUR.t,'Added','Added slide',h,body);
const LAY={title:()=>blank('Slide title','<ul class="big"><li>First point</li><li>Second point</li><li>Third point</li></ul>'),two:()=>blank('Slide title','<div class="c2"><div class="bx"><div class="bt">Left column</div><div class="li2">Click to edit text.</div></div><div class="bx"><div class="bt">Right column</div><div class="li2">Click to edit text.</div></div></div>'),table:()=>blank('Slide title',tbl(['Item','Detail','Value'],[['Row one','Detail','—'],['Row two','Detail','—'],['Row three','Detail','—']])),chart:()=>blank('Slide title','<div class="c2"><div class="bx">'+bar(['A','B','C','D'],[40,65,52,80],{h:210})+'<div class="cap">Chart title</div></div><div class="bx"><div class="bt">Notes</div><div class="li2">Click to edit text.</div></div></div>'),blank:()=>blank('Slide title','<div class="li2">Click to edit text.</div>')};
const BLK={text:'<div class="li2">New text block. Click to edit.</div>',bullets:'<ul><li>Point one</li><li>Point two</li><li>Point three</li></ul>',table:tbl(['Item','Detail','Value'],[['Row one','Detail','—'],['Row two','Detail','—']]),chart:'<div class="bx">'+bar(['A','B','C','D'],[40,65,52,80],{h:150})+'<div class="cap">Chart title</div></div>',callout:'<div class="co">Key takeaway. Click to edit.</div>'};
const save=()=>{const c=$('#cvs');CUR.sl[CUR.i].html=clean(c.innerHTML);const th=$('#dkrail .th.on .thi');if(th)th.innerHTML=num(CUR.sl[CUR.i].html,CUR.i)};
document.addEventListener('input',ev=>{if(CUR&&ev.target.closest&&ev.target.closest('#cvs'))save()});
document.addEventListener('mousedown',ev=>{if(ev.target.closest&&ev.target.closest('.dk-tb button'))ev.preventDefault()});
document.addEventListener('click',ev=>{
 const el=ev.target.closest&&ev.target.closest('[data-dk]');
 if(menu&&!ev.target.closest('.pop'))closeMenu();
 if(!el||!CUR)return;const a=el.dataset.dk,d=el.dataset;
 const go=i=>{CUR.i=Math.max(0,Math.min(CUR.sl.length-1,i));all()};
 if(a==='sel')go(+d.i);else if(a==='prev')go(CUR.i-1);else if(a==='next')go(CUR.i+1);else if(a==='close')close();
 else if(a==='dup'){CUR.sl.splice(CUR.i+1,0,{html:CUR.sl[CUR.i].html});go(CUR.i+1);toast('Slide duplicated')}
 else if(a==='del'){if(CUR.sl.length<2){toast('A deck needs at least one slide');return}CUR.sl.splice(CUR.i,1);go(CUR.i)}
 else if(a==='up'&&CUR.i>0){const x=CUR.sl.splice(CUR.i,1)[0];CUR.sl.splice(CUR.i-1,0,x);go(CUR.i-1)}
 else if(a==='down'&&CUR.i<CUR.sl.length-1){const x=CUR.sl.splice(CUR.i,1)[0];CUR.sl.splice(CUR.i+1,0,x);go(CUR.i+1)}
 else if(a==='menuAdd'){ev.stopPropagation();showMenu(el,`<h5>Layout</h5>${[['title','Title and bullets'],['two','Two columns'],['table','Table'],['chart','Chart and notes'],['blank','Blank']].map(([k,l])=>`<button class="pi" data-dk="lay" data-k="${k}"><b style="font-weight:600">${l}</b></button>`).join('')}`)}
 else if(a==='lay'){closeMenu();CUR.sl.splice(CUR.i+1,0,{html:LAY[d.k]()});go(CUR.i+1)}
 else if(a==='menuSrc'){ev.stopPropagation();showMenu(el,`<h5>Add evidence slide for</h5><div style="max-height:340px;overflow:auto">${Object.keys(SRC).map(n=>`<button class="pi" data-dk="addsrc" data-n="${n}"><span><b style="font-weight:600">${esc(trunc(SRC[n].t,52))}</b><div class="faint" style="font-size:12px">${SRC[n].ty} · ${SRC[n].y}</div></span></button>`).join('')}</div>`)}
 else if(a==='addsrc'){closeMenu();CUR.sl.splice(CUR.i+1,0,{html:srcSlide(CUR.t,+d.n,0,1).replace('Evidence 1 of 1','Added evidence')});go(CUR.i+1);toast('Evidence slide added')}
 else if(a==='fmt'){const s=$('#cvs');if(s&&s.contains(getSelection().anchorNode)){document.execCommand(d.c);save()}else toast('Select text on the slide first')}
 else if(a==='ins'){const sb=$('#cvs .sb');if(!sb)return;sb.insertAdjacentHTML('beforeend','<div style="margin-top:10px">'+BLK[d.b]+'</div>');save();toast('Added to slide')}
 else if(a==='pdf'){toast('Generating '+CUR.sl.length+'-page PDF …');setTimeout(()=>toast('PDF ready. Downloads are enabled in the full product'),1200)}});
let dragI=null;
document.addEventListener('dragstart',ev=>{const t=ev.target.closest&&ev.target.closest('#dkrail .th');if(t){dragI=+t.dataset.i;try{ev.dataTransfer.setData('text/plain','s')}catch(e){}}});
document.addEventListener('dragover',ev=>{if(dragI!==null&&ev.target.closest&&ev.target.closest('#dkrail .th'))ev.preventDefault()});
document.addEventListener('drop',ev=>{const t=ev.target.closest&&ev.target.closest('#dkrail .th');if(t&&dragI!==null&&CUR){ev.preventDefault();const to=+t.dataset.i,x=CUR.sl.splice(dragI,1)[0];CUR.sl.splice(to,0,x);CUR.i=to;dragI=null;all()}});
window.addEventListener('resize',()=>{if(CUR){rail();canvas()}});
window.__openDeck=open;window.__closeDeck=close;window.__genDeck=genDeck;
})();
(function(){
'use strict';
const D=window.__D,V=window.__V,W=window.__W;
const {$,$$,esc,ic,hash,SRC}=D;
const {S,getAns,akey,bar,line,ring,rich,citesIn}=V;
const DN={rd:'R&D',fin:'Finance',mkt:'Marketing',leg:'Legal'};
const kp=(l,v,s)=>`<div class="tile"><div class="eyebrow">${l}</div><div style="font-size:24px;font-weight:700;letter-spacing:-.02em;margin-top:2px">${v}</div><div class="faint" style="font-size:12px">${s}</div></div>`;
const st=(s)=>`<span class="pill ${{'On track':'ok','Watch':'warn','Gap':'bad'}[s]}">${s}</span>`;
function data(t,k){
 const a=getAns(t),L=a.lens[k],h=hash(t.id+k),H=n=>(hash(t.id+k+n)%40)+30,ttl=t.title;
 const D={
 rd:{sum:`${L.h}. The evidence is consistent across independent sources and the open items are narrow and testable. A short validation run closes the main gap before the next gate.`,
  kpis:[['Readiness (TRL)','5 → 7','target at Gate 3'],['Evidence verified',a.acc+'%','both models agree'],['Open technical risks',2+h%2,'each has an owner'],['Time to Gate 3',(5+h%3)+' months','with current team']],
  c2:['Readiness progression (TRL)',['Now','Gate 2','Gate 3','Pilot'],[4,5,6,7],'line'],c3:['Validation coverage (%)',['Interface','Cycling','Thermal','Abuse'],[H(1)+30,H(2)+25,H(3)+20,H(4)+10],'bar'],
  m:[['Technical readiness','TRL 5','TRL 7','On track'],['Validation coverage',(H(1)+30)+'%','90%','Watch'],['Reproducibility across labs','3 of 4','4 of 4','Watch'],['Evidence verified',a.acc+'%','90%',a.acc>=90?'On track':'Watch'],['Open critical risks','2','0','Gap']],
  cs:{n:'Aurelis Cells',h:'Scaling a polymer-ceramic interlayer from lab to pilot',s:'A cell maker had strong lab results but yield fell sharply above 100 cm² sheets, and two groups could not reproduce the headline figure.',ap:'It ran a three-site round-robin on one batch, fixed the coating tolerance, and gated the pilot on reproducibility instead of the best single run.',o:[['Yield at pilot','61% → 84%'],['Time lost','5 weeks'],['Cost of the round-robin','$140k']],l:['Plan on the conservative range, not the best run.','Reproducibility is the real gate.','Fund a short validation run before the pilot line.']},
  op:['Earlier pilot if validation closes quickly','Reusable interlayer process for adjacent programmes','Strong IP position if the gradient design holds'],rk:['Headline figure not reproduced at scale','Coating tolerance drift','Single-source supply of a key precursor'],
  pr:['What is the biggest technical risk?','What validation would change the decision?','Which source should I read first?']},
 fin:{sum:`${L.h}. The base case pays back inside the pilot horizon, and the result is most sensitive to input cost and yield. Finance should confirm the planning range before sign-off.`,
  kpis:[['Unit cost at target','72 index','−28% vs pilot'],['Payback',(2+h%2)+'.'+(h%9)+' yrs','base case'],['5-year NPV','$'+(9+h%6)+'.4M','base case'],['Budget requested','$'+(180+h%90)+'k','validation and pilot']],
  c2:['Cumulative cash ($M)',['Y0','Y1','Y2','Y3','Y4'],[-1.2,-0.8,0.1,1.9,4.2],'line'],c3:['Sensitivity of NPV (%)',['Input cost','Yield','Volume','Price'],[H(1),H(2)-8,H(3)-15,H(4)-20],'bar'],
  m:[['Capex','$'+(2+h%3)+'.1M','$'+(2+h%3)+'.4M','On track'],['Opex per unit','$'+(8+h%4)+'.2','$7.5','Watch'],['Gross margin',(31+h%6)+'%','35%','Watch'],['IRR',(18+h%7)+'%','20%','On track'],['Payback',(2+h%2)+'.'+(h%9)+' yrs','< 3 yrs','On track']],
  cs:{n:'Brightvolt Storage',h:'Building the business case for a pilot line',s:'The team had one best-case cost figure and no range. Finance rejected the first case for relying on a single supplier quote.',ap:'It rebuilt the case with low, base and high scenarios, tied each assumption to a source, and added a sensitivity table.',o:[['Approval time','9 → 3 weeks'],['Budget variance','±8%'],['Scenarios shown','3']],l:['Show a range, not a point.','Tie every number to a source.','Lead with the sensitivity table.']},
  op:['Margin improves with volume above pilot scale','Lower precursor cost with a second supplier','Grant funding for the pilot phase'],rk:['Input cost volatility','Yield below planning range','Delay in supplier samples'],
  pr:['What drives the NPV most?','What is the downside case?','What would change the payback?']},
 mkt:{sum:`${L.h}. Buyers value reliability over headline performance, and competitors compete mostly on price. Two segments are ready for early pilots with existing accounts.`,
  kpis:[['Priority segments','2 of 4','ready for pilots'],['Segment fit (best)',Math.max(...L.c[2])+'/100','top segment'],['Competitors tracked',6+h%4,'by evidence'],['Time to first pilot',(4+h%3)+' months','with existing accounts']],
  c2:['Market size ($B)',["'24","'25","'26","'27","'28"],[3.1,3.8,4.7,5.9,7.4],'line'],c3:['Competitor positioning (evidence strength)',['Halden','Rival A','Rival B','Rival C'],[H(1)+30,H(2)+10,H(3),H(4)-5],'bar'],
  m:[['Addressable segments','4','4','On track'],['Pilot-ready accounts','2','3','Watch'],['Share of wallet (target)','12%','15%','Watch'],['Win rate vs incumbents','38%','45%','Gap'],['Evidence-backed claims','6 of 8','8 of 8','Watch']],
  cs:{n:'Northgrid Mobility',h:'Winning a first fleet customer with evidence, not price',s:'A new thermal-management supplier entered a market where incumbents competed on price and had no safety data to show.',ap:'It led with propagation test data, ran a three-month pilot with an existing account, and priced against the cost of a field failure.',o:[['Pilot to contract','14 weeks'],['Price premium kept','9%'],['Reference customers','3']],l:['Lead with the evidence.','Start with accounts you already have.','Price against the cost of failure.']},
  op:['Safety evidence as a differentiator','Fast pilots with current accounts','Adjacent segments in stationary storage'],rk:['Incumbents cut price','Long qualification cycles','Claims that cannot be sourced'],
  pr:['Which segment should we pilot first?','How do we position against rivals?','What claim is safest to market?']},
 leg:{sum:`${L.h}. No blocking patents were found in the landscape review, and the standards pathway is defined. Export classification and one contract term still need confirmation.`,
  kpis:[['Blocking patents',0,'in landscape review'],['Freedom to operate','Low–Medium','confirm before pilot'],['Standards gaps',1,'testing plan needed'],['Export class','To confirm','legal review']],
  c2:['Patent filings by year (landscape)',["'21","'22","'23","'24","'25"],[12,18,27,41,55],'line'],c3:['Standards readiness (%)',['UN 38.3','IEC 62619','UL 9540A','MIL-STD'],[100,H(2)+30,H(3)+20,H(4)+10],'bar'],
  m:[['Blocking patents','0','0','On track'],['Pending applications of concern',2+h%2,'0','Watch'],['Standards covered','3 of 4','4 of 4','Watch'],['Export classification','Open','Closed','Gap'],['Contract terms reviewed','2 of 3','3 of 3','Watch']],
  cs:{n:'Verano Power',h:'Clearing freedom to operate before a pilot',s:'A team found a close patent late, after buying equipment, and had to redesign the interlayer at a cost.',ap:'It moved the landscape review ahead of the pilot spend, mapped claims to the design, and filed its own application on the gradient structure.',o:[['Redesign avoided','$310k'],['Review time','3 weeks'],['Own filings','2']],l:['Review the landscape before equipment spend.','Map claims, not just titles.','File early on what is yours.']},
  op:['Own filing on the gradient design','Clear path to certification','Licence-in options for adjacent claims'],rk:['Pending application matures into a blocking claim','Export classification delays shipping','Standards update during the pilot'],
  pr:['Are there blocking patents?','What certifications do we need?','What should we file first?']}};
 return D[k]}
function chart(c,hh){return c[3]==='line'?line(c[1],c[2],{h:hh||170}):bar(c[1],c[2],{h:hh||170})}
function lensTab(t){
 const k=S.lens,a=getAns(t),L=a.lens[k],d=data(t,k),key=akey(t),cs=citesIn(a.html);
 const ill='';
 return `<div class="stack" style="gap:16px">
 <div class="lensbar"><span class="muted">Department lens</span>${Object.keys(DN).map(x=>`<button class="fchip${k===x?' on':''}" data-act="lens" data-l="${x}">${DN[x]}</button>`).join('')}${ill}</div>
 <div class="card sec stack" style="gap:12px;border-color:var(--accent)"><div class="eyebrow">${DN[k]} summary</div><h3 style="margin:0;font:300 26px/1.2 var(--serif)">${esc(L.h)}</h3><p style="margin:0;font-size:14.5px;line-height:1.6">${esc(d.sum.replace(L.h+". ",""))}</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px">${d.kpis.map(x=>kp(x[0],x[1],x[2])).join('')}</div></div>
 <div class="card sec stack" style="gap:10px"><div style="display:flex;align-items:center;gap:8px"><img class="gsk" src="${window.GSKLOGO}" alt="" style="width:22px;height:22px;border-radius:6px"><b>Ask AI about the ${DN[k]} view</b><span class="faint">Answers use this task's evidence</span></div>
  <div style="display:flex;gap:8px"><input class="in" id="lensQ" placeholder="Ask a question or search this ${DN[k]} analysis"><button class="btn pri" data-act="lensAsk" data-id="${t.id}">${ic('spark',14)} Ask AI</button></div>
  <div class="chips">${d.pr.map(p=>`<button class="fchip" data-act="lensPrompt" data-q="${esc(p)}" data-id="${t.id}">${p}</button>`).join('')}</div><div id="lensA"></div></div>
 <div><div class="eyebrow" style="margin-bottom:8px">Charts</div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px">
  <div class="card sec"><div class="eyebrow" style="margin-bottom:6px">${esc(L.c[0])}</div>${bar(L.c[1],L.c[2],{h:170})}</div>
  <div class="card sec"><div class="eyebrow" style="margin-bottom:6px">${esc(d.c2[0])}</div>${chart(d.c2)}</div>
  <div class="card sec"><div class="eyebrow" style="margin-bottom:6px">${esc(d.c3[0])}</div>${chart(d.c3)}</div></div></div>
 <div class="card sec stack" style="gap:8px"><div class="eyebrow">Key metrics</div><div class="tw" style="box-shadow:none"><table class="t" style="min-width:0"><thead><tr><th>Metric</th><th>Now</th><th>Target</th><th>Status</th></tr></thead><tbody>${d.m.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${st(r[3])}</td></tr>`).join('')}</tbody></table></div></div>
 <div class="card sec stack" style="gap:10px"><div class="eyebrow">Findings and evidence</div>${L.b.map((b,i)=>`<div style="display:flex;gap:10px"><span class="rn" style="font-size:12px">${i+1}</span><div class="grow">${rich(esc(b).replace(/&#39;/g,"'"),key)}<div class="faint" style="font-size:12.5px;margin-top:2px">Checked by both models against ${cs.slice(i,i+2).map(n=>'<button class="cite" data-act="cite" data-n="'+n+'">'+n+'</button>').join(' ')||'indexed sources'}</div></div></div>`).join('')}</div>
 <div class="card sec stack" style="gap:12px;border-color:var(--gold)"><div style="display:flex;gap:8px;align-items:center"><span class="gold-tag">Case study</span><span class="faint">Illustrative, drawn from comparable programmes</span></div>
  <h3 style="margin:0;font-size:18px">${d.cs.n}: ${d.cs.h}</h3>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px"><div><div class="eyebrow">Situation</div><p style="margin:4px 0">${d.cs.s}</p></div><div><div class="eyebrow">Approach</div><p style="margin:4px 0">${d.cs.ap}</p></div></div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px">${d.cs.o.map(x=>kp(x[0],x[1],'outcome')).join('')}</div>
  <div><div class="eyebrow">Lessons for ${esc(t.title.length>40?'this task':t.title)}</div><ul class="plain">${d.cs.l.map(x=>`<li>${x}</li>`).join('')}</ul></div></div>
 <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px"><div class="card sec"><div class="eyebrow" style="margin-bottom:6px">Opportunities</div><ul class="plain">${d.op.map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="card sec"><div class="eyebrow" style="margin-bottom:6px">Risks</div><ul class="plain">${d.rk.map(x=>`<li>${x}</li>`).join('')}</ul></div></div></div>`}
async function ask(id,q){
 const t=D.byId(id),a=getAns(t),k=S.lens,L=a.lens[k],box=$('#lensA');q=(q||'').trim();if(!q){box.innerHTML='<div class="muted">Type a question first.</div>';return}
 box.innerHTML='<div class="muted" style="padding:6px 0">Thinking…</div>';
 const cs=citesIn(a.html),ctx=[...L.b,L.h,a.next].join('\n');let out=null;
 try{const sm=window.gemini&&await gemini.use('sample');if(sm){const r=await sm('You are an R&D research assistant. Answer in at most 4 short sentences using only this context, and cite sources as [n] using only these numbers: '+cs.join(', ')+'.\n\nContext ('+DN[k]+' view of "'+t.title+'"):\n'+ctx+'\n\nQuestion: '+q,{modelTier:'quick'});out=r.text}}catch(e){}
 if(!out){const qs=new Set((q.toLowerCase().match(/[a-z]{4,}/g)||[]));const sc=[...L.b,a.next].map(b=>({b,s:(b.toLowerCase().match(/[a-z]{4,}/g)||[]).filter(w=>qs.has(w)).length})).sort((x,y)=>y.s-x.s);out='From the '+DN[k]+' view: '+sc.slice(0,2).map(x=>x.b.replace(/\.$/,'')).join('. ')+'. Source'+(cs.length>1?'s':'')+' '+cs.slice(0,2).map(n=>'['+n+']').join(' ')+'.'}
 box.innerHTML=`<div class="quote" style="font-size:14px;line-height:1.55"><div class="eyebrow" style="margin-bottom:4px">Answer</div>${rich(esc(out).replace(/&#39;/g,"'"),akey(t))}</div>`}
document.addEventListener('click',ev=>{const el=ev.target.closest('[data-act="lensAsk"],[data-act="lensPrompt"]');if(!el)return;ev.stopPropagation();const q=el.dataset.act==='lensPrompt'?el.dataset.q:$('#lensQ').value;if(el.dataset.act==='lensPrompt')$('#lensQ').value=q;ask(el.dataset.id,q)},true);
document.addEventListener('keydown',ev=>{if(ev.key==='Enter'&&ev.target.id==='lensQ'){ev.preventDefault();ask(D.byId(S.openId).id,ev.target.value)}});

/* ---------- Final research case ---------- */
const {P,STATUS,byId}=D;
const CSEC=[['sum','Summary'],['scope','Scope'],['method','Method'],['find','Findings'],['evi','Evidence'],['src','Sources'],['clm','Claims'],['rd','R&D'],['fin','Finance'],['mkt','Market'],['leg','Legal'],['cas','Case studies'],['risk','Risks'],['road','Next steps'],['dec','Decision'],['ref','References']];
const secH=(id,n,title,sub)=>`<section id="cs-${id}" class="csec stack" style="gap:12px;scroll-margin-top:150px"><div><div class="eyebrow">${n}</div><h2 style="margin:2px 0 0;font:300 24px/1.2 var(--serif)">${title}</h2>${sub?`<div class="faint" style="font-size:13px;margin-top:2px">${sub}</div>`:''}</div>`;
function deptSec(t,k,n){
 const a=getAns(t),L=a.lens[k],d=data(t,k);
 return secH(k,n,DN[k]+' analysis',L.h)+`<p style="margin:0;font-size:14.5px;line-height:1.65;max-width:78ch">${esc(d.sum.replace(L.h+'. ',''))}</p>
 <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px">${d.kpis.map(x=>kp(x[0],x[1],x[2])).join('')}</div>
 <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px"><div class="card sec"><div class="eyebrow" style="margin-bottom:6px">${esc(L.c[0])}</div>${bar(L.c[1],L.c[2],{h:160})}</div><div class="card sec"><div class="eyebrow" style="margin-bottom:6px">${esc(d.c2[0])}</div>${chart(d.c2,160)}</div><div class="card sec"><div class="eyebrow" style="margin-bottom:6px">${esc(d.c3[0])}</div>${chart(d.c3,160)}</div></div>
 <div class="tw" style="box-shadow:none"><table class="t" style="min-width:0"><thead><tr><th>Metric</th><th>Now</th><th>Target</th><th>Status</th></tr></thead><tbody>${d.m.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${st(r[3])}</td></tr>`).join('')}</tbody></table></div></section>`}
function caseDoc(t){
 const a=getAns(t),key=akey(t),cs=[...new Set([...citesIn(a.html),...t.src])],cl=W.claimsOf(key),ck=Object.keys(a.cl),h=hash(t.id),
  ds=['rd','fin','mkt','leg'].map(k=>data(t,k)),fl=ck.filter(c=>W.gradeOf(key,c)!=='v');
 const find=[];['rd','fin','mkt','leg'].forEach(k=>a.lens[k].b.forEach(b=>find.push([k,b])));
 const risks=[];['rd','fin','mkt','leg'].forEach((k,i)=>ds[i].rk.forEach((r,j)=>risks.push([k,r,['Low','Medium','High'][(h+i+j)%3],['Medium','High','High'][(h+i*2+j)%3],P[t.owner].n,['Add a second source and re-test','Set a trigger and review monthly','Run a short validation before the gate','Assign an owner and a due date'][(i+j)%4]])));
 return `<div class="stack" style="gap:34px">
 ${secH('sum','01','Summary',`${esc(t.title)} · prepared for Halden R&D by ${P[t.owner].n} · due ${t.due}`)}
  <p style="margin:0;font-size:15px;line-height:1.7;max-width:78ch">${esc(a.lens.rd.h)}. ${esc(ds[0].sum.replace(a.lens.rd.h+'. ',''))} ${esc(ds[1].sum.replace(a.lens.fin.h+'. ',''))}</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px">${kp('Evidence accuracy',a.acc+'%','two-model check')}${kp('Sources reviewed',cs.length+' of '+(cs.length+4+h%5),'cited in this case')}${kp('Claims graded',ck.length,fl.length+' need attention')}${kp('Decision needed','Gate 3','by '+t.due)}</div>
  <div class="card sec" style="border-color:var(--accent)"><div class="eyebrow" style="margin-bottom:4px">Recommendation</div><div style="font-size:15px;line-height:1.6">${esc(a.next)}</div></div></section>
 ${secH('scope','02','Scope and question','What was asked, and what was left out')}
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px"><div class="card sec"><div class="eyebrow" style="margin-bottom:4px">Question</div>${esc(t.title)}</div><div class="card sec"><div class="eyebrow" style="margin-bottom:4px">In scope</div><ul class="plain"><li>${esc(t.sector)} evidence from journals, patents, standards and internal reports</li><li>Technical, financial, market and legal views</li><li>Claims graded against cited passages</li></ul></div><div class="card sec"><div class="eyebrow" style="margin-bottom:4px">Out of scope</div><ul class="plain"><li>Supplier negotiation</li><li>Plant-level engineering design</li><li>Unpublished third-party data</li></ul></div></div>
  <div class="tw" style="box-shadow:none"><table class="t" style="min-width:0"><tbody><tr><td><b>Owner</b></td><td>${P[t.owner].n}</td><td><b>Stage</b></td><td>${t.stage}</td></tr><tr><td><b>Priority</b></td><td>${t.pri}</td><td><b>Status</b></td><td>${STATUS[t.status][0]}</td></tr></tbody></table></div></section>
 ${secH('method','03','Method','How the evidence was gathered and checked')}
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px">${[['1 · Plan','The question was split into '+(4+h%3)+' sub-questions'],['2 · Search',(cs.length+6+h%9)+' scholarly, patent and internal documents searched'],['3 · Extract',(cs.length*3+h%7)+' passages extracted and cited'],['4 · Cross-check','Two open-weight models answered independently'],['5 · Review','Claims graded by the researcher, then VP review']].map(x=>`<div class="tile"><div class="eyebrow">${x[0]}</div><div style="font-size:13.5px;margin-top:4px">${x[1]}</div></div>`).join('')}</div></section>
 ${secH('find','04','Key findings','Each finding was checked by both models')}
  <div class="stack" style="gap:10px">${find.map((f,i)=>`<div style="display:flex;gap:10px"><span class="rn" style="font-size:12px">${i+1}</span><div class="grow">${rich(esc(f[1]).replace(/&#39;/g,"'"),key)}<div class="faint" style="font-size:12.5px;margin-top:2px">${DN[f[0]]} · ${cs.slice(i%Math.max(1,cs.length),i%Math.max(1,cs.length)+2).map(n=>'<button class="cite" data-act="cite" data-n="'+n+'">'+n+'</button>').join(' ')}</div></div></div>`).join('')}</div></section>
 ${secH('evi','05','Evidence base','Full answer with citations')}<div class="card sec abody" style="line-height:1.7">${rich(a.html,key)}</div></section>
 ${secH('src','06','Source register',cs.length+' sources · click any row to open it')}
  <div class="tw" style="box-shadow:none"><table class="t" style="min-width:0"><thead><tr><th>#</th><th>Source</th><th>Type</th><th>Year</th><th>Relevance</th><th>Check</th></tr></thead><tbody>${cs.map(n=>`<tr class="clk" tabindex="0" data-act="cite" data-n="${n}"><td>${n}</td><td><b>${esc(SRC[n].t)}</b><div class="faint" style="font-size:12px">${esc(SRC[n].v)}</div></td><td>${SRC[n].ty}</td><td>${SRC[n].y}</td><td>${SRC[n].rel}%</td><td>${SRC[n].ok?'Verified':'Needs check'}</td></tr>`).join('')}</tbody></table></div></section>
 ${secH('clm','07','Claims register','Every claim with its grade and sources')}
  <div class="tw" style="box-shadow:none"><table class="t" style="min-width:0"><thead><tr><th>Claim</th><th>Grade</th><th>Sources</th></tr></thead><tbody>${ck.map(c=>`<tr><td>${esc(cl[c])}</td><td>${W.gp(W.gradeOf(key,c))}</td><td>${a.cl[c].s.map(n=>'<button class="cite" data-act="cite" data-n="'+n+'">'+n+'</button>').join(' ')}</td></tr>`).join('')}</tbody></table></div></section>
 ${deptSec(t,'rd','08')}${deptSec(t,'fin','09')}${deptSec(t,'mkt','10')}${deptSec(t,'leg','11')}
 ${secH('cas','12','Case studies','Illustrative, drawn from comparable programmes')}
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px">${ds.map((d,i)=>`<div class="card sec stack" style="gap:8px"><div class="eyebrow">${DN[['rd','fin','mkt','leg'][i]]} · ${d.cs.n}</div><b>${d.cs.h}</b><div class="muted" style="font-size:13px">${d.cs.s}</div><div style="font-size:13px"><b>Approach.</b> ${d.cs.ap}</div><div style="display:flex;gap:8px;flex-wrap:wrap">${d.cs.o.map(x=>`<span class="pill">${x[0]}: ${x[1]}</span>`).join('')}</div></div>`).join('')}</div></section>
 ${secH('risk','13','Risk register','Likelihood, impact, owner and mitigation')}
  <div class="tw" style="box-shadow:none"><table class="t" style="min-width:0"><thead><tr><th>Area</th><th>Risk</th><th>Likelihood</th><th>Impact</th><th>Owner</th><th>Mitigation</th></tr></thead><tbody>${risks.map(r=>`<tr><td>${DN[r[0]]}</td><td><b>${r[1]}</b></td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td></tr>`).join('')}</tbody></table></div>
  <div class="card sec"><div class="eyebrow" style="margin-bottom:6px">Opportunities</div><ul class="plain">${ds.flatMap(d=>d.op).map(x=>`<li>${x}</li>`).join('')}</ul></div></section>
 ${secH('road','14','Next steps','Path to the next gate')}
  <div class="stack" style="gap:8px">${[['Weeks 1–2','Close open claims and request the missing test report'],['Weeks 3–6','Run the validation work and confirm the planning range with finance'],['Weeks 7–8','Legal review of patents, standards and export class'],['Week 9','Gate 3 review with the VP']].map(x=>`<div class="tile" style="display:flex;gap:14px"><b style="min-width:92px">${x[0]}</b><span>${x[1]}</span></div>`).join('')}</div></section>
 ${secH('dec','15','Decision and approvals','What is being asked of the VP')}
  <div class="card sec stack" style="gap:8px;border-color:var(--accent)"><b>Decision requested</b><div>${esc(a.next)}</div><div class="faint" style="font-size:13px">Evidence accuracy ${a.acc}% · ${fl.length} claim${fl.length===1?'':'s'} still open · budget request in the finance section.</div></div>
  <div class="tw" style="box-shadow:none"><table class="t" style="min-width:0"><thead><tr><th>Reviewer</th><th>Role</th><th>Status</th></tr></thead><tbody><tr><td>${P[t.owner].n}</td><td>Researcher</td><td>${t.status==='running'?'In progress':'Signed off'}</td></tr><tr><td>${P.sara?P.sara.n:'Sara Malik'}</td><td>Technical review</td><td>${t.status==='vp'||t.status==='review'?'Pending':'Not started'}</td></tr><tr><td>VP R&amp;D</td><td>Final approval</td><td>${t.status==='vp'?'Awaiting':'Not started'}</td></tr></tbody></table></div></section>
 ${secH('ref','16','References')}<ol style="margin:0;padding-left:20px;font-size:13px;line-height:1.7">${cs.map(n=>`<li value="${n}">${esc(SRC[n].t)}. ${esc(SRC[n].v)}, ${SRC[n].y}.</li>`).join('')}</ol></section></div>`}
function caseBody(t){
 return `<div class="stack" style="gap:16px"><div class="card sec stack" style="gap:10px;position:sticky;top:0;z-index:5">
  <div style="display:flex;gap:8px;flex-wrap:wrap"><input class="in" id="caseQ" style="flex:1;min-width:200px" placeholder="Search this case, or ask a question"><button class="btn" data-act="caseSearch">${ic('search',14)} Search</button><button class="btn pri" data-act="caseAsk" data-id="${t.id}">${ic('spark',14)} Ask AI</button></div>
  <div class="chips" style="flex-wrap:nowrap;overflow:auto">${CSEC.map(x=>`<button class="fchip" data-act="caseJump" data-s="${x[0]}">${x[1]}</button>`).join('')}</div><div id="caseA"></div></div>
  <div id="caseDoc">${caseDoc(t)}</div></div>`}
function caseFilter(q){
 q=(q||'').trim().toLowerCase();const box=$('#caseA');let n=0;
 $$('#caseDoc .csec').forEach(s=>{const m=!q||s.textContent.toLowerCase().includes(q);s.style.display=m?'':'none';if(m&&q)n++});
 if(q)box.innerHTML=n?`<div class="faint" style="font-size:12.5px">${n} section${n>1?'s':''} mention “${esc(q)}”. Press Ask AI for a direct answer.</div>`:`<div class="faint" style="font-size:12.5px">No section mentions “${esc(q)}”. Press Ask AI and the assistant will answer from the evidence.</div>`;
 else box.innerHTML=''}
async function askCase(id,q){
 const t=byId(id),a=getAns(t),box=$('#caseA');q=(q||'').trim();if(!q){box.innerHTML='<div class="muted">Type a question first.</div>';return}
 box.innerHTML='<div class="muted" style="padding:6px 0">Thinking…</div>';
 const cs=[...new Set([...citesIn(a.html),...t.src])],ctx=[a.lens.rd.h,...['rd','fin','mkt','leg'].flatMap(k=>a.lens[k].b),a.next].join('\n');let out=null;
 try{const sm=window.gemini&&await gemini.use('sample');if(sm){const r=await sm('You are an R&D research assistant. Answer in at most 5 short sentences using only this context, and cite sources as [n] using only these numbers: '+cs.join(', ')+'.\n\nContext (final research case "'+t.title+'"):\n'+ctx+'\n\nQuestion: '+q,{modelTier:'quick'});out=r.text}}catch(e){}
 if(!out){const qs=new Set((q.toLowerCase().match(/[a-z]{4,}/g)||[]));const all=['rd','fin','mkt','leg'].flatMap(k=>a.lens[k].b.map(b=>[k,b])),sc=[...all,['rd',a.next]].map(x=>({x,s:(x[1].toLowerCase().match(/[a-z]{4,}/g)||[]).filter(w=>qs.has(w)).length})).sort((p,r)=>r.s-p.s);out=sc.slice(0,3).map(y=>y.x[1].replace(/\.$/,'')).join('. ')+'. Sources '+cs.slice(0,3).map(n=>'['+n+']').join(' ')+'.'}
 box.innerHTML=`<div class="quote" style="font-size:14px;line-height:1.55"><div class="eyebrow" style="margin-bottom:4px">Answer</div>${rich(esc(out).replace(/&#39;/g,"'"),akey(t))}</div>`}
document.addEventListener('click',ev=>{const el=ev.target.closest('[data-act="caseAsk"],[data-act="caseSearch"],[data-act="caseJump"]');if(!el)return;ev.stopPropagation();const a=el.dataset.act;
 if(a==='caseAsk')askCase(el.dataset.id,$('#caseQ').value);else if(a==='caseSearch')caseFilter($('#caseQ').value);else{const q=$('#caseQ');if(q&&q.value){q.value='';caseFilter('')}const s=$('#cs-'+el.dataset.s);s&&s.scrollIntoView({behavior:'smooth',block:'start'})}},true);
document.addEventListener('input',ev=>{if(ev.target.id==='caseQ')caseFilter(ev.target.value)});
document.addEventListener('keydown',ev=>{if(ev.key==='Enter'&&ev.target.id==='caseQ'){ev.preventDefault();askCase(S.openId,ev.target.value)}});
window.__case=caseBody;
window.__lens=lensTab;
})();
(function(){
'use strict';
const D=window.__D,V=window.__V,W=window.__W;
const {$,$$,esc,P,av,byId,ic,SRC}=D;const {S,getAns}=V;
const EM=['👍','✅','👀','🎯'];let uid=1;
const mk=(who,text,time,rp)=>({id:'m'+uid++,who,text,time,re:{},rp:rp||[]});
const R=(who,text,time)=>({who,text,time});
const men=s=>esc(s).replace(/@([\w]+)/g,'<b class="mn">@$1</b>');
function seed(t,k){
 const a=getAns(t),o=t.owner,oth=Object.keys(P).filter(x=>x!==o&&x!=='priya'),r1=oth[0]||'sara',r2=oth[1]||'james',n=t.src.slice(0,3);
 if(k==='evi')return [mk(r1,`Added ${t.src.length} sources so far. The strongest match is source ${n[0]||1}, and two of them disagree on the headline number.`,'3h',[R(o,`Agreed. I'll attach the passage from source ${n[1]||2} so we can compare them side by side.`,'2h'),R(r1,'Thanks. Flagging it in Claims too.','2h')]),mk(r2,'Is there anything from the internal lab reports on this? Worth checking before we cite the 2024 paper.','1h')];
 if(k==='clm')return [mk(o,`Accuracy is at ${a.acc}%. Any claim graded Disputed or Unverified needs a second look before review.`,'4h',[R(r1,'I took the first two. Grades updated.','3h')])];
 return [mk('priya',`What do you need from me before the next gate? ${a.next}`,'5h',[R(o,'A decision on the planning range, and sign-off on the validation budget.','4h'),R('priya','Understood. Send the case when the open claims are closed.','4h')])]}
function st(t){
 S.dt=S.dt||{};let d=S.dt[t.id];
 if(!d){d=S.dt[t.id]={cur:'gen',open:null,seen:0,topics:[{id:'gen',name:'General',msgs:(getAns(t).cm||[]).map(c=>mk(c[0],c[1],c[2]))},{id:'evi',name:'Evidence',msgs:seed(t,'evi')},{id:'clm',name:'Claims',msgs:seed(t,'clm')},{id:'dec',name:'Decision',msgs:seed(t,'dec')}]}}
 const ex=S.comments[t.id]||[];
 if(d.seen<ex.length){let tp=d.topics.find(x=>x.id==='clip');if(!tp){tp={id:'clip',name:'Clippings',msgs:[]};d.topics.push(tp)}ex.slice(d.seen).forEach(c=>tp.msgs.push(mk(c[0],c[1],c[2])));d.seen=ex.length}
 return d}
const cur=d=>d.topics.find(x=>x.id===d.cur)||d.topics[0];
function react(m){const ks=Object.keys(m.re).filter(k=>m.re[k].length);return ks.length?`<div class="rxs">${ks.map(k=>`<button class="rx${m.re[k].includes('amina')?' me':''}" data-act="dreact" data-m="${m.id}" data-e="${k}">${k} ${m.re[k].length}</button>`).join('')}</div>`:''}
function msg(m,th){
 return `<div class="dm" id="${th?'t':'f'}${m.id}" data-m="${m.id}">${av(m.who,1)}<div class="dmb"><div><b>${P[m.who].n}</b> <span class="faint">${m.time}</span></div><div class="dtx">${men(m.text)}</div>${react(m)}${!th&&m.rp.length?`<button class="rpl" data-act="dreply" data-m="${m.id}">${m.rp.length} repl${m.rp.length>1?'ies':'y'} <span class="faint">· last ${m.rp[m.rp.length-1].time}</span></button>`:''}</div>
 ${th?'':`<div class="dact">${EM.slice(0,3).map(e=>`<button data-act="dreact" data-m="${m.id}" data-e="${e}" data-tip="React">${e}</button>`).join('')}<button data-act="dreply" data-m="${m.id}" data-tip="Reply in thread">${ic('send',14)}</button></div>`}</div>`}
const topics=d=>`<div class="eyebrow" style="padding:0 6px 6px">Topics</div>${d.topics.map(x=>`<button class="dt${x.id===d.cur?' on':''}" data-act="dtopic" data-id="${x.id}"><span>${esc(x.name)}</span><small>${x.msgs.reduce((a,m)=>a+1+m.rp.length,0)}</small></button>`).join('')}<div id="dNew"><button class="dt add" data-act="dnew">${ic('plus',13)} New topic</button></div>`;
const feed=d=>cur(d).msgs.map(m=>msg(m)).join('')||'<div class="muted" style="padding:20px">No messages in this topic yet. Start the conversation below.</div>';
function thread(d){const m=cur(d).msgs.find(x=>x.id===d.open);if(!m)return'';
 return `<div class="dthh"><b>Thread</b><span class="faint">in ${esc(cur(d).name)}</span><span class="grow"></span><button class="iconbtn" data-act="dthx" aria-label="Close thread">${ic('x',16)}</button></div>
 <div class="dthb" id="dThB">${msg(m,1)}<div class="dsep">${m.rp.length} repl${m.rp.length===1?'y':'ies'}</div>${m.rp.map(r=>msg(Object.assign(mk(r.who,r.text,r.time),{}),1)).join('')}<div id="dTyp2"></div></div>
 <div class="dcomp"><textarea class="in" id="dThIn" rows="2" placeholder="Reply in thread"></textarea><button class="btn pri sm" data-act="dsendth">Reply</button></div>`}
function html(t){const d=st(t);
 return `<div class="dsc${d.open?' th':''}" id="dsc" data-id="${t.id}"><aside class="dtop" id="dTop">${topics(d)}</aside><div class="dmain"><div class="dhead"><b># <span id="dName">${esc(cur(d).name)}</span></b><span class="faint">${t.status==='running'?'Agents are posting updates here':'Everyone on this task can see this topic'}</span></div><div class="dfeed" id="dFeed">${feed(d)}</div><div class="dtyp" id="dTyp"></div>
 <div class="dcomp" style="position:relative"><div id="dMen" class="dmen" hidden></div><textarea class="in" id="dIn" rows="2" placeholder="Message ${esc(cur(d).name)}. Use @ to mention someone. Enter to send."></textarea><button class="btn pri" data-act="dsend">${ic('send',15)} Send</button></div></div><aside class="dthr" id="dThr">${thread(d)}</aside></div>`}
const T=()=>byId(S.openId);
function paint(){const t=T();if(!t)return;const d=st(t),s=$('#dsc');if(!s)return;s.classList.toggle('th',!!d.open);$('#dTop').innerHTML=topics(d);$('#dName').textContent=cur(d).name;$('#dIn').placeholder='Message '+cur(d).name+'. Use @ to mention someone. Enter to send.';$('#dFeed').innerHTML=feed(d);$('#dThr').innerHTML=thread(d);$('#dFeed').scrollTop=1e6}
function refreshMsg(m,d){const f=$('#f'+m.id);if(f)f.outerHTML=msg(m);const th=$('#t'+m.id);if(th&&d.open===m.id)$('#dThr').innerHTML=thread(d);$('#dTop').innerHTML=topics(d)}
const who=txt=>{const m=(txt.match(/@(\w+)/)||[])[1];if(m){const k=Object.keys(P).find(x=>P[x].n.toLowerCase().split(/[ .]/).includes(m.toLowerCase())||x===m.toLowerCase());if(k&&k!=='amina')return k}return null};
const CAN=['Noted. I will look at it and come back today.','Good point. I have added it to my list before the review.','Thanks. Can you point me to the source passage so I can check it?','Agreed. Let us record that as a decision in this topic.','I checked. It matches source 2, but the sample size is small.'];
function simulate(t,d,m,inThread,said){
 const t0=t,tp=cur(d),r=who(said||m.text)||Object.keys(P).filter(x=>x!=='amina')[((said||m.text).length)%5],box=inThread?'#dTyp2':'#dTyp';
 const set=h=>{const e=$(box);if(e)e.innerHTML=h};set(`<span class="typ"><i></i><i></i><i></i></span> ${P[r].n} is typing`);
 setTimeout(()=>{set('');const txt=CAN[(m.text.length+r.length)%CAN.length];
  if(inThread){m.rp.push(R(r,txt,'now'))}else{const nm=mk(r,txt,'now');tp.msgs.push(nm);const f=$('#dFeed');if(f&&d.cur===tp.id){f.insertAdjacentHTML('beforeend',msg(nm).replace('class="dm"','class="dm dnew"'));f.scrollTo({top:1e6,behavior:'smooth'})}$('#dTop')&&($('#dTop').innerHTML=topics(d));return}
  refreshMsg(m,d);const b=$('#dThB');b&&b.scrollTo({top:1e6,behavior:'smooth'})},1500)}
function send(th){
 const t=T(),d=st(t),inp=$(th?'#dThIn':'#dIn'),v=inp.value.trim();if(!v){inp.focus();return}
 inp.value='';const tp=cur(d);
 if(th){const m=tp.msgs.find(x=>x.id===d.open);m.rp.push(R('amina',v,'now'));refreshMsg(m,d);const b=$('#dThB');b&&b.scrollTo({top:1e6,behavior:'smooth'});simulate(t,d,m,true,v);$('#dThIn')&&$('#dThIn').focus();return}
 const m=mk('amina',v,'now');tp.msgs.push(m);const f=$('#dFeed');f.insertAdjacentHTML('beforeend',msg(m).replace('class="dm"','class="dm dnew"'));f.scrollTo({top:1e6,behavior:'smooth'});$('#dTop').innerHTML=topics(d);simulate(t,d,m,false,v);inp.focus()}
document.addEventListener('click',ev=>{
 const el=ev.target.closest('[data-act^="d"]');if(!el||!$('#dsc')||!$('#dsc').contains(el))return;const a=el.dataset.act;
 if(!['dtopic','dnew','dnewgo','dreply','dthx','dreact','dsend','dsendth','dmen'].includes(a))return;ev.stopPropagation();
 const t=T(),d=st(t);
 if(a==='dtopic'){d.cur=el.dataset.id;d.open=null;paint()}
 else if(a==='dnew'){$('#dNew').innerHTML='<input class="in" id="dNewIn" placeholder="Topic name, then Enter" maxlength="28" style="margin:4px 0">';$('#dNewIn').focus()}
 else if(a==='dreply'){d.open=el.dataset.m;paint();const i=$('#dThIn');i&&i.focus()}
 else if(a==='dthx'){d.open=null;paint()}
 else if(a==='dreact'){const m=cur(d).msgs.find(x=>x.id===el.dataset.m)||cur(d).msgs.flatMap(x=>x.rp).find(x=>x.id===el.dataset.m);if(!m||!m.re)return;const e=el.dataset.e,l=m.re[e]=m.re[e]||[],i=l.indexOf('amina');i<0?l.push('amina'):l.splice(i,1);refreshMsg(m,d)}
 else if(a==='dsend')send(false);else if(a==='dsendth')send(true);
 else if(a==='dmen'){const i=$('#dIn'),v=i.value.replace(/@\w*$/,'@'+el.dataset.n+' ');i.value=v;$('#dMen').hidden=true;i.focus()}},true);
document.addEventListener('keydown',ev=>{
 if(ev.target.id==='dIn'&&ev.key==='Enter'&&!ev.shiftKey){ev.preventDefault();send(false)}
 else if(ev.target.id==='dThIn'&&ev.key==='Enter'&&!ev.shiftKey){ev.preventDefault();send(true)}
 else if(ev.target.id==='dNewIn'&&ev.key==='Enter'){const v=ev.target.value.trim();if(!v)return;const d=st(T());const id='n'+Date.now();d.topics.push({id,name:v,msgs:[]});d.cur=id;d.open=null;paint()}
 else if(ev.target.id==='dNewIn'&&ev.key==='Escape'){paint()}});
document.addEventListener('input',ev=>{if(ev.target.id!=='dIn')return;const m=ev.target.value.match(/@(\w*)$/),box=$('#dMen');if(!m){box.hidden=true;return}
 const l=Object.keys(P).filter(k=>k!=='amina'&&P[k].n.toLowerCase().includes(m[1].toLowerCase()));box.hidden=!l.length;box.innerHTML=l.map(k=>`<button data-act="dmen" data-n="${P[k].n.split(' ')[0].replace(/[^\w]/g,'')}">${av(k,1)}<span><b>${P[k].n}</b><small>${P[k].r}</small></span></button>`).join('')});

/* ---------- notifications ---------- */
const NI={agent:['spark','var(--accent)'],mention:['send','#5B49BD'],claim:['flag','#C0701A'],blocker:['clock','var(--bad)'],approval:['check','var(--ok)'],system:['db','var(--fg3)']};
const ttl=id=>{const t=byId(id);return t?t.title:''};
const NF=[
 {id:'n1',k:'agent',t:'t102',h:'Agents finished the cooling comparison',b:()=>`“${ttl('t102')}” is ready for review. 34 sources cited, accuracy 92%.`,w:'12 min ago',g:'Today',u:1,a:['Review','Open']},
 {id:'n2',k:'mention',who:'sara',t:'t101',h:'Sara Malik mentioned you',b:()=>'“@Jeff can you confirm the yield range before Friday?”',w:'2 h ago',g:'Today',u:1,a:['Reply']},
 {id:'n3',k:'claim',who:'sara',t:'t101',h:'A claim was flagged as disputed',b:()=>`The yield figure in “${ttl('t101')}” is contradicted by a second source.`,w:'3 h ago',g:'Today',u:1,a:['Check claim']},
 {id:'n4',k:'blocker',t:'t108',h:'Blocker added',b:()=>`The supplier test report is outstanding for “${ttl('t108')}”.`,w:'Yesterday',g:'Earlier',u:0,a:['Open']},
 {id:'n5',k:'approval',who:'tomas',t:'t106',h:'Tomás signed off the margin model',b:()=>`“${ttl('t106')}” can go to the VP for approval.`,w:'Yesterday',g:'Earlier',u:0,a:['Send to VP']},
 {id:'n6',k:'system',h:'3 sources indexed',b:()=>'Your uploaded files are parsed and ready to cite.',w:'Yesterday',g:'Earlier',u:0,a:[]}];
const NQ=[{k:'mention',who:'priya',t:'t104',h:'Dr. Priya Nair commented',b:()=>`“Approving once dual sourcing is written into the plan.”`,w:'just now',g:'Today',u:1,a:['Reply']}];
let nfF='all';
const nfUn=()=>NF.filter(x=>x.u).length;
const ni=(n,i)=>{const [ic0,c]=NI[n.k];return `<div class="nf${n.u?' un':''}" style="animation-delay:${i*45}ms" data-id="${n.id}"><span class="nfi" style="--c:${c}">${ic(ic0,16)}</span><div class="nfb"><div class="nft">${n.who?av(n.who,1):''}<b>${esc(n.h)}</b></div><div class="nfd">${esc(n.b())}</div><div class="nfm"><span class="faint">${n.w}</span>${n.a.map((x,j)=>`<button class="btn sm${j===0&&n.u?' pri':''}" data-act="nfgo" data-id="${n.id}">${x}</button>`).join('')}${n.u?`<button class="btn sm ghost" data-act="nfread" data-id="${n.id}">Mark read</button>`:''}</div></div></div>`};
function notifHTML(){
 const tc=$('#nfToast');if(tc)tc.innerHTML='';
 const l=NF.filter(n=>nfF==='all'||(nfF==='me'&&n.u&&n.a.length)||(nfF==='mention'&&n.k==='mention')||(nfF==='agent'&&(n.k==='agent'||n.k==='system')));
 const grp=['Today','Earlier'].map(g=>{const x=l.filter(n=>n.g===g);return x.length?`<div class="nfg">${g}</div>${x.map(ni).join('')}`:''}).join('')||'<div class="muted" style="padding:28px 4px;text-align:center">Nothing here. You are all caught up. Switch the filter to see everything.</div>';
 return `<div class="sh"><div class="grow"><b style="font-size:16px">Notifications</b><div class="faint" style="font-size:12px">${nfUn()?nfUn()+' unread':'All caught up'}</div></div><button class="btn sm" data-act="nfall">Mark all read</button><button class="iconbtn" data-act="closeSide" aria-label="Close">${ic('x',18)}</button></div>
 <div class="sb" id="nfBody"><div class="chips">${[['all','All'],['me','Needs you'],['mention','Mentions'],['agent','Agents']].map(([k,t])=>`<button class="fchip${nfF===k?' on':''}" data-act="nff" data-k="${k}">${t}</button>`).join('')}</div>${grp}</div>`}
const repaint=()=>{const sd=$('#side');if(sd&&sd.classList.contains('on')&&sd.querySelector('#nfBody'))sd.innerHTML=notifHTML();window.__renderTop&&window.__renderTop()};
function go(id){const n=NF.find(x=>x.id===id);if(!n)return;n.u=0;const c=$('#side [data-act=closeSide]');c&&c.click();if(n.t){const b=document.createElement('button');b.dataset.act='openTask';b.dataset.id=n.t;b.hidden=true;document.body.appendChild(b);b.click();b.remove()}window.__renderTop&&window.__renderTop()}
document.addEventListener('click',ev=>{const el=ev.target.closest('[data-act^="nf"]');if(!el)return;const a=el.dataset.act;if(!['nfgo','nfread','nfall','nff'].includes(a))return;ev.stopPropagation();
 if(a==='nff'){nfF=el.dataset.k;repaint()}else if(a==='nfread'){const n=NF.find(x=>x.id===el.dataset.id);n.u=0;repaint()}else if(a==='nfall'){NF.forEach(n=>n.u=0);S.unread=false;repaint()}else go(el.dataset.id)},true);
function pushToast(n){let c=$('#nfToast');if(!c){c=document.createElement('div');c.id='nfToast';document.body.appendChild(c)}
 const [ic0,col]=NI[n.k],e=document.createElement('div');e.className='nft2';e.innerHTML=`<span class="nfi" style="--c:${col}">${ic(ic0,16)}</span><div class="nfb"><div class="nft">${n.who?av(n.who,1):''}<b>${esc(n.h)}</b></div><div class="nfd">${esc(n.b())}</div><div class="nfm"><button class="btn sm pri" data-act="nftoastgo" data-id="${n.id}">Open</button><button class="btn sm ghost" data-act="nftoastx">Dismiss</button></div></div><i class="nfbar"></i>`;c.appendChild(e);
 const kill=()=>{e.classList.add('out');setTimeout(()=>e.remove(),300)};e._k=kill;setTimeout(kill,7000)}
document.addEventListener('click',ev=>{const el=ev.target.closest('[data-act="nftoastgo"],[data-act="nftoastx"]');if(!el)return;ev.stopPropagation();const t=el.closest('.nft2');t&&t._k&&t._k();if(el.dataset.act==='nftoastgo'){const n=NF.find(x=>x.id===el.dataset.id);if(n){n.u=0;if(n.t){const b=document.createElement('button');b.dataset.act='openTask';b.dataset.id=n.t;b.hidden=true;document.body.appendChild(b);b.click();b.remove()}window.__renderTop&&window.__renderTop()}}},true);
function incoming(){const q=NQ.shift();if(!q)return;const n=Object.assign({id:'n'+Date.now()},q);NF.unshift(n);S.unread=true;window.__renderTop&&window.__renderTop();pushToast(n);repaint()}
setTimeout(incoming,14000);
window.__notifHTML=notifHTML;window.__notifIncoming=incoming;

/* ---------- expanded model research ---------- */
const STEPS=['Broke the question into sub-questions and listed what evidence would settle each.','Searched journals, patents and internal reports; kept the passages that answered a sub-question.','Compared figures across sources and noted where units or test conditions differed.','Graded each claim against the exact passage it relied on.','Wrote the answer and listed what it could not confirm.'];
function modelPanel(i){
 const t=byId(S.openId);if(!t)return;const a=getAns(t),key=V.akey(t),p=a.panel[i],o=a.panel[1-i],cs=W.claimsOf(key),h=D.hash(t.id+p.m);
 const ck=Object.keys(a.cl),pass=[...new Set(p.ci)];
 const stance=c=>{const g=W.gradeOf(key,c);return p.vc==='warn'&&g!=='v'?['Disagrees','warn']:g==='v'?['Agrees','ok']:['Unsure','']};
 const html=`<div class="sh"><div class="grow"><b style="font-size:16px">${esc(p.m)}</b><div class="faint" style="font-size:12px">${esc(p.r)} · full research for this task</div></div><button class="iconbtn" data-act="closeSide" aria-label="Close">${ic('x',18)}</button></div>
 <div class="sb"><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px">${[['Verdict',p.v],['Confidence',p.cf+'%'],['Sources read',pass.length+4+h%6],['Passages used',pass.length*3+h%5],['Run time',(2+h%4)+' min '+(10+h%40)+' s']].map(x=>`<div class="tile"><div class="eyebrow">${x[0]}</div><div style="font-size:18px;font-weight:700;margin-top:2px">${x[1]}</div></div>`).join('')}</div>
 <div><div class="eyebrow" style="margin-bottom:8px">How it worked</div><div class="stack" style="gap:8px">${STEPS.map((x,k)=>`<div style="display:flex;gap:10px"><span class="rn" style="font-size:12px">${k+1}</span><span style="font-size:13.5px">${x}</span></div>`).join('')}</div></div>
 <div><div class="eyebrow" style="margin-bottom:8px">Findings</div><ul class="plain">${p.pts.map(x=>`<li>${x}</li>`).join('')}</ul></div>
 <div><div class="eyebrow" style="margin-bottom:8px">Claim by claim</div><div class="tw" style="box-shadow:none"><table class="t" style="min-width:0"><thead><tr><th>Claim</th><th>${esc(p.m.split(' ')[0])}</th><th>${esc(o.m.split(' ')[0])}</th></tr></thead><tbody>${ck.map(c=>{const s1=stance(c);const g=W.gradeOf(key,c);const s2=o.vc==='warn'&&g!=='v'?['Disagrees','warn']:g==='v'?['Agrees','ok']:['Unsure',''];return `<tr><td>${esc(cs[c])}</td><td><span class="pill ${s1[1]}">${s1[0]}</span></td><td><span class="pill ${s2[1]}">${s2[0]}</span></td></tr>`}).join('')}</tbody></table></div></div>
 <div><div class="eyebrow" style="margin-bottom:8px">Passages it relied on</div><div class="stack" style="gap:8px">${pass.map(n=>`<button class="rsrc" data-act="cite" data-n="${n}" style="align-items:flex-start">${V.GL?'':''}<span><b>${esc(SRC[n].t)}</b><small>${SRC[n].ty} · ${esc(SRC[n].v)} · ${SRC[n].y}</small><span style="display:block;margin-top:4px;font-size:13px;color:var(--fg2)">“${esc(String(SRC[n].p||'').replace(/[«»]/g,'')).slice(0,260)}”</span></span></button>`).join('')}</div></div>
 <div class="disagree"><div class="eyebrow">Where it differs from ${esc(o.m)}</div><p style="margin:6px 0 0">${a.dis}</p></div></div>`;
 const sd=$('#side');sd.innerHTML=html;sd.classList.add('wide');window.__openSide&&window.__openSide(html);sd.classList.add('wide')}
document.addEventListener('click',ev=>{const el=ev.target.closest('[data-act="mexp"]');if(!el)return;if(ev.target.closest('[data-act="cite"]'))return;ev.stopPropagation();modelPanel(+el.dataset.i)},true);
window.__disc=html;
})();
(function(){
'use strict';
const D=window.__D,V=window.__V,W=window.__W;
const {$,$$,esc,ic,hash,P,av,SECTS,STAGES,sk,SRC,ANS,T,STATUS,byId,RAD,LIB,CONN}=D;
const {S,GL,GN,getAns,flagged,akey,ansByKey,claimMeta,rich,citesIn}=V;
const {claimsOf,gradeOf,gp,hlr}=W;
const ROUTES=['home','list','board','roadmap','radar','sources','clipper','executive'];
let recog=null,popEl=null,tipEl=$('#tip'),tickN=0;
const ls={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};

/* ---------- helpers ---------- */
function toast(msg,kind){const el=document.createElement('div');el.className='toast'+(kind==='ok'?' ok':'');el.innerHTML=(kind==='ok'?ic('check',16):'')+'<span>'+msg+'</span>';$('#toasts').appendChild(el);setTimeout(()=>{el.style.opacity=0;el.style.transition='opacity .3s';setTimeout(()=>el.remove(),300)},2800)}
function closePop(){if(popEl){popEl.remove();popEl=null}}
function pop(anchor,html,o={}){closePop();const el=document.createElement('div');el.className='pop';el.innerHTML=html;document.body.appendChild(el);popEl=el;
 const r=anchor.getBoundingClientRect(),w=el.offsetWidth,h=el.offsetHeight;
 let x=o.right?r.right-w:r.left,y=r.bottom+6;if(x+w>innerWidth-10)x=innerWidth-w-10;if(x<10)x=10;if(y+h>innerHeight-10)y=Math.max(10,r.top-h-6);
 el.style.left=x+'px';el.style.top=y+'px';return el}
const pi=(act,attrs,icn,t,s)=>`<button class="pi" data-act="${act}" ${attrs}>${icn?ic(icn,16):''}<span><b style="font-weight:600">${t}</b>${s?`<div class="faint" style="font-size:12px">${s}</div>`:''}</span></button>`;
function modal(html){const m=$('#modal');m.innerHTML=html;m.style.display='flex'}
function closeModal(){if(S.rec)stopRec();const m=$('#modal');m.style.display='none';m.innerHTML='';S.wiz=null}
function overlayState(){const on=$('#drawer').classList.contains('on')||$('#side').classList.contains('on');$('#scrim').classList.toggle('on',on);$('#scrim').style.opacity=on?1:0;$('#scrim').style.pointerEvents=on?'auto':'none'}
function closeSide(){$('#side').classList.remove('on','wide');overlayState()}
function closeDrawer(){$('#drawer').classList.remove('on');S.openId=null;overlayState()}
function closeTop(){closePop();if(window.__closeDeck&&window.__closeDeck())return;if(S.rad.full){S.rad.full=false;rerenderPV();return}if($('#modal').style.display==='flex'){closeModal();return}if($('#side').classList.contains('on')){closeSide();return}if($('#drawer').classList.contains('on'))closeDrawer();$('#nav').classList.remove('open')}
const dk=()=>{const r=document.documentElement;return r.dataset.theme==='dark'||(r.dataset.theme!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches)};

/* ---------- render ---------- */
function renderNav(){$('#nav').innerHTML=V.navHTML()}
window.__renderTop=()=>renderTop();
function renderTop(){$('#top').innerHTML=V.topHTML()}
function renderMain(){
 const r=S.route,m=$('#main');m.scrollTop=0;
 if(r==='home')m.innerHTML=V.homeHTML();
 else if(r.startsWith('thread-')){const th=S.threads.find(t=>'thread-'+t.id===r);if(!th){go('home');return}m.innerHTML=V.threadHTML(th);if(th.fresh)stream(th)}
 else if(['list','board','roadmap','radar'].includes(r))m.innerHTML=V.pvHTML(r);
 else if(r==='sources')m.innerHTML=V.sourcesHTML();
 else if(r==='clipper'){m.innerHTML=V.clipperHTML();setTimeout(()=>{if(S.route==='clipper'&&!S.scanned){S.scanned=1;sideScan()}},900)}
 else if(r==='executive')m.innerHTML=W.execHTML();
 after();
}
function renderAll(){renderNav();renderTop();renderMain()}
function after(){if(S.route==='roadmap')requestAnimationFrame(drawDeps)}
function refreshBody(){const b=$('#pv-body');if(b){b.innerHTML=V.pvBody(S.route);after()}}
function refreshDrawer(){const t=byId(S.openId);if(t){$('#drawer').innerHTML=W.drawerHTML(t)}}
function refreshDrawerBody(){const t=byId(S.openId);if(t){$('#dbody').innerHTML=W.drawerBody(t)}}
function go(r){if(!ROUTES.includes(r)&&!r.startsWith('thread-'))r='home';if(r==='executive'&&S.role!=='vp')r='home';S.route=r;if(location.hash.slice(1)!==r){try{history.replaceState(null,'','#'+r)}catch(e){location.hash=r}}closeAllPanels();renderAll()}
function closeAllPanels(){closePop();closeSide();closeDrawer();$('#nav').classList.remove('open');overlayState()}
function drawDeps(){
 const svg=$('#deps'),host=$('#rmin');if(!svg||!host)return;const hb=host.getBoundingClientRect();
 svg.setAttribute('width',host.scrollWidth);svg.setAttribute('height',host.scrollHeight);svg.style.cssText='position:absolute;inset:0;pointer-events:none;overflow:visible';
 const crit=['t101','t106','t102','t108'];let d='';
 T.forEach(t=>(t.deps||[]).forEach(p=>{const a=$('#bar-'+p),b=$('#bar-'+t.id);if(!a||!b)return;const ra=a.getBoundingClientRect(),rb=b.getBoundingClientRect();
  const x1=ra.right-hb.left,y1=ra.top+ra.height/2-hb.top,x2=rb.left-hb.left,y2=rb.top+rb.height/2-hb.top,mx=Math.max(x1+14,(x1+x2)/2);
  const on=S.crit&&crit.includes(p)&&crit.includes(t.id);
  d+=`<path d="M${x1},${y1}C${mx},${y1} ${x2-14},${y2} ${x2},${y2}" fill="none" stroke="${on?'var(--gold)':'var(--fg3)'}" stroke-width="${on?2.4:1.4}" opacity="${S.crit&&!on?.25:.7}"/><circle cx="${x2}" cy="${y2}" r="3" fill="${on?'var(--gold)':'var(--fg3)'}"/>`}));
 svg.innerHTML=d}

/* ---------- chat ---------- */
const STOP=new Set('the and for with what that this from about are how does into than have will which when where your their between over under across'.split(' '));
const toks=s=>(s.toLowerCase().match(/[a-z0-9µω]{3,}/g)||[]).filter(w=>!STOP.has(w));
function score(q,n){const s=SRC[n],set=new Set(toks(s.t+' '+s.p+' '+s.v));const qt=toks(q);let m=0;qt.forEach(w=>{if(set.has(w))m+=1;else if([...set].some(x=>x.length>4&&(x.startsWith(w)||w.startsWith(x))))m+=.5});return qt.length?m/qt.length:0}
function ranked(q){return Object.keys(SRC).map(n=>({n:+n,s:score(q,n)})).sort((a,b)=>b.s-a.s||(hash(q+a.n)%7)-(hash(q+b.n)%7))}
function keyFor(q){const l=q.toLowerCase();
 if(/immersion|cold.?plate|cooling|thermal|propagation|dielectric/.test(l))return'cooling';
 if(/llzo|electrolyte|garnet|interlayer|freedom|fto|solid.?state/.test(l))return'electrolyte';
 if(/sodium|hard carbon|20 gwh|na-ion/.test(l))return'sodium';return null}
function sendQ(q){
 q=(q||'').trim();if(!q){toast('Type a question to ask Halden');return}
 let key=keyFor(q),pre='';
 if(!key){const top=ranked(q).slice(0,3).map(x=>x.n);const id='q'+(++S.thId);
  const ps={id,title:q.length>70?q.slice(0,68)+'…':q,sector:'Materials',owner:'amina',acc:86+hash(q)%6,src:top};
  ANS[id]=getAns(ps);key=id;pre='Closest evidence found across the indexed sources, grounded in '+top.length+' documents.'}
 const th={id:'th'+(++S.thId),title:q.length>56?q.slice(0,54)+'…':q,key,q,t:'Just now',fresh:true,pre};
 S.threads.unshift(th);go('thread-'+th.id)}
function stream(th){
 const a=ansByKey(th.key),html=rich(a.html,th.key),parts=html.split(/(<[^>]+>)/).filter(Boolean);const body=$('#abody');let i=0,out='',w=0;
 const iv=setInterval(()=>{
  if(!$('#abody')||$('#abody')!==body){clearInterval(iv);return}
  for(let n=0;n<3&&i<parts.length;n++){const p=parts[i];if(p[0]==='<'){out+=p;i++}else{const words=p.split(/(\s+)/);const take=words.slice(w,w+4);out+=take.join('');w+=4;if(w>=words.length){i++;w=0}}}
  body.innerHTML=out;const sc=$('#tscroll');if(sc)sc.scrollTop=sc.scrollHeight;
  if(i>=parts.length){clearInterval(iv);th.fresh=false;body.classList.remove('cursor');body.innerHTML=html;$('#aextra').innerHTML=V.extras(th.key);if(sc)sc.scrollTop=sc.scrollHeight}
 },28)}

/* ---------- side panels ---------- */
window.__openSide=h=>openSide(h);
function openSide(html){$('#side').innerHTML=html;$('#side').classList.add('on');overlayState()}
const shead=(t,s)=>`<div class="sh"><div class="grow"><b style="font-size:15px">${t}</b>${s?`<div class="faint" style="font-size:12px">${s}</div>`:''}</div><button class="iconbtn" data-act="sideWide" data-tip="Expand panel" aria-label="Expand">${ic('ext',17)}</button><button class="iconbtn" data-act="closeSide" aria-label="Close">${ic('x',18)}</button></div>`;
const citeFmt=n=>{const s=SRC[n];return `${s.t}. ${s.v}, ${s.y}.`};
function sideCite(n){
 const s=SRC[n],inT=T.filter(t=>t.src.includes(+n));
 openSide(shead('Source '+n,s.ty+' · '+s.y)+`<div class="sb"><h3 style="margin:0;font-size:17px;line-height:1.35">${esc(s.t)}</h3>
 <div class="chips"><span class="pill accent">${s.ty}</span><span class="pill">${esc(s.v)}</span><span class="pill ${s.ok?'ok':'warn'}">${s.ok?'Citation verified':'Needs check'}</span></div>
 <div><div class="eyebrow" style="margin-bottom:6px">Passage the models used</div><div class="quote">${hlr(esc(s.p).replace(/&#39;/g,"'"))}</div></div>
 <div style="display:flex;align-items:center;gap:10px"><span class="muted">Relevance</span><span class="bar" style="flex:1"><i style="width:${s.rel}%"></i></span><b>${s.rel}%</b></div>
 <div><div class="eyebrow" style="margin-bottom:6px">Citation</div><div class="tile" style="font-size:13px">${esc(citeFmt(n))}</div></div>
 <div><div class="eyebrow" style="margin-bottom:6px">Used in ${inT.length} task${inT.length===1?'':'s'}</div><div class="stack" style="gap:6px">${inT.map(t=>`<button class="hi" data-act="openTask" data-id="${t.id}"><div class="grow"><b style="font-size:13.5px">${esc(t.title)}</b><div class="faint" style="font-size:12px">${t.code}</div></div>${ic('chev',13)}</button>`).join('')||'<div class="muted">Not yet attached to a task.</div>'}</div></div>
 <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pri" data-act="pickFor" data-kind="src" data-n="${n}">${ic('plus',14)} Add to research task</button><button class="btn" data-act="copyCite" data-n="${n}">${ic('copy',14)} Copy citation</button><button class="btn ghost" data-act="openOrig" data-n="${n}">${ic('ext',14)} Open original</button></div></div>`)}
function sideClaim(k){
 const {a,c,m,g}=claimMeta(k),key=k.split(':')[0],tx=claimsOf(key)[c];
 openSide(shead('Claim check',GL[g])+`<div class="sb"><div class="quote" style="font-size:15px">“${tx}”</div><div>${gp(g)}</div>
 <div><div class="eyebrow" style="margin-bottom:8px">What each model found</div><div class="stack" style="gap:8px">${a.panel.map((p,i)=>`<div class="tile"><div style="display:flex;gap:8px;align-items:center"><b>${p.m}</b><span class="pill ${p.vc}" style="margin-left:auto">${p.v}</span></div><div class="muted" style="font-size:12.5px;margin-top:4px">${esc(p.pts[Math.min(i+(g==='v'?0:1),2)])}</div></div>`).join('')}</div></div>
 <div class="muted">${esc(m.n)}</div>
 <div><div class="eyebrow" style="margin-bottom:8px">Sources behind this claim</div><div class="stack" style="gap:8px">${m.s.map(n=>`<button class="rsrc" data-act="cite" data-n="${n}">${lg(n)}<span><b>${esc(SRC[n].t)}</b><small>${hlr(esc(SRC[n].p).slice(0,150).replace(/&#39;/g,"'"))}…</small></span></button>`).join('')}</div></div>
 <div><div class="eyebrow" style="margin-bottom:8px">Your review</div><div class="chips">${['v','d','u'].map(x=>`<button class="fchip${g===x?' on':''}" data-act="setGrade" data-k="${k}" data-g="${x}">${GN[x]}</button>`).join('')}</div></div>
 <button class="btn" data-act="askReviewer" data-k="${k}">${ic('users',14)} Ask a reviewer to check</button></div>`)}
function verdict(txt){
 const rk=ranked(txt),top=rk.slice(0,3),best=top[0].s,h=hash(txt)%100;
 let g=best>=.55?(h<75?'v':'d'):best>=.3?(h<45?'v':h<80?'d':'u'):(h<25?'v':h<60?'u':'d');
 const conf=Math.min(97,Math.round(52+best*40+h%9));return{top,g,conf,best}}
function sideClip(txt){
 txt=txt.trim().slice(0,420);const v=verdict(txt),n=v.top[0].n,sr=SRC[n];
 const lab={v:'Supported by indexed evidence',d:'Sources disagree on this',u:'No primary source confirms this yet'}[v.g];
 openSide(shead('Verify and clip','Triple-click anywhere to check text')+`<div class="sb"><div class="quote">“${esc(txt)}”</div>
 <div class="card sec stack" style="gap:8px;box-shadow:none"><div style="display:flex;gap:10px;align-items:center">${ring2(v.conf)}<div><div>${gp(v.g)}</div><div class="muted" style="font-size:12.5px;margin-top:4px">${lab}</div></div></div></div>
 <div><div class="eyebrow" style="margin-bottom:8px">Closest evidence</div><div class="stack" style="gap:8px">${v.top.map(x=>`<button class="rsrc" data-act="cite" data-n="${x.n}">${lg(x.n)}<span><b>${esc(SRC[x.n].t)}</b><small>${SRC[x.n].ty} · ${SRC[x.n].y} · match ${Math.max(38,Math.round(x.s*100))}%</small></span></button>`).join('')}</div></div>
 <div><div class="eyebrow" style="margin-bottom:6px">Page</div><div class="tile" style="font-size:13px"><b>${esc(CMETA().title)}</b><div class="faint">${CMETA().site} · ${CMETA().author} · ${CMETA().date}</div></div></div>
 <div><div class="eyebrow" style="margin-bottom:6px">Citation</div><div class="chips" style="margin-bottom:6px">${['APA','MLA','Vancouver','BibTeX'].map(x=>`<button class="fchip${S.cf===x?' on':''}" data-act="cfmt" data-f="${x}" data-txt="${esc(txt)}">${x}</button>`).join('')}</div><div class="tile" id="citeBox" style="font-size:12.5px;white-space:pre-wrap">${esc(fmtCite(S.cf,CMETA()))}</div><button class="btn sm" style="margin-top:6px" data-act="copyFmt">${ic('copy',13)} Copy citation</button></div>
 <div><div class="eyebrow" style="margin-bottom:6px">Tags and note</div><input class="in" id="clipTags" placeholder="Tags, comma separated"><textarea class="in" id="clipNote" rows="2" style="margin-top:6px" placeholder="Why does this matter?"></textarea></div>
 <div><div class="eyebrow" style="margin-bottom:8px">Add to a research task</div><div class="stack" id="pick" style="gap:6px" data-kind="clip" data-n="${n}" data-txt="${esc(txt)}">${pickList()}</div></div></div>`)}

function scanPage(){
 const art=$('.article');const paras=art?[...art.querySelectorAll('p')]:[...document.querySelectorAll('#main p, #main .tile, #main .muted')].slice(0,40);
 const m=CMETA(),found=[];
 paras.forEach(p=>{if(p.dataset.scanned)return;const txt=p.textContent;(txt.split(/(?<=[.!?])\s+(?=[A-Z“"])/)).forEach(sn=>{sn=sn.trim();if(sn.length>40&&/\d|rose|could|expected|says|according|remains/.test(sn))found.push(sn)})});
 const items=found.slice(0,8).map((sn,i)=>{const v=verdict(sn);return{i,sn,v,n:v.top[0].n}});
 S.scan=items;return items}
function sideScan(){
 const items=scanPage(),m=CMETA(),c={v:0,d:0,u:0};items.forEach(x=>c[x.v.g]++);
 const art=$('.article');if(art)art.querySelectorAll('mark.cm').forEach(k=>k.replaceWith(document.createTextNode(k.textContent)));
 if(art)items.forEach(x=>{[...art.querySelectorAll('p')].some(p=>{const h=p.innerHTML;if(h.includes(esc(x.sn))||p.textContent.includes(x.sn)){const t=p.textContent;if(!t.includes(x.sn))return false;p.innerHTML=esc(t).replace(esc(x.sn),`<mark class="cm ${x.v.g}" data-act="scanOne" data-i="${x.i}">${esc(x.sn)}</mark>`);return true}return false})});
 openSide(shead('Page scan','Read automatically from this page')+`<div class="sb">
 <div class="tile" style="font-size:13px"><b>${esc(m.title)}</b><div class="faint">${m.site} · ${m.author} · ${m.date}</div><div class="faint" style="margin-top:4px;word-break:break-all">${m.url}</div></div>
 <div style="display:flex;gap:8px;flex-wrap:wrap"><span class="pill ok">${c.v} supported</span><span class="pill gold">${c.d} disputed</span><span class="pill">${c.u} unconfirmed</span><span class="faint" style="align-self:center;font-size:12px">${items.length} statements found</span></div>
 <div class="stack" style="gap:8px">${items.map(x=>`<label class="opt" style="padding:10px 12px;align-items:flex-start;gap:10px"><input type="checkbox" class="scanck" data-i="${x.i}" checked style="margin-top:3px"><span style="min-width:0"><span style="font-size:13px;display:block">“${esc(x.sn)}”</span><span style="display:flex;gap:8px;align-items:center;margin-top:6px;flex-wrap:wrap">${gp(x.v.g)}<button class="rsrc" data-act="cite" data-n="${x.n}" style="padding:2px 6px;border:0;background:none;width:auto"><small>${esc(SRC[x.n].t.slice(0,48))} · ${Math.max(38,Math.round(x.v.top[0].s*100))}%</small></button></span></span></label>`).join('')}</div>
 <div><div class="eyebrow" style="margin-bottom:6px">Citation</div><div class="chips" style="margin-bottom:6px">${['APA','MLA','Vancouver','BibTeX'].map(x=>`<button class="fchip${S.cf===x?' on':''}" data-act="cfmt" data-f="${x}">${x}</button>`).join('')}</div><div class="tile" id="citeBox" style="font-size:12.5px;white-space:pre-wrap">${esc(fmtCite(S.cf,m))}</div><button class="btn sm" style="margin-top:6px" data-act="copyFmt">${ic('copy',13)} Copy citation</button></div>
 <div><div class="eyebrow" style="margin-bottom:8px">Add selected to a research task</div><div class="stack" id="pick" style="gap:6px" data-kind="scan" data-n="" data-txt="">${pickList()}</div></div></div>`);
 $('#side').classList.add('wide')}
const ART={title:'Immersion cooling adoption doubles across EV pack programmes',site:'Energy Storage Weekly',author:'R. Haldane',date:'4 November 2026',url:'https://www.energystorageweekly.com/immersion-cooling-adoption-2026'};
const CMETA=()=>{if(S.route==='clipper'&&!S.pickMeta)return ART;const h=($('#drawer.on #dtitle')||$('#drawer.on h2')||$('#main h1')||{}).textContent;return {title:(h||'Halden workspace').trim().slice(0,90),site:'Halden workspace',author:'Jeff Carter',date:'6 November 2026',url:'https://gsk.verity.app/#'+S.route}};
function fmtCite(st,m){const au=m.author?m.author:'',a=au?au.replace(/^(\w)\.\s*(\w+)$/,'$2, $1.'):'';
 if(st==='APA')return `${a?a+' ':''}(${m.date.slice(-4)}, ${m.date.split(' ').slice(1,2)} ${parseInt(m.date)}). ${m.title}. ${m.site}. ${m.url}`;
 if(st==='MLA')return `${a?a+'. ':''}“${m.title}.” ${m.site}, ${m.date}, ${m.url.replace(/^https?:\/\//,'')}.`;
 if(st==='Vancouver')return `${a?a.replace(/[., ]/g,' ').trim()+'. ':''}${m.title} [Internet]. ${m.site}; ${m.date.slice(-4)} [cited 2026 Nov 6]. Available from: ${m.url}`;
 return `@misc{haldane2026,\n  title = {${m.title}},\n  author = {${au}},\n  year = {${m.date.slice(-4)}},\n  howpublished = {${m.site}},\n  url = {${m.url}}\n}`}
function ring2(p){return V.ring(p,46,5)}
function pickList(sel){return T.filter(t=>t.stage!=='Decided').map(t=>`<button class="opt${sel===t.id?' on':''}" data-act="pickSel" data-id="${t.id}" style="padding:9px 12px"><span class="cb">${sel===t.id?ic('check',12):''}</span><span><b style="font-size:13.5px">${esc(t.title)}</b><div class="faint" style="font-size:12px">${t.code} · ${P[t.owner].n}</div></span></button>`).join('')+`<button class="btn pri" data-act="pickAdd" style="margin-top:6px" ${sel?'':'disabled'}>${sel?'Add to '+byId(sel).code:'Choose a task'}</button>`}
function sidePick(kind,data){
 openSide(shead('Add to research task','Which task should this go to?')+`<div class="sb"><div class="tile" style="font-size:13px">${esc(data.label)}</div><div class="stack" id="pick" style="gap:6px" data-kind="${kind}" data-n="${data.n||''}" data-txt="${esc(data.txt||'')}">${pickList()}</div></div>`)}
function addToTask(id,kind,n,txt){
 const t=byId(id);S.extra.added=S.extra.added||{};
 if(n&&SRC[n]){(S.extra.added[id]=S.extra.added[id]||[]);if(!t.src.includes(+n)&&!S.extra.added[id].includes(+n))S.extra.added[id].push(+n)}
 if(kind==='scan'){S.extra.added[id]=S.extra.added[id]||[];const m=CMETA(),sel=$$('.scanck:checked').map(x=>S.scan[+x.dataset.i]).filter(Boolean);sel.forEach(x=>{if(x.n&&!t.src.includes(+x.n)&&!S.extra.added[id].includes(+x.n))S.extra.added[id].push(+x.n);(S.comments[id]=S.comments[id]||[]).push(['amina','Clipped from '+m.site+': “'+x.sn.slice(0,110)+'”','now']);S.clips.unshift(Object.assign({id:'k'+Date.now()+x.i,text:x.sn,task:id,taskTitle:t.title,tags:['page scan'],note:'',when:'Just now',cite:fmtCite(S.cf,m)},m))});toast(sel.length+' statements added to '+t.code,'ok');closeSide();return}
 if(kind==='clip'||kind==='ans'){(S.comments[id]=S.comments[id]||[]).push(['amina','Clipped: “'+(txt||'').slice(0,110)+'”'+(n?' [source '+n+']':''),'now']);if(kind==='clip'){const m=CMETA(),tg=($('#clipTags')||{value:''}).value.split(',').map(x=>x.trim()).filter(Boolean);S.clips.unshift(Object.assign({id:'k'+Date.now(),text:txt,task:id,taskTitle:t.title,tags:tg,note:($('#clipNote')||{value:''}).value,when:'Just now',cite:fmtCite(S.cf,m)},m))}}
 toast('Added to '+t.code+' · '+esc(t.title.slice(0,36)),'ok');closeSide()}

/* ---------- actions ---------- */
function setStatus(id,st,extra){const t=byId(id);Object.assign(t,{status:st},extra||{});if(st!=='blocked')t.blk=null}
function openTask(id){const t=byId(id);if(!t)return;closePop();closeModal();S.openId=id;S.tab=S.tab==='case'&&t.status==='running'?'summary':'summary';$('#drawer').innerHTML=W.drawerHTML(t);$('#drawer').classList.add('on');$('#drawer .db').scrollTop=0;overlayState()}
function moveTask(id,st){
 const t=byId(id);if(t.stage===st)return;
 if(t.status==='running'){toast('Agents are still running on '+t.code+'. It can move once the run finishes.');return}
 t.stage=st;if(st==='Decided'){t.status='done';t.prog=100}else if(t.status==='done'||t.status==='parked')t.status='review';
 toast(t.code+' moved to '+st,'ok');refreshBody();if(S.openId===id)refreshDrawer();renderNav()}
function createTask(o){
 const n=T.length+101,id='t'+n,t=Object.assign({id,code:'R-'+n,title:'New research task',sector:'Materials',stage:'Discovery',owner:'amina',prog:4,pri:'Medium',due:'Jan 16',acc:84,rag:'g',status:'running',s:1.2,e:4,deps:[],src:[]},o);
 t.src=t.src.length?t.src:Object.keys(SRC).map(Number).filter((x,i)=>(i+hash(id))%4===0).slice(0,4);T.unshift(t);return t}
function launch(){
 const d=S.wiz.d;const t=createTask({title:d.title||(d.q.length>64?d.q.slice(0,62)+'…':d.q)||'New research task',sector:d.sector,pri:d.pri});
 closeModal();toast('Research launched. Agents are searching '+(d.src.length||5)+' source groups','ok');go('list');setTimeout(()=>openTask(t.id),250)}
function exportDoc(id){window.__openDeck(id)}
async function copy(txt,msg){try{await navigator.clipboard.writeText(txt);toast(msg||'Copied','ok')}catch(e){toast('Select the text and copy it manually')}}

/* ---------- event delegation ---------- */
const A={
 nav:e=>go(e.r),closeAll:()=>closeTop(),closeSide:()=>closeSide(),closeModal:()=>closeModal(),
 toggleNav:()=>$('#nav').classList.toggle('open'),
 role:e=>{S.role=e.r;if(S.route==='executive'&&e.r!=='vp')S.route='home';if(e.r==='vp'){go('executive')}else{renderAll()}toast('Switched to '+(e.r==='vp'?'VP R&D':'Researcher')+' view')},
 theme:()=>{const n=dk()?'light':'dark';document.documentElement.dataset.theme=n;ls.set('verity-theme',n);refreshChartsOnly()},
 notif:()=>{S.unread=false;renderTop();openSide(window.__notifHTML());$('#side').classList.remove('wide')},
 markRead:()=>{closePop();toast('All caught up','ok')},
 cmdk:()=>{modal(W.cmdkHTML(''));setTimeout(()=>{const i=$('#ckin');i&&i.focus()},30)},
 askFrom:e=>{closeModal();sendQ(e.q)},
 rjump:e=>{closeModal();S.rad.sel=e.id;go('radar')},
 openTask:e=>{if(popEl)closePop();openTask(e.id)},
 newThread:()=>go('home'),
 openThread:e=>go('thread-'+e.id),
 chip:e=>sendQ(V.SUG[+e.i][0]),
 send:()=>sendQ($('#q').value),send2:()=>{const q=$('#q2');sendQ(q.value)},
 followup:e=>sendQ(ansByKey(e.k).fups[+e.i]),
 attach:()=>{S.attached=!S.attached;if(S.route==='home')renderMain();else toast(S.attached?'Attached TL-2291-thermal-report.pdf':'Attachment removed','ok')},
 detach:()=>{S.attached=false;renderMain()},
 srcsel:(e,el)=>pop(el,`<h5>Search across</h5>${Object.keys(S.srcSel).map(k=>`<button class="pi" data-act="srcTog" data-k="${k}"><span class="cb" style="width:16px;height:16px;border-radius:5px;border:2px solid var(--line2);display:grid;place-items:center;${S.srcSel[k]?'background:var(--accent);border-color:var(--accent);color:#fff':''}">${S.srcSel[k]?ic('check',10):''}</span><b style="font-weight:600">${{Scholar:'Scholarly journals',IEEE:'IEEE and standards',Patents:'Patent databases',Web:'Live web',Uploads:'Upload library',Drive:'Company drive'}[k]}</b></button>`).join('')}`),
 srcTog:(e,el)=>{S.srcSel[e.k]=S.srcSel[e.k]?0:1;closePop();if(S.route==='home')renderMain()},
 modelsel:(e,el)=>pop(el,`<h5>Models</h5>${[['panel','Panel · 2 models','Perplexity Sonar + Gemini'],['pplx','Perplexity only','Fast, web-grounded']].map(m=>pi('setModel',`data-m="${m[0]}"`,S.model===m[0]?'check':'',m[1],m[2])).join('')}<div class="faint" style="padding:6px 10px 8px;font-size:12px">US-acceptable models only.</div>`),
 setModel:e=>{S.model=e.m;closePop();if(S.route==='home')renderMain();toast('Model set','ok')},
 cite:(e)=>{closePop();closeModal();sideCite(e.n)},
 claim:e=>{closePop();sideClaim(e.k)},
 setGrade:e=>{S.cg[e.k]=e.g;toast('Marked as '+GN[e.g].toLowerCase(),'ok');if($('#side').classList.contains('on')&&$('#side').textContent.includes('Claim check'))sideClaim(e.k);if(S.openId)refreshDrawerBody();const b=$('#abody');if(b&&S.route.startsWith('thread-')){const th=S.threads.find(t=>'thread-'+t.id===S.route);if(th&&!th.fresh){b.innerHTML=rich(ansByKey(th.key).html,th.key)}}},
 askReviewer:e=>{toast('Tomás Rivera will review this claim','ok')},
 saveAns:e=>sidePick('ans',{label:ansByKey(e.k).title||'Answer with citations',n:citesIn(ansByKey(e.k).html)[0],txt:ansByKey(e.k).title||'Saved answer'}),
 copyAns:e=>{const a=ansByKey(e.k);copy(a.html.replace(/\{[vdu]\|([^|]+)\|[^}]+\}/g,'$1').replace(/<br>/g,'\n')+'\n\nSources:\n'+citesIn(a.html).map(n=>n+'. '+citeFmt(n)).join('\n'),'Copied with citations')},
 flagAns:()=>toast('Flagged for review by Tomás Rivera','ok'),
 pickFor:(e)=>sidePick('src',{label:SRC[e.n].t,n:e.n}),
 pickSel:(e)=>{const pk=$('#pick');pk.dataset.sel=e.id;pk.innerHTML=pickList(e.id)},
 pickAdd:()=>{const pk=$('#pick');if(!pk.dataset.sel)return;addToTask(pk.dataset.sel,pk.dataset.kind,pk.dataset.n,pk.dataset.txt)},
 copyCite:e=>copy(citeFmt(e.n),'Citation copied'),
 openOrig:e=>toast('The publisher page opens in a new tab in production'),
 dtab:e=>{S.tab=e.t;const t=byId(S.openId);$$('.dh .tab').forEach(b=>b.classList.toggle('on',b.dataset.t===e.t));refreshDrawerBody();$('#dbody').scrollTop=0},
 lens:e=>{S.lens=e.l;refreshDrawerBody()},
 usage:(e,el)=>{toast('Added “'+e.u+'” as a candidate application','ok')},
 advance:e=>{const t=byId(e.id),i=STAGES.indexOf(t.stage);if(t.status==='running'){toast('Agents are still running');return}moveTask(e.id,STAGES[Math.min(i+1,3)])},
 moveMenu:(e,el)=>{const t=byId(e.id);pop(el,`<h5>Move to</h5>${STAGES.map(s=>pi('moveTo',`data-id="${t.id}" data-s="${s}"`,t.stage===s?'check':'',s,s==='Decided'?'Advance or park':'')).join('')}`,{right:true})},
 moveTo:e=>{closePop();moveTask(e.id,e.s)},
 notifyMe:e=>toast('We will notify you when '+byId(e.id).code+' finishes','ok'),
 submitVP:e=>{setStatus(e.id,'vp');toast('Submitted to Dr. Priya Nair for approval','ok');refreshDrawer();refreshBody()},
 nudge:e=>toast('Reminder sent to Dr. Priya Nair','ok'),
 approve:e=>{const t=byId(e.id);setStatus(e.id,'done',{stage:'Decided',prog:100});(S.comments[t.id]=S.comments[t.id]||[]).push(['priya','Approved. Proceed to the pilot.','now']);toast(t.code+' approved. '+P[t.owner].n+' has been notified','ok');if(S.route==='executive')renderMain();if(S.openId)refreshDrawer();renderNav()},
 changes:e=>{const t=byId(e.id);modal(W.mwrap('Request changes',`<div class="stack"><div class="muted">${esc(t.title)}</div><div class="field"><label>What should ${P[t.owner].n.split(' ')[0]} change?</label><textarea class="in" id="fb" rows="4" placeholder="Be specific. This feeds back into the next run."></textarea></div><div class="chips">${['Source a primary dataset','Re-run with a stricter threshold','Add a sensitivity range'].map(x=>`<button class="fchip" data-act="fbChip" data-v="${x}">${x}</button>`).join('')}</div></div>`,`<button class="btn ghost" data-act="closeModal">Cancel</button><button class="btn pri" data-act="sendFb" data-id="${t.id}">Send feedback</button>`))},
 fbChip:e=>{const f=$('#fb');f.value=(f.value?f.value+' ':'')+e.v+'.';f.focus()},
 sendFb:e=>{const t=byId(e.id),v=($('#fb').value||'').trim()||'Please revisit the flagged claims.';setStatus(e.id,'review');(S.comments[t.id]=S.comments[t.id]||[]).push(['priya',v,'now']);closeModal();toast('Feedback sent to '+P[t.owner].n,'ok');if(S.route==='executive')renderMain();if(S.openId)refreshDrawer();renderNav()},
 unblock:e=>{setStatus(e.id,'review');byId(e.id).rag='g';toast('Blocker marked as resolved','ok');refreshDrawer();refreshBody()},
 reopen:e=>{const t=byId(e.id);t.stage='Validation';setStatus(e.id,'review');toast(t.code+' reopened in Validation','ok');refreshDrawer();refreshBody()},
 post:e=>{const i=$('#cmtIn'),v=i.value.trim();if(!v){toast('Write a comment first');return}(S.comments[e.id]=S.comments[e.id]||[]).push(['amina',v,'now']);refreshDrawerBody();toast('Comment posted','ok')},
 exportCase:e=>exportDoc(e.id||S.openId),
 doExport:e=>{const t=byId(e.id);toast('Generating '+t.code+'-business-case.pdf …');setTimeout(()=>toast('PDF is ready. Downloads are enabled in the full product','ok'),1100)},
 copyCase:e=>{const t=byId(e.id),a=getAns(t);copy(t.title+'\n'+a.lens.rd.h+'. '+a.lens.fin.h+'. '+a.next,'Summary copied')},
 exportAll:()=>toast('Portfolio export queued: 10 tasks, with citations','ok'),
 sort:e=>{S.sort=S.sort.c===e.c?{c:e.c,d:-S.sort.d}:{c:e.c,d:1};refreshBody()},
 grp:e=>{S.shut[e.s]=!S.shut[e.s];refreshBody()},
 fsec:e=>{S.f.sector=e.s;S.f.sector=e.s;rerenderPV()},clearF:()=>{S.f={q:'',sector:'All',owner:'All'};rerenderPV()},
 swim:e=>{S.swim=e.s;refreshBody();$$('.toolbar .seg button').forEach(b=>b.classList.toggle('on',b.dataset.s===e.s))},
 zoom:e=>{S.zoom=e.z;rerenderPV()},crit:()=>{S.crit=!S.crit;rerenderPV()},
 rsec:e=>{S.rad.sector=S.rad.sector===e.s?'All':e.s;S.rad.sel=null;vbReset();rerenderPV()},
 rzin:()=>zoomBy(1.6),rzout:()=>zoomBy(1/1.6),rzreset:()=>{vbReset();vbApply()},
 rfull:()=>{S.rad.full=!S.rad.full;rerenderPV()},
 rf:e=>{S.rad[e.k]=e.v;S.rad.sel=null;vbReset();rerenderPV()},rclear:()=>{Object.assign(S.rad,{sector:'All',ring:'All',tr:'All',q:'',sel:null});vbReset();rerenderPV()},
 rsel:e=>{S.rad.sel=e.id||null;if(e.id){const p=V.radPos(e.id);if(p){const w=1200/3.2,h=1200/3.2;S.rad.vb=[p[0]-w/2,p[1]-h/2,w,h]}}else vbReset();rerenderPV()},rrel:()=>{S.rad.rel=!S.rad.rel;rerenderPV()},
 promote:e=>{const r=RAD.find(x=>x.id===e.id),t=createTask({title:r.t,sector:r.s,src:[]});r.task=t.id;toast('Promoted to '+t.code+'. Agents started','ok');rerenderPV()},
 linkSig:(e,el)=>pop(el,`<h5>Link signal to</h5>${T.filter(t=>t.stage!=='Decided').slice(0,7).map(t=>pi('doLink',`data-s="${e.id}" data-id="${t.id}"`,'link',esc(t.title.slice(0,46)),t.code)).join('')}`),
 doLink:e=>{RAD.find(x=>x.id===e.s).task=e.id;closePop();toast('Signal linked to '+byId(e.id).code,'ok');rerenderPV()},
 wizard:()=>{S.wiz={step:0,d:{q:'',title:'',sector:'Materials',pri:'Medium',src:['Scholar','Patents'],res:{},open:null,model:'panel'}};modal(W.wizHTML())},
 wset:e=>{S.wiz.d[e.k]=e.v;modal(W.wizHTML())},
 wsrc:e=>{const d=S.wiz.d,i=d.src.indexOf(e.v);if(i>=0){if(d.open===e.v){d.src.splice(i,1);d.open=null}else d.open=e.v}else{d.src.push(e.v);d.open=e.v}modal(W.wizHTML())},
 wclose:()=>{S.wiz.d.open=null;modal(W.wizHTML())},
 wadd:()=>{const d=S.wiz.d,v=($('#wlink').value||'').trim();if(!v){toast('Paste a link first');return}(d.res[d.open]=d.res[d.open]||[]).push({v});modal(W.wizHTML())},
 wdel:e=>{const d=S.wiz.d;d.res[d.open].splice(+e.i,1);modal(W.wizHTML())},
 wfile:()=>{let f=$('#wfileIn');if(!f){f=document.createElement('input');f.type='file';f.id='wfileIn';f.multiple=true;f.hidden=true;document.body.appendChild(f);f.addEventListener('change',()=>{const d=S.wiz&&S.wiz.d;if(!d||!d.open)return;[...f.files].forEach(x=>(d.res[d.open]=d.res[d.open]||[]).push({v:x.name,f:1}));f.value='';modal(W.wizHTML())})}f.click()},
 mic:async()=>{
  if(S.rec){stopRec();return}
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){toast('Voice input needs Chrome, Edge or Safari. You can type instead');return}
  try{const st=await navigator.mediaDevices.getUserMedia({audio:true});st.getTracks().forEach(t=>t.stop())}catch(e){toast('The microphone is blocked for this page. Allow it in your browser, or type instead');return}
  const ta=$('#wq');if(!ta)return;const base=ta.value.trim();let fin='';
  try{recog=new SR();recog.continuous=true;recog.interimResults=true;recog.lang='en-US';
   recog.onresult=ev=>{let it='';for(let i=ev.resultIndex;i<ev.results.length;i++){const r=ev.results[i];if(r.isFinal)fin+=r[0].transcript+' ';else it+=r[0].transcript}const t=$('#wq');if(t){t.value=(base?base+' ':'')+fin+it;S.wiz.d.q=t.value}};
   recog.onerror=ev=>{if(ev.error==='not-allowed'||ev.error==='service-not-allowed')toast('Voice input is blocked here. Type instead');stopRec()};
   recog.onend=()=>{if(S.rec)stopRec()};recog.start();S.rec=true;micUI()}catch(e){toast('Could not start voice input');S.rec=false}},
 tidy:async(e,el)=>{
  const ta=$('#wq');let txt=(ta.value||'').trim();if(!txt){toast('Say or type something first');return}
  if(S.rec)stopRec();el.disabled=true;const old=el.innerHTML;el.textContent='Tidying…';let out=null;
  try{const sm=window.gemini&&await gemini.use('sample');if(sm){const r=await sm('Rewrite these rough spoken notes as one clear research question for a pharma and materials R&D team (2 sentences max, no preamble). Then on a new line write "Title:" followed by a short working title of at most 7 words.\n\nNotes:\n'+txt,{modelTier:'quick'});out=r.text}}catch(x){}
  if(!out){const c=txt.replace(/\b(um+|uh+|like|you know|basically|kind of|sort of)\b[,]?\s*/gi,'').replace(/\s+/g,' ').trim();out=c.charAt(0).toUpperCase()+c.slice(1)+(/[.?!]$/.test(c)?'':'.')}
  const m=out.match(/\n?\s*Title:\s*(.+)$/i);if(m){out=out.replace(m[0],'').trim();if(!$('#wt').value)$('#wt').value=m[1].trim()}
  ta.value=out;S.wiz.d.q=out;S.wiz.d.title=$('#wt').value;el.disabled=false;el.innerHTML=old;toast('Question tidied','ok')},
 wtog:e=>{const d=S.wiz.d,k=e.k;const arr=d[k];const i=arr.indexOf(e.v);i>=0?arr.splice(i,1):arr.push(e.v);modal(W.wizHTML())},
 wnext:()=>{const w=S.wiz;syncWiz();if(w.step===0&&!w.d.q.trim()&&!w.d.title.trim()){toast('Describe what you want to find out');return}if(w.step===0&&!w.d.title)w.d.title=w.d.q.slice(0,60);w.step++;modal(W.wizHTML())},
 wback:()=>{syncWiz();S.wiz.step--;modal(W.wizHTML())},wlaunch:()=>launch(),
 upload:()=>{let f=$('#fileIn');if(!f){f=document.createElement('input');f.type='file';f.id='fileIn';f.multiple=true;f.hidden=true;document.body.appendChild(f);f.addEventListener('change',()=>{addFiles([...f.files].map(x=>x.name));f.value=''})}f.click()},
 conn:e=>{const arr=S.extra.conn=S.extra.conn||CONN.map(c=>c[2]);const i=+e.i;if(arr[i]===1){arr[i]=0;toast(CONN[i][0]+' disconnected')}else{arr[i]=2;toast('Connecting '+CONN[i][0]+' …');setTimeout(()=>{arr[i]=1;if(S.route==='sources')renderMain();toast(CONN[i][0]+' connected','ok')},1400)}renderMain()},
 srcInfo:(e)=>{const r=[...(S.extra.lib||[]),...LIB].find(x=>String(x.id)===String(e.id))||LIB[0];openSide(shead(esc(r.n),r.ty)+`<div class="sb"><div class="chips"><span class="pill ${r.st==='Indexing'?'accent run':'ok'}">${r.st==='Indexing'?'<i></i>Indexing':'Indexed'}</span><span class="pill">${r.ty}</span><span class="pill">Added ${r.ad}</span></div><div class="tile"><div class="eyebrow">Parsed</div><b style="font-size:22px">${40+hash(r.n)%160}</b><div class="faint">passages ready to cite</div></div><div class="muted">Text, tables and figure captions are extracted. Every answer that uses this file links back to the exact passage.</div><button class="btn pri" data-act="pickFor2" data-n="${esc(r.n)}">${ic('plus',14)} Attach to a research task</button></div>`)},
 pickFor2:e=>sidePick('doc',{label:e.n}),
 clipPop:(e,el)=>{const t=T.filter(x=>x.stage!=='Decided');pop($('#top .iconbtn'),`<div style="padding:10px 10px 6px;min-width:300px"><div style="display:flex;align-items:center;gap:8px"><img class="gsk" src="${window.GSKLOGO}" alt="" style="width:22px;height:22px;border-radius:6px"><b>Clip this page</b></div><div class="muted" style="font-size:12.5px;margin:6px 0">${S.route==='clipper'?'Immersion cooling adoption doubles across EV pack programmes':'Halden workspace · '+esc(V.S.route)}</div><div class="field"><label>Add to research task</label><select class="in" id="clipTask">${t.map(x=>`<option value="${x.id}">${x.code} · ${esc(x.title.slice(0,40))}</option>`).join('')}</select></div><div class="chips" style="margin:8px 0">${['Evidence','Competitor','Standard','Quote'].map((x,i)=>`<button class="fchip${i===0?' on':''}" data-act="tagTog">${x}</button>`).join('')}</div><button class="btn pri" style="width:100%" data-act="clipSave">Save whole page</button><button class="btn" style="width:100%;margin-top:6px" data-act="pickStart">${ic('spark',14)} Pick something on screen</button><div class="faint" style="font-size:12px;margin-top:8px">Pick any text, number, chart or table row to cite it. Triple-click also works.</div></div>`,{right:true})},
 cfmt:e=>{S.cf=e.f;$$('.side .chips .fchip').forEach(x=>x.classList.toggle('on',x.dataset.f===e.f));$('#citeBox').textContent=fmtCite(S.cf,CMETA())},copyFmt:()=>copy($('#citeBox').textContent,'Citation copied'),
 pickStart:()=>{closePop();startPick()},sideWide:()=>{$('#side').classList.toggle('wide')},scanPage:()=>sideScan(),scanOne:(e,el)=>{const i=+el.dataset.i;sideScan();const ck=$$('.scanck')[i];ck&&ck.scrollIntoView({block:'center'})},
 clipSel:()=>{const s=String(getSelection()).trim();$('#selpill')&&$('#selpill').remove();if(s)sideClip(s)},
 clipInfo:e=>{const c=S.clips.find(x=>x.id===e.id);openSide(shead('Clip',esc(c.site||''))+`<div class="sb"><div class="quote">“${esc(c.text||c.title)}”</div><div class="tile"><b>${esc(c.title)}</b><div class="faint">${esc(c.site||'')} · ${esc(c.when||'')}</div></div><div class="chips"><span class="pill accent">${esc(c.taskTitle||'')}</span>${(c.tags||[]).map(x=>`<span class="pill">#${esc(x)}</span>`).join('')}</div><div class="tile" style="white-space:pre-wrap;font-size:12.5px">${esc(c.cite||fmtCite('APA',{title:c.title,site:c.site||'',author:c.author||'',date:c.date||'4 November 2026',url:c.url||''}))}</div><button class="btn" data-act="openTask" data-id="${c.task}">Open task</button></div>`)},
 syncTasks:()=>copy(JSON.stringify(T.filter(t=>t.stage!=='Decided').map(t=>({id:t.id,title:t.title}))),'Tasks copied. Paste them in the extension settings'),
 clipsImport:()=>{let f=$('#clipIn');if(!f){f=document.createElement('input');f.type='file';f.id='clipIn';f.accept='.json,application/json';f.hidden=true;document.body.appendChild(f);f.addEventListener('change',async()=>{try{const j=JSON.parse(await f.files[0].text());(j.clips||[]).forEach(c=>{S.clips.unshift({id:'k'+c.id,text:c.text,title:c.title,site:c.site,url:c.url,tags:c.tags||[],note:c.note,cite:c.citation,task:c.task,taskTitle:c.taskTitle||(byId(c.task)||{}).title,when:'Imported'});const t=byId(c.task);if(t)(S.comments[t.id]=S.comments[t.id]||[]).push(['amina','Clipped from the web: “'+(c.text||c.title).slice(0,110)+'” ('+(c.site||'')+')','now'])});toast('Imported '+(j.clips||[]).length+' clips','ok');if(S.route==='sources')renderMain()}catch(e){toast('That file is not a Halden clips export')}f.value=''})}f.click()},
 tagTog:(e,el)=>el.classList.toggle('on'),
 clipSave:()=>{const id=$('#clipTask').value;closePop();addToTask(id,'clip',null,'Page clip: Immersion cooling adoption doubles across EV pack programmes')},
};

/* ---- pick from screen ---- */
let pickOn=false,pickEl=null;
const PICK='p,li,td,th,h1,h2,h3,h4,.tile,.kpi,.card,.tcard,.quote,.dtx,.abody,.rsrc,svg.chart,.sl,.ans,.amsg';
function startPick(){if(pickOn)return;pickOn=true;document.body.classList.add('picking');let bx=$('#pickbox');if(!bx){bx=document.createElement('div');bx.id='pickbox';document.body.appendChild(bx)}bx.style.display='none';toast('Click anything on the screen to cite it. Press Esc to cancel.')}
function endPick(){pickOn=false;pickEl=null;document.body.classList.remove('picking');const bx=$('#pickbox');if(bx)bx.style.display='none'}
function pickTarget(t){if(!t||!t.closest)return null;if(t.closest('#side,#top,#toast,#pickbox,.pop,#selpill'))return null;const e=t.closest(PICK);return e&&e.textContent.trim().length>3?e:null}
document.addEventListener('mousemove',ev=>{if(!pickOn)return;const e=pickTarget(ev.target),bx=$('#pickbox');pickEl=e;if(!e){bx.style.display='none';return}const r=e.getBoundingClientRect();Object.assign(bx.style,{display:'block',left:r.left-3+'px',top:r.top-3+'px',width:r.width+6+'px',height:r.height+6+'px'})},true);
document.addEventListener('click',ev=>{if(!pickOn)return;ev.preventDefault();ev.stopPropagation();const e=pickTarget(ev.target)||pickEl;if(!e){toast('Nothing to cite there. Try a sentence, number or chart.');return}
 let txt=(e.matches&&e.matches('svg.chart')?[...e.querySelectorAll('title')].map(x=>x.textContent).join('; '):e.innerText||e.textContent).replace(/\s+/g,' ').trim();endPick();sideClip(txt)},true);
document.addEventListener('keydown',ev=>{if(pickOn&&ev.key==='Escape'){ev.stopPropagation();endPick();toast('Cancelled')}},true);
function vbReset(){S.rad.vb=[0,0,1200,1200]}
function vbApply(){const s=$('#rsvg');if(s)s.setAttribute('viewBox',S.rad.vb.join(' '))}
function zoomBy(f,fx=.5,fy=.5){const[x,y,w,h]=S.rad.vb,nw=Math.max(1200/14,Math.min(1200*1.2,w/f)),nh=nw;S.rad.vb=[x+fx*(w-nw),y+fy*(h-nh),nw,nh];vbApply();const rs=$('#radsvg');if(rs)rs.innerHTML=V.radarSVG()}
let pan=null;
document.addEventListener('wheel',ev=>{const s=ev.target.closest&&ev.target.closest('#rsvg');if(!s)return;ev.preventDefault();const r=s.getBoundingClientRect();zoomBy(ev.deltaY<0?1.18:1/1.18,(ev.clientX-r.left)/r.width,(ev.clientY-r.top)/r.height)},{passive:false});
document.addEventListener('pointerdown',ev=>{const s=ev.target.closest&&ev.target.closest('#rsvg');if(!s)return;pan={x:ev.clientX,y:ev.clientY,vb:S.rad.vb.slice(),r:s.getBoundingClientRect(),moved:false}});
window.addEventListener('pointermove',ev=>{if(!pan)return;const dx=ev.clientX-pan.x,dy=ev.clientY-pan.y;if(Math.abs(dx)+Math.abs(dy)>4)pan.moved=true;if(!pan.moved)return;const k=pan.vb[2]/pan.r.width;S.rad.vb=[pan.vb[0]-dx*k,pan.vb[1]-dy*k,pan.vb[2],pan.vb[3]];vbApply()});
window.addEventListener('pointerup',()=>{if(pan&&pan.moved){const m=pan;setTimeout(()=>{},0);window.__panMoved=true;setTimeout(()=>window.__panMoved=false,50)}pan=null});
document.addEventListener('click',ev=>{if(window.__panMoved&&ev.target.closest&&ev.target.closest('#rsvg')){ev.stopPropagation();ev.preventDefault()}},true);
function micUI(){const m=$('#mic');if(m){m.classList.toggle('rec',!!S.rec);m.lastChild.textContent=S.rec?'Stop':'Record'}}
function stopRec(){try{recog&&recog.stop()}catch(e){}S.rec=false;micUI()}
function rerenderPV(){const m=$('#main');m.innerHTML=V.pvHTML(S.route);after()}
function refreshChartsOnly(){}
function syncWiz(){const d=S.wiz.d,q=$('#wq'),t=$('#wt');if(q)d.q=q.value;if(t)d.title=t.value}
function addFiles(names){S.extra.lib=S.extra.lib||[];names.forEach((n,i)=>{const r={id:'u'+Date.now()+i,n,ty:(n.split('.').pop()||'file').toUpperCase(),st:'Indexing',ad:'Just now'};S.extra.lib.unshift(r);setTimeout(()=>{r.st='Indexed';if(S.route==='sources')renderMain();toast(n+' is indexed and citable','ok')},2200+i*500)});toast('Uploading '+names.length+' file'+(names.length>1?'s':''));if(S.route==='sources')renderMain()}

document.addEventListener('click',ev=>{
 const el=ev.target.closest('[data-act]');
 if(popEl&&!ev.target.closest('.pop')&&!(el&&['notif','clipPop','srcsel','modelsel','moveMenu','linkSig'].includes(el.dataset.act)))closePop();
 if(ev.detail>=3){const sel=String(getSelection()).trim();if(sel.length>14&&!ev.target.closest('.side,input,textarea,.mbox,.pop')){ev.preventDefault();sideClip(sel);return}}
 if(!el)return;
 if(el.dataset.act==='closeAll'&&ev.target!==el)return;
 if(el.closest('.mbox')&&el.dataset.act==='closeModal'||true){}
 const f=A[el.dataset.act];if(!f)return;
 if(el.tagName==='BUTTON'&&el.closest('.tcard')&&el.dataset.act!=='openTask'){ev.stopPropagation()}
 ev.stopPropagation&&0;f(el.dataset,el)});
document.addEventListener('click',ev=>{const m=$('#modal');if(ev.target===m)closeModal()});
document.addEventListener('input',ev=>{
 const t=ev.target;
 if(t.id==='fq'){S.f.q=t.value;const b=$('#pv-body');b.innerHTML=V.pvBody(S.route);after()}
 else if(t.id==='rq'){S.rad.q=t.value;S.rad.sel=null;vbReset();$('#radsvg').innerHTML=V.radarSVG();$('#radside').innerHTML=V.radarSide();const n=V.radVis().length;$('#rcount').textContent=n+' element'+(n===1?'':'s')}
 else if(t.id==='sq'){S.sq=t.value;const p=V.sourcesHTML();const tmp=document.createElement('div');tmp.innerHTML=p;$('#srows').innerHTML=tmp.querySelector('#srows').innerHTML}
 else if(t.id==='ckin'){const m=$('#modal');m.innerHTML=W.cmdkHTML(t.value);const i=$('#ckin');i.focus();i.setSelectionRange(i.value.length,i.value.length)}
 else if(t.id==='q'||t.id==='q2'){t.style.height='auto';t.style.height=Math.min(t.scrollHeight,180)+'px'}
});
document.addEventListener('change',ev=>{if(ev.target.id==='fown'){S.f.owner=ev.target.value;rerenderPV()}});
document.addEventListener('keydown',ev=>{
 if(ev.key==='Escape')closeTop();
 if((ev.metaKey||ev.ctrlKey)&&ev.key.toLowerCase()==='k'){ev.preventDefault();A.cmdk()}
 if(ev.key==='Enter'&&!ev.shiftKey){const t=ev.target;if(t.id==='q'){ev.preventDefault();A.send()}else if(t.id==='q2'){ev.preventDefault();A.send2()}else if(t.id==='ckin'){const f=$('#modal [data-act]');f&&f.click()}}
 if((ev.key==='Enter'||ev.key===' ')&&ev.target.matches&&ev.target.matches('mark[data-act],tr[data-act]')){ev.preventDefault();ev.target.click()}
});
/* drag and drop */
let dragId=null;
document.addEventListener('dragstart',ev=>{const c=ev.target.closest&&ev.target.closest('.tcard');if(!c)return;dragId=c.dataset.id;c.classList.add('drag');try{ev.dataTransfer.setData('text/plain',dragId);ev.dataTransfer.effectAllowed='move'}catch(e){}});
document.addEventListener('dragend',()=>{dragId=null;$$('.drag,.over').forEach(x=>x.classList.remove('drag','over'))});
document.addEventListener('dragover',ev=>{const c=ev.target.closest&&ev.target.closest('.bcol');if(c&&dragId){ev.preventDefault();$$('.bcol.over').forEach(x=>x!==c&&x.classList.remove('over'));c.classList.add('over')}});
document.addEventListener('drop',ev=>{const c=ev.target.closest&&ev.target.closest('.bcol');if(c&&dragId){ev.preventDefault();const id=dragId;dragId=null;moveTask(id,c.dataset.stage)}
 const d=ev.target.closest&&ev.target.closest('#drop');if(d){ev.preventDefault();addFiles([...ev.dataTransfer.files].map(f=>f.name))}});
document.addEventListener('dragover',ev=>{if(ev.target.closest&&ev.target.closest('#drop'))ev.preventDefault()});
document.addEventListener('mouseup',ev=>{if(ev.target.closest&&ev.target.closest('#selpill'))return;setTimeout(()=>{const old=$('#selpill');old&&old.remove();const s=getSelection();const t=String(s).trim();if(t.length<6||!s.rangeCount||S.route!=='clipper')return;const an=s.anchorNode&&(s.anchorNode.nodeType===1?s.anchorNode:s.anchorNode.parentElement);if(!an||!an.closest('.article'))return;const r=s.getRangeAt(0).getBoundingClientRect();const b=document.createElement('button');b.id='selpill';b.className='btn pri sm';b.dataset.act='clipSel';b.style.cssText='position:fixed;z-index:70;left:'+Math.max(8,r.left+r.width/2-60)+'px;top:'+Math.max(8,r.top-42)+'px;border-radius:99px;box-shadow:var(--shadow-lg)';b.innerHTML='Cite in Halden';b.onmousedown=e=>e.preventDefault();document.body.appendChild(b)},10)});

/* expandable data boxes */
function xTable(h,rows,att){return `<div class="tw" style="box-shadow:none"><table class="t" style="min-width:0"><thead><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map((r,i)=>`<tr${att&&att[i]?` class="clk" tabindex="0" data-act="${att[i][0]}" data-${att[i][1]}="${att[i][2]}" data-tip="${att[i][3]}"`:''}>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
function xpDetail(label,val,sub){
 const l=label.toLowerCase(),t=S.openId?byId(S.openId):null,tk=x=>x.map(y=>[`<b>${esc(y.title)}</b>`,y.stage,STATUS[y.status][0],Math.round(y.prog)+'%',y.acc+'%']),ta=x=>x.map(y=>['openTask','id',y.id,'Open ticket']);
 const th=['Task','Stage','Status','Progress','Accuracy'];
 if(l==='active research'){const g=T.filter(x=>x.stage!=='Decided');return xTable(th,tk(g),ta(g))}
 if(l==='awaiting review'||l==='pending approvals'){const g=T.filter(x=>x.status==='review'||x.status==='vp');return xTable(th,tk(g),ta(g))}
 if(l==='bottlenecks'){const g=T.filter(x=>x.status==='blocked'||x.rag==='r');return xTable(th,tk(g),ta(g))}
 if(l==='avg accuracy'&&!t)return xTable(['Sector','Tasks','Avg accuracy'],SECTS.map(s=>{const g=T.filter(x=>x.sector===s);return [s,g.length,g.length?Math.round(g.reduce((a,x)=>a+x.acc,0)/g.length)+'%':'—']}));
 if(l==='citations verified')return xTable(['Source','Type','Year','Check'],Object.keys(SRC).map(n=>[esc(SRC[n].t),SRC[n].ty,SRC[n].y,SRC[n].ok?'Verified':'Needs check']),Object.keys(SRC).map(n=>['cite','n',n,'Open source']));
 if(l==='claims flagged')return xTable(['Task','Flagged claims'],T.filter(x=>flagged(x)).map(x=>[`<b>${esc(x.title)}</b>`,flagged(x)]),T.filter(x=>flagged(x)).map(x=>['openTask','id',x.id,'Open ticket']));
 if(t&&['accuracy','claims verified','flags'].includes(l)){const a=getAns(t),k=akey(t),cs=W.claimsOf(k);return xTable(['Claim','Grade','Sources'],Object.keys(a.cl).map(c=>[esc(cs[c]),W.gp(W.gradeOf(k,c)),a.cl[c].s.map(n=>'['+n+']').join(' ')]))}
 if(t&&l==='sources')return xTable(['#','Source','Type','Year','Relevance'],V.citesIn(getAns(t).html).map(n=>[n,esc(SRC[n].t),SRC[n].ty,SRC[n].y,SRC[n].rel+'%']));
 return `<p class="muted" style="margin:0">${esc(sub||'')}. Open the related view for the full breakdown.</p>`}
function xpOpen(el){
 const svg=el.querySelector('svg.chart');
 if(svg){const rows=[...svg.querySelectorAll('title')].map(x=>x.textContent.split(': '));const lab=(el.querySelector('.eyebrow,.ct-t,.bt')||{textContent:'Chart'}).textContent;
  modal(W.mwrap(esc(lab),`<div class="stack"><div>${svg.outerHTML.replace('<svg','<svg style="max-height:380px"')}</div>${rows.length?xTable(['Item','Value'],rows.map(r=>[esc(r[0]),`<b>${esc(r[1]||'')}</b>`])):''}</div>`,'<button class="btn" data-act="closeModal">Close</button>',false));return}
 const label=(el.querySelector('.eyebrow')||{textContent:''}).textContent.trim(),val=(el.querySelector('b,div[style*="font-size:24px"]')||{textContent:''}).textContent.trim(),sub=(el.querySelector('small,.faint')||{textContent:''}).textContent.trim();
 modal(W.mwrap(esc(label),`<div class="stack"><div style="display:flex;align-items:baseline;gap:12px"><span style="font-size:40px;font-weight:600;letter-spacing:-.02em;color:var(--accent)">${esc(val)}</span><span class="muted">${esc(sub)}</span></div>${xpDetail(label,val,sub)}</div>`,'<button class="btn" data-act="closeModal">Close</button>'))}
document.addEventListener('click',ev=>{
 if(ev.target.closest('[data-act],button,a,input,textarea,select,mark,.sl,.modal,.dk,.pop,.side'))return;
 const el=ev.target.closest('.tile,.kpi,.card:has(svg.chart)');if(!el)return;
 if(el.closest('.tcard,.mbox'))return;xpOpen(el)});
/* tooltips */
document.addEventListener('mouseover',ev=>{const el=ev.target.closest&&ev.target.closest('[data-tip]');if(!el){tipEl.style.opacity=0;return}
 tipEl.innerHTML=el.dataset.tip;tipEl.style.opacity=1;const r=el.getBoundingClientRect(),w=tipEl.offsetWidth,h=tipEl.offsetHeight;let x=r.left+r.width/2-w/2,y=r.top-h-8;if(y<6)y=r.bottom+8;x=Math.max(8,Math.min(x,innerWidth-w-8));tipEl.style.left=x+'px';tipEl.style.top=y+'px'});
document.addEventListener('scroll',()=>{tipEl.style.opacity=0},true);
window.addEventListener('hashchange',()=>{const r=location.hash.slice(1);if(r&&r!==S.route)go(r)});
window.addEventListener('resize',()=>{if(S.route==='roadmap')drawDeps()});

/* simulated agent progress */
setInterval(()=>{
 T.filter(t=>t.status==='running').forEach(t=>{
  const before=Math.floor(t.prog/20);t.prog=Math.min(100,t.prog+0.5+((hash(t.id)%3)*.15));
  $$('[data-pg="'+t.id+'"]').forEach(e=>e.textContent=Math.round(t.prog)+'%');$$('[data-pgb="'+t.id+'"]').forEach(e=>e.style.width=t.prog+'%');
  if(t.prog>=100){t.status='review';t.rag='g';toast('Agents finished '+t.code+'. Ready for your review','ok');renderNav();if(S.route!=='home'&&!S.route.startsWith('thread-')&&S.route!=='sources'&&S.route!=='clipper'&&S.route!=='executive')rerenderPV();if(S.openId===t.id){refreshDrawer()}}
  else if(S.openId===t.id&&S.tab==='summary'&&Math.floor(t.prog/20)!==before)refreshDrawerBody();
 })},1200);

/* boot */
const th=ls.get('verity-theme');if(th==='dark'||th==='light')document.documentElement.dataset.theme=th;
const h=location.hash.slice(1);
S.route=(ROUTES.includes(h)&&!(h==='executive'))||h.startsWith('thread-')?h:'home';
if(S.route.startsWith('thread-')&&!S.threads.find(t=>'thread-'+t.id===S.route))S.route='home';
window.__renderAll=renderAll;
renderAll();
})();

/* ===== original approved design scripts ===== */
/* ===== Source hub: per-source workspaces, directory, filters, upload naming, wizard picker ===== */
(function(){
'use strict';
const D=window.__D,V=window.__V,W=window.__W,S=V.S;
const {$,esc,ic,hash,P,SRC,T,byId,SECTS}=D;
const TODAY='2026-11-08',TD=new Date(TODAY+'T00:00:00Z');
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fd=s=>{if(!s)return '—';const [y,m,d]=String(s).split('-');return d?`${+d} ${MON[+m-1]} ${y}`:m?`${MON[+m-1]} ${y}`:y};
const yr=s=>s?+String(s).slice(0,4):0;
const pad=(n,l)=>String(n).padStart(l,'0');
const age=s=>s?Math.round((TD-new Date(s+'T00:00:00Z'))/864e5):1e9;
const ago=n=>{const d=new Date(TD-n*864e5);return d.toISOString().slice(0,10)};
const addM=(iso,k)=>{let [y,m,d]=iso.split('-').map(Number);m+=k;y+=Math.floor((m-1)/12);m=((m-1)%12+12)%12+1;return `${y}-${pad(m,2)}-${pad(Math.min(d,28),2)}`};
const Rn=seed=>{let h=hash(seed)||1;return()=>{h=(Math.imul(h,1103515245)+12345)>>>0;return (h>>>8)/16777216}};
const pk=(r,a)=>a[Math.floor(r()*a.length)];
const lc1=s=>s[0].toLowerCase()+s.slice(1);
const IX={folder:'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z',star:'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',filter:'M4 5h16l-6 8v6l-4-2v-4z',tag:'M3 12V4h8l10 10-8 8zM7.5 7.5h.01',globe:'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18',book:'M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 5v16',cal:'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',saved:'M6 3h12v18l-6-4-6 4z',grid:'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',rows:'M4 6h16M4 12h16M4 18h16',back:'M15 5l-7 7 7 7',sync:'M20 11a8 8 0 00-14.9-3M4 13a8 8 0 0014.9 3M4 4v4h4M20 20v-4h-4'};
const ix=(n,s)=>IX[n]?`<svg class="ic" viewBox="0 0 24 24"${s?` style="width:${s}px;height:${s}px"`:''}><path d="${IX[n]}"/></svg>`:ic(n,s);
const nm=id=>P[id]?P[id].n:id;
function toast(msg,ok){const el=document.createElement('div');el.className='toast'+(ok?' ok':'');el.innerHTML=(ok?ic('check',16):'')+'<span>'+msg+'</span>';$('#toasts').appendChild(el);setTimeout(()=>{el.style.transition='opacity .3s';el.style.opacity=0;setTimeout(()=>el.remove(),300)},2800)}
const strip=s=>String(s||'').replace(/[«»]/g,'');

/* ---------- sources ---------- */
const SOURCES={
 scholar:{n:'Google Scholar',sub:'Journals, reviews and preprints',prov:'Google Scholar · arXiv · ChemRxiv · publisher feeds',ico:'book',ci:0,grp:'Scholar',c:'#2F6FDE'},
 patent:{n:'Patent databases',sub:'Grants and applications across 7 offices',prov:'USPTO · EPO · WIPO · CNIPA · JPO · KIPO · DPMA',ico:'shield',ci:2,grp:'Patents',c:'#B4570F'},
 ieee:{n:'IEEE Xplore and standards',sub:'Standards, conference and journal papers',prov:'IEEE · IEC · ISO · UL · SAE · UN · DoD',ico:'layers',ci:1,grp:'IEEE',c:'#0A7C93'},
 web:{n:'Web and news',sub:'Monitored news, trade press and releases',prov:'Live search with dated, attributable citations',ico:'globe',ci:3,grp:'Web',c:'#1F7A4A'},
 library:{n:'Upload library',sub:'Everything your team has uploaded',prov:'PDF · DOCX · PPTX · XLSX · CSV · TXT',ico:'upload',ci:4,grp:'Uploads',c:'#5B49BD'},
 drive:{n:'Company drive',sub:'Shared reports, lab data and minutes',prov:'SharePoint and Google Drive folders',ico:'folder',ci:5,grp:'Uploads',c:'#A3306B'}
};
const KEYS=Object.keys(SOURCES);
const connV=k=>{const i=SOURCES[k].ci,a=S.extra.conn;return a?a[i]:D.CONN[i][2]};
const isOn=k=>connV(k)===1;

/* ---------- directory ---------- */
const FOLD={
 scholar:[{h:'Collections'},{id:'sc-mat',n:'Materials'},{id:'sc-solid',n:'Solid electrolytes',p:'sc-mat'},{id:'sc-anode',n:'Anodes and binders',p:'sc-mat'},{id:'sc-int',n:'Interfaces and coatings',p:'sc-mat'},{id:'sc-the',n:'Thermal'},{id:'sc-imm',n:'Immersion cooling',p:'sc-the'},{id:'sc-cp',n:'Cold plates',p:'sc-the'},{id:'sc-pcm',n:'Phase-change materials',p:'sc-the'},{id:'sc-sup',n:'Supply chain'},{id:'sc-na',n:'Sodium-ion',p:'sc-sup'},{id:'sc-hc',n:'Hard carbon',p:'sc-sup'},{id:'sc-saf',n:'Safety and compliance'},{id:'sc-abuse',n:'Abuse testing',p:'sc-saf'},{id:'sc-sus',n:'Sustainability'},{id:'sc-rec',n:'Recycling and bio-based',p:'sc-sus'}],
 patent:[{h:'Landscapes'},{id:'pt-se',n:'Solid electrolytes'},{id:'pt-thm',n:'Thermal management'},{id:'pt-an',n:'Anodes and binders'},{id:'pt-na',n:'Sodium-ion cells'},{id:'pt-cs',n:'Casings and enclosures'},{h:'Assignee watchlists'},{id:'pw-corv',n:'Corvane Energy',fn:x=>/Corvane/.test(x.assignee)},{id:'pw-therm',n:'Thermaris GmbH',fn:x=>/Thermaris/.test(x.assignee)},{id:'pw-hx',n:'Huaxin Power',fn:x=>/Huaxin/.test(x.assignee)},{id:'pw-own',n:'Our own filings',fn:x=>x.fto==='Own portfolio'}],
 ieee:[{h:'Standards sets'},{id:'st-tr',n:'Transport and abuse'},{id:'st-env',n:'Environmental testing'},{id:'st-ev',n:'EV traction'},{id:'st-sys',n:'Stationary storage'},{h:'Papers'},{id:'cf-th',n:'Thermal modelling'},{id:'cf-bms',n:'BMS and diagnostics'}],
 web:[{h:'Monitors'},{id:'wb-imm',n:'Thermal and cooling'},{id:'wb-na',n:'Sodium-ion and hard carbon'},{id:'wb-reg',n:'Regulation and standards'},{id:'wb-sup',n:'Companies and suppliers'}],
 library:[{h:'Folders'},{id:'lb-lab',n:'Lab reports and data'},{id:'lb-int',n:'Expert interviews'},{id:'lb-sup',n:'Supplier documents'},{id:'lb-mkt',n:'Market reports'},{id:'lb-gate',n:'Gate reviews'},{id:'lb-pub',n:'Saved papers and standards'}],
 drive:[{h:'Shared folders'},{id:'dr-gate',n:'Gate reviews'},{id:'dr-lab',n:'Lab data'},{id:'dr-qual',n:'Supplier qualification'}],
 all:[]
};
const FAREA={'sc-mat':'Materials','sc-the':'Thermal','sc-sup':'Supply chain','sc-saf':'Compliance','sc-sus':'Sustainability'};
const parentOf=(k,id)=>{const f=(FOLD[k]||[]).find(x=>x.id===id);return f&&f.p};
const SMART={
 _:[['all','All records','list',()=>true],['recent','Added in last 30 days','clock',x=>age(x.added)<=30],['star','Starred','star',x=>x.star],['linked','Linked to tasks','link',x=>x.tasks.length>0]],
 scholar:[['oa','Open access','book',x=>x.oa],['hi','Highly cited (100+)','chart',x=>x.cites>=100]],
 patent:[['force','In force','shield',x=>x.status==='Granted'],['exp','Expiring before 2031','cal',x=>x.status==='Granted'&&x.exp<'2031'],['fto','High FTO risk','flag',x=>x.fto==='High'],['newpub','Published in last 12 months','clock',x=>age(x.pub)<=365]],
 ieee:[['act','Active standards','check',x=>x.status==='Active'&&x.ctype==='Standard'],['old','Superseded or withdrawn','clock',x=>/Superseded|Withdrawn/.test(x.status)],['draft','Drafts in ballot','edit',x=>x.status==='Draft']],
 web:[['t1','Tier 1 sources','shield',x=>/^Tier 1/.test(x.tier)],['mo','Published in last 31 days','cal',x=>age(x.date)<=31]],
 library:[['conf','Confidential','shield',x=>x.conf==='Confidential'],['idx','Still indexing','clock',x=>x.status!=='Indexed'],['dbc','Copies from databases','layers',x=>x.src!=='library']],
 drive:[],all:[]
};
const SAVED={
 scholar:[{n:'LLZO interfacial resistance, 2023 on',q:'LLZO interfacial',yr:['2023','']},{n:'Immersion propagation delay',q:'immersion propagation'},{n:'Open-access reviews in thermal',f:{type:['Review'],area:['Thermal']}}],
 patent:[{n:'Corvane family, all offices',f:{assignee:['Corvane Energy, Inc.']}},{n:'Granted US and EP, thermal',f:{juris:['United States (USPTO)','Europe (EPO)'],status:['Granted'],area:['Thermal']}},{n:'Pending sodium-ion filings since 2023',f:{status:['Pending','PCT published'],area:['Supply chain']},yr:['2023','']}],
 ieee:[{n:'Active EV traction standards',f:{status:['Active']},folder:'st-ev'},{n:'Thermal conference papers',f:{ctype:['Conference paper'],area:['Thermal']}}],
 web:[{n:'Tier 1, regulation',f:{tier:['Tier 1 · primary source']},folder:'wb-reg'},{n:'Sodium-ion market news',q:'sodium'}],
 library:[{n:'Confidential lab data',f:{conf:['Confidential'],origin:['Internal lab']}},{n:'Supplier documents for R-104',q:'hard carbon'}],
 drive:[],all:[]
};

/* ---------- catalog ---------- */
const CAT=[];
const SN=['Okafor','Lindqvist','Tanaka','Moreau','Kowalski','Haddad','Ferreira','Zhang','Iyer','Schneider','Novak','Park','Rossi','Adeyemi','Nakamura','Gupta','Bianchi','Kim','Andersson','Mensah','Silva','Weber','Chen','Ahmed'];
const INI='ABCDEFGHJKLMNPRSTVY'.split('');
const auth=(r,n)=>Array.from({length:n},()=>pk(r,SN)+' '+pk(r,INI)+'.').join(', ');
const add=o=>{CAT.push(Object.assign({tasks:[],tags:[],star:false,note:'',ct:'',by:'amina',status:'Indexed'},o))};
const FIND={Materials:['Interfacial resistance fell by more than 70% after surface treatment.','Critical current density exceeded 1.2 mA/cm² at 25 °C.','Capacity retention reached 91% after 500 cycles.','Process yield remained the main barrier to scale-up.'],Thermal:['Peak cell temperature fell by 9 K at 3C discharge.','Propagation to the adjacent cell was delayed by more than 90 s.','Pressure drop rose 18% for a 0.01 K/W gain in thermal resistance.','Fluid compatibility held over 1,000 h at 60 °C.'],'Supply chain':['Modelled cell cost fell to $51 per kWh at 10 GWh.','Precursor price is the most sensitive input in the cost model.','Qualification takes two production cycles on average.'],Compliance:['Test outcomes varied more with state of charge than with cell format.','Vent gas was dominated by CO, CO₂ and H₂.'],Sustainability:['Embodied carbon fell by 38% against the incumbent material.','Recovered cathode met virgin-grade specifications.']};
const VEN={Materials:['Nature Energy','Advanced Energy Materials','ACS Energy Letters','Journal of Power Sources','Energy Storage Materials'],Thermal:['Applied Thermal Engineering','International Journal of Heat and Mass Transfer','Journal of Energy Storage','eTransportation'],'Supply chain':['Joule','Energy Policy','Resources, Conservation & Recycling'],Compliance:['Journal of Power Sources','Process Safety and Environmental Protection'],Sustainability:['Green Chemistry','Journal of Cleaner Production']};
const kwOf=t=>t.replace(/[^\w\s-]/g,'').split(/\s+/).filter(w=>w.length>5).slice(0,4).map(w=>w.toLowerCase());

// Scholar: hand-picked records that the answers already cite
[[1,'Lindqvist A., Okoro N., Hwang J.','Journal of Power Sources','2025-02-11','Journal article',48,'sc-solid','t101','10.1016/j.jpowsour.2025.236114'],
 [3,'Marchetti L., Sato K.','Applied Thermal Engineering','2024-06-03','Journal article',112,'sc-imm','t102','10.1016/j.applthermaleng.2024.123018'],
 [6,'Varga P., Chen Y., Adeyemi T.','Joule','2025-05-21','Journal article',76,'sc-na','t104','10.1016/j.joule.2025.04.007'],
 [10,'Duarte M., Khalil R.','Renewable & Sustainable Energy Reviews','2024-09-14','Review',203,'sc-pcm','t103','10.1016/j.rser.2024.114702']
].forEach(([n,au,venue,date,type,cites,folder,task,doi],i)=>add({id:'sc'+n,src:'scholar',srcN:n,t:SRC[n].t,au,venue,date,type,cites,folder,area:FAREA[parentOf('scholar',folder)],tasks:[task],doi,oa:i%2===0,peer:true,db:'Google Scholar',lang:'English',abs:strip(SRC[n].p),kw:kwOf(SRC[n].t),added:ago(6+i*5),by:['amina','sara','tomas','james'][i]}));
const SCT={'sc-solid':['Lithium dendrite suppression in garnet electrolytes via grain-boundary engineering','Air stability of Ta-doped LLZO powders during dry-room processing','Sulfide–polymer hybrid electrolytes with stable lithium-metal cycling','Tape casting of thin LLZO sheets above 100 cm²','Halide solid electrolytes for high-voltage cathodes'],
 'sc-anode':['Silicon–carbon anodes with self-healing polymer binders','Cross-linked alginate binders for high-loading silicon electrodes','Prelithiation strategies for silicon-dominant anodes'],
 'sc-int':['Atomic-layer-deposited Al₂O₃ coatings on garnet surfaces','Interfacial degradation of nickel-rich cathodes in solid-state cells','In situ impedance mapping of polymer–ceramic interfaces'],
 'sc-imm':['Dielectric fluid selection for single-phase immersion of cylindrical cells','Long-term compatibility of hydrocarbon dielectric fluids with cell vents','Pack-level energy density penalties of immersion cooling','Two-phase immersion boiling regimes in high-rate battery modules'],
 'sc-cp':['Topology-optimised cold plates for prismatic modules','Microchannel cold plates with flow-boiling enhancement','Thermal contact resistance of gap fillers under compression ageing'],
 'sc-pcm':['Shape-stabilised paraffin–graphite composites for module thermal buffering','Leakage suppression in phase-change interface materials above 85 °C'],
 'sc-na':['Prussian white cathodes for low-cost sodium-ion cells','Cycle-life limits of layered-oxide sodium-ion cathodes'],
 'sc-hc':['Cost modelling of hard-carbon precursors from biomass feedstocks','Closed-pore engineering in hard carbon for higher sodium storage','Qualification lead times for battery-grade hard carbon'],
 'sc-abuse':['Nail penetration versus overcharge as predictors of propagation risk','Vent gas composition from 21700 cells during thermal runaway'],
 'sc-rec':['Bio-based polyamide 11 enclosures: mechanical and flame performance','Direct recycling of LFP cathodes at pilot scale']};
const SCTASK={'sc-solid':'t101','sc-imm':'t102','sc-cp':'t108','sc-pcm':'t103','sc-na':'t104','sc-hc':'t104','sc-abuse':'t106','sc-anode':'t109','sc-rec':'t107','sc-int':'t101'};
Object.keys(SCT).forEach(folder=>SCT[folder].forEach((t,i)=>{
 const r=Rn(t),area=FAREA[parentOf('scholar',folder)],y=2019+Math.min(7,Math.floor(r()*8+r()*2));
 const tp=r()<.12?'Preprint':r()<.18?'Review':r()<.25?'Conference paper':'Journal article';
 const venue=tp==='Preprint'?pk(r,['arXiv','ChemRxiv']):pk(r,VEN[area]);
 const f=FIND[area];
 add({id:'sg'+hash(t),src:'scholar',t,au:auth(r,2+Math.floor(r()*3)),venue,type:tp,date:`${y}-${pad(1+Math.floor(r()*(y===2026?10:12)),2)}-${pad(1+Math.floor(r()*27),2)}`,cites:tp==='Preprint'?Math.floor(r()*12):Math.floor(r()*r()*320),folder,area,oa:tp==='Preprint'||r()<.4,peer:tp!=='Preprint',db:tp==='Preprint'?venue:pk(r,['Google Scholar','Google Scholar','Publisher feed']),lang:r()<.9?'English':pk(r,['Chinese','German','Japanese']),
  doi:`10.${pk(r,['1016','1021','1039','1002'])}/${folder.slice(3)}.${y}.${pad(Math.floor(r()*99999),5)}`,abs:`This ${tp==='Review'?'review surveys':'study examines'} ${lc1(t)}. ${pk(r,f)} ${pk(r,f)}`,kw:kwOf(t),tasks:r()<.4?[SCTASK[folder]]:[],added:ago(Math.floor(r()*120)),by:pk(r,['amina','sara','james','mei','tomas'])});
}));

// Patents
const JUR={US:'United States (USPTO)',EP:'Europe (EPO)',WO:'International (WIPO PCT)',CN:'China (CNIPA)',JP:'Japan (JPO)',KR:'Korea (KIPO)',DE:'Germany (DPMA)'};
const OFFICE={US:'USPTO',EP:'EPO',WO:'WIPO',CN:'CNIPA',JP:'JPO',KR:'KIPO',DE:'DPMA'};
const CPC={'H01M 10/0562':'Solid inorganic electrolytes','H01M 10/0565':'Polymer electrolytes','H01M 10/052':'Li-ion accumulators','C04B 35/486':'Zirconia-based ceramics','H01M 10/613':'Cooling of cells','H01M 10/6556':'Solid heat-exchange parts','H01M 10/6567':'Liquid heat-exchange media','F28F 3/12':'Plate heat exchangers','H01M 50/211':'Module housings','H01M 4/134':'Silicon-based electrodes','H01M 4/622':'Binders','H01M 4/386':'Silicon alloys','H01M 50/227':'Organic housing materials','H01M 50/24':'Housing mountings','C08L 77/02':'Polyamides','H01M 4/587':'Carbonaceous anodes','H01M 10/054':'Na-ion accumulators','C01B 32/05':'Carbon preparation'};
const FTON={High:'Independent claims read on our current design. Needs a design-around or a licence before launch.',Medium:'Process claims partly overlap. Watch prosecution and claim amendments.',Low:'Claims are limited to features we do not use.','Not assessed':'Not yet reviewed by IP counsel.','Own portfolio':'Our own filing. Keep fees paid in key markets.'};
const kindL=n=>/ B\d?$/.test(n)?'Granted patent (B)':/^WO/.test(n)?'PCT application (A1)':'Published application (A)';
function pnum(r,j,g,y){const q=k=>pad(Math.floor(r()*Math.pow(10,k)),k);
 return {US:g?`US ${pk(r,['11','12'])},${q(3)},${q(3)} B2`:`US ${y}/0${q(6)} A1`,EP:g?`EP ${pk(r,['3','4'])} ${q(3)} ${q(3)} B1`:`EP 4 ${q(3)} ${q(3)} A1`,WO:`WO ${y}/${q(6)} A1`,CN:g?`CN 11${Math.floor(r()*8)} ${q(3)} ${q(3)} B`:`CN 118 ${q(3)} ${q(3)} A`,JP:g?`JP ${7000000+Math.floor(r()*600000)} B2`:`JP ${y}-${q(6)} A`,KR:g?`KR 10-2${q(6)} B1`:`KR 10-${y}-${q(7)} A`,DE:`DE 10 ${y} ${q(3)} ${q(3)} A1`}[j]}
const addPat=o=>add(Object.assign({src:'patent',kindL:kindL(o.idn),juris:JUR[o.j],office:OFFICE[o.j],t:o.t,abs:o.abs,date:o.pub},o));
const cor={t:SRC[2].t.split('· ')[1],assignee:'Corvane Energy, Inc.',inv:['Hale R.','Moreno V.','Takeda S.'],pri:'2022-03-14',fil:'2023-03-10',exp:'2043-03-10',cpc:['H01M 10/0562','H01M 10/0565','H01M 10/052'],claims:['Composition','Process / method'],ind:3,tot:24,fam:7,fid:'F-CORV-01',fto:'High',folder:'pt-se',area:'Materials',abs:strip(SRC[2].p),claim:'1. A composite electrolyte comprising a garnet-type ceramic phase having a graded volume fraction from 85% at the cathode side to 40% at the anode side, and a polymer phase comprising PEO and a lithium salt, wherein the interfacial area-specific resistance is below 50 Ω·cm².',tasks:['t101']};
addPat(Object.assign({},cor,{id:'pcor-us',srcN:2,idn:'US 12,300,418 B2',j:'US',pub:'2023-09-21',gr:'2025-04-22',status:'Granted',fwd:9,back:31,added:ago(4),by:'amina',star:true,note:'Core of the Corvane fence. Claim 1 composition range overlaps our interlayer design.'}));
[['EP 4 412 907 A1','EP','2024-01-10','Pending'],['CN 118 016 552 A','CN','2024-02-02','Pending'],['JP 2025-061844 A','JP','2025-03-27','Pending'],['WO 2023/176254 A1','WO','2023-09-21','PCT published']].forEach(([idn,j,pub,status],i)=>addPat(Object.assign({},cor,{id:'pcor'+i,idn,j,pub,gr:'',status,fwd:i,back:31,added:ago(4),tasks:i===0?['t101']:[]})));
addPat({id:'pthe-wo',srcN:11,idn:'WO 2025/118432 A1',j:'WO',t:'Two-phase microchannel cold plate',assignee:'Thermaris GmbH',inv:['Brandt K.','Okonkwo E.'],pri:'2023-11-02',fil:'2024-10-30',pub:'2025-06-12',gr:'',exp:'2044-10-30',status:'PCT published',cpc:['H01M 10/6556','F28F 3/12','H01M 10/613'],claims:['Apparatus / system'],ind:2,tot:18,fam:3,fwd:2,back:14,fto:'Medium',folder:'pt-thm',area:'Thermal',abs:strip(SRC[11].p),claim:'1. A cold plate for a battery module comprising a plurality of microchannels of 60 to 120 µm width arranged to sustain flow boiling of a dielectric coolant, and a manifold distributing coolant to each channel at equal pressure.',tasks:['t108'],added:ago(9),by:'james'});
const PT={'pt-se':{area:'Materials',as:['Corvane Energy, Inc.','Huaxin Power Co., Ltd.','Kestrel Solid State KK','Ardent Cells GmbH'],cpc:['H01M 10/0562','H01M 10/0565','H01M 10/052','C04B 35/486'],cl:'a solid electrolyte layer of 5 to 40 µm thickness having an ionic conductivity of at least 0.5 mS/cm at 25 °C',t:['Sulfide solid electrolyte with halogen-doped argyrodite phase','Method of densifying garnet electrolyte sheets by flash sintering','Composite separator with ceramic-in-polymer gradient','Protective layer for lithium-metal anodes in solid-state cells','Dry-room-free processing of oxide electrolyte powders']},
 'pt-thm':{area:'Thermal',as:['Thermaris GmbH','Coolant Dynamics Ltd.','Huaxin Power Co., Ltd.','Halden Materials'],cpc:['H01M 10/613','H01M 10/6556','H01M 10/6567','F28F 3/12','H01M 50/211'],cl:'a coolant path in thermal contact with each cell and a flow distributor that limits the temperature spread across the module to less than 3 K',t:['Immersion-cooled battery module with dielectric flow distributor','Cold plate with variable fin density along the flow path','Battery pack with integrated phase-change heat buffer','Vent gas channel for thermal-runaway propagation control','Two-phase cooling loop with passive pressure regulation','Cold plate with embedded temperature sensing']},
 'pt-an':{area:'Materials',as:['Sionix Materials Corp.','Kestrel Solid State KK','Huaxin Power Co., Ltd.'],cpc:['H01M 4/134','H01M 4/622','H01M 4/386'],cl:'a binder comprising a cross-linked polymer network that retains electrode integrity at more than 300% silicon volume expansion',t:['Silicon anode binder comprising cross-linked polyacrylic acid','Prelithiated silicon–carbon composite and method of manufacture','Aqueous binder system for high-loading electrodes','Elastic binder network for silicon-dominant anodes']},
 'pt-na':{area:'Supply chain',as:['Huaxin Power Co., Ltd.','Meridian Carbon Ltd.','Ardent Cells GmbH'],cpc:['H01M 4/587','H01M 10/054','C01B 32/05'],cl:'a hard-carbon anode having a closed-pore volume of 0.1 to 0.3 cm³/g and a first-cycle efficiency of at least 88%',t:['Hard-carbon anode with controlled closed-pore volume','Sodium-ion cell with Prussian white cathode and electrolyte additive','Biomass-derived hard-carbon precursor treatment','Sodium-ion module for stationary storage cabinets']},
 'pt-cs':{area:'Sustainability',as:['Polymera AG','Halden Materials','Coolant Dynamics Ltd.'],cpc:['H01M 50/227','H01M 50/24','C08L 77/02'],cl:'a housing moulded from a polyamide containing at least 60% bio-based carbon and a flame retardant rated V-0 at 1.5 mm',t:['Battery enclosure moulded from bio-based polyamide','Flame-barrier lid for battery pack housings','Lightweight composite tray with integrated crash structure']}};
const PTASK={'pt-se':'t101','pt-thm':'t108','pt-an':'t109','pt-na':'t104','pt-cs':'t107'};
Object.keys(PT).forEach(folder=>{const L=PT[folder];L.t.forEach((t,ti)=>{
 const r=Rn(t),old=r()<.18,py=old?2005+Math.floor(r()*4):2016+Math.floor(r()*10);
 const pri=`${py}-${pad(1+Math.floor(r()*12),2)}-${pad(1+Math.floor(r()*27),2)}`,fil=addM(pri,10+Math.floor(r()*3)),pub=addM(pri,18);
 const assignee=pk(r,L.as),fam=1+Math.floor(r()*r()*14),fid='F'+hash(t);
 const js=fam>1&&ti%2===0?['US',pk(r,['EP','CN','JP','KR'])]:[pk(r,['US','US','EP','WO','CN','CN','JP','KR','DE'])];
 const cpc=[L.cpc[0]].concat(L.cpc.slice(1).filter(()=>r()<.5)),claims=['Composition','Process / method','Apparatus / system','Use'].filter((c,i)=>i===ti%3||r()<.3);
 js.forEach((j,k)=>{const rr=Rn(t+j);let g=j!=='WO'&&j!=='DE'&&(old||rr()<.55);let gr=g?addM(fil,24+Math.floor(rr()*24)):'';if(gr>TODAY){g=false;gr=''}
  const exp=addM(fil,240),status=j==='WO'?'PCT published':g?(exp<TODAY?'Expired':rr()<.1?'Lapsed':'Granted'):(rr()<.1?'Withdrawn':'Pending');
  addPat({id:'pg'+hash(t+j),idn:pnum(rr,j,g,yr(pub)),j,t,assignee,inv:[auth(rr,1),auth(rr,1)].concat(rr()<.5?[auth(rr,1)]:[]),pri,fil,pub,gr,exp,status,cpc,claims,ind:1+Math.floor(rr()*3),tot:10+Math.floor(rr()*22),fam,fid,fwd:Math.floor(rr()*rr()*60),back:5+Math.floor(rr()*35),
   fto:assignee==='Halden Materials'?'Own portfolio':pk(rr,['High','Medium','Medium','Low','Low','Not assessed']),folder,area:L.area,
   abs:`The invention relates to ${lc1(t)}. It provides ${L.cl}, which improves manufacturability and safety at pack level.`,claim:`1. ${t.replace(/^(Method|Battery|Cold|Sodium|Silicon|Hard|Lightweight|Flame|Protective|Composite|Dry|Sulfide|Immersion|Two|Vent|Prelithiated|Aqueous|Elastic|Biomass)/,m=>'A '+m.toLowerCase())}, comprising ${L.cl}.`,
   tasks:k===0&&rr()<.35?[PTASK[folder]]:[],added:ago(Math.floor(rr()*110)),by:pk(rr,['amina','mei','james','tomas'])})});
});});

// IEEE and standards
[['UN 38.3 (Rev. 8)','UN Manual of Tests and Criteria, Section 38.3','UN','Standard','Active','2023-07-01','st-tr','Compliance',['t106'],12,64],
 ['MIL-STD-810H Method 501.7','High temperature','US DoD','Standard','Active','2019-01-31','st-env','Compliance',['t106'],5,38],
 ['UL 9540A:2025','Test method for evaluating thermal runaway fire propagation in battery energy storage systems','UL','Standard','Active','2025-03-12','st-sys','Compliance',['t102'],0,112],
 ['UL 9540A:2019','Test method for evaluating thermal runaway fire propagation in battery energy storage systems (4th edition)','UL','Standard','Superseded','2019-11-12','st-sys','Compliance',[],0,96],
 ['IEC 62619:2022','Safety requirements for secondary lithium cells and batteries for industrial applications','IEC','Standard','Active','2022-05-24','st-sys','Compliance',[],0,58],
 ['IEC 62660-2:2018','Reliability and abuse testing for lithium-ion traction cells','IEC','Standard','Active','2018-11-27','st-ev','Compliance',[],0,44],
 ['SAE J2464_202108','Electric and hybrid vehicle rechargeable energy storage system safety and abuse testing','SAE','Standard','Active','2021-08-17','st-ev','Compliance',['t106'],0,72],
 ['ISO 6469-1:2019','Electrically propelled road vehicles. Safety specifications. Part 1: on-board energy storage','ISO','Standard','Active','2019-04-10','st-ev','Compliance',[],0,30],
 ['UL 2580:2024','Batteries for use in electric vehicles','UL','Standard','Active','2024-02-28','st-ev','Compliance',[],0,128],
 ['GB 38031-2025','Safety requirements for power batteries for electric vehicles','SAC','Standard','Active','2025-04-01','st-ev','Compliance',[],0,40],
 ['UN ECE R100 Rev.3','Uniform provisions for the approval of vehicles with regard to the electric power train','UNECE','Standard','Active','2022-06-01','st-ev','Compliance',[],0,86],
 ['IEEE 1679.1-2017','Guide for the characterization and evaluation of lithium-based batteries in stationary applications','IEEE','Standard','Active','2017-12-06','st-sys','Energy',[],0,47],
 ['IEEE 2686-2024','Recommended practice for battery management systems in energy storage applications','IEEE','Standard','Active','2024-09-26','st-sys','Energy',[],0,61],
 ['IEC 63056 ED2 (CDV)','Safety requirements for lithium batteries in electrical energy storage systems','IEC','Standard','Draft','2026-06-15','st-sys','Compliance',[],0,52],
 ['MIL-STD-810G','Environmental engineering considerations and laboratory tests','US DoD','Standard','Superseded','2008-10-31','st-env','Compliance',[],0,804],
 ['RTCA DO-311A','Minimum operational performance standards for rechargeable lithium batteries','RTCA','Standard','Active','2017-12-19','st-tr','Compliance',[],0,120],
 ['IEEE ITEC 2025','Reduced-order thermal model of immersion-cooled 21700 modules for BMS estimation','IEEE','Conference paper','Active','2025-06-18','cf-th','Thermal',['t102'],0,6],
 ['IEEE ECCE 2024','Coupled electro-thermal simulation of two-phase cold plates','IEEE','Conference paper','Active','2024-10-21','cf-th','Thermal',['t108'],0,8],
 ['IEEE ITherm 2024','Experimental validation of vent-gas channel designs in 21700 packs','IEEE','Conference paper','Active','2024-05-29','cf-th','Thermal',[],0,7],
 ['IEEE VPPC 2025','Online detection of internal short circuits from voltage relaxation','IEEE','Conference paper','Active','2025-10-07','cf-bms','Energy',[],0,6],
 ['IEEE TTE 11(3)','Machine-learning estimation of cell-to-cell propagation time','IEEE','Journal article','Active','2025-03-01','cf-bms','Thermal',[],0,12],
 ['IEEE Access 13','Fast-charge thermal limits in solid-state pouch cells','IEEE','Early access','Active','2026-09-30','cf-bms','Materials',[],0,10]
].forEach(([idn,t,body,ctype,status,date,folder,area,tasks,n,pages],i)=>add({id:'ie'+i,src:'ieee',srcN:n||undefined,idn,t:n?SRC[n].t:t,body,ctype,status,date,folder,area,tasks,pages,
 scope:n?strip(SRC[n].p):ctype==='Standard'?`Specifies requirements and test methods for ${lc1(t)}. Applies to cells, modules and packs within its stated scope.`:`Paper presenting ${lc1(t)}, with experimental validation on production-format cells.`,added:ago(3+i*5),by:pk(Rn(idn),['amina','sara','mei'])}));

// Web and news
[[4,'Immersion cooling adoption doubles across EV pack programmes','Energy Storage Weekly','energystorageweekly.com','Trade press','Tier 2 · trade publication','Global','2026-11-04','wb-imm','Thermal',['t102']],
 [0,'Supplier claims threefold heat-flux gain for new two-phase plate','Thermal Management Today','thermaltoday.com','Company release','Tier 3 · company claim','Europe','2026-10-22','wb-sup','Thermal',['t108']],
 [0,'EU Battery Regulation: battery passport obligations from February 2027','European Commission','ec.europa.eu','Government','Tier 1 · primary source','Europe','2026-09-18','wb-reg','Compliance',[]],
 [0,'Sodium-ion pack prices fall below LFP in stationary tenders','Grid Storage Journal','gridstoragejournal.com','Trade press','Tier 2 · trade publication','Asia-Pacific','2026-10-30','wb-na','Supply chain',['t104']],
 [0,'Hard-carbon producer adds 40,000 t of capacity','Meridian Minerals Outlook','meridianoutlook.com','Analyst note','Tier 1 · primary source','Asia-Pacific','2026-10-12','wb-na','Supply chain',['t104']],
 [0,'Huaxin Power files fresh sodium-ion patents across four offices','IP Watch Asia','ipwatchasia.com','News','Tier 2 · trade publication','Asia-Pacific','2026-08-27','wb-sup','Supply chain',[]],
 [0,'Corvane Energy closes Series D to scale gradient electrolyte line','Corvane Energy newsroom','corvane.energy','Company release','Tier 3 · company claim','North America','2026-07-15','wb-sup','Materials',['t101']],
 [0,'Dielectric fluid makers race to qualify for EV immersion programmes','Chemical Week Online','chemweekonline.com','Trade press','Tier 2 · trade publication','Global','2026-10-02','wb-imm','Thermal',[]],
 [0,'US Department of Energy funds three solid-state pilot lines','US Department of Energy','energy.gov','Government','Tier 1 · primary source','North America','2026-06-20','wb-reg','Materials',[]],
 [0,'Opinion: immersion cooling is over-hyped for passenger cars','Battery Design Blog','batterydesign.blog','Blog','Tier 3 · opinion','Global','2026-09-05','wb-imm','Thermal',[]],
 [0,'Recycled cathode content: what the 2031 targets mean for suppliers','Circular Materials Review','circularmaterials.review','Analyst note','Tier 2 · trade publication','Europe','2026-05-14','wb-reg','Sustainability',['t107']],
 [0,'Storage cabinet recall follows thermal runaway incident','Storage Safety News','storagesafety.news','News','Tier 2 · trade publication','Asia-Pacific','2026-10-26','wb-imm','Compliance',[]],
 [0,'UN sub-committee agenda includes 38.3 revision for sodium-ion','Dangerous Goods Bulletin','dgbulletin.org','News','Tier 1 · primary source','Global','2026-09-29','wb-reg','Compliance',['t106']],
 [0,'Japanese OEM picks cold plates over immersion for 2028 platform','Nikkan Auto Tech','nikkanautotech.jp','News','Tier 2 · trade publication','Asia-Pacific','2026-10-08','wb-imm','Thermal',[]],
 [0,'Silicon-anode binder start-up signs licence with Kestrel','Advanced Materials Business','advmatbusiness.com','News','Tier 2 · trade publication','Asia-Pacific','2026-08-11','wb-sup','Materials',['t109']],
 [0,'Graphene spreader prices: why the cost curve stalled','Thermal Management Today','thermaltoday.com','Trade press','Tier 2 · trade publication','Global','2026-07-02','wb-imm','Thermal',['t105']],
 [0,'Bio-based polyamide casings enter series production','Polymera AG newsroom','polymera.com','Company release','Tier 3 · company claim','Europe','2026-04-23','wb-sup','Sustainability',[]],
 [0,'Iron-air storage developer misses pilot milestone','Grid Storage Journal','gridstoragejournal.com','News','Tier 2 · trade publication','North America','2026-06-09','wb-sup','Energy',[]],
 [0,'Two-phase cooling expected in a third of programmes by 2028','Energy Storage Weekly','energystorageweekly.com','Trade press','Tier 2 · trade publication','Global','2026-10-15','wb-imm','Thermal',[]]
].forEach(([n,t,outlet,domain,ctype,tier,region,date,folder,area,tasks],i)=>add({id:'wb'+i,src:'web',srcN:n||undefined,t:n?SRC[n].t:t,outlet,domain,url:`https://www.${domain}/${t.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,48)}`,ctype,tier,region,date,folder,area,tasks,pay:/Analyst|Trade/.test(ctype)&&i%3===0,ret:date,abs:n?strip(SRC[n].p):`${outlet} reports: ${lc1(t)}. Treat figures as ${/Tier 3/.test(tier)?'unverified until a primary source confirms them':'reported, with the primary source linked where available'}.`,added:ago(Math.max(1,age(date))),by:pk(Rn(t),['sara','tomas','mei','amina'])}));

// Upload library
[[8,'Thermal lab report TL-2291: prototype cold plate characterisation','PDF','Internal lab','Halden thermal lab','lb-lab','sara','Confidential',['t102','t108'],'2026-09-30','2.4 MB · 18 pp'],
 [9,'Expert interview notes: Dr. K. Okafor, thermal systems','DOCX','Expert interview','Interview notes','lb-int','amina','Internal',['t101','t104'],'2026-10-14','86 KB · 6 pp'],
 [7,'Hard-carbon precursor supply outlook 2026–2030','PDF','Market report','Meridian Minerals Outlook (licensed)','lb-mkt','tomas','Internal',['t104'],'2026-08-02','5.1 MB · 64 pp'],
 [0,'Gate 2 thermal review deck','PPTX','Internal lab','Gate review','lb-gate','sara','Internal',['t102'],'2026-10-28','12.8 MB · 32 slides'],
 [0,'LLZO sheet yield trials, Q3 2026','XLSX','Internal lab','Pilot line data','lb-lab','james','Confidential',['t101'],'2026-10-05','640 KB'],
 [0,'Supplier certificate of analysis: hard carbon lot 2291','PDF','Supplier','Supplier QA','lb-sup','tomas','Internal',['t104'],'2026-10-19','310 KB · 3 pp'],
 [0,'Okafor follow-up call: yield and lead times','DOCX','Expert interview','Interview notes','lb-int','amina','Internal',['t101','t104'],'2026-11-02','42 KB · 3 pp'],
 [0,'Dielectric fluid compatibility matrix','CSV','Internal lab','Materials lab','lb-lab','mei','Internal',['t102'],'2026-09-12','58 KB'],
 [0,'Cold plate CFD summary, revision C','PDF','Internal lab','Simulation team','lb-lab','james','Internal',['t108'],'2026-10-22','3.3 MB · 22 pp'],
 [0,'Corvane patent family claim chart','XLSX','Patent office','EPO and USPTO registers','lb-gate','amina','Confidential',['t101'],'2026-10-30','210 KB'],
 [0,'Thermal runaway propagation in 21700 modules (publisher copy)','PDF','Google Scholar','Applied Thermal Engineering','lb-pub','sara','Public',['t102'],'2026-09-03','1.9 MB · 14 pp'],
 [0,'UL 9540A test report, cabinet B','PDF','Supplier','Third-party test lab','lb-sup','mei','Confidential',['t106'],'2026-08-21','7.6 MB · 41 pp'],
 [0,'Sodium-ion bill-of-materials cost model v4','XLSX','Market report','Internal finance','lb-mkt','tomas','Confidential',['t104'],'2026-10-25','1.1 MB'],
 [0,'Phase-change interface leak test log','PDF','Internal lab','Materials lab','lb-lab','james','Internal',['t103'],'2026-10-09','920 KB · 9 pp'],
 [0,'Meridian webinar transcript: hard-carbon pricing','TXT','Web','meridianoutlook.com','lb-mkt','tomas','Public',[],'2026-07-18','34 KB'],
 [0,'MIL-STD-810H Method 501.7 excerpt','PDF','IEEE Xplore','Standards store','lb-pub','amina','Public',['t106'],'2026-06-11','480 KB · 12 pp']
].forEach(([n,t,ft,origin,db,folder,by,conf,tasks,ret,size],i)=>add({id:'lb'+i,src:'library',file:true,srcN:n||undefined,t:n?SRC[n].t:t,ft,origin,db,folder,by,conf,tasks,ret,date:ret,size,area:byId(tasks[0]||'t102').sector,abs:n?strip(SRC[n].p):`${ft} uploaded by ${nm(by)} from ${origin.toLowerCase()} (${db}).`,added:ret}));
// Company drive (disconnected until someone connects it)
[['Gate review minutes, October 2026','DOCX','dr-gate','priya','Internal','Thermal'],['Lab data index 2026','XLSX','dr-lab','james','Internal','Materials'],['Supplier qualification tracker','XLSX','dr-qual','tomas','Confidential','Supply chain'],['Pack thermal test plan','DOCX','dr-lab','sara','Internal','Thermal'],['Pilot line safety case','PDF','dr-gate','mei','Confidential','Compliance'],['Hard-carbon second-source shortlist','PPTX','dr-qual','tomas','Confidential','Supply chain']].forEach(([t,ft,folder,by,conf,area],i)=>add({id:'dr'+i,src:'drive',t,ft,folder,by,conf,area,origin:'Company drive',db:'SharePoint',date:ago(3+i*6),ret:ago(3+i*6),added:ago(3+i*6),abs:`Shared ${ft} owned by ${nm(by)}.`}));
window.__HUB={CAT,SOURCES};

/* ---------- facets, sort, search ---------- */
const cbk=n=>n>=200?'200 or more':n>=50?'50–199':n>=10?'10–49':'Under 10';
const termB=x=>/Expired|Lapsed|Withdrawn/.test(x.status)?'No longer in force':yr(x.exp)<2031?'Ends before 2031':yr(x.exp)<2036?'Ends 2031–2035':'Ends 2036 or later';
const FAC={
 all:[['srcN','Source',x=>SOURCES[x.src].n],['area','Research area'],['rt','Record type',x=>x.src==='patent'?'Patent':x.type||x.ctype||x.ft]],
 scholar:[['type','Document type'],['area','Research area'],['venue','Journal or venue'],['oaL','Access',x=>x.oa?'Open access':'Subscription'],['peerL','Review status',x=>x.peer?'Peer reviewed':'Preprint, not reviewed'],['cb','Citations',x=>cbk(x.cites)],['db','Indexed via'],['lang','Language']],
 patent:[['juris','Jurisdiction'],['status','Legal status'],['kindL','Document kind'],['cpcL','CPC class',x=>x.cpc.map(c=>c+' · '+(CPC[c]||'Unclassified'))],['claims','Claim type'],['assignee','Assignee'],['fto','Freedom-to-operate risk'],['famB','Family size',x=>x.fam>=10?'10 or more members':x.fam>=4?'4–9 members':x.fam>1?'2–3 members':'Single filing'],['termB','Remaining term',termB],['area','Research area']],
 ieee:[['ctype','Content type'],['body','Issuing body'],['status','Status'],['area','Research area']],
 web:[['ctype','Content type'],['tier','Credibility'],['region','Region'],['outlet','Outlet'],['payL','Access',x=>x.pay?'Paywalled':'Free to read'],['area','Research area']],
 library:[['ft','File type'],['origin','Origin'],['byN','Uploaded by',x=>nm(x.by)],['conf','Confidentiality'],['status','Index status'],['area','Research area']],
 drive:[['ft','File type'],['byN','Owner',x=>nm(x.by)],['conf','Confidentiality'],['area','Research area']]
};
const fv=(f,x)=>{const v=f[2]?f[2](x):x[f[0]];return v==null||v===''?[]:Array.isArray(v)?v:[String(v)]};
const DT={pri:['Priority date','pri'],fil:['Filing date','fil'],pub:['Publication date','pub'],gr:['Grant date','gr'],exp:['Expiry date','exp']};
const dateF=(k,st)=>k==='patent'?DT[st.dt][1]:k==='library'?'ret':'date';
const dateL=(k,st)=>k==='patent'?DT[st.dt][0]:k==='library'?'Retrieved':k==='web'?'Published':'Publication year';
const SORT={all:[['rel','Best match'],['new','Newest'],['added','Recently added'],['az','Title A–Z']],
 scholar:[['rel','Best match'],['new','Newest first'],['old','Oldest first'],['cites','Most cited'],['added','Recently added'],['az','Title A–Z']],
 patent:[['rel','Best match'],['pri','Priority date, newest'],['pub','Publication date, newest'],['exp','Expiry, soonest'],['fwd','Most cited by later patents'],['fam','Largest family']],
 ieee:[['rel','Best match'],['new','Newest first'],['des','Designation A–Z']],web:[['new','Newest first'],['rel','Best match'],['tier','Most credible']],
 library:[['added','Recently added'],['ret','Retrieved, newest'],['az','Title A–Z']],drive:[['new','Recently modified'],['az','Title A–Z']]};
const SCOPE={all:[['all','All fields'],['title','Title'],['id','Number, DOI or URL']],
 scholar:[['all','All fields'],['title','Title'],['author','Author'],['abs','Abstract and keywords'],['id','DOI']],
 patent:[['all','All fields'],['title','Title'],['abs','Abstract and claims'],['assignee','Assignee'],['inventor','Inventor'],['id','Patent number'],['cpc','CPC code']],
 ieee:[['all','All fields'],['title','Title'],['id','Designation'],['abs','Scope']],web:[['all','All fields'],['title','Headline'],['outlet','Outlet or domain']],
 library:[['all','All fields'],['title','Title'],['notes','Notes and tags'],['origin','Origin']],drive:[['all','All fields'],['title','Title']]};
const PH={all:'Search every source: titles, authors, patent numbers, DOIs',scholar:'Search papers by title, author, keyword or DOI',patent:'Search patents by number, title, claims, assignee or CPC',ieee:'Search standards by designation, title or scope',web:'Search headlines, outlets and domains',library:'Search uploads by title, notes or tags',drive:'Search shared files'};
function hay(x,sc){const t=(x.ct||'')+' '+x.t;switch(sc){case 'title':return t;case 'author':return x.au||'';case 'abs':return [x.abs,(x.kw||[]).join(' '),x.claim,x.scope].join(' ');case 'id':return [x.idn,x.doi,x.url].join(' ');case 'assignee':return x.assignee||'';case 'inventor':return (x.inv||[]).join(' ');case 'cpc':return (x.cpc||[]).join(' ');case 'outlet':return (x.outlet||'')+' '+(x.domain||'');case 'notes':return (x.note||'')+' '+x.tags.join(' ');case 'origin':return (x.origin||'')+' '+(x.db||'');default:return [t,x.au,x.abs,(x.kw||[]).join(' '),x.idn,x.doi,x.assignee,(x.inv||[]).join(' '),(x.cpc||[]).join(' '),x.outlet,x.domain,x.venue,x.note,x.tags.join(' '),x.origin,x.db,x.body,x.scope,x.claim].filter(Boolean).join(' ')}}
const score=(x,q,sc)=>{if(!q)return 1;const h=hay(x,sc).toLowerCase(),tt=((x.ct||'')+' '+x.t).toLowerCase();let s=0;for(const w of q.toLowerCase().split(/\s+/).filter(Boolean)){if(!h.includes(w))return 0;s+=1+(tt.includes(w)?3:0)}return s};
const tt=x=>x.ct||x.t;

/* ---------- state ---------- */
S.hub=S.hub||{view:'overview',st:{},pst:{},pk:'all',ptmp:null,ret:null,up:null,cf:0};
const H=S.hub;
const ST=(k,pick)=>{const b=pick?H.pst:H.st;return b[k]=b[k]||{q:'',scope:'all',f:{},yr:['',''],dt:'pri',sort:(SORT[k]||SORT.all)[0][0],folder:'all',sel:[],view:'list',more:{},page:1,nf:false}};
const base=k=>k==='all'?CAT.filter(x=>isOn(x.src)):k==='library'?CAT.filter(x=>x.src==='library'||x.file):CAT.filter(x=>x.src===k);
function inFolder(k,id,x){if(id==='all')return true;const sm=SMART._.concat(SMART[k]||[]).find(s=>s[0]===id);if(sm)return sm[3](x);if(id.startsWith('saved:'))return true;const f=(FOLD[k]||[]).find(y=>y.id===id);if(f&&f.fn)return f.fn(x);return x.folder===id||parentOf(k,x.folder)===id}
function run(k,st,skip){
 const fs=FAC[k],df=dateF(k,st),y0=+st.yr[0]||0,y1=+st.yr[1]||9999;
 let a=base(k).filter(x=>inFolder(k,st.folder,x)).map(x=>[x,score(x,st.q,st.scope)]).filter(p=>p[1]>0);
 a=a.filter(([x])=>{const y=yr(x[df]);return (!y0&&y1===9999)||(y&&y>=y0&&y<=y1)});
 a=a.filter(([x])=>fs.every(f=>f[0]===skip||!(st.f[f[0]]||[]).length||fv(f,x).some(v=>st.f[f[0]].includes(v))));
 if(skip!==undefined)return a.map(p=>p[0]);
 const by={rel:(p,q)=>q[1]-p[1]||String(q[0].date).localeCompare(p[0].date),new:(p,q)=>String(q[0][df]||q[0].date).localeCompare(p[0][df]||p[0].date),old:(p,q)=>String(p[0].date).localeCompare(q[0].date),cites:(p,q)=>q[0].cites-p[0].cites,added:(p,q)=>q[0].added.localeCompare(p[0].added),az:(p,q)=>tt(p[0]).localeCompare(tt(q[0])),pri:(p,q)=>q[0].pri.localeCompare(p[0].pri),pub:(p,q)=>q[0].pub.localeCompare(p[0].pub),exp:(p,q)=>(p[0].status==='Granted'?p[0].exp:'9')<(q[0].status==='Granted'?q[0].exp:'9')?-1:1,fwd:(p,q)=>q[0].fwd-p[0].fwd,fam:(p,q)=>q[0].fam-p[0].fam,des:(p,q)=>p[0].idn.localeCompare(q[0].idn),tier:(p,q)=>p[0].tier.localeCompare(q[0].tier),ret:(p,q)=>q[0].ret.localeCompare(p[0].ret)}[st.sort]||(()=>0);
 return a.sort(by).map(p=>p[0]);
}

/* ---------- pieces ---------- */
const sico=(k,s)=>`<span class="hb-ico" style="--c:${SOURCES[k].c}">${ix(SOURCES[k].ico,s||18)}</span>`;
const STP={Granted:'ok',Pending:'warn','PCT published':'gold',Expired:'',Lapsed:'bad',Withdrawn:'bad',Active:'ok',Draft:'warn',Superseded:'',Indexed:'ok',Indexing:'accent run'};
const FTP={High:'bad',Medium:'warn',Low:'ok','Own portfolio':'gold','Not assessed':''};
const pill=(t,c)=>`<span class="pill ${c||''}">${c&&c.includes('run')?'<i></i>':''}${esc(t)}</span>`;
const taskPills=x=>x.tasks.map(id=>{const t=byId(id);return t?`<span class="hb-tk" data-tip="${esc(t.title)}">${t.code}</span>`:''}).join('');
function meta(x){switch(x.src){
 case 'scholar':return `${esc(x.au)} · <i>${esc(x.venue)}</i> · ${yr(x.date)}`;
 case 'patent':return `${esc(x.assignee)} · ${esc(x.office)} · Priority ${fd(x.pri)}`;
 case 'ieee':return `${esc(x.body)} · ${x.ctype} · ${fd(x.date)} · ${x.pages} pp`;
 case 'web':return `${esc(x.outlet)} · ${esc(x.domain)} · ${fd(x.date)}`;
 default:return `${x.ft||'File'} · ${esc(x.origin||'')}${x.db?' · '+esc(x.db):''} · retrieved ${fd(x.ret)} · ${nm(x.by)}`}}
function badges(x){const b=[];switch(x.src){
 case 'scholar':b.push(pill(x.type,x.type==='Preprint'?'warn':''));if(x.oa)b.push(pill('Open access','ok'));b.push(`<span class="hb-meta">Cited by ${x.cites}</span>`);break;
 case 'patent':b.push(pill(x.status,STP[x.status]),pill(x.kindL),pill('FTO: '+x.fto,FTP[x.fto]));x.cpc.slice(0,2).forEach(c=>b.push(`<span class="hb-cpc" data-tip="${esc(CPC[c]||'')}">${c}</span>`));b.push(`<span class="hb-meta">Family ${x.fam} · cited by ${x.fwd} · ${x.status==='Granted'?'expires '+yr(x.exp):x.status}</span>`);break;
 case 'ieee':b.push(pill(x.status,STP[x.status]),pill(x.ctype));break;
 case 'web':b.push(pill(x.ctype),pill(x.tier.split(' · ')[0],/^Tier 1/.test(x.tier)?'ok':/^Tier 3/.test(x.tier)?'warn':''),pill(x.region));if(x.pay)b.push(pill('Paywalled'));break;
 default:b.push(pill(x.conf,x.conf==='Confidential'?'bad':x.conf==='Public'?'ok':''),pill(x.status,STP[x.status]));if(x.size)b.push(`<span class="hb-meta">${x.size}</span>`)}
 b.push(`<span class="hb-area" style="--c:${D.SECT[x.area]||'var(--fg3)'}">${esc(x.area||'')}</span>`);
 x.tags.forEach(t=>b.push(`<span class="hb-tag">#${esc(t)}</span>`));return b.join('')+taskPills(x)}
const lead=x=>x.idn?`<span class="hb-pn">${esc(x.idn)}</span>`:'';
function rowHTML(x,mode,k){
 const st=ST(k,mode==='pick'),on=mode==='pick'?H.ptmp.includes(x.id):st.sel.includes(x.id);
 return `<div class="hb-row${on?' on':''}" data-h="${mode==='pick'?'ptog':'open'}" data-id="${x.id}" role="button" tabindex="0">
 <label class="hb-ck" aria-label="Select"><input type="checkbox" data-hs="${x.id}"${on?' checked':''}></label>
 ${k==='all'||k==='library'?sico(x.src,15):''}
 <div class="hb-rmain"><div class="hb-rt">${lead(x)}${esc(tt(x))}</div>${x.ct?`<div class="hb-orig">Original title: ${esc(x.t)}</div>`:''}<div class="hb-rm">${meta(x)}</div><div class="hb-rb">${badges(x)}</div></div>
 <div class="hb-rs">${mode==='pick'?`<button class="btn sm ghost" data-h="open" data-id="${x.id}">Details</button>`:''}<button class="hb-star${x.star?' on':''}" data-h="star" data-id="${x.id}" aria-label="${x.star?'Unstar':'Star'}">${ix('star',15)}</button></div></div>`}
const COLS={all:[['Title',x=>lead(x)+esc(tt(x))],['Source',x=>SOURCES[x.src].n],['Area',x=>esc(x.area||'')],['Date',x=>fd(x.date)]],
 scholar:[['Title',x=>esc(tt(x))],['Authors',x=>esc(x.au)],['Venue',x=>esc(x.venue)],['Year',x=>yr(x.date)],['Type',x=>x.type],['Cited by',x=>x.cites]],
 patent:[['Number',x=>`<span class="hb-pn">${esc(x.idn)}</span>`],['Title',x=>esc(tt(x))],['Assignee',x=>esc(x.assignee)],['Status',x=>pill(x.status,STP[x.status])],['Priority',x=>fd(x.pri)],['Expiry',x=>x.status==='Granted'?fd(x.exp):'—'],['CPC',x=>x.cpc[0]],['FTO',x=>pill(x.fto,FTP[x.fto])]],
 ieee:[['Designation',x=>`<span class="hb-pn">${esc(x.idn)}</span>`],['Title',x=>esc(tt(x))],['Body',x=>x.body],['Status',x=>pill(x.status,STP[x.status])],['Date',x=>fd(x.date)]],
 web:[['Headline',x=>esc(tt(x))],['Outlet',x=>esc(x.outlet)],['Type',x=>x.ctype],['Credibility',x=>x.tier.split(' · ')[0]],['Published',x=>fd(x.date)]],
 library:[['Title',x=>esc(tt(x))],['Type',x=>x.ft||''],['Origin',x=>esc(x.origin||'')],['Retrieved',x=>fd(x.ret)],['By',x=>nm(x.by)],['Access',x=>pill(x.conf||'',x.conf==='Confidential'?'bad':'')]],
 drive:[['Title',x=>esc(tt(x))],['Type',x=>x.ft],['Owner',x=>nm(x.by)],['Modified',x=>fd(x.date)]]};
function tableHTML(list,mode,k){const st=ST(k,mode==='pick'),c=COLS[k];
 return `<div class="tw hb-tw"><table class="t hb-t"><thead><tr><th style="width:34px"></th>${c.map(x=>`<th>${x[0]}</th>`).join('')}</tr></thead><tbody>${list.map(x=>{const on=mode==='pick'?H.ptmp.includes(x.id):st.sel.includes(x.id);return `<tr class="row${on?' on':''}" data-h="${mode==='pick'?'ptog':'open'}" data-id="${x.id}" role="button" tabindex="0"><td><label class="hb-ck"><input type="checkbox" data-hs="${x.id}"${on?' checked':''}></label></td>${c.map(col=>`<td>${col[1](x)}</td>`).join('')}</tr>`}).join('')}</tbody></table></div>`}
function treeHTML(k,st){
 const all=base(k),cnt=fn=>all.filter(fn).length,row=(id,n,icon,c,ind)=>`<button class="hb-node${st.folder===id?' on':''}${ind?' ind':''}" data-h="folder" data-f="${id}">${ix(icon,14)}<span>${esc(n)}</span><em>${c}</em></button>`;
 let h=`<div class="hb-th">Smart folders</div>`+SMART._.concat(SMART[k]||[]).map(s=>row(s[0],s[1],s[2],cnt(s[3]))).join('');
 (FOLD[k]||[]).forEach(f=>{h+=f.h?`<div class="hb-th">${f.h}</div>`:row(f.id,f.n,f.fn?'users':'folder',cnt(x=>inFolder(k,f.id,x)),!!f.p)});
 if(k!=='all')h+=st.nf?`<div class="hb-nf"><input class="in" id="hb-nf-${k}" placeholder="Folder name, then Enter"></div>`:`<button class="hb-node add" data-h="newfolder">${ic('plus',14)}<span>New folder</span></button>`;
 const sv=SAVED[k]||[];if(sv.length)h+=`<div class="hb-th">Saved searches</div>`+sv.map((s,i)=>`<button class="hb-node${st.folder==='saved:'+i?' on':''}" data-h="saved" data-i="${i}">${ix('saved',14)}<span>${esc(s.n)}</span></button>`).join('');
 return `<details class="hb-panel" open><summary>${ix('folder',15)} Directory</summary><div class="hb-tree">${h}</div></details>`}
function filtersHTML(k,st,mode){
 const df=dateF(k,st),ys=base(k).map(x=>yr(x[df])).filter(Boolean);
 let h=`<div class="hb-fg"><div class="hb-fl">${dateL(k,st)}</div>${k==='patent'?`<div class="seg hb-dt">${Object.keys(DT).map(d=>`<button class="${st.dt===d?'on':''}" data-h="dt" data-v="${d}">${DT[d][0].split(' ')[0]}</button>`).join('')}</div>`:''}<div class="hb-yr"><input class="in" type="number" data-hc="yr0" placeholder="From ${Math.min(...ys)||''}" value="${st.yr[0]}"><span>to</span><input class="in" type="number" data-hc="yr1" placeholder="${Math.max(...ys)||''}" value="${st.yr[1]}"></div></div>`;
 FAC[k].forEach(f=>{const pool=run(k,st,f[0]),c={};pool.forEach(x=>fv(f,x).forEach(v=>c[v]=(c[v]||0)+1));const sel=st.f[f[0]]||[];sel.forEach(v=>{if(!(v in c))c[v]=0});
  const vals=Object.keys(c).sort((a,b)=>c[b]-c[a]||a.localeCompare(b));if(!vals.length)return;const more=st.more[f[0]],shown=more?vals:vals.slice(0,6);
  h+=`<details class="hb-fg" open><summary class="hb-fl">${f[1]}${sel.length?` <span class="pill accent">${sel.length}</span>`:''}</summary>${shown.map(v=>`<label class="hb-opt"><input type="checkbox" data-hf="${f[0]}" value="${esc(v)}"${sel.includes(v)?' checked':''}><span>${esc(v)}</span><em>${c[v]}</em></label>`).join('')}${vals.length>6?`<button class="hb-more" data-h="more" data-k="${f[0]}">${more?'Show fewer':'Show all '+vals.length}</button>`:''}</details>`});
 return `<details class="hb-panel" open><summary>${ix('filter',15)} Filters</summary><div class="hb-filters">${h}</div></details>`}
function chipsHTML(k,st){const c=[];if(st.q)c.push(['q','',`“${st.q}”`]);if(st.yr[0]||st.yr[1])c.push(['yr','',`${dateL(k,st)}: ${st.yr[0]||'…'}–${st.yr[1]||'…'}`]);
 FAC[k].forEach(f=>(st.f[f[0]]||[]).forEach(v=>c.push([f[0],v,`${f[1]}: ${v}`])));
 if(st.folder!=='all'&&!st.folder.startsWith('saved:'))c.push(['folder','',`Folder: ${(SMART._.concat(SMART[k]||[]).find(s=>s[0]===st.folder)||[0,((FOLD[k]||[]).find(f=>f.id===st.folder)||{}).n])[1]}`]);
 return c.length?`<div class="hb-chips">${c.map(x=>`<button class="hb-chip" data-h="rmf" data-k="${x[0]}" data-v="${esc(x[1])}">${esc(x[2])} ${ic('x',12)}</button>`).join('')}<button class="btn sm ghost" data-h="clearf">Clear all</button><button class="btn sm ghost" data-h="savesearch">${ix('saved',13)} Save this search</button></div>`:''}
function bulkHTML(k,st){if(!st.sel.length)return '';const fo=(FOLD[k]||[]).filter(f=>f.id&&!f.fn);
 return `<div class="hb-bulk"><b>${st.sel.length} selected</b><select class="in" data-hc="bulkmove"><option value="">Move to folder…</option>${fo.map(f=>`<option value="${f.id}">${esc(f.n)}</option>`).join('')}</select><select class="in" data-hc="bulklink"><option value="">Link to task…</option>${T.map(t=>`<option value="${t.id}">${t.code} · ${esc(t.title.slice(0,40))}</option>`).join('')}</select><button class="btn sm" data-h="bulkstar">${ix('star',13)} Star</button><button class="btn sm" data-h="bulkcite">${ic('copy',13)} Copy citations</button><span class="grow"></span><button class="btn sm ghost" data-h="selnone">Clear</button></div>`}
function resultsHTML(k,st,mode){
 const list=run(k,st),n=st.page*30,ids=mode==='pick'?'pick':'page';
 return `<div class="hb-search"><div class="hb-sbox">${ic('search',16)}<input id="hq-${ids}" data-hq placeholder="${PH[k]}" value="${esc(st.q)}" autocomplete="off"><select data-hc="scope" aria-label="Search in">${SCOPE[k].map(s=>`<option value="${s[0]}"${st.scope===s[0]?' selected':''}>${s[1]}</option>`).join('')}</select></div></div>
 ${chipsHTML(k,st)}
 <div class="hb-tool"><b>${list.length}</b><span class="faint">record${list.length===1?'':'s'}</span><button class="btn sm ghost" data-h="selall">Select all</button><span class="grow"></span><label class="faint" style="font-size:12px">Sort</label><select class="in hb-sort" data-hc="sort">${SORT[k].map(s=>`<option value="${s[0]}"${st.sort===s[0]?' selected':''}>${s[1]}</option>`).join('')}</select><div class="seg"><button class="${st.view==='list'?'on':''}" data-h="view" data-v="list" aria-label="List view">${ix('rows',14)}</button><button class="${st.view==='table'?'on':''}" data-h="view" data-v="table" aria-label="Table view">${ix('grid',14)}</button></div></div>
 ${mode==='page'?bulkHTML(k,st):''}
 ${list.length?(st.view==='table'?tableHTML(list.slice(0,n),mode,k):`<div class="hb-list">${list.slice(0,n).map(x=>rowHTML(x,mode,k)).join('')}</div>`)+(list.length>n?`<button class="btn hb-pg" data-h="page">Show ${Math.min(30,list.length-n)} more of ${list.length-n}</button>`:''):`<div class="hb-empty">${ix('filter',22)}<b>No records match</b><span class="faint">Try fewer filters, a different folder or a broader search.</span><button class="btn sm" data-h="clearf">Clear filters</button></div>`}`}
function breakdown(k,st){const f=FAC[k][k==='scholar'?0:k==='patent'?1:k==='library'?1:k==='web'?1:k==='ieee'?2:0];if(!f)return '';const c={};base(k).forEach(x=>fv(f,x).forEach(v=>c[v]=(c[v]||0)+1));
 return `<div class="hb-brk"><span class="faint">${f[1]}</span>${Object.keys(c).sort((a,b)=>c[b]-c[a]).map(v=>`<button class="hb-bk${(st.f[f[0]]||[]).includes(v)?' on':''}" data-h="brk" data-k="${f[0]}" data-v="${esc(v)}">${esc(v)} <b>${c[v]}</b></button>`).join('')}</div>`}
function wsHTML(k,mode){
 const st=ST(k,mode==='pick'),s=SOURCES[k];
 if(k!=='all'&&!isOn(k))return `<div class="hb-off">${sico(k,26)}<b>${s.n} is not connected</b><span class="faint">${s.prov}. Connect it to browse, filter and cite its records.</span>${connV(k)===2?'<span class="pill accent run"><i></i>Connecting</span>':`<button class="btn pri" data-act="conn" data-i="${s.ci}">Connect ${s.n}</button>`}</div>`;
 const head=mode==='page'?`<div class="hb-head"><button class="btn sm ghost" data-h="home">${ix('back',14)} All sources</button><div class="hb-title">${k==='all'?`<span class="hb-ico">${ic('search',18)}</span>`:sico(k,20)}<div><h1>${k==='all'?'Search all sources':s.n}</h1><p>${k==='all'?'One query across every connected database, upload and drive':s.prov}</p></div></div><span class="grow"></span>${k!=='all'?`<span class="pill ok">${ic('check',12)} Connected</span><span class="faint" style="font-size:12px">Synced ${12+hash(k)%40} min ago</span><button class="btn sm" data-h="sync" data-k="${k}">${ix('sync',13)} Sync now</button>`:''}<button class="btn pri sm" data-h="up" data-k="${k==='all'?'library':k}">${ic('upload',13)} Add to ${k==='all'?'sources':s.n.split(' ')[0]}</button></div>
 <div class="hb-switch">${['all'].concat(KEYS).map(x=>`<button class="hb-sw${x===k?' on':''}${x!=='all'&&!isOn(x)?' off':''}" data-h="opensrc" data-k="${x}">${x==='all'?ic('search',13)+' All':ix(SOURCES[x].ico,13)+' '+SOURCES[x].n}<em>${base(x).length}</em></button>`).join('')}</div>${k!=='all'?breakdown(k,st):''}`:'';
 const side=treeHTML(k,st)+(mode==='pick'?filtersHTML(k,st,mode):'');
 return `<div class="hb-ws ${mode}">${head}<div class="hb-cols ${mode}"><aside class="hb-side">${side}</aside><section class="hb-res">${resultsHTML(k,st,mode)}</section>${mode==='page'?`<aside class="hb-fside">${filtersHTML(k,st,mode)}</aside>`:''}</div></div>`}

/* ---------- overview ---------- */
function overviewHTML(){
 const on=KEYS.filter(isOn),recs=CAT.filter(x=>isOn(x.src)),fold=KEYS.reduce((a,k)=>a+(FOLD[k]||[]).filter(f=>f.id).length,0);
 const stat=(v,l,s)=>`<div class="hb-stat"><span class="eyebrow">${l}</span><b>${v}</b><small>${s}</small></div>`;
 const card=k=>{const s=SOURCES[k],v=connV(k),list=base(k),fl=(FOLD[k]||[]).filter(f=>f.id).length;
  return `<div class="hb-card${v===1?'':' off'}" data-h="opensrc" data-k="${k}" role="button" tabindex="0"><div class="hb-ch">${sico(k,20)}<div class="grow"><b class="hb-cn">${s.n}</b><div class="faint" style="font-size:12.5px">${s.sub}</div></div>${v===2?'<span class="pill accent run"><i></i>Connecting</span>':v===1?`<span class="pill ok">${ic('check',12)} Connected</span>`:`<button class="btn sm" data-act="conn" data-i="${s.ci}">Connect</button>`}</div>
  <div class="hb-cm"><div><b>${v===1?list.length:'—'}</b><span>records</span></div><div><b>${fl}</b><span>folders</span></div><div><b>${(SAVED[k]||[]).length}</b><span>saved searches</span></div><div><b>${v===1?list.filter(x=>x.tasks.length).length:'—'}</b><span>in tasks</span></div></div>
  <div class="hb-cf"><span class="faint">Filter by</span>${FAC[k].slice(0,4).map(f=>`<span class="hb-tag">${f[1]}</span>`).join('')}${FAC[k].length>4?`<span class="hb-tag">+${FAC[k].length-4}</span>`:''}</div>
  <div class="hb-cb"><span class="faint">${s.prov}</span><span class="hb-open">Open ${ic('chev',14)}</span></div></div>`};
 const recent=recs.slice().sort((a,b)=>b.added.localeCompare(a.added)).slice(0,7);
 return `<div class="page hb"><div class="ph"><div><h1>Sources</h1><p>Every database, upload and clip in one directory. Open a source to browse its folders, search and filter it, and file what you find.</p></div><div class="grow"></div><button class="btn" data-act="syncTasks">${ic('copy',15)} Copy tasks for extension</button><button class="btn" data-act="clipsImport">${ic('upload',15)} Import clips</button><button class="btn pri" data-h="up" data-k="library">${ic('upload',15)} Upload and name</button></div>
 <div class="hb-stats">${stat(recs.length,'Indexed records','across connected sources')}${stat(on.length+' of '+KEYS.length,'Connected sources',KEYS.filter(k=>!isOn(k)).map(k=>SOURCES[k].n).join(', ')+(on.length<KEYS.length?' not connected':' all live'))}${stat(fold,'Folders and watchlists','organised by research area')}${stat(recs.filter(x=>age(x.added)<=30).length,'Added in 30 days','by '+new Set(recs.filter(x=>age(x.added)<=30).map(x=>x.by)).size+' researchers')}${stat(recs.filter(x=>x.tasks.length).length,'Linked to tasks','cited or queued for agents')}</div>
 <div class="hb-gs"><div class="hb-sbox big">${ic('search',18)}<input id="hb-gq" placeholder="${PH.all}"><button class="btn pri sm" data-h="gsearch">Search</button></div><div class="hb-drop" id="hbdrop" data-h="up" data-k="library">${ic('upload',16)} Drop files here to upload them with a title, origin and dates</div></div>
 <div class="hb-grid">${KEYS.map(card).join('')}</div>
 <div class="hb-two"><div class="card"><div class="hb-sech"><b>Recently added</b><span class="faint">Newest records across sources</span></div><div class="hb-list flat">${recent.map(x=>`<div class="hb-row" data-h="open" data-id="${x.id}" role="button" tabindex="0">${sico(x.src,15)}<div class="hb-rmain"><div class="hb-rt">${lead(x)}${esc(tt(x))}</div><div class="hb-rm">${SOURCES[x.src].n} · added ${fd(x.added)} by ${nm(x.by)}</div></div></div>`).join('')}</div></div>
 <div class="card"><div class="hb-sech"><b>Clips from the extension</b><span class="pill gold">${S.clips.length}</span><span class="faint">Cited from the web, with task</span></div><div class="hb-list flat">${S.clips.map(c=>`<div class="hb-row" data-act="clipInfo" data-id="${c.id}" role="button" tabindex="0">${sico('web',15)}<div class="hb-rmain"><div class="hb-rt">${esc((c.text||c.title).slice(0,110))}</div><div class="hb-rm">${esc(c.site||'')} · ${esc((c.taskTitle||'').slice(0,46))} · ${esc(c.when||'')}</div></div></div>`).join('')}</div></div></div></div>`}
V.sourcesHTML=()=>H.view==='overview'?overviewHTML():`<div class="page hb">${wsHTML(H.view,'page')}</div>`;

/* ---------- detail ---------- */
const mw=(title,body,foot,cls)=>`<div class="mbox ${cls||''}"><div class="sh"><b style="font-size:16px">${title}</b><span class="grow"></span><button class="iconbtn" data-h="mclose" aria-label="Close">${ic('x',18)}</button></div><div class="hb-mb">${body}</div>${foot?`<div class="hb-mf">${foot}</div>`:''}</div>`;
function dl(x){const r=[];const p=(a,b)=>{if(b!==undefined&&b!==''&&b!==null)r.push([a,b])};
 switch(x.src){
 case 'scholar':p('Authors',esc(x.au));p('Journal or venue',esc(x.venue));p('Published',fd(x.date));p('Document type',x.type);p('DOI',x.doi?`<span class="hb-pn">${x.doi}</span>`:'');p('Cited by',x.cites);p('Access',x.oa?'Open access':'Subscription');p('Review status',x.peer?'Peer reviewed':'Preprint, not reviewed');p('Indexed via',x.db);p('Language',x.lang);break;
 case 'patent':p('Number',`<span class="hb-pn">${esc(x.idn)}</span>`);p('Document kind',x.kindL);p('Office',x.juris);p('Legal status',pill(x.status,STP[x.status]));p('Assignee',esc(x.assignee));p('Inventors',esc((x.inv||[]).join('; ')));p('Priority date',fd(x.pri));p('Filing date',fd(x.fil));p('Publication date',fd(x.pub));p('Grant date',x.gr?fd(x.gr):'Not granted');p('Expiry (estimated)',fd(x.exp));p('CPC classes',x.cpc.map(c=>`${c} · ${CPC[c]||''}`).join('<br>'));p('Claims',`${x.ind} independent of ${x.tot}`);p('Claim types',x.claims.join(', '));p('Family members',x.fam);p('Cited by later patents',x.fwd);p('Cites',x.back+' documents');break;
 case 'ieee':p('Designation',`<span class="hb-pn">${esc(x.idn)}</span>`);p('Issuing body',x.body);p('Content type',x.ctype);p('Status',pill(x.status,STP[x.status]));p('Published',fd(x.date));p('Length',x.pages+' pages');break;
 case 'web':p('Outlet',esc(x.outlet));p('Address',`<span class="hb-pn">${esc(x.url||x.domain)}</span>`);p('Published',fd(x.date));p('Content type',x.ctype);p('Credibility',x.tier);p('Region',x.region);p('Access',x.pay?'Paywalled':'Free to read');break;
 default:p('File type',x.ft);p('Origin',esc(x.origin||''));p('Database or provider',esc(x.db||''));p('Published',x.pub?fd(x.pub):'');p('Retrieved',fd(x.ret));p('Uploaded by',nm(x.by));p('Size',x.size);p('Confidentiality',x.conf);p('Index status',pill(x.status,STP[x.status]));p('Identifier',x.idn?esc(x.idn):'')}
 p('Research area',esc(x.area||''));p('Added',`${fd(x.added)} by ${nm(x.by)}`);
 return `<dl class="hb-dl">${r.map(([a,b])=>`<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl>`}
function detail(id){const x=CAT.find(y=>y.id===id);if(!x)return;const fam=x.fid?CAT.filter(y=>y.fid===x.fid&&y.id!==x.id):[],k=x.src,fo=(FOLD[k]||[]).filter(f=>f.id&&!f.fn);
 const body=`<div class="hb-det"><div class="hb-dm"><div class="hb-dsrc">${sico(k,15)} ${SOURCES[k].n}${x.db?' · '+esc(x.db):''}</div><div class="hb-dt">${lead(x)}${esc(tt(x))}</div>${x.ct?`<div class="faint" style="font-size:12.5px">Original title: ${esc(x.t)}</div>`:''}<div class="hb-rb" style="margin-top:10px">${badges(x)}</div>
 <div class="hb-ds"><div class="eyebrow">${k==='patent'?'Abstract':k==='ieee'?'Scope':'Summary'}</div><p>${esc(x.abs||x.scope||'No summary yet.')}</p></div>
 ${x.claim?`<div class="hb-ds"><div class="eyebrow">First independent claim</div><p class="hb-claim">${esc(x.claim)}</p></div>`:''}
 ${k==='patent'?`<div class="hb-ds"><div class="eyebrow">Freedom-to-operate view</div><p>${pill(x.fto,FTP[x.fto])} ${FTON[x.fto]}</p></div>`:''}
 ${fam.length?`<div class="hb-ds"><div class="eyebrow">Same family in other offices</div>${fam.map(y=>`<button class="hb-fam" data-h="open" data-id="${y.id}"><span class="hb-pn">${esc(y.idn)}</span>${pill(y.status,STP[y.status])}<span class="faint">${y.office} · published ${fd(y.pub)}</span></button>`).join('')}</div>`:''}
 ${x.kw&&x.kw.length?`<div class="hb-ds"><div class="eyebrow">Keywords</div><div class="chips">${x.kw.map(w=>`<span class="hb-tag">${esc(w)}</span>`).join('')}</div></div>`:''}
 <div class="hb-ds"><div class="eyebrow">Team notes</div><p>${x.note?esc(x.note):'<span class="faint">No notes yet. Add one from Edit details.</span>'}</p></div></div>
 <aside class="hb-dside">${dl(x)}<div class="field"><label>Folder</label><select class="in" data-hc="move" data-id="${x.id}">${fo.map(f=>`<option value="${f.id}"${x.folder===f.id?' selected':''}>${esc(f.n)}</option>`).join('')}</select></div>
 <div class="field"><label>Linked research tasks</label><div class="chips">${x.tasks.map(t=>`<button class="hb-chip" data-h="unlink" data-id="${x.id}" data-t="${t}">${byId(t).code} ${ic('x',11)}</button>`).join('')||'<span class="faint" style="font-size:12px">Not linked yet</span>'}</div><select class="in" data-hc="link" data-id="${x.id}"><option value="">Link to a task…</option>${T.filter(t=>!x.tasks.includes(t.id)).map(t=>`<option value="${t.id}">${t.code} · ${esc(t.title.slice(0,44))}</option>`).join('')}</select></div></aside></div>`;
 const foot=`<button class="btn" data-h="edit" data-id="${x.id}">${ic('edit',14)} Edit title and details</button><button class="btn" data-h="copycite" data-id="${x.id}">${ic('copy',14)} Copy citation</button>${x.srcN&&!H.pickOpen?`<button class="btn" data-h="cited" data-n="${x.srcN}">${ic('file',14)} Open cited passage</button>`:''}<span class="grow"></span><button class="btn${x.star?' pri':''}" data-h="star" data-id="${x.id}">${ix('star',14)} ${x.star?'Starred':'Star'}</button>`;
 H.det=id;sub(mw(x.idn?esc(x.idn):'Record details',body,foot,'wide hb-wide'))}
function cite(x){switch(x.src){case 'scholar':return `${x.au} (${yr(x.date)}). ${tt(x)}. ${x.venue}.${x.doi?' https://doi.org/'+x.doi:''}`;case 'patent':return `${x.assignee} (${yr(x.pub)}). ${tt(x)} (${x.idn}). ${x.office}.`;case 'ieee':return `${x.body} (${yr(x.date)}). ${x.idn}: ${tt(x)}.`;case 'web':return `${x.outlet} (${fd(x.date)}). ${tt(x)}. ${x.url||x.domain}`;default:return `${tt(x)}. ${x.origin||''}${x.db?' ('+x.db+')':''}, retrieved ${fd(x.ret)}.`}}

/* ---------- modal plumbing (keeps the wizard alive underneath) ---------- */
function sub(html){const m=$('#modal');if(!H.ret)H.ret=H.pickOpen?'pick':S.wiz?'wiz':'none';m.innerHTML=html;m.style.display='flex'}
function hclose(){const r=H.ret;H.ret=null;H.det=null;H.up=null;const m=$('#modal');if(r==='wiz'&&S.wiz){m.innerHTML=W.wizHTML();m.style.display='flex'}else{m.style.display='none';m.innerHTML=''}paint()}

/* ---------- upload and naming ---------- */
const ORIG={scholar:['Google Scholar',['Google Scholar','arXiv','ChemRxiv','Publisher site'],['Journal article','Review','Preprint','Conference paper','Thesis','Book chapter'],'DOI, e.g. 10.1016/j.jpowsour.2025.236114','Authors'],
 patent:['Patent database',['USPTO','EPO','WIPO','CNIPA','JPO','KIPO','DPMA'],['Granted patent','Published application','PCT application'],'Patent number, e.g. US 12,300,418 B2','Assignee'],
 ieee:['IEEE Xplore or standards body',['IEEE Xplore','IEC webstore','ISO','UL Standards','SAE Mobilus','UN'],['Standard','Conference paper','Journal article'],'Designation, e.g. UL 9540A:2025','Issuing body'],
 web:['Web and news',['News site','Trade press','Company site','Government site','Blog'],['News','Trade press','Company release','Government','Analyst note','Blog'],'URL','Outlet'],
 library:['Internal or other',['Internal lab','Expert interview','Supplier','Market report','Meeting notes','Other'],['Lab report','Interview notes','Supplier document','Market report','Presentation','Dataset','Other'],'Internal reference, e.g. TL-2291','Author or team']};
const OFF2J={USPTO:'US',EPO:'EP',WIPO:'WO',CNIPA:'CN',JPO:'JP',KIPO:'KR',DPMA:'DE'};
const niceT=n=>{const s=n.replace(/\.[a-z0-9]+$/i,'').replace(/[_-]+/g,' ').replace(/\s+/g,' ').trim();return s?s[0].toUpperCase()+s.slice(1):''};
function guess(v){v=v.trim();if(/^10\.\d{4,}\//.test(v))return {origin:'scholar',db:'Google Scholar',idn:v,title:''};const m=v.match(/^(US|EP|WO|CN|JP|KR|DE)[\s\d]/i);if(m)return {origin:'patent',db:{US:'USPTO',EP:'EPO',WO:'WIPO',CN:'CNIPA',JP:'JPO',KR:'KIPO',DE:'DPMA'}[m[1].toUpperCase()],idn:v.toUpperCase(),type:/ B\d?$/i.test(v)?'Granted patent':/^WO/i.test(v)?'PCT application':'Published application',title:''};
 if(/^https?:/i.test(v)){let h='';try{h=new URL(v).hostname.replace(/^www\./,'')}catch(e){}const path=v.split('/').filter(Boolean).pop()||'';if(/ieee|iec|iso\.org|ulse|sae\.org/.test(h))return {origin:'ieee',db:'IEEE Xplore',idn:v,title:niceT(path)};if(/scholar|arxiv|doi\.org|sciencedirect|nature\.com|wiley|acs\.org|rsc\.org/.test(h))return {origin:'scholar',db:/arxiv/.test(h)?'arXiv':'Publisher site',idn:v,title:niceT(path)};return {origin:'web',db:'News site',idn:v,au:h,title:niceT(path)}}
 return {origin:'library',db:'Other',idn:v,title:niceT(v)}}
function newRow(o){const g=o.origin||'library',O=ORIG[g];return Object.assign({origin:g,db:O[1][0],type:O[2][0],title:'',pub:'',ret:TODAY,idn:'',au:'',folder:((FOLD[g]||[]).find(f=>f.id&&!f.fn)||{}).id||'',task:'',tags:'',conf:g==='library'?'Internal':'Public',note:'',file:''},o)}
function upHTML(){const u=H.up,O=ORIG,rows=u.rows;
 const sel=(f,i,opts,v,lab)=>`<select class="in" data-uf="${f}" data-i="${i}"${lab?` aria-label="${lab}"`:''}>${opts.map(o=>Array.isArray(o)?`<option value="${esc(o[0])}"${o[0]===v?' selected':''}>${esc(o[1])}</option>`:`<option${o===v?' selected':''}>${esc(o)}</option>`).join('')}</select>`;
 const row=(r,i)=>{const o=O[r.origin],fo=(FOLD[r.origin]||[]).filter(f=>f.id&&!f.fn);return `<div class="hb-uprow" data-i="${i}"><div class="hb-uph"><span class="hb-upn">${i+1}</span>${r.file?`${ic('file',14)}<span class="faint hb-ell">${esc(r.file)}</span>`:r.idn?`${ic('link',14)}<span class="faint hb-ell">${esc(r.idn)}</span>`:'<span class="faint">Manual entry</span>'}<span class="grow"></span>${u.edit?'':`<button class="iconbtn" style="width:26px;height:26px" data-h="uprm" data-i="${i}" aria-label="Remove">${ic('x',14)}</button>`}</div>
 <div class="hb-upg"><div class="field span2"><label>Custom title <span class="hb-req">required</span></label><input class="in" data-uf="title" data-i="${i}" value="${esc(r.title)}" placeholder="How the team should see this source, e.g. Okafor interview, yield figures"></div>
 <div class="field"><label>Source</label>${sel('origin',i,Object.keys(O).map(k=>[k,O[k][0]]),r.origin,'Source')}</div>
 <div class="field"><label>${r.origin==='patent'?'Patent office':'Database or provider'}</label>${sel('db',i,o[1],r.db)}</div>
 <div class="field"><label>Document type</label>${sel('type',i,o[2],r.type)}</div>
 <div class="field"><label>${o[4]}</label><input class="in" data-uf="au" data-i="${i}" value="${esc(r.au)}"></div>
 <div class="field"><label>${r.origin==='patent'?'Publication date':'Published on'}</label><input class="in" type="date" data-uf="pub" data-i="${i}" value="${r.pub}"></div>
 <div class="field"><label>Retrieved on</label><input class="in" type="date" data-uf="ret" data-i="${i}" value="${r.ret}"></div>
 <div class="field span2"><label>Identifier</label><input class="in" data-uf="idn" data-i="${i}" value="${esc(r.idn)}" placeholder="${o[3]}"></div>
 <div class="field"><label>Folder</label>${sel('folder',i,fo.map(f=>[f.id,f.n]),r.folder)}</div>
 <div class="field"><label>Link to task</label>${sel('task',i,[['','No task yet']].concat(T.map(t=>[t.id,t.code+' · '+t.title.slice(0,34)])),r.task)}</div>
 <div class="field"><label>Tags</label><input class="in" data-uf="tags" data-i="${i}" value="${esc(r.tags)}" placeholder="yield, gate-2"></div>
 <div class="field"><label>Confidentiality</label>${sel('conf',i,['Public','Internal','Confidential'],r.conf)}</div>
 <div class="field span2"><label>Notes for the team</label><textarea class="in" rows="2" data-uf="note" data-i="${i}" placeholder="Why it matters, which figure to check">${esc(r.note)}</textarea></div></div>
 <div class="hb-prev"><span class="eyebrow">Shows in citations as</span><span data-prev="${i}">${esc(prev(r))}</span></div></div>`};
 const body=`${u.edit?'':`<div class="hb-uptop"><div class="hb-drop2" id="hbdrop2" data-h="upfile">${ic('upload',20)}<div><b>Choose or drop files</b><div class="faint" style="font-size:12px">PDF, DOCX, PPTX, XLSX, CSV, TXT. Each file gets its own title and dates.</div></div></div><div class="hb-uplink"><input class="in" id="hb-uplink" placeholder="Or paste a DOI, patent number or link"><button class="btn" data-h="uplink">Add</button><button class="btn ghost" data-h="upman">Manual entry</button></div></div>`}
 ${rows.length?rows.map(row).join(''):'<div class="hb-empty"><b>Nothing added yet</b><span class="faint">Choose files or paste a link. You will name each one before it is saved.</span></div>'}`;
 return mw(u.edit?'Edit title and details':'Add sources with a title',body,`<span class="faint" style="font-size:12px">${rows.length?rows.length+' item'+(rows.length>1?'s':''):''}</span><span class="grow"></span><button class="btn" data-h="mclose">Cancel</button><button class="btn pri" data-h="upsave"${rows.length?'':' disabled'}>${u.edit?'Save changes':'Save '+(rows.length||'')+' source'+(rows.length===1?'':'s')}</button>`,'wide hb-wide')}
const prev=r=>`${r.title||'Untitled'} · ${ORIG[r.origin][0]}${r.db&&r.db!==ORIG[r.origin][0]?' ('+r.db+')':''}${r.pub?' · published '+fd(r.pub):''}${r.ret?' · retrieved '+fd(r.ret):''}`;
function syncUp(){if(!H.up)return;document.querySelectorAll('#modal [data-uf]').forEach(el=>{const r=H.up.rows[+el.dataset.i];if(r)r[el.dataset.uf]=el.value})}
function openUp(o){H.up={rows:[],edit:null,origin:o.k||'library'};if(o.rows)H.up.rows=o.rows;sub(upHTML())}
function redrawUp(){syncUp();$('#modal').innerHTML=upHTML()}
function saveUp(){syncUp();const u=H.up,bad=u.rows.findIndex(r=>!r.title.trim());if(bad>=0){toast('Give item '+(bad+1)+' a title');const el=document.querySelector(`#modal [data-uf="title"][data-i="${bad}"]`);el&&el.focus();return}
 const tags=s=>s.split(',').map(t=>t.trim().replace(/^#/,'')).filter(Boolean);
 if(u.edit){const x=CAT.find(y=>y.id===u.edit),r=u.rows[0];if(r.title.trim()!==x.t)x.ct=r.title.trim();else x.ct='';Object.assign(x,{db:r.db,idn:r.idn||x.idn,folder:r.folder||x.folder,conf:r.conf,note:r.note,tags:tags(r.tags)});if(r.pub){x.pub=r.pub;if(x.src!=='patent')x.date=r.pub}if(r.ret)x.ret=r.ret;if(r.task&&!x.tasks.includes(r.task))x.tasks.push(r.task);if(r.au){if(x.src==='scholar')x.au=r.au;else if(x.src==='patent')x.assignee=r.au;else if(x.src==='web')x.outlet=r.au}
  toast('Saved. Shows as “'+esc(tt(x))+'”','ok');const id=x.id;H.up=null;H.ret=H.ret||'none';detail(id);paint();return}
 const made=u.rows.map((r,i)=>{const g=r.origin,src=g,id='up'+Date.now()+i,ext=(r.file.split('.').pop()||'').toUpperCase();
  const x={id,src,file:!!r.file,t:r.title.trim(),ft:r.file?ext:'Link',origin:ORIG[g][0],db:r.db,idn:r.idn,folder:r.folder,area:r.task?byId(r.task).sector:(FAREA[parentOf(g,r.folder)]||'Materials'),tasks:r.task?[r.task]:[],tags:tags(r.tags),conf:r.conf,note:r.note,by:S.role==='vp'?'priya':'amina',added:TODAY,ret:r.ret||TODAY,pub:r.pub,date:r.pub||r.ret||TODAY,status:'Indexing',size:r.file?'Uploaded':'',abs:r.note||`Added by ${nm(S.role==='vp'?'priya':'amina')} from ${ORIG[g][0]}${r.db?' ('+r.db+')':''}.`};
  if(g==='scholar')Object.assign(x,{au:r.au||'Unknown authors',venue:r.db,type:r.type,cites:0,oa:false,peer:r.type!=='Preprint',doi:/^10\./.test(r.idn)?r.idn:'',lang:'English',kw:kwOf(x.t)});
  if(g==='patent'){const j=OFF2J[r.db]||'US';Object.assign(x,{idn:r.idn||'Number pending',j,juris:JUR[j],office:r.db,kindL:r.type==='Granted patent'?'Granted patent (B)':r.type==='PCT application'?'PCT application (A1)':'Published application (A)',status:r.type==='Granted patent'?'Granted':r.type==='PCT application'?'PCT published':'Pending',assignee:r.au||'Unknown assignee',inv:[],pri:r.pub||TODAY,fil:r.pub||TODAY,pub:r.pub||TODAY,gr:'',exp:addM(r.pub||TODAY,240),cpc:[],claims:[],ind:0,tot:0,fam:1,fwd:0,back:0,fto:'Not assessed'})}
  if(g==='ieee')Object.assign(x,{idn:r.idn||x.t,body:r.au||r.db,ctype:r.type,status:'Active',pages:0});
  if(g==='web')Object.assign(x,{outlet:r.au||r.db,domain:(r.idn.match(/\/\/(?:www\.)?([^/]+)/)||[0,''])[1],url:r.idn,ctype:r.type,tier:'Tier 2 · trade publication',region:'Global',pay:false});
  if(g==='library'){x.file=true;x.origin=r.db}
  CAT.unshift(x);setTimeout(()=>{x.status='Indexed';paint()},1800+i*500);return x});
 toast(made.length+' source'+(made.length>1?'s':'')+' added and indexing','ok');
 if(H.ret==='wiz'&&S.wiz){const d=S.wiz.d;d.picked=d.picked||[];made.forEach(x=>{if(!d.picked.includes(x.id))d.picked.push(x.id)})}
 if(H.ret==='pick'&&H.ptmp)made.forEach(x=>H.ptmp.push(x.id));
 hclose()}
function fileIn(cb){let f=$('#hbFile');if(!f){f=document.createElement('input');f.type='file';f.id='hbFile';f.multiple=true;f.hidden=true;document.body.appendChild(f)}f.onchange=()=>{cb([...f.files].map(x=>x.name));f.value=''};f.click()}
const filesToRows=(names,origin)=>names.map(n=>newRow({origin:origin||'library',file:n,title:niceT(n)}));

/* ---------- wizard: expanded source step ---------- */
const GRP=[['Scholar','Google Scholar'],['Patents','Patent databases'],['IEEE','IEEE and standards'],['Web','Web and news'],['Uploads','Uploads and drive']];
function suggest(d){const words=((d.q||'')+' '+(d.title||'')).toLowerCase().split(/\W+/).filter(w=>w.length>3);
 return CAT.filter(x=>isOn(x.src)&&!d.picked.includes(x.id)).map(x=>{const h=hay(x,'all').toLowerCase();let s=(x.area===d.sector?3:0)+(x.tasks.length?.5:0);words.forEach(w=>{if(h.includes(w))s+=2});return [x,s]}).filter(p=>p[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,5).map(p=>p[0])}
const mini=(x,act,lab)=>`<div class="hb-mini">${sico(x.src,14)}<div class="hb-rmain"><div class="hb-rt">${lead(x)}${esc(tt(x))}</div><div class="hb-rm">${SOURCES[x.src].n} · ${x.src==='patent'?x.status+' · '+x.office:x.src==='scholar'?esc(x.venue)+' · '+yr(x.date):fd(x.date||x.ret)}</div></div><button class="btn sm${act==='wpick'?'':' ghost'}" data-h="${act}" data-id="${x.id}">${lab}</button></div>`;
function wizSources(){const d=S.wiz.d;d.picked=d.picked||[];const pk=d.picked.map(id=>CAT.find(x=>x.id===id)).filter(Boolean),sg=suggest(d);
 const by={};pk.forEach(x=>(by[x.src]=by[x.src]||[]).push(x));
 return `<div class="hb-wz"><div class="hb-wzh"><div><b>Choose the evidence agents should read first</b><p class="faint">Browse every connected database by folder, search and filter it, and tick what belongs in this task. Agents still search the databases below for anything new.</p></div><div class="hb-wza"><button class="btn pri" data-h="pickopen">${ic('search',15)} Browse source directory</button><button class="btn" data-h="up" data-k="library">${ic('upload',15)} Upload and name</button></div></div>
 <div class="hb-uplink"><input class="in" id="hb-wlink" placeholder="Paste a DOI, patent number or link to add it with a title"><button class="btn" data-h="wquick">Add</button></div>
 <div class="field"><label>Databases agents will also search</label><div class="chips">${GRP.map(g=>`<button class="fchip${d.src.includes(g[0])?' on':''}" data-h="wgrp" data-v="${g[0]}">${g[1]}</button>`).join('')}</div></div>
 <div><div class="hb-wzs"><b>Selected for this task</b><span class="pill gold">${pk.length}</span><span class="grow"></span>${pk.length?'<button class="btn sm ghost" data-h="wclear">Clear all</button>':''}</div>${pk.length?Object.keys(by).map(k=>`<div class="hb-wzg"><div class="eyebrow">${SOURCES[k].n} · ${by[k].length}</div>${by[k].map(x=>mini(x,'wunpick','Remove')).join('')}</div>`).join(''):'<div class="hb-empty sm"><span class="faint">Nothing picked yet. Add a suggestion below, or browse the directory.</span></div>'}</div>
 ${sg.length?`<div><div class="hb-wzs"><b>Suggested for this question</b><span class="faint">Matched to ${esc(d.sector)} and your wording</span></div>${sg.map(x=>mini(x,'wpick','Add')).join('')}</div>`:''}</div>`}
const origWiz=W.wizHTML;
W.wizHTML=function(){const w=S.wiz;if(!w)return origWiz();w.d.picked=w.d.picked||[];
 if(w.step===2){const WS=['Question','Scope','Sources','Models','Launch'];const steps=`<div class="wiz-steps">${WS.map((s,i)=>`<div style="flex:1"><div style="height:4px;border-radius:4px;background:${i<=2?'var(--accent)':'var(--line2)'}"></div><div class="faint" style="font-size:11.5px;margin-top:4px;${i===2?'color:var(--fg);font-weight:600':''}">${i+1}. ${s}</div></div>`).join('')}</div>`;
  return W.mwrap('New research task',steps+wizSources(),'<button class="btn" data-act="wback">Back</button><button class="btn pri" data-act="wnext">Continue</button>',true)}
 let h=origWiz();
 if(w.step===4){const pk=w.d.picked.map(id=>CAT.find(x=>x.id===id)).filter(Boolean);h=h.replace('<div class="faint" style="font-size:13px">It starts',`<div class="card sec" style="box-shadow:none"><div class="eyebrow" style="margin-bottom:8px">${pk.length} source${pk.length===1?'':'s'} attached</div>${pk.length?pk.slice(0,6).map(x=>`<div class="hb-rm" style="padding:3px 0">${sico(x.src,13)} ${esc(tt(x))}</div>`).join('')+(pk.length>6?`<div class="faint">and ${pk.length-6} more</div>`:''):'<span class="faint">None picked. Agents will search the selected databases.</span>'}</div><div class="faint" style="font-size:13px">It starts`)}
 return h};
document.addEventListener('click',ev=>{const el=ev.target.closest('[data-act="wlaunch"]');if(!el||!S.wiz)return;const ids=(S.wiz.d.picked||[]).slice();setTimeout(()=>{const t=T[0];if(!t||!ids.length)return;const ns=[];ids.forEach(id=>{const x=CAT.find(y=>y.id===id);if(!x)return;if(!x.tasks.includes(t.id))x.tasks.push(t.id);if(x.srcN&&!ns.includes(x.srcN))ns.push(x.srcN)});if(ns.length)t.src=ns.concat(t.src.filter(n=>!ns.includes(n))).slice(0,8);t.hub=ids;toast(ids.length+' picked sources attached to '+t.code,'ok')},0)},true);

/* ---------- picker overlay ---------- */
function pickHTML(){const k=H.pk,sel=H.ptmp.map(id=>CAT.find(x=>x.id===id)).filter(Boolean),title=S.wiz&&(S.wiz.d.title||S.wiz.d.q)||'new task';
 return `<div class="hb-pk" role="dialog" aria-label="Source directory"><div class="hb-pkt"><b>Source directory</b><span class="faint hb-ell">for “${esc(title.slice(0,70))}”</span><span class="grow"></span><button class="iconbtn" data-h="pickclose" aria-label="Close">${ic('x',18)}</button></div>
 <div class="hb-pkb"><nav class="hb-pks">${['all'].concat(KEYS).map(x=>`<button class="hb-node${x===k?' on':''}${x!=='all'&&!isOn(x)?' dim':''}" data-h="pksrc" data-k="${x}">${x==='all'?ic('search',14):ix(SOURCES[x].ico,14)}<span>${x==='all'?'All sources':SOURCES[x].n}</span><em>${x!=='all'&&!isOn(x)?'off':base(x).length}</em></button>`).join('')}</nav>
 <div class="hb-pkm">${wsHTML(k,'pick')}</div>
 <aside class="hb-pktray"><div class="hb-wzs"><b>Selected</b><span class="pill gold">${sel.length}</span><span class="grow"></span>${sel.length?'<button class="btn sm ghost" data-h="pkclear">Clear</button>':''}</div>${sel.length?sel.map(x=>`<div class="hb-tray">${sico(x.src,13)}<span class="hb-ell" title="${esc(tt(x))}">${esc(tt(x))}</span><button class="iconbtn" style="width:22px;height:22px" data-h="ptog" data-id="${x.id}" aria-label="Remove">${ic('x',12)}</button></div>`).join(''):'<p class="faint" style="font-size:12.5px">Tick records to add them. They stay selected while you switch sources and folders.</p>'}<button class="btn sm" data-h="up" data-k="library" style="margin-top:10px">${ic('upload',13)} Upload and name</button></aside></div>
 <div class="hb-pkf"><span class="faint">${sel.length} selected</span><span class="grow"></span><button class="btn" data-h="pickclose">Cancel</button><button class="btn pri" data-h="pickdone">Add ${sel.length||''} to task</button></div></div>`}
function pickOpen(){H.ptmp=(S.wiz.d.picked||[]).slice();H.pickOpen=true;$('#modal').style.display='none';let w=$('#hubpick');if(!w){w=document.createElement('div');w.id='hubpick';document.body.appendChild(w)}w.className='hb-pkw';w.innerHTML=pickHTML()}
function pickClose(save){if(save&&S.wiz)S.wiz.d.picked=H.ptmp.slice();H.pickOpen=false;H.ptmp=null;const w=$('#hubpick');w&&w.remove();if(S.wiz){const m=$('#modal');m.innerHTML=W.wizHTML();m.style.display='flex'}}

/* ---------- paint ---------- */
function keep(fn){const a=document.activeElement,id=a&&a.id,s=a&&a.selectionStart,e=a&&a.selectionEnd;fn();if(id){const n=document.getElementById(id);if(n&&n!==a){n.focus();try{if(s!=null)n.setSelectionRange(s,e)}catch(_){}}}}
function paint(){if(S.route==='sources'&&!$('#main .hb')&&H.view==='overview'&&!$('#main').innerHTML.includes('hb'))return;if(S.route==='sources')keep(()=>{$('#main').innerHTML=V.sourcesHTML()});const w=$('#hubpick');if(w&&H.ptmp)keep(()=>{const sc=w.querySelector('.hb-pkm'),t=sc?sc.scrollTop:0;w.innerHTML=pickHTML();const n=w.querySelector('.hb-pkm');if(n)n.scrollTop=t})}
const modeOf=el=>el.closest('#hubpick')?'pick':'page';
const keyOf=m=>m==='pick'?H.pk:H.view;
const stOf=el=>{const m=modeOf(el);return [ST(keyOf(m),m==='pick'),keyOf(m),m]};
function go(v){H.view=v;paint();const m=$('#main');if(m)m.scrollTop=0}

/* ---------- events ---------- */
document.addEventListener('click',ev=>{
 const nav=ev.target.closest('[data-act="nav"][data-r="sources"]');if(nav)H.view='overview';
 const el=ev.target.closest('[data-h]');if(!el)return;
 if(ev.target.closest('.hb-ck'))return;
 const a=el.dataset.h,d=el.dataset;ev.stopPropagation();
 if(el.tagName==='BUTTON'||el.tagName==='A')ev.preventDefault();
 const [st,k,mode]=stOf(el);
 const find=id=>CAT.find(x=>x.id===id);
 switch(a){
 case 'home':go('overview');break;
 case 'opensrc':if(ev.target.closest('[data-act]'))return;go(d.k);break;
 case 'gsearch':{const q=$('#hb-gq').value.trim();ST('all').q=q;go('all');break}
 case 'open':detail(d.id);break;
 case 'star':{const x=find(d.id);x.star=!x.star;toast(x.star?'Starred':'Removed from Starred',x.star);if(H.det===d.id)detail(d.id);paint();break}
 case 'folder':st.folder=d.f;st.page=1;paint();break;
 case 'saved':{const s=SAVED[k][+d.i];Object.assign(st,{q:s.q||'',f:JSON.parse(JSON.stringify(s.f||{})),yr:(s.yr||['','']).slice(),folder:s.folder||'saved:'+d.i,page:1});if(!s.folder)st.folder='saved:'+d.i;paint();break}
 case 'savesearch':{const parts=[];if(st.q)parts.push(st.q);Object.keys(st.f).forEach(f=>st.f[f].length&&parts.push(st.f[f].join(' or ')));if(st.yr[0]||st.yr[1])parts.push((st.yr[0]||'…')+'–'+(st.yr[1]||'…'));const n=(parts.join(', ')||'Saved search').slice(0,52);(SAVED[k]=SAVED[k]||[]).push({n,q:st.q,f:JSON.parse(JSON.stringify(st.f)),yr:st.yr.slice()});st.folder='saved:'+(SAVED[k].length-1);toast('Saved search “'+esc(n)+'”','ok');paint();break}
 case 'newfolder':st.nf=true;paint();setTimeout(()=>{const i=$('#hb-nf-'+k);i&&i.focus()},0);break;
 case 'clearf':Object.assign(st,{q:'',f:{},yr:['',''],folder:'all',page:1});paint();break;
 case 'rmf':if(d.k==='q')st.q='';else if(d.k==='yr')st.yr=['',''];else if(d.k==='folder')st.folder='all';else st.f[d.k]=(st.f[d.k]||[]).filter(v=>v!==d.v);st.page=1;paint();break;
 case 'more':st.more[d.k]=!st.more[d.k];paint();break;
 case 'page':st.page++;paint();break;
 case 'view':st.view=d.v;paint();break;
 case 'dt':st.dt=d.v;paint();break;
 case 'brk':{const cur=st.f[d.k]||[];st.f[d.k]=cur.includes(d.v)?cur.filter(v=>v!==d.v):[d.v];st.page=1;paint();break}
 case 'selall':{const ids=run(k,st).slice(0,st.page*30).map(x=>x.id);if(mode==='pick')ids.forEach(id=>!H.ptmp.includes(id)&&H.ptmp.push(id));else st.sel=ids;paint();break}
 case 'selnone':st.sel=[];paint();break;
 case 'bulkstar':st.sel.forEach(id=>find(id).star=true);toast(st.sel.length+' starred','ok');st.sel=[];paint();break;
 case 'bulkcite':copy(st.sel.map(id=>cite(find(id))).join('\n'),st.sel.length+' citations copied');break;
 case 'sync':toast('Syncing '+SOURCES[d.k].n+' …');setTimeout(()=>toast(SOURCES[d.k].n+' is up to date. No new records since the last sync.','ok'),1100);break;
 case 'ptog':{const i=H.ptmp.indexOf(d.id);if(i>=0)H.ptmp.splice(i,1);else H.ptmp.push(d.id);paint();break}
 case 'pksrc':H.pk=d.k;paint();break;
 case 'pkclear':H.ptmp=[];paint();break;
 case 'pickopen':syncWizQ();pickOpen();break;
 case 'pickclose':pickClose(false);break;
 case 'pickdone':{const n=H.ptmp.length;pickClose(true);toast(n+' source'+(n===1?'':'s')+' selected for this task','ok');break}
 case 'mclose':hclose();break;
 case 'edit':{const x=find(d.id),g=ORIG[x.src]?x.src:'library';H.up={edit:x.id,rows:[newRow({origin:g,title:tt(x),db:x.db||x.office||ORIG[g][1][0],type:x.type||x.ctype||ORIG[g][2][0],pub:x.pub||(x.src!=='patent'?x.date:'')||'',ret:x.ret||x.added,idn:x.idn||x.doi||x.url||'',au:x.au||x.assignee||x.outlet||x.body||'',folder:x.folder,task:'',tags:x.tags.join(', '),conf:x.conf||'Internal',note:x.note,file:x.file&&x.src==='library'?x.t:''})]};$('#modal').innerHTML=upHTML();break}
 case 'copycite':copy(cite(find(d.id)),'Citation copied');break;
 case 'cited':{H.ret=null;const b=document.createElement('button');b.dataset.act='cite';b.dataset.n=d.n;b.hidden=true;document.body.appendChild(b);b.click();b.remove();break}
 case 'unlink':{const x=find(d.id);x.tasks=x.tasks.filter(t=>t!==d.t);detail(x.id);paint();break}
 case 'up':syncWizQ();openUp({k:d.k||(H.view!=='overview'&&H.view!=='all'?H.view:'library')});break;
 case 'upfile':fileIn(n=>{syncUp();H.up.rows.push(...filesToRows(n,H.up.origin==='drive'?'library':H.up.origin));redrawUp()});break;
 case 'uplink':{const i=$('#hb-uplink'),v=i.value.trim();if(!v){toast('Paste a DOI, patent number or link');return}syncUp();H.up.rows.push(newRow(guess(v)));redrawUp();break}
 case 'upman':syncUp();H.up.rows.push(newRow({origin:ORIG[H.up.origin]?H.up.origin:'library'}));redrawUp();break;
 case 'uprm':syncUp();H.up.rows.splice(+d.i,1);redrawUp();break;
 case 'upsave':saveUp();break;
 case 'wgrp':{const s=S.wiz.d.src,i=s.indexOf(d.v);if(i>=0)s.splice(i,1);else s.push(d.v);rewiz();break}
 case 'wpick':S.wiz.d.picked.push(d.id);rewiz();break;
 case 'wunpick':S.wiz.d.picked=S.wiz.d.picked.filter(x=>x!==d.id);rewiz();break;
 case 'wclear':S.wiz.d.picked=[];rewiz();break;
 case 'wquick':{const i=$('#hb-wlink'),v=i.value.trim();if(!v){toast('Paste a DOI, patent number or link');return}openUp({k:'library',rows:[newRow(guess(v))]});break}
 }
});
function syncWizQ(){}
function rewiz(){$('#modal').innerHTML=W.wizHTML()}
async function copy(t,msg){try{await navigator.clipboard.writeText(t);toast(msg,'ok')}catch(e){toast('Copy is blocked here. Select the text and copy it manually.')}}
document.addEventListener('change',ev=>{const el=ev.target;
 if(el.matches('[data-hs]')){const [st,,mode]=stOf(el),id=el.dataset.hs;if(mode==='pick'){const i=H.ptmp.indexOf(id);if(i>=0)H.ptmp.splice(i,1);else H.ptmp.push(id)}else{const i=st.sel.indexOf(id);if(i>=0)st.sel.splice(i,1);else st.sel.push(id)}paint();return}
 if(el.matches('[data-hf]')){const [st]=stOf(el),k=el.dataset.hf,c=st.f[k]=st.f[k]||[],i=c.indexOf(el.value);if(i>=0)c.splice(i,1);else c.push(el.value);st.page=1;paint();return}
 const hc=el.dataset.hc;if(hc){const [st,k]=stOf(el);
  if(hc==='sort')st.sort=el.value;else if(hc==='scope')st.scope=el.value;else if(hc==='yr0')st.yr[0]=el.value;else if(hc==='yr1')st.yr[1]=el.value;
  else if(hc==='move'){const x=CAT.find(y=>y.id===el.dataset.id);x.folder=el.value;toast('Moved to '+esc(el.selectedOptions[0].text),'ok')}
  else if(hc==='link'&&el.value){const x=CAT.find(y=>y.id===el.dataset.id);x.tasks.push(el.value);toast('Linked to '+byId(el.value).code,'ok');detail(x.id)}
  else if(hc==='bulkmove'&&el.value){st.sel.forEach(id=>CAT.find(x=>x.id===id).folder=el.value);toast(st.sel.length+' moved to '+esc(el.selectedOptions[0].text),'ok');st.sel=[]}
  else if(hc==='bulklink'&&el.value){st.sel.forEach(id=>{const x=CAT.find(y=>y.id===id);if(!x.tasks.includes(el.value))x.tasks.push(el.value)});toast(st.sel.length+' linked to '+byId(el.value).code,'ok');st.sel=[]}
  st.page=1;paint();return}
 if(el.matches('[data-uf="origin"]')){syncUp();const r=H.up.rows[+el.dataset.i],g=el.value,O=ORIG[g];Object.assign(r,{origin:g,db:O[1][0],type:O[2][0],folder:((FOLD[g]||[]).find(f=>f.id&&!f.fn)||{}).id||''});redrawUp()}
});
let qT=0;
document.addEventListener('input',ev=>{const el=ev.target;
 if(el.matches('[data-hq]')){const [st]=stOf(el);clearTimeout(qT);qT=setTimeout(()=>{st.q=el.value;st.page=1;paint()},180)}
 if(el.matches('[data-uf]')&&H.up){const r=H.up.rows[+el.dataset.i];if(!r)return;r[el.dataset.uf]=el.value;const p=document.querySelector(`[data-prev="${el.dataset.i}"]`);if(p)p.textContent=prev(r)}
});
document.addEventListener('keydown',ev=>{const t=ev.target;
 if(ev.key==='Escape'){if(H.ret&&$('#modal').style.display==='flex'){ev.stopPropagation();hclose();return}if(H.pickOpen){ev.stopPropagation();pickClose(false);return}}
 if(ev.key!=='Enter'&&ev.key!==' ')return;
 if(ev.key==='Enter'&&t.id==='hb-gq'){ev.preventDefault();ST('all').q=t.value.trim();go('all');return}
 if(ev.key==='Enter'&&t.id==='hb-uplink'){ev.preventDefault();$('[data-h="uplink"]').click();return}
 if(ev.key==='Enter'&&t.id==='hb-wlink'){ev.preventDefault();$('[data-h="wquick"]').click();return}
 if(ev.key==='Enter'&&t.id&&t.id.startsWith('hb-nf-')){ev.preventDefault();const k=t.id.slice(6),n=t.value.trim();const st=ST(k,modeOf(t)==='pick');st.nf=false;if(n){const id='cf'+(++H.cf);FOLD[k].push({id,n});st.folder=id;toast('Folder “'+esc(n)+'” created','ok')}paint();return}
 if(t.matches&&t.matches('[data-h][role="button"]')&&t===document.activeElement&&!t.matches('input,select,textarea')){ev.preventDefault();ev.stopPropagation();t.click()}
},true);
['dragover','drop'].forEach(type=>document.addEventListener(type,ev=>{const z=ev.target.closest&&ev.target.closest('#hbdrop,#hbdrop2');if(!z)return;ev.preventDefault();ev.stopPropagation();
 if(type==='dragover'){z.classList.add('over');return}z.classList.remove('over');const names=[...ev.dataTransfer.files].map(f=>f.name);if(!names.length)return;
 if(z.id==='hbdrop')openUp({k:'library',rows:filesToRows(names,'library')});else{syncUp();H.up.rows.push(...filesToRows(names,'library'));redrawUp()}},true));
document.addEventListener('dragleave',ev=>{const z=ev.target.closest&&ev.target.closest('#hbdrop,#hbdrop2');z&&z.classList.remove('over')});
// first render may already be on the Sources page
if(S.route==='sources')$('#main').innerHTML=V.sourcesHTML();
})();

/* ===== original approved design scripts ===== */
/* ===== Collaboration on the research case, plus clearer Evidence and Claims tabs ===== */
(function(){
'use strict';
const D=window.__D,V=window.__V,W=window.__W,S=V.S;
const {$,esc,ic,hash,P,SRC,T,byId}=D;
const nm=id=>P[id]?P[id].n:id,first=id=>nm(id).split(' ')[0].replace('Dr.','Priya');
const col=id=>P[id]?P[id].c:'#888';
const av=(id,sz)=>`<span class="cl-av" style="--c:${col(id)};${sz?`width:${sz}px;height:${sz}px;font-size:${Math.round(sz*.4)}px`:''}" data-tip="${esc(nm(id))}">${P[id]?P[id].i:'?'}</span>`;
function toast(msg,ok){const el=document.createElement('div');el.className='toast'+(ok?' ok':'');el.innerHTML=(ok?ic('check',16):'')+'<span>'+msg+'</span>';$('#toasts').appendChild(el);setTimeout(()=>{el.style.transition='opacity .3s';el.style.opacity=0;setTimeout(()=>el.remove(),300)},2800)}
const me=()=>S.role==='vp'?'priya':'amina';
const SECN={sum:'Summary',scope:'Scope',method:'Method',find:'Findings',evi:'Evidence',src:'Sources',clm:'Claims',rd:'R&D',fin:'Finance',mkt:'Market',leg:'Legal',cas:'Case studies',risk:'Risks',road:'Next steps',dec:'Decision',ref:'References'};
const TEAM=['amina','sara','james','mei','tomas','priya'];

/* ---------- seeded collaboration data per task ---------- */
const C={};
function collab(t){if(C[t.id])return C[t.id];const h=hash(t.id),r=i=>TEAM[(h+i*7)%TEAM.length];
 const people=[t.owner,...TEAM.filter(p=>p!==t.owner)].slice(0,5);
 const own={};Object.keys(SECN).forEach((s,i)=>own[s]=people[(h+i)%people.length]);own.sum=t.owner;own.dec='priya';own.fin='tomas';
 const ago=['8m','26m','1h','2h','3h','5h','Yesterday','Yesterday','2d','3d'];
 const th=[
  {s:'find',by:people[1]||'sara',q:'Propagation delay rises from 38 s to 142 s',x:'Can we add the test conditions here? Gate reviewers will ask about state of charge.',w:ago[2],re:[[t.owner,'Added a footnote with 100% SOC and 25 °C ambient. Please check.',ago[1]]]},
  {s:'fin',by:'tomas',q:'',x:'Cost split for modules under 4 kWh is still an estimate. I would mark this table as provisional until the supplier quote lands.',w:ago[3],re:[]},
  {s:'risk',by:'priya',q:'',x:'@'+first(t.owner)+' please give the top risk a named owner and a date before Thursday.',w:ago[4],re:[[t.owner,'Done. Sara owns it, due 14 Nov.',ago[3]]]},
  {s:'clm',by:people[2]||'james',q:'3× heat-flux claim',x:'This is still supplier-sourced. Suggest we keep it out of the recommendation until we have the primary report.',w:ago[6],re:[]},
  {s:'dec',by:'mei',q:'',x:'Legal lens reads fine. One wording change suggested in the decision paragraph.',w:ago[8],res:true,re:[['priya','Accepted, thanks Mei.',ago[7]]]}];
 const hist=[
  {by:t.owner,s:'sum',w:ago[0],a:'Edited summary',del:'is now the leading option',ins:'is the leading option for modules above 4 kWh'},
  {by:people[1]||'sara',s:'find',w:ago[1],a:'Added test conditions',ins:'Tested at 100% state of charge and 25 °C ambient.'},
  {by:'tomas',s:'fin',w:ago[2],a:'Updated cost table',del:'$212 per module',ins:'$198 per module (supplier quote pending)'},
  {by:'priya',s:'risk',w:ago[4],a:'Requested owners for risks'},
  {by:people[2]||'james',s:'clm',w:ago[5],a:'Changed a claim grade',del:'Verified',ins:'Disputed'},
  {by:'mei',s:'leg',w:ago[6],a:'Rewrote licensing paragraph',del:'Licensing is optional',ins:'A licence is likely needed in the US and EP'},
  {by:t.owner,s:'road',w:ago[7],a:'Added next steps',ins:'Request supplier test report. Run 500 h fluid compatibility test.'},
  {by:people[3]||'mei',s:'evi',w:ago[8],a:'Attached two sources',ins:'TL-2291 lab report, Okafor interview'},
  {by:t.owner,s:'scope',w:ago[9],a:'Created the research case'}];
 return C[t.id]={people,own,th:th.map((x,i)=>Object.assign({id:'c'+i},x)),hist,ver:hist.length,show:true,tab:'comments',fp:'all'}}

/* ---------- comments rail ---------- */
function railHTML(t){const c=collab(t),open=c.th.filter(x=>!x.res),view=c.fp==='all'?c.th:c.th.filter(x=>x.by===c.fp||x.re.some(r=>r[0]===c.fp));
 const tabs=`<div class="cl-tabs">${[['comments','Comments',open.length],['history','Edit history',c.hist.length],['people','Contributors',c.people.length]].map(([k,l,n])=>`<button class="${c.tab===k?'on':''}" data-cl="tab" data-v="${k}">${l}<em>${n}</em></button>`).join('')}</div>`;
 const filt=`<div class="cl-filt"><span class="cl-fl">Show</span><button class="cl-all${c.fp==='all'?' on':''}" data-cl="fp" data-v="all">All</button>${c.people.concat(c.people.includes('priya')?[]:['priya']).map(p=>`<button class="cl-pf${c.fp===p?' on':''}" data-cl="fp" data-v="${p}" style="--c:${col(p)}" aria-label="Only ${esc(nm(p))}">${av(p,26)}</button>`).join('')}</div>`;
 let body='';
 if(c.tab==='comments'){
  body=`<div class="cl-new${c.sel?' open':''}">${av(me(),28)}<div class="cl-nb">${c.sel?`<div class="cl-q">“${esc(c.sel.q.slice(0,140))}”</div>`:''}<textarea id="cl-txt" rows="1" placeholder="Add a comment…"></textarea><div class="cl-nr"><label class="cl-on">on <select id="cl-sec">${Object.keys(SECN).map(s=>`<option value="${s}"${c.sel&&c.sel.s===s?' selected':''}>${SECN[s]}</option>`).join('')}</select></label><span class="grow"></span><button class="btn pri sm" data-cl="add">Post</button></div></div></div>`+
  view.map(x=>`<div class="cl-th${x.res?' res':''}${c.hot===x.id?' hot':''}" data-cl="jump" data-s="${x.s}" data-id="${x.id}" style="--c:${col(x.by)}"><div class="cl-hd">${av(x.by,24)}<b>${esc(nm(x.by))}</b><span class="faint">${x.w}</span><span class="grow"></span><span class="cl-sec">${SECN[x.s]}</span></div>${x.q?`<div class="cl-q">“${esc(x.q)}”</div>`:''}<div class="cl-x">${fmt(x.x)}</div>
  ${x.re.map(r=>`<div class="cl-re" style="--c:${col(r[0])}">${av(r[0],20)}<div><b>${esc(nm(r[0]))}</b> <span class="faint">${r[2]}</span><div class="cl-x">${fmt(r[1])}</div></div></div>`).join('')}
  ${x.res?`<div class="cl-done">${ic('check',13)} Resolved</div><button class="btn sm ghost" data-cl="reopen" data-id="${x.id}">Reopen</button>`:`<div class="cl-rep"><input class="in" placeholder="Reply" data-clr="${x.id}"><button class="btn sm" data-cl="resolve" data-id="${x.id}">${ic('check',13)} Resolve</button></div>`}</div>`).join('')||'<p class="faint" style="font-size:13px">No comments from this person yet.</p>';
 }else if(c.tab==='history'){
  const hv=c.fp==='all'?c.hist:c.hist.filter(x=>x.by===c.fp);
  body=`<div class="cl-ver"><b>Version ${c.ver}</b><span class="faint">${c.hist.length} edits by ${new Set(c.hist.map(x=>x.by)).size} people</span></div>`+hv.map((x,i)=>`<div class="cl-h" style="--c:${col(x.by)}">${av(x.by,24)}<div class="grow"><div><b>${esc(nm(x.by))}</b> <span class="faint">${esc(x.a.toLowerCase())} in</span> <button class="cl-sec" data-cl="jump" data-s="${x.s}">${SECN[x.s]}</button></div><div class="faint" style="font-size:11.5px">${x.w} · version ${c.ver-c.hist.indexOf(x)}</div>${x.del||x.ins?`<div class="cl-diff">${x.del?`<del>${esc(x.del)}</del>`:''}${x.ins?`<ins>${esc(x.ins)}</ins>`:''}</div>`:''}</div>${c.hist.indexOf(x)>0?`<button class="btn sm ghost" data-cl="restore" data-i="${c.hist.indexOf(x)}">Restore</button>`:''}</div>`).join('');
 }else{
  const cnt=p=>Object.values(c.own).filter(o=>o===p).length;
  body=`<p class="faint" style="font-size:12.5px;margin:0 0 10px">Each researcher has a colour. With authorship on, every section shows who last edited it.</p>`+c.people.concat(c.people.includes('priya')?[]:['priya']).map(p=>`<div class="cl-p" style="--c:${col(p)}">${av(p,30)}<div class="grow"><b>${esc(nm(p))}</b><div class="faint" style="font-size:12px">${esc(P[p].r)} · ${cnt(p)} section${cnt(p)===1?'':'s'} · ${c.th.filter(x=>x.by===p).length} comments</div></div>${p===t.owner?'<span class="pill gold">Owner</span>':p==='priya'?'<span class="pill">Approver</span>':'<span class="pill">Editor</span>'}</div>`).join('')+`<button class="btn sm" data-cl="invite" style="margin-top:10px">${ic('users',13)} Invite a researcher</button>`}
 return `<aside class="cl-rail"><div class="cl-pres"><div class="cl-avs">${c.people.slice(0,4).map(p=>av(p,26)).join('')}</div><span class="faint" style="font-size:12px"><i class="cl-live"></i>${first(c.people[1]||'sara')} is editing ${SECN.find}</span><span class="grow"></span><label class="cl-sw"><input type="checkbox" data-cl="auth"${c.show?' checked':''}> Authorship</label></div>${tabs}${filt}<div class="cl-body">${body}</div></aside>`}
const fmt=s=>esc(s).replace(/@(\w+)/g,'<b class="cl-at">@$1</b>');

/* ---------- decorate the case document ---------- */
function decorate(t){const doc=$('#caseDoc');if(!doc)return;const c=collab(t);
 doc.classList.toggle('cl-show',c.show);
 doc.querySelectorAll('.csec').forEach(sec=>{const s=sec.id.slice(3),o=c.own[s];if(!o)return;sec.style.setProperty('--cl',col(o));
  let tag=sec.querySelector(':scope > .cl-tag');if(!tag){tag=document.createElement('div');tag.className='cl-tag';sec.prepend(tag)}
  const h=c.hist.find(x=>x.s===s),n=c.th.filter(x=>x.s===s&&!x.res).length;
  tag.innerHTML=`${av(o,18)}<span>${o===c.hist[0].by&&s===c.hist[0].s?'Edited':'Last edited'} by <b>${esc(first(o))}</b>${h?' · '+h.w:''}</span>${n?`<button class="cl-cc" data-cl="sec" data-s="${s}">${ic('edit',12)} ${n}</button>`:''}`})}
function mount(){
 const dr=$('#drawer'),body=$('#dbody');if(!dr||!body)return;const t=byId(S.openId);if(!t)return;
 dr.classList.toggle('cl-wide',S.tab==='case'&&!!$('#caseDoc'));
 if(S.tab==='case'&&$('#caseDoc')){let wrap=body.querySelector('.cl-wrap');
  if(!wrap){const kids=[...body.childNodes];wrap=document.createElement('div');wrap.className='cl-wrap';const main=document.createElement('div');main.className='cl-main';kids.forEach(k=>main.appendChild(k));wrap.appendChild(main);wrap.insertAdjacentHTML('beforeend',railHTML(t));body.appendChild(wrap);decorate(t)}
  else if(!$('#caseDoc .cl-tag'))decorate(t)}
 if(S.tab==='evidence'&&!body.querySelector('.ev2'))body.innerHTML=evHTML(t);
 if(S.tab==='claims'&&!body.querySelector('.cm2')&&t.status!=='running')body.innerHTML=clHTML(t);
}
function rerail(){const t=byId(S.openId),r=$('#dbody .cl-rail');if(!t||!r)return;const sc=r.querySelector('.cl-body')?.scrollTop||0;r.outerHTML=railHTML(t);const n=$('#dbody .cl-rail .cl-body');if(n)n.scrollTop=sc;decorate(t)}
let busy=false;
new MutationObserver(()=>{if(busy)return;busy=true;try{mount()}finally{busy=false}}).observe(document.body,{childList:true,subtree:true});

/* ---------- Evidence tab ---------- */
const STRENGTH={Journal:['Primary','Peer-reviewed study. Strongest evidence for technical claims.','ok'],Standard:['Primary','Official standard. Authoritative for test and compliance requirements.','ok'],Internal:['Primary','Our own lab data. Strong, but not independently reviewed.','ok'],Patent:['Supporting','Legal document. Shows what a company claims and owns, not what was proven in a lab.','gold'],'Industry report':['Supporting','Market analysis. Good for cost and supply, check the method.','gold'],Web:['Context','News or trade press. Useful for trends, confirm figures with a primary source.','warn'],Note:['Context','Expert opinion. Valuable judgement, not measured data.','warn']};
function evHTML(t){const a=V.getAns(t),k=V.akey(t),cs=W.claimsOf(k),ids=[...new Set([...V.citesIn(a.html),...t.src])].filter(n=>SRC[n]);
 const use=n=>Object.keys(a.cl).filter(c=>a.cl[c].s.includes(n));
 const grp={Primary:[],Supporting:[],Context:[]};ids.forEach(n=>grp[(STRENGTH[SRC[n].ty]||STRENGTH.Note)[0]].push(n));
 const avg=Math.round(ids.reduce((s,n)=>s+SRC[n].rel,0)/(ids.length||1)),types=[...new Set(ids.map(n=>SRC[n].ty))];
 const card=n=>{const s=SRC[n],st=STRENGTH[s.ty]||STRENGTH.Note,u=use(n);return `<div class="ev-card"><div class="ev-top">${window.lg(n)}<div class="grow"><b class="ev-t">${esc(s.t)}</b><div class="faint" style="font-size:12.5px">${s.ty} · ${esc(s.v)} · ${s.y}</div></div><div class="ev-rel"><span>${s.rel}%</span><small>relevance</small></div></div>
  <div class="ev-why"><span class="pill ${st[2]}">${st[0]} evidence</span></div>
  <div class="ev-lbl">Exact passage the models used</div><div class="quote">${W.hl(s.p)}</div>
  <div class="ev-lbl">Supports ${u.length} claim${u.length===1?'':'s'} in the answer</div>${u.length?u.map(c=>`<button class="ev-claim" data-act="claim" data-k="${k}:${c}">${W.gp(W.gradeOf(k,c))}<span>${esc(String(cs[c]).replace(/<[^>]+>/g,'').slice(0,120))}</span>${ic('chev',13)}</button>`).join(''):'<div class="faint" style="font-size:12.5px">Background reading. Not cited for a specific claim.</div>'}
  <div style="display:flex;gap:8px;margin-top:10px"><button class="btn sm" data-act="cite" data-n="${n}">Open source</button><button class="btn sm ghost" data-act="copyCite" data-n="${n}">${ic('copy',13)} Copy citation</button></div></div>`};
 return `<div class="stack ev2" style="gap:16px">
 <div class="xp-stats"><div><b>${ids.length}</b><span>sources</span></div><div><b>${grp.Primary.length}</b><span>primary</span></div><div><b>${avg}%</b><span>avg relevance</span></div><div><b>${types.length}</b><span>source types</span></div></div>
 ${Object.keys(grp).filter(g=>grp[g].length).map(g=>`<div><div class="ev-gh"><b>${g} evidence</b></div><div class="stack" style="gap:10px">${grp[g].map(card).join('')}</div></div>`).join('')}</div>`}

/* ---------- Claims tab ---------- */
const GD={v:['Verified','Both models found the statement in at least one strong source and the sources agree.','Ready to use in the business case.','ok'],d:['Disputed','Sources disagree, or the two models read them differently.','Resolve before the gate: pick a source or get new data.','warn'],u:['Unverified','No primary source yet. The figure comes from a single or weak source.','Find a primary source, or remove it from the recommendation.','bad']};
function clHTML(t){const a=V.getAns(t),k=V.akey(t),cs=W.claimsOf(k),keys=Object.keys(cs),g=c=>W.gradeOf(k,c),n={v:0,d:0,u:0};keys.forEach(c=>n[g(c)]++);
 return `<div class="stack cm2" style="gap:16px">
 <div class="cm-bar">${['v','d','u'].map(x=>n[x]?`<i class="${GD[x][3]}" style="flex:${n[x]}"></i>`:'').join('')}</div>
 <div class="cm-leg">${['v','d','u'].map(x=>`<div class="cm-l"><span class="pill ${GD[x][3]}">${n[x]} ${GD[x][0]}</span></div>`).join('')}</div>
 ${keys.map((c,i)=>{const m=a.cl[c],gr=g(c),G=GD[gr];return `<div class="cm-card ${G[3]}"><div class="cm-h"><span class="cm-n">Claim ${i+1}</span>${W.gp(gr)}<span class="grow"></span><span class="faint" style="font-size:12px">${m.s.length} source${m.s.length>1?'s':''}</span></div>
  <div class="cm-s">“${cs[c]}”</div>
  <div class="cm-grid"><div><div class="ev-lbl">Why this grade</div><p>${esc(m.n)}</p></div><div><div class="ev-lbl">What to do</div><p>${G[2]}</p></div></div>
  <div class="ev-lbl">Evidence for this claim</div>${m.s.map(sn=>{const s=SRC[sn];return `<button class="cm-src" data-act="cite" data-n="${sn}">${window.lg(sn)}<span class="grow"><b>${esc(s.t)}</b><small>${s.ty} · ${esc(s.v)} · ${s.y} · ${(STRENGTH[s.ty]||STRENGTH.Note)[0].toLowerCase()} evidence</small><em>${esc(s.p.replace(/[«»]/g,'').slice(0,150))}…</em></span>${ic('chev',13)}</button>`}).join('')}
  <div class="cm-act"><span class="faint" style="font-size:12px">Your review</span>${['v','d','u'].map(x=>`<button class="fchip${gr===x?' on':''}" data-act="setGrade" data-k="${k}:${c}" data-g="${x}">${GD[x][0]}</button>`).join('')}<span class="grow"></span><button class="btn sm ghost" data-act="claim" data-k="${k}:${c}">Compare sources ${ic('chev',12)}</button></div></div>`}).join('')}</div>`}

/* ---------- events ---------- */
document.addEventListener('click',ev=>{const el=ev.target.closest('[data-cl]');if(!el)return;const t=byId(S.openId);if(!t)return;const c=collab(t),d=el.dataset,a=d.cl;
 if(a==='auth')return;
 ev.stopPropagation();
 if(a==='tab'){c.tab=d.v;rerail()}
 else if(a==='fp'){c.fp=d.v;rerail()}
 else if(a==='jump'||a==='sec'){if(ev.target.closest('input,button:not([data-cl])'))return;const s=$('#cs-'+d.s);if(s){s.scrollIntoView({behavior:'smooth',block:'start'});s.classList.add('cl-flash');setTimeout(()=>s.classList.remove('cl-flash'),1400)}if(d.id){c.hot=d.id}if(a==='sec'){c.tab='comments';c.fp='all';rerail()}}
 else if(a==='add'){const x=$('#cl-txt').value.trim();if(!x){toast('Write a comment first');return}const s=$('#cl-sec').value;c.th.unshift({id:'c'+Date.now(),s,by:me(),q:c.sel&&c.sel.s===s?c.sel.q:'',x,w:'Just now',re:[]});c.sel=null;c.tab='comments';rerail();const m=x.match(/@(\w+)/);toast(m?'Comment added. '+m[1]+' will be notified':'Comment added','ok')}
 else if(a==='resolve'){const x=c.th.find(y=>y.id===d.id);x.res=true;c.hist.unshift({by:me(),s:x.s,w:'Just now',a:'Resolved a comment'});c.ver++;rerail();toast('Comment resolved','ok')}
 else if(a==='reopen'){c.th.find(y=>y.id===d.id).res=false;rerail()}
 else if(a==='restore'){const h=c.hist[+d.i];c.hist.unshift({by:me(),s:h.s,w:'Just now',a:'Restored version '+(c.ver-(+d.i)),ins:h.del||'',del:h.ins||''});c.ver++;rerail();toast('Restored. The change is saved as a new version so nothing is lost','ok')}
 else if(a==='invite')toast('Invite sent. They can comment once they accept','ok');
});
document.addEventListener('change',ev=>{const el=ev.target;if(el.dataset.cl==='auth'){const t=byId(S.openId);collab(t).show=el.checked;decorate(t)}});
document.addEventListener('keydown',ev=>{const el=ev.target;if(ev.key==='Enter'&&el.dataset&&el.dataset.clr){ev.preventDefault();const t=byId(S.openId),c=collab(t),x=c.th.find(y=>y.id===el.dataset.clr),v=el.value.trim();if(!v)return;x.re.push([me(),v,'Just now']);rerail();toast('Reply added','ok')}},true);
// select text in the case to comment on it
document.addEventListener('mouseup',ev=>{if(!ev.target.closest||!ev.target.closest('#caseDoc'))return;setTimeout(()=>{const s=getSelection(),q=String(s).trim();const old=$('#cl-pop');old&&old.remove();if(q.length<8||!s.rangeCount)return;const sec=(s.anchorNode.parentElement||s.anchorNode).closest('.csec');if(!sec)return;const r=s.getRangeAt(0).getBoundingClientRect(),b=document.createElement('button');b.id='cl-pop';b.className='btn pri sm';b.innerHTML=ic('edit',13)+' Comment';b.style.cssText=`position:fixed;z-index:120;left:${Math.min(r.left+r.width/2-50,innerWidth-120)}px;top:${Math.max(8,r.top-40)}px`;
 b.onmousedown=e=>e.preventDefault();b.onclick=()=>{const t=byId(S.openId),c=collab(t);c.sel={s:sec.id.slice(3),q};c.tab='comments';b.remove();rerail();const ta=$('#cl-txt');ta&&ta.focus()};document.body.appendChild(b)},10)});
document.addEventListener('mousedown',ev=>{if(ev.target.id!=='cl-pop'){const o=$('#cl-pop');o&&!ev.target.closest('#caseDoc')&&o.remove()}});
// hover any heading or paragraph in the case: a + button in the margin starts a comment on it
let plus=null,pTarget=null;
// the smallest readable block under the pointer: a paragraph, list row, heading, table row or a short text box
const wordy=e=>((e.textContent||'').match(/[A-Za-z]/g)||[]).length>=12;
function blockOf(t){if(!t||!t.closest||!t.closest('#caseDoc')||t.closest('.cl-tag,.cl-by'))return null;if(t.nodeType===1&&!wordy(t)&&t.closest('.faint,small'))return null;let e=t.nodeType===1?t:t.parentElement;
 while(e&&e.id!=='caseDoc'&&!e.classList.contains('csec')){const tx=(e.textContent||'').trim(),cs=getComputedStyle(e);
  if(tx.length>=6&&tx.length<=900&&!/^inline/.test(cs.display)&&e.offsetHeight<260)return e;e=e.parentElement}return null}
const editable=e=>!e.querySelector('div,table,ul,ol,svg,section');
let penT=null;document.addEventListener('click',ev=>{if(ev.target.closest&&ev.target.closest('.cl-editing')){ev.stopPropagation();ev.preventDefault()}},true);function penBlock(t){if(!t||!t.closest||!t.closest('#caseDoc')||t.closest('.cl-tag,.cl-by'))return null;if(t.closest('.faint,small')&&!wordy(t))return null;let e=t.nodeType===1?t:t.parentElement;while(e&&e.id!=='caseDoc'&&!e.classList.contains('csec')){const tx=(e.textContent||'').trim();if(tx.length>=6&&tx.length<=900&&getComputedStyle(e).display!=='inline'&&editable(e))return e;if(!editable(e))return null;e=e.parentElement}return null}
function plusBtn(){if(plus&&document.body.contains(plus))return plus;plus=document.createElement('button');plus.className='cl-plus';plus.setAttribute('aria-label','Comment on this paragraph');plus.innerHTML=ic('plus',15);
 plus.onmousedown=e=>e.preventDefault();
 plus.onclick=()=>{if(!pTarget)return;const sec=pTarget.closest('.csec'),t=byId(S.openId);if(!sec||!t)return;const c=collab(t);c.sel={s:sec.id.slice(3),q:pTarget.textContent.trim().replace(/\s+/g,' ')};c.tab='comments';c.fp='all';rerail();plus.style.display='none';const ta=$('#cl-txt');ta&&ta.focus()};
 document.body.appendChild(plus);return plus}
let hideT=0;const hideBtns=()=>{clearTimeout(hideT);hideT=setTimeout(()=>{if(plus)plus.style.display='none';if(pen)pen.style.display='none'},700)};
document.addEventListener('mouseover',ev=>{if(ev.target.closest&&ev.target.closest('.cl-plus')){clearTimeout(hideT);return}const doc=ev.target.closest&&ev.target.closest('#caseDoc');if(!doc){hideBtns();return}clearTimeout(hideT);
 const drr=doc.getBoundingClientRect();if(plus&&plus.style.display==='grid'&&ev.clientX>drr.right-160)return;const blk=blockOf(ev.target);if(!blk)return;pTarget=blk;
 const b=plusBtn(),r=blk.getBoundingClientRect(),dr=doc.getBoundingClientRect();b.style.display='grid';b.style.top=(r.top+Math.min(r.height/2,14)-14)+'px';b.style.left=(dr.right+6)+'px';
 document.querySelectorAll('#caseDoc .cl-hover').forEach(x=>x.classList.remove('cl-hover'));blk.classList.add('cl-hover')});
document.addEventListener('scroll',()=>{if(plus)plus.style.display='none'},true);
// edit a paragraph in place: changes show as tracked insertions and deletions in the editor's colour, and land in Edit history
let pen=null;
function penBtn(){if(pen&&document.body.contains(pen))return pen;pen=document.createElement('button');pen.className='cl-plus cl-pen';pen.setAttribute('aria-label','Edit this paragraph');pen.innerHTML=ic('edit',14);
 pen.onmousedown=e=>e.preventDefault();pen.onclick=()=>{const t=penT||pTarget;if(t)startEdit(t)};document.body.appendChild(pen);return pen}
document.addEventListener('mouseover',ev=>{if(ev.target.closest&&ev.target.closest('.cl-plus'))return;if(ev.target.closest&&ev.target.closest('.cl-plus'))return;{const cd=document.getElementById('caseDoc');if(cd&&pen&&pen.style.display==='grid'&&ev.clientX>cd.getBoundingClientRect().right-160)return}let ok=penBlock(ev.target);if(!ok&&ev.target.closest&&ev.target.closest('#caseDoc')){const y=ev.clientY;ok=[...ev.target.querySelectorAll('*')].find(c=>{const r=c.getBoundingClientRect();return y>=r.top&&y<=r.bottom&&(c.textContent||'').trim().length>=6&&getComputedStyle(c).display!=='inline'&&editable(c)})||null;if(!ok){const tn=[...ev.target.childNodes].filter(n=>n.nodeType===3&&n.nodeValue.trim().length>=6).sort((x,z)=>z.nodeValue.length-x.nodeValue.length)[0];if(tn){const sp=document.createElement('span');sp.className='cl-line';tn.parentNode.insertBefore(sp,tn);sp.appendChild(tn);ok=sp}}}else if(ev.target.classList&&ev.target.classList.contains('cl-line'))ok=ev.target;const b=penBtn();penT=ok;
 if(!ok||ok.isContentEditable){if(ok&&ok.isContentEditable)b.style.display='none';return}
 const r=ok.getBoundingClientRect(),dr=$('#caseDoc').getBoundingClientRect();b.style.display='grid';b.style.top=(r.top+Math.min(r.height/2,14)-14)+'px';b.style.left=(dr.right+6)+'px';b.style.top=((plus&&plus.style.display!=='none'?parseFloat(plus.style.top):parseFloat(b.style.top))+34)+'px'});
document.addEventListener('scroll',()=>{if(pen)pen.style.display='none'},true);
document.addEventListener('mouseout',ev=>{if(ev.target.closest&&ev.target.closest('.cl-plus')&&!(ev.relatedTarget&&ev.relatedTarget.closest&&ev.relatedTarget.closest('.cl-plus,#caseDoc')))hideBtns()});
const words=s=>s.split(/(\s+)/).filter(x=>x!=='');
function diff(a,b){const A=words(a),B=words(b),n=A.length,m=B.length,L=Array.from({length:n+1},()=>new Int16Array(m+1));
 for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)L[i][j]=A[i]===B[j]?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);
 const out=[];let i=0,j=0;const push=(t,v)=>{const l=out[out.length-1];if(l&&l[0]===t)l[1]+=v;else out.push([t,v])};
 while(i<n&&j<m){if(A[i]===B[j]){push('=',A[i]);i++;j++}else if(L[i+1][j]>=L[i][j+1]){push('-',A[i]);i++}else{push('+',B[j]);j++}}
 while(i<n)push('-',A[i++]);while(j<m)push('+',B[j++]);return out}
function startEdit(el){const t=byId(S.openId);if(!t)return;if(el.dataset.orig==null&&el.querySelector('div,button,span.cite,table,ul,ol')){const tn=[...el.childNodes].filter(n=>n.nodeType===3&&n.nodeValue.trim().length>=6).sort((x,z)=>z.nodeValue.length-x.nodeValue.length)[0];if(tn){const sp=document.createElement('span');sp.className='cl-line';tn.parentNode.insertBefore(sp,tn);sp.appendChild(tn);el=sp}else{const inner=[...el.querySelectorAll('p,span,b')].find(c=>(c.textContent||'').trim().length>=12&&!c.querySelector('div,button'));if(inner)el=inner;else return}}const sec=el.closest('.csec');if(!sec)return;
 const before=(el.dataset.orig!=null?el.dataset.cur:el.textContent).trim();if(el.dataset.orig==null)el.dataset.orig=before;
 el.textContent=before;el.contentEditable='true';el.classList.add('cl-editing');el.focus();
 const sl=getSelection();let rg=null;if(window.__clPt&&document.caretRangeFromPoint){rg=document.caretRangeFromPoint(window.__clPt[0],window.__clPt[1]);if(rg&&!el.contains(rg.startContainer))rg=null}window.__clPt=null;if(!rg){rg=document.createRange();rg.selectNodeContents(el);rg.collapse(false)}sl.removeAllRanges();sl.addRange(rg);
 if(pen)pen.style.display='none';if(plus)plus.style.display='none';
 const done=keep=>{el.removeEventListener('blur',onBlur);el.removeEventListener('keydown',onKey);el.contentEditable='false';el.classList.remove('cl-editing');
  const after=keep?el.textContent.trim().replace(/\s+/g,' '):before;
  if(after===before){render(el);return}
  const who=me(),c=collab(t),d=diff(before,after),del=d.filter(x=>x[0]==='-').map(x=>x[1].trim()).join(' … '),ins=d.filter(x=>x[0]==='+').map(x=>x[1].trim()).join(' … ');
  el.dataset.cur=after;el.dataset.by=who;el.dataset.when='Just now';
  const s=sec.id.slice(3);c.own[s]=who;c.hist.unshift({by:who,s,w:'Just now',a:'Edited '+(SECN[s]||'text').toLowerCase(),del:del.slice(0,160),ins:ins.slice(0,160)});c.ver++;
  render(el);const tag=sec.querySelector(':scope > .cl-tag');tag&&tag.remove();decorate(t);rerail();toast('Saved. Version '+c.ver+' is in History','ok')};
 const onBlur=()=>done(true),onKey=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();el.blur()}if(e.key==='Escape'){e.preventDefault();e.stopPropagation();done(false)}};
 el.addEventListener('blur',onBlur);el.addEventListener('keydown',onKey)}
function render(el){if(el.dataset.orig==null||el.dataset.cur==null){if(el.dataset.orig!=null&&el.dataset.cur==null)el.textContent=el.dataset.orig;return}
 const by=el.dataset.by,d=diff(el.dataset.orig,el.dataset.cur);el.style.setProperty('--ec',col(by));
 el.innerHTML=d.filter(x=>x[0]!=='-').map(([k,v])=>k==='='?esc(v):`<ins class="cl-ins" data-tip="Changed by ${esc(nm(by))} · ${el.dataset.when}">${esc(v)}</ins>`).join('');el.classList.add('cl-changed');el.dataset.tip=`Edited by ${nm(by)} · ${el.dataset.when}. Open History to see what changed.`}
// double-click any text in the research case to edit it in place, like a document
document.addEventListener('dblclick',ev=>{const doc=ev.target.closest&&ev.target.closest('#caseDoc');if(!doc||ev.target.closest('.cl-editing,.cl-tag,input,select,textarea'))return;
 let el=penBlock(ev.target)||blockOf(ev.target);if(!el)return;ev.preventDefault();window.__clPt=[ev.clientX,ev.clientY];startEdit(el)});
// History button at the top right of the case
function histBtn(){const bar=document.querySelector('#dbody .cl-main > .stack > div:first-child');if(!bar||bar.querySelector('.cl-hb'))return;
 bar.insertAdjacentHTML('beforeend',`<span class="grow"></span><span class="cl-hint">Double-click any text to edit</span><button class="btn cl-hb" data-cl="hist">${ic('clock',15)} History</button>`)}
new MutationObserver(()=>{if(document.querySelector('#caseDoc'))histBtn()}).observe(document.body,{childList:true,subtree:true});
document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('[data-cl="hist"]');if(!b)return;ev.stopPropagation();const t=byId(S.openId);if(!t)return;const c=collab(t);c.tab='history';c.fp='all';rerail();const r=document.querySelector('#dbody .cl-rail');if(r){r.scrollIntoView({behavior:'smooth',block:'nearest'});r.classList.add('cl-flashr');setTimeout(()=>r.classList.remove('cl-flashr'),1200)}},true);

})();

/* ===== original approved design scripts ===== */
/* ===== polish layer: title case, keyboard access, tooltips ===== */
(function(){
'use strict';
const SEL='h1,h2,h3,h4,h5,.crumbs,.ph h1,.greet,.dh h2,.sh b,.mh b,.mbox .sh b,.brand b,.sl h1,.sl h2,.sl .kk,.sl .bt,.bt,.docp h1,.docp h4,.docp h5,.cardh,.hl h5,.pop h5,.nfg,.nft b,.stage,.tile .eyebrow,.kk,.nav-h,.rn+div b,.mcard h4,.t .ti b,.tcard h4,.dhead b,.hi b,.rsrc b,.sg b,.conn b';
/* Title case that reads like an editor wrote it: small words stay lower, acronyms and units stay as written, sentences are left alone. */
const SMALL=new Set('a an and as at but by for from in into nor of on or per than the to via vs with'.split(' '));
const WORD=/\p{L}[\p{L}\p{N}'’]*/gu;
function titleCase(el){
 if(el.isContentEditable||document.documentElement.dataset.skin==='classic')return;
 const full=el.textContent.trim();
 if(!full||/[.!]["”’)]?$/.test(full)||full.split(/\s+/).length>11)return;
 const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
 let first=true,gap='',n;
 while((n=w.nextNode())){
  const s=n.nodeValue;let out='',i=0,m;WORD.lastIndex=0;
  while((m=WORD.exec(s))){
   const sep=s.slice(i,m.index);gap+=sep;out+=sep;i=m.index+m[0].length;
   let t=m[0];
   const lower=t===t.toLowerCase(),brk=first||/[:—–?]\s*$/.test(gap),unit=/\d\s*$/.test(gap)&&t.length<=3;
   if(lower&&!unit&&t[0]!=='µ'&&!(SMALL.has(t)&&!brk))t=t[0].toUpperCase()+t.slice(1);
   out+=t;gap='';first=false;
  }
  const tail=s.slice(i);out+=tail;gap+=tail;
  if(out!==s)n.nodeValue=out;
 }
}
/* Cards, roadmap bars, tiles and the radar open things on click; make them reachable by keyboard too. */
const NATIVE='button,a,input,select,textarea,summary,tr,mark';
function enhance(root){
 const els=[...root.querySelectorAll('[data-act],.kpi,.tile,[data-tip]')];
 if(root.matches&&root.matches('[data-act],.kpi,.tile,[data-tip]'))els.push(root);
 els.forEach(el=>{
  if(el.id==='scrim'||el.closest('svg')&&el.tagName.toLowerCase()!=='g')return;
  const tip=el.dataset.tip;
  if(tip&&el.matches('button,a')&&!el.getAttribute('aria-label')&&!el.textContent.trim()){const d=document.createElement('div');d.innerHTML=tip;el.setAttribute('aria-label',d.textContent)}
  const opens=el.dataset.act||(el.matches('.kpi,.tile')&&!el.closest('.tcard,.mbox'));
  if(!opens||el.matches(NATIVE)||el.hasAttribute('tabindex'))return;
  el.tabIndex=0;el.setAttribute('role','button');el.dataset.kb='';
 });
}
function process(nodes){
 const heads=new Set(),roots=new Set();
 nodes.forEach(a=>{
  const e=a.nodeType===1?a:a.parentElement;if(!e)return;
  const c=e.closest(SEL);c&&heads.add(c);
  if(a.nodeType===1){a.querySelectorAll(SEL).forEach(x=>heads.add(x));roots.add(a)}
 });
 heads.forEach(titleCase);roots.forEach(enhance);
}
new MutationObserver(recs=>{
 const nodes=[];
 recs.forEach(r=>{if(r.type==='characterData')nodes.push(r.target);else r.addedNodes.forEach(a=>nodes.push(a))});
 process(nodes);
}).observe(document.body,{childList:true,subtree:true,characterData:true});
process([document.body]);
document.addEventListener('keydown',ev=>{
 const t=ev.target;
 if((ev.key==='Enter'||ev.key===' ')&&t.matches&&t.matches('[data-kb]')&&t===document.activeElement){ev.preventDefault();t.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}))}
});
/* skip link straight to the page content */
const main=document.getElementById('main');main.tabIndex=-1;
const sk=document.createElement('a');sk.className='skip';sk.href='#';sk.textContent='Skip to content';
sk.addEventListener('click',e=>{e.preventDefault();main.focus()});
document.body.prepend(sk);
/* tooltips: hide on click or tap so they never linger, and show for keyboard focus */
const tip=document.getElementById('tip');let tapT=0;
const hide=()=>{tip.style.opacity=0};
document.addEventListener('pointerdown',hide,true);
document.addEventListener('pointerup',e=>{if(e.pointerType!=='mouse'){clearTimeout(tapT);tapT=setTimeout(hide,1400)}},true);
document.addEventListener('focusin',e=>{
 const el=e.target.closest&&e.target.closest('[data-tip]');
 if(!el||!el.matches(':focus-visible'))return;
 tip.innerHTML=el.dataset.tip;tip.style.opacity=1;
 const r=el.getBoundingClientRect(),w=tip.offsetWidth,h=tip.offsetHeight;
 let x=r.left+r.width/2-w/2,y=r.top-h-8;if(y<6)y=r.bottom+8;
 tip.style.left=Math.max(8,Math.min(x,innerWidth-w-8))+'px';tip.style.top=y+'px';
});
document.addEventListener('focusout',hide);
})();
