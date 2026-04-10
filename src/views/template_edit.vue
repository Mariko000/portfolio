<script setup>
import { ref, computed } from 'vue';

const mainColor = ref('#3498db'); 
const currentStyle = ref('modern');
const bgTone = ref(50);

const hexToHsl = (hex) => {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) h = s = 0;
  else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

const fontIndex = ref(0); // 0, 1, 2 のいずれか

const fontPairs = {
  modern: [
    { name: 'Geometric', title: 'Montserrat', body: 'Inter' },
    { name: 'Elegant', title: 'Playfair Display', body: 'Lato' },
    { name: 'Tech', title: 'Roboto', body: 'IBM Plex Mono' }
  ],
  cute: [
    { name: 'Pop', title: 'Quicksand', body: 'Open Sans' },
    { name: 'Warm', title: 'Caveat', body: 'Varela Round' },
    { name: 'Retro', title: 'Abril Fatface', body: 'Nunito' }
  ]
};

const styles = {
  modern: {
    radius: '4px',
    shadow: '0 4px 12px rgba(0,0,0,0.1)',
    font: 'sans-serif',
    spacing: 'clamp(1rem, 2vw, 1.5rem)', 
    bgSaturation: 30,
    bgLightness: 90
  },
  cute: {
    radius: '24px',
    shadow: '0 8px 20px rgba(0,0,0,0.05)',
    font: 'cursive, sans-serif',
    spacing: 'clamp(1.5rem, 4vw, 2.5rem)', 
    bgSaturation: 30,
    bgLightness: 90
  }
};

const componentType = ref('contact'); // 初期値

const components = [
  { id: 'top', label: 'TOP (Hero)' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
  { id: 'simple', label: 'Simple Card' },
  { id: 'product', label: 'Product Card' },
  { id: 'blog', label: 'Blog Card' },
  { id: 'grid', label: 'Gallery Grid' },
  { id: 'pricing', label: 'Pricing Table' },
  { id: 'main', label: 'Main (Article)' },
  { id: 'footer', label: 'Nav / Footer' }
];

//openCodeInNewTab を実行したときに、選択された componentType に応じてHTMLを切り替える仕組み
const componentTemplates = {
  contact: {
    label: 'Contact (Form)',
    html: `
      <div class="contact-form">
        <h3>Contact Us</h3>
        <div class="form-group">
          <label>Name</label>
          <input type="text" placeholder="Your Name" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" placeholder="email@example.com" />
        </div>
        <button class="primary-btn">Send Message</button>
      </div>`
  },
  top: {
    label: 'Top (Hero)',
    html: `
      <div class="hero-section">
        <h1>Creative Solutions</h1>
        <p>We build beautiful digital experiences for your next project.</p>
        <div class="actions">
          <button class="primary-btn">Get Started</button>
          <button class="secondary-btn">Learn More</button>
        </div>
      </div>`
  },
  product: {
    label: 'Product Card',
    html: `
      <div class="product-card">
        <div class="product-img">Image</div>
        <h4>Delicious Menu</h4>
        <p class="description">Fresh ingredients and custom scaling for your kitchen.</p>
        <div class="product-footer">
          <span class="price">$12.50</span>
          <button class="primary-btn mini">Add</button>
        </div>
      </div>`
  },
  grid: {
    label: 'Grid / Gallery',
    html: `
      <div class="gallery-grid">
        <div class="grid-item">1</div>
        <div class="grid-item">2</div>
        <div class="grid-item">3</div>
        <div class="grid-item">4</div>
      </div>`
  }
};

const openHtmlInNewTab = () => {
  const component = componentTemplates[componentType.value];
  const htmlContent = component.html.trim();

  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(`
      <html>
        <head><title>${component.label} - HTML Export</title></head>
        <body style="background: #1e1e1e; color: #d4d4d4; padding: 40px; font-family: monospace; line-height: 1.5;">
          <h2 style="color: #4ec9b0;">// Copy this HTML to your Component</h2>
          <pre style="background: #252526; padding: 20px; border-radius: 8px; border: 1px solid #333; overflow-x: auto; color: #ce9178;">${
            // HTMLタグをエスケープして表示
            htmlContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
          }</pre>
          <p style="color: #888; font-size: 0.9rem;">※ Class names are compatible with the exported CSS.</p>
        </body>
      </html>
    `);
    newWindow.document.close();
  }
};

const cssVariables = computed(() => {
  const s = styles[currentStyle.value];
  const hsl = hexToHsl(mainColor.value);
  const toneFactor = bgTone.value / 100;
  const dynamicSat = s.bgSaturation * toneFactor;
  const dynamicLight = 100 - (100 - s.bgLightness) * toneFactor;
  const bgCard = `hsl(${hsl.h}, ${dynamicSat}%, ${dynamicLight}%)`;
  const secondary = `hsl(${hsl.h}, ${hsl.s * 0.6}%, ${Math.min(hsl.l + 10, 90)}%)`;
  const textOnSecondary = (hsl.l + 10) > 60 ? '#2c3e50' : '#ffffff';
  const textOnPrimary = hsl.l > 60 ? '#2c3e50' : '#ffffff';

  // フォントを追加
  const pair = fontPairs[currentStyle.value][fontIndex.value];

  return {
    '--primary': mainColor.value,
    '--secondary': secondary,
    '--font-title': `'${pair.title}', sans-serif`,
    '--font-body': `'${pair.body}', sans-serif`,
    '--bg-stage': '#ffffff', 
    '--bg-card': bgCard,
    '--text-main': '#2c3e50',
    '--text-on-primary': textOnPrimary,
    '--text-on-secondary': textOnSecondary,
    '--radius': s.radius,
    '--shadow': s.shadow,
    '--spacing': s.spacing,
    '--font-family': s.font,
  };
});

const getLuminance = (hex) => {
  const rgb = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map(c => {
    let v = parseInt(c, 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
};

const contrastResult = computed(() => {
  const L1 = getLuminance(mainColor.value);
  const L2 = getLuminance('#ffffff');
  const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  return {
    ratio: ratio.toFixed(2),
    isPass: ratio >= 4.5,
    text: ratio >= 4.5 ? '✅ 合格' : '❌ 不合格'
  };
});



const openCodeInNewTab = () => {
  const v = cssVariables.value;
  // ここでレスポンシブなCSS構成を書き出す
  const cssContent = `:root {
  /* Brand Colors */
  --primary: ${v['--primary']};
  --secondary: ${v['--secondary']};
  --bg-card: ${v['--bg-card']};
  --text-main: ${v['--text-main']};
  --text-on-primary: ${v['--text-on-primary']};
  --text-on-secondary: ${v['--text-on-secondary']};


  /* Typography Pairing */
  --font-title: ${v['--font-title']}; /* 見出し用 */
  --font-body: ${v['--font-body']};   /* 本文用 */

  /* Responsive Skeleton */
  --radius: ${v['--radius']};
  --shadow: ${v['--shadow']};
  --spacing: ${v['--spacing']};
  --font-family: ${v['--font-family']};
}

/* Base Typography Application */
body {
  font-family: var(--font-body);
  color: var(--text-main);
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-title);
  line-height: 1.2;
  margin-bottom: 0.5em;
}

/* Responsive Container Logic */
.recipe-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing);
  display: grid;
  gap: var(--spacing);
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

@media (max-width: 600px) {
  :root {
    --spacing: 1rem; /* スマホ時は最小値に固定 */
  }
}
/* 
*/
`;

  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(`
      <html>
        <head><title>Responsive Export</title></head>
        <body style="background: #1e1e1e; color: #d4d4d4; padding: 40px; font-family: monospace; line-height: 1.5;">
          <h2 style="color: #4ec9b0;">// Copy to your Stylesheet</h2>
          <pre style="background: #252526; padding: 20px; border-radius: 8px; border: 1px solid #333; overflow-x: auto;">${cssContent}</pre>
        </body>
      </html>
    `);
    newWindow.document.close();
  }
};
</script>

<template>
  <div class="generator-preview" :style="cssVariables">
    <div class="controls">
      <div class="color-picker-wrapper">
        <input type="color" v-model="mainColor" class="color-input" />
      </div>
      <div class="chip-group">
        <button v-for="s in ['modern', 'cute']" :key="s" @click="currentStyle = s" :class="['chip', { active: currentStyle === s }]">
          <span class="chip-icon">{{ s === 'modern' ? '■' : '●' }}</span> {{ s.charAt(0).toUpperCase() + s.slice(1) }}
        </button>
      </div>
      <div class="control-group">
        <label>Tone: {{ bgTone }}%</label>
        <input type="range" v-model="bgTone" min="0" max="100" />
      </div>
    </div>

    <div class="font-selector-bar">
      <div class="chip-group">
        <button v-for="(p, i) in fontPairs[currentStyle]" :key="i" @click="fontIndex = i" :class="['chip', 'font-chip', { active: fontIndex === i }]">
          {{ p.name }}
        </button>
      </div>
    </div>

    <div class="component-selector-bar">
      <div class="chip-group scroll-x">
        <button v-for="(data, key) in componentTemplates" :key="key" @click="componentType = key" :class="['chip', 'comp-chip', { active: componentType === key }]">
          {{ data.label }}
        </button>
      </div>
    </div>

    <div class="stage">
      <div class="mini-site-frame">
        <div class="mini-header" :style="{ background: 'var(--primary)', color: 'var(--text-on-primary)' }">
          header
        </div>
          
        <main class="mini-body">
          <div class="mini-content">
            <div class="component-preview-area" v-html="componentTemplates[componentType].html"></div>
            
            <div class="actions">
              <button class="primary-btn" @click="openCodeInNewTab" :style="{ color: 'var(--text-on-primary)' }">
                Get CSS Code
              </button>
              <button 
    class="secondary-btn" 
    @click="openHtmlInNewTab"
    :style="{ background: 'var(--secondary)', color: 'var(--text-on-secondary)' }"
  >
    Get HTML Code
  </button>
            </div>
          </div>
        </main>
      </div>
    </div>

    <div class="judgment" :class="{ 'is-pass': contrastResult.isPass }">
      <p>Contrast: {{ contrastResult.ratio }}:1 ({{ contrastResult.text }})</p>
    </div>
  </div>
</template>

<style scoped>
.generator-preview { display: flex; flex-direction: column; font-family: var(--font-family); }

/* コントロールパネル全体のレイアウト調整 */
.controls, .font-selector-bar {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #ffffff;
  align-items: center;
}

.font-selector-bar {
  padding-top: 0; /* 二段目として自然に見せる */
}

/* チップス（バッジ）の基本スタイル */
.chip-group {
  display: flex;
  gap: 8px;
}

.chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 2px solid transparent;
  border-radius: 99px; /* 完全なカプセル型 */
  background: #f5f5f7; /* 未選択時のデフォルト背景 */
  color: #666;
  font-weight: bold;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ホバー時の挙動：少しだけ浮かす */
.chip:hover {
  background: #efeff1;
  transform: translateY(-1px);
}

/* 選択時のスタイル：メインカラーを反映 */
.chip.active {
  background: var(--primary);
  color: var(--text-on-primary);
  box-shadow: 0 4px 12px v-bind('mainColor + "40"'); /* メインカラーの25%透過シャドウ */
  transform: translateY(0) scale(0.98); /* 押し込まれた感 */
}

/* Contact Form */
.contact-form { display: flex; flex-direction: column; gap: 15px; }
.form-group { display: flex; flex-direction: column; gap: 5px; text-align: left; }
.form-group input { 
  padding: 10px; 
  border: 1px solid #ddd; 
  border-radius: calc(var(--radius) / 2); 
  font-family: var(--font-body);
}

/* Product Card */
.product-card { 
  background: #fff; 
  border-radius: var(--radius); 
  padding: 15px; 
  text-align: left;
  box-shadow: var(--shadow);
}
.product-img { 
  background: var(--secondary); 
  height: 120px; 
  border-radius: calc(var(--radius) / 2); 
  display: flex; align-items: center; justify-content: center; color: white;
}

/* Grid Layout */
.gallery-grid { 
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: var(--spacing); 
}
.grid-item { 
  background: var(--secondary); 
  aspect-ratio: 1; 
  border-radius: var(--radius); 
  display: flex; align-items: center; justify-content: center;
}

/* フォント用のチップスは少し控えめに */
.font-chip {
  padding: 6px 14px;
  font-size: 0.8rem;
  background: transparent;
  border: 1.5px solid #eee;
}

.font-chip.active {
  border-color: var(--primary);
}

/* アイコン（図形）の装飾 */
.chip-icon {
  font-size: 0.7rem;
  opacity: 0.7;
}

/* カラーピッカーの見た目も少し現代的に */
.color-input {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: none;
}

.stage { background: #ffffff; padding: 40px 20px; min-height: 50vh; display: flex; justify-content: center; }
.mini-site-frame { width: 100%; max-width: 800px; background: var(--bg-card); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; }
.mini-header { padding: 15px; font-weight: bold; background: rgba(255,255,255,0.1); }
.mini-content { padding: var(--spacing); }
/* ボタンを横並びにするための設定 */
.actions { 
  display: flex; 
  gap: 12px;       /* ボタン同士の間隔 */
  margin-top: 24px; 
}

.primary-btn, .secondary-btn { 
  flex: 1;         /* 横幅を均等に分ける */
  padding: 14px; 
  border: none; 
  border-radius: calc(var(--radius) / 2); 
  cursor: pointer; 
  font-weight: bold; 
  font-size: 0.9rem;
  transition: opacity 0.2s;
  white-space: nowrap; /* 文字が折り返されないように */
}

.primary-btn { background: var(--primary); }
.secondary-btn { background: var(--secondary); color: var(--text-on-secondary); }
.judgment { padding: 15px; text-align: center; background: #f9f9f9; border-top: 1px solid #eee; }
.judgment.is-pass { color: #2e7d32; }
.judgment:not(.is-pass) { color: #d32f2f; }
.controls button.active { background: #333; color: white; }


/* 修正点：高さを細く、文字も小さく */
.mini-hero-bar { 
  padding: 8px 20px; 
  min-height: 32px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.component-selector-bar {
  padding: 10px 20px;
  background: #fcfcfc;
  border-bottom: 1px solid #eee;
}

/* チップスがはみ出してもスクロールできるように */
.scroll-x {
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 5px;
}

/* プレビュー内のフォント適用を強制 */
.component-preview-area :deep(h1), 
.component-preview-area :deep(h3), 
.component-preview-area :deep(h4) {
  font-family: var(--font-title);
}

.component-preview-area :deep(p), 
.component-preview-area :deep(label), 
.component-preview-area :deep(input) {
  font-family: var(--font-body);
}

/* --- プレビュー内の共通デザイン設定 --- */
/* --- プレビューエリア（Mini Content）内の現代的スタイリング --- */

/* 1. 共通設定：優先度を上げるため .mini-content を付与 */
.mini-content h1, .mini-content h3, .mini-content h4 {
  font-family: var(--font-title) !important;
  color: #1a1a1a;
  margin-top: 0;
  margin-bottom: 0.5em;
  line-height: 1.2;
}

.mini-content p, .mini-content label {
  font-family: var(--font-body) !important;
  color: var(--text-main);
  line-height: 1.6;
  margin-bottom: 1em;
}

/* 2. Contact Form: 以前の質素な .contact-form 設定を上書き */
.mini-content .contact-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: left;
}

.mini-content .form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.mini-content .form-group input {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: calc(var(--radius) / 2);
  background: #fff;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.2s;
}

.mini-content .form-group input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px v-bind('mainColor + "20"');
}

/* --- プレビューエリア（v-htmlの中身）に強制適用 --- */

/* :deep() を使うことで、v-htmlで生成された要素にもスタイルが届くようになります */

.mini-content :deep(h1), 
.mini-content :deep(h3), 
.mini-content :deep(h4) {
  font-family: var(--font-title) !important;
  color: #1a1a1a;
  margin-top: 0;
  margin-bottom: 0.5em;
}

.mini-content :deep(p), 
.mini-content :deep(label) {
  font-family: var(--font-body) !important;
  color: var(--text-main);
}

/* Contact Form */
.mini-content :deep(.contact-form) {
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: left;
}

.mini-content :deep(.form-group) {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.mini-content :deep(.form-group input) {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: calc(var(--radius) / 2);
  background: #fff;
  width: 100%;
  box-sizing: border-box;
}

/* Product Card (ClipCook用) */
.mini-content :deep(.product-card) {
  background: #fff;
  border-radius: var(--radius);
  padding: 20px;
  text-align: left;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mini-content :deep(.product-img) {
  background: var(--secondary);
  height: 140px;
  border-radius: calc(var(--radius) / 2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-on-secondary);
  font-weight: bold;
}

.mini-content :deep(.price) {
  font-size: 1.4rem;
  font-weight: bold;
  font-family: var(--font-title) !important;
}

/* Grid Layout */
.mini-content :deep(.gallery-grid) {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing);
}

.mini-content :deep(.grid-item) {
  background: #f0f0f2;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}
</style>