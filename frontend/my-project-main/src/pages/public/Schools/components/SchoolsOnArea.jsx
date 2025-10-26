import React, { useState, useRef, useEffect, useContext } from "react";
import { SchoolsContext } from "../context/SchoolsContext";

import Infinity from "../../../../assets/icons/Infinity.svg";
import mapimg from "../../../../assets/images/mapimg.png";

// Custom hook for fade-in animation
const useFadeInAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold]);

  return [elementRef, isVisible];
};

// Interactive Region Component
const RegionCard = ({ region, index, isVisible, onRegionClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all duration-500
        transform hover:scale-105 hover:shadow-xl
        ${isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
        }
        ${isHovered ? 'bg-gradient-to-br from-white to-primary/5' : ''}
      `}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onRegionClick(region)}
      role="button"
      aria-label={`منطقة ${region.name} - ${region.schoolCount} مدرسة`}
      tabIndex={0}
    >
      <div className="text-center">
        <h3 className={`
          text-lg font-semibold mb-2 transition-colors duration-300
          ${isHovered ? 'text-primary' : 'text-gray-800'}
        `}>
          {region.name}
        </h3>
        
        <div className={`
          text-3xl font-bold mb-1 transition-all duration-300
          ${isHovered ? 'text-secondary scale-110' : 'text-primary'}
        `}>
          {region.schoolCount.toLocaleString()}
        </div>
        
        <p className="text-sm text-gray-600">مدرسة</p>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`
                h-2 rounded-full transition-all duration-1000 ease-out
                ${isHovered ? 'bg-secondary' : 'bg-primary'}
              `}
              style={{ 
                width: `${Math.min((region.schoolCount / 2000) * 100, 100)}%`,
                transitionDelay: `${index * 200}ms`
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Interactive Map Component
const InteractiveMap = ({ data, onRegionClick }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    onRegionClick(region);
  };

  return (
    <div className="relative">
      {/* Map Image */}
      <div className="relative overflow-hidden rounded-xl shadow-lg">
        {!mapLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center min-h-[400px]">
            <div className="text-gray-400 text-6xl">🗺️</div>
          </div>
        )}
        
        <img 
          src={mapimg} 
          alt="خريطة فلسطين تظهر توزيع المدارس حسب المناطق" 
          className={`
            w-full h-auto transition-opacity duration-500 cursor-pointer
            ${mapLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          onLoad={() => setMapLoaded(true)}
          loading="lazy"
        />

        {/* Interactive Hotspots */}
        {mapLoaded && data?.regions && (
          <div className="absolute inset-0">
            {data.regions.map((region, index) => (
              <div
                key={region.name}
                className={`
                  absolute w-6 h-6 bg-primary rounded-full border-2 border-white shadow-lg
                  cursor-pointer transition-all duration-300 transform hover:scale-150
                  ${selectedRegion?.name === region.name ? 'bg-secondary scale-150' : ''}
                `}
                style={{
                  // Mock coordinates - in real app, these would be calculated
                  top: `${30 + index * 15}%`,
                  left: `${20 + index * 20}%`,
                  animationDelay: `${index * 200}ms`
                }}
                onClick={() => handleRegionClick(region)}
                title={`${region.name} - ${region.schoolCount} مدرسة`}
              >
                <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
              </div>
            ))}
          </div>
        )}

        {/* Map Legend */}
        <div className="absolute bottom-4 right-4 bg-white/90 rounded-lg p-3 shadow-md">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">دليل الخريطة</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span>مدارس نشطة</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <span>المنطقة المحددة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Region Info */}
      {selectedRegion && (
        <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20 animate-slideDown">
          <h3 className="text-lg font-semibold text-primary mb-2">
            {selectedRegion.name}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">عدد المدارس:</span>
              <span className="font-bold text-primary mr-2">
                {selectedRegion.schoolCount.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-gray-600">النسبة:</span>
              <span className="font-bold text-secondary mr-2">
                {((selectedRegion.schoolCount / 3142) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          <button 
            onClick={() => setSelectedRegion(null)}
            className="mt-2 text-primary hover:text-secondary text-sm transition-colors duration-300"
          >
            إغلاق
          </button>
        </div>
      )}
    </div>
  );
};

export default function SchoolsOnArea({ data }) {
  const { state, dispatch } = useContext(SchoolsContext) || { state: {}, dispatch: () => {} };
  const [titleRef, isTitleVisible] = useFadeInAnimation(0.2);
  const [mapRef, isMapVisible] = useFadeInAnimation(0.1);
  const [regionsRef, isRegionsVisible] = useFadeInAnimation(0.1);

  // Handle region click
  const handleRegionClick = async (region) => {
    try {
      console.log('Searching schools in region:', region.name);
      
      // Mock search functionality - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const results = {
        schools: [],
        totalCount: region.schoolCount,
        region: region.name
      };
      
      console.log('Region search results:', results);
      
      // Update context if needed
      if (dispatch) {
        dispatch({
          type: 'SET_SELECTED_REGION',
          payload: region
        });
      }
    } catch (error) {
      console.error('Error searching region:', error);
    }
  };

  // Loading state
  if (!data) {
    return (
      <div className="font-cairo bg-white text-black" dir="rtl">
        <section className="py-16 px-4 bg-white">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-8 w-1/2"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="font-cairo bg-white text-black" dir="rtl">
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Animated Title */}
          <div 
            ref={titleRef}
            className={`
              relative w-full pb-8 transition-all duration-1000
              ${isTitleVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
              }
            `}
          >
            <img 
              src={Infinity} 
              alt="رمز اللانهاية" 
              className="transition-transform duration-500 hover:scale-110"
            />
            <h2 className="absolute top-1/2 transform -translate-y-1/2 text-2xl font-cairo font-bold text-secondary z-10 mr-8">
              {data.title || "المدارس حسب المنطقة / المديرية"}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Interactive Map */}
            <div 
              ref={mapRef}
              className={`
                lg:col-span-2 transition-all duration-1000
                ${isMapVisible 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-8'
                }
              `}
            >
              <InteractiveMap 
                data={data} 
                onRegionClick={handleRegionClick}
              />
            </div>

            {/* Regions Statistics */}
            <div 
              ref={regionsRef}
              className={`
                space-y-4 transition-all duration-1000
                ${isRegionsVisible 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-[-8px]'
                }
              `}
            >
              <h3 className="text-xl font-bold text-primary mb-4">
                إحصائيات المناطق
              </h3>
              
              {data.regions?.map((region, index) => (
                <RegionCard
                  key={region.name}
                  region={region}
                  index={index}
                  isVisible={isRegionsVisible}
                  onRegionClick={handleRegionClick}
                />
              ))}

              {/* Total Summary */}
              <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">الإجمالي العام</h4>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">
                    {data.regions?.reduce((sum, region) => sum + region.schoolCount, 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">إجمالي المدارس في فلسطين</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Features Info */}
          <div className={`
            mt-12 text-center transition-all duration-1000
            ${isMapVisible && isRegionsVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
            }
          `}>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">
                كيفية استخدام الخريطة التفاعلية
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                  <span>انقر على النقاط لعرض تفاصيل المنطقة</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 bg-secondary rounded-full"></div>
                  <span>استخدم البطاقات الجانبية للتصفح السريع</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>كل منطقة تحتوي على إحصائيات مفصلة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}