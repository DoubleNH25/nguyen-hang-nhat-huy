var priceData = [];
var tokenList = [];
var fromToken, toToken;
var isFromTokenSelect = true;
var rate = 0;

const tokens = {
  'ETH': { name: 'Ethereum', icon: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/ETH.svg' },
  'WBTC': { name: 'Wrapped Bitcoin', icon: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/WBTC.svg' },
  'USDC': { name: 'USD Coin', icon: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/USDC.svg' },
  'SWTH': { name: 'Switcheo Token', icon: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/SWTH.svg' },
  'ATOM': { name: 'Cosmos', icon: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/ATOM.svg' },
  'OSMO': { name: 'Osmosis', icon: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/OSMO.svg' },
  'LUNA': { name: 'Terra Luna', icon: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/LUNA.svg' },
  'BLUR': { name: 'Blur', icon: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/BLUR.svg' },
  'GMX': { name: 'GMX', icon: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/GMX.svg' },
  'EVMOS': { name: 'Evmos', icon: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/EVMOS.svg' },
  'KUJI': { name: 'Kujira', icon: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/KUJI.svg' },
  'BUSD': { name: 'Binance USD', icon: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/BUSD.svg' },
  'ZIL': { name: 'Zilliqa', icon: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/ZIL.svg' },
  'OKB': { name: 'OKB', icon: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/OKB.svg' },
  'IRIS': { name: 'IRISnet', icon: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/IRIS.svg' }
};

function loadPrices() {
  return fetch('./price.json')
    .then(res => res.json())
    .then(data => {
      priceData = data;
      
      let uniqueTokens = new Map();
      
      for(let i = 0; i < priceData.length; i++) {
        let item = priceData[i];
        let symbol = item.currency;
        
        if(tokens[symbol] && !uniqueTokens.has(symbol)) {
          let balance = getRandomBalance(item.price);
          uniqueTokens.set(symbol, {
            symbol: symbol,
            name: tokens[symbol].name,
            icon: tokens[symbol].icon,
            price: item.price,
            balance: balance
          });
        }
      }
      
      tokenList = Array.from(uniqueTokens.values());
      tokenList.sort(function(a, b) {
        return (b.price * b.balance) - (a.price * a.balance);
      });
      
      console.log('Loaded ' + tokenList.length + ' tokens');
    })
    .catch(err => {
      console.error('Failed to load prices:', err);
      tokenList = [
        {
          symbol: 'ETH',
          name: 'Ethereum', 
          icon: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/ETH.svg',
          price: 1645.93,
          balance: 1.5432
        },
        {
          symbol: 'USDC',
          name: 'USD Coin',
          icon: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/USDC.svg', 
          price: 1.00,
          balance: 5000.00
        },
        {
          symbol: 'SWTH',
          name: 'Switcheo Token',
          icon: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/SWTH.svg',
          price: 0.004039,
          balance: 100000.00
        }
      ];
    });
}

function getRandomBalance(price) {
  if(price > 1000) {
    return Math.random() * 5 + 0.01; 
  } else if(price > 100) {
    return Math.random() * 50 + 1; 
  } else if(price > 1) {
    return Math.random() * 1000 + 10;
  } else {
    return Math.random() * 100000 + 1000; 
  }
}

const fromAmountEl = document.getElementById('from-amount');
const toAmountEl = document.getElementById('to-amount');
const fromTokenEl = document.getElementById('from-token-selector');
const toTokenEl = document.getElementById('to-token-selector');
const swapBtn = document.getElementById('swap-tokens');
const confirmBtn = document.getElementById('confirm-swap');
const form = document.getElementById('swap-form');
const modal = document.getElementById('token-modal');
const searchInput = document.getElementById('token-search');
const tokenListEl = document.getElementById('token-list');
const refreshBtn = document.getElementById('refresh-rate');
const errorEl = document.getElementById('error-message');
const successModal = document.getElementById('success-modal');

document.addEventListener('DOMContentLoaded', function() {
  const loader = document.getElementById('loading-indicator');
  
  form.classList.add('loading');
  
  loadPrices().then(() => {
    fromToken = tokenList.find(t => t.symbol === 'ETH') || tokenList[0];
    toToken = tokenList.find(t => t.symbol === 'USDC') || tokenList[1];
    
    updateUI();
    calculateRate();
    buildTokenList();
    setupEvents();
    
    form.classList.remove('loading');
    loader.style.display = 'none';
  }).catch(err => {
    console.error('Init failed:', err);
    loader.innerHTML = '<div class=\"loading-spinner-large\"><i class=\"fas fa-exclamation-triangle\"></i></div><p>Error loading data</p>';
    
    setTimeout(() => {
      form.classList.remove('loading');
      loader.style.display = 'none';
    }, 2000);
  });
});

function setupEvents() {
  fromAmountEl.addEventListener('input', onAmountChange);
  
  fromTokenEl.addEventListener('click', () => openModal(true));
  toTokenEl.addEventListener('click', () => openModal(false));
  
  swapBtn.addEventListener('click', swapTokens);
  form.addEventListener('submit', handleSubmit);
  
  document.querySelector('.close-modal').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if(e.target === modal) closeModal();
  });
  
  searchInput.addEventListener('input', filterTokens);
  refreshBtn.addEventListener('click', calculateRate);
  
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') {
      closeModal();
      closeSuccess();
    }
  });
}

function updateUI() {
  document.getElementById('from-token-icon').src = fromToken.icon;
  document.getElementById('from-token-symbol').textContent = fromToken.symbol;
  document.getElementById('from-balance').textContent = formatNum(fromToken.balance);
  
  document.getElementById('to-token-icon').src = toToken.icon;
  document.getElementById('to-token-symbol').textContent = toToken.symbol;
  document.getElementById('to-balance').textContent = formatNum(toToken.balance);
  
  document.getElementById('rate-from').textContent = fromToken.symbol;
  document.getElementById('rate-to').textContent = toToken.symbol;
  
  updateButton();
}

function onAmountChange() {
  const amount = parseFloat(fromAmountEl.value) || 0;
  
  if(amount > 0 && rate > 0) {
    const toAmount = amount * rate;
    toAmountEl.value = formatNum(toAmount, 6);
    
    const fromUsd = amount * fromToken.price;
    const toUsd = toAmount * toToken.price;
    
    document.getElementById('from-usd-value').textContent = formatNum(fromUsd, 2);
    document.getElementById('to-usd-value').textContent = formatNum(toUsd, 2);
    
    checkAmount(amount);
  } else {
    toAmountEl.value = '';
    document.getElementById('from-usd-value').textContent = '0.00';
    document.getElementById('to-usd-value').textContent = '0.00';
  }
  
  updateButton();
}

function checkAmount(amount) {
  hideError();
  
  if(amount > fromToken.balance) {
    showError('Insufficient ' + fromToken.symbol + ' balance');
    return false;
  }
  
  if(amount < 0.000001) {
    showError('Amount too small');
    return false;
  }
  
  return true;
}

function calculateRate() {
  const icon = refreshBtn.querySelector('i');
  icon.classList.add('fa-spin');
  
  setTimeout(() => {
    try {
      const fromPrice = getLatestPrice(fromToken.symbol);
      const toPrice = getLatestPrice(toToken.symbol);
      
      if(fromPrice && toPrice) {
        fromToken.price = fromPrice;
        toToken.price = toPrice;
        rate = toPrice / fromPrice;
      } else {
        rate = toToken.price / fromToken.price;
      }
      
      const fluctuation = (Math.random() - 0.5) * 0.02;
      rate *= (1 + fluctuation);
      
      document.getElementById('exchange-rate').textContent = formatNum(rate, 6);
      
      if(fromAmountEl.value) {
        onAmountChange();
      }
    } catch(e) {
      console.error('Rate calculation failed:', e);
      showError('Failed to update rate');
    } finally {
      icon.classList.remove('fa-spin');
    }
  }, 500);
}

function getLatestPrice(symbol) {
  const prices = priceData.filter(item => item.currency === symbol);
  if(prices.length === 0) return null;
  
  prices.sort((a, b) => new Date(b.date) - new Date(a.date));
  return prices[0].price;
}

function swapTokens() {
  const temp = fromToken;
  fromToken = toToken;
  toToken = temp;
  
  fromAmountEl.value = '';
  toAmountEl.value = '';
  
  updateUI();
  calculateRate();
  
  swapBtn.style.transform = 'rotate(180deg)';
  setTimeout(() => {
    swapBtn.style.transform = '';
  }, 300);
}

function openModal(isFrom) {
  isFromTokenSelect = isFrom;
  searchInput.value = '';
  buildTokenList();
  modal.style.display = 'flex';
  searchInput.focus();
}

function closeModal() {
  modal.style.display = 'none';
}

function buildTokenList(searchTerm = '') {
  const filtered = tokenList.filter(token => 
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  let html = '';
  for(let i = 0; i < filtered.length; i++) {
    const token = filtered[i];
    html += `
      <div class="token-item" data-symbol="${token.symbol}">
        <img src="${token.icon}" alt="${token.symbol}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNFNUU3RUIiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTggMTJDMTAuMjA5MSAxMiAxMiAxMC4yMDkxIDEyIDhDMTIgNS43OTA5IDEwLjIwOTEgNCA4IDRDNS43OTA5IDQgNCA1Ljc5MDkgNCA4QzQgMTAuMjA5MSA1Ljc5MDkgMTIgOCAxMloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cjwvc3ZnPgo='" />
        <div class="token-info">
          <div class="token-symbol">${token.symbol}</div>
          <div class="token-name">${token.name}</div>
        </div>
        <div class="token-price">
          $${formatNum(token.price, token.price < 1 ? 4 : 2)}
        </div>
      </div>
    `;
  }
  
  tokenListEl.innerHTML = html;
  
  const items = tokenListEl.querySelectorAll('.token-item');
  for(let i = 0; i < items.length; i++) {
    items[i].addEventListener('click', function() {
      const symbol = this.getAttribute('data-symbol');
      selectToken(symbol);
    });
  }
}

function filterTokens() {
  buildTokenList(searchInput.value);
}

function selectToken(symbol) {
  const token = tokenList.find(t => t.symbol === symbol);
  
  if(isFromTokenSelect) {
    if(token.symbol === toToken.symbol) {
      swapTokens();
    } else {
      fromToken = token;
    }
  } else {
    if(token.symbol === fromToken.symbol) {
      swapTokens();
    } else {
      toToken = token;
    }
  }
  
  updateUI();
  calculateRate();
  closeModal();
  
  fromAmountEl.value = '';
  toAmountEl.value = '';
  document.getElementById('from-usd-value').textContent = '0.00';
  document.getElementById('to-usd-value').textContent = '0.00';
}

function handleSubmit(e) {
  e.preventDefault();
  
  const amount = parseFloat(fromAmountEl.value);
  
  if(!amount || amount <= 0) {
    showError('Please enter a valid amount');
    return;
  }
  
  if(!checkAmount(amount)) {
    return;
  }
  
  setLoading(true);
  
  setTimeout(() => {
    try {
      fromToken.balance -= amount;
      const toAmount = amount * rate;
      toToken.balance += toAmount;
      
      showSuccess();
      
      fromAmountEl.value = '';
      toAmountEl.value = '';
      document.getElementById('from-usd-value').textContent = '0.00';
      document.getElementById('to-usd-value').textContent = '0.00';
      
      updateUI();
      
    } catch(e) {
      console.error('Swap failed:', e);
      showError('Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, 2000 + Math.random() * 1000); // Random delay
}

function setLoading(loading) {
  const text = confirmBtn.querySelector('.button-text');
  const spinner = confirmBtn.querySelector('.loading-spinner');
  
  if(loading) {
    confirmBtn.classList.add('loading');
    confirmBtn.disabled = true;
    text.style.display = 'none';
    spinner.style.display = 'block';
  } else {
    confirmBtn.classList.remove('loading');
    confirmBtn.disabled = false;
    text.style.display = 'block';
    spinner.style.display = 'none';
  }
}

function updateButton() {
  const amount = parseFloat(fromAmountEl.value) || 0;
  const text = confirmBtn.querySelector('.button-text');
  
  if(amount > 0 && rate > 0) {
    if(amount > fromToken.balance) {
      confirmBtn.disabled = true;
      text.textContent = 'Insufficient ' + fromToken.symbol + ' balance';
    } else {
      confirmBtn.disabled = false;
      text.textContent = 'Confirm Swap';
    }
  } else {
    confirmBtn.disabled = true;
    text.textContent = 'Enter amount';
  }
}

function showSuccess() {
  const hash = generateHash();
  document.getElementById('tx-hash').textContent = hash;
  successModal.style.display = 'flex';
}

function closeSuccess() {
  successModal.style.display = 'none';
}

function generateHash() {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for(let i = 0; i < 8; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  hash += '...';
  for(let i = 0; i < 4; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.style.display = 'block';
  setTimeout(hideError, 5000);
}

function hideError() {
  errorEl.style.display = 'none';
}

function formatNum(num, decimals = 2) {
  if(num === 0) return '0.00';
  if(num < 0.000001) return '< 0.000001';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
}

window.closeSuccessModal = closeSuccess;