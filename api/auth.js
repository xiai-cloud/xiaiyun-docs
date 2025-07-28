// Vercel Serverless Function for authentication
// 可以部署到 Vercel 或者改写为 Cloudflare Workers

export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { accessCode, timestamp, fingerprint } = req.body;

    // 服务端存储的访问码（建议使用环境变量）
    const VALID_ACCESS_CODES = [
      process.env.PRIMARY_ACCESS_CODE || 'xiaiyun2025',
      process.env.DEV_ACCESS_CODE || 'dev-team-access-2025',
      process.env.VIEWER_ACCESS_CODE || 'docs-viewer-2025'
    ];

    // 基础验证
    if (!accessCode || !timestamp || !fingerprint) {
      return res.status(400).json({ 
        success: false, 
        message: '参数不完整' 
      });
    }

    // 时间戳验证（5分钟有效期）
    const currentTime = Date.now();
    const requestTime = parseInt(timestamp);
    const timeDiff = Math.abs(currentTime - requestTime);
    
    if (timeDiff > 5 * 60 * 1000) { // 5分钟
      return res.status(400).json({ 
        success: false, 
        message: '请求已过期，请刷新页面重试' 
      });
    }

    // 访问码验证
    if (!VALID_ACCESS_CODES.includes(accessCode)) {
      // 延迟响应，防止暴力破解
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return res.status(401).json({ 
        success: false, 
        message: '访问码错误' 
      });
    }

    // 生成会话令牌（简化版JWT）
    const sessionToken = generateSessionToken(fingerprint, currentTime);
    
    // 生成二次验证码
    const secondFactorCode = generateSecondFactorCode();

    res.status(200).json({
      success: true,
      sessionToken,
      secondFactorCode,
      expiresAt: currentTime + (24 * 60 * 60 * 1000), // 24小时
      message: '第一步验证成功，请输入二次验证码'
    });

  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误，请稍后重试' 
    });
  }
}

// 生成会话令牌
function generateSessionToken(fingerprint, timestamp) {
  const payload = `${fingerprint}-${timestamp}-${process.env.JWT_SECRET || 'default-secret'}`;
  return btoa(payload).replace(/[+/=]/g, (char) => {
    switch (char) {
      case '+': return '-';
      case '/': return '_';
      case '=': return '';
      default: return char;
    }
  });
}

// 生成6位数字验证码
function generateSecondFactorCode() {
  const now = new Date();
  const seed = Math.floor(now.getTime() / (5 * 60 * 1000)); // 5分钟为一个周期
  
  // 基于时间的简单算法生成验证码
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += Math.floor((seed * (i + 1) * 7919) % 10); // 7919是一个质数
  }
  
  return code;
}

// 验证二次验证码
export function verifySecondFactorCode(inputCode) {
  const validCodes = [];
  const now = new Date();
  
  // 当前周期和前一个周期的验证码都有效（容错机制）
  for (let offset = 0; offset <= 1; offset++) {
    const seed = Math.floor((now.getTime() - offset * 5 * 60 * 1000) / (5 * 60 * 1000));
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += Math.floor((seed * (i + 1) * 7919) % 10);
    }
    validCodes.push(code);
  }
  
  return validCodes.includes(inputCode);
}