import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('前端发送的注册数据:', body);
    
    // 验证必需字段
    if (!body.FirstName || !body.LastName || !body.Email || !body.Password) {
      return NextResponse.json(
        { 
          success: false, 
          error: '请填写所有必需字段' 
        },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.Email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: '请输入有效的邮箱地址' 
        },
        { status: 400 }
      );
    }

    // 验证密码强度
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/;
    if (!passwordRegex.test(body.Password)) {
      return NextResponse.json(
        { 
          success: false, 
          error: '密码必须至少包含8个字符，1个大写字母，1个数字和1个特殊字符' 
        },
        { status: 400 }
      );
    }

    // 验证确认密码
    if (body.Password !== body.ConfirmPassword) {
      return NextResponse.json(
        { 
          success: false, 
          error: '两次输入的密码不匹配' 
        },
        { status: 400 }
      );
    }
    
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:5152';
    console.log('转发注册请求到后端:', `${backendUrl}/api/auth/register`);
    
    const response = await fetch(`${backendUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });
    
    console.log('后端响应状态:', response.status);
    
    const data = await response.json();
    console.log('后端响应数据:', data);
    
    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          error: data.error || '注册失败' 
        },
        { status: response.status }
      );
    }
    
    return NextResponse.json({
      success: true,
      token: data.token,
      user: data.user
    });
  } catch (error) {
    console.error('注册API处理失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '服务器内部错误，请稍后再试' 
      },
      { status: 500 }
    );
  }
}