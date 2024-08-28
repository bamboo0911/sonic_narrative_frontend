// src/serviceWorkerRegistration.js

// 這段可選的代碼用於註冊 service worker。
// 預設情況下不會自動呼叫 register()。

// 這將使應用程式在之後的訪問中加載更快，並且具有離線功能。
// 然而，這也意味著開發者（以及使用者）只有在關閉所有已打開的頁面後，
// 才能看到已部署的更新，因為先前緩存的資源會在背景中更新。

// 想了解此模式的更多好處和如何選擇加入，請參閱 https://bit.ly/CRA-PWA

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] 是 IPv6 本地主機地址。
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 被認為是 IPv4 的本地主機。
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])){3}$/
    )
);

// 用於註冊 service worker 的函數
export function register(config) {
  // 僅在生產環境中註冊 service worker
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // 使用 PUBLIC_URL 環境變數創建一個 URL 物件
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);

    // 如果 service worker 的 URL 與應用程式的來源不同，則退出函數
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    // 在頁面加載後註冊 service worker
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // 如果正在本地運行，檢查是否仍有 service worker 存在
        checkValidServiceWorker(swUrl, config);

        // 當在本地運行時，為開發者提供有用的日誌資訊
        navigator.serviceWorker.ready.then(() => {
          console.log(
            '這個網頁應用程式正由 service worker 提供緩存優先的服務。' +
              '如需了解更多資訊，請參閱 https://bit.ly/CRA-PWA'
          );
        });
      } else {
        // 如果不是本地主機，則直接註冊 service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

// 註冊有效的 service worker 的函數
function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // 新內容已可用；在關閉所有頁籤後將被使用
              console.log(
                '新內容已可用，當所有該頁面的頁籤被關閉後將被使用。詳情參閱 https://bit.ly/CRA-PWA.'
              );

              // 如果提供了更新回調函數，則執行
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // 所有內容已被緩存以供離線使用
              console.log('內容已被緩存以供離線使用。');

              // 如果提供了成功回調函數，則執行
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('註冊 service worker 時出錯:', error);
    });
}

// 檢查是否存在有效的 service worker 的函數
function checkValidServiceWorker(swUrl, config) {
  // 檢查是否可以找到 service worker。如果找不到，重新加載頁面。
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // 確保 service worker 存在，並且我們獲取到的確實是 JS 文件。
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // 沒有找到 service worker。可能是不同的應用程式。重新加載頁面。
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // 找到 service worker，正常繼續註冊。
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('未發現網路連線。應用程式正在離線模式下運行。');
    });
}

// 用於註銷 service worker 的函數
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
