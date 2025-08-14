// nz_tourism/components/destination/DestinationMap.tsx
// 修复水合错误的版本

'use client';

import { useState, useEffect, useRef } from 'react';

interface Coordinates {
  lat: number;
  lng: number;
}

interface DestinationMapProps {
  destinationId: string;
  destinationTitle: string;
  destinationLocation: string;
  coordinates?: Coordinates;
}

const DESTINATION_COORDINATES: Record<string, Coordinates> = {
  'queenstown': { lat: -45.0312, lng: 168.6626 },
  'auckland': { lat: -36.8485, lng: 174.7633 },
  'rotorua': { lat: -38.1368, lng: 176.2497 },
  'milford-sound': { lat: -44.6671, lng: 167.9265 },
  'hobbiton': { lat: -37.8722, lng: 175.6814 },
  'dunedin': { lat: -45.8788, lng: 170.5028 },
  'f8a7b3c1-d2e4-4f5a-9b8c-7d6e5f4a3b2c': { lat: -45.0312, lng: 168.6626 },
  'a1b2c3d4-e5f6-4a5b-8c9d-7e6f5a4b3c2': { lat: -36.8485, lng: 174.7633 },
  'b2c3d4e5-f6a7-5b8c-9d0e-1f2a3b4c5d6': { lat: -38.1368, lng: 176.2497 },
  'c3d4e5f6-a7b8-6c9d-0e1f-2a3b4c5d6e7': { lat: -44.6671, lng: 167.9265 },
  'd4e5f6a7-b8c9-7d0e-1f2a-3b4c5d6e7f8': { lat: -37.8722, lng: 175.6814 }
};

const DestinationMap: React.FC<DestinationMapProps> = ({
  destinationId,
  destinationTitle,
  destinationLocation,
  coordinates
}) => {
  // 🔥 关键：添加 mounted 状态防止水合错误
  const [mounted, setMounted] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDirections, setShowDirections] = useState(false);
  const [directionsService, setDirectionsService] = useState<any>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
  
  const mapRef = useRef<HTMLDivElement>(null);

  // 🔥 关键：确保组件已挂载
  useEffect(() => {
    setMounted(true);
  }, []);

  // 获取目的地坐标
  const getDestinationCoordinates = (): Coordinates => {
    if (coordinates) return coordinates;
    const coords = DESTINATION_COORDINATES[destinationId];
    if (coords) return coords;
    
    console.warn(`未找到目的地 ${destinationId} 的坐标，使用奥克兰坐标`);
    return DESTINATION_COORDINATES['auckland'];
  };

  // 获取用户位置
  const getUserLocation = (): Promise<Coordinates> => {
    return new Promise((resolve) => {
      // 🔥 关键：检查浏览器环境
      if (typeof window === 'undefined' || !navigator.geolocation) {
        resolve(DESTINATION_COORDINATES['auckland']);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('获取位置失败:', error);
          resolve(DESTINATION_COORDINATES['auckland']);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  };

  // 动态加载Google Maps
  const loadGoogleMaps = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      // 🔥 关键：检查浏览器环境
      if (typeof window === 'undefined') {
        reject(new Error('不在浏览器环境中'));
        return;
      }

      if (window.google && window.google.maps) {
        resolve(window.google);
        return;
      }

      const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!API_KEY) {
        reject(new Error('Google Maps API密钥未配置'));
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places,geometry&callback=initGoogleMap`;
      script.async = true;
      script.defer = true;

      // 使用唯一的回调函数名
      const callbackName = `initGoogleMap_${Date.now()}`;
      (window as any)[callbackName] = () => {
        resolve(window.google);
        delete (window as any)[callbackName];
      };

      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places,geometry&callback=${callbackName}`;

      script.onerror = () => {
        reject(new Error('Google Maps加载失败'));
      };

      document.head.appendChild(script);
    });
  };

  // 初始化Google Maps
  useEffect(() => {
    // 🔥 关键：只在组件挂载后初始化
    if (!mounted) return;

    const initMap = async () => {
      try {
        setLoading(true);
        setError('');
        
        const google = await loadGoogleMaps();
        
        if (!mapRef.current) {
          throw new Error('地图容器未找到');
        }

        const destinationCoords = getDestinationCoordinates();
        
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: destinationCoords,
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
        });

        const destinationMarker = new google.maps.Marker({
          position: destinationCoords,
          map: mapInstance,
          title: destinationTitle,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#FF0000',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF'
          }
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">${destinationTitle}</h3>
              <p style="margin: 0; color: #666; font-size: 14px;">${destinationLocation}</p>
            </div>
          `
        });

        destinationMarker.addListener('click', () => {
          infoWindow.open(mapInstance, destinationMarker);
        });

        infoWindow.open(mapInstance, destinationMarker);

        const directions = new google.maps.DirectionsService();
        const renderer = new google.maps.DirectionsRenderer({
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: '#4285f4',
            strokeWeight: 5
          }
        });

        setMap(mapInstance);
        setDirectionsService(directions);
        setDirectionsRenderer(renderer);

        try {
          const userPos = await getUserLocation();
          setUserLocation(userPos);
          
          const userMarker = new google.maps.Marker({
            position: userPos,
            map: mapInstance,
            title: '您的位置',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#4285f4',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#FFFFFF'
            }
          });

          const bounds = new google.maps.LatLngBounds();
          bounds.extend(destinationCoords);
          bounds.extend(userPos);
          mapInstance.fitBounds(bounds);
          
          const listener = google.maps.event.addListener(mapInstance, 'idle', () => {
            if (mapInstance.getZoom() > 15) mapInstance.setZoom(15);
            google.maps.event.removeListener(listener);
          });

        } catch (err) {
          console.error('无法获取用户位置:', err);
        }

      } catch (err) {
        console.error('地图初始化失败:', err);
        setError(err instanceof Error ? err.message : '地图加载失败，请刷新页面重试');
      } finally {
        setLoading(false);
      }
    };

    initMap();
  }, [mounted, destinationId, destinationTitle, destinationLocation]);

  // 其他方法保持不变...
  const showDirectionsOnMap = async () => {
    if (!directionsService || !directionsRenderer || !map || !userLocation) {
      alert('无法获取路线，请确保已允许位置访问');
      return;
    }

    setLoading(true);
    
    try {
      const destinationCoords = getDestinationCoordinates();
      
      const request = {
        origin: userLocation,
        destination: destinationCoords,
        travelMode: (window.google.maps as any).TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false
      };

      directionsService.route(request, (result: any, status: any) => {
        if (status === 'OK' && result) {
          directionsRenderer.setDirections(result);
          directionsRenderer.setMap(map);
          setShowDirections(true);
        } else {
          console.error('路线计算失败:', status);
          alert('无法计算路线，请稍后重试');
        }
        setLoading(false);
      });
    } catch (err) {
      console.error('路线显示失败:', err);
      setLoading(false);
    }
  };

  const clearDirections = () => {
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
      setShowDirections(false);
    }
  };

  const openInGoogleMaps = () => {
    const coords = getDestinationCoordinates();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  const shareLocation = async () => {
    if (typeof window === 'undefined') return;
    
    const coords = getDestinationCoordinates();
    const shareUrl = `https://www.google.com/maps/place/${coords.lat},${coords.lng}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: destinationTitle,
          text: `查看${destinationTitle}的位置`,
          url: shareUrl
        });
      } catch (err) {
        console.log('分享取消');
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('位置链接已复制到剪贴板');
      } catch (err) {
        prompt('请复制以下链接:', shareUrl);
      }
    }
  };

  // 🔥 关键：在组件挂载前不渲染任何内容
  if (!mounted) {
    return (
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        padding: '20px', 
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', 
        marginBottom: '20px',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>地图加载中...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '12px', 
      padding: '20px', 
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', 
      marginBottom: '20px' 
    }}>
      {/* 头部 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px', 
        flexWrap: 'wrap', 
        gap: '12px' 
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: '#333', 
          margin: '0' 
        }}>
          位置与导航
        </h3>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            onClick={showDirectionsOnMap}
            disabled={loading || !userLocation}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              border: 'none',
              borderRadius: '6px',
              background: '#4285f4',
              color: 'white',
              fontSize: '13px',
              cursor: loading || !userLocation ? 'not-allowed' : 'pointer',
              opacity: loading || !userLocation ? '0.5' : '1',
              whiteSpace: 'nowrap'
            }}
          >
            获取路线
          </button>
          
          {showDirections && (
            <button 
              onClick={clearDirections}
              style={{
                padding: '8px 12px',
                border: 'none',
                borderRadius: '6px',
                background: '#ff4757',
                color: 'white',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              清除路线
            </button>
          )}
          
          <button 
            onClick={openInGoogleMaps}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              background: 'white',
              color: '#333',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            在地图中打开
          </button>
          
          <button 
            onClick={shareLocation}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              background: 'white',
              color: '#333',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            分享位置
          </button>
        </div>
      </div>

      {/* 地图容器 */}
      <div style={{ 
        position: 'relative', 
        borderRadius: '8px', 
        overflow: 'hidden', 
        marginBottom: '16px', 
        background: '#f8f9fa' 
      }}>
        {loading && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '400px', 
            color: '#666' 
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #4285f4',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '12px'
            }}></div>
            <p>加载地图中...</p>
          </div>
        )}
        
        {error && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '400px', 
            color: '#e74c3c',
            gap: '12px'
          }}>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: '#4285f4',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              重新加载
            </button>
          </div>
        )}
        
        <div 
          ref={mapRef} 
          style={{ 
            width: '100%', 
            height: '400px',
            borderRadius: '8px',
            display: loading || error ? 'none' : 'block'
          }}
        />
      </div>

      {/* 信息区域 */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '16px', 
        borderRadius: '8px',
        borderLeft: '4px solid #4285f4'
      }}>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#333' }}>
          {destinationTitle}
        </h4>
        <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
          {destinationLocation}
        </p>
        {userLocation ? (
          <p style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            fontSize: '13px', 
            margin: '0',
            color: '#4285f4'
          }}>
            点击"获取路线"查看从您的位置到目的地的导航
          </p>
        ) : (
          <p style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            fontSize: '13px', 
            margin: '0',
            color: '#ff9500'
          }}>
            允许位置访问以获取导航功能
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DestinationMap;