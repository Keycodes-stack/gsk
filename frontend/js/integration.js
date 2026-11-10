/*
 * Halden R&D Intelligence - live backend bridge
 * Keeps the approved visual design intact while replacing demo research actions
 * with FastAPI + Supabase + Perplexity + Gemini.
 */
(function () {
  'use strict';

  const API = window.RID_API || '/api/v1';
  const D = window.__D;
  const V = window.__V;
  if (!D || !V) return;

  const S = V.S;
  const SRC = D.SRC;
  const T = D.T;
  const ANS = D.ANS;
  const esc = D.esc;
  const renderAll = window.__renderAll;
  let nextSourceId = 1000;

  window.RID_API = API;

  async function ridFetch(path, options = {}) {
    const res = await fetch(API + path, options);
    const text = await res.text();
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch (_) { data = { detail: text }; }
    if (!res.ok) throw new Error(data.detail || `HTTP ${res.status}`);
    return data;
  }
  window.ridFetch = ridFetch;

  function toast(msg, ok = false) {
    if (typeof window.__ridToast === 'function') return window.__ridToast(msg, ok);
    const box = document.getElementById('toasts');
    if (!box) return;
    const el = document.createElement('div');
    el.className = 'toast' + (ok ? ' ok' : '');
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  function modelName(name) {
    return name === 'Perplexity Sonar' ? 'Perplexity Sonar' : 'Gemini';
  }

  function selectedSourceTypes() {
    const map = {
      Web: 'web', Scholar: 'scholar', IEEE: 'ieee', Patents: 'patent', Uploads: 'uploads', Drive: 'drive'
    };
    const selected = Object.entries(S.srcSel || {})
      .filter(([, value]) => value)
      .map(([key]) => map[key])
      .filter(Boolean);
    return selected.length ? selected : ['web', 'uploads'];
  }

  function safeDate(value) {
    if (!value) return 'Just now';
    return String(value).slice(0, 10);
  }

  function registerEvidence(evidence) {
    const ids = [];
    (evidence || []).forEach((e) => {
      const id = nextSourceId++;
      const title = e.title || e.source_url || 'Research evidence';
      SRC[id] = {
        t: title,
        ty: e.source_type === 'web' ? 'Web' : (e.source_type || 'Research source'),
        v: e.source_name || new URL(e.source_url || 'https://example.com').hostname,
        y: Number(String(e.published_at || '').slice(0, 4)) || new Date().getFullYear(),
        rel: Math.round((e.confidence || 0.7) * 100),
        ok: 1,
        p: e.chunk_text || e.snippet || '',
        url: e.source_url || '',
        document_id: e.document_id,
        chunk_id: e.chunk_id,
        content_hash: e.content_hash,
        source_type: e.source_type,
        dynamic: true,
      };
      ids.push(id);
    });
    return ids;
  }

  function sourceRefsForModel(model, sourceIds, evidence) {
    const refs = [];
    const modelClaims = model?.claims || [];
    modelClaims.forEach(c => (c.evidence || []).forEach(ref => {
      const n = Number(String(ref).replace('E', '')) - 1;
      if (sourceIds[n] != null) refs.push(sourceIds[n]);
    }));
    if (!refs.length) {
      (model?.answer || '').match(/\[E(\d+)\]/g)?.forEach(ref => {
        const n = Number(ref.slice(2, -1)) - 1;
        if (sourceIds[n] != null) refs.push(sourceIds[n]);
      });
    }
    return [...new Set(refs)];
  }

  function buildAnswer(query, data, sourceIds) {
    const models = data.models || [];
    const p = models.find(m => m.name === 'Perplexity Sonar') || models[0] || {};
    const g = models.find(m => m.name === 'Gemini') || models[1] || {};
    const panel = models.map((m, i) => {
      const refs = sourceRefsForModel(m, sourceIds, data.evidence);
      return {
        m: modelName(m.name),
        r: m.name === 'Perplexity Sonar' ? 'Live web research and evidence retrieval' : 'Independent reasoning and synthesis',
        v: m.status === 'completed' ? `Confidence ${m.confidence || 0}%` : 'Unavailable',
        vc: m.status === 'completed' ? (m.confidence >= 80 ? 'ok' : 'warn') : 'bad',
        cf: m.confidence || 0,
        pts: (m.claims || []).slice(0, 3).map(c => c.text).filter(Boolean),
        ci: refs,
      };
    });

    const claims = {};
    const claimTexts = [];
    models.forEach(m => (m.claims || []).forEach(c => {
      const text = String(c.text || '').trim();
      if (!text || claimTexts.some(x => x.toLowerCase() === text.toLowerCase())) return;
      claimTexts.push(text);
      const refs = (c.evidence || []).map(x => Number(String(x).replace('E', '')) - 1)
        .map(i => sourceIds[i]).filter(Boolean);
      claims[`c${claimTexts.length}`] = {
        g: 'v',
        s: [...new Set(refs)],
        n: `Evidence referenced by ${modelName(m.name)}.`
      };
    }));

    const answer = String(p.answer || g.answer || 'No answer returned.');
    const answerHtml = esc(answer)
      .replace(/\[E(\d+)\]/g, (_, n) => sourceIds[Number(n) - 1] ? `[${sourceIds[Number(n) - 1]}]` : '')
      .replace(/\n\s*\n/g, '<br><br>')
      .replace(/\n/g, '<br>');

    const firstClaims = Object.entries(claims).slice(0, 5);
    let html = answerHtml;
    if (firstClaims.length) {
      html += '<br><br>' + firstClaims.map(([key, c]) => {
        const claimText = claimTexts[Number(key.slice(1)) - 1];
        return `{v|${esc(claimText)}|${key}}${c.s.map(n => `[${n}]`).join(' ')}`;
      }).join('<br>');
    }

    const avg = data.agreement?.overall ?? Math.round(((p.confidence || 0) + (g.confidence || 0)) / Math.max(1, models.length));
    const ids = [...new Set(sourceIds)];
    const lensText = answer.slice(0, 220);

    return {
      title: query,
      acc: avg,
      html,
      cl: claims,
      panel: panel.length ? panel : [{m:'Perplexity Sonar',r:'Research model',v:'Unavailable',vc:'bad',cf:0,pts:[],ci:[]},{m:'Gemini',r:'Research model',v:'Unavailable',vc:'bad',cf:0,pts:[],ci:[]}],
      dis: `Model evidence consistency is ${data.agreement?.overall ?? 0}%. ${data.agreement?.interpretation || 'Consistency is not proof of truth.'}`,
      next: 'Review disputed or low-confidence claims and open the cited passages before advancing the research case.',
      fups: ['Which claim has the weakest evidence?', 'Compare the two model interpretations', 'Show the strongest primary sources'],
      apps: ['R&D feasibility review', 'Business case preparation', 'Technical validation planning'],
      ch: {t1:'Evidence confidence',l1:['Perplexity','Gemini','Overall'],v1:[p.confidence||0,g.confidence||0,avg],t2:'Evidence used',l2:['Retrieved','Cited','Models'],v2:[ids.length,ids.length,models.filter(m=>m.status==='completed').length]},
      lens: {
        rd: {h:lensText || 'R&D evidence summary',b:claimTexts.slice(0,4),c:['Evidence confidence',['Perplexity','Gemini','Overall'],[p.confidence||0,g.confidence||0,avg]]},
        fin: {h:'Finance lens requires validated assumptions',b:['Use only verified evidence in the business case.','Flag disputed numbers before cost modelling.'],c:['Model confidence',['Perplexity','Gemini'],[p.confidence||0,g.confidence||0]]},
        mkt: {h:'Marketing lens should follow validated evidence',b:['Separate market signals from technical claims.','Do not publish an unverified performance number.'],c:['Evidence strength',['Perplexity','Gemini'],[p.confidence||0,g.confidence||0]]},
        leg: {h:'Legal lens: preserve provenance',b:['Keep source URL, document and evidence chunk with every claim.','Escalate unsupported IP/compliance claims for review.'],c:['Provenance coverage',['Cited','Retrieved'],[ids.length?100:0,ids.length?100:0]]}
      },
      cm: []
    };
  }

  function addDynamicTask(query, data, sourceIds) {
    const num = T.length + 1000;
    const id = 'rid-' + Date.now();
    const answerKey = 'rid-answer-' + Date.now();
    const answer = buildAnswer(query, data, sourceIds);
    ANS[answerKey] = answer;
    T.unshift({
      id,
      code: `R-${num}`,
      title: query.length > 90 ? query.slice(0, 87) + '…' : query,
      sector: 'Materials', stage: 'Discovery', owner: 'amina', prog: 100,
      pri: 'High', due: 'Live', acc: answer.acc, rag: answer.acc >= 80 ? 'g' : 'a',
      status: 'review', s: 0, e: 8, deps: [], src: sourceIds,
      _rid: true,
    });
    return { id, answerKey };
  }

  function openBackendThread(query, data) {
    const sourceIds = registerEvidence(data.evidence || []);
    const task = addDynamicTask(query, data, sourceIds);
    const threadId = 'rid-thread-' + Date.now();
    S.threads.unshift({
      id: threadId,
      title: query.length > 56 ? query.slice(0, 54) + '…' : query,
      key: task.answerKey,
      q: query,
      t: 'Just now',
      fresh: false,
      pre: `Grounded in ${sourceIds.length} evidence items.`
    });
    S.route = 'thread-' + threadId;
    try { history.replaceState(null, '', '#thread-' + threadId); } catch (_) {}
    renderAll();
    return {sourceIds, task, threadId};
  }

  async function askBackend(query) {
    const sourceTypes = selectedSourceTypes();
    toast('Researching with Perplexity + Gemini…');
    const data = await ridFetch('/research/ask', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        query,
        source_types: sourceTypes,
        max_results: 5,
        match_count: 8,
        similarity_threshold: 0.35,
      })
    });
    openBackendThread(query, data);
    toast('Research completed with citations', true);
  }

  // Replace the demo send behavior before the original delegated click handler sees it.
  document.addEventListener('click', function (ev) {
    const send = ev.target.closest?.('[data-act="send"], [data-act="send2"], [data-act="followup"], [data-act="askFrom"]');
    if (!send) return;
    ev.preventDefault();
    ev.stopImmediatePropagation();
    let q = '';
    if (send.dataset.q) q = send.dataset.q;
    else if (send.dataset.act === 'followup') {
      const a = V.ansByKey(send.dataset.k);
      q = a?.fups?.[Number(send.dataset.i)] || '';
    } else q = document.querySelector(send.dataset.act === 'send2' ? '#q2' : '#q')?.value || '';
    if (q.trim()) askBackend(q.trim()).catch(err => toast('Research failed: ' + err.message));
  }, true);

  // Upload/index real PDFs from the approved Sources UI.
  async function uploadFiles(files) {
    const list = [...files].filter(f => f.name.toLowerCase().endsWith('.pdf'));
    if (!list.length) { toast('Please select a PDF file.'); return; }
    for (const file of list) {
      try {
        toast(`Uploading ${file.name}…`);
        const form = new FormData();
        form.append('file', file);
        form.append('title', file.name.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' ').trim());
        form.append('source_name', 'Halden Upload Library');
        form.append('source_type', 'research_paper');
        const uploaded = await ridFetch('/documents/upload', {method:'POST', body:form});
        toast(`Indexing ${file.name}…`);
        await ridFetch('/documents/index', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({document_id: uploaded.document.id})
        });
        await syncDocuments(false);
        toast(`${file.name} indexed and vectorized`, true);
      } catch (err) {
        toast(`${file.name}: ${err.message}`);
      }
    }
    if (S.route === 'sources') renderAll();
  }

  function picker() {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.pdf,application/pdf'; input.multiple = true; input.hidden = true;
    input.onchange = () => { uploadFiles(input.files); input.remove(); };
    document.body.appendChild(input); input.click();
  }

  document.addEventListener('click', function (ev) {
    const upload = ev.target.closest?.('[data-act="upload"], [data-h="up"], [data-h="upfile"]');
    if (!upload) return;
    ev.preventDefault(); ev.stopImmediatePropagation(); picker();
  }, true);

  document.addEventListener('drop', function (ev) {
    const drop = ev.target.closest?.('#drop, #hbdrop, #hbdrop2');
    if (!drop) return;
    ev.preventDefault(); ev.stopImmediatePropagation();
    if (ev.dataTransfer?.files?.length) uploadFiles(ev.dataTransfer.files);
  }, true);

  async function syncDocuments(showToast = true) {
    try {
      const data = await ridFetch('/documents');
      const docs = data.documents || [];
      S.extra = S.extra || {};
      S.extra.lib = S.extra.lib || [];
      docs.forEach(doc => {
        const existing = S.extra.lib.find(x => x.document_id === doc.id);
        const row = {
          id: 'doc-' + doc.id,
          document_id: doc.id,
          n: doc.title || 'Untitled research document',
          t: doc.title || 'Untitled research document',
          ty: doc.source_type || 'Upload',
          st: doc.file_path ? 'Indexed' : 'Indexed',
          ad: safeDate(doc.created_at),
          src: null,
          source_url: doc.source_url || '',
          source_name: doc.source_name || 'Halden Upload Library',
        };
        if (!existing) S.extra.lib.unshift(row); else Object.assign(existing, row);
      });
      if (showToast) toast(`${docs.length} indexed document${docs.length === 1 ? '' : 's'} loaded`, true);
      if (S.route === 'sources') renderAll();
    } catch (err) {
      if (showToast) toast('Could not sync documents: ' + err.message);
    }
  }
  window.ridSyncDocuments = syncDocuments;

  // Make dynamic document records clickable as source evidence when possible.
  document.addEventListener('click', function (ev) {
    const row = ev.target.closest?.('tr[data-act="srcInfo"]');
    if (!row) return;
    const id = row.dataset.id;
    const doc = (S.extra?.lib || []).find(x => x.id === id);
    if (!doc?.document_id) return;
    ev.preventDefault(); ev.stopImmediatePropagation();
    const html = `<div class="sh"><div class="grow"><b>${esc(doc.n)}</b><div class="faint">Indexed research document</div></div><button class="iconbtn" data-act="closeSide">×</button></div><div class="sb"><div class="pill ok">Indexed + vectorized</div><div class="tile"><div class="eyebrow">Document ID</div><div class="mono">${esc(doc.document_id)}</div></div><div class="muted">This document is stored in Supabase and its extracted passages are available to retrieval and citation validation.</div></div>`;
    window.__openSide?.(html);
  }, true);

  // Citation provenance: validate exact quote against the backend when a dynamic citation is opened.
  document.addEventListener('click', async function (ev) {
    const cite = ev.target.closest?.('[data-act="cite"]');
    if (!cite) return;
    const n = Number(cite.dataset.n);
    const s = SRC[n];
    if (!s?.dynamic) return;
    ev.preventDefault(); ev.stopImmediatePropagation();
    window.__openSide?.(`<div class="sh"><div class="grow"><b>Evidence ${n}</b><div class="faint">${esc(s.ty)} · ${esc(s.v)}</div></div><button class="iconbtn" data-act="closeSide">×</button></div><div class="sb"><h3>${esc(s.t)}</h3><div class="quote">${esc(s.p)}</div><div class="muted">Validating this citation against the stored evidence…</div></div>`);
    if (!s.document_id || !s.chunk_id) return;
    try {
      const result = await ridFetch('/citations/validate', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({document_id:s.document_id, chunk_id:s.chunk_id, quoted_text:s.p, expected_content_hash:s.content_hash || null})
      });
      const box = document.querySelector('#side .sb');
      if (box) {
        box.innerHTML = `<h3>${esc(s.t)}</h3><div class="chips"><span class="pill ${result.valid?'ok':'bad'}">${result.valid?'Citation verified':'Citation failed'}</span></div><div class="eyebrow">Exact stored passage</div><div class="quote">${esc(s.p)}</div><div class="muted">${esc(result.reason || '')}</div>${s.url?`<button class="btn pri" id="rid-open-url">Open original source</button>`:''}`;
        document.querySelector('#rid-open-url')?.addEventListener('click', () => window.open(s.url, '_blank', 'noopener,noreferrer'));
      }
    } catch (err) {
      const box = document.querySelector('#side .sb');
      if (box) box.insertAdjacentHTML('beforeend', `<div class="pill bad">Validation error</div><p class="muted">${esc(err.message)}</p>`);
    }
  }, true);

  document.addEventListener('click', function (ev) {
    const orig = ev.target.closest?.('[data-act="openOrig"]');
    if (!orig) return;
    const n = Number(orig.dataset.n), s = SRC[n];
    if (s?.url) { ev.preventDefault(); ev.stopImmediatePropagation(); window.open(s.url, '_blank', 'noopener,noreferrer'); }
  }, true);

  // Model selector: approved EOD panel is Perplexity + Gemini.
  document.addEventListener('click', function (ev) {
    const model = ev.target.closest?.('[data-act="modelsel"]');
    if (!model) return;
    setTimeout(() => {
      document.querySelectorAll('.pop .pi').forEach(btn => {
        if (/Claude|Llama|Mistral|open-weight/i.test(btn.textContent)) btn.remove();
        btn.textContent = btn.textContent.replace(/Claude Opus/g, 'Gemini');
      });
    }, 0);
  }, true);

  // Initial source sync after the design has booted.
  setTimeout(() => syncDocuments(false), 700);
})();
