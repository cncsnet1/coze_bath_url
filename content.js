// 等待元素函数
function waitForElement(selector, timeout = 20000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        // 确保元素可见且可交互
        const style = window.getComputedStyle(element);
        if (style.display !== 'none' && 
            style.visibility !== 'hidden' && 
            style.opacity !== '0' &&
            element.offsetParent !== null) {
          resolve(element);
          return;
        }
      }
      
      if (Date.now() - startTime > timeout) {
        resolve(null);
        return;
      }
      
      setTimeout(checkElement, 200);
    };
    
    checkElement();
  });
}

// 处理单个URL的函数
async function processUrl(url) {
  try {
    console.log(`正在处理: ${url}`);
    
    // 1. 点击"添加"按钮
    const addButton = await waitForElement('[data-testid="knowledge.create.unit.add.btn"]');
    if (!addButton) {
      throw new Error('找不到添加按钮');
    }
    addButton.click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 2. 点击输入框并发送内容
    const input = await waitForElement('.content--QvvV9ncloYukWNlxMCDk .semi-input');
    if (!input) {
      throw new Error('找不到输入框');
    }
    
    // 先聚焦输入框
    input.focus();
    input.click();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 清空输入框
    input.select();
    document.execCommand('delete');
    
    // 输入新内容
    input.value = url;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 3. 点击"确认"按钮
    const confirmButton = await waitForElement('div.coz-modal-footer button.semi-button-primary:last-child');
    if (!confirmButton) {
      throw new Error('找不到确认按钮');
    }
    confirmButton.click();
    
    // 等待操作完成
    await new Promise(resolve => setTimeout(resolve, 2000));
    
  } catch (error) {
    console.error(`处理URL失败: ${url}`, error);
    throw error; // 向上传递错误
  }
}

// 处理URL列表的主函数
async function startAddingUrls(urlList) {
  // 限制处理数量为300
  const maxUrls = 300;
  const urlsToProcess = urlList.slice(0, maxUrls);
  
  if (urlList.length > maxUrls) {
    console.warn(`URL数量超过${maxUrls}个，只处理前${maxUrls}个`);
  }
  
  console.log(`开始处理${urlsToProcess.length}个URL`);
  
  for (const url of urlsToProcess) {
    try {
      await processUrl(url);
    } catch (error) {
      console.error(`跳过URL: ${url}`);
      continue;
    }
  }
  
  if (urlList.length > maxUrls) {
    const remaining = urlList.length - maxUrls;
    console.log(`还有${remaining}个URL未处理，请分批添加`);
  }
}

// 检查是否在正确的页面上
function isCorrectPage() {
  const currentUrl = window.location.href;
  console.log('当前页面URL:', currentUrl);
  
  // 更宽松的URL检查
  const hasKnowledge = currentUrl.includes('/knowledge/');
  const hasUploadType = currentUrl.includes('/upload') && currentUrl.includes('type=text_url');
  
  console.log('URL检查结果:', {
    hasKnowledge,
    hasUploadType
  });
  
  return hasKnowledge && hasUploadType;
}

// 处理消息请求
async function handleUrlRequest(request, sendResponse) {
  try {
    const pageValid = isCorrectPage();
    console.log('页面验证结果:', pageValid);
    
    if (!pageValid) {
      const message = '请在Coze知识库的URL上传页面使用此插件';
      console.error(message);
      sendResponse({ 
        status: 'error', 
        message: message
      });
      return;
    }

    const urlList = request.urlList;
    if (urlList.length > 300) {
      const message = `URL数量(${urlList.length})超过300个限制，只处理前300个。请分批添加剩余的URL。`;
      sendResponse({ 
        status: 'warning',
        message: message
      });
    } else {
      sendResponse({ 
        status: 'started',
        message: `开始处理${urlList.length}个URL`
      });
    }

    await startAddingUrls(urlList);
    console.log('URL处理完成');
  } catch (error) {
    console.error('处理出错:', error);
  }
}

// 在页面加载完成后初始化
console.log('Content script loaded');

// 监听来自popup.js的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startAddingUrls') {
    // 立即处理验证并返回响应
    handleUrlRequest(request, sendResponse);
    // 返回true表示我们会异步发送响应
    return true;
  }
}); 