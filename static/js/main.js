// ===================================================
// SentimentAI — Frontend JS (v2)
// ===================================================

let statsChart = null;
let lastSingleResult = null;
let lastBulkResults = null;

// ---------- TOAST NOTIFICATION SYSTEM ----------
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };

  toast.innerHTML = `<span style="font-size:1.1rem;font-weight:700">${icons[type] || icons.info}</span><span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3000);
}

// ---------- TAB NAVIGATION ----------
function showTab(name) {
  // Remove active from all sections
  document.querySelectorAll('.tab-section').forEach(s => {
    s.classList.remove('active');
  });

  // Remove active from all buttons
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  // Activate the target section
  const section = document.getElementById('tab-' + name);
  if (section) {
    section.classList.add('active');
  }

  // Activate the matching button
  const btn = document.getElementById('tab-btn-' + name);
  if (btn) {
    btn.classList.add('active');
  }

  // Auto-load data for tabs
  if (name === 'history') loadHistory();
  if (name === 'stats') loadStats();
}

// ---------- CHAR COUNTER ----------
document.getElementById('single-input').addEventListener('input', function () {
  document.getElementById('char-count').textContent = this.value.length;
});

// ---------- EXAMPLE SETTER ----------
function setExample(text) {
  const input = document.getElementById('single-input');
  input.value = text;
  document.getElementById('char-count').textContent = text.length;
  input.focus();
}

// ---------- CLEAR INPUT ----------
function clearInput() {
  document.getElementById('single-input').value = '';
  document.getElementById('char-count').textContent = '0';
  hideResult();
  lastSingleResult = null;
}

// ---------- SINGLE ANALYSIS ----------
async function analyzeSingle() {
  const text = document.getElementById('single-input').value.trim();
  if (!text) {
    showToast('Please enter some text first.', 'error');
    return;
  }

  setLoading(true);
  hideResult();

  try {
    const res = await fetch('/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    if (data.error) {
      showToast(data.error, 'error');
      return;
    }

    lastSingleResult = data;
    showResult(data);
    showToast('Analysis complete!', 'success');
  } catch (e) {
    showToast('Server error. Make sure Flask is running.', 'error');
  } finally {
    setLoading(false);
  }
}

function setLoading(on) {
  document.getElementById('btn-text').textContent = on ? 'Analyzing...' : 'Analyze Sentiment';
  document.getElementById('btn-spinner').classList.toggle('hidden', !on);
  document.getElementById('analyze-btn').disabled = on;
}

function hideResult() {
  document.getElementById('single-result').classList.add('hidden');
}

function showResult(data) {
  const box = document.getElementById('single-result');
  box.classList.remove('hidden');

  // Emoji + Label
  document.getElementById('result-emoji').textContent = data.emoji;
  const label = document.getElementById('result-label');
  label.textContent = data.sentiment;
  label.className = 'result-label ' + data.sentiment;

  // Main confidence bar
  document.getElementById('result-score').textContent = data.score + '%';
  const bar = document.getElementById('bar-fill');
  bar.style.width = '0%';
  bar.className = 'bar-fill ' + data.sentiment;
  setTimeout(() => { bar.style.width = data.score + '%'; }, 50);

  // Text display
  const textDisplay = document.getElementById('result-text-display');
  textDisplay.textContent = '"' + truncate(data.text, 120) + '"';

  // Confidence Breakdown
  renderBreakdown(data.breakdown);

  // Emotion Section — reset toggle
  const emotionBars = document.getElementById('emotion-bars');
  emotionBars.classList.add('hidden');
  const toggleBtn = document.getElementById('toggle-emotions-btn');
  toggleBtn.classList.remove('active');
  document.getElementById('toggle-emotions-text').textContent = 'Show Emotions';

  // Render emotion bars (hidden by default)
  renderEmotions(data.emotions);
}

// ---------- CONFIDENCE BREAKDOWN ----------
function renderBreakdown(breakdown) {
  if (!breakdown) return;

  const container = document.getElementById('breakdown-bars');
  const items = [
    { label: 'Positive', value: breakdown.Positive, cssClass: 'positive-fill' },
    { label: 'Negative', value: breakdown.Negative, cssClass: 'negative-fill' },
    { label: 'Neutral',  value: breakdown.Neutral,  cssClass: 'neutral-fill' }
  ];

  container.innerHTML = items.map(item => `
    <div class="breakdown-bar-item">
      <span class="breakdown-label">${item.label}</span>
      <div class="breakdown-track">
        <div class="breakdown-fill ${item.cssClass}" data-width="${item.value}"></div>
      </div>
      <span class="breakdown-pct">${item.value.toFixed(1)}%</span>
    </div>
  `).join('');

  // Animate fills
  requestAnimationFrame(() => {
    setTimeout(() => {
      container.querySelectorAll('.breakdown-fill').forEach(el => {
        el.style.width = el.dataset.width + '%';
      });
    }, 100);
  });
}

// ---------- EMOTION SECTION ----------
const emotionEmojis = {
  anger: '😠',
  disgust: '🤢',
  fear: '😨',
  joy: '😊',
  neutral: '😐',
  sadness: '😢',
  surprise: '😮'
};

const emotionColors = {
  anger: 'emotion-anger',
  disgust: 'emotion-disgust',
  fear: 'emotion-fear',
  joy: 'emotion-joy',
  neutral: 'emotion-neutral',
  sadness: 'emotion-sadness',
  surprise: 'emotion-surprise'
};

function renderEmotions(emotions) {
  if (!emotions) return;

  const container = document.getElementById('emotion-bars');
  const order = ['joy', 'surprise', 'neutral', 'anger', 'sadness', 'fear', 'disgust'];

  container.innerHTML = order.map(key => {
    const value = emotions[key] || 0;
    const emoji = emotionEmojis[key] || '';
    const colorClass = emotionColors[key] || '';
    const label = key.charAt(0).toUpperCase() + key.slice(1);

    return `
      <div class="emotion-bar-item">
        <span class="emotion-label">${emoji} ${label}</span>
        <div class="emotion-track">
          <div class="emotion-fill ${colorClass}" data-width="${value}"></div>
        </div>
        <span class="emotion-pct">${value.toFixed(1)}%</span>
      </div>
    `;
  }).join('');
}

function toggleEmotions() {
  const container = document.getElementById('emotion-bars');
  const btn = document.getElementById('toggle-emotions-btn');
  const text = document.getElementById('toggle-emotions-text');
  const isHidden = container.classList.contains('hidden');

  if (isHidden) {
    container.classList.remove('hidden');
    btn.classList.add('active');
    text.textContent = 'Hide Emotions';

    // Animate emotion bars
    requestAnimationFrame(() => {
      setTimeout(() => {
        container.querySelectorAll('.emotion-fill').forEach(el => {
          el.style.width = el.dataset.width + '%';
        });
      }, 50);
    });
  } else {
    container.classList.add('hidden');
    btn.classList.remove('active');
    text.textContent = 'Show Emotions';

    // Reset widths for re-animation
    container.querySelectorAll('.emotion-fill').forEach(el => {
      el.style.width = '0%';
    });
  }
}

// ---------- COPY RESULT ----------
function copyResult() {
  if (!lastSingleResult) return;

  const data = lastSingleResult;

  // Find the top emotion
  let topEmotion = '';
  let topEmotionValue = 0;
  if (data.emotions) {
    for (const [key, value] of Object.entries(data.emotions)) {
      if (value > topEmotionValue) {
        topEmotionValue = value;
        topEmotion = key.charAt(0).toUpperCase() + key.slice(1);
      }
    }
  }

  let text = `Sentiment: ${data.sentiment} (${data.score}%)\nText: "${data.text}"`;
  if (topEmotion) {
    text += `\nTop emotion: ${topEmotion} (${topEmotionValue.toFixed(1)}%)`;
  }

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copy-result-btn');
    const btnText = document.getElementById('copy-btn-text');
    btn.classList.add('copied');
    btnText.textContent = 'Copied!';

    setTimeout(() => {
      btn.classList.remove('copied');
      btnText.textContent = 'Copy';
    }, 2000);

    showToast('Result copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Failed to copy to clipboard.', 'error');
  });
}

// ---------- BULK ANALYSIS ----------
async function analyzeBulk() {
  const raw = document.getElementById('bulk-input').value.trim();
  if (!raw) {
    showToast('Please enter at least one line of text.', 'error');
    return;
  }

  const texts = raw.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (texts.length > 20) {
    showToast('Maximum 20 texts allowed.', 'error');
    return;
  }

  setBulkLoading(true);

  try {
    const res = await fetch('/analyze-bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts })
    });
    const data = await res.json();
    if (data.error) {
      showToast(data.error, 'error');
      return;
    }

    lastBulkResults = data;
    renderBulkResults(data);
    showToast(`Analyzed ${data.results.length} text(s) successfully!`, 'success');

    // Show export button
    document.getElementById('export-csv-btn').classList.remove('hidden');
  } catch (e) {
    showToast('Server error. Make sure Flask is running.', 'error');
  } finally {
    setBulkLoading(false);
  }
}

function setBulkLoading(on) {
  document.getElementById('bulk-btn-text').textContent = on ? 'Analyzing...' : 'Analyze All';
  document.getElementById('bulk-btn-spinner').classList.toggle('hidden', !on);
  document.getElementById('bulk-analyze-btn').disabled = on;
}

function renderBulkResults(data) {
  const container = document.getElementById('bulk-results');
  container.classList.remove('hidden');

  // Summary pills
  const s = data.summary;
  document.getElementById('bulk-summary').innerHTML = `
    <div class="summary-pill pill-pos">😊 Positive: ${s.Positive}</div>
    <div class="summary-pill pill-neg">😞 Negative: ${s.Negative}</div>
    <div class="summary-pill pill-neu">😐 Neutral: ${s.Neutral}</div>
  `;

  // Individual results
  const list = document.getElementById('bulk-list');
  list.innerHTML = data.results.map(r => `
    <div class="bulk-item">
      <span class="bulk-emoji">${r.emoji}</span>
      <span class="bulk-text">${escapeHtml(truncate(r.text, 100))}</span>
      <span class="bulk-badge badge-${r.sentiment}">${r.sentiment} ${r.score}%</span>
    </div>
  `).join('');
}

// ---------- EXPORT CSV ----------
function exportCSV() {
  if (!lastBulkResults || !lastBulkResults.results) {
    showToast('No results to export.', 'error');
    return;
  }

  const rows = [['Text', 'Sentiment', 'Score', 'TopEmotion']];

  lastBulkResults.results.forEach(r => {
    // Find top emotion
    let topEmotion = 'N/A';
    if (r.emotions) {
      let maxVal = 0;
      for (const [key, value] of Object.entries(r.emotions)) {
        if (value > maxVal) {
          maxVal = value;
          topEmotion = key.charAt(0).toUpperCase() + key.slice(1);
        }
      }
    }

    // Escape CSV values: wrap in quotes and escape internal quotes
    const escapedText = '"' + r.text.replace(/"/g, '""') + '"';
    rows.push([escapedText, r.sentiment, r.score, topEmotion]);
  });

  const csvContent = rows.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'sentiment_results.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('CSV downloaded successfully!', 'success');
}

// ---------- HISTORY ----------
async function loadHistory() {
  const list = document.getElementById('history-list');
  list.innerHTML = '<p style="color:var(--muted)">Loading...</p>';

  try {
    const res = await fetch('/history');
    const data = await res.json();

    if (data.length === 0) {
      list.innerHTML = '<p style="color:var(--muted)">No analyses yet. Go to Single or Bulk analysis to get started.</p>';
      return;
    }

    const emojiMap = { Positive: '😊', Negative: '😞', Neutral: '😐' };

    list.innerHTML = data.map(item => `
      <div class="history-item">
        <span class="history-emoji">${emojiMap[item.label] || '🔍'}</span>
        <div class="history-content">
          <div class="history-text">${escapeHtml(truncate(item.text, 100))}</div>
          <div class="history-meta">
            <span class="history-score" style="color:${colorOf(item.label)}">${item.label}</span>
            · ${item.score}% confidence
            · ${item.timestamp}
          </div>
        </div>
      </div>
    `).join('');
  } catch (e) {
    list.innerHTML = '<p style="color:var(--negative)">Failed to load history.</p>';
  }
}

// ---------- STATS ----------
async function loadStats() {
  try {
    const res = await fetch('/stats');
    const data = await res.json();

    const total = data.Positive + data.Negative + data.Neutral;

    // Numbers
    document.getElementById('stats-numbers').innerHTML = `
      <div class="stat-item">
        <div class="stat-count Positive">${data.Positive}</div>
        <div class="stat-name">Positive</div>
      </div>
      <div class="stat-item">
        <div class="stat-count Negative">${data.Negative}</div>
        <div class="stat-name">Negative</div>
      </div>
      <div class="stat-item">
        <div class="stat-count Neutral">${data.Neutral}</div>
        <div class="stat-name">Neutral</div>
      </div>
    `;

    // Chart
    const ctx = document.getElementById('statsChart').getContext('2d');
    if (statsChart) statsChart.destroy();

    statsChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Positive', 'Negative', 'Neutral'],
        datasets: [{
          data: [data.Positive, data.Negative, data.Neutral],
          backgroundColor: ['#34d399', '#f87171', '#fbbf24'],
          borderColor: '#141623',
          borderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: '#e8eaf0',
              font: { size: 13, family: "'Inter', system-ui, sans-serif" }
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const pct = total ? ((ctx.raw / total) * 100).toFixed(1) : 0;
                return ` ${ctx.raw} (${pct}%)`;
              }
            }
          }
        }
      }
    });
  } catch (e) {
    console.error('Stats failed:', e);
    showToast('Failed to load statistics.', 'error');
  }
}

// ---------- UTILS ----------
function truncate(str, max) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function colorOf(label) {
  return label === 'Positive' ? 'var(--positive)'
       : label === 'Negative' ? 'var(--negative)'
       : 'var(--neutral)';
}

// ---------- KEYBOARD SHORTCUT ----------
document.getElementById('single-input').addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && e.ctrlKey) analyzeSingle();
});
