// nz_tourism/app/api/weather/[city]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// 中文名映射到英文城市名
const CITY_NAME_MAP: Record<string, string> = {
  '皇后镇': 'Queenstown',
  '奥克兰': 'Auckland',
  '罗托鲁瓦': 'Rotorua',
  '米尔福德峡湾': 'Milford Sound',
  '但尼丁': 'Dunedin',
  '基督城': 'Christchurch',
  '惠灵顿': 'Wellington'
};

// 目的地ID映射到英文城市名
const DESTINATION_ID_TO_CITY: Record<string, string> = {
  'queenstown': 'Queenstown',
  'auckland': 'Auckland',
  'rotorua': 'Rotorua',
  'milford-sound': 'Milford Sound',
  'hobbiton': 'Matamata',
  'dunedin': 'Dunedin',
  // 映射GUID到城市英文名，如果您使用GUID
  'f8a7b3c1-d2e4-4f5a-9b8c-7d6e5f4a3b2c': 'Queenstown',
  'a1b2c3d4-e5f6-4a5b-8c9d-7e6f5a4b3c2': 'Auckland',
  'b2c3d4e5-f6a7-5b8c-9d0e-1f2a3b4c5d6': 'Rotorua',
  'c3d4e5f6-a7b8-6c9d-0e1f-2a3b4c5d6e7': 'Milford Sound',
  'd4e5f6a7-b8c9-7d0e-1f2a-3b4c5d6e7f8': 'Matamata'
};

// 备用城市 - 当原始城市未找到时使用
const FALLBACK_CITY = 'Auckland';

export async function GET(req: NextRequest, { params }: { params: { city: string } }) {
  try {
    const city = params.city;
    
    // 优先尝试从ID映射获取英文名，然后尝试中文映射，最后直接使用输入
    const englishCity = DESTINATION_ID_TO_CITY[city] || CITY_NAME_MAP[city] || city;
    console.log(`查询城市: ${city} -> ${englishCity}`);
    
    const API_KEY = process.env.WEATHER_API_KEY;
    
    if (!API_KEY) {
      console.error('API密钥未配置');
      return NextResponse.json(
        { error: 'API密钥未配置' },
        { status: 500 }
      );
    }
    
    // 使用WeatherAPI.com的接口
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${englishCity},nz&lang=zh`
    );
    
    // 如果城市未找到，使用备用城市
    if (response.status === 400 || response.status === 404) {
      console.warn(`城市 ${englishCity} 未找到，使用备用城市 ${FALLBACK_CITY}`);
      const fallbackResponse = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${FALLBACK_CITY},nz&lang=zh`
      );
      
      if (!fallbackResponse.ok) {
        throw new Error(`连备用城市也找不到: ${fallbackResponse.statusText}`);
      }
      
      const fallbackData = await fallbackResponse.json();
      fallbackData.usingFallback = true;
      fallbackData.originalCity = englishCity;
      
      return NextResponse.json(fallbackData);
    }
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('获取天气数据失败:', error);
    return NextResponse.json(
      { error: '无法获取天气数据', message: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}