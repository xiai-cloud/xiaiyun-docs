// 账号密码登录API
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
    const { username, password, fingerprint } = req.body;

    // 基础验证
    if (!username || !password || !fingerprint) {
      return res.status(400).json({ 
        success: false, 
        message: '用户名和密码不能为空' 
      });
    }

    // 服务端存储的单一账号密码
    const VALID_USERNAME = process.env.DOC_USERNAME || 'xiaiyun';
    const VALID_PASSWORD = process.env.DOC_PASSWORD || 'xiaiyun2025';

    // 验证账号密码
    if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
      // 延迟响应，防止暴力破解
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return res.status(401).json({ 
        success: false, 
        message: '用户名或密码错误' 
      });
    }

    // 生成访问令牌
    const accessToken = generateAccessToken(username, 'user', fingerprint);
    const currentTime = Date.now();

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        username: username,
        role: 'user'
      },
      expiresAt: currentTime + (24 * 60 * 60 * 1000), // 24小时
      message: '登录成功，欢迎访问文档'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误，请稍后重试' 
    });
  }
}

// 生成访问令牌
function generateAccessToken(username, role, fingerprint) {
  const currentTime = Date.now();
  const payload = {
    username,
    role,
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
  const secret = process.env.JWT_SECRET || 'default-secret-key-2025';
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