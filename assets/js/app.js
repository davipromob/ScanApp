let TYPE_TEXT = "TEXT",
  TYPE_URL = "URL",
  TYPE_PHONE = "PHONE NUMBER",
  TYPE_WIFI = "WIFI",
  TYPE_UPI = "UPI",
  Logger = {
    logScanStart: function(e) {
      console.log("ScanStart", "Start", `embed=${e}`)
    },
    logScanRestart: function() {
      console.log("ScanStart", "Restart", "NA")
    },
    logScanSuccess: function(e, t) {
      console.log("ScanSuccess", e, t)
      console.log(`ScanSuccess_${e}`, "codeType", "NA")
    },
    logActionCopy: function() {
      console.log("Action-Copy", "")
    },
    logActionShare: function() {
      console.log("Action-Share", "")
      console.log("share", "")
    },
    logPaymentAction: function() {
      console.log("Action-Payment", "")
    },
    logAntiEmbedWindowShown: function() {
      console.log("Anti-Embed-Window", "")
    },
    logAntiEmbedActionNavigateToScanApp: function(e) {
      console.log("Anti-Embed-Action", "NavigateToScanapp", "")
    },
    logAntiEmbedActionContinueHere: function(e) {
      console.log("Anti-Embed-Action", "Continue", "")
    }
  };

function showBanner(e, t) {
  hideBanners(), selector = ".banner.success", textId = "banner-success-message", !1 === t && (selector = ".banner.error", textId = "banner-error-message"), document.getElementById(textId).innerText = e, requestAnimationFrame(() => {
    document.querySelector(selector).classList.add("visible")
  })
}

function hideBanners(e) {
  document.querySelectorAll(".banner.visible").forEach(e => e.classList.remove("visible"))
}

function shareResult(e, t) {
  const n = {
    title: "Scan result from Scanapp",
    text: e
  };
  t == TYPE_URL && (n.url = e), navigator.share(n).then(function() {
    showBanner("Shared successfully")
  }).catch(function(e) {
    showBanner("Sharing cancelled or failed", !1)
  })
}

function createLinkTyeUi(e, t, n) {
  var o = document.createElement("a");
  o.href = t, n == TYPE_PHONE && (t = t.toLowerCase().replace("tel:", "")), o.innerText = t, e.appendChild(o)
}

function addKeyValuePairUi(e, t, n) {
  var o = document.createElement("div"),
    i = document.createElement("span");
  i.style.fontWeight = "bold", i.style.marginRight = "10px", i.innerText = t, o.appendChild(i);
  var a = document.createElement("span");
  a.innerText = n, o.appendChild(a), e.appendChild(o)
}

function createWifiTyeUi(e, t) {
  var n = new RegExp(/WIFI:S:(.*);T:(.*);P:(.*);H:(.*);;/g).exec(t);
  addKeyValuePairUi(e, "SSID", n[1]), addKeyValuePairUi(e, "Type", n[2]), addKeyValuePairUi(e, "Password", n[3])
}

function createUpiTypeUi(e, t) {
  var n = new URL(t).searchParams,
    o = n.get("cu");
  o && null != o && addKeyValuePairUi(e, "Currency", o), addKeyValuePairUi(e, "Payee address", n.get("pa"));
  var i = n.get("pn");
  i && null != i && addKeyValuePairUi(e, "Payee Name", i)
}

function isUrl(e) {
  var t = new RegExp(/^((javascript:[\w-_]+(\([\w-_\s,.]*\))?)|(mailto:([\w\u00C0-\u1FFF\u2C00-\uD7FF-_]+\.)*[\w\u00C0-\u1FFF\u2C00-\uD7FF-_]+@([\w\u00C0-\u1FFF\u2C00-\uD7FF-_]+\.)*[\w\u00C0-\u1FFF\u2C00-\uD7FF-_]+)|(\w+:\/\/(([\w\u00C0-\u1FFF\u2C00-\uD7FF-]+\.)*([\w\u00C0-\u1FFF\u2C00-\uD7FF-]*\.?))(:\d+)?(((\/[^\s#$%^&*?]+)+|\/)(\?[\w\u00C0-\u1FFF\u2C00-\uD7FF:;&%_,.~+=-]+)?)?(#[\w\u00C0-\u1FFF\u2C00-\uD7FF-_]+)?))$/g);
  if (e.match(t)) return !0;
  var n = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  return !!e.match(n)
}

function isPhoneNumber(e) {
  var t = new RegExp(/tel:[+]*[0-9]{3,}/g);
  return e.match(t)
}

function isWifi(e) {
  var t = new RegExp(/WIFI:S:(.*);T:(.*);P:(.*);H:(.*);;/g);
  return e.match(t)
}

function isUpi(e) {
  try {
    var t = new URL(e);
    return !(!t || null == t) && "upi:" === t.protocol
  } catch (e) {
    return !1
  }
}

function detectType(e) {
  return isUrl(e) ? TYPE_URL : isPhoneNumber(e) ? TYPE_PHONE : isWifi(e) ? TYPE_WIFI : isUpi(e) ? TYPE_UPI : TYPE_TEXT
}

function copyToClipboard(e) {
  navigator.clipboard.writeText(e).then(function() {
    showBanner("Text copied")
  }).catch(function(e) {
    showBanner("Failed to copy", !1)
  })
}
let HistoryItem = function(e, t, n, o, i) {
  this._decodedText = e, this._decodedResult = t, this._scanType = n, this._codeType = o, this._dateTime = i
};
HistoryItem.prototype.decodedText = function() {
  return this._decodedText
}, HistoryItem.prototype.decodedResult = function() {
  return this._decodedResult
}, HistoryItem.prototype.scanType = function() {
  return this._scanType
}, HistoryItem.prototype.codeType = function() {
  return this._codeType
}, HistoryItem.prototype.dateTime = function() {
  return this._dateTime
}, HistoryItem.prototype.render = function(e) {};
let HistoryManager = function() {
  this._historyList = [], this.flushToDisk = function() {
    console.log("todo: saving history to disk")
  }
};
HistoryManager.prototype.add = function(e) {
  this._historyList.push(e), this.flushToDisk(), this.render()
}, HistoryManager.prototype.render = function(e) {
  e.innerHtml = "";
  for (var t = this._historyList.length - 1; t >= 0; t--) {
    this._historyList[t].render(e)
  }
};
let QrResult = function(e) {
  let t = document.getElementById("new-scanned-result"),
    n = document.getElementById("scan-result-code-type"),
    o = document.getElementById("scan-result-image"),
    i = document.getElementById("scan-result-text"),
    a = document.getElementById("scan-result-badge-body"),
    r = document.getElementById("scan-result-parsed"),
    c = document.getElementById("action-share"),
    d = document.getElementById("action-copy"),
    s = document.getElementById("action-payment"),
    u = document.getElementById("scan-result-close"),
    l = document.getElementById("no-result-container");
  o.style.display = "none";
  let g = {
    text: null,
    type: null
  };
  u.addEventListener("click", function() {
    hideBanners(), t.style.display = "none", e && (Logger.logScanRestart(), e()), l.classList.remove("hidden")
  });
  navigator.clipboard ? d.addEventListener("click", function() {
    hideBanners(), copyToClipboard(i.innerText), Logger.logActionCopy()
  }) : d.style.display = "none", s.addEventListener("click", function(e) {
    hideBanners();
    var t = decodeURIComponent(g.text);
    location.href = t, showBanner("Payment action only works if UPI payment apps are installed."), Logger.logPaymentAction()
  }), navigator.share ? c.addEventListener("click", function() {
    hideBanners(), shareResult(g.text, g.type), Logger.logActionShare()
  }) : c.style.display = "none", this.__onScanSuccess = function(e, o, c) {
    l.classList.add("hidden"), n.innerText = function(e) {
      return e
    }(o.result.format.formatName), i.innerText = e;
    let d = detectType(e);
    Logger.logScanSuccess(c, d), g.text = e, g.type = d, a.innerText = d, r.replaceChildren ? r.replaceChildren() : r.innerHTML = "", r.appendChild(function(e, t) {
      let n = document.createElement("div");
      return s.style.display = t == TYPE_UPI ? "inline-block" : "none", t == TYPE_URL || t == TYPE_PHONE ? (createLinkTyeUi(n, e, t), n) : t == TYPE_WIFI ? (createWifiTyeUi(n, e), n) : t == TYPE_UPI ? (createUpiTypeUi(n, e), n) : (n.innerText = e, n)
    }(e, d)), t.style.display = "block"
  }
};

function isEmbeddedInIframe() {
  return window !== window.parent
}

function docReady(e) {
  "complete" === document.readyState || "interactive" === document.readyState ? setTimeout(e, 1) : document.addEventListener("DOMContentLoaded", e)
}
QrResult.prototype.onScanSuccess = function(e, t, n) {
  this.__onScanSuccess(e, t, n)
}, docReady(function() {
  var e = isEmbeddedInIframe();
  location.href = "#reader";
  let t = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: function(e, t) {
        var n = e > t ? t : e,
          o = Math.floor(.8 * n);
        return o < 250 ? n < 250 ? {
          width: n,
          height: n
        } : {
          width: 250,
          height: 250
        } : {
          width: o,
          height: o
        }
      },
      experimentalFeatures: {
        useBarCodeDetectorIfSupported: !0
      },
      rememberLastUsedCamera: !0,
      aspectRatio: 1.7777778
    }),
    n = new QrResult(function() {
      t.getState() === Html5QrcodeScannerState.PAUSED && t.resume()
    });
  t.render(function(e, o) {
    console.log(e, o), t.getState() !== Html5QrcodeScannerState.NOT_STARTED && t.pause(!0);
    let i = "camera";
    t.getState() === Html5QrcodeScannerState.NOT_STARTED && (i = "file"), n.onScanSuccess(e, o, i)
  }), Logger.logScanStart(e)
});