// 二次验证 API
export default async function handler(req, res) {
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
    const { sessionToken, secondFactorCode, fingerprint } = req.body;

    if (!sessionToken || !secondFactorCode || !fingerprint) {
      return res.status(400).json({ 
        success: false, 
        message: '参数不完整' 
      });
    }

    // 验证会话令牌
    if (!verifySessionToken(sessionToken, fingerprint)) {
      return res.status(401).json({ 
        success: false, 
        message: '会话无效，请重新验证' 
      });
    }

    // 验证二次验证码
    if (!verifySecondFactorCode(secondFactorCode)) {
      return res.status(401).json({ 
        success: false, 
        message: '验证码错误或已过期' 
      });
    }

    // 生成最终访问令牌
    const accessToken = generateAccessToken(fingerprint);

    res.status(200).json({
      success: true,
      accessToken,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24小时
      message: '验证成功，欢迎访问文档'
    });

  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误，请稍后重试' 
    });
  }
}

// 验证会话令牌
function verifySessionToken(token, fingerprint) {
  try {
    // 解码令牌
    const decoded = atob(token.replace(/-/g, '+').replace(/_/g, '/'));
    const parts = decoded.split('-');
    
    if (parts.length !== 3) return false;
    
    const [tokenFingerprint, timestamp, secret] = parts;
    
    // 验证指纹
    if (tokenFingerprint !== fingerprint) return false;
    
    // 验证时间戳（24小时有效期）
    const tokenTime = parseInt(timestamp);
    const currentTime = Date.now();
    const timeDiff = currentTime - tokenTime;
    
    if (timeDiff > 24 * 60 * 60 * 1000) return false; // 24小时
    
    // 验证密钥
    const expectedSecret = process.env.JWT_SECRET || 'default-secret';
    if (secret !== expectedSecret) return false;
    
    return true;
  } catch (error) {
    return false;
  }
}

// 生成访问令牌
function generateAccessToken(fingerprint) {
  const currentTime = Date.now();
  const payload = {
    fp: fingerprint,
    iat: currentTime,
    exp: currentTime + (24 * 60 * 60 * 1000),
    aud: 'xiaiyun-docs'
  };
  
  // 简化的JWT，实际项目中建议使用标准JWT库
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = generateSignature(encodedPayload, fingerprint);
  
  return `${encodedPayload}.${signature}`;
}

// 生成签名
function generateSignature(payload, fingerprint) {
  const secret = process.env.JWT_SECRET || 'default-secret';
  const data = `${payload}.${fingerprint}.${secret}`;
  
  // 简单的hash算法，实际项目中建议使用HMAC-SHA256
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  
  return Math.abs(hash).toString(36);
}

// 验证二次验证码（从 auth.js 复制）
function verifySecondFactorCode(inputCode) {
  const validCodes = [];
  const now = new Date();
  
  // 当前周期和前一个周期的验证码都有效
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