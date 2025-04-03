// /* eslint-disable */

// "use client"

// import React, { useEffect, useState, useRef } from 'react'
// import Globe from 'react-globe.gl';

// // Define TypeScript interfaces
// interface CityData {
//   lat: number;
//   lng: number;
//   text: string;
//   color: string;
//   size: number;
// }

// interface RouteData {
//   startLat: number;
//   startLng: number;
//   endLat: number;
//   endLng: number;
//   color: string;
//   animateDash: boolean;
// }

// const Hero = () => {
//   const [globeReady, setGlobeReady] = useState(false);
//   const globeEl = useRef<any>(null);
  
//   // City data
//    const cityData: CityData[] = [
//     // Americas
//     { lat: 40.7128, lng: -74.0060, text: 'New York, USA', color: 'white', size: 1.5 },
//     { lat: 19.4326, lng: -99.1332, text: 'Mexico City, Mexico', color: 'white', size: 1.5 },
//     { lat: -22.9068, lng: -43.1729, text: 'Rio de Janeiro, Brazil', color: 'white', size: 1.5 },
//     { lat: 37.7749, lng: -122.4194, text: 'San Francisco, USA', color: 'white', size: 1.5 },
//     { lat: -34.6037, lng: -58.3816, text: 'Buenos Aires, Argentina', color: 'white', size: 1.5 },
//     { lat: 43.6532, lng: -79.3832, text: 'Toronto, Canada', color: 'white', size: 1.5 },
//     { lat: 4.7110, lng: -74.0721, text: 'Bogotá, Colombia', color: 'white', size: 1.5 },
//     { lat: 41.8781, lng: -87.6298, text: 'Chicago, USA', color: 'white', size: 1.5 },
    
//     // Europe
//     { lat: 51.5074, lng: -0.1278, text: 'London, UK', color: 'white', size: 1.5 },
//     { lat: 55.7558, lng: 37.6173, text: 'Moscow, Russia', color: 'white', size: 1.5 },
//     { lat: 48.8566, lng: 2.3522, text: 'Paris, France', color: 'white', size: 1.5 },
//     { lat: 41.9028, lng: 12.4964, text: 'Rome, Italy', color: 'white', size: 1.5 },
  
//     { lat: 47.4979, lng: 19.0402, text: 'Budapest, Hungary', color: 'white', size: 1.5 },
    
//     // Asia
//     { lat: 26.9124, lng: 75.7873, text: 'Jaipur, India', color: 'white', size: 1.5 },  // Jaipur
//     { lat: 35.6762, lng: 139.6503, text: 'Tokyo, Japan', color: 'white', size: 1.5 },
//     { lat: 28.6139, lng: 77.2090, text: 'New Delhi, India', color: 'white', size: 1.5 },
//     { lat: 31.2304, lng: 121.4737, text: 'Shanghai, China', color: 'white', size: 1.5 },
//     { lat: 25.2048, lng: 55.2708, text: 'Dubai, UAE', color: 'white', size: 1.5 },
//     { lat: 1.3521, lng: 103.8198, text: 'Singapore', color: 'white', size: 1.5 },
//     { lat: 22.3193, lng: 114.1694, text: 'Hong Kong', color: 'white', size: 1.5 },
//     { lat: 18.9667, lng: 72.8333, text: 'Mumbai, India', color: 'white', size: 1.5 },
    
//     // Africa
//     { lat: -1.2921, lng: 36.8219, text: 'Nairobi, Kenya', color: 'white', size: 1.5 },
//     { lat: 30.0444, lng: 31.2357, text: 'Cairo, Egypt', color: 'white', size: 1.5 },
//     { lat: 33.9716, lng: -6.8498, text: 'Rabat, Morocco', color: 'white', size: 1.5 },
//     { lat: -33.9249, lng: 18.4241, text: 'Cape Town, South Africa', color: 'white', size: 1.5 },
    
//     // Oceania
//     { lat: -33.8688, lng: 151.2093, text: 'Sydney, Australia', color: 'white', size: 1.5 },
//     { lat: -36.8485, lng: 174.7633, text: 'Auckland, New Zealand', color: 'white', size: 1.5 }
//   ];

//   // Generate random routes between cities
//   const generateRoutes = (): RouteData[] => {
//     const routes: RouteData[] = [];
//     cityData.forEach((city, idx) => {
//       const numConnections = 2 + Math.floor(Math.random() * 3);
//       for (let i = 0; i < numConnections; i++) {
//         let targetIdx;
//         do {
//           targetIdx = Math.floor(Math.random() * cityData.length);
//         } while (targetIdx === idx);
        
//         const targetCity = cityData[targetIdx];
//         routes.push({
//           startLat: city.lat,
//           startLng: city.lng,
//           endLat: targetCity.lat,
//           endLng: targetCity.lng,
//           color: `rgba(255, 255, 255, ${0.3 + Math.random() * 0.4})`,
//           animateDash: true
//         });
//       }
//     });
//     return routes;
//   };

//   const [arcsData, setArcsData] = useState<RouteData[]>([]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setGlobeReady(true);
//       setArcsData(generateRoutes());
//     }, 100);

//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (globeReady && globeEl.current) {
//       globeEl.current.pointOfView({ altitude: 2.5 });
//       globeEl.current.controls().autoRotate = true;
//       globeEl.current.controls().autoRotateSpeed = 0.5;
//     }
//   }, [globeReady]);

//   return (
//     <section className="bg-white dark:bg-gray-900 lg:grid lg:h-screen lg:place-content-center">
//       <div className="flex flex-row mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        
//         {/* Left Content */}
//         <div className="max-w-prose">
//           <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">
//             Connect Instantly,  
//             <strong className="text-indigo-600 dark:text-indigo-400"> Anywhere </strong> 
//             in the World
//           </h1>

//           <p className="mt-4 text-base sm:text-lg text-gray-700 dark:text-gray-300">
//             Experience real-time, high-quality video calls with seamless connectivity.  
//             Our platform ensures secure, reliable, and ultra-low latency video communication  
//             so you can stay connected with anyone, anywhere.
//           </p>

//           <div className="mt-4 flex gap-4 sm:mt-6">
//             <a
//               className="inline-block rounded border border-indigo-600 bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
//               href="/dashboard"
//             >
//               Start a Call
//             </a>

            
//           </div>
//         </div>

//         {/* Right Content (Globe) */}
//         <div className="flex justify-end w-full">
//           <div className="rounded-3xl sm:h-[326px] h-fit flex justify-center items-center ml-16">
//             {globeReady && (
//               <Globe
//                 ref={globeEl}
//                 height={600}
//                 width={600}
//                 backgroundColor="rgba(0, 0, 0, 0)"
//                 showAtmosphere
//                 atmosphereColor="rgba(70, 107, 176, 0.5)"
//                 showGraticules={false}
//                 globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg"
                
//                 // Points for cities
//                 pointsData={cityData}
//                 pointAltitude={0.01}
//                 pointRadius={0.6}
//                 pointColor={() => '#ff5555'}
//                 pointsMerge={true}
                
//                 // Labels for cities
//                 labelsData={cityData}
//                 labelSize={1.2}
//                 labelDotRadius={0.4}
//                 labelColor={() => 'white'}
//                 labelResolution={2}
                
//                 // Arcs for connections
//                 arcsData={arcsData}
//                 arcColor="color"
//                 arcDashLength={0.4}
//                 arcDashGap={0.2}
//                 arcDashAnimateTime={3000}
//                 arcStroke={0.5}
//                 arcsTransitionDuration={1000}
                
//                 onGlobeReady={() => console.log('Globe is ready')}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Hero;
