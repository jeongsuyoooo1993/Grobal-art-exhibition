import React, { useRef, useEffect, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import type { MuseumWithExhibitions } from '@/types/database';

interface GlobeIntroProps {
  museums: MuseumWithExhibitions[];
  onExplore: () => void;
  onMuseumClick?: (museumId: number) => void;
}

// 미술관별 위도/경도 좌표
const MUSEUM_COORDINATES: { [key: string]: { lat: number; lng: number } } = {
  'CHINA': { lat: 39.9042, lng: 116.4074 },      // Beijing
  'FRANCE': { lat: 48.8606, lng: 2.3376 },       // Paris (Musée d'Orsay)
  'GERMANY': { lat: 52.5096, lng: 13.3732 },     // Berlin (Neue Nationalgalerie)
  'ITALY': { lat: 43.7687, lng: 11.2569 },       // Florence (Uffizi)
  'JAPAN': { lat: 35.6602, lng: 139.7294 },      // Tokyo (Mori Art Museum)
  'SOUTH KOREA': { lat: 37.5233, lng: 127.0050 }, // Seoul (Leeum)
  'USA': { lat: 40.7794, lng: -73.9632 },        // New York (Met)
  'UK': { lat: 51.5089, lng: -0.0762 },          // London (Tate Modern)
  'SPAIN': { lat: 40.4138, lng: -3.6921 },       // Madrid (Prado)
  'NETHERLANDS': { lat: 52.3600, lng: 4.8852 },  // Amsterdam (Rijksmuseum)
  'AUSTRIA': { lat: 48.2034, lng: 16.3696 },     // Vienna (Kunsthistorisches)
  'RUSSIA': { lat: 59.9398, lng: 30.3146 },      // St. Petersburg (Hermitage)
};

const GlobeIntro: React.FC<GlobeIntroProps> = ({ museums, onExplore, onMuseumClick }) => {
  const globeRef = useRef<any>(null);
  const [hoveredMuseum, setHoveredMuseum] = useState<MuseumWithExhibitions | null>(null);
  const [globeReady, setGlobeReady] = useState(false);
  const [landPoints, setLandPoints] = useState<any[]>([]);

  // 대륙 포인트 데이터 로드 (도트 패턴용)
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/world_population.csv')
      .then(res => res.text())
      .then(csv => {
        const lines = csv.split('\n').slice(1);
        const points = lines
          .map(line => {
            const [lat, lng, pop] = line.split(',');
            return {
              lat: parseFloat(lat),
              lng: parseFloat(lng),
              pop: parseFloat(pop)
            };
          })
          .filter(d => !isNaN(d.lat) && !isNaN(d.lng) && d.pop > 0);
        setLandPoints(points);
      });
  }, []);

  // 미술관 데이터를 지구본 마커 데이터로 변환
  const markersData = useMemo(() => {
    return museums.map(museum => {
      const coords = MUSEUM_COORDINATES[museum.country.toUpperCase()] || { lat: 0, lng: 0 };
      return {
        ...museum,
        lat: coords.lat,
        lng: coords.lng,
      };
    });
  }, [museums]);

  useEffect(() => {
    if (globeRef.current && globeReady) {
      // 초기 카메라 위치 설정
      globeRef.current.pointOfView({ lat: 20, lng: 30, altitude: 2.5 }, 0);
      
      // 자동 회전
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.4;
      globeRef.current.controls().enableZoom = true;
      globeRef.current.controls().minDistance = 150;
      globeRef.current.controls().maxDistance = 500;
    }
  }, [globeReady]);

  // 마커 클릭 핸들러
  const handleMarkerClick = (point: any) => {
    if (point && onMuseumClick) {
      onMuseumClick(point.id);
      onExplore();
    }
  };

  // 별 배경 생성
  const stars = useMemo(() => {
    const starArray = [];
    for (let i = 0; i < 200; i++) {
      starArray.push({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.7 + 0.3,
        delay: Math.random() * 3
      });
    }
    return starArray;
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Starry Background */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.delay}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      {/* Globe Container */}
      <div className="absolute inset-0">
        <Globe
          ref={globeRef}
          backgroundColor="rgba(0,0,0,0)"
          showGlobe={true}
          showAtmosphere={true}
          atmosphereColor="rgba(255,255,255,0.1)"
          atmosphereAltitude={0.15}
          globeImageUrl=""
          hexBinPointsData={landPoints}
          hexBinPointLat="lat"
          hexBinPointLng="lng"
          hexBinPointWeight="pop"
          hexBinResolution={3}
          hexAltitude={0.005}
          hexTopColor={() => 'rgba(255,255,255,0.8)'}
          hexSideColor={() => 'rgba(255,255,255,0.3)'}
          hexBinMerge={true}
          hexPolygonsData={markersData}
          hexPolygonResolution={3}
          hexPolygonMargin={0.3}
          hexPolygonAltitude={0.02}
          hexPolygonColor={() => '#00ff88'}
          onHexPolygonHover={(polygon: any) => {
            if (polygon) {
              setHoveredMuseum(polygon as MuseumWithExhibitions);
              if (globeRef.current) {
                globeRef.current.controls().autoRotate = false;
              }
              document.body.style.cursor = 'pointer';
            } else {
              setHoveredMuseum(null);
              if (globeRef.current) {
                globeRef.current.controls().autoRotate = true;
              }
              document.body.style.cursor = 'default';
            }
          }}
          onHexPolygonClick={handleMarkerClick}
          htmlElementsData={markersData}
          htmlLat="lat"
          htmlLng="lng"
          htmlAltitude={0.045}
          htmlElement={(d: any) => {
            const el = document.createElement('div');
            el.style.cssText = 'cursor: pointer; pointer-events: auto; z-index: 1000;';
            el.innerHTML = `<div style="
              background-color: rgba(0, 0, 0, 0.3);
              color: #00ff88;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 500;
              white-space: nowrap;
              cursor: pointer;
              text-shadow: 0 0 4px rgba(0, 255, 136, 0.5);
              transition: all 0.2s ease;
              pointer-events: auto;
            ">${d.country}</div>`;
            el.onclick = () => {
              if (onMuseumClick) {
                onMuseumClick(d.id);
                onExplore();
              }
            };
            el.onmouseenter = () => {
              const inner = el.querySelector('div') as HTMLElement;
              if (inner) inner.style.backgroundColor = 'rgba(0, 255, 136, 0.2)';
              if (globeRef.current) {
                globeRef.current.controls().autoRotate = false;
              }
            };
            el.onmouseleave = () => {
              const inner = el.querySelector('div') as HTMLElement;
              if (inner) inner.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
              if (globeRef.current) {
                globeRef.current.controls().autoRotate = true;
              }
            };
            return el;
          }}
          onGlobeReady={() => setGlobeReady(true)}
          width={window.innerWidth}
          height={window.innerHeight}
        />
      </div>

      {/* Hovered Museum Info - 마커 호버 시에만 표시 */}
      {hoveredMuseum && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 bg-black/90 backdrop-blur-sm border border-white/20 px-8 py-5 text-center pointer-events-none">
          <p className="text-white text-xl font-light tracking-wider">{hoveredMuseum.country}</p>
          <p className="text-white/70 text-sm mt-1">{hoveredMuseum.name}</p>
          <p className="text-white/50 text-xs mt-2 uppercase tracking-widest">Click to explore</p>
        </div>
      )}

      {/* Minimal Instructions */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <p className="text-white/30 text-[10px] uppercase tracking-[0.3em]">
          Click on a marker to explore
        </p>
      </div>
    </div>
  );
};

export default GlobeIntro;
