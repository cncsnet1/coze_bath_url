// 文件输入处理
document.getElementById('fileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const textarea = document.getElementById('urlList');
      // 如果文本框已有内容，则在末尾添加新内容
      if (textarea.value) {
        textarea.value += '\n' + e.target.result;
      } else {
        textarea.value = e.target.result;
      }
    };
    reader.readAsText(file);
  }
});

// 清空按钮
document.getElementById('clearButton').addEventListener('click', () => {
  document.getElementById('urlList').value = '';
  document.getElementById('fileInput').value = ''; // 清空文件输入
});

// 开始添加按钮
document.getElementById('startButton').addEventListener('click', async () => {
  const urlList = document.getElementById('urlList').value
    .split('\n')
    .map(url => url.trim())
    .filter(url => url);

  if (urlList.length === 0) {
    alert('请输入至少一个URL');
    return;
  }

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // 检查是否在正确的页面上
    if (!tab.url.includes('coze.cn')) {
      alert('请在Coze网站上使用此插件');
      return;
    }

    // 发送消息并等待响应
    const response = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tab.id, {
        action: 'startAddingUrls',
        urlList: urlList
      }, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });

    // 处理响应
    if (response.status === 'error') {
      alert(response.message);
    } else if (response.status === 'warning') {
      alert(response.message);
      window.close();
    } else if (response.status === 'started') {
      console.log(response.message);
      window.close();
    }
  } catch (error) {
    if (error.message.includes('message port closed')) {
      alert('请刷新页面后重试');
    } else {
      alert('请确保在正确的页面上，并且页面已完全加载');
    }
    console.error('Error:', error);
  }
});

// 优化等待元素函数
function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        // 确保元素可见且可交互
        const style = window.getComputedStyle(element);
        if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
          resolve(element);
          return;
        }
      }
      
      if (Date.now() - startTime > timeout) {
        reject(new Error(`等待元素超时: ${selector}`));
        return;
      }
      
      setTimeout(checkElement, 100);
    };
    
    checkElement();
  });
} 