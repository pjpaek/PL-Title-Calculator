const BASE = { ars: 70, mci: 61 };

const ROWS = [
  { date: '11 Apr', ars: { home: true,  opp: 'Bournemouth'   }, mci: null,                           linked: false },
  { date: '12 Apr', ars: null,                                   mci: { home: false, opp: 'Chelsea'  }, linked: false },
  { date: '19 Apr', ars: { home: false, opp: 'Man City'      }, mci: { home: true,  opp: 'Arsenal'  }, linked: true  },
  { date: '25 Apr', ars: { home: true,  opp: 'Newcastle'     }, mci: null,                           linked: false },
  { date: '26 Apr', ars: null,                                   mci: { home: false, opp: 'Burnley'  }, linked: false },
  { date: '2 May',  ars: { home: true,  opp: 'Fulham'        }, mci: null,                           linked: false },
  { date: '4 May',  ars: null,                                   mci: { home: false, opp: 'Everton'  }, linked: false },
  { date: '9 May',  ars: { home: false, opp: 'West Ham'      }, mci: { home: true,  opp: 'Brentford' }, linked: false },
  { date: '17 May', ars: { home: true,  opp: 'Burnley'       }, mci: { home: false, opp: 'Bournemouth' }, linked: false },
  { date: '24 May', ars: { home: false, opp: 'Crystal Palace' }, mci: { home: true,  opp: 'Aston Villa' }, linked: false },
  { date: 'TBC',    ars: null,                                   mci: { home: true,  opp: 'Crystal Palace' }, linked: false },
];

const state = ROWS.map(() => ({ ars: null, mci: null }));

function pts(r) {
  return r === 'W' ? 3 : r === 'D' ? 1 : 0;
}

function calcPts(team) {
  return BASE[team] + state.reduce((s, st) => s + pts(st[team]), 0);
}

function maxPts(team) {
  return BASE[team] + state.reduce((s, st, i) => {
    const g = ROWS[i][team];
    return g ? s + (st[team] === null ? 3 : pts(st[team])) : s;
  }, 0);
}

function pick(rowIdx, team, result) {
  const newVal = state[rowIdx][team] === result ? null : result;
  state[rowIdx][team] = newVal;
  if (ROWS[rowIdx].linked) {
    const other = team === 'ars' ? 'mci' : 'ars';
    state[rowIdx][other] = newVal === null ? null : newVal === 'W' ? 'L' : newVal === 'L' ? 'W' : 'D';
  }
  render();
}

function resetAll() {
  state.forEach(s => { s.ars = null; s.mci = null; });
  render();
}

function makeButtons(rowIdx, team, r) {
  return `<div class="rbtn-group">
    <button class="rbtn ${r === 'W' ? 'sel-w' : ''}" onclick="pick(${rowIdx},'${team}','W')">W</button>
    <button class="rbtn ${r === 'D' ? 'sel-d' : ''}" onclick="pick(${rowIdx},'${team}','D')">D</button>
    <button class="rbtn ${r === 'L' ? 'sel-l' : ''}" onclick="pick(${rowIdx},'${team}','L')">L</button>
  </div>`;
}

function render() {
  const grid = document.getElementById('fixture-grid');
  while (grid.children.length > 2) grid.removeChild(grid.lastChild);

  ROWS.forEach((row, i) => {
    const st = state[i];
    const linked = row.linked;

    const arsCell = document.createElement('div');
    arsCell.className = 'row-ars';
    if (linked) arsCell.style.background = '#f9f9f9';
    if (row.ars) {
      const vs = row.ars.home ? 'vs' : '@';
      const opp = row.ars.home ? `<strong>${row.ars.opp}</strong>` : row.ars.opp;
      arsCell.innerHTML = `${makeButtons(i, 'ars', st.ars)}<div class="fixture-text"><span class="date-text">${row.date} </span>${vs} ${opp}</div>`;
    } else {
      arsCell.innerHTML = `<span class="spacer-text">&mdash;</span>`;
    }

    const mciCell = document.createElement('div');
    mciCell.className = 'row-mci';
    if (linked) mciCell.style.background = '#f9f9f9';
    if (row.mci) {
      const vs = row.mci.home ? 'vs' : '@';
      const opp = row.mci.home ? `<strong>${row.mci.opp}</strong>` : row.mci.opp;
      mciCell.innerHTML = `<div class="fixture-text right"><span class="date-text">${row.date} </span>${vs} ${opp}</div>${makeButtons(i, 'mci', st.mci)}`;
    } else {
      mciCell.innerHTML = `<span class="spacer-text" style="margin-left:auto">&mdash;</span>`;
    }

    grid.appendChild(arsCell);
    grid.appendChild(mciCell);
  });

  const a = calcPts('ars'), m = calcPts('mci');
  document.getElementById('ars-pts').textContent = a;
  document.getElementById('mci-pts').textContent = m;
  document.getElementById('ars-max').textContent = 'Max: ' + maxPts('ars') + ' pts';
  document.getElementById('mci-max').textContent = 'Max: ' + maxPts('mci') + ' pts';
  const gap = a - m;
  document.getElementById('gap-val').textContent = (gap >= 0 ? '+' : '') + gap;
  document.getElementById('gap-dir').textContent = gap > 0 ? 'Arsenal lead' : gap < 0 ? 'Man City lead' : 'Level';
}

render();
